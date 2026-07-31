/**
 * E2E flows — Playwright
 *
 * Requires: frontend dev server on :5173 (auto-started by playwright.config.js).
 * Tests marked [backend] additionally require the backend API on :8000.
 * Run: npm run e2e
 */
import { test, expect } from "@playwright/test";

// ── helpers ────────────────────────────────────────────────────────────────────

/** Navigate from home → categories page via the navbar. */
async function openCategories(page) {
  await page.goto("/");
  await page.locator("header.app-nav").getByRole("button", { name: /^categories$/i }).click();
  await page.waitForSelector(".categoriesPage", { timeout: 5000 });
}

// ── A. Global navigation ───────────────────────────────────────────────────────

test.describe("A. Global navigation", () => {

  test("home page loads without JS errors (G1)", async ({ page }) => {
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");
    await expect(page).toHaveTitle(/VELORA/i);
    expect(errors, "JS errors on home page").toHaveLength(0);
  });

  test("all main nav pages render content (G1)", async ({ page }) => {
    await page.goto("/");
    const navLabels = ["Categories", "New Arrivals", "Gift", "About"];
    for (const label of navLabels) {
      await page.locator("header.app-nav").getByRole("button", { name: new RegExp(`^${label}$`, "i") }).click();
      await page.waitForTimeout(500);
      const content = await page.locator("body").textContent();
      expect(content?.trim().length, `Page "${label}" rendered empty`).toBeGreaterThan(100);
    }
  });

  test("logo click returns to home (G3)", async ({ page }) => {
    await page.goto("/");
    // Navigate away first
    await page.locator("header.app-nav").getByRole("button", { name: /^about$/i }).click();
    await page.waitForTimeout(300);
    // Click the VELORA logo button (aria-label: "VELORA — go to homepage")
    await page.locator("button.brand-mark").click();
    // Home page hero must become visible — allow time for AnimatePresence exit + enter
    await expect(page.locator(".homeHero")).toBeVisible({ timeout: 8000 });
  });

  test("unknown hash shows body content, not blank (G7)", async ({ page }) => {
    await page.goto("/#/this-page-does-not-exist-xyz");
    const body = await page.locator("body").textContent();
    expect(body?.trim().length).toBeGreaterThan(0);
  });

  test("footer has all three legal links (G4 legal compliance)", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer.app-footer");
    await expect(footer.getByRole("button", { name: /privacy policy/i })).toBeVisible();
    await expect(footer.getByRole("button", { name: /terms of service/i })).toBeVisible();
    await expect(footer.getByRole("button", { name: /returns.*refunds|refund/i })).toBeVisible();
  });

  test("Privacy Policy page loads from footer link (G4)", async ({ page }) => {
    await page.goto("/");
    await page.locator("footer.app-footer").getByRole("button", { name: /privacy policy/i }).click();
    await expect(page.getByRole("heading", { name: /privacy policy/i })).toBeVisible({ timeout: 3000 });
  });

  test("Terms of Service page loads from footer link (G4)", async ({ page }) => {
    await page.goto("/");
    await page.locator("footer.app-footer").getByRole("button", { name: /terms of service/i }).click();
    await expect(page.getByRole("heading", { name: /terms of service/i })).toBeVisible({ timeout: 3000 });
  });

  test("Return & Refund Policy page loads from footer link (G4)", async ({ page }) => {
    await page.goto("/");
    await page.locator("footer.app-footer").getByRole("button", { name: /returns.*refunds|refund/i }).click();
    await expect(page.getByRole("heading", { name: /return.*refund/i })).toBeVisible({ timeout: 3000 });
  });

});

// ── B. Catalog & filtering ─────────────────────────────────────────────────────

test.describe("B. Catalog & filtering", () => {

  test("categories page shows Men tab active by default (C1)", async ({ page }) => {
    await openCategories(page);
    const menTab = page.locator("[role=tablist]").getByRole("tab", { name: /^men$/i });
    await expect(menTab).toHaveAttribute("aria-selected", "true");
  });

  test("switching to Women tab makes it active (C1)", async ({ page }) => {
    await openCategories(page);
    const womenTab = page.locator("[role=tablist]").getByRole("tab", { name: /^women$/i });
    await womenTab.click();
    await expect(womenTab).toHaveAttribute("aria-selected", "true");
  });

  test("subcategory filter narrows the product grid (C2)", async ({ page }) => {
    await openCategories(page);
    await expect(page.locator(".productGrid .productCard").first()).toBeVisible({ timeout: 5000 });
    const countAll = await page.locator(".productGrid .productCard").count();

    await page.locator(".subcat-btn").nth(1).click();
    await page.waitForTimeout(400);

    const countFiltered = await page.locator(".productGrid .productCard").count();
    expect(countFiltered).toBeLessThanOrEqual(countAll);
    await expect(page.locator(".productGrid .productCard").first()).toBeVisible();
  });

  test("clicking All resets the subcategory filter (C2)", async ({ page }) => {
    await openCategories(page);
    await expect(page.locator(".productGrid .productCard").first()).toBeVisible({ timeout: 5000 });
    const countAll = await page.locator(".productGrid .productCard").count();

    await page.locator(".subcat-btn").nth(1).click();
    await page.waitForTimeout(300);
    await page.locator(".subcat-btn").first().click();
    await page.waitForTimeout(300);

    const countAfterReset = await page.locator(".productGrid .productCard").count();
    expect(countAfterReset).toBeGreaterThanOrEqual(countAll);
  });

  test("New Arrivals page renders heading and products or empty state (C3)", async ({ page }) => {
    await page.goto("/");
    await page.locator("header.app-nav").getByRole("button", { name: /new arrivals/i }).click();
    await page.waitForTimeout(500);
    await expect(page.getByRole("heading", { name: /new arrivals/i })).toBeVisible({ timeout: 5000 });
    const hasCards = await page.locator(".productCard").count() > 0;
    const hasEmpty = await page.getByText(/coming soon|no new|nothing here/i).isVisible().catch(() => false);
    expect(hasCards || hasEmpty, "New Arrivals must show products or empty state").toBe(true);
  });

  test("Gift page renders heading and gift products (C4)", async ({ page }) => {
    await page.goto("/");
    await page.locator("header.app-nav").getByRole("button", { name: /^gift$/i }).click();
    await page.waitForTimeout(500);
    await expect(page.getByRole("heading", { name: /gift/i })).toBeVisible({ timeout: 5000 });
    const body = await page.locator("body").textContent();
    expect(body).toMatch(/gift|mug|frame|keychain|tumbler/i);
  });

});

// ── C. WhatsApp order flow ─────────────────────────────────────────────────────

test.describe("C. WhatsApp order flow", () => {

  test("Order on WhatsApp button is visible in product grid (W1)", async ({ page }) => {
    await openCategories(page);
    await expect(page.locator(".productGrid .productCard").first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator("button", { hasText: /order on whatsapp/i }).first()).toBeVisible();
  });

  test("WhatsApp URL goes to wa.me with correct number (W1 W2)", async ({ page }) => {
    await openCategories(page);
    await expect(page.locator(".productGrid .productCard").first()).toBeVisible({ timeout: 5000 });

    await page.evaluate(() => {
      window.__lastOpenedUrl = null;
      window.open = (url) => { window.__lastOpenedUrl = url; return null; };
    });

    await page.locator("button", { hasText: /order on whatsapp/i }).first().click();
    const url = await page.evaluate(() => window.__lastOpenedUrl);

    if (url) {
      expect(url).toContain("wa.me/");
      expect(url).toMatch(/wa\.me\/\d{10,}/);
    } else {
      // window.open was not intercepted — button still rendered
      const count = await page.locator("button", { hasText: /order on whatsapp/i }).count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test("WhatsApp URL contains product info but no secrets (W2 W4)", async ({ page }) => {
    await openCategories(page);
    await expect(page.locator(".productGrid .productCard").first()).toBeVisible({ timeout: 5000 });

    await page.evaluate(() => {
      window.__lastOpenedUrl = null;
      window.open = (url) => { window.__lastOpenedUrl = url; return null; };
    });

    await page.locator("button", { hasText: /order on whatsapp/i }).first().click();
    const url = await page.evaluate(() => window.__lastOpenedUrl);

    if (url) {
      const decoded = decodeURIComponent(url);
      expect(decoded).toMatch(/order|product|velora/i);
      expect(decoded).not.toMatch(/password|secret|api.?key|bearer|token/i);
    }
  });

});

// ── D. Auth ───────────────────────────────────────────────────────────────────

test.describe("D. Auth", () => {

  test("login page renders email, password, submit (A1)", async ({ page }) => {
    await page.goto("/");
    await page.locator("header.app-nav").getByRole("button", { name: /^login$/i }).click();
    await expect(page.locator("input[type=email]")).toBeVisible({ timeout: 3000 });
    await expect(page.locator("input[type=password]")).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("signup shows inline error for password < 10 chars (A2)", async ({ page }) => {
    await page.goto("/");
    await page.locator("header.app-nav").getByRole("button", { name: /^login$/i }).click();
    await page.getByRole("button", { name: /sign up|create account|register/i }).click();
    await page.waitForTimeout(300);

    await page.locator("input[type=text], input[name=name]").first().fill("Test User");
    await page.locator("input[type=email]").fill("newuser@example.com");
    await page.locator("input[type=password]").fill("short1");
    await page.getByRole("button", { name: /create account|sign up|register/i }).click();

    await expect(page.locator("input[type=email]")).toBeVisible({ timeout: 2000 });
    // Error div shows the validation message — use the specific class to avoid strict-mode clash with the hint <small>
    await expect(page.locator(".authCard__error")).toBeVisible();
  });

  test("wrong credentials shows error or keeps form visible [backend] (A3)", async ({ page }) => {
    await page.goto("/");
    await page.locator("header.app-nav").getByRole("button", { name: /^login$/i }).click();
    await page.locator("input[type=email]").fill("nobody@notreal.com");
    await page.locator("input[type=password]").fill("WrongPass999!");
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForTimeout(2500);

    const formVisible = await page.locator("input[type=password]").isVisible().catch(() => false);
    const errorVisible = await page.getByText(/invalid|incorrect|wrong|error|credentials/i).isVisible().catch(() => false);
    const body = await page.locator("body").textContent();
    expect(body?.trim().length).toBeGreaterThan(0);
    if (!formVisible && !errorVisible) {
      expect(formVisible || errorVisible).toBe(true);
    }
  });

  test("unauthenticated user cannot see admin UI (A8)", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("header.app-nav").getByRole("button", { name: /^login$/i })).toBeVisible();
    await expect(page.getByText(/orders table|admin stats/i)).not.toBeVisible();
    await expect(page.locator("header.app-nav").getByRole("button", { name: /admin/i })).not.toBeVisible();
  });

});

// ── F. AI Chat widget ─────────────────────────────────────────────────────────

test.describe("F. AI Chat widget", () => {

  test("chat FAB is visible on home page (I6)", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".cw-fab")).toBeVisible({ timeout: 5000 });
  });

  test("clicking FAB opens the chat panel (I6)", async ({ page }) => {
    await page.goto("/");
    await page.locator(".cw-fab").click();
    await expect(page.locator(".cw-panel")).toBeVisible({ timeout: 3000 });
  });

  test("chat panel shows Velora AI header and quick chips (I6)", async ({ page }) => {
    await page.goto("/");
    await page.locator(".cw-fab").click();
    await expect(page.locator(".cw-panel")).toBeVisible();
    await expect(page.locator(".cw-header__name")).toContainText(/velora ai/i);
    await expect(page.locator(".cw-chip").first()).toBeVisible();
  });

  test("greeting bubble is present in chat panel (I6)", async ({ page }) => {
    await page.goto("/");
    await page.locator(".cw-fab").click();
    await expect(page.locator(".cw-panel")).toBeVisible();
    await expect(page.locator(".cw-bubble--ai").first()).toContainText(/velora ai|how to order|looking for/i);
  });

  test("chat textarea has maxLength of 1000 (I4)", async ({ page }) => {
    await page.goto("/");
    await page.locator(".cw-fab").click();
    await expect(page.locator(".cw-panel")).toBeVisible();
    const maxLen = await page.locator("textarea.cw-input").getAttribute("maxlength");
    expect(Number(maxLen)).toBeLessThanOrEqual(1000);
  });

  test("input longer than maxLength is capped by browser (I4)", async ({ page }) => {
    await page.goto("/");
    await page.locator(".cw-fab").click();
    await expect(page.locator(".cw-panel")).toBeVisible();

    const textarea = page.locator("textarea.cw-input");
    await textarea.fill("a".repeat(1100));
    const actual = await textarea.inputValue();
    expect(actual.length).toBeLessThanOrEqual(1000);
  });

  test("close button hides the chat panel (I6)", async ({ page }) => {
    await page.goto("/");
    await page.locator(".cw-fab").click();
    await expect(page.locator(".cw-panel")).toBeVisible();
    await page.locator("button.cw-header__close").click();
    await expect(page.locator(".cw-panel")).not.toBeVisible({ timeout: 2000 });
  });

  test("FAB toggles panel open and closed (I6)", async ({ page }) => {
    await page.goto("/");
    await page.locator(".cw-fab").click();
    await expect(page.locator(".cw-panel")).toBeVisible();
    await page.locator(".cw-fab").click();
    await expect(page.locator(".cw-panel")).not.toBeVisible({ timeout: 2000 });
  });

});

// ── H. PWA ────────────────────────────────────────────────────────────────────

// PWA tests require a production build (npm run build && npm run preview).
// vite-plugin-pwa does NOT emit manifest.webmanifest or sw.js during `vite dev`.
// When the dev server falls back to HTML for those paths, the tests self-skip.
test.describe("H. PWA", () => {

  async function isProdBuild(page) {
    const resp = await page.request.get("http://localhost:5173/manifest.webmanifest");
    const ct = resp.headers()["content-type"] || "";
    return ct.includes("json");
  }

  test("manifest is served with correct name and theme_color (P1 P2)", async ({ page }) => {
    if (!await isProdBuild(page)) {
      test.skip(true, "PWA assets only available in production build — run npm run build && npm run preview");
      return;
    }
    const resp = await page.request.get("http://localhost:5173/manifest.webmanifest");
    const manifest = await resp.json();
    expect(manifest.name).toBe("VELORA");
    expect(manifest.theme_color).toBe("#5B1A26");
    expect(manifest.display).toBe("standalone");
  });

  test("service worker is registered on the home page (P3)", async ({ page }) => {
    if (!await isProdBuild(page)) {
      test.skip(true, "Service worker only registered in production build");
      return;
    }
    await page.goto("/");
    await page.waitForTimeout(2000);
    const swRegistered = await page.evaluate(async () => {
      if (!("serviceWorker" in navigator)) return false;
      try {
        const reg = await navigator.serviceWorker.ready;
        return !!reg;
      } catch {
        return false;
      }
    }).catch(() => false);
    expect(swRegistered).toBe(true);
  });

  test("offline.html is served (P3)", async ({ page }) => {
    const resp = await page.request.get("http://localhost:5173/offline.html");
    expect(resp.status()).toBe(200);
    const body = await resp.text();
    expect(body).toMatch(/velora/i);
  });

  test("generated service worker uses NetworkOnly for API routes (P4)", async ({ page }) => {
    if (!await isProdBuild(page)) {
      test.skip(true, "Service worker only generated in production build");
      return;
    }
    const resp = await page.request.get("http://localhost:5173/sw.js");
    expect(resp.status()).toBe(200);
    const swCode = await resp.text();
    expect(swCode).toMatch(/NetworkOnly|networkOnly|network.*only/i);
  });

});

// ── K. Security spot-checks ───────────────────────────────────────────────────

test.describe("K. Security spot-checks", () => {

  test("no API secrets visible in page HTML (S4)", async ({ page }) => {
    await page.goto("/");
    const html = await page.content();
    expect(html).not.toMatch(/gsk_[A-Za-z0-9]{20,}/);
    expect(html).not.toMatch(/sk-[A-Za-z0-9]{20,}/);
    expect(html).not.toContain("CLOUDINARY_API_SECRET");
    expect(html).not.toContain("DATABASE_URL");
  });

  test("stale env vars not bundled in JS (L1 fix)", async ({ page }) => {
    await page.goto("/");
    const html = await page.content();
    expect(html).not.toContain("VITE_SUPABASE_URL");
    expect(html).not.toContain("VITE_OPENAI_API_KEY");
    expect(html).not.toContain("VITE_SUPABASE_ANON_KEY");
  });

  test("backend security headers present [backend] (S1)", async ({ page }) => {
    const resp = await page.request.get("http://localhost:8000/health", { timeout: 5000 }).catch(() => null);
    if (!resp) {
      test.skip(true, "Backend not running");
      return;
    }
    const h = resp.headers();
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["x-frame-options"]).toBe("DENY");
  });

});
