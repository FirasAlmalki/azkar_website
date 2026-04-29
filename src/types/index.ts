export type TimePeriod = 'morning' | 'evening';

export interface TimeOfDayState {
  period: TimePeriod;
  imageSrc: string;
  nextSwitchMs: number;
}

export interface RamadanReading {
  name: string;
  emoji: string;
  completed: boolean;
}

export interface RamadanDay {
  day: number;
  readings: RamadanReading[];
}

export interface RamadanData {
  started: string;
  days: RamadanDay[];
}

export interface ZikrResult {
  count: number;
  label: string;
  seconds: number;
}
