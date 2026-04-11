import { beforeEach, describe, expect, it, vi } from "vitest";
import apiService from "@/services/api";

describe("apiService", () => {
  beforeEach(() => {
    localStorage.clear();
    apiService.clearToken();
    vi.unstubAllGlobals();
  });

  it("serializes JSON request bodies", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await apiService.request("/test", {
      method: "POST",
      body: { name: "demo" },
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, config] = fetchMock.mock.calls[0];
    expect(url).toContain("/test");
    expect(config.method).toBe("POST");
    expect(config.body).toBe(JSON.stringify({ name: "demo" }));
    expect(config.headers["Content-Type"]).toBe("application/json");
  });

  it("adds Authorization header when token exists", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal("fetch", fetchMock);
    apiService.setToken("abc123");

    await apiService.getOrders();

    const [, config] = fetchMock.mock.calls[0];
    expect(config.headers.Authorization).toBe("Bearer abc123");
  });

  it("throws API error message for failed requests", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Unauthorized" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(apiService.getOrders()).rejects.toThrow("Unauthorized");
  });

  it("stores token after successful login", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ token: "jwt-token", user: { id: "u1" } }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const response = await apiService.login({
      email: "a@b.com",
      password: "pass",
    });

    expect(response.token).toBe("jwt-token");
    expect(localStorage.getItem("token")).toBe("jwt-token");
  });

  it("builds restaurant query params from filters", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ([]),
    });
    vi.stubGlobal("fetch", fetchMock);

    await apiService.getRestaurants({ cuisine: "Indian", veg: "true" });

    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain("/restaurants?");
    expect(url).toContain("cuisine=Indian");
    expect(url).toContain("veg=true");
  });
});
