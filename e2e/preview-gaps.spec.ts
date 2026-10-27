import { expect, test } from "@playwright/test";

const TEMPLATES = [
  { id: "resumake-classic", name: "Classic" },
  { id: "resumake-classic-single", name: "Shaded Headers" },
  { id: "sidebar", name: "Sidebar" },
] as const;

test("Classic, Shaded, and Sidebar show certification expiry and a real publication link", async ({ page }) => {
  for (const template of TEMPLATES) {
    await page.goto(`/?sample=1&template=${template.id}`);
    const preview = page.locator("#resume-preview");
    await expect(preview.getByText(/Expires:/)).toBeVisible();
    const link = preview.locator('a[href="https://jordanhale.dev/layout-systems"]');
    await expect(link).toHaveCount(1);
    await expect(link).toBeVisible();
  }
});

test("Sidebar experience lists use a real bullet", async ({ page }) => {
  await page.goto("/?sample=1&template=sidebar");
  const item = page.locator("#resume-preview .sidebar-prose li").first();
  await expect(item).toBeVisible();
  const marker = await item.evaluate((el) => {
    const type = getComputedStyle(el).listStyleType;
    const before = getComputedStyle(el, "::before").content;
    const hasBefore = Boolean(before && before !== "none" && before !== "normal" && before !== '""');
    return { type, hasBefore };
  });
  expect(marker.type === "disc" || marker.hasBefore).toBe(true);
  expect(marker.type === "none" && !marker.hasBefore).toBe(false);
});

test("a score with no type is not shown as GPA", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Education", exact: true }).click();
  await page.getByRole("button", { name: "Add Education" }).click();
  await page.getByPlaceholder("8.5").fill("8.6");
  const preview = page.locator("#resume-preview");
  await expect(preview).not.toContainText("GPA");
  await expect(preview).not.toContainText("8.6");
});

test("Sidebar print rail is fixed and the main column is offset", async ({ page }) => {
  await page.goto("/?sample=1&template=sidebar");
  await page.emulateMedia({ media: "print" });
  const layout = await page.locator("#resume-preview").evaluate(() => {
    const rail = document.querySelector("[data-sidebar-rail]");
    const main = document.querySelector(".sidebar-main");
    if (!rail || !main) return null;
    const railStyle = getComputedStyle(rail);
    const mainStyle = getComputedStyle(main);
    const railBox = rail.getBoundingClientRect();
    const mainBox = main.getBoundingClientRect();
    return {
      position: railStyle.position,
      top: railStyle.top,
      bottom: railStyle.bottom,
      marginLeft: mainStyle.marginLeft,
      railRight: railBox.right,
      mainLeft: mainBox.left,
    };
  });
  expect(layout).not.toBeNull();
  expect(layout!.position).toBe("fixed");
  expect(layout!.top).toBe("0px");
  expect(layout!.bottom).toBe("0px");
  expect(parseFloat(layout!.marginLeft)).toBeGreaterThan(0);
  expect(layout!.mainLeft).toBeGreaterThanOrEqual(layout!.railRight - 2);
});
