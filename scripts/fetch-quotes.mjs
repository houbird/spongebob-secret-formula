import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const API_URL = "https://opensheet.elk.sh/1P7h4--lgGrIEsLNz-qyVJUJ7V6yPgZUaFU-wwfqwH7M/wumbo";
const OUTPUT_FILE = resolve(process.cwd(), "public", "quotes.json");

async function main() {
  console.log(`Fetching quotes from ${API_URL}...`);
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Expected an array of quotes");
    }

    const payload = {
      updatedAt: new Date().toISOString(),
      quotes: data,
    };

    writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2), "utf-8");
    console.log(`Successfully updated quotes data in ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("Failed to update quotes:", error);
    process.exit(1);
  }
}

main();
