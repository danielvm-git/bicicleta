import os
import urllib.request

domains = {
    "Absolute": "absolutebikes.com.br",
    "Caloi": "caloi.com",
    "Chaoyang": "chaoyangtire.com",
    "Colli": "collibike.com.br",
    "Logan": "logan.com.tw",
    "Microshift": "microshift.com",
    "Oggi": "oggibikes.com.br",
    "Pirelli": "pirelli.com",
    "Promax": "promaxcomponents.com",
    "RockShox": "sram.com", # Will fix manually if needed
    "SR Suntour": "srsuntour.com",
    "SRAM": "sram.com",
    "Sense": "sensebike.com.br",
    "Shimano": "shimano.com",
    "Show": "showcomponents.com.br", # Guessing
    "Soul": "soulcycles.com.br",
    "SunRace": "sunrace.com",
    "TSW": "tswbike.com",
    "Vittoria": "vittoria.com",
    "Vzan": "vzan.com.br"
}

out_dir = "/Users/me/Sites/bicicleta/public/brands"
os.makedirs(out_dir, exist_ok=True)

for name, domain in domains.items():
    url = f"https://logo.clearbit.com/{domain}"
    out_path = os.path.join(out_dir, f"{name.lower().replace(' ', '_')}.png")
    try:
        urllib.request.urlretrieve(url, out_path)
        print(f"Downloaded {name} logo")
    except Exception as e:
        print(f"Failed to download {name} logo: {e}")
