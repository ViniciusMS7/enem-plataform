import {
  Sigma,
  BookOpen,
  FlaskConical,
  Landmark,
  Atom,
  Leaf,
  Globe2,
  Brain,
  Users,
  GraduationCap,
  LucideIcon,
} from "lucide-react";

const MAPA: Record<string, LucideIcon> = {
  Matemática: Sigma,
  Português: BookOpen,
  Química: FlaskConical,
  História: Landmark,
  Física: Atom,
  Biologia: Leaf,
  Geografia: Globe2,
  Filosofia: Brain,
  Sociologia: Users,
};

export function iconePorMateria(nome: string): LucideIcon {
  return MAPA[nome] || GraduationCap;
}
