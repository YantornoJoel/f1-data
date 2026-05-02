import { useMemo, useState } from 'react';
import type { EventResult, ResultSessionType, Series } from '../domain/f1';
import { getTeamColor } from '../utils/format';
import { CountryFlag } from './CountryFlag';

interface ResultsSectionProps { f1Results: EventResult[]; f2Results: EventResult[]; }
const TOP_RESULTS_LIMIT = 5;
const EXPANDED_RESULTS_PAGE_SIZE = 11;
const sessionLabels: Record<ResultSessionType, string> = { race:'Carrera', qualifying:'Clasificación', sprint:'Sprint', sprintQualifying:'Clasificación Sprint', featureRace:'Carrera principal' };
const sessionOrder: ResultSessionType[] = ['race', 'qualifying', 'sprint', 'sprintQualifying', 'featureRace'];
const Position = ({ position, status }: { position: number | null; status: string }) => <span className={`result-position ${position === 1 ? 'result-position--winner' : ''}`}>{position ?? status}</span>;
const isQualifyingSession = (type: ResultSessionType | undefined) => type === 'qualifying' || type === 'sprintQualifying';

const RaceResultCard = ({ race }: { race: EventResult }) => {
  const sessions = useMemo(() => [...race.sessions].sort((left, right) => sessionOrder.indexOf(left.type) - sessionOrder.indexOf(right.type)), [race.sessions]);
  const defaultType = sessions.find((session) => session.status === 'completed' && session.results.length > 0)?.type ?? sessions.find((session) => session.type === 'race')?.type ?? sessions[0]?.type ?? 'race';
  const [selectedType, setSelectedType] = useState<ResultSessionType>(defaultType);
  const [expandedBySession, setExpandedBySession] = useState<Record<string, boolean>>({});
  const [pageBySession, setPageBySession] = useState<Record<string, number>>({});
  const selectedSession = useMemo(() => sessions.find((session) => session.type === selectedType) ?? sessions[0], [sessions, selectedType]);
  const sessionStateKey = `${race.series}-${race.round}-${selectedSession?.type ?? selectedType}`;
  const isExpanded = expandedBySession[sessionStateKey] ?? false;
  const currentPage = pageBySession[sessionStateKey] ?? 1;
  const totalResults = selectedSession?.results.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalResults / EXPANDED_RESULTS_PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const visibleResults = isExpanded
    ? selectedSession?.results.slice((safePage - 1) * EXPANDED_RESULTS_PAGE_SIZE, safePage * EXPANDED_RESULTS_PAGE_SIZE) ?? []
    : selectedSession?.results.slice(0, TOP_RESULTS_LIMIT) ?? [];
  const canToggleResults = (selectedSession?.results.length ?? 0) > TOP_RESULTS_LIMIT;
  const winner = selectedSession?.results[0];
  const setExpandedMode = (expanded: boolean) => {
    setExpandedBySession((current) => ({ ...current, [sessionStateKey]: expanded }));
    setPageBySession((current) => ({ ...current, [sessionStateKey]: 1 }));
  };
  const goToPage = (page: number) => {
    setPageBySession((current) => ({ ...current, [sessionStateKey]: Math.min(Math.max(page, 1), totalPages) }));
  };
  return <article className="result-card">
    <div className="result-card__summary"><div><span className="eyebrow">Fecha {race.round}</span><h3><CountryFlag flag={race.flag} country={race.country} gp={race.gp} /> {race.gp}</h3><p>{winner ? <>{isQualifyingSession(selectedSession?.type) ? 'Mejor tiempo' : 'Ganador'}: <strong>{winner.driver}</strong> · {winner.team} · {winner.time}</> : 'Pendiente'}</p></div></div>
    <div className="session-toggle">{sessions.map((session) => <button key={session.type} type="button" className={session.type === selectedType ? 'is-active' : ''} onClick={() => setSelectedType(session.type)}>{sessionLabels[session.type]}</button>)}</div>
    {selectedSession?.status === 'pending' || selectedSession?.results.length === 0 ? <p className="pending-note">Sesión pendiente. Cuando haya resultado oficial, se carga acá.</p> : <><div className="table-scroll"><table className={`results-table ${isQualifyingSession(selectedSession?.type) ? 'results-table--qualifying' : ''}`}><thead><tr><th>Pos</th><th>Piloto</th><th>Equipo</th>{isQualifyingSession(selectedSession?.type) ? <><th>Q1</th><th>Q2</th><th>Q3</th></> : <><th>Pts</th><th>Tiempo/Dif.</th></>}<th>Vueltas</th></tr></thead><tbody>{visibleResults.map((row) => <tr key={`${race.series}-${race.round}-${selectedSession.type}-${row.driver}`} title={row.note}><td><Position position={row.position} status={row.status} /></td><td>{row.driver}</td><td><span className="team-cell"><i style={{ backgroundColor: getTeamColor(row.team) }} />{row.team}</span></td>{isQualifyingSession(selectedSession.type) ? <><td>{row.q1 ?? '—'}</td><td>{row.q2 ?? '—'}</td><td>{row.q3 ?? '—'}</td></> : <><td>{row.points}</td><td>{row.time || '—'}</td></>}<td>{row.laps ?? '—'}</td></tr>)}</tbody></table></div>{isExpanded && totalPages > 1 ? <div className="results-pagination" aria-label="Paginación de resultados"><button type="button" className="ghost-button" onClick={() => goToPage(safePage - 1)} disabled={safePage === 1}>Anterior</button><span>Página {safePage} de {totalPages}</span><button type="button" className="ghost-button" onClick={() => goToPage(safePage + 1)} disabled={safePage === totalPages}>Siguiente</button></div> : null}{canToggleResults ? <button type="button" className="results-toggle ghost-button" onClick={() => setExpandedMode(!isExpanded)}>{isExpanded ? 'Ver menos' : 'Ver más'}</button> : null}</>}
  </article>;
};

export const ResultsSection = ({ f1Results, f2Results }: ResultsSectionProps) => {
  const [series, setSeries] = useState<Series>('formula1');
  const results = series === 'formula1' ? f1Results : f2Results;
  return <section className="app-section" id="resultados"><div className="championship-toggle" role="tablist" aria-label="Categoría de resultados"><button type="button" className={series === 'formula1' ? 'is-active' : ''} onClick={() => setSeries('formula1')}>F1</button><button type="button" className={series === 'formula2' ? 'is-active' : ''} onClick={() => setSeries('formula2')}>F2</button></div><div className="cards-grid">{results.map((race) => <RaceResultCard key={`${race.series}-${race.round}`} race={race} />)}</div></section>;
};
