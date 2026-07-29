export type Subject = {
  id: string;
  name: string;
  area: string | null;
};

export type Alternative = {
  id: string;
  label: string;
  text: string;
  isCorrect?: boolean;
};

export type Question = {
  id: string;
  statement: string;
  imageUrl: string | null;
  year: number | null;
  source: string | null;
  alternatives: Alternative[];
  // presentes só nas questões vindas de um assunto pesquisado por IA:
  // corrigidas no navegador (a resposta certa já vem junto), sem
  // registrar tentativa no servidor.
  custom?: boolean;
  explanation?: string;
};

export type CustomTopic = {
  id: string;
  query: string;
  slug: string;
  summary: string;
  questions: { id: string }[];
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
