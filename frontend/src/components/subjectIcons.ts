import { Sigma, BookOpen, FlaskConical, Landmark, GraduationCap, LucideIcon } from "lucide-react";

const MAPA: Record<string, LucideIcon> = {
  Matemática: Sigma,
  Português: BookOpen,
  Química: FlaskConical,
  História: Landmark,
};

export function iconePorMateria(nome: string): LucideIcon {
  return MAPA[nome] || GraduationCap;
}
