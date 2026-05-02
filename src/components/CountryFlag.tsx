import { getCountryFlag, getCountryFlagCode } from '../utils/countries';

interface CountryFlagProps {
  flag?: string | null;
  countryCode?: string | null;
  country?: string | null;
  gp?: string | null;
  className?: string;
}

const joinClassNames = (...classNames: Array<string | undefined>): string =>
  classNames.filter(Boolean).join(' ');

export const CountryFlag = ({ flag, countryCode, country, gp, className }: CountryFlagProps) => {
  const code = getCountryFlagCode({ flag, countryCode, country, gp });
  const label = country ?? gp ?? code ?? 'pais';
  const classNames = joinClassNames('country-flag', className);

  if (!code) {
    return <span className={classNames} aria-label={label}>{getCountryFlag({ flag, countryCode, country, gp })}</span>;
  }

  const normalizedCode = code.toLowerCase();

  return (
    <img
      className={classNames}
      src={`https://flagcdn.com/24x18/${normalizedCode}.png`}
      srcSet={`https://flagcdn.com/48x36/${normalizedCode}.png 2x`}
      width="24"
      height="18"
      alt={`Bandera de ${label}`}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
    />
  );
};
