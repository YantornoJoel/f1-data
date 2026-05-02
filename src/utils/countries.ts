const flagByCountryCode: Record<string, string> = {
  AE: '????',
  AR: '????',
  AT: '????',
  AU: '????',
  AZ: '????',
  BE: '????',
  BR: '????',
  CA: '????',
  CN: '????',
  DE: '????',
  ES: '????',
  FI: '????',
  FR: '????',
  GB: '????',
  HU: '????',
  IT: '????',
  JP: '????',
  MC: '????',
  MX: '????',
  NL: '????',
  NZ: '????',
  QA: '????',
  SA: '????',
  SG: '????',
  TH: '????',
  US: '????',
};

const codeAliases: Record<string, string> = {
  UK: 'GB',
};

const countryCodeByName: Record<string, string> = {
  'abu dhabi': 'AE',
  argentina: 'AR',
  australia: 'AU',
  austria: 'AT',
  azerbaijan: 'AZ',
  azerbaiyan: 'AZ',
  belgica: 'BE',
  belgium: 'BE',
  brasil: 'BR',
  brazil: 'BR',
  canada: 'CA',
  china: 'CN',
  emiratos: 'AE',
  'emiratos arabes unidos': 'AE',
  espana: 'ES',
  finland: 'FI',
  france: 'FR',
  germany: 'DE',
  'great britain': 'GB',
  hungria: 'HU',
  hungary: 'HU',
  italia: 'IT',
  italy: 'IT',
  japon: 'JP',
  japan: 'JP',
  mexico: 'MX',
  monaco: 'MC',
  netherlands: 'NL',
  'new zealand': 'NZ',
  'paises bajos': 'NL',
  qatar: 'QA',
  'reino unido': 'GB',
  'saudi arabia': 'SA',
  singapur: 'SG',
  singapore: 'SG',
  spain: 'ES',
  thailand: 'TH',
  'united arab emirates': 'AE',
  'united kingdom': 'GB',
  uk: 'GB',
  'estados unidos': 'US',
  'united states': 'US',
  usa: 'US',
};

const countryCodeByGrandPrixName: Record<string, string> = {
  'barcelona-catalunya': 'ES',
  barcelona: 'ES',
  madrid: 'ES',
  miami: 'US',
  'las vegas': 'US',
  austin: 'US',
  'united states': 'US',
  silverstone: 'GB',
  'great britain': 'GB',
  'spa-francorchamps': 'BE',
  belgium: 'BE',
  zandvoort: 'NL',
  jeddah: 'SA',
  'yas island': 'AE',
  'abu dhabi': 'AE',
  imola: 'IT',
  monza: 'IT',
  melbourne: 'AU',
  baku: 'AZ',
  budapest: 'HU',
  monaco: 'MC',
  montreal: 'CA',
  canada: 'CA',
  mexico: 'MX',
  lusail: 'QA',
  qatar: 'QA',
  singapore: 'SG',
  spielberg: 'AT',
  austria: 'AT',
  china: 'CN',
  japan: 'JP',
  brazil: 'BR',
};

const normalize = (value?: string | null): string => value?.trim().toLowerCase() ?? '';
const isCountryCode = (value: string): boolean => /^[A-Z]{2}$/.test(value.trim());
const normalizeCountryCode = (countryCode?: string | null): string | undefined => {
  const code = countryCode?.trim().toUpperCase();
  if (!code || !isCountryCode(code)) return undefined;
  return codeAliases[code] ?? code;
};

export const countryFlagByCode = (countryCode?: string | null): string | undefined => {
  const code = normalizeCountryCode(countryCode);
  return code ? flagByCountryCode[code] : undefined;
};

export const getCountryFlagCode = ({
  flag,
  countryCode,
  country,
  gp,
}: {
  flag?: string | null;
  countryCode?: string | null;
  country?: string | null;
  gp?: string | null;
}): string | undefined => {
  const normalizedCountryCode = normalizeCountryCode(countryCode);
  if (normalizedCountryCode && flagByCountryCode[normalizedCountryCode]) return normalizedCountryCode;

  const normalizedFlagCode = flag && isCountryCode(flag) ? normalizeCountryCode(flag) : undefined;
  if (normalizedFlagCode && flagByCountryCode[normalizedFlagCode]) return normalizedFlagCode;

  const countryNameCode = countryCodeByName[normalize(country)];
  if (countryNameCode) return countryNameCode;

  return countryCodeByGrandPrixName[normalize(gp)];
};

export const getCountryFlag = (input: {
  flag?: string | null;
  countryCode?: string | null;
  country?: string | null;
  gp?: string | null;
}): string => {
  const { flag } = input;
  if (flag && !isCountryCode(flag) && flag !== '??') return flag;

  const code = getCountryFlagCode(input);
  return (code ? flagByCountryCode[code] : undefined) ?? '??';
};
