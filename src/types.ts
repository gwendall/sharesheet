import type { ReactNode } from "react";

/** CSS variable names for UI elements (non-platform specific) */
export const CSS_VARS_UI = {
  // Drawer
  overlayBg: "--share-menu-overlay-bg",
  drawerBg: "--share-menu-drawer-bg",
  drawerBorder: "--share-menu-drawer-border",
  handleBg: "--share-menu-handle-bg",
  // Content
  titleColor: "--share-menu-title-color",
  subtitleColor: "--share-menu-subtitle-color",
  buttonLabelColor: "--share-menu-button-label-color",
  // Preview
  previewBg: "--share-menu-preview-bg",
  previewShimmer: "--share-menu-preview-shimmer",
} as const;

/** Default values for UI CSS variables */
export const CSS_VAR_UI_DEFAULTS = {
  [CSS_VARS_UI.overlayBg]: "rgba(0, 0, 0, 0.7)",
  [CSS_VARS_UI.drawerBg]: "#09090b",
  [CSS_VARS_UI.drawerBorder]: "#27272a",
  [CSS_VARS_UI.handleBg]: "#27272a",
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

/** Class name overrides for ShareMenuContent */
export interface ShareMenuContentClassNames {
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

/** Class name overrides for ShareMenuDrawer */
export interface ShareMenuDrawerClassNames extends ShareMenuContentClassNames {
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

/** Preview content type */
export type PreviewType = "image" | "video" | "audio" | "file" | "link" | "auto";

/** Preview configuration */
export interface PreviewConfig {
  /** URL of the content to preview */
  url: string;
  /** Type of content (auto-detected if not provided) */
  type?: PreviewType;
  /** Filename to display (for file/audio types) */
  filename?: string;
  /** Alt text for images */
  alt?: string;
  /** Poster image for videos */
  poster?: string;
}

export interface ShareMenuContentProps {
  /** Title displayed at the top of the menu */
  title?: string;
  /** URL to share */
  shareUrl: string;
  /** Text to share alongside the URL */
  shareText: string;
  /** Preview of content being shared (string URL or config object) */
  preview?: string | PreviewConfig | null;
  /** @deprecated Use preview instead */
  imageUrl?: string | null;
  /** Optional URL for download functionality */
  downloadUrl?: string | null;
  /** Filename for downloaded file */
  downloadFilename?: string;
  /** Custom class name for the container (shorthand for classNames.root) */
  className?: string;
  /** Override class names for sub-components */
  classNames?: ShareMenuContentClassNames;
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
  /** Hide specific share options */
  hide?: ShareOption[];
  /** Show only specific share options */
  show?: ShareOption[];
  /** Custom labels for buttons */
  labels?: Partial<Record<ShareOption, string>>;
  /** Custom icons for buttons */
  icons?: Partial<Record<ShareOption, ReactNode>>;
}

export interface ShareMenuDrawerProps extends ShareMenuContentProps {
  /** Whether the drawer is disabled */
  disabled?: boolean;
  /** Trigger element for the drawer */
  children: React.ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Override class names for sub-components */
  classNames?: ShareMenuDrawerClassNames;
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

/** Return type of useShareMenu hook */
export interface UseShareMenuReturn {
  /** Whether the browser supports native share */
  canNativeShare: boolean;
  /** Whether the link was recently copied */
  copied: boolean;
  /** Whether a download is in progress */
  downloading: boolean;
  /** The safe URL (falls back to current page URL) */
  safeUrl: string;
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
  /** Open Instagram app */
  shareInstagram: () => void;
  /** Open TikTok app */
  shareTikTok: () => void;
  /** Open Threads app */
  shareThreads: () => void;
  /** Share to Snapchat */
  shareSnapchat: () => void;
  /** Share via SMS */
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
