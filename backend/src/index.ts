import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import subjectRoutes from "./routes/subjectRoutes";
import questionRoutes from "./routes/questionRoutes";
import studyPlanRoutes from "./routes/studyPlanRoutes";
import attemptRoutes from "./routes/attemptRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Cada domínio tem seu próprio arquivo de rotas.
// Adicionar um novo domínio = criar routes/xRoutes.ts e registrar aqui.
app.use("/auth", authRoutes);
app.use("/subjects", subjectRoutes);
app.use("/questions", questionRoutes);
app.use("/study-plans", studyPlanRoutes);
app.use("/attempts", attemptRoutes);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
