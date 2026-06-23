import { expect, test } from "@playwright/test";
import { PNG } from "pngjs";
import { generateCombo, MOVES } from "../cues.js";
import { normalizeSettings } from "../settings.js";

for (const viewport of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 }
]) {
  test(`renders a nonblank scene on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Shadow Boxing Lab" })).toBeVisible();
    await page.waitForTimeout(500);

    const screenshot = await page.locator("#game-canvas").screenshot({ path: `test-results/${viewport.name}-canvas.png` });
    const pixelCheck = inspectPixels(screenshot);
    expect(pixelCheck.filled).toBeGreaterThan(8);
    expect(pixelCheck.varied).toBeGreaterThan(2);
    await page.screenshot({ path: `test-results/${viewport.name}-start.png`, fullPage: true });
  });
}

test("starts a round and pauses from the HUD", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Shadow Boxing Lab" })).toBeVisible();

  const canvasBox = await page.locator("#game-canvas").boundingBox();
  expect(canvasBox.width).toBeGreaterThan(300);
  expect(canvasBox.height).toBeGreaterThan(300);

  const nonBlankBefore = await page.evaluate(() => {
    const canvas = document.querySelector("#game-canvas");
    const context = canvas.getContext("webgl2") || canvas.getContext("webgl");
    return Boolean(context);
  });
  expect(nonBlankBefore).toBe(true);

  await page.getByRole("button", { name: "Play" }).click();
  await expect(page.locator("#countdown")).toBeVisible();
  await page.waitForTimeout(2800);
  await expect(page.locator("#hud")).toBeVisible();
  await page.getByRole("button", { name: "Pause" }).click();
  await expect(page.getByRole("heading", { name: "Stay loose" })).toBeVisible();
});

test("manual combo length edits switch to custom and persist", async ({ page }) => {
  await page.goto("/");
  await page.locator("#combo-max").fill("12");
  await expect(page.locator("#combo-length-preset")).toHaveValue("custom");
  await expect(page.locator("#combo-max")).toHaveValue("12");
  await expect(page.locator("#pre-round-summary")).toContainText("2-12 cue combos");
});

test("setting info blurbs appear on hover", async ({ page }) => {
  await page.goto("/");
  await page.locator(".setting-help").first().hover();
  await expect(page.locator("#setting-tooltip")).toBeVisible();
  await expect(page.locator("#setting-tooltip")).toContainText("base training pace");
});

test("mode checkboxes cannot both be disabled", async ({ page }) => {
  await page.goto("/");
  await page.locator("#offense-mode").uncheck();
  await expect(page.locator("#offense-mode")).not.toBeChecked();
  await expect(page.locator("#defense-mode")).toBeChecked();
  await page.locator("#defense-mode").click();
  await expect(page.locator("#defense-mode")).toBeChecked();
});

test("audio cue and realistic glove settings start off and update the round summary", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#audio-cue-mode")).not.toBeChecked();
  await expect(page.locator("#realistic-gloves")).not.toBeChecked();
  await expect(page.locator("#pre-round-summary")).toContainText("audio calls off");
  await expect(page.locator("#pre-round-summary")).toContainText("labeled cues");

  await page.locator("#audio-cue-mode").check();
  await page.locator("#realistic-gloves").check();
  await expect(page.locator("#pre-round-summary")).toContainText("audio calls on");
  await expect(page.locator("#pre-round-summary")).toContainText("realistic gloves");
});

test("audio cue mode speaks the generated combo", async ({ page }) => {
  await page.addInitScript(() => {
    window.__spokenCombos = [];
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      configurable: true,
      value: class {
        constructor(text) {
          this.text = text;
        }
      }
    });
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        cancel() {},
        getVoices() {
          return [];
        },
        speak(utterance) {
          window.__spokenCombos.push(utterance.text);
        }
      }
    });
  });
  await page.goto("/");
  await page.locator("#audio-cue-mode").check();
  await page.getByRole("button", { name: "Play" }).click();
  await page.waitForTimeout(3200);
  await expect.poll(() => page.evaluate(() => window.__spokenCombos.length)).toBeGreaterThan(0);
  await expect.poll(() => page.evaluate(() => window.__spokenCombos.at(-1))).toMatch(/jab|cross|hook|body|block|slip|duck|roll/i);
});

for (const viewport of [
  { name: "tall phone", width: 390, height: 844 },
  { name: "short phone", width: 360, height: 640 }
]) {
  test(`mobile HUD keeps stats, coach cue, and pause controls separated on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/");
    await page.getByRole("button", { name: "Play" }).click();
    await page.waitForTimeout(2800);
    await expect(page.locator("#hud")).toBeVisible();

    const boxes = await page.evaluate(() => {
      const readBox = (selector) => {
        const rect = document.querySelector(selector).getBoundingClientRect();
        return { top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left };
      };
      return {
        stats: readBox(".stat-strip"),
        coach: readBox(".coach-wrap"),
        pause: readBox("#hud-pause-button")
      };
    });

    expect(overlaps(boxes.stats, boxes.coach)).toBe(false);
    expect(overlaps(boxes.coach, boxes.pause)).toBe(false);
  });
}

test("roll cues originate from their named side", () => {
  expect(MOVES.rollRight.entryLane).toBeGreaterThan(0);
  expect(MOVES.rollRight.lane).toBeGreaterThan(0);
  expect(MOVES.rollRight.height).toBeGreaterThan(MOVES.duck.height);
  expect(MOVES.rollRight.side).toBe("right");

  expect(MOVES.rollLeft.entryLane).toBeLessThan(0);
  expect(MOVES.rollLeft.lane).toBeLessThan(0);
  expect(MOVES.rollLeft.height).toBeGreaterThan(MOVES.duck.height);
  expect(MOVES.rollLeft.side).toBe("left");
});

test("settings materially change generated combos", () => {
  const longSettings = normalizeSettings({
    comboMin: 2,
    comboMax: 12,
    cueSpeed: 6.7,
    rhythm: 0.64,
    defensiveFrequency: 40,
    bodyShotFrequency: 30,
    intensity: "balanced",
    trainingFocus: "mixed"
  });
  const longCombos = Array.from({ length: 30 }, (_, index) => generateCombo(longSettings, index + 1));
  expect(longCombos.every((combo) => combo.length >= 2 && combo.length <= 12)).toBe(true);
  expect(longCombos.some((combo) => combo.length > 4)).toBe(true);

  const offenseOnlySettings = normalizeSettings({
    ...longSettings,
    comboMin: 8,
    comboMax: 12,
    defensiveFrequency: 0,
    bodyShotFrequency: 0
  });
  const offenseOnlyCombos = Array.from({ length: 20 }, (_, index) => generateCombo(offenseOnlySettings, index + 1));
  expect(offenseOnlyCombos.flat().some((move) => ["block", "blockLeftHead", "blockRightHead", "blockLeftBody", "blockRightBody", "slipLeft", "slipRight", "duck", "rollLeft", "rollRight"].includes(move))).toBe(false);
  expect(offenseOnlyCombos.flat().includes("bodyShot")).toBe(false);

  const defenseSettings = normalizeSettings({
    ...longSettings,
    comboMin: 6,
    comboMax: 12,
    defensiveFrequency: 60,
    trainingFocus: "defense"
  });
  const defenseMoves = Array.from({ length: 60 }, (_, index) => generateCombo(defenseSettings, index + 1)).flat();
  expect(defenseMoves.some((move) => ["rollLeft", "rollRight"].includes(move))).toBe(true);
  expect(defenseMoves.some((move) => ["blockLeftHead", "blockRightHead", "blockLeftBody", "blockRightBody"].includes(move))).toBe(true);
});

test("offense and defense modes filter cue families", () => {
  const baseSettings = {
    comboMin: 8,
    comboMax: 12,
    cueSpeed: 6.7,
    rhythm: 0.64,
    defensiveFrequency: 60,
    bodyShotFrequency: 30,
    intensity: "balanced",
    trainingFocus: "mixed"
  };
  const offensiveMoves = ["jab", "cross", "leadHook", "rearHook", "bodyShot"];
  const defensiveMoves = ["block", "blockLeftHead", "blockRightHead", "blockLeftBody", "blockRightBody", "slipLeft", "slipRight", "duck", "rollLeft", "rollRight"];

  const offenseOnly = normalizeSettings({ ...baseSettings, offenseMode: true, defenseMode: false });
  const offenseCombos = Array.from({ length: 20 }, (_, index) => generateCombo(offenseOnly, index + 1)).flat();
  expect(offenseCombos.every((move) => offensiveMoves.includes(move))).toBe(true);

  const defenseOnly = normalizeSettings({ ...baseSettings, offenseMode: false, defenseMode: true });
  const defenseCombos = Array.from({ length: 20 }, (_, index) => generateCombo(defenseOnly, index + 1)).flat();
  expect(defenseCombos.every((move) => defensiveMoves.includes(move))).toBe(true);
});

function inspectPixels(buffer) {
  const png = PNG.sync.read(buffer);
  let filled = 0;
  let varied = 0;

  for (let y = 0; y < 5; y += 1) {
    for (let x = 0; x < 5; x += 1) {
      const sampleX = Math.floor((png.width * (x + 1)) / 6);
      const sampleY = Math.floor((png.height * (y + 1)) / 6);
      const index = (sampleY * png.width + sampleX) * 4;
      const red = png.data[index];
      const green = png.data[index + 1];
      const blue = png.data[index + 2];

      if (red + green + blue > 18) {
        filled += 1;
      }
      if (Math.max(red, green, blue) - Math.min(red, green, blue) > 8) {
        varied += 1;
      }
    }
  }

  return { filled, varied };
}

function overlaps(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}
