export const teamColors: Record<string, string> = {
  Mercedes: '#00d2be',
  Ferrari: '#dc0000',
  McLaren: '#ff8700',
  'Red Bull Racing': '#3671c6',
  'Haas F1 Team': '#b6babd',
  Haas: '#b6babd',
  Alpine: '#2293d1',
  'Racing Bulls': '#6692ff',
  Audi: '#c9ff00',
  Williams: '#64c4ff',
  Cadillac: '#d6a756',
  'Aston Martin': '#006f62',
};

export const getTeamColor = (team: string): string => teamColors[team] ?? '#e10600';

export const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const pluralize = (count: number, singular: string, plural = `${singular}s`): string =>
  `${count} ${count === 1 ? singular : plural}`;
