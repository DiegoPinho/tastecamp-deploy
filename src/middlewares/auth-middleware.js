import { db } from "../config/database.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";
dotenv.config();

export async function validarToken(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer", "").trim();
  if (!token) return res.sendStatus(401);

  try {
    jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
      if (error) return res.status(401).send(error);

      const user = await db.collection("usuarios").findOne({
        _id: new ObjectId(decoded.userId)
      });
      if (!user) return res.sendStatus(401);

      // armazenar para usar depois!
      res.locals.user = user;

      return next();
    })


  } catch (error) {
    return res.sendStatus(500);
  }
}