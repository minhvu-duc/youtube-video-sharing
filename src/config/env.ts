import "dotenv/config";

type ProductionEnv = {
  port: string,
  jwtSecret: string
}

type DevelopmentEnv = {
  port: string,
  jwtSecret: string
}

export const getNodeEnv = () => process.env.NODE_ENV || "development";

export const getProductionEnv = (): ProductionEnv => {
  const port = process.env.PORT;
  if (!port) throw new Error("PORT environment variable is not set.");

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) throw new Error("JWT_SECRET environment variable is not set.");
  return {
    port,
    jwtSecret,
  };
};

export const getDevelopmentEnv = (): DevelopmentEnv => {
  const port = process.env.PORT || "8080";
  const jwtSecret = process.env.JWT_SECRET || "example_secret";

  return {
    port,
    jwtSecret,
  };
};

const getEnv = (nodeEnv: string) => {
  if (nodeEnv === "development") return getDevelopmentEnv();
  return getProductionEnv();
};

const env = () => getEnv(getNodeEnv());

export default env();
