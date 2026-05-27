import { createUser, findUserByEmail } from "../repositories/user.repo.ts";
import { generateToken } from "../utils/jwt.ts";
import { comparePassword, hashPassword } from "../utils/password.ts";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await createUser(name, email, hashedPassword);

  const token = generateToken({
    userId: user.id,
    email: user.email,
  });

  return { user, token };
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await comparePassword(
    password,
    user.password
  );

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
  },
);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};