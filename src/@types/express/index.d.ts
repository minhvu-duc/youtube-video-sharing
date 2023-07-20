declare namespace Express {
  export interface Request {
    user: import("../../database/user").User;
    isAuthenticated: () => boolean;
  }
}
