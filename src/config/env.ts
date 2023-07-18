import "dotenv/config";

type ProductionEnv = {
  port: string
}

type DevelopmentEnv = {
  port: string
}

export const getNodeEnv = () => process.env.NODE_ENV || "development";

export const getProductionEnv = (): ProductionEnv => {
  const port = process.env.PORT;
  if (!port) throw new Error("PORT environment variable is not set.");

  return {
    port,
  };
};

export const getDevelopmentEnv = (): DevelopmentEnv => {
  const port = process.env.PORT || "8080";

  return {
    port,
  };
};

const getEnv = (nodeEnv: string) => {
  if (nodeEnv === "development") return getDevelopmentEnv();
  return getProductionEnv();
};

const env = () => getEnv(getNodeEnv());

export default env();
