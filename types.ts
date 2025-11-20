export interface TabLine {
  lyric: string;
  tabs: string; // e.g., "+4 +4 -4 +5"
}

export interface SongSection {
  sectionName: string; // e.g., "Verse 1", "Chorus"
  lines: TabLine[];
}

export interface Source {
  title: string;
  uri: string;
}

export interface SongData {
  title: string;
  artist: string;
  key: string; // e.g., "C Major"
  difficulty: string; // e.g., "Beginner", "Intermediate"
  recommendedHarmonica: string; // e.g., "C Diatonic"
  sections: SongSection[];
  sources?: Source[]; // URLs where data was found
}

export enum LoadingStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}