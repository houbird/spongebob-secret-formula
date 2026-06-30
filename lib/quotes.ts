export const QUOTES_ENDPOINT =
  "https://opensheet.elk.sh/1P7h4--lgGrIEsLNz-qyVJUJ7V6yPgZUaFU-wwfqwH7M/wumbo";

export type QuoteRecord = {
  date: string;
  id: string;
  quote: string;
  "wikipedia-episodes": string;
  ESFIO: string;
  imgur: string;
  "i.imgur": string;
};

export type Quote = {
  date: string;
  id: string;
  quote: string;
  quoteLines: string[];
  wikipediaEpisode: string;
  esfio: string;
  imgurUrl: string;
  imageUrl: string;
  searchText: string;
};

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function splitQuoteLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function isQuoteRecord(value: unknown): value is QuoteRecord {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Record<string, unknown>;

  return [
    record.date,
    record.id,
    record.quote,
    record["wikipedia-episodes"],
    record.ESFIO,
    record.imgur,
    record["i.imgur"],
  ].every((field) => typeof field === "string");
}

export function normalizeQuoteRecord(record: QuoteRecord): Quote {
  const quoteLines = splitQuoteLines(record.quote);
  const quote = normalizeWhitespace(record.quote);
  const wikipediaEpisode = normalizeWhitespace(record["wikipedia-episodes"]);
  const esfio = normalizeWhitespace(record.ESFIO);
  const imgurUrl = record.imgur.trim();
  const imageUrl = (record["i.imgur"] || record.imgur).trim();
  const searchText = [record.id, quote, wikipediaEpisode, esfio, record.date]
    .map((value) => normalizeWhitespace(value).toLowerCase())
    .join(" ");

  return {
    date: record.date.trim(),
    id: record.id.trim(),
    quote,
    quoteLines,
    wikipediaEpisode,
    esfio,
    imgurUrl,
    imageUrl,
    searchText,
  };
}

export async function fetchQuotes() {
  const response = await fetch(QUOTES_ENDPOINT, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch quotes: ${response.status}`);
  }

  const payload: unknown = await response.json();

  if (!Array.isArray(payload)) {
    throw new Error("Unexpected quotes payload.");
  }

  return payload
    .filter(isQuoteRecord)
    .map(normalizeQuoteRecord)
    .sort((left, right) => left.id.localeCompare(right.id, "en"));
}