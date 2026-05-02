import type { CSSProperties } from 'react';
import type { ConstructorStanding } from '../domain/f1';
import { getInitials, getTeamColor } from '../utils/format';

interface ConstructorWithLogo extends ConstructorStanding {
  logoUrl: string | null;
}

interface ConstructorsStandingsProps {
  constructors: ConstructorWithLogo[];
}

type TeamColorStyle = CSSProperties & { '--team-color': string };

const TeamLogo = ({ constructor }: { constructor: ConstructorWithLogo }) =>
  constructor.logoUrl ? (
    <span className="constructor-logo">
      <img src={constructor.logoUrl} alt={`Logo de ${constructor.team}`} loading="lazy" />
    </span>
  ) : (
    <span className="constructor-logo constructor-logo--fallback">{getInitials(constructor.team)}</span>
  );

export const ConstructorsStandings = ({ constructors }: ConstructorsStandingsProps) => {
  const leaderPoints = constructors[0]?.points ?? 0;

  return (
    <section className="app-section app-section--split constructors-section" aria-labelledby="constructores-title">
      <div className="standings-copy">
        <span className="eyebrow">Campeonato de constructores</span>
        <h2 id="constructores-title">Escuderías</h2>
        <p>
          Puntos oficiales de constructores, ordenados de mayor a menor.
        </p>
      </div>

      <div className="standings-panel constructors-panel">
        {constructors.map((constructor) => {
          const percentage = leaderPoints === 0 ? 0 : (constructor.points / leaderPoints) * 100;

          return (
            <article className="constructor-row" key={constructor.team} style={{ '--team-color': getTeamColor(constructor.team) } as TeamColorStyle}>
              <span className="standing-row__position">#{constructor.position}</span>
              <TeamLogo constructor={constructor} />
              <div className="standing-row__main">
                <div>
                  <strong>{constructor.team}</strong>
                  <span>{constructor.points} pts</span>
                </div>
                <div className="points-bar" aria-hidden="true">
                  <i style={{ width: `${percentage}%`, backgroundColor: getTeamColor(constructor.team) }} />
                </div>
              </div>
              <strong className="standing-row__points">{constructor.points}</strong>
            </article>
          );
        })}
      </div>
    </section>
  );
};
