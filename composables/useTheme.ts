/**
 * Theme management composable
 * Provides reactive theme state, persistence, and class/variable generation
 */

export type ThemeId =
  | "daniel-builds"
  | "sport-tech"
  | "brutalist"
  | "editorial"
  | "retro-futurism"
  | "organic";

const THEME_STORAGE_KEY = "bicicleta-theme";
const DEFAULT_THEME: ThemeId = "daniel-builds";

export const useTheme = () => {
  const currentTheme = useState<ThemeId>("theme", () => DEFAULT_THEME);
  const isHydrated = useState("theme-hydrated", () => false);

  // Initialize theme from localStorage on client-side
  const initializeTheme = () => {
    if (process.client && !isHydrated.value) {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId | null;
      if (stored && isValidTheme(stored)) {
        currentTheme.value = stored;
      }
      isHydrated.value = true;
      applyTheme(currentTheme.value);
    }
  };

  // Validate theme ID
  const isValidTheme = (id: unknown): id is ThemeId => {
    const validThemes: ThemeId[] = [
      "daniel-builds",
      "sport-tech",
      "brutalist",
      "editorial",
      "retro-futurism",
      "organic",
    ];
    return typeof id === "string" && (validThemes as string[]).includes(id);
  };

  // Set active theme and persist
  const setTheme = (id: ThemeId) => {
    if (!isValidTheme(id)) return;
    currentTheme.value = id;
    if (process.client) {
      localStorage.setItem(THEME_STORAGE_KEY, id);
    }
    applyTheme(id);
  };

  // Apply theme by injecting CSS class to document root
  const applyTheme = (id: ThemeId) => {
    if (process.client) {
      const root = document.documentElement;
      // Remove all theme classes
      root.classList.remove(
        "theme-daniel-builds",
        "theme-sport-tech",
        "theme-brutalist",
        "theme-editorial",
        "theme-retro-futurism",
        "theme-organic"
      );
      // Add current theme class
      root.classList.add(`theme-${id}`);
    }
  };

  // Initialize on mount
  onMounted(() => {
    initializeTheme();
  });

  return {
    currentTheme: readonly(currentTheme),
    setTheme,
    applyTheme,
    isHydrated: readonly(isHydrated),
  };
};
