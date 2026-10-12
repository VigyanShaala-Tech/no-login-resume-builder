import { expect, test } from "@playwright/test";
import { completeChecklist, fillPersonalAndSkills } from "./helpers/fillValidResume";

const PHONES = [
  { width: 320, height: 700 },
  { width: 360, height: 800 },
  { width: 390, height: 844 },
] as const;

test.beforeEach(async ({ page }) => {
  await page.goto("/?sample=1");
});

for (const phone of PHONES) {
  test(`skill name stays typeable at ${phone.width}px`, async ({ page }) => {
    await page.setViewportSize(phone);
    await page.getByRole("button", { name: "Skills", exact: true }).click();
    const input = page.getByPlaceholder("Skill name (e.g., JavaScript, Project Management)").first();
    const level = page.getByRole("combobox").first();
    await expect(input).toBeVisible();
    const inputBox = await input.boundingBox();
    const levelBox = await level.boundingBox();
    expect(inputBox).toBeTruthy();
    expect(levelBox).toBeTruthy();
    expect(inputBox!.width).toBeGreaterThanOrEqual(160);
    expect(inputBox!.width).toBeGreaterThanOrEqual(levelBox!.width);
  });

  test(`level menu shows every option at ${phone.width}px`, async ({ page }) => {
    await page.setViewportSize(phone);
    await page.getByRole("button", { name: "Skills", exact: true }).click();
    await page.getByRole("combobox").first().click();
    const list = page.getByRole("listbox");
    await expect(list).toBeVisible();
    const fit = await list.evaluate((node) => {
      const box = node.getBoundingClientRect();
      const options = [...node.querySelectorAll("[role='option']")];
      return {
        height: box.height,
        count: options.length,
        allVisible: options.every((option) => {
          const item = option.getBoundingClientRect();
          return item.height >= 24 && item.top >= box.top - 2 && item.bottom <= box.bottom + 2;
        }),
      };
    });
    expect(fit.count).toBe(4);
    expect(fit.height).toBeGreaterThanOrEqual(120);
    expect(fit.allVisible).toBe(true);
  });
}

test("checklist dialog fills the phone instead of a two-line strip", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto("/");
  await fillPersonalAndSkills(page);
  await page.getByTestId("header-download-pdf").click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const box = await dialog.boundingBox();
  expect(box).toBeTruthy();
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(640 + 2);
  expect(box!.height).toBeGreaterThanOrEqual(640 * 0.5);
  const awards = dialog.getByText("If you added Awards, have you filled Title, Issuer, Date, and Description?");
  await awards.scrollIntoViewIfNeeded();
  await expect(awards).toBeVisible();
});

test("phone download keeps a tappable save link", async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  await fillPersonalAndSkills(page);
  await page.getByTestId("header-download-pdf").click();
  await completeChecklist(page);
  const downloadPromise = page.waitForEvent("download", { timeout: 60_000 });
  await page.getByTestId("checklist-download-pdf").click();
  const save = page.getByTestId("save-ready-file");
  await expect(save).toBeVisible({ timeout: 60_000 });
  await expect(save).toHaveAttribute("href", /^blob:/);
  await expect(save).toHaveAttribute("download", /Jane_Doe_Resume\.pdf$/);
  const first = await downloadPromise;
  expect(first.suggestedFilename()).toMatch(/Jane_Doe_Resume\.pdf$/);

  const secondPromise = page.waitForEvent("download", { timeout: 15_000 });
  await save.click();
  const second = await secondPromise;
  expect(second.suggestedFilename()).toMatch(/Jane_Doe_Resume\.pdf$/);
  expect(await second.path()).toBeTruthy();
});
