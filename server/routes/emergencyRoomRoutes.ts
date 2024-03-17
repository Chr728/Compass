import { Router } from "express";
import fs from "fs";
import path from "path";

const DATA_FILE_PATH = path.join(__dirname, "..", "utils/scrapeData.json");

const router = Router();

router.get("/", (req, res) => {
	fs.readFile(DATA_FILE_PATH, (err, data) => {
		if (err) {
			console.error(err);
			return res
				.status(500)
				.send("An error occurred while reading the data file.");
		}
		res.setHeader("Content-Type", "application/json");
		res.send(data);
	});
});

export default router;
