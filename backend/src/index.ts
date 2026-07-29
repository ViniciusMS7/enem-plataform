import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import subjectRoutes from "./routes/subjectRoutes";
import questionRoutes from "./routes/questionRoutes";
import studyPlanRoutes from "./routes/studyPlanRoutes";
import attemptRoutes from "./routes/attemptRoutes";
import progressRoutes from "./routes/progressRoutes";
import customTopicRoutes from "./routes/customTopicRoutes";

dotenv.config();

const app = express();

// Em dev, sem FRONTEND_URL configurada, libera geral (localhost muda de porta
// às vezes). Em produção, defina FRONTEND_URL com o domínio do seu frontend
// pra só ele poder chamar essa API.
const origensPermitidas = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((s) => s.trim())
  : true;
app.use(cors({ origin: origensPermitidas }));
app.use(express.json());

// Cada domínio tem seu próprio arquivo de rotas.
// Adicionar um novo domínio = criar routes/xRoutes.ts e registrar aqui.
app.use("/auth", authRoutes);
app.use("/subjects", subjectRoutes);
app.use("/questions", questionRoutes);
app.use("/study-plans", studyPlanRoutes);
app.use("/attempts", attemptRoutes);
app.use("/progress", progressRoutes);
app.use("/custom-topics", customTopicRoutes);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
