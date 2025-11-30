
export enum SkillType {
  LOGIC = 'Logic', // Intellectual, analyzing
  VOLITION = 'Volition', // Willpower, keeping you sane
  INLAND_EMPIRE = 'Inland Empire', // Imagination, dreams, surrealism
  ELECTROCHEMISTRY = 'Electrochemistry', // Dopamine, pleasure, party
  EMPATHY = 'Empathy', // Understanding others/self
  HALF_LIGHT = 'Half Light', // Fear, urgency, flight or fight
  AUTHORITY = 'Authority', // Command, aggressive confidence
}

export enum TriggerType {
  TASK_ADD = 'TASK_ADD',
  TASK_COMPLETE = 'TASK_COMPLETE',
  REWARD_BUY = 'REWARD_BUY',
  APP_OPEN = 'APP_OPEN'
}

export type ViewMode = 'HUB' | 'TASKS' | 'STORE';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  difficulty: 'Trivial' | 'Easy' | 'Medium' | 'Hard' | 'Impossible';
  rewardValue: number; // Value in Reál
}

export interface Reward {
  id: string;
  text: string;
  cost: number;
}

export interface DialogueMessage {
  id: string;
  skill: SkillType;
  text: string;
  timestamp: number;
}

export interface CustomRule {
  id: string;
  trigger: TriggerType;
  skill: SkillType;
  text: string;
}

export interface AppState {
  tasks: Task[];
  rewards: Reward[];
  history: DialogueMessage[]; // Messages that have been read
  dialogueQueue: DialogueMessage[]; // Messages waiting to be read
  balance: number; // Current Reál
  stats: {
    intellect: number;
    psyche: number;
    physique: number;
    motorics: number;
  };
  customRules: CustomRule[]; // User-defined dialogue rules
}
