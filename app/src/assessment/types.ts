export type DashboardMode =
  | "today"
  | "lonely"
  | "overwhelmed"
  | "motivation"
  | "talk";

export type QuestionType =
  | "text"
  | "single_choice"
  | "multiple_choice"
  | "scale";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  type: QuestionType;

  title: string;
  description?: string;

  required?: boolean;

  options?: QuestionOption[];

  min?: number;
  max?: number;
  step?: number;

  placeholder?: string;

  modes?: DashboardMode[];
}

export type Answer =
  | string
  | string[]
  | number;

export type Answers = Record<
  string,
  Answer
>;
