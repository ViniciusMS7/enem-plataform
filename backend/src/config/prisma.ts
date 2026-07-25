import { PrismaClient } from "@prisma/client";

// Instância única do Prisma reaproveitada em todo o projeto.
// Qualquer service/controller importa daqui, nunca cria um novo PrismaClient.
export const prisma = new PrismaClient();
