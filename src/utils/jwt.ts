import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { ERROR_MESSAGE } from "../config/constants";

interface VerifyJWTSuccess {
  userId: string;
  type: string;
  error: null;
}

interface VerifyJWTError {
  userId: null;
  type: null;
  error: JsonWebTokenError;
}

type VerifyJWTResult = VerifyJWTSuccess | VerifyJWTError;

export function verifyJWT(code: string, secret: string): VerifyJWTResult {
  try {
    const { userId, type } = jwt.verify(code, secret) as {
      userId: string;
      type: string;
    };

    if (!userId) {
      return {
        userId: null,
        type: null,
        error: new JsonWebTokenError(ERROR_MESSAGE.INVALID_TOKEN),
      };
    }

    return { userId, type, error: null };
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return { userId: null, type: null, error };
    }
    throw error;
  }
}

export function generateJWTAccessToken(userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "30 days",
  });
}
