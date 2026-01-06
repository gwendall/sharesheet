"use client";

import type { ReactNode } from "react";
import {
  Download,
  Link as LinkIcon,
  Mail,
  MessageCircle,
  Send,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaReddit,
  FaTelegramPlane,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter, FaThreads, FaSnapchat } from "react-icons/fa6";
import type { ShareOption } from "./types";

/** Platform color configuration */
export interface PlatformColor {
  /** Background color (hex) */
  bg: string;
  /** Text/icon color (hex) */
  text: string;
}

/** Platform configuration */
export interface PlatformConfig {
  /** Platform identifier */
  id: ShareOption;
  /** Display label */
  label: string;
  /** Colors */
  colors: PlatformColor;
  /** Icon component (accepts size prop) */
  Icon: (props: { size?: number; className?: string }) => ReactNode;
  /** CSS variable name for background */
  cssVar: string;
}

/** All platform IDs in default order */
export const PLATFORM_IDS: readonly ShareOption[] = [
  "native",
  "copy",
  "download",
  "whatsapp",
  "telegram",
  "instagram",
  "facebook",
  "snapchat",
  "sms",
  "email",
  "linkedin",
  "reddit",
  "x",
  "tiktok",
  "threads",
] as const;

/** Platform colors - hex values for each platform (SOURCE OF TRUTH) */
export const PLATFORM_COLORS: Record<ShareOption, PlatformColor> = {
  native: { bg: "#7c3aed", text: "#ffffff" },
  copy: { bg: "#3b82f6", text: "#ffffff" },
  download: { bg: "#ef4444", text: "#ffffff" },
  whatsapp: { bg: "#25D366", text: "#ffffff" },
  telegram: { bg: "#229ED9", text: "#ffffff" },
  instagram: { bg: "#E1306C", text: "#ffffff" },
  facebook: { bg: "#1877F2", text: "#ffffff" },
  snapchat: { bg: "#FFFC00", text: "#000000" },
  sms: { bg: "#22c55e", text: "#ffffff" },
  email: { bg: "#f97316", text: "#ffffff" },
  linkedin: { bg: "#0A66C2", text: "#ffffff" },
  reddit: { bg: "#FF4500", text: "#ffffff" },
  x: { bg: "#000000", text: "#ffffff" },
  tiktok: { bg: "#000000", text: "#ffffff" },
  threads: { bg: "#000000", text: "#ffffff" },
} as const;

/** Platform labels (SOURCE OF TRUTH) */
export const PLATFORM_LABELS: Record<ShareOption, string> = {
  native: "Share…",
  copy: "Copy",
  download: "Download",
  whatsapp: "WhatsApp",
  telegram: "Telegram",
  instagram: "Instagram",
  facebook: "Facebook",
  snapchat: "Snapchat",
  sms: "SMS",
  email: "Email",
  linkedin: "LinkedIn",
  reddit: "Reddit",
  x: "X",
  tiktok: "TikTok",
  threads: "Threads",
} as const;

/** Platform icons - React components (SOURCE OF TRUTH) */
export const PLATFORM_ICONS: Record<ShareOption, (props: { size?: number; className?: string }) => ReactNode> = {
  native: ({ size = 22, className }) => <Send size={size} className={className} />,
  copy: ({ size = 22, className }) => <LinkIcon size={size} className={className} />,
  download: ({ size = 22, className }) => <Download size={size} className={className} />,
  whatsapp: ({ size = 22, className }) => <FaWhatsapp size={size} className={className} />,
  telegram: ({ size = 22, className }) => <FaTelegramPlane size={size} className={className} />,
  instagram: ({ size = 22, className }) => <FaInstagram size={size} className={className} />,
  facebook: ({ size = 22, className }) => <FaFacebookF size={size} className={className} />,
  snapchat: ({ size = 22, className }) => <FaSnapchat size={size} className={className} />,
  sms: ({ size = 22, className }) => <MessageCircle size={size} className={className} />,
  email: ({ size = 22, className }) => <Mail size={size} className={className} />,
  linkedin: ({ size = 22, className }) => <FaLinkedin size={size} className={className} />,
  reddit: ({ size = 22, className }) => <FaReddit size={size} className={className} />,
  x: ({ size = 22, className }) => <FaXTwitter size={size} className={className} />,
  tiktok: ({ size = 22, className }) => <FaTiktok size={size} className={className} />,
  threads: ({ size = 22, className }) => <FaThreads size={size} className={className} />,
} as const;

/** CSS variable names for platform backgrounds */
export const PLATFORM_CSS_VARS: Record<ShareOption, string> = {
  native: "--share-menu-native-share-bg",
  copy: "--share-menu-copy-bg",
  download: "--share-menu-download-bg",
  whatsapp: "--share-menu-whatsapp-bg",
  telegram: "--share-menu-telegram-bg",
  instagram: "--share-menu-instagram-bg",
  facebook: "--share-menu-facebook-bg",
  snapchat: "--share-menu-snapchat-bg",
  sms: "--share-menu-sms-bg",
  email: "--share-menu-email-bg",
  linkedin: "--share-menu-linkedin-bg",
  reddit: "--share-menu-reddit-bg",
  x: "--share-menu-x-bg",
  tiktok: "--share-menu-tiktok-bg",
  threads: "--share-menu-threads-bg",
} as const;

/** Full platform configurations */
export const PLATFORMS: Record<ShareOption, PlatformConfig> = Object.fromEntries(
  PLATFORM_IDS.map((id) => [
    id,
    {
      id,
      label: PLATFORM_LABELS[id],
      colors: PLATFORM_COLORS[id],
      Icon: PLATFORM_ICONS[id],
      cssVar: PLATFORM_CSS_VARS[id],
    },
  ])
) as Record<ShareOption, PlatformConfig>;

/** Get platform config by id */
export function getPlatform(id: ShareOption): PlatformConfig {
  return PLATFORMS[id];
}

/** Get all platform configs as array */
export function getAllPlatforms(): PlatformConfig[] {
  return PLATFORM_IDS.map((id) => PLATFORMS[id]);
}

/** Get platform color */
export function getPlatformColor(id: ShareOption): PlatformColor {
  return PLATFORM_COLORS[id];
}

/** Get platform icon component */
export function getPlatformIcon(id: ShareOption): (props: { size?: number; className?: string }) => ReactNode {
  return PLATFORM_ICONS[id];
}

/** Get platform label */
export function getPlatformLabel(id: ShareOption): string {
  return PLATFORM_LABELS[id];
}

/** Generate CSS variable defaults from platform colors */
export function generateCssVarDefaults(): Record<string, string> {
  const defaults: Record<string, string> = {};
  PLATFORM_IDS.forEach((id) => {
    defaults[PLATFORM_CSS_VARS[id]] = PLATFORM_COLORS[id].bg;
  });
  return defaults;
}
