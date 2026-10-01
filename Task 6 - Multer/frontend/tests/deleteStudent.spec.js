import { test, expect } from '@playwright/test';

test("student deleting works", async ({ page }) => {
  await page.goto("http://localhost:5500/task 6 - multer/frontend");
  page.on("dialog", async (dialog) => {
    await dialog.accept();
  });
  const studentCard = page.locator("#studentsContainer .student-card").filter({ hasText: "Elie Saide" }).first();
  await expect(studentCard).toContainText("Elie Saide");
  await studentCard.locator(".delete-button").click();
  await expect(page.locator("#studentsContainer .student-card").filter({ hasText: "Elie Saide" })).toHaveCount(0);
});