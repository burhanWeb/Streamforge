import { dbConfig } from "../config/db.ts";

export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  const result = await dbConfig.query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email`,
    [name, email, password]
  );

  return result.rows[0];
};

export const getUserName = async (id: string) => {
  const result = await dbConfig.query(
    `SELECT name FROM users WHERE id = $1`,
    [id]
  );

  return result.rows[0];
};

export const findUserByEmail = async (email: string) => {
  const result = await dbConfig.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  return result.rows[0];
};