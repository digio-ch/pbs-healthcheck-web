export interface PersonalGamification {
  levelKey: string;
  levelUp: boolean;
  levels: GamificationLevel[];
  name: string;
  title: string;
}

export interface GamificationLevel {
  goals: GamificationGoal[];
  key: string;
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
}
