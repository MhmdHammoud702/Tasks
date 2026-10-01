import { test, expect } from '@playwright/test';
import path from 'path';

test("student adding works", async ({ page }) => {
  await page.goto("http://localhost:5500/task 6 - multer/frontend");
  await page.getByPlaceholder("Enter first name").fill("Mohammad");
  await page.getByPlaceholder("Enter last name").fill("Hammoud");
  await page.locator("#profilePic").setInputFiles(
    path.join(__dirname, "images.jpeg")
  );
  await page.locator("#add-student").click();
  const studentCard = page.locator("#studentsContainer .student-card").filter({
    hasText: "Mohammad Hammoud",
  }).last();
  await expect(studentCard).toContainText("Hammoud");
});