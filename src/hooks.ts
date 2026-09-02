"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { getSafeUrl, isMobileDevice, getAllPlatformAvailability } from "./utils";
import { fetchOGData, type OGData } from "./og-fetcher";
import {
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
import type { UseShareSheetReturn, PlatformAvailability, ShareOption } from "./types";

// Default platform availability (assumes desktop/all platforms available)
// This is used for SSR to avoid hydration mismatch
const DEFAULT_PLATFORM_AVAILABILITY: Record<ShareOption, PlatformAvailability> = {
  native: { available: true },
  copy: { available: true },
  download: { available: true },
  whatsapp: { available: true },
  telegram: { available: true },
  instagram: { available: true },
  facebook: { available: true },
  snapchat: { available: true },
  sms: { available: true },
  email: { available: true },
  linkedin: { available: true },
  reddit: { available: true },
  x: { available: true },
  tiktok: { available: true },
  threads: { available: true },
};

export interface UseShareSheetOptions {
  /** URL to share */
  shareUrl: string;
  /** Text to share */
  shareText: string;
  /** Download URL (optional) */
  downloadUrl?: string | null;
  /** Download filename (optional) */
  downloadFilename?: string;
  /** Email subject (optional) */
  emailSubject?: string;
  /** File to share via native share (data URL or Blob) - takes priority over URL sharing */
  shareFile?: string | Blob | null;
  /** Filename for the shared file */
  shareFilename?: string;
  /** Callback after native share */
  onNativeShare?: () => void;
  /** Callback after copy */
  onCopy?: () => void;
  /** Callback after download starts */
  onDownload?: () => void;
}

/**
 * Headless hook for share sheet functionality.
 * Use this to build your own custom share UI.
 */
export function useShareSheet({
  shareUrl,
  shareText,
  downloadUrl,
  downloadFilename,
  emailSubject = "Share",
  shareFile,
  shareFilename = "share.png",
  onNativeShare,
  onCopy,
  onDownload,
}: UseShareSheetOptions): UseShareSheetReturn {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Use state for values that depend on browser APIs to avoid hydration mismatch
  // Initial values match what server renders (conservative defaults)
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [platformAvailability, setPlatformAvailability] = useState<Record<ShareOption, PlatformAvailability>>(
    DEFAULT_PLATFORM_AVAILABILITY
  );

  // Detect browser capabilities after mount (client-side only)
  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && "share" in navigator);
    setIsMobile(isMobileDevice());
    setPlatformAvailability(getAllPlatformAvailability());
  }, []);

  const safeUrl = getSafeUrl(shareUrl);

  const copyLink = useCallback(async () => {
    if (!safeUrl) return;
    try {
      await navigator.clipboard.writeText(safeUrl);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  }, [safeUrl, onCopy]);

  const nativeShare = useCallback(async () => {
    const nav = navigator as Navigator & {
      share?: (data: ShareData) => Promise<void>;
      canShare?: (data: ShareData) => boolean;
    };
    if (!("share" in nav) || typeof nav.share !== "function") return;

    try {
      // If shareFile is provided, try to share as a file
      if (shareFile) {
        let blob: Blob;

        // Convert data URL to Blob if needed
        if (typeof shareFile === "string" && shareFile.startsWith("data:")) {
          const response = await fetch(shareFile);
          blob = await response.blob();
        } else if (shareFile instanceof Blob) {
          blob = shareFile;
        } else {
          // Invalid shareFile, fall back to URL sharing
          if (!safeUrl) return;
          await nav.share({
            title: shareText,
            text: shareText,
            url: safeUrl,
          });
          onNativeShare?.();
          return;
        }

        // Create a File from the Blob
        const file = new File([blob], shareFilename, { type: blob.type || "image/png" });

        // Check if file sharing is supported
        const shareData: ShareData = {
          files: [file],
          title: shareText,
          text: shareText,
        };

        if (nav.canShare && !nav.canShare(shareData)) {
          // File sharing not supported, fall back to URL sharing
          if (!safeUrl) return;
          await nav.share({
            title: shareText,
            text: shareText,
            url: safeUrl,
          });
          onNativeShare?.();
          return;
        }

        await nav.share(shareData);
        onNativeShare?.();
        return;
      }

      // Fall back to URL sharing
      if (!safeUrl) return;
      await nav.share({
        title: shareText,
        text: shareText,
        url: safeUrl,
      });
      onNativeShare?.();
    } catch {
      // user canceled or share failed -> ignore
    }
  }, [safeUrl, shareText, shareFile, shareFilename, onNativeShare]);

  const downloadFile = useCallback(async () => {
    const url = (downloadUrl ?? "").trim();
    if (!url) return;
    try {
      setDownloading(true);
      onDownload?.();
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch file (${res.status})`);
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = downloadFilename || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
    } catch {
      // ignore
    } finally {
      setDownloading(false);
    }
  }, [downloadUrl, downloadFilename, onDownload]);

  const shareWhatsApp = useCallback(() => {
    shareToWhatsApp(safeUrl, shareText);
  }, [safeUrl, shareText]);

  const shareTelegram = useCallback(() => {
    shareToTelegram(safeUrl, shareText);
  }, [safeUrl, shareText]);

  const shareX = useCallback(() => {
    shareToX(safeUrl, shareText);
  }, [safeUrl, shareText]);

  const shareFacebook = useCallback(() => {
    shareToFacebook(safeUrl);
  }, [safeUrl]);

  const shareInstagram = useCallback(() => {
    openInstagram();
  }, []);

  const shareTikTok = useCallback(() => {
    openTikTok();
  }, []);

  const shareThreads = useCallback(() => {
    openThreads();
  }, []);

  const shareSnapchat = useCallback(() => {
    shareToSnapchat(safeUrl);
  }, [safeUrl]);

  const shareSMS = useCallback(() => {
    shareViaSMS(safeUrl, shareText);
  }, [safeUrl, shareText]);

  const shareEmail = useCallback(() => {
    shareViaEmail(safeUrl, shareText, emailSubject);
  }, [safeUrl, shareText, emailSubject]);

  const shareLinkedIn = useCallback(() => {
    shareToLinkedIn(safeUrl);
  }, [safeUrl]);

  const shareReddit = useCallback(() => {
    shareToReddit(safeUrl, shareText);
  }, [safeUrl, shareText]);

  return {
    canNativeShare,
    copied,
    downloading,
    safeUrl,
    isMobile,
    platformAvailability,
    copyLink,
    nativeShare,
    downloadFile,
    shareWhatsApp,
    shareTelegram,
    shareX,
    shareFacebook,
    shareInstagram,
    shareTikTok,
    shareThreads,
    shareSnapchat,
    shareSMS,
    shareEmail,
    shareLinkedIn,
    shareReddit,
  };
}

/**
 * Hook to fetch OG (Open Graph) data from a URL.
 * Automatically fetches and caches OG metadata for link previews.
 */
export function useOGData(url: string | undefined): {
  ogData: OGData | null;
  loading: boolean;
  error: string | null;
} {
  const [ogData, setOgData] = useState<OGData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setOgData(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchOGData(url)
      .then((data) => {
        if (!cancelled) {
          setOgData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to fetch OG data");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { ogData, loading, error };
}

// Legacy export for backwards compatibility
/** @deprecated Use useShareSheet instead */
export const useShareMenu = useShareSheet;
/** @deprecated Use UseShareSheetOptions instead */
export type UseShareMenuOptions = UseShareSheetOptions;
