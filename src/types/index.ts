export type Role = "user" | "agent" | "admin";

export interface JwtPayload {
  userId: string;
  role: Role;
}
