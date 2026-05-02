import { useState } from 'react';
import type { DriverProfile, DriverStanding, Series } from '../domain/f1';
import { getInitials, getTeamColor } from '../utils/format';

interface DriverWithStanding extends DriverProfile { points: number; position: number; }
interface StandingsTableProps { f1Standings: DriverStanding[]; f2Standings: DriverStanding[]; f1Drivers: DriverWithStanding[]; f2Drivers: DriverWithStanding[]; }

const DriverAvatar = ({ driver }: { driver?: DriverWithStanding }) => driver?.driver_image_url ? <img className="standing-avatar" src={driver.driver_image_url} alt={`Foto de ${driver.driver}`} loading="lazy" /> : <span className="standing-avatar standing-avatar--fallback">{getInitials(driver?.driver ?? '')}</span>;

export const StandingsTable = ({ f1Standings, f2Standings, f1Drivers, f2Drivers }: StandingsTableProps) => {
  const [series, setSeries] = useState<Series>('formula1');
  const standings = series === 'formula1' ? f1Standings : f2Standings;
  const drivers = series === 'formula1' ? f1Drivers : f2Drivers;
  const profiles = new Map(drivers.map((driver) => [driver.driver, driver]));
  const leaderPoints = standings[0]?.points ?? 0;
  return <section className="app-section app-section--split" id="clasificacion">
    <div className="standings-copy"><span className="eyebrow">Campeonato de pilotos</span><h2>Tabla de clasificación</h2><p>Alterná F1/F2 y mirá puntos, equipo y foto del piloto. Si no hay foto confiable, usamos iniciales.</p><div className="championship-toggle"><button type="button" className={series === 'formula1' ? 'is-active' : ''} onClick={() => setSeries('formula1')}>F1</button><button type="button" className={series === 'formula2' ? 'is-active' : ''} onClick={() => setSeries('formula2')}>F2</button></div></div>
    <div className="standings-panel">{standings.map((standing) => { const percentage = leaderPoints === 0 ? 0 : (standing.points / leaderPoints) * 100; const profile = profiles.get(standing.driver); return <article className="standing-row" key={`${series}-${standing.driver}`}><span className="standing-row__position">#{standing.position}</span><DriverAvatar driver={profile} /><div className="standing-row__main"><div><strong>{standing.driver}</strong><span>{standing.team}</span></div><div className="points-bar" aria-hidden="true"><i style={{ width: `${percentage}%`, backgroundColor: getTeamColor(standing.team) }} /></div></div><strong className="standing-row__points">{standing.points}</strong></article>; })}</div>
  </section>;
};
