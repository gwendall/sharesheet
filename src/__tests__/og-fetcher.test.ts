import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchOGData, clearOGCache } from "../og-fetcher";

describe("og-fetcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearOGCache();
  });

  it("should fetch OG data successfully", async () => {
    const mockResponse = {
      status: "success",
      data: {
        title: "Test Page",
        description: "A test description",
        image: { url: "https://example.com/og.png" },
        url: "https://example.com",
        publisher: "Test Site",
      },
    };

    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const result = await fetchOGData("https://example.com");

    expect(result).toEqual({
      title: "Test Page",
      description: "A test description",
      image: "https://example.com/og.png",
      url: "https://example.com",
      siteName: "Test Site",
    });
  });

  it("should return null on failed fetch", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response);

    const result = await fetchOGData("https://example.com/notfound");

    expect(result).toBeNull();
  });

  it("should return null when API returns error status", async () => {
    const mockResponse = {
      status: "error",
      data: null,
    };

    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const result = await fetchOGData("https://example.com");

    expect(result).toBeNull();
  });

  it("should cache results", async () => {
    const mockResponse = {
      status: "success",
      data: {
        title: "Cached Page",
        description: "Cached description",
        image: { url: "https://example.com/cached.png" },
        url: "https://example.com/cached",
      },
    };

    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    // First call
    const result1 = await fetchOGData("https://example.com/cached");
    // Second call - should use cache
    const result2 = await fetchOGData("https://example.com/cached");

    expect(result1).toEqual(result2);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it("should clear cache", async () => {
    const mockResponse = {
      status: "success",
      data: {
        title: "Test",
        url: "https://example.com",
      },
    };

    vi.mocked(globalThis.fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    await fetchOGData("https://example.com");
    clearOGCache();
    await fetchOGData("https://example.com");

    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });

  it("should handle network errors gracefully", async () => {
    vi.mocked(globalThis.fetch).mockRejectedValueOnce(new Error("Network error"));

    const result = await fetchOGData("https://example.com");

    expect(result).toBeNull();
  });

  it("should handle missing image gracefully", async () => {
    const mockResponse = {
      status: "success",
      data: {
        title: "No Image Page",
        description: "Page without image",
        url: "https://example.com/no-image",
      },
    };

    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const result = await fetchOGData("https://example.com/no-image");

    expect(result).toEqual({
      title: "No Image Page",
      description: "Page without image",
      image: undefined,
      url: "https://example.com/no-image",
      siteName: undefined,
    });
  });
});
