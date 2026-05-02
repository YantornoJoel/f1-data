import type { ConstructorStanding, DriverProfile, DriverStanding, EnrichedEvent, EventResult, F1Data, GrandPrix, RaceResult, Series, SessionKey } from './f1';
import { getCountryFlag } from '../utils/countries';
import { zonedSessionToDate } from '../utils/dates';

const primarySessionBySeries: Record<Series, SessionKey> = {
  formula1: 'race',
  formula2: 'feature_race',
};

const getSeriesEvents = (data: F1Data, series: Series): GrandPrix[] => data[series].grand_prix;

export const getSeriesTimezone = (data: F1Data, series: Series, event: GrandPrix): string => {
  if (event.timezone) return event.timezone;
  return data[series].timezone === 'event_local_time' ? 'UTC' : data[series].timezone;
};

export const enrichEvents = (data: F1Data, series: Series): EnrichedEvent[] =>
  getSeriesEvents(data, series).map((event) => {
    const primarySessionKey = primarySessionBySeries[series];
    const primarySession = event.sessions[primarySessionKey];
    const timezone = getSeriesTimezone(data, series, event);

    return {
      ...event,
      flag: getCountryFlag({ flag: event.flag, countryCode: event.country_code, country: event.country, gp: event.gp }),
      series,
      timezone,
      primarySessionKey,
      primarySession,
      primaryInstant: zonedSessionToDate(primarySession, timezone),
    };
  });

export const getUpcomingEvents = (data: F1Data, series: Series, referenceDate: Date): EnrichedEvent[] =>
  enrichEvents(data, series)
    .filter((event) => !event.primaryInstant || event.primaryInstant >= referenceDate)
    .sort((left, right) => (left.primaryInstant?.getTime() ?? Number.MAX_SAFE_INTEGER) - (right.primaryInstant?.getTime() ?? Number.MAX_SAFE_INTEGER));

const eventByRound = (events: GrandPrix[]) => new Map(events.map((event) => [event.round, event]));

const raceResultToEventResult = (data: F1Data, result: RaceResult): EventResult => {
  const event = eventByRound(data.formula1.grand_prix).get(result.round);
  return {
    series: 'formula1',
    round: result.round,
    gp: result.gp,
    country: event?.country,
    flag: getCountryFlag({ flag: event?.flag, countryCode: event?.country_code, country: event?.country, gp: result.gp }),
    date: result.race_date,
    sessions: [
      {
        type: 'race',
        status: 'completed',
        source_url: result.source_url,
        results: result.results,
      },
    ],
  };
};

export const getCompletedResults = (data: F1Data, series: Series, referenceDate: Date): EventResult[] => {
  const eventsByRound = eventByRound(data[series].grand_prix);
  const configured = (data[series].session_results ?? []).map((result) => {
    const event = eventsByRound.get(result.round);

    return {
      ...result,
      country: result.country ?? event?.country,
      flag: getCountryFlag({
        flag: result.flag ?? event?.flag,
        countryCode: event?.country_code,
        country: result.country ?? event?.country,
        gp: result.gp,
      }),
    };
  });
  const legacy = series === 'formula1' ? data.formula1.race_results.map((result) => raceResultToEventResult(data, result)) : [];
  const byKey = new Map([...legacy, ...configured].map((result) => [`${result.series}-${result.round}`, result]));

  return [...byKey.values()]
    .filter((result) => new Date(`${result.date}T00:00:00-03:00`) <= referenceDate)
    .sort((left, right) => right.round - left.round);
};

export const getCompletedF1Results = (data: F1Data, referenceDate: Date): RaceResult[] =>
  data.formula1.race_results
    .filter((result) => new Date(`${result.race_date}T23:59:59-03:00`) < referenceDate)
    .sort((left, right) => right.round - left.round);

export const getDriverStandings = (data: F1Data, series: Series = 'formula1'): DriverStanding[] =>
  [...(series === 'formula1' ? data.formula1_standings.drivers : data.formula2_standings?.drivers ?? [])].sort((left, right) => left.position - right.position);

export const getConstructorStandings = (data: F1Data): ConstructorStanding[] =>
  [...(data.formula1_standings.constructors ?? [])].sort((left, right) => right.points - left.points || left.position - right.position);

const getDriverProfiles = (data: F1Data, series: Series): DriverProfile[] => (series === 'formula1' ? data.formula1_drivers : data.formula2_drivers ?? []);

export const getConstructorsWithLogo = (data: F1Data): Array<ConstructorStanding & { logoUrl: string | null }> => {
  const logoByTeam = new Map(data.formula1_drivers.map((driver) => [driver.team, driver.team_logo_url]));

  return getConstructorStandings(data).map((constructor) => ({
    ...constructor,
    logoUrl: logoByTeam.get(constructor.team) ?? null,
  }));
};

export const getDriversWithStanding = (data: F1Data, series: Series = 'formula1'): Array<DriverProfile & { points: number; position: number }> => {
  const standingsByDriver = new Map(getDriverStandings(data, series).map((standing) => [standing.driver, standing]));

  return getDriverProfiles(data, series)
    .map((driver) => {
      const standing = standingsByDriver.get(driver.driver);

      return {
        ...driver,
        points: standing?.points ?? 0,
        position: standing?.position ?? 999,
      };
    })
    .sort((left, right) => left.team.localeCompare(right.team) || left.position - right.position);
};

export const getNextEvent = (data: F1Data, referenceDate: Date): EnrichedEvent | undefined =>
  getUpcomingEvents(data, 'formula1', referenceDate)[0];

export const getLeader = (data: F1Data, series: Series = 'formula1'): DriverStanding | undefined => getDriverStandings(data, series)[0];

export const getRaceByRound = (data: F1Data, round: number): GrandPrix | undefined =>
  data.formula1.grand_prix.find((event) => event.round === round);

