import type { ReactNode } from "react";

/** CSS variable names for UI elements (non-platform specific) */
export const CSS_VARS_UI = {
  // Drawer
  overlayBg: "--sharesheet-overlay-bg",
  drawerBg: "--sharesheet-drawer-bg",
  drawerBorder: "--sharesheet-drawer-border",
  handleBg: "--sharesheet-handle-bg",
  // Content
  titleColor: "--sharesheet-title-color",
  subtitleColor: "--sharesheet-subtitle-color",
  buttonLabelColor: "--sharesheet-button-label-color",
  // Preview
  previewBg: "--sharesheet-preview-bg",
  previewShimmer: "--sharesheet-preview-shimmer",
} as const;

/** Default values for UI CSS variables */
export const CSS_VAR_UI_DEFAULTS = {
  [CSS_VARS_UI.overlayBg]: "rgba(0, 0, 0, 0.7)",
  [CSS_VARS_UI.drawerBg]: "#09090b",
  [CSS_VARS_UI.drawerBorder]: "#27272a",
  [CSS_VARS_UI.handleBg]: "rgba(255, 255, 255, 0.2)",
  [CSS_VARS_UI.titleColor]: "#ffffff",
  [CSS_VARS_UI.subtitleColor]: "#a1a1aa",
  [CSS_VARS_UI.buttonLabelColor]: "#ffffff",
  [CSS_VARS_UI.previewBg]: "rgba(255, 255, 255, 0.05)",
  [CSS_VARS_UI.previewShimmer]: "rgba(255, 255, 255, 0.1)",
} as const;

/** Available share options */
export type ShareOption =
  | "native"
  | "copy"
  | "download"
  | "whatsapp"
  | "telegram"
  | "instagram"
  | "facebook"
  | "snapchat"
  | "sms"
  | "email"
  | "linkedin"
  | "reddit"
  | "x"
  | "tiktok"
  | "threads";

/** Class name overrides for ShareSheetContent */
export interface ShareSheetContentClassNames {
  /** Root container */
  root?: string;
  /** Title container */
  header?: string;
  /** Main title text */
  title?: string;
  /** Subtitle/share text */
  subtitle?: string;
  /** Preview container */
  preview?: string;
  /** Preview skeleton/loading wrapper */
  previewSkeleton?: string;
  /** Preview image element */
  previewImage?: string;
  /** Preview video element */
  previewVideo?: string;
  /** Preview file/audio container */
  previewFile?: string;
  /** Preview file icon */
  previewFileIcon?: string;
  /** Preview filename text */
  previewFilename?: string;
  /** Preview link container */
  previewLink?: string;
  /** Buttons grid container */
  grid?: string;
  /** Individual button wrapper */
  button?: string;
  /** Button icon container */
  buttonIcon?: string;
  /** Button label text */
  buttonLabel?: string;
}

/** Class name overrides for ShareSheetDrawer */
export interface ShareSheetDrawerClassNames extends ShareSheetContentClassNames {
  /** Drawer overlay */
  overlay?: string;
  /** Drawer content panel */
  drawer?: string;
  /** Drawer inner content wrapper */
  drawerInner?: string;
  /** Drawer handle */
  handle?: string;
  /** Trigger wrapper */
  trigger?: string;
}

export interface ShareSheetContentProps {
  /** Title displayed at the top of the sheet */
  title?: string;
  /** URL to share (OG preview will be fetched automatically) */
  shareUrl: string;
  /** Text to share alongside the URL */
  shareText: string;
  /** Optional URL for download functionality */
  downloadUrl?: string | null;
  /** Filename for downloaded file */
  downloadFilename?: string;
  /** Custom preview image URL (skips OG fetching if provided) */
  previewImage?: string | null;
  /** File to share via native share (data URL or Blob) - takes priority over URL sharing */
  shareFile?: string | Blob | null;
  /** Filename for the shared file */
  shareFilename?: string;
  /** Custom class name for the container (shorthand for classNames.root) */
  className?: string;
  /** Override class names for sub-components */
  classNames?: ShareSheetContentClassNames;
  /** Button size in pixels */
  buttonSize?: number;
  /** Icon size in pixels */
  iconSize?: number;
  /** Called when native share is triggered */
  onNativeShare?: () => void;
  /** Called when link is copied */
  onCopy?: () => void;
  /** Called when download starts */
  onDownload?: () => void;
  /** Called on every share option click, with the option id (analytics-friendly) */
  onShare?: (option: ShareOption) => void;
  /** Hide specific share options */
  hide?: ShareOption[];
  /** Show only these platforms, in this exact order */
  show?: ShareOption[];
  /** Custom labels for buttons */
  labels?: Partial<Record<ShareOption, string>>;
  /** Custom icons for buttons */
  icons?: Partial<Record<ShareOption, ReactNode>>;
}

export interface ShareSheetDrawerProps extends ShareSheetContentProps {
  /** Whether the drawer is disabled */
  disabled?: boolean;
  /** Trigger element for the drawer */
  children: React.ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Override class names for sub-components */
  classNames?: ShareSheetDrawerClassNames;
}

/** Share button configuration (internal) */
export interface ShareButtonConfig {
  id: ShareOption;
  label: string;
  icon: ReactNode;
  bgColor: string;
  textColor?: string;
  onClick: () => void;
  condition?: boolean;
}

/** Platform availability status */
export interface PlatformAvailability {
  /** Whether the platform is available on this device */
  available: boolean;
  /** Reason why platform is unavailable (if applicable) */
  reason?: string;
}

/** Return type of useShareSheet hook */
export interface UseShareSheetReturn {
  /** Whether the browser supports native share */
  canNativeShare: boolean;
  /** Whether the link was recently copied */
  copied: boolean;
  /** Whether a download is in progress */
  downloading: boolean;
  /** The safe URL (falls back to current page URL) */
  safeUrl: string;
  /** Whether the current device is mobile */
  isMobile: boolean;
  /** Availability status for each platform */
  platformAvailability: Record<ShareOption, PlatformAvailability>;
  /** Copy the share URL to clipboard */
  copyLink: () => Promise<void>;
  /** Trigger native share dialog */
  nativeShare: () => Promise<void>;
  /** Download the file from downloadUrl */
  downloadFile: () => Promise<void>;
  /** Share to WhatsApp */
  shareWhatsApp: () => void;
  /** Share to Telegram */
  shareTelegram: () => void;
  /** Share to X (Twitter) */
  shareX: () => void;
  /** Share to Facebook */
  shareFacebook: () => void;
  /** Open Instagram app (mobile only - will warn on desktop) */
  shareInstagram: () => void;
  /** Open TikTok app (mobile only - will warn on desktop) */
  shareTikTok: () => void;
  /** Open Threads app (mobile only - will warn on desktop) */
  shareThreads: () => void;
  /** Share to Snapchat */
  shareSnapchat: () => void;
  /** Share via SMS (mobile only - will warn on desktop) */
  shareSMS: () => void;
  /** Share via Email */
  shareEmail: () => void;
  /** Share to LinkedIn */
  shareLinkedIn: () => void;
  /** Share to Reddit */
  shareReddit: () => void;
}

// Legacy exports for backwards compatibility
/** @deprecated Use CSS_VARS_UI instead */
export const CSS_VARS = CSS_VARS_UI;
/** @deprecated Use CSS_VAR_UI_DEFAULTS instead */
export const CSS_VAR_DEFAULTS = CSS_VAR_UI_DEFAULTS;

// Legacy type aliases for backwards compatibility
/** @deprecated Use ShareSheetContentClassNames instead */
export type ShareMenuContentClassNames = ShareSheetContentClassNames;
/** @deprecated Use ShareSheetDrawerClassNames instead */
export type ShareMenuDrawerClassNames = ShareSheetDrawerClassNames;
/** @deprecated Use ShareSheetContentProps instead */
export type ShareMenuContentProps = ShareSheetContentProps;
/** @deprecated Use ShareSheetDrawerProps instead */
export type ShareMenuDrawerProps = ShareSheetDrawerProps;
/** @deprecated Use UseShareSheetReturn instead */
export type UseShareMenuReturn = UseShareSheetReturn;
