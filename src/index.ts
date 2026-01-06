// Styled components
export { ShareMenuContent } from "./ShareMenuContent";
export { ShareMenuDrawer } from "./ShareMenuDrawer";

// Headless hook
export { useShareMenu, type UseShareMenuOptions } from "./hooks";

// Types
export type {
  ShareMenuContentProps,
  ShareMenuDrawerProps,
  ShareMenuContentClassNames,
  ShareMenuDrawerClassNames,
  ShareOption,
  ShareButtonConfig,
  UseShareMenuReturn,
  PreviewType,
  PreviewConfig,
} from "./types";

// CSS Variables for UI (drawer, title, etc.)
export { CSS_VARS_UI, CSS_VAR_UI_DEFAULTS } from "./types";
// Legacy exports (deprecated but kept for backwards compatibility)
export { CSS_VARS, CSS_VAR_DEFAULTS } from "./types";

// Platform configs (colors, icons, labels) - SINGLE SOURCE OF TRUTH
export {
  PLATFORMS,
  PLATFORM_IDS,
  PLATFORM_COLORS,
  PLATFORM_ICONS,
  PLATFORM_LABELS,
  PLATFORM_CSS_VARS,
  getPlatform,
  getAllPlatforms,
  getPlatformColor,
  getPlatformIcon,
  getPlatformLabel,
  generateCssVarDefaults,
  type PlatformConfig,
  type PlatformColor,
} from "./platforms";

// Utility functions for custom implementations
export { cn, openUrl, getSafeUrl } from "./utils";

// Individual share functions
export {
  shareToWhatsApp,
  shareToTelegram,
  shareToX,
  shareToFacebook,
  openInstagram,
  openTikTok,
  openThreads,
  shareToSnapchat,
  shareViaSMS,
  shareViaEmail,
  shareToLinkedIn,
  shareToReddit,
} from "./share-functions";
