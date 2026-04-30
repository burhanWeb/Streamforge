export type User = {
  id: string;
  email: string;
  password: string;
  createdAt: string;
};

const users = new Map<string, User>();

export function createUser(email: string, password: string) {
  const existing = findUserByEmail(email);
  if (existing) {
    const error = new Error('User already exists') as Error & { statusCode?: number };
    error.statusCode = 409;
    throw error;
  }

  const user: User = {
    id: crypto.randomUUID(),
    email,
    password,
    createdAt: new Date().toISOString()
  };

  users.set(user.id, user);
  return user;
}

export function findUserByEmail(email: string) {
  return Array.from(users.values()).find((user) => user.email === email) ?? null;
}
