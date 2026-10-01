import cron from "node-cron";
import { SetInactive } from "../controllers/users.controllers.js";
import fs from "node:fs/promises"
import path from "path";

cron.schedule("*/5 * * * *", async() => {
    await SetInactive();
});

cron.schedule("0 0 * * *", async () => {
    try {
        const uploadsPath = path.join(process.cwd(), "uploads");
        const files = await fs.readdir(uploadsPath);
        const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;

        for (const file of files) {
            const filePath = path.join(uploadsPath, file);
            const stats = await fs.stat(filePath);

            if (stats.mtimeMs < twentyFourHoursAgo) {
                await fs.unlink(filePath);

                console.log(`Deleted: ${file}`);
            }
        }
    } catch (error) {
        console.error("Error cleaning uploads:", error);
    }
});