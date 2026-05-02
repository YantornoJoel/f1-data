import type { CSSProperties } from 'react';
import { useState } from 'react';
import type { DriverProfile, Series } from '../domain/f1';
import { CountryFlag } from './CountryFlag';
import { calculateAge } from '../utils/dates';
import { getInitials, getTeamColor } from '../utils/format';

interface DriverWithStanding extends DriverProfile { points: number; position: number; }
interface DriversGridProps { f1Drivers: DriverWithStanding[]; f2Drivers: DriverWithStanding[]; }

const DriverImage = ({ driver }: { driver: DriverWithStanding }) => driver.driver_image_url ? <img src={driver.driver_image_url} alt={`Foto de ${driver.driver}`} loading="lazy" /> : <div className="driver-fallback">{getInitials(driver.driver)}</div>;
const TeamLogo = ({ driver }: { driver: DriverWithStanding }) => <div className="team-logo-plate">{driver.team_logo_url ? <img src={driver.team_logo_url} alt={`Logo de ${driver.team}`} loading="lazy" /> : <span className="team-logo-fallback">{driver.team}</span>}</div>;
const groupByTeam = (drivers: DriverWithStanding[]) => drivers.reduce<Record<string, DriverWithStanding[]>>((acc, driver) => { acc[driver.team] = [...(acc[driver.team] ?? []), driver]; return acc; }, {});
const AGE_REFERENCE_DATE = new Date('2026-05-02T12:00:00-03:00');

export const DriversGrid = ({ f1Drivers, f2Drivers }: DriversGridProps) => {
  const [series, setSeries] = useState<Series>('formula1');
  const drivers = series === 'formula1' ? f1Drivers : f2Drivers;
  const teams = Object.entries(groupByTeam(drivers)).sort(([left], [right]) => left.localeCompare(right));
  return <section className="app-section" id="pilotos"><div className="championship-toggle"><button type="button" className={series === 'formula1' ? 'is-active' : ''} onClick={() => setSeries('formula1')}>F1</button><button type="button" className={series === 'formula2' ? 'is-active' : ''} onClick={() => setSeries('formula2')}>F2</button></div><div className="team-grid">{teams.map(([team, teamDrivers]) => <article className="team-card" key={`${series}-${team}`} style={{ '--team-color': getTeamColor(team) } as CSSProperties}><div className="team-card__header"><h3>{team}</h3></div><div className="team-card__drivers">{teamDrivers.map((driver) => {
    const age = calculateAge(driver.dateOfBirth, AGE_REFERENCE_DATE);

    return <div className="driver-card driver-card--compact" key={driver.driver}><div className="driver-card__image"><DriverImage driver={driver} /></div><div className="driver-card__body"><h3>{driver.driver}</h3><div className="driver-card__team"><TeamLogo driver={driver} /></div><div className="driver-card__meta"><span><CountryFlag country={driver.nationality} countryCode={driver.nationality_code} /> {driver.nationality ?? 'Nacionalidad a confirmar'}</span><span>{age ?? '—'} años</span></div></div></div>;
  })}</div></article>)}</div></section>;
};
