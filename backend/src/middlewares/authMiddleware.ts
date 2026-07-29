import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Faz o Express reconhecer req.userId em qualquer lugar do projeto,
// sem precisar de um tipo customizado importado em cada controller.
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// Toda rota protegida passa por aqui antes do controller.
// Confirma que veio um token válido no header e extrai o userId dele —
// nenhum controller deve mais confiar em userId vindo do body/params,
// porque isso permitiria qualquer um se passar por qualquer usuário.
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Não autenticado" });
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret") as {
      userId: string;
    };
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ error: "Sessão expirada, faça login de novo" });
  }
}
