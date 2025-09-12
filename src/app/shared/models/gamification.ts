export interface PersonalGamification {
  levelKey: string;
  levelUp: boolean;
  levels: GamificationLevel[];
  name: string;
  title: string;
  betaRequested: boolean;
}

export interface GamificationLevel {
  goals: GamificationGoal[];
  key: number;
  title: string;
  active: boolean;
  required: number;
  access?: string;
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
