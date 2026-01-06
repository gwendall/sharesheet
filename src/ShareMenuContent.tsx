"use client";

import { useMemo, useState, useCallback } from "react";
import { Image, FileText, Music, Film, Link2, Play } from "lucide-react";
import { cn } from "./utils";
import { useShareMenu } from "./hooks";
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
  type ShareMenuContentProps,
  type ShareOption,
  type ShareButtonConfig,
  type PreviewConfig,
  type PreviewType,
} from "./types";

const DEFAULT_BUTTON_SIZE = 45;
const DEFAULT_ICON_SIZE = 22;

// File extension mappings
const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico", "avif"];
const VIDEO_EXTENSIONS = ["mp4", "webm", "mov", "avi", "mkv", "m4v", "ogv"];
const AUDIO_EXTENSIONS = ["mp3", "wav", "ogg", "m4a", "aac", "flac", "wma"];

// Detect content type from URL
function detectPreviewType(url: string): PreviewType {
  try {
    const pathname = new URL(url, "http://localhost").pathname;
    const ext = pathname.split(".").pop()?.toLowerCase() || "";
    
    if (IMAGE_EXTENSIONS.includes(ext)) return "image";
    if (VIDEO_EXTENSIONS.includes(ext)) return "video";
    if (AUDIO_EXTENSIONS.includes(ext)) return "audio";
    
    // Check for common patterns
    if (url.includes("/api/og") || url.includes("og-image")) return "image";
    if (url.includes("youtube.com") || url.includes("vimeo.com")) return "video";
    
    return "link";
  } catch {
    return "link";
  }
}

// Get filename from URL
function getFilenameFromUrl(url: string): string {
  try {
    const pathname = new URL(url, "http://localhost").pathname;
    const filename = pathname.split("/").pop() || "";
    return decodeURIComponent(filename);
  } catch {
    return url;
  }
}

// Default class names
const defaultClasses = {
  root: "max-w-md mx-auto",
  header: "text-center mb-2",
  title: "text-2xl font-black",
  subtitle: "mt-1 text-sm",
  preview: "flex justify-center mb-4 px-4",
  previewSkeleton: "rounded-lg overflow-hidden",
  previewImage: "rounded-lg object-contain",
  previewVideo: "rounded-lg object-contain",
  previewFile: "rounded-lg flex items-center gap-3 px-4 py-3",
  previewFileIcon: "flex-shrink-0",
  previewFilename: "text-sm font-medium truncate",
  previewLink: "rounded-lg flex items-center gap-3 px-4 py-3",
  grid: "px-2 py-6 flex flex-row items-center gap-4 gap-y-6 flex-wrap justify-center",
  button: "flex flex-col items-center gap-0 text-xs w-[60px] outline-none cursor-pointer group",
  buttonIcon: "p-2 rounded-full transition-all flex items-center justify-center group-hover:scale-110 group-active:scale-95 mb-2",
  buttonLabel: "",
};

// Shimmer keyframes as inline style
const shimmerKeyframes = `
@keyframes share-menu-shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
`;

// Helper to create var() with fallback
function cssVar(name: string, fallback: string): string {
  return `var(${name}, ${fallback})`;
}

// Normalize preview prop to PreviewConfig
function normalizePreview(preview: string | PreviewConfig | null | undefined): PreviewConfig | null {
  if (!preview) return null;
  
  if (typeof preview === "string") {
    const type = detectPreviewType(preview);
    return {
      url: preview,
      type,
      filename: getFilenameFromUrl(preview),
    };
  }
  
  // It's already a config object
  const type = preview.type === "auto" || !preview.type ? detectPreviewType(preview.url) : preview.type;
  
  return {
    ...preview,
    type,
    filename: preview.filename || getFilenameFromUrl(preview.url),
  };
}

export function ShareMenuContent({
  title = "Share",
  shareUrl,
  shareText,
  preview,
  downloadUrl,
  downloadFilename,
  className,
  classNames = {},
  buttonSize = DEFAULT_BUTTON_SIZE,
  iconSize = DEFAULT_ICON_SIZE,
  onNativeShare,
  onCopy,
  onDownload,
  hide = [],
  show,
  labels = {},
  icons = {},
}: ShareMenuContentProps) {
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [mediaError, setMediaError] = useState(false);

  const handleMediaLoad = useCallback(() => {
    setMediaLoaded(true);
  }, []);

  const handleMediaError = useCallback(() => {
    setMediaError(true);
  }, []);

  // Normalize preview config
  const previewConfig = useMemo(() => normalizePreview(preview), [preview]);

  const shareMenu = useShareMenu({
    shareUrl,
    shareText,
    downloadUrl,
    downloadFilename,
    emailSubject: title,
    onNativeShare,
    onCopy,
    onDownload,
  });

  // Map platform IDs to their share actions
  const shareActions: Record<ShareOption, () => void> = useMemo(() => ({
    native: () => void shareMenu.nativeShare(),
    copy: () => void shareMenu.copyLink(),
    download: () => void shareMenu.downloadFile(),
    whatsapp: shareMenu.shareWhatsApp,
    telegram: shareMenu.shareTelegram,
    instagram: shareMenu.shareInstagram,
    facebook: shareMenu.shareFacebook,
    snapchat: shareMenu.shareSnapchat,
    sms: shareMenu.shareSMS,
    email: shareMenu.shareEmail,
    linkedin: shareMenu.shareLinkedIn,
    reddit: shareMenu.shareReddit,
    x: shareMenu.shareX,
    tiktok: shareMenu.shareTikTok,
    threads: shareMenu.shareThreads,
  }), [shareMenu]);

  // Dynamic labels that depend on state
  const dynamicLabels: Partial<Record<ShareOption, string>> = useMemo(() => ({
    copy: shareMenu.copied ? "Copied!" : PLATFORM_LABELS.copy,
    download: shareMenu.downloading ? "..." : PLATFORM_LABELS.download,
  }), [shareMenu.copied, shareMenu.downloading]);

  // Build button configs from platform data
  const buttons: ShareButtonConfig[] = useMemo(() => {
    return PLATFORM_IDS.map((id) => {
      const Icon = PLATFORM_ICONS[id];
      const defaultLabel = dynamicLabels[id] ?? PLATFORM_LABELS[id];
      
      return {
        id,
        label: labels[id] ?? defaultLabel,
        icon: icons[id] ?? <Icon size={iconSize} />,
        // Use CSS var with fallback to platform color
        bgColor: cssVar(PLATFORM_CSS_VARS[id], PLATFORM_COLORS[id].bg),
        textColor: PLATFORM_COLORS[id].text,
        onClick: shareActions[id],
        // Conditions for showing certain buttons
        condition: id === "native" ? shareMenu.canNativeShare
          : id === "download" ? !!downloadUrl
          : true,
      };
    });
  }, [iconSize, labels, icons, dynamicLabels, shareActions, shareMenu.canNativeShare, downloadUrl]);

  const visibleButtons = useMemo(() => {
    return buttons.filter((btn) => {
      // Check condition (e.g., canNativeShare, downloadUrl exists)
      if (btn.condition === false) return false;
      // Filter by show list if provided
      if (show && show.length > 0) return show.includes(btn.id);
      // Filter by hide list
      if (hide.includes(btn.id)) return false;
      return true;
    });
  }, [buttons, show, hide]);

  const showPreview = previewConfig && !mediaError;

  // Render preview based on type
  const renderPreview = () => {
    if (!previewConfig || mediaError) return null;

    const { type, url, filename, alt, poster } = previewConfig;
    const bgColor = cssVar(CSS_VARS_UI.previewBg, CSS_VAR_UI_DEFAULTS[CSS_VARS_UI.previewBg]);
    const shimmerColor = cssVar(CSS_VARS_UI.previewShimmer, CSS_VAR_UI_DEFAULTS[CSS_VARS_UI.previewShimmer]);
    const textColor = cssVar(CSS_VARS_UI.subtitleColor, CSS_VAR_UI_DEFAULTS[CSS_VARS_UI.subtitleColor]);

    // Common skeleton wrapper for media
    const MediaSkeleton = ({ children, isLoading }: { children: React.ReactNode; isLoading: boolean }) => (
      <div
        className={cn(defaultClasses.previewSkeleton, classNames.previewSkeleton)}
        style={{
          position: "relative",
          backgroundColor: bgColor,
          maxWidth: "100%",
          maxHeight: "200px",
          minHeight: isLoading ? "120px" : undefined,
          minWidth: isLoading ? "200px" : undefined,
          overflow: "hidden",
        }}
      >
        {isLoading && (
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
                animation: "share-menu-shimmer 1.5s infinite",
              }}
            />
          </div>
        )}
        {children}
      </div>
    );

    // File/Audio preview component
    const FilePreview = ({ icon: IconComponent, label }: { icon: typeof FileText; label: string }) => (
      <div
        className={cn(defaultClasses.previewFile, classNames.previewFile)}
        style={{ backgroundColor: bgColor }}
      >
        <div className={cn(defaultClasses.previewFileIcon, classNames.previewFileIcon)}>
          <IconComponent size={32} style={{ color: textColor }} />
        </div>
        <div
          className={cn(defaultClasses.previewFilename, classNames.previewFilename)}
          style={{ color: textColor, maxWidth: "200px" }}
        >
          {label}
        </div>
      </div>
    );

    switch (type) {
      case "image":
        return (
          <MediaSkeleton isLoading={!mediaLoaded}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={alt || "Preview"}
              onLoad={handleMediaLoad}
              onError={handleMediaError}
              className={cn(defaultClasses.previewImage, classNames.previewImage)}
              style={{
                maxWidth: "100%",
                maxHeight: "200px",
                display: "block",
                opacity: mediaLoaded ? 1 : 0,
                transition: "opacity 0.3s ease-in-out",
              }}
            />
          </MediaSkeleton>
        );

      case "video":
        return (
          <MediaSkeleton isLoading={!mediaLoaded}>
            <div style={{ position: "relative" }}>
              <video
                src={url}
                poster={poster}
                onLoadedData={handleMediaLoad}
                onError={handleMediaError}
                className={cn(defaultClasses.previewVideo, classNames.previewVideo)}
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  display: "block",
                  opacity: mediaLoaded ? 1 : 0,
                  transition: "opacity 0.3s ease-in-out",
                }}
                muted
                playsInline
                preload="metadata"
              />
              {/* Play icon overlay */}
              {mediaLoaded && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      borderRadius: "50%",
                      padding: "12px",
                    }}
                  >
                    <Play size={24} fill="white" color="white" />
                  </div>
                </div>
              )}
            </div>
          </MediaSkeleton>
        );

      case "audio":
        return <FilePreview icon={Music} label={filename || "Audio file"} />;

      case "file":
        return <FilePreview icon={FileText} label={filename || "File"} />;

      case "link":
      default:
        // For links, show a simple link preview
        return (
          <div
            className={cn(defaultClasses.previewLink, classNames.previewLink)}
            style={{ backgroundColor: bgColor }}
          >
            <div className={cn(defaultClasses.previewFileIcon, classNames.previewFileIcon)}>
              <Link2 size={24} style={{ color: textColor }} />
            </div>
            <div
              className={cn(defaultClasses.previewFilename, classNames.previewFilename)}
              style={{ color: textColor, maxWidth: "250px" }}
            >
              {url}
            </div>
          </div>
        );
    }
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

      {/* Content Preview */}
      {showPreview && (
        <div className={cn(defaultClasses.preview, classNames.preview)}>
          {renderPreview()}
        </div>
      )}

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
