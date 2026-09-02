"use client";

import { useMemo, useState, useCallback } from "react";
import { LuImage, LuLink2 } from "react-icons/lu";
import { cn } from "./utils";
import { useShareSheet, useOGData } from "./hooks";
import {
  PLATFORM_IDS,
  PLATFORM_COLORS,
  PLATFORM_LABELS,
  PLATFORM_ICONS,
  PLATFORM_CSS_VARS,
} from "./platforms";
import {
  CSS_VARS_UI,
  CSS_VAR_UI_DEFAULTS,
  type ShareSheetContentProps,
  type ShareOption,
  type ShareButtonConfig,
} from "./types";

const DEFAULT_BUTTON_SIZE = 45;
const DEFAULT_ICON_SIZE = 22;

// Default class names
const defaultClasses = {
  root: "max-w-md mx-auto",
  header: "text-center mb-2",
  title: "text-2xl font-black",
  subtitle: "mt-1 text-sm",
  preview: "flex justify-center my-4 px-4",
  previewSkeleton: "rounded-xl overflow-hidden",
  previewImage: "border border-white/10 rounded-xl",
  previewMeta: "",
  grid: "px-2 py-6 flex flex-row items-start gap-4 gap-y-6 flex-wrap justify-center",
  button: "flex flex-col items-center gap-0 text-xs w-[60px] outline-none cursor-pointer group",
  buttonIcon: "p-2 rounded-full transition-all flex items-center justify-center group-hover:scale-110 group-active:scale-95 mb-2",
  buttonLabel: "",
};

// Shimmer and fade-in keyframes as inline style
const shimmerKeyframes = `
@keyframes sharesheet-shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
@keyframes sharesheet-fadein {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
.sharesheet-fadein {
  animation: sharesheet-fadein 0.3s ease-out forwards;
}
`;

// Helper to create var() with fallback
function cssVar(name: string, fallback: string): string {
  return `var(${name}, ${fallback})`;
}

export function ShareSheetContent({
  title = "Share",
  shareUrl,
  shareText,
  downloadUrl,
  downloadFilename,
  previewImage,
  shareFile,
  shareFilename,
  className,
  classNames = {},
  buttonSize = DEFAULT_BUTTON_SIZE,
  iconSize = DEFAULT_ICON_SIZE,
  onNativeShare,
  onCopy,
  onShare,
  onDownload,
  hide = [],
  show,
  labels = {},
  icons = {},
}: ShareSheetContentProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Only fetch OG data if previewImage is not provided
  const { ogData, loading: ogLoading } = useOGData(previewImage ? undefined : shareUrl);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const shareSheet = useShareSheet({
    shareUrl,
    shareText,
    downloadUrl,
    downloadFilename,
    emailSubject: shareText,
    shareFile,
    shareFilename,
    onNativeShare,
    onCopy,
    onDownload,
  });

  // Map platform IDs to their share actions
  const shareActions: Record<ShareOption, () => void> = useMemo(() => ({
    native: () => void shareSheet.nativeShare(),
    copy: () => void shareSheet.copyLink(),
    download: () => void shareSheet.downloadFile(),
    whatsapp: shareSheet.shareWhatsApp,
    telegram: shareSheet.shareTelegram,
    instagram: shareSheet.shareInstagram,
    facebook: shareSheet.shareFacebook,
    snapchat: shareSheet.shareSnapchat,
    sms: shareSheet.shareSMS,
    email: shareSheet.shareEmail,
    linkedin: shareSheet.shareLinkedIn,
    reddit: shareSheet.shareReddit,
    x: shareSheet.shareX,
    tiktok: shareSheet.shareTikTok,
    threads: shareSheet.shareThreads,
  }), [shareSheet]);

  // Dynamic labels that depend on state
  const dynamicLabels: Partial<Record<ShareOption, string>> = useMemo(() => ({
    copy: shareSheet.copied ? "Copied!" : PLATFORM_LABELS.copy,
    download: shareSheet.downloading ? "..." : PLATFORM_LABELS.download,
  }), [shareSheet.copied, shareSheet.downloading]);

  // Build button configs from platform data
  const buttons: ShareButtonConfig[] = useMemo(() => {
    return PLATFORM_IDS.map((id) => {
      const Icon = PLATFORM_ICONS[id];
      const defaultLabel = dynamicLabels[id] ?? PLATFORM_LABELS[id];
      const availability = shareSheet.platformAvailability[id];
      
      // Determine if button should be shown based on various conditions
      let condition = true;
      if (id === "native") {
        condition = shareSheet.canNativeShare;
      } else if (id === "download") {
        condition = !!downloadUrl;
      } else if (!availability.available) {
        // Hide unavailable platforms (mobile-only on desktop)
        condition = false;
      }
      
      return {
        id,
        label: labels[id] ?? defaultLabel,
        icon: icons[id] ?? <Icon size={iconSize} />,
        // Use CSS var with fallback to platform color
        bgColor: cssVar(PLATFORM_CSS_VARS[id], PLATFORM_COLORS[id].bg),
        textColor: PLATFORM_COLORS[id].text,
        onClick: () => {
          onShare?.(id);
          shareActions[id]();
        },
        condition,
      };
    });
  }, [iconSize, labels, icons, dynamicLabels, shareActions, onShare, shareSheet.canNativeShare, shareSheet.platformAvailability, downloadUrl]);

  const visibleButtons = useMemo(() => {
    // If show is provided, use its order
    if (show && show.length > 0) {
      return show
        .map((id) => buttons.find((btn) => btn.id === id))
        .filter((btn): btn is NonNullable<typeof btn> => {
          if (!btn) return false;
          if (btn.condition === false) return false;
          if (hide.includes(btn.id)) return false;
          return true;
        });
    }
    
    // Otherwise use default order with hide filtering
    return buttons.filter((btn) => {
      if (btn.condition === false) return false;
      if (hide.includes(btn.id)) return false;
      return true;
    });
  }, [buttons, show, hide]);

  const bgColor = cssVar(CSS_VARS_UI.previewBg, CSS_VAR_UI_DEFAULTS[CSS_VARS_UI.previewBg]);
  const shimmerColor = cssVar(CSS_VARS_UI.previewShimmer, CSS_VAR_UI_DEFAULTS[CSS_VARS_UI.previewShimmer]);
  const textColor = cssVar(CSS_VARS_UI.subtitleColor, CSS_VAR_UI_DEFAULTS[CSS_VARS_UI.subtitleColor]);

  // Render OG preview
  const renderPreview = () => {
    // Use previewImage if provided, otherwise use OG data
    const ogImage = previewImage || ogData?.image;
    const hasImage = ogImage && !imageError;
    const isLoading = !previewImage && ogLoading;

    // Loading state (only when fetching OG data, not when previewImage is provided)
    if (isLoading) {
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <div
            className={cn(defaultClasses.previewSkeleton, classNames.previewSkeleton)}
            style={{
              position: "relative",
              backgroundColor: bgColor,
              width: "100%",
              maxWidth: "320px",
              aspectRatio: "1.91 / 1",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
                  animation: "sharesheet-shimmer 1.5s infinite",
                }}
              />
            </div>
            <LuLink2 size={32} style={{ color: textColor, opacity: 0.4 }} />
          </div>
        </div>
      );
    }

    // No image available - show link placeholder (skip if previewImage was provided)
    if (!hasImage) {
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <div
            className={cn(defaultClasses.previewSkeleton, classNames.previewSkeleton)}
            style={{
              position: "relative",
              backgroundColor: bgColor,
              width: "100%",
              maxWidth: "320px",
              aspectRatio: "1.91 / 1",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "16px",
              }}
            >
              <LuLink2 size={32} style={{ color: textColor, opacity: 0.4 }} />
              {ogData?.title && (
                <span 
                  style={{ 
                    color: textColor, 
                    fontSize: "12px", 
                    opacity: 0.6,
                    textAlign: "center",
                    maxWidth: "280px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {ogData.title}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    }

    // If previewImage is a data URL, show it directly (no preloading needed)
    const isDataUrl = typeof ogImage === "string" && ogImage.startsWith("data:");
    if (isDataUrl) {
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ogImage}
            alt="Preview"
            className={cn(defaultClasses.previewImage, classNames.previewImage)}
            style={{
              width: "100%",
              maxWidth: "320px",
              height: "auto",
            }}
          />
        </div>
      );
    }

    // Image loading state (for remote URLs)
    if (!imageLoaded) {
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <div
            className={cn(defaultClasses.previewSkeleton, classNames.previewSkeleton)}
            style={{
              position: "relative",
              backgroundColor: bgColor,
              width: "100%",
              maxWidth: "320px",
              aspectRatio: "1.91 / 1",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
                  animation: "sharesheet-shimmer 1.5s infinite",
                }}
              />
            </div>
            <LuImage size={32} style={{ color: textColor, opacity: 0.4 }} />
          </div>
          {/* Hidden image for preloading */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ogImage}
            alt={ogData?.title || "Preview"}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ display: "none" }}
          />
        </div>
      );
    }

    // Image loaded - show it with fade-in
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ogImage}
          alt={ogData?.title || "Preview"}
          className={cn(defaultClasses.previewImage, classNames.previewImage, "sharesheet-fadein")}
          style={{
            width: "100%",
            maxWidth: "320px",
            height: "auto",
          }}
        />
      </div>
    );
  };

  return (
    <div className={cn(defaultClasses.root, classNames.root, className)}>
      {/* Inject shimmer keyframes */}
      <style dangerouslySetInnerHTML={{ __html: shimmerKeyframes }} />

      <div className={cn(defaultClasses.header, classNames.header)}>
        <div
          className={cn(defaultClasses.title, classNames.title)}
          style={{ color: cssVar(CSS_VARS_UI.titleColor, CSS_VAR_UI_DEFAULTS[CSS_VARS_UI.titleColor]) }}
        >
          {title}
        </div>
        <div
          className={cn(defaultClasses.subtitle, classNames.subtitle)}
          style={{ color: cssVar(CSS_VARS_UI.subtitleColor, CSS_VAR_UI_DEFAULTS[CSS_VARS_UI.subtitleColor]) }}
        >
          {shareText}
        </div>
      </div>

      {/* OG Preview - always shown */}
      <div className={cn(defaultClasses.preview, classNames.preview)}>
        {renderPreview()}
      </div>

      <div className={cn(defaultClasses.grid, classNames.grid)}>
        {visibleButtons.map((btn) => (
          <button
            key={btn.id}
            type="button"
            className={cn(defaultClasses.button, classNames.button)}
            onClick={btn.onClick}
          >
            <div
              className={cn(defaultClasses.buttonIcon, classNames.buttonIcon)}
              style={{
                width: buttonSize,
                height: buttonSize,
                backgroundColor: btn.bgColor,
                color: btn.textColor,
              }}
            >
              {btn.icon}
            </div>
            <div
              className={cn(defaultClasses.buttonLabel, classNames.buttonLabel)}
              style={{ color: cssVar(CSS_VARS_UI.buttonLabelColor, CSS_VAR_UI_DEFAULTS[CSS_VARS_UI.buttonLabelColor]) }}
            >
              {btn.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Legacy export for backwards compatibility
/** @deprecated Use ShareSheetContent instead */
export const ShareMenuContent = ShareSheetContent;
