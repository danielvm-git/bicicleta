interface MeliTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Gets a valid access token for Mercado Livre API using Client Credentials flow.
 * Caches the token until it expires.
 */
export async function getMeliAccessToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiry) {
    return cachedToken;
  }

  const clientId = process.env.MELI_CLIENT_ID;
  const clientSecret = process.env.MELI_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing MELI_CLIENT_ID or MELI_CLIENT_SECRET in environment"
    );
  }

  try {
    const response = await fetch("https://api.mercadolivre.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Meli Auth Error: ${JSON.stringify(errorData)}`);
    }

    const data = (await response.json()) as MeliTokenResponse;
    cachedToken = data.access_token;
    // Cache for expires_in seconds, minus 60s buffer
    tokenExpiry = now + (data.expires_in - 60) * 1000;

    console.log("[Meli] Access token refreshed");
    return cachedToken;
  } catch (error) {
    console.error("[Meli] Error getting access token:", error);
    throw error;
  }
}

/**
 * Resolves a Mercado Livre URL (including meli.la short links) to an Item ID.
 * Example: https://produto.mercadolivre.com.br/MLB-123456 -> MLB123456
 */
export async function resolveMeliItemId(url: string): Promise<string | null> {
  if (!url) return null;

  let currentUrl = url;

  // Handle short links
  if (url.includes("meli.la")) {
    try {
      const response = await fetch(url, { redirect: "follow" });
      currentUrl = response.url;
    } catch (error) {
      console.error(`[Meli] Failed to resolve short URL ${url}:`, error);
      return null;
    }
  }

  // Regex for Meli IDs: ML plus one letter (e.g. B, A, C), optionally a dash, then digits
  const match = currentUrl.match(/ML[A-Z]-?\d+/i);
  if (match) {
    return match[0].toUpperCase().replace("-", "");
  }

  return null;
}

/**
 * Fetches item details from Meli API.
 */
export async function getMeliItem(itemId: string) {
  const token = await getMeliAccessToken();

  const response = await fetch(`https://api.mercadolivre.com/items/${itemId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    const errorData = await response.json();
    throw new Error(
      `Meli API Error (${response.status}): ${JSON.stringify(errorData)}`
    );
  }

  return await response.json();
}

/**
 * Extracts secure image URLs from a Meli item.
 */
export async function getMeliItemImages(itemId: string): Promise<string[]> {
  try {
    const item = await getMeliItem(itemId);
    if (!item || !item.pictures) return [];

    return item.pictures.map((p: any) => p.secure_url || p.url);
  } catch (error) {
    console.error(`[Meli] Error fetching images for ${itemId}:`, error);
    return [];
  }
}
