import { ENV } from "./env";

export const THEME = {
  COLORS: {
    PRIMARY: ENV.UI.PRIMARY_COLOR || "#25D366",

    BACKGROUND: "#0f0f0f",
    CARD: "#1f2937",
    SURFACE: "#1a1a1a",

    TEXT_PRIMARY: "#ffffff",
    TEXT_SECONDARY: "#cccccc",
    TEXT_MUTED: "#888888",

    BORDER: "#111111",

    SUCCESS: "#22c55e",
    DISABLED: "#444444",
  },
};