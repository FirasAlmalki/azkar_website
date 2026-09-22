export type TimePeriod = 'morning' | 'evening';

export interface TimeOfDayState {
  period: TimePeriod;
  imageSrc: string;
  nextSwitchMs: number;
}

export interface ZikrResult {
  count: number;
  label: string;
  seconds: number;
}
