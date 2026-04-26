declare module "#auth-utils" {
  interface User {
    id?: string;
    name?: string;
    username?: string;
    avatar?: string;
    /** GitHub user id (from OAuth profile). */
    githubId?: string | number;
  }
}

export {};
