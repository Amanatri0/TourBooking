import dotenv from "dotenv";
dotenv.config();

import jwt, { JwtPayload } from "jsonwebtoken";

const mySecret = process.env.JWT_SECRET;

if (!mySecret) {
  throw new Error("Please provide a valid secret");
}

const generateAccessTokens = (userId: string) => {
  const accessToken = jwt.sign({ userId: userId }, mySecret, {
    expiresIn: "2h",
  });
  return accessToken;
};

const generateRefreshTokens = (userId: string) => {
  const refreshToken = jwt.sign({ userId: userId }, mySecret, {
    expiresIn: "7d",
  });

  return refreshToken;
};

export { generateAccessTokens, generateRefreshTokens };
