import { createAuthClient } from "@neondatabase/auth";
import { BetterAuthVanillaAdapter } from "@neondatabase/auth/vanilla";
import type { NeonGetSessionResult } from "~/types/neon-auth";
import { getNeonAuthUserFromSession } from "~/utils/neonAuth";

function createClient() {
  if (!import.meta.client) {
    throw new Error("Neon auth client actions are browser-only");
  }
  return createAuthClient(`${window.location.origin}/api/auth`, {
    adapter: BetterAuthVanillaAdapter(),
  });
}

export function useNeonAuth() {
  const { data, refresh, status, error } = useFetch<NeonGetSessionResult>(
    "/api/auth/get-session",
    {
      credentials: "include",
    }
  );

  const user = computed(() => getNeonAuthUserFromSession(data.value));

  const loggedIn = computed(() => !!user.value?.id);
  const pending = computed(
    () => status.value === "pending" && data.value === undefined
  );

  async function signInWithGitHub() {
    if (!import.meta.client) {
      return;
    }
    const client = createClient();
    await client.signIn.social({
      provider: "github",
      callbackURL: window.location.href,
    });
  }

  async function signOut() {
    if (import.meta.client) {
      const client = createClient();
      await client.signOut();
    }
    await refresh();
  }

  return {
    data,
    user,
    loggedIn,
    pending,
    error,
    refresh,
    signInWithGitHub,
    signOut,
  };
}
