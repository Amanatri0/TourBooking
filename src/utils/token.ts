import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

const generateAccessTokens = (userId: string) => {
  if (!accessTokenSecret) {
    throw new Error("Please provide a valid secret");
  }
  const accessToken = jwt.sign({ userId: userId }, accessTokenSecret, {
    expiresIn: "2h",
  });
  return accessToken;
};

const generateRefreshTokens = (userId: string) => {
  if (!refreshTokenSecret) {
    throw new Error("Please provide a valid secret");
  }
  const refreshToken = jwt.sign({ userId: userId }, refreshTokenSecret, {
    expiresIn: "7d",
  });

  return refreshToken;
};

export { generateAccessTokens, generateRefreshTokens };
