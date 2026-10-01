import { test, expect } from "@playwright/test";
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