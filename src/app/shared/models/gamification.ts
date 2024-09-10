export interface PersonalGamification {
  levelKey: string;
  levelup: boolean;
  levels: GamificationLevel[];
  name: string;
  title: string;
}

export interface GamificationLevel {
  goals: GamificationGoal[];
  key: string;
  title: string;
  active: boolean;
}

export interface GamificationGoal {
  completed: boolean;
  help: string;
  information: string;
  progress: number;
  required: boolean;
  title: string;
}
