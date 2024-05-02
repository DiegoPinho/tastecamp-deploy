import { ObjectId } from "mongodb";

import { db } from "../config/database.js";

export async function getReceitas(req, res) {
  const pagina = req.query.pagina || 1;
  const limite = 2;
  const inicio = (pagina - 1) * limite;

  try {
    const receitas = await db.collection("receitas")
      .find()
      .skip(inicio)
      .limit(limite)
      .toArray();
    return res.send(receitas);
  } catch (err) {
    return res.status(500).send(err.message)
  }
};

export async function getReceitaPorId(req, res) {
  const id = req.params.id;

  try {
    const receita = await db.collection("receitas").findOne({
      _id: new ObjectId(id)
    });

    if (!receita) return res.status(404).send("Receita não encontrada!");
    return res.send(receita)
  } catch (error) {
    res.status(500).send(err.message);
  }
}

export async function criarReceita(req, res) {
  const receita = req.body;

  try {
    const receitaExistente =
      await db.collection("receitas").findOne({ titulo: receita.titulo });
    if (receitaExistente) {
      return res.status(409).send("Receita com este título já cadastrada!");
    }
    await db.collection("receitas").insertOne({
      ...receita,
      user: res.locals.user._id
    });
    res.status(201).send("Sua receita foi adicionada com sucesso!")
  }
  catch (err) {
    res.status(500).send(err.message)
  }
}

export async function deletarReceita(req, res) {
  const { id } = req.params;

  try {
    const resultado = await db.collection("receitas").deleteOne({
      _id: new ObjectId(id)
    });

    if (resultado.deletedCount === 0) {
      return res.status(404).send("Essa receita não existe"); // not found
    }

    // no content
    return res.status(204).send("Receita foi deletada com sucesso!");

  } catch (err) {
    return res.status(500).send(err.message);
  }
}

export async function alterarReceita(req, res) {
  const { id } = req.params;
  const receita = req.body;

  try {
    // verificar se já existe alguma receita com o título desejado!
    const receitaExistente = await db.collection("receitas").findOne({
      titulo: receita.titulo
    });

    if (receitaExistente) {
      return res.status(409).send("Receita com este título já cadastrada!");
    }

    // atualização no banco (mongodb)
    const resultado = await db.collection("receitas").updateOne({
      _id: new ObjectId(id)
    }, {
      $set: {
        titulo: receita.titulo,
        ingredientes: receita.ingredientes,
        preparo: receita.preparo
      }
    });

    if (resultado.matchedCount === 0) {
      return res.status(404).send("Essa receita não existe!");
    }

    return res.send("Receita atualizada!");
  } catch (error) {
    return res.status(500).send(error.message);
  }

}