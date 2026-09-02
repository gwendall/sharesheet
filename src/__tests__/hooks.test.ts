import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useShareSheet, useOGData } from "../hooks";
import { clearOGCache } from "../og-fetcher";

describe("useShareSheet", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return initial state", () => {
    const { result } = renderHook(() =>
      useShareSheet({
        shareUrl: "https://example.com",
        shareText: "Check this out!",
      })
    );

    expect(result.current.copied).toBe(false);
    expect(result.current.downloading).toBe(false);
    expect(result.current.safeUrl).toBe("https://example.com");
  });

  it("should detect native share capability", () => {
    const { result } = renderHook(() =>
      useShareSheet({
        shareUrl: "https://example.com",
        shareText: "Test",
      })
    );

    // navigator.share is mocked in setup
    expect(result.current.canNativeShare).toBe(true);
  });

  it("should copy link to clipboard", async () => {
    const onCopy = vi.fn();
    const { result } = renderHook(() =>
      useShareSheet({
        shareUrl: "https://example.com",
        shareText: "Test",
        onCopy,
      })
    );

    await act(async () => {
      await result.current.copyLink();
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("https://example.com");
    expect(result.current.copied).toBe(true);
    expect(onCopy).toHaveBeenCalled();
  });

  it("should provide share functions for all platforms", () => {
    const { result } = renderHook(() =>
      useShareSheet({
        shareUrl: "https://example.com",
        shareText: "Test",
      })
    );

    expect(typeof result.current.shareWhatsApp).toBe("function");
    expect(typeof result.current.shareTelegram).toBe("function");
    expect(typeof result.current.shareX).toBe("function");
    expect(typeof result.current.shareFacebook).toBe("function");
    expect(typeof result.current.shareInstagram).toBe("function");
    expect(typeof result.current.shareTikTok).toBe("function");
    expect(typeof result.current.shareThreads).toBe("function");
    expect(typeof result.current.shareSnapchat).toBe("function");
    expect(typeof result.current.shareSMS).toBe("function");
    expect(typeof result.current.shareEmail).toBe("function");
    expect(typeof result.current.shareLinkedIn).toBe("function");
    expect(typeof result.current.shareReddit).toBe("function");
  });

  it("should call share functions", () => {
    const { result } = renderHook(() =>
      useShareSheet({
        shareUrl: "https://example.com",
        shareText: "Test",
      })
    );

    act(() => {
      result.current.shareWhatsApp();
    });

    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining("api.whatsapp.com"),
      "_blank",
      "noopener,noreferrer"
    );
  });

  it("should use fallback URL when shareUrl is empty", () => {
    // When shareUrl is empty, getSafeUrl falls back to window.location.href
    // In jsdom, window.location.href defaults to "about:blank" or similar
    const { result } = renderHook(() =>
      useShareSheet({
        shareUrl: "",
        shareText: "Test",
      })
    );

    // Should use the current window.location.href as fallback
    expect(result.current.safeUrl).toBe(window.location.href);
  });
});

describe("useOGData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearOGCache();
  });

  it("should return initial loading state", () => {
    vi.mocked(globalThis.fetch).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const { result } = renderHook(() => useOGData("https://example.com"));

    expect(result.current.loading).toBe(true);
    expect(result.current.ogData).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("should fetch and return OG data", async () => {
    const mockResponse = {
      status: "success",
      data: {
        title: "Test Page",
        description: "Test description",
        image: { url: "https://example.com/og.png" },
        url: "https://example.com",
      },
    };

    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const { result } = renderHook(() => useOGData("https://example.com"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.ogData).toEqual({
      title: "Test Page",
      description: "Test description",
      image: "https://example.com/og.png",
      url: "https://example.com",
      siteName: undefined,
    });
  });

  it("should handle undefined URL", () => {
    const { result } = renderHook(() => useOGData(undefined));

    expect(result.current.loading).toBe(false);
    expect(result.current.ogData).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("should refetch when URL changes", async () => {
    const mockResponse1 = {
      status: "success",
      data: { title: "Page 1", url: "https://example1.com" },
    };
    const mockResponse2 = {
      status: "success",
      data: { title: "Page 2", url: "https://example2.com" },
    };

    vi.mocked(globalThis.fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse1),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse2),
      } as Response);

    const { result, rerender } = renderHook(
      ({ url }) => useOGData(url),
      { initialProps: { url: "https://example1.com" } }
    );

    await waitFor(() => {
      expect(result.current.ogData?.title).toBe("Page 1");
    });

    rerender({ url: "https://example2.com" });

    await waitFor(() => {
      expect(result.current.ogData?.title).toBe("Page 2");
    });
  });
});
