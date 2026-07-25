import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";

export async function registerUser(data: { name: string; email: string; password: string }) {
  const passwordHash = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
    },
    select: { id: true, name: true, email: true },
  });
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Usuário não encontrado");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("Senha incorreta");

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "dev_secret", {
    expiresIn: "7d",
  });

  return { token, user: { id: user.id, name: user.name, email: user.email } };
}
