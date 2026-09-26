import { expect, test } from "@playwright/test";
import {
  addCompleteEducation,
  addEmptyAward,
  addExperience,
  completeChecklist,
  downloadFromChecklist,
  expectToast,
  fillPersonalAndSkills,
  openDownloadChecklist,
} from "./helpers/fillValidResume";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("empty download is blocked and checklist does not open", async ({ page }) => {
  await openDownloadChecklist(page);
  await expectToast(page, /Please add your name|Missing Information/i);
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("valid personal + two skills opens the checklist", async ({ page }) => {
  await fillPersonalAndSkills(page);
  await openDownloadChecklist(page);
  await expect(page.getByRole("heading", { name: "Have you re-read these points?" })).toBeVisible();
  await expect(page.getByTestId("checklist-download-pdf")).toBeDisabled();
  await expect(page.getByTestId("checklist-download-word")).toBeDisabled();
});

test("checklist download buttons stay off until all Yes or NA", async ({ page }) => {
  await fillPersonalAndSkills(page);
  await openDownloadChecklist(page);
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("radio", { name: "Yes" }).nth(0).click();
  await expect(page.getByTestId("checklist-download-pdf")).toBeDisabled();
  await completeChecklist(page);
  await expect(page.getByTestId("checklist-download-pdf")).toBeEnabled();
  await expect(page.getByTestId("checklist-download-word")).toBeEnabled();
});

test("title-cases the name when opening the checklist", async ({ page }) => {
  await fillPersonalAndSkills(page, "jane doe");
  await expect(page.locator("#resume-preview")).toContainText("Jane Doe");
  await openDownloadChecklist(page);
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("education GPA and Percentage labels show in preview", async ({ page }) => {
  await fillPersonalAndSkills(page);
  await addCompleteEducation(page, { scoreType: "gpa", score: "8.5" });
  await expect(page.getByText("GPA: 8.5/10")).toBeVisible();

  await page.getByRole("combobox").filter({ hasText: "GPA (out of 10)" }).click();
  await page.getByRole("option", { name: "Percentage" }).click();
  await page.getByPlaceholder("85").fill("85");
  await expect(page.getByText("Percentage: 85%")).toBeVisible();
});

test("job overlapping education is blocked", async ({ page }) => {
  await fillPersonalAndSkills(page);
  await addCompleteEducation(page);
  await addExperience(page, { type: "Job", start: "2021-01-01", end: "2021-06-01" });
  await openDownloadChecklist(page);
  await expectToast(page, /overlap/i);
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("internship overlapping education is allowed", async ({ page }) => {
  await fillPersonalAndSkills(page);
  await addCompleteEducation(page);
  await addExperience(page, { type: "Internship", start: "2021-01-01", end: "2021-06-01" });
  await openDownloadChecklist(page);
  await expect(page.getByRole("heading", { name: "Have you re-read these points?" })).toBeVisible();
});

test("award without description is blocked", async ({ page }) => {
  await fillPersonalAndSkills(page);
  await addEmptyAward(page);
  await openDownloadChecklist(page);
  await expectToast(page, /Description is required/i);
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("checklist includes the Bachelor's 10th and 12th question", async ({ page }) => {
  await fillPersonalAndSkills(page);
  await openDownloadChecklist(page);
  await expect(
    page.getByText("If you are pursuing a Bachelor's Degree, have you added your 10th and 12th Education Details?")
  ).toBeVisible();
});

test("smoke: Download PDF and Word produce files", async ({ page }) => {
  test.setTimeout(120_000);
  await fillPersonalAndSkills(page);
  await openDownloadChecklist(page);
  await completeChecklist(page);
  await downloadFromChecklist(page, "pdf");

  await openDownloadChecklist(page);
  await completeChecklist(page);
  await downloadFromChecklist(page, "word");
});
