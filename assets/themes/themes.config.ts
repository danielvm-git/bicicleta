/**
 * Theme definitions and utilities
 * Extracted from design-system.vue for reuse across admin and design-system pages
 */

export type ThemeId =
  | "daniel-builds"
  | "sport-tech"
  | "brutalist"
  | "editorial"
  | "retro-futurism"
  | "organic";

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  colors: string[];
  audience: string;
}

export interface ThemeClasses {
  bgMain: string;
  bgCard: string;
  textPrimary: string;
  textSecondary: string;
  accentGradient: string;
  buttonGradient: string;
  headerBg: string;
}

export const themes: Theme[] = [
  {
    id: "daniel-builds",
    name: "Daniel Builds",
    description:
      "Marca original. Warm + Deep Teal. Editorial com um toque de modernidade.",
    colors: ["#f4f0e8", "#0d6b6b", "#4a5058"],
    audience: "Profissionais ciclistas, usuários de MTB premium",
  },
  {
    id: "sport-tech",
    name: "Sport-Tech",
    description: "Dark + Gradients. Premium tech feel com animações.",
    colors: ["#0E1219", "#06B6D4", "#0EA5E9"],
    audience: "Tech-savvy, moderno, premium",
  },
  {
    id: "brutalist",
    name: "Brutalist",
    description: "Preto + Branco + Vermelho. Minimal e raw.",
    colors: ["#000000", "#FFFFFF", "#EF4444"],
    audience: "Anti-design, designers",
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "Magazine style. Serif + whitespace.",
    colors: ["#F5F1E8", "#1A1A1A", "#8B7355"],
    audience: "Profissionais, técnicos",
  },
  {
    id: "retro-futurism",
    name: "Retro-Futurism",
    description: "90s + Neon. Cyber-aesthetic.",
    colors: ["#1A1A2E", "#00F0FF", "#FF006E"],
    audience: "Gamers, alternative",
  },
  {
    id: "organic",
    name: "Organic",
    description: "Green + Curves. Natural, sustentável.",
    colors: ["#FEF3E2", "#2D5016", "#7CB342"],
    audience: "Sustentabilidade, comunidade",
  },
];

/**
 * Get theme classes for styling
 */
export const getThemeClasses = (themeId: string): ThemeClasses => {
  const themeMap: Record<ThemeId, ThemeClasses> = {
    "daniel-builds": {
      bgMain: "bg-db-bg dark:bg-gray-900",
      bgCard:
        "bg-white dark:bg-gray-800 border border-db-border dark:border-gray-700",
      textPrimary: "text-db-ink dark:text-white",
      textSecondary: "text-db-ink-muted dark:text-gray-400",
      accentGradient: "from-db-accent to-db-accent-hover",
      buttonGradient: "bg-primary text-white hover:bg-primary/90",
      headerBg:
        "bg-white dark:bg-gray-800 border-b border-db-border dark:border-gray-700",
    },
    "sport-tech": {
      bgMain: "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950",
      bgCard:
        "bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50",
      textPrimary: "text-white",
      textSecondary: "text-slate-400",
      accentGradient: "from-cyan-400 to-blue-400",
      buttonGradient:
        "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600",
      headerBg: "bg-slate-900 border-b border-slate-800",
    },
    brutalist: {
      bgMain: "bg-black",
      bgCard: "bg-white border-2 border-black hover:border-red-600",
      textPrimary: "text-black",
      textSecondary: "text-gray-600",
      accentGradient: "from-black to-red-600",
      buttonGradient:
        "bg-black text-white border-2 border-black hover:bg-red-600 hover:border-red-600",
      headerBg: "bg-white border-b-2 border-black",
    },
    editorial: {
      bgMain: "bg-[#F5F1E8]",
      bgCard: "bg-white border border-[#E5DECC] hover:shadow-lg",
      textPrimary: "text-[#1A1A1A]",
      textSecondary: "text-[#666666]",
      accentGradient: "from-[#8B7355] to-[#A89968]",
      buttonGradient: "bg-[#8B7355] text-white hover:bg-[#6B5345]",
      headerBg: "bg-white border-b border-[#E5DECC]",
    },
    "retro-futurism": {
      bgMain: "bg-[#1A1A2E]",
      bgCard:
        "bg-[#16213E] border-2 border-[#00F0FF] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)]",
      textPrimary: "text-[#00F0FF]",
      textSecondary: "text-[#FF006E]",
      accentGradient: "from-[#00F0FF] to-[#FF006E]",
      buttonGradient:
        "bg-[#00F0FF] text-[#1A1A2E] hover:bg-[#FF006E] hover:text-white font-black",
      headerBg: "bg-[#0F3460] border-b-2 border-[#00F0FF]",
    },
    organic: {
      bgMain: "bg-gradient-to-br from-[#FEF3E2] via-[#FAF6F0] to-[#FEF3E2]",
      bgCard:
        "bg-white rounded-3xl border-2 border-[#E8DCC8] hover:border-[#7CB342] shadow-sm hover:shadow-lg",
      textPrimary: "text-[#2D5016]",
      textSecondary: "text-[#666633]",
      accentGradient: "from-[#7CB342] to-[#9CCC65]",
      buttonGradient:
        "bg-gradient-to-r from-[#7CB342] to-[#9CCC65] text-white hover:from-[#689F38] hover:to-[#8BC34A]",
      headerBg: "bg-white/80 backdrop-blur border-b border-[#E8DCC8]",
    },
  };

  return themeMap[themeId as ThemeId] || themeMap["daniel-builds"];
};

/**
 * Get theme metadata by ID
 */
export const getThemeById = (id: string): Theme | undefined => {
  return themes.find((t) => t.id === id);
};
