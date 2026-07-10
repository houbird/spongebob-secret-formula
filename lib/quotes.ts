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

export type QuotesResponse = {
  updatedAt: string;
  quotes: Quote[];
};

export async function fetchQuotes(): Promise<QuotesResponse> {
  const basePath = "/spongebob-secret-formula";
  const endpoint =
    process.env.NODE_ENV === "development"
      ? "/quotes.json"
      : `${basePath}/quotes.json`;

  const response = await fetch(endpoint, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch quotes: ${response.status}`);
  }

  const payload: unknown = await response.json();

  if (
    !payload ||
    typeof payload !== "object" ||
    !("quotes" in payload) ||
    !Array.isArray(payload.quotes)
  ) {
    throw new Error("Unexpected quotes payload structure.");
  }

  const quotes = (payload.quotes as unknown[])
    .filter(isQuoteRecord)
    .map(normalizeQuoteRecord)
    .sort((left, right) => left.id.localeCompare(right.id, "en"));

  const updatedAt =
    "updatedAt" in payload && typeof payload.updatedAt === "string"
      ? payload.updatedAt
      : "";

  return {
    updatedAt,
    quotes,
  };
}