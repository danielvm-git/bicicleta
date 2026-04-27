/**
 * Gera o logo Monta Bike em PNG usando @napi-rs/canvas ou canvas nativo
 * Salva em assets/logo-monta-bike.png com tamanho <= 1MB
 */
import { createCanvas } from "canvas";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const W = 800;
const H = 400;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext("2d");

// Background gradient - dark navy
const bg = ctx.createLinearGradient(0, 0, W, H);
bg.addColorStop(0, "#0a0f1e");
bg.addColorStop(1, "#0d1530");
ctx.fillStyle = bg;
ctx.fillRect(0, 0, W, H);

// Mountain shape (lettermark M + mountains)
ctx.save();
ctx.translate(W / 2, H / 2 - 30);

// Draw mountain peaks
const mountainGrad = ctx.createLinearGradient(-160, -100, 160, 80);
mountainGrad.addColorStop(0, "#1565C0");
mountainGrad.addColorStop(1, "#42A5F5");

ctx.fillStyle = mountainGrad;
ctx.beginPath();
// Left peak
ctx.moveTo(-140, 60);
ctx.lineTo(-60, -60);
ctx.lineTo(-20, -10);
// Middle peak
ctx.lineTo(20, -80);
ctx.lineTo(60, -20);
// Right peak
ctx.lineTo(100, -50);
ctx.lineTo(150, 60);
ctx.closePath();
ctx.fill();

// Bike silhouette (orange)
const bikeGrad = ctx.createLinearGradient(-20, -120, 80, -40);
bikeGrad.addColorStop(0, "#FF6F00");
bikeGrad.addColorStop(1, "#FF8F00");
ctx.strokeStyle = bikeGrad;
ctx.fillStyle = bikeGrad;
ctx.lineWidth = 5;
ctx.lineCap = "round";
ctx.lineJoin = "round";

// Rear wheel
ctx.beginPath();
ctx.arc(-40, -30, 28, 0, Math.PI * 2);
ctx.stroke();

// Front wheel
ctx.beginPath();
ctx.arc(60, -30, 28, 0, Math.PI * 2);
ctx.stroke();

// Frame
ctx.beginPath();
ctx.moveTo(-40, -30); // rear axle
ctx.lineTo(0, -80); // seat post
ctx.lineTo(40, -80); // top tube
ctx.lineTo(60, -30); // front axle
ctx.lineTo(30, -60); // fork
ctx.lineTo(0, -80); // back to top
ctx.stroke();

// Down tube
ctx.beginPath();
ctx.moveTo(-40, -30);
ctx.lineTo(30, -60);
ctx.stroke();

// Rider silhouette
ctx.beginPath();
ctx.arc(10, -95, 12, 0, Math.PI * 2);
ctx.fill();

ctx.restore();

// Text - MONTA
const textGrad = ctx.createLinearGradient(100, 0, 700, 0);
textGrad.addColorStop(0, "#1E88E5");
textGrad.addColorStop(1, "#42A5F5");

ctx.fillStyle = textGrad;
ctx.font = "bold 80px Arial, sans-serif";
ctx.textAlign = "center";
ctx.letterSpacing = "8px";
ctx.fillText("MONTA", W / 2, H - 110);

// Text - BIKE (smaller, spaced)
ctx.fillStyle = "#90CAF9";
ctx.font = "38px Arial, sans-serif";
ctx.fillText("B I K E", W / 2, H - 65);

// Subtle line accent
ctx.strokeStyle = "#1565C0";
ctx.lineWidth = 1;
ctx.globalAlpha = 0.4;
ctx.beginPath();
ctx.moveTo(180, H - 85);
ctx.lineTo(W - 180, H - 85);
ctx.stroke();
ctx.globalAlpha = 1;

// Save PNG
const dest = join(ROOT, "assets", "logo-monta-bike.png");
mkdirSync(join(ROOT, "assets"), { recursive: true });
const buffer = canvas.toBuffer("image/png", { compressionLevel: 9 });
writeFileSync(dest, buffer);

const sizeKB = (buffer.length / 1024).toFixed(1);
console.log(`✅ Logo salvo em: assets/logo-monta-bike.png`);
console.log(
  `📦 Tamanho: ${sizeKB} KB (${buffer.length < 1_000_000 ? "✓ abaixo de 1MB" : "✗ acima de 1MB"})`
);
