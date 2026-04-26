import { createAuthClient } from "@neondatabase/auth";
import { BetterAuthVanillaAdapter } from "@neondatabase/auth/vanilla";
import type { NeonGetSessionResult } from "~/types/neon-auth";

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

  const user = computed(() => {
    const d = data.value;
    if (!d) {
      return null;
    }
    return d.data?.user ?? d.user ?? null;
  });

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
