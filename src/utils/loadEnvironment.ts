import dotenv from 'dotenv'

dotenv.config();

export const environment: {
  PORT: string,
  MONGODB_URI: string,
  JWT_SECRET: string,
  HOST: string,
  ACCESS_TOKEN_LIFE: string,
  REFRESH_TOKEN_LIFE: string,
  CLIENT_URL: string,
  GITHUB_TOKEN: string
} = {
  PORT: process.env.PORT as string,
  MONGODB_URI: process.env.MONGODB_URI as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  HOST: process.env.HOST as string,
  ACCESS_TOKEN_LIFE: process.env.ACCESS_TOKEN_LIFE as string,
  REFRESH_TOKEN_LIFE: process.env.REFRESH_TOKEN_LIFE as string,
  CLIENT_URL: process.env.CLIENT_URL as string,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN as string,
};
