import dotenv from 'dotenv'

dotenv.config();

export const environment: {
  PORT: string,
  MONGODB_URI: string,
  JWT_ACCESS_SECRET: string,
  JWT_REFRESH_SECRET: string,
  COOKIE_NAME: string,
  HOST: string,
  ACCESS_TOKEN_LIFE: string,
  REFRESH_TOKEN_LIFE: string,
  CLIENT_URL: string,
  GITHUB_TOKEN: string,
  REDIS_HOST: string,
  REDIS_PORT: string,
  STRIPE_SECRET_KEY: string,
  DIGITAL_OCEAN_ACCESS_KEY:string,
  DIGITAL_OCEAN_SECRET_KEY:string,
  DIGITAL_OCEAN_BUCKET_NAME:string,
} = {
  PORT: process.env.PORT as string,
  MONGODB_URI: process.env.MONGODB_URI as string,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
  COOKIE_NAME: process.env.COOKIE_NAME as string,
  HOST: process.env.HOST as string,
  ACCESS_TOKEN_LIFE: process.env.ACCESS_TOKEN_LIFE as string,
  REFRESH_TOKEN_LIFE: process.env.REFRESH_TOKEN_LIFE as string,
  CLIENT_URL: process.env.CLIENT_URL as string,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN as string,
  REDIS_HOST: process.env.REDIS_HOST as string,
  REDIS_PORT: process.env.REDIS_PORT as string,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
  DIGITAL_OCEAN_ACCESS_KEY: process.env.DIGITAL_OCEAN_ACCESS_KEY as string,
  DIGITAL_OCEAN_SECRET_KEY: process.env.DIGITAL_OCEAN_SECRET_KEY as string,
  DIGITAL_OCEAN_BUCKET_NAME: process.env.DIGITAL_OCEAN_BUCKET_NAME as string
};
