import { Request, Response } from "express";
import * as studyPlanService from "../services/studyPlanService";

export async function generateWeeklyPlan(req: Request, res: Response) {
  const userId = req.userId!;
  const plan = await studyPlanService.generatePlanForUser(userId);
  res.status(201).json(plan);
}

export async function getPlanByWeek(req: Request, res: Response) {
  const userId = req.userId!;
  const plan = await studyPlanService.getLatestPlan(userId);
  res.json(plan);
}
