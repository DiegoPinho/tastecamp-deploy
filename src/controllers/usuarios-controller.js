import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { db } from "../config/database.js";
import { usuarioLoginSchema, usuarioSchema } from "../schemas/usuario-schema.js";

export async function signUp(req, res) {
  const usuario = req.body;

  const validacao = usuarioSchema.validate(usuario, { abortEarly: false });
  if (validacao.error) {
    const mensagens = validacao.error.details.map(detail => detail.message);
    return res.status(422).send(mensagens)
  }

  // salvar no meu banco
  try {
    await db.collection("usuarios").insertOne({
      ...usuario,
      senha: bcrypt.hashSync(usuario.senha, 10)
    });
    return res.status(201).send("Registro feito com sucesso!");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function signIn(req, res) {
  const usuario = req.body;

  const validacao = usuarioLoginSchema.validate(usuario, { abortEarly: false });
  if (validacao.error) {
    const mensagens = validacao.error.details.map(detail => detail.message);
    return res.status(422).send(mensagens)
  }

  try {
    const usuarioCadastrado = await db.collection("usuarios").findOne({
      email: usuario.email,
    });

    if (!usuarioCadastrado) {
      return res.status(401).send("Email e senha incompatíveis.");
    }

    if (usuarioCadastrado &&
      bcrypt.compareSync(usuario.senha, usuarioCadastrado.senha)) {
      console.log("Usuário logado com sucesso e alegria!")

      const token = jwt.sign(
        { userId: usuarioCadastrado._id },
        process.env.JWT_SECRET,
        { expiresIn: 86400 }); // 24h

      return res.send(token);
    }

    return res.status(401).send("Email e senha incompatíveis.");

  } catch (error) {
    return res.status(500).send(error.message);
  }
}