export type Series = 'formula1' | 'formula2';

export type SessionKey =
  | 'practice_1'
  | 'practice_2'
  | 'practice_3'
  | 'sprint_qualifying'
  | 'sprint'
  | 'qualifying'
  | 'qualifying_group_a'
  | 'qualifying_group_b'
  | 'sprint_race'
  | 'feature_race'
  | 'race';

export type ResultSessionType = 'race' | 'sprint' | 'qualifying' | 'sprintQualifying' | 'featureRace';

export interface SessionTime {
  date: string;
  time: string;
  datetime_utc?: string;
}

export type SessionMap = Partial<Record<SessionKey, SessionTime>>;

export interface GrandPrix {
  round: number;
  gp: string;
  official_name?: string;
  country?: string;
  country_code?: string;
  flag?: string;
  timezone?: string;
  sessions: SessionMap;
}

export interface DriverProfile {
  driver: string;
  team: string;
  nationality?: string;
  nationality_code?: string;
  dateOfBirth?: string;
  driver_page_url?: string;
  team_page_url?: string;
  driver_image_url: string | null;
  team_logo_url: string | null;
  team_logo_note?: string;
  driver_image_source?: string;
  team_logo_source?: string | null;
}

export interface DriverStanding {
  position: number;
  driver: string;
  team: string;
  points: number;
}

export interface ClassifiedResult {
  position: number | null;
  status: 'classified' | 'NC' | 'pending';
  driver: string;
  team: string;
  laps: number | null;
  time: string;
  points: number;
}

export interface RaceWinner {
  position: 1;
  driver: string;
  team: string;
  laps: number;
  time: string;
  points: number;
}

export interface RaceResult {
  round: number;
  gp: string;
  race_date: string;
  winner: RaceWinner;
  podium: string[];
  source_url: string;
  results: ClassifiedResult[];
}

export interface SessionResult {
  type: ResultSessionType;
  label?: string;
  status?: 'completed' | 'pending';
  source_url?: string;
  results: ClassifiedResult[];
}

export interface EventResult {
  series: Series;
  round: number;
  gp: string;
  country?: string;
  flag?: string;
  date: string;
  sessions: SessionResult[];
}

export interface F1Data {
  meta: {
    season: number;
    generated_on: string;
    notes: string[];
    sources: Record<string, string>;
    asset_version?: number;
    asset_notes?: string[];
  };
  formula1: {
    timezone: string;
    grand_prix: GrandPrix[];
    race_results: RaceResult[];
    session_results?: EventResult[];
  };
  formula2: {
    timezone: string;
    grand_prix: GrandPrix[];
    session_results?: EventResult[];
  };
  formula1_drivers: DriverProfile[];
  formula2_drivers?: DriverProfile[];
  formula1_standings: {
    drivers: DriverStanding[];
  };
  formula2_standings?: {
    drivers: DriverStanding[];
  };
}

export interface EnrichedEvent extends GrandPrix {
  series: Series;
  timezone: string;
  primarySessionKey: SessionKey;
  primarySession?: SessionTime;
  primaryInstant: Date | null;
}
