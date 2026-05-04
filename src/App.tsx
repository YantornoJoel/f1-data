import { CalendarSection } from './components/CalendarSection';
import { ConstructorsStandings } from './components/ConstructorsStandings';
import { CountryFlag } from './components/CountryFlag';
import { DriversGrid } from './components/DriversGrid';
import { F1CarHero } from './components/F1CarHero';
import { ResultsSection } from './components/ResultsSection';
import { SectionHeader } from './components/SectionHeader';
import { StandingsTable } from './components/StandingsTable';
import { StatCard } from './components/StatCard';
import { f1Data } from './data/f1Data';
import { getCompletedResults, getConstructorsWithLogo, getDriverStandings, getDriversWithStanding, getLeader, getNextEvent, getUpcomingEvents } from './domain/selectors';
import { formatArgentinaDateTime } from './utils/dates';
import { getTeamColor, pluralize } from './utils/format';
import './index.css';

const REFERENCE_DATE = new Date();

const App = () => {
  const nextF1Event = getNextEvent(f1Data, REFERENCE_DATE);
  const championshipLeader = getLeader(f1Data);
  const upcomingF1Events = getUpcomingEvents(f1Data, 'formula1', REFERENCE_DATE);
  const upcomingF2Events = getUpcomingEvents(f1Data, 'formula2', REFERENCE_DATE);
  const completedF1Results = getCompletedResults(f1Data, 'formula1', REFERENCE_DATE);
  const completedF2Results = getCompletedResults(f1Data, 'formula2', REFERENCE_DATE);
  const f1Standings = getDriverStandings(f1Data, 'formula1');
  const f2Standings = getDriverStandings(f1Data, 'formula2');
  const f1Drivers = getDriversWithStanding(f1Data, 'formula1');
  const f2Drivers = getDriversWithStanding(f1Data, 'formula2');
  const constructors = getConstructorsWithLogo(f1Data);

  return (
    <main className="app-shell">
      <section className="hero">
        <F1CarHero />
        <div className="hero__content">
          <span className="eyebrow">Temporada {f1Data.meta.season} - actualizado {f1Data.meta.generated_on}</span>
          <h1>Panel F1 2026</h1>
          <p>
            Calendario, resultados, campeonato y parrilla de pilotos para seguir la temporada.
          </p>
          <div className="hero__actions">
            <a href="#calendario" className="primary-button">Ver calendario</a>
            <a href="#resultados" className="secondary-button">Resultados</a>
          </div>
        </div>

        <div className="hero-card">
          <span className="hero-card__label">Próxima carrera F1</span>
          <h2>{nextF1Event ? <><CountryFlag flag={nextF1Event.flag} countryCode={nextF1Event.country_code} country={nextF1Event.country} gp={nextF1Event.gp} /> {nextF1Event.gp}</> : 'A confirmar'}</h2>
          <p>{formatArgentinaDateTime(nextF1Event?.primaryInstant ?? null)} hs Argentina</p>
          <div className="hero-card__meta">
            <span>Fecha {nextF1Event?.round ?? '—'}</span>
            <span>{nextF1Event?.official_name ?? 'Calendario a confirmar'}</span>
          </div>
        </div>
      </section>

      <section className="stats-grid" aria-label="Resumen de temporada">
        <StatCard label="Próximas F1" value={String(upcomingF1Events.length)} />
        <StatCard label="Próximas F2" value={String(upcomingF2Events.length)} accent="#00a1e8" />
        <StatCard label="GP con resultados" value={pluralize(completedF1Results.length, 'fecha')} accent="#22c55e" />
        <StatCard
          label="Líder F1"
          value={championshipLeader ? `${championshipLeader.driver} · ${championshipLeader.points} pts` : '—'}
          accent={championshipLeader ? getTeamColor(championshipLeader.team) : '#e10600'}
        />
      </section>

      <SectionHeader
        eyebrow="Calendario"
        title="Próximas fechas"
        description="Las carreras finalizadas se muestran en la sección de Resultados"
      />
      <CalendarSection f1Events={upcomingF1Events} f2Events={upcomingF2Events} />

      <SectionHeader
        eyebrow="Resultados"
        title="Sesiones disputadas"
        description="Alterná entre F1 y F2. Si una sesión todavía no terminó, queda marcada como pendiente."
      />
      <ResultsSection f1Results={completedF1Results} f2Results={completedF2Results} />

      <StandingsTable f1Standings={f1Standings} f2Standings={f2Standings} f1Drivers={f1Drivers} f2Drivers={f2Drivers} />
      <ConstructorsStandings constructors={constructors} />

      <SectionHeader
        eyebrow="Parrilla"
        title="Pilotos agrupados por escudería"
        description="Cada dupla aparece junta por equipo para entender rápido cómo queda armada la grilla. Sin puntos: esto es parrilla, no tabla."
      />
      <DriversGrid f1Drivers={f1Drivers} f2Drivers={f2Drivers} />

      <footer className="app-footer">
        <span>Horarios Argentinos -  Joel Yantorno</span>
      </footer>
    </main>
  );
};

export default App;
