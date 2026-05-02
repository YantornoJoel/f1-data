import type { SessionKey, SessionTime } from '../domain/f1';

export const ARGENTINA_TIMEZONE = 'America/Argentina/Buenos_Aires';

const sessionLabels: Record<SessionKey, string> = {
  practice_1: 'Práctica 1',
  practice_2: 'Práctica 2',
  practice_3: 'Práctica 3',
  sprint_qualifying: 'Clasificación sprint',
  sprint: 'Sprint',
  qualifying: 'Clasificación',
  qualifying_group_a: 'Clasificación Grupo A',
  qualifying_group_b: 'Clasificación Grupo B',
  sprint_race: 'Sprint',
  feature_race: 'Carrera principal',
  race: 'Carrera',
};

export const getSessionLabel = (sessionKey: SessionKey): string => sessionLabels[sessionKey];

export const isKnownTime = (session?: SessionTime): session is SessionTime =>
  Boolean(session?.date && session.time && session.time.toUpperCase() !== 'TBC');

const getFormatter = (timezone: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('es-AR', { timeZone: timezone, ...options });

const getTimezoneParts = (date: Date, timezone: string) => {
  const parts = getFormatter(timezone, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);

  const value = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value);

  return {
    year: value('year'),
    month: value('month'),
    day: value('day'),
    hour: value('hour'),
    minute: value('minute'),
  };
};

export const zonedSessionToDate = (session: SessionTime | undefined, timezone: string): Date | null => {
  if (!isKnownTime(session)) return null;

  if (session.datetime_utc) {
    return new Date(session.datetime_utc);
  }

  const [year, month, day] = session.date.split('-').map(Number);
  const [hour, minute] = session.time.split(':').map(Number);

  if (timezone === ARGENTINA_TIMEZONE) {
    return new Date(`${session.date}T${session.time}:00-03:00`);
  }

  let candidate = new Date(Date.UTC(year, month - 1, day, hour, minute));

  for (let index = 0; index < 4; index += 1) {
    const parts = getTimezoneParts(candidate, timezone);
    const renderedUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute);
    const desiredUtc = Date.UTC(year, month - 1, day, hour, minute);
    const diff = renderedUtc - desiredUtc;

    if (diff === 0) break;
    candidate = new Date(candidate.getTime() - diff);
  }

  return candidate;
};

export const formatArgentinaDateTime = (date: Date | null): string => {
  if (!date) return 'Horario a confirmar';

  return getFormatter(ARGENTINA_TIMEZONE, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })
    .format(date)
    .replace(',', ' ·');
};

export const formatArgentinaDate = (date: Date | null): string => {
  if (!date) return 'Fecha a confirmar';

  return getFormatter(ARGENTINA_TIMEZONE, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const formatCalendarOptionDate = (date: Date | null): string => {
  if (!date) return 'Fecha a confirmar';

  return getFormatter(ARGENTINA_TIMEZONE, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
};

export const calculateAge = (dateOfBirth: string | undefined, referenceDate: Date): number | null => {
  if (!dateOfBirth) return null;

  const birthDate = new Date(`${dateOfBirth}T00:00:00`);
  if (Number.isNaN(birthDate.getTime())) return null;

  let age = referenceDate.getFullYear() - birthDate.getFullYear();
  const hasBirthdayPassed =
    referenceDate.getMonth() > birthDate.getMonth() ||
    (referenceDate.getMonth() === birthDate.getMonth() && referenceDate.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassed) age -= 1;

  return age;
};

export const getSessionEntries = (sessions: Partial<Record<SessionKey, SessionTime>>) =>
  (Object.entries(sessions) as Array<[SessionKey, SessionTime]>).sort(([leftKey], [rightKey]) => {
    const order: SessionKey[] = [
      'practice_1',
      'practice_2',
      'practice_3',
      'sprint_qualifying',
      'sprint',
      'qualifying_group_a',
      'qualifying_group_b',
      'qualifying',
      'sprint_race',
      'feature_race',
      'race',
    ];

    return order.indexOf(leftKey) - order.indexOf(rightKey);
  });


