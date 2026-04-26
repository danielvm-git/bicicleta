/** Better Auth / Neon Auth user (subset used by the app) */
export type NeonAuthUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  emailVerified?: boolean;
  role?: string | null;
  [key: string]: unknown;
};

/** Response from GET /api/auth/get-session (Better Auth) */
export type NeonGetSessionResult = {
  data?: { user: NeonAuthUser | null; session: unknown } | null;
  user?: NeonAuthUser | null;
} | null;
