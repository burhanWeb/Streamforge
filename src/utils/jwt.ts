import jwt from "jsonwebtoken";
import { Response } from "express";
import { env } from "../config/env.ts";

type TokenPayload = {
  userId: string;
  email: string;
};

export const generateToken = (
  payload: TokenPayload,
  res?: Response
) => {
  const token = jwt.sign(payload, env.jwtSecret, {
    expiresIn: "7d",
  });

  if (res) {
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, 
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  return token;
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.jwtSecret) as TokenPayload;
};