export const F1CarHero = () => (
  <div className="f1-hero-car" aria-hidden="true">
    <div className="f1-hero-car__speed-lines">
      <span />
      <span />
      <span />
    </div>
    <svg className="f1-hero-car__svg" viewBox="0 0 560 190" role="img">
      <defs>
        <linearGradient id="carBodyGradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#ff3b30" />
          <stop offset="52%" stopColor="#e10600" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
        <filter id="carGlow" x="-20%" y="-35%" width="140%" height="170%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path className="f1-hero-car__shadow" d="M55 151 C140 132 413 129 510 151" />
      <path className="f1-hero-car__floor" d="M42 138 H523" />
      <path className="f1-hero-car__wing" d="M36 97 H118 L144 123 H54 Z" />
      <path className="f1-hero-car__rear-wing" d="M438 66 H524 L508 96 H431 Z" />
      <path className="f1-hero-car__body" d="M126 117 C165 82 213 70 278 78 L351 87 L431 112 L501 118 L514 134 L331 135 C302 109 256 105 222 135 H111 C99 135 98 125 126 117 Z" />
      <path className="f1-hero-car__cockpit" d="M249 73 C273 43 316 50 346 84 L286 84 C271 84 260 80 249 73 Z" />
      <path className="f1-hero-car__halo" d="M259 76 C286 43 329 58 356 92" />
      <path className="f1-hero-car__nose" d="M83 116 C145 111 203 104 263 96" />
      <circle className="f1-hero-car__wheel" cx="176" cy="137" r="34" />
      <circle className="f1-hero-car__wheel" cx="397" cy="137" r="38" />
      <circle className="f1-hero-car__rim" cx="176" cy="137" r="15" />
      <circle className="f1-hero-car__rim" cx="397" cy="137" r="17" />
      <path className="f1-hero-car__accent" d="M167 101 C232 92 306 95 413 119" />
    </svg>
  </div>
);
