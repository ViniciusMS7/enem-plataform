export type Subject = {
  id: string;
  name: string;
  area: string | null;
};

export type Alternative = {
  id: string;
  label: string;
  text: string;
};

export type Question = {
  id: string;
  statement: string;
  year: number | null;
  source: string | null;
  alternatives: Alternative[];
};

export type StudySession = {
  id: string;
  subjectId: string;
  subject: Subject;
  scheduledFor: string;
  durationMin: number;
  completed: boolean;
};

export type StudyPlan = {
  id: string;
  weekStart: string;
  sessions: StudySession[];
};
