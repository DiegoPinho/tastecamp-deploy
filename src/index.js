import express, { json } from "express";
import cors from "cors";

import dotenv from "dotenv";

import authRouter from "./routers/auth-router.js";
import receitasRouter from "./routers/receitas-router.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(json());

app.use(authRouter);
app.use(receitasRouter);

const porta = process.env.PORT || 5000;
app.listen(porta, () => {
  console.log(`Servidor está rodando liso na porta ${porta}`);
});