import { Router } from "express";

import {
  alterarReceita,
  criarReceita,
  deletarReceita,
  getReceitaPorId,
  getReceitas
} from "../controllers/receitas-controller.js";
import { validarToken } from "../middlewares/auth-middleware.js";
import { receitaSchema } from "../schemas/receita-schema.js";
import { validarSchema } from "../middlewares/schema-middleware.js";

const receitasRouter = Router();

// receitasRouter.use(validarToken);
receitasRouter.get("/receitas", validarToken, getReceitas);
receitasRouter.get("/receitas/:id", validarToken, getReceitaPorId);
receitasRouter.post("/receitas", validarToken, validarSchema(receitaSchema), criarReceita);
receitasRouter.delete("/receitas/:id", validarToken, deletarReceita);
receitasRouter.put("/receitas/:id", validarToken, validarSchema(receitaSchema), alterarReceita);

export default receitasRouter;