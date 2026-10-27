/**
 * AquaGalaxy / UDHAYA AQUATICS Official Brand Theme
 * Derived directly from the official logo:
 * - Fiery Red-Orange Guppy Fish: #FF4D2D / #FF3820
 * - Deep Marine Ocean Navy (Brand typography & deep waters): #0A2540 / #0077B6
 * - Luminous Aquatic Cyan (Water ripples & bubbles): #00B4D8 / #38BDF8
 * - Seaweed & Live Aquatic Plants: #059669 / #10B981
 */

export const lightColors = {
  // Brand Logo Primary & Accent Colors
  primary: "#0077B6", // Deep vibrant aquatic blue (from logo water ripple)
  primaryDark: "#0A2540", // Deep Marine Navy (from "UDHAYA AQUATICS" brand typography)
  primaryLight: "#E0F2FE", // Soft water surface
  accent: "#FF4D2D", // Fiery scarlet-orange (from the vibrant Guppy fish)
  accentGold: "#FFA726", // Golden-amber highlight (fish fin highlights)
  secondary: "#059669", // Vibrant seaweed emerald (aquatic plants at base of logo)
  secondaryLight: "#D1FAE5",

  // Layout & Backgrounds
  background: "#F4F9FD", // Crystal clear water tinted white
  surface: "#FFFFFF", // Pure white card surface
  surfaceVariant: "#EBF4FA", // Layered water shelf
  card: "#FFFFFF",

  // Typography (Marine navy tones for high legibility and brand alignment)
  text: "#0A2540", // Deep marine navy text (same as logo title)
  textSecondary: "#335372", // Soft aquatic slate
  textMuted: "#7B9DBA", // Muted marine slate
  border: "#D6E8F5", // Subtle aquatic border

  // Feedback & Action Badges
  success: "#059669", // Plant green
  warning: "#F59E0B", // Fin amber
  danger: "#FF3820", // Fiery fish scarlet (discount badge, favorite heart, alert)
  dangerLight: "#FFEAE6",

  // Order Fulfillment Status
  statusPending: "#F59E0B",
  statusProcessing: "#0077B6",
  statusShipped: "#7C3AED",
  statusDelivered: "#059669",
  statusCancelled: "#FF3820",

  // Neutrals
  white: "#FFFFFF",
  black: "#000000",
  brandNavy: "#0A2540",
};

export const darkColors = {
  // Brand Logo Underwater Night Aquarium (Luminous bio-glow)
  primary: "#38BDF8", // Glowing electric water blue
  primaryDark: "#0077B6",
  primaryLight: "#0C365E",
  accent: "#FF5E3A", // Glowing fiery orange fish accent
  accentGold: "#FBBF24",
  secondary: "#10B981", // Bioluminescent plant emerald
  secondaryLight: "#064E3B",

  // Layout & Backgrounds (Midnight illuminated aquarium depth)
  background: "#041527", // Midnight deep ocean background
  surface: "#08213B", // Illuminated reef card surface
  surfaceVariant: "#0D2C4D", // Layered reef shelf
  card: "#08213B",

  // Typography (Luminous sea-foam whites and ice blues)
  text: "#F0F8FF", // Sea-foam white text
  textSecondary: "#A2C7E5", // Light water blue text
  textMuted: "#608BAE", // Deep ocean muted text
  border: "#12375C", // Reef boundary border

  // Feedback & Action Badges
  success: "#34D399",
  warning: "#FBBF24",
  danger: "#FF5236", // Glowing scarlet
  dangerLight: "#3B140E",

  // Order Fulfillment Status
  statusPending: "#FBBF24",
  statusProcessing: "#38BDF8",
  statusShipped: "#A78BFA",
  statusDelivered: "#34D399",
  statusCancelled: "#FF5236",

  // Neutrals
  white: "#FFFFFF",
  black: "#000000",
  brandNavy: "#041527",
};

export default {
  light: lightColors,
  dark: darkColors,
};
