export interface PersonalGamification {
  levelKey: number;
  levelUp: boolean;
  levels: GamificationLevel[];
  name: string;
  title: string;
}

export interface GamificationLevel {
  goals: GamificationGoal[];
  key: number;
  title: string;
  active: boolean;
  required: number;
}

export interface GamificationGoal {
  completed: boolean;
  help: string;
  information: string;
  progress: number;
  required: boolean;
  title: string;
  key: string;
}
