import joi from "joi";

export const usuarioLoginSchema = joi.object({
  email: joi.string().email().required(),
  senha: joi.string().required()
});

export const usuarioSchema = joi.object({
  nome: joi.string().required(),
  email: joi.string().email().required(),
  senha: joi.string().min(6).required()
});