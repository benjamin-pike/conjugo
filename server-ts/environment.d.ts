declare global {
  namespace NodeJS {
    interface ProcessEnv {
        PORT: number;
        DATABASE_URL: string;
        JWT_ACCESS_SECRET: string;
        JWT_REFRESH_SECRET: string;
        JWT_EXPIRATION_ACCESS: string;
        JWT_EXPIRATION_REFRESH: string;
        SALT_ROUNDS: number;
    }
  }
}

export {};