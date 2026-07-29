import { Request, Response } from "express";
import {
  buscarOuGerarTopico,
  getCustomTopicById,
  addCustomTopicForUser,
  removeCustomTopicForUser,
  listCustomTopicsForUser,
} from "../services/customTopicService";

export async function searchTopic(req: Request, res: Response) {
  const { query } = req.body;
  const userId = req.userId!;
  if (!query) {
    return res.status(400).json({ error: "Informe query" });
  }

  try {
    const resultado = await buscarOuGerarTopico(query, userId);

    if (resultado.limiteAtingido) {
      return res.status(200).json({ limiteAtingido: true });
    }

    res.status(200).json(resultado);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

export async function getTopicById(req: Request, res: Response) {
  const { id } = req.params;
  const topic = await getCustomTopicById(id);
  if (!topic) return res.status(404).json({ error: "Assunto não encontrado" });
  res.json(topic);
}

export async function addTopicForUser(req: Request, res: Response) {
  const { id } = req.params;
  const userId = req.userId!;

  try {
    await addCustomTopicForUser(userId, id);
    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(404).json({ error: (err as Error).message });
  }
}

export async function removeTopicForUser(req: Request, res: Response) {
  const { id } = req.params;
  const userId = req.userId!;

  await removeCustomTopicForUser(userId, id);
  res.status(200).json({ ok: true });
}

export async function getMyTopics(req: Request, res: Response) {
  const userId = req.userId!;
  const topics = await listCustomTopicsForUser(userId);
  res.json(topics);
}
