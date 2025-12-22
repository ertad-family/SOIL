import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ===========================================
      // TYPOGRAPHY - Roman Heritage (Modernized)
      // Cinzel (display) + Outfit (UI) + Source Sans 3 (body)
      // ===========================================
      fontFamily: {
        // Sora for headings - geometric, modern
        display: ["var(--font-sora)", "system-ui", "sans-serif"],
        // Manrope for body text - humanist, readable
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        // Cinzel for logo and decorative elements (Roman heritage)
        serif: ["var(--font-cinzel)", "Trajan Pro", "Times New Roman", "serif"],
        // Manrope also for UI (consistent with body)
        ui: ["var(--font-manrope)", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "monospace"],
      },

      // ===========================================
      // COLORS - SOIL Roman Heritage Design System
      // ===========================================
      colors: {
        // -----------------------------------------
        // Marble - Primary Palette (Warm Whites & Stones)
        // Inspired by Roman marble architecture
        // -----------------------------------------
        marble: {
          50: "#FDFCFB", // Pure marble white
          100: "#F9F7F4", // Warm white
          200: "#F3EFE9", // Light cream
          300: "#E8E2D9", // Soft stone
          400: "#D4CBC0", // Weathered marble
          500: "#B8ADA0", // Medium stone
          600: "#9A8D7F", // Aged marble
          700: "#7A6E62", // Dark stone
          800: "#5A5048", // Deep earth
          900: "#3D3632", // Charcoal brown
          950: "#252220", // Near black (text)
        },

        // -----------------------------------------
        // Gold - Roman Gold Accent (Primary Accent)
        // The medallion from the logo
        // -----------------------------------------
        gold: {
          50: "#FDF9EF", // Lightest gold tint
          100: "#FBF0D9", // Pale gold
          200: "#F6DFB3", // Light gold
          300: "#EDCA85", // Soft gold
          400: "#E2B055", // Medium gold
          500: "#C9943D", // True Roman gold (primary)
          600: "#A67A2E", // Deep gold
          700: "#845F23", // Bronze gold
          800: "#6B4C1C", // Dark bronze
          900: "#563D17", // Deepest bronze
        },

        // -----------------------------------------
        // Terra - Earth Tones (Secondary)
        // Roman terracotta influence
        // -----------------------------------------
        terra: {
          50: "#FBF8F6",
          100: "#F5EDE7",
          200: "#EBDBD0",
          300: "#DCC4B0",
          400: "#C4A484", // Light terracotta
          500: "#A68968", // Terracotta
          600: "#8B6F4E", // Deep terra
          700: "#6F5840",
          800: "#584635",
          900: "#47392C",
        },

        // -----------------------------------------
        // Slate - Cool Neutral (SOIL Scientific/Dark Mode)
        // Modern contrast to warm tones
        // -----------------------------------------
        slate: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8", // Light slate
          500: "#64748B", // Medium slate
          600: "#475569", // Dark slate
          700: "#334155",
          800: "#1E293B", // Deep slate (dark mode bg)
          900: "#0F172A", // Darkest slate
          950: "#020617",
        },

        // -----------------------------------------
        // Semantic Colors - Roman-inspired muted tones
        // -----------------------------------------
        success: {
          50: "#F0F7F1",
          100: "#DCF0DE",
          200: "#BBE0BF",
          300: "#8FC996",
          400: "#5D8A66", // Muted sage green (Roman garden)
          500: "#4A7052",
          600: "#3A5840",
          700: "#2F4634",
          800: "#273829",
          900: "#212F23",
        },
        warning: {
          50: "#FDF9EF",
          100: "#FBF0D9",
          200: "#F6DFB3",
          300: "#EDCA85",
          400: "#E2B055",
          500: "#C9943D", // Reuse gold
          600: "#A67A2E",
          700: "#845F23",
          800: "#6B4C1C",
          900: "#563D17",
        },
        error: {
          50: "#FDF3F3",
          100: "#FCE4E4",
          200: "#FACECE",
          300: "#F5ABAB",
          400: "#EC7B7B",
          500: "#B85450", // Pompeii red (muted)
          600: "#9A4340",
          700: "#7D3634",
          800: "#68302F",
          900: "#592D2B",
        },
        info: {
          50: "#F4F7FA",
          100: "#E8EEF4",
          200: "#CCDBE8",
          300: "#A3BED4",
          400: "#729BBB",
          500: "#5B7C99", // Roman blue (muted)
          600: "#486378",
          700: "#3B5060",
          800: "#344451",
          900: "#2E3B45",
        },
      },

      // ===========================================
      // SPACING - 4px base unit
      // ===========================================
      spacing: {
        "0": "0px",
        px: "1px",
        "0.5": "2px",
        "1": "4px",
        "1.5": "6px",
        "2": "8px",
        "2.5": "10px",
        "3": "12px",
        "3.5": "14px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "7": "28px",
        "8": "32px",
        "9": "36px",
        "10": "40px",
        "11": "44px",
        "12": "48px",
        "14": "56px",
        "16": "64px",
        "18": "72px",
        "20": "80px",
        "24": "96px",
        "28": "112px",
        "32": "128px",
      },

      // ===========================================
      // TYPOGRAPHY SCALE
      // ===========================================
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.4" }], // 12px
        sm: ["0.875rem", { lineHeight: "1.5" }], // 14px
        base: ["1rem", { lineHeight: "1.6" }], // 16px
        lg: ["1.125rem", { lineHeight: "1.6" }], // 18px
        xl: ["1.25rem", { lineHeight: "1.6" }], // 20px
        "2xl": ["1.5rem", { lineHeight: "1.4" }], // 24px
        "3xl": ["1.75rem", { lineHeight: "1.3" }], // 28px
        "4xl": ["2.25rem", { lineHeight: "1.2" }], // 36px
        "5xl": ["3rem", { lineHeight: "1.1" }], // 48px
        "6xl": ["3.75rem", { lineHeight: "1.1" }], // 60px
        "7xl": ["4.5rem", { lineHeight: "1.0" }], // 72px
        display: ["5rem", { lineHeight: "1.0" }], // 80px
      },

      // ===========================================
      // BORDER RADIUS
      // ===========================================
      borderRadius: {
        none: "0",
        sm: "8px",
        DEFAULT: "12px",
        md: "16px",
        lg: "20px",
        xl: "25px",
        "2xl": "32px",
        full: "9999px",
      },

      // ===========================================
      // BOX SHADOWS - Warm stone-inspired
      // ===========================================
      boxShadow: {
        none: "none",
        xs: "0 1px 2px rgba(61, 54, 50, 0.06)",
        sm: "0 2px 4px rgba(61, 54, 50, 0.08), 0 1px 2px rgba(61, 54, 50, 0.04)",
        DEFAULT: "0 4px 8px rgba(61, 54, 50, 0.10), 0 2px 4px rgba(61, 54, 50, 0.06)",
        md: "0 6px 12px rgba(61, 54, 50, 0.10), 0 3px 6px rgba(61, 54, 50, 0.06)",
        lg: "0 8px 16px rgba(61, 54, 50, 0.12), 0 4px 8px rgba(61, 54, 50, 0.08)",
        xl: "0 16px 32px rgba(61, 54, 50, 0.14), 0 8px 16px rgba(61, 54, 50, 0.10)",
        "2xl": "0 24px 48px rgba(61, 54, 50, 0.18), 0 12px 24px rgba(61, 54, 50, 0.12)",
        inner: "inset 0 2px 4px rgba(61, 54, 50, 0.06)",
        // Gold glow effects
        "glow-gold": "0 0 20px rgba(201, 148, 61, 0.25)",
        "glow-gold-sm": "0 0 10px rgba(201, 148, 61, 0.20)",
        "glow-gold-lg": "0 0 40px rgba(201, 148, 61, 0.30)",
        // Dark mode shadows
        "dark-sm": "0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)",
        "dark-md": "0 4px 8px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)",
        "dark-lg": "0 8px 16px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.4)",
        "dark-xl": "0 16px 32px rgba(0, 0, 0, 0.6), 0 8px 16px rgba(0, 0, 0, 0.5)",
        // Inset for inputs
        "inset-gold": "inset 0 0 0 1px rgba(201, 148, 61, 0.3)",
      },

      // ===========================================
      // ANIMATIONS & TRANSITIONS
      // Refined, subtle - Roman dignity
      // ===========================================
      transitionDuration: {
        fast: "150ms",
        DEFAULT: "250ms",
        slow: "400ms",
        slower: "600ms",
      },
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
        in: "cubic-bezier(0.4, 0, 1, 1)",
        out: "cubic-bezier(0, 0, 0.2, 1)",
        "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      animation: {
        "fade-in": "fadeIn 250ms ease-out",
        "fade-out": "fadeOut 250ms ease-in",
        "slide-up": "slideUp 400ms ease-out",
        "slide-down": "slideDown 400ms ease-out",
        "scale-in": "scaleIn 250ms ease-out",
        "shimmer-gold": "shimmerGold 2s ease-in-out infinite",
        "pulse-subtle": "pulseSubtle 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { scale: "0.96", opacity: "0" },
          "100%": { scale: "1", opacity: "1" },
        },
        shimmerGold: {
          "0%, 100%": { opacity: "0.8" },
          "50%": { opacity: "1" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
      },

      // ===========================================
      // CONTAINER & LAYOUT
      // ===========================================
      maxWidth: {
        prose: "65ch",
        content: "1440px",
        wide: "1840px",
      },

      // ===========================================
      // BACKDROP BLUR
      // ===========================================
      backdropBlur: {
        xs: "2px",
      },

      // ===========================================
      // BACKGROUND IMAGE - Marble texture
      // ===========================================
      backgroundImage: {
        "marble-texture": `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        "gold-gradient": "linear-gradient(135deg, #E2B055 0%, #C9943D 50%, #A67A2E 100%)",
        "marble-gradient": "linear-gradient(180deg, #FDFCFB 0%, #F3EFE9 100%)",
        "slate-gradient": "linear-gradient(180deg, #1E293B 0%, #0F172A 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
