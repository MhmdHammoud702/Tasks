import { test, expect } from '@playwright/test';
import path from 'path';

test("student editing works", async ({ page }) => {
  const firstname = page.getByPlaceholder("Enter first name");
  const lastname = page.getByPlaceholder("Enter last name");
  const title = page.locator("#formTitle");
  await page.goto("http://localhost:5500/task 6 - multer/frontend");
  await page.locator("#studentsContainer .student-card .edit-button").first().click();
  await expect(title).toContainText("Update Student");
  await expect(firstname).not.toHaveValue("");
  await expect(lastname).not.toHaveValue("");
  await firstname.fill("Elie");
  await lastname.fill("Saide");
  await page.locator("#profilePic").setInputFiles(
    path.join(__dirname, "test.jpg")
  );
  await page.locator("#add-student").click();
  const studentCard = page.locator("#studentsContainer .student-card").filter({
    hasText: "Elie Saide",
  }).last();
  await expect(studentCard).toContainText("Saide");
  await expect(title).toContainText('Add Student')
});