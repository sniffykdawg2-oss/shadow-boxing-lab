import { BoxingScene } from "./scene.js";
import { CueManager, MOVES } from "./cues.js";
import { UI } from "./ui.js";
import { AudioBus } from "./audio.js";
import { chooseEnvironment, gameSettings, normalizeSettings } from "./settings.js";
import { createRoundStats } from "./gameState.js";

const canvas = document.querySelector("#game-canvas");
const world = new BoxingScene(canvas);
const ui = new UI();
const audio = new AudioBus();

let state = "menu";
let selectedEnvironment = "gym";
let activeSettings = normalizeSettings(gameSettings);
let stats = createRoundStats();
let roundStartTime = 0;
let pauseStartedAt = 0;
let pausedDuration = 0;
let lastTime = performance.now() / 1000;

const cues = new CueManager(world.scene, handleCueEvent);
world.loadEnvironment(selectedEnvironment);

ui.bindActions({
  play: () => startRound(),
  pause: pauseRound,
  resume: resumeRound,
  restart: () => startRound({ keepRoom: true }),
  replay: () => startRound({ keepRoom: true }),
  newRoom: () => startRound({ randomizeRoom: true }),
  mainMenu: mainMenu
});

requestAnimationFrame(loop);

async function startRound({ keepRoom = false, randomizeRoom = false } = {}) {
  activeSettings = normalizeSettings(ui.readSettings());
  ui.updatePreRoundSummary(activeSettings);
  stats = createRoundStats();
  stats.pace = paceLabel(activeSettings);
  stats.focus = focusLabel(activeSettings.trainingFocus);
  pausedDuration = 0;
  cues.stop();

  if (!keepRoom || randomizeRoom) {
    selectedEnvironment = chooseEnvironment(randomizeRoom ? "random" : activeSettings.environment);
    world.loadEnvironment(selectedEnvironment);
  }

  ui.showHud();
  ui.setCoach("Ready");
  ui.setCombo(["jab", "cross"]);
  world.gloves.setRealisticMode(activeSettings.realisticGloves);
  audio.ensureContext()?.resume();
  state = "countdown";
  await countdown();
  roundStartTime = performance.now() / 1000;
  cues.start(activeSettings, roundStartTime);
  state = "running";
  audio.bell();
}

function pauseRound() {
  pauseStartedAt = performance.now() / 1000;
  state = "paused";
  ui.showPause();
  audio.stopSpeech();
}

function resumeRound() {
  if (state !== "paused") {
    return;
  }
  pausedDuration += performance.now() / 1000 - pauseStartedAt;
  state = "running";
  ui.hidePause();
}

function mainMenu() {
  state = "menu";
  cues.stop();
  audio.stopSpeech();
  ui.showStart();
  ui.hideCountdown();
}

async function countdown() {
  for (const text of ["3", "2", "1", "Fight"]) {
    ui.showCountdown(text);
    audio.cue();
    await wait(text === "Fight" ? 520 : 720);
  }
  ui.hideCountdown();
}

function handleCueEvent(event) {
  if (event.type === "combo") {
    ui.setCombo(event.combo);
    if (activeSettings.audioCueMode) {
      audio.speakCombo(event.combo, MOVES);
    }
    stats.combos += 1;
    stats.longestCombo = Math.max(stats.longestCombo, event.combo.length);
  }
  if (event.type === "spawn") {
    ui.setCoach(event.cue.definition.coach);
    stats.cues += 1;
    if (event.cue.definition.type === "offense") {
      stats.offense += 1;
    } else {
      stats.defense += 1;
    }
    if (event.cue.move === "bodyShot" || event.cue.move === "rearBodyShot" || event.cue.definition.level === "body") {
      stats.bodyShots += 1;
    }
    if (["slipLeft", "slipRight", "duck", "rollLeft", "rollRight", "pivotLeft", "pivotRight"].includes(event.cue.move)) {
      stats.headMovement += 1;
    }
    audio.cue();
  }
  if (event.type === "demo") {
    world.gloves.animateMove(event.move);
  }
  if (event.type === "impact") {
    if (!event.cue.demoed) {
      world.gloves.animateMove(event.move);
    }
    ui.flash("good");
    world.addShake(event.force ?? 0.01);
    audio.hit();
  }
}

function loop(nowMs) {
  const now = nowMs / 1000;
  const delta = Math.min(0.04, now - lastTime);
  lastTime = now;

  const running = state === "running";
  if (running) {
    const elapsedRound = now - roundStartTime - pausedDuration;
    const remaining = activeSettings.roundLength - elapsedRound;
    cues.update(delta, now);
    ui.setHud(stats, remaining, activeSettings);

    if (remaining <= 0) {
      state = "ended";
      cues.stop();
      audio.stopSpeech();
      ui.showEnd(stats);
      audio.bell();
    }
  }

  world.update(delta, now, running);
  world.render();
  requestAnimationFrame(loop);
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function paceLabel(settings) {
  if (settings.rhythm <= 0.4 || settings.cueSpeed >= 9.4) {
    return "Fight";
  }
  if (settings.rhythm <= 0.52) {
    return "Fast";
  }
  if (settings.rhythm >= 0.85) {
    return "Drill";
  }
  return "Padwork";
}

function focusLabel(focus) {
  const labels = {
    mixed: "Mixed",
    jabCross: "Jab/Cross",
    hooks: "Hooks",
    body: "Body",
    defense: "Defense",
    headMovement: "Head Movement",
    chaos: "Chaos"
  };
  return labels[focus] ?? "Mixed";
}
