import { useMemo, useState } from 'react';
import type { EnrichedEvent, SessionKey } from '../domain/f1';
import { CountryFlag } from './CountryFlag';
import { formatArgentinaDateTime, formatCalendarOptionDate, getSessionEntries, getSessionLabel, zonedSessionToDate } from '../utils/dates';

interface CalendarSectionProps { f1Events: EnrichedEvent[]; f2Events: EnrichedEvent[]; }
const PAGE_SIZE = 6;

const SeriesBadge = ({ series }: { series: EnrichedEvent['series'] }) => <span className={`series-badge ${series === 'formula1' ? 'series-badge--f1' : 'series-badge--f2'}`}>{series === 'formula1' ? 'F1' : 'F2'}</span>;

const EventCard = ({ event }: { event: EnrichedEvent }) => {
  const sessions = getSessionEntries(event.sessions as Partial<Record<SessionKey, { date: string; time: string }>>);
  return <article className="event-card">
    <div className="event-card__topline"><SeriesBadge series={event.series} /><span>Fecha {event.round}</span></div>
    <h3><CountryFlag className="event-card__flag" flag={event.flag} countryCode={event.country_code} country={event.country} gp={event.gp} />{event.gp}</h3>
    <p className="event-card__name">{event.official_name ?? event.country}</p>
    <div className="event-card__race"><span>{getSessionLabel(event.primarySessionKey)}</span><strong>{formatArgentinaDateTime(event.primaryInstant)}</strong></div>
    <ul className="session-list">{sessions.map(([key, session]) => <li key={key}><span>{getSessionLabel(key)}</span><strong>{formatArgentinaDateTime(zonedSessionToDate(session, event.timezone))}</strong></li>)}</ul>
  </article>;
};

const CalendarPager = ({ title, dot, events }: { title: string; dot: string; events: EnrichedEvent[] }) => {
  const [page, setPage] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState('all');
  const filteredEvents = useMemo(
    () => (selectedEvent === 'all' ? events : events.filter((event) => `${event.series}-${event.round}` === selectedEvent)),
    [events, selectedEvent],
  );
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE));
  const visibleEvents = useMemo(() => filteredEvents.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE), [filteredEvents, page]);
  const goTo = (nextPage: number) => setPage(Math.min(Math.max(nextPage, 0), totalPages - 1));
  const isFiltered = selectedEvent !== 'all';

  return <div className="calendar-column">
    <div className="column-title"><span className={`series-dot ${dot}`} /><h3>{title}</h3></div>
    <label className="race-filter">
      <span>Filtrar por fecha</span>
      <select value={selectedEvent} onChange={(event) => { setSelectedEvent(event.target.value); setPage(0); }}>
        <option value="all">Todas las fechas</option>
        {events.map((event) => (
          <option key={`${event.series}-${event.round}`} value={`${event.series}-${event.round}`}>
            {`Jornada ${event.round} - ${event.gp} - ${formatCalendarOptionDate(event.primaryInstant)}`}
          </option>
        ))}
      </select>
    </label>
    <div className="cards-grid cards-grid--events">{visibleEvents.map((event) => <EventCard key={`${event.series}-${event.round}`} event={event} />)}</div>
    {!isFiltered && totalPages > 1 ? <div className="pagination" aria-label={`Paginación ${title}`}>
      <button type="button" className="ghost-button" disabled={page === 0} onClick={() => goTo(page - 1)}>Anterior</button>
      <span>{page + 1} / {totalPages}</span>
      <button type="button" className="ghost-button" disabled={page >= totalPages - 1} onClick={() => goTo(page + 1)}>Siguiente</button>
    </div> : null}
  </div>;
};

export const CalendarSection = ({ f1Events, f2Events }: CalendarSectionProps) => <section className="app-section" id="calendario"><div className="schedule-grid"><CalendarPager title="Próximas carreras F1" dot="series-dot--f1" events={f1Events} /><CalendarPager title="Próximas carreras F2" dot="series-dot--f2" events={f2Events} /></div></section>;
