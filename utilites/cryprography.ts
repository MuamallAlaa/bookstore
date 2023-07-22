import { Request } from "express";

import bcrypt from "bcrypt";

const IsPssCorrect = async (plantext: string, hashed: string) => {
  return await bcrypt.compare(plantext, hashed);
};
const HashedPassword = async (password: string) => {
  const HashedPassword = await bcrypt.hash(password, 14);

  return HashedPassword;
};

export { IsPssCorrect, HashedPassword };
