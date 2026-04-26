import * as cheerio from "cheerio";

export interface ScrapeResult {
  price: number | null;
  status: "success" | "error" | "not_found";
  error?: string;
}

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
];

function getRandomUA() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

export async function scrapeML(url: string): Promise<ScrapeResult> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": getRandomUA(),
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
      },
    });

    if (!response.ok) {
      console.log(`    ⚠️ HTTP Error: ${response.status}`);
      return { price: null, status: "error", error: `HTTP ${response.status}` };
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // 1. Try meta tag (best for ML)
    const metaPrice = $('meta[itemprop="price"]').attr("content");
    if (metaPrice) {
      const price = parseFloat(metaPrice);
      return isNaN(price)
        ? { price: null, status: "not_found" }
        : { price, status: "success" };
    }

    // 2. Try specific classes as fallback
    const priceFraction = $(
      ".ui-pdp-price__main-container .andes-money-amount__fraction"
    )
      .first()
      .text();
    const priceCents = $(
      ".ui-pdp-price__main-container .andes-money-amount__cents"
    )
      .first()
      .text();

    if (priceFraction) {
      const price =
        parseFloat(priceFraction.replace(/\./g, "").replace(",", ".")) +
        parseFloat(priceCents || "0") / 100;
      return isNaN(price)
        ? { price: null, status: "not_found" }
        : { price, status: "success" };
    }

    return { price: null, status: "not_found" };
  } catch (error: any) {
    return { price: null, status: "error", error: error.message };
  }
}

export async function scrapePrice(url: string): Promise<ScrapeResult> {
  if (!url || url === "-")
    return { price: null, status: "error", error: "Invalid URL" };

  if (url.includes("mercadolivre.com.br") || url.includes("meli.la")) {
    return scrapeML(url);
  }

  return { price: null, status: "error", error: "Domain not supported" };
}
