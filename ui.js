import {
  comboLengthPresets,
  cueSpeedPresets,
  difficultyProfiles,
  gameSettings,
  intensityProfiles,
  restPresets,
  rhythmPresets
} from "./settings.js";
import { MOVES } from "./cues.js";

export class UI {
  constructor() {
    this.startScreen = document.querySelector("#start-screen");
    this.pauseScreen = document.querySelector("#pause-screen");
    this.endScreen = document.querySelector("#end-screen");
    this.hud = document.querySelector("#hud");
    this.countdown = document.querySelector("#countdown");
    this.screenFlash = document.querySelector("#screen-flash");
    this.settingTooltip = document.querySelector("#setting-tooltip");
    this.summaryStats = document.querySelector("#summary-stats");
    this.preRoundSummary = document.querySelector("#pre-round-summary");
    this.controls = this.collectControls();
    this.bindSettingsControls();
    this.bindSettingTooltips();
  }

  collectControls() {
    return {
      difficulty: document.querySelector("#difficulty"),
      roundLength: document.querySelector("#round-length"),
      environment: document.querySelector("#environment"),
      comboLengthPreset: document.querySelector("#combo-length-preset"),
      comboMin: document.querySelector("#combo-min"),
      comboMax: document.querySelector("#combo-max"),
      cueSpeedPreset: document.querySelector("#cue-speed-preset"),
      cueSpeed: document.querySelector("#cue-speed"),
      rhythmPreset: document.querySelector("#rhythm-preset"),
      rhythm: document.querySelector("#rhythm"),
      defensiveFrequency: document.querySelector("#defense-frequency"),
      bodyShotFrequency: document.querySelector("#body-frequency"),
      intensity: document.querySelector("#intensity"),
      restPreset: document.querySelector("#rest-preset"),
      rest: document.querySelector("#rest"),
      telegraph: document.querySelector("#telegraph"),
      trainingFocus: document.querySelector("#training-focus"),
      offenseMode: document.querySelector("#offense-mode"),
      defenseMode: document.querySelector("#defense-mode"),
      demoAssist: document.querySelector("#demo-assist"),
      audioCueMode: document.querySelector("#audio-cue-mode"),
      realisticGloves: document.querySelector("#realistic-gloves")
    };
  }

  bindSettingsControls() {
    const update = () => {
      this.applyPresetControls();
      this.readSettings();
      this.updateSettingsLabels();
      this.updatePreRoundSummary();
    };

    this.controls.comboMin.addEventListener("input", () => {
      this.controls.comboLengthPreset.value = "custom";
    });
    this.controls.comboMax.addEventListener("input", () => {
      this.controls.comboLengthPreset.value = "custom";
    });
    this.controls.cueSpeed.addEventListener("input", () => {
      this.controls.cueSpeedPreset.value = "custom";
    });
    this.controls.rhythm.addEventListener("input", () => {
      this.controls.rhythmPreset.value = "custom";
    });
    this.controls.rest.addEventListener("input", () => {
      this.controls.restPreset.value = "custom";
    });
    this.controls.offenseMode.addEventListener("change", () => {
      this.keepOneModeEnabled(this.controls.offenseMode);
    });
    this.controls.defenseMode.addEventListener("change", () => {
      this.keepOneModeEnabled(this.controls.defenseMode);
    });

    Object.values(this.controls).forEach((control) => {
      control.addEventListener("input", update);
      control.addEventListener("change", update);
    });

    this.controls.difficulty.addEventListener("change", () => {
      this.applyDifficultyProfile(this.controls.difficulty.value);
      update();
    });

    this.controls.intensity.addEventListener("change", () => {
      this.applyIntensityProfile(this.controls.intensity.value);
      update();
    });

    update();
  }

  bindSettingTooltips() {
    document.querySelectorAll(".setting-help").forEach((help) => {
      help.addEventListener("mouseenter", () => this.showSettingTooltip(help));
      help.addEventListener("focus", () => this.showSettingTooltip(help));
      help.addEventListener("mouseleave", () => this.hideSettingTooltip());
      help.addEventListener("blur", () => this.hideSettingTooltip());
    });
    window.addEventListener("resize", () => this.hideSettingTooltip());
    document.querySelector(".settings-shell").addEventListener("scroll", () => this.hideSettingTooltip());
  }

  showSettingTooltip(help) {
    const text = help.dataset.tooltip;
    if (!text) {
      return;
    }

    this.settingTooltip.textContent = text;
    this.settingTooltip.classList.remove("hidden");
    const helpRect = help.getBoundingClientRect();
    const tooltipRect = this.settingTooltip.getBoundingClientRect();
    const left = Math.min(
      window.innerWidth - tooltipRect.width - 14,
      Math.max(14, helpRect.left + helpRect.width / 2 - tooltipRect.width / 2)
    );
    const preferredTop = helpRect.top - tooltipRect.height - 10;
    const top = preferredTop > 12 ? preferredTop : helpRect.bottom + 10;

    this.settingTooltip.style.left = `${left}px`;
    this.settingTooltip.style.top = `${top}px`;
  }

  hideSettingTooltip() {
    this.settingTooltip.classList.add("hidden");
  }

  keepOneModeEnabled(changedControl) {
    if (!this.controls.offenseMode.checked && !this.controls.defenseMode.checked) {
      changedControl.checked = true;
    }
  }

  applyDifficultyProfile(difficulty) {
    const profile = difficultyProfiles[difficulty];
    if (!profile) {
      return;
    }
    this.controls.comboLengthPreset.value = profile.comboLengthPreset;
    this.controls.cueSpeedPreset.value = profile.cueSpeedPreset;
    this.controls.rhythmPreset.value = profile.rhythmPreset;
    this.controls.defensiveFrequency.value = profile.defensiveFrequency;
    this.controls.bodyShotFrequency.value = profile.bodyShotFrequency;
    this.controls.restPreset.value = profile.restPreset;
    this.controls.telegraph.value = profile.telegraphTime;
  }

  applyIntensityProfile(intensity) {
    const profile = intensityProfiles[intensity];
    if (!profile) {
      return;
    }
    this.controls.cueSpeedPreset.value = "custom";
    this.controls.rhythmPreset.value = "custom";
    this.controls.restPreset.value = "custom";
    this.controls.cueSpeed.value = profile.cueSpeed;
    this.controls.rhythm.value = profile.rhythm;
    this.controls.rest.value = profile.restBetweenCombos;
    this.controls.telegraph.value = profile.telegraphTime;
  }

  applyPresetControls() {
    const comboPreset = this.controls.comboLengthPreset.value;
    if (comboPreset !== "custom") {
      const [min, max] = comboLengthPresets[comboPreset];
      this.controls.comboMin.value = min;
      this.controls.comboMax.value = max;
    }

    if (this.controls.cueSpeedPreset.value !== "custom") {
      this.controls.cueSpeed.value = cueSpeedPresets[this.controls.cueSpeedPreset.value];
    }

    if (this.controls.rhythmPreset.value !== "custom") {
      this.controls.rhythm.value = rhythmPresets[this.controls.rhythmPreset.value];
    }

    if (this.controls.restPreset.value !== "custom") {
      this.controls.rest.value = restPresets[this.controls.restPreset.value];
    }

    const min = Math.max(1, Math.min(8, Number(this.controls.comboMin.value)));
    const max = Math.max(min, Math.min(12, Number(this.controls.comboMax.value)));
    this.controls.comboMin.value = min;
    this.controls.comboMax.value = max;
  }

  readSettings() {
    Object.assign(gameSettings, {
      difficulty: this.controls.difficulty.value,
      roundLength: Number(this.controls.roundLength.value),
      environment: this.controls.environment.value,
      comboLengthPreset: this.controls.comboLengthPreset.value,
      comboMin: Number(this.controls.comboMin.value),
      comboMax: Number(this.controls.comboMax.value),
      cueSpeedPreset: this.controls.cueSpeedPreset.value,
      cueSpeed: Number(this.controls.cueSpeed.value),
      rhythmPreset: this.controls.rhythmPreset.value,
      rhythm: Number(this.controls.rhythm.value),
      defensiveFrequency: Number(this.controls.defensiveFrequency.value),
      bodyShotFrequency: Number(this.controls.bodyShotFrequency.value),
      intensity: this.controls.intensity.value,
      restPreset: this.controls.restPreset.value,
      restBetweenCombos: Number(this.controls.rest.value),
      telegraphTime: Number(this.controls.telegraph.value),
      trainingFocus: this.controls.trainingFocus.value,
      offenseMode: this.controls.offenseMode.checked,
      defenseMode: this.controls.defenseMode.checked,
      demoAssist: this.controls.demoAssist.checked,
      audioCueMode: this.controls.audioCueMode.checked,
      realisticGloves: this.controls.realisticGloves.checked
    });
    return gameSettings;
  }

  updateSettingsLabels() {
    document.querySelector("#defense-value").textContent = `${this.controls.defensiveFrequency.value}%`;
    document.querySelector("#body-value").textContent = `${this.controls.bodyShotFrequency.value}%`;
  }

  updatePreRoundSummary(settings = gameSettings) {
    const modeLabel = settings.offenseMode && settings.defenseMode ? "mixed offense/defense" : settings.offenseMode ? "offense only" : "defense only";
    const audioLabel = settings.audioCueMode ? "audio calls on" : "audio calls off";
    const gloveLabel = settings.realisticGloves ? "realistic gloves" : "labeled cues";
    this.preRoundSummary.textContent = `${settings.comboMin}-${settings.comboMax} cue combos, ${modeLabel}, speed ${Number(settings.cueSpeed).toFixed(1)}, rhythm ${Number(settings.rhythm).toFixed(2)}s, ${settings.defensiveFrequency}% defense, ${settings.bodyShotFrequency}% body shots, ${audioLabel}, ${gloveLabel}.`;
  }

  bindActions(actions) {
    document.querySelector("#play-button").addEventListener("click", actions.play);
    document.querySelector("#hud-pause-button").addEventListener("click", actions.pause);
    document.querySelector("#resume-button").addEventListener("click", actions.resume);
    document.querySelector("#restart-button").addEventListener("click", actions.restart);
    document.querySelector("#pause-main-menu-button").addEventListener("click", actions.mainMenu);
    document.querySelector("#replay-button").addEventListener("click", actions.replay);
    document.querySelector("#new-room-button").addEventListener("click", actions.newRoom);
    document.querySelector("#end-main-menu-button").addEventListener("click", actions.mainMenu);
  }

  showStart() {
    this.startScreen.classList.remove("hidden");
    this.pauseScreen.classList.add("hidden");
    this.endScreen.classList.add("hidden");
    this.hud.classList.add("hidden");
  }

  showHud() {
    this.startScreen.classList.add("hidden");
    this.pauseScreen.classList.add("hidden");
    this.endScreen.classList.add("hidden");
    this.hud.classList.remove("hidden");
  }

  showPause() {
    this.pauseScreen.classList.remove("hidden");
  }

  hidePause() {
    this.pauseScreen.classList.add("hidden");
  }

  showCountdown(text) {
    this.countdown.textContent = text;
    this.countdown.classList.remove("hidden");
  }

  hideCountdown() {
    this.countdown.classList.add("hidden");
  }

  setHud(stats, secondsRemaining, settings) {
    document.querySelector("#timer").textContent = formatTime(secondsRemaining);
    document.querySelector("#combo-count").textContent = stats.combos;
    document.querySelector("#cue-count").textContent = stats.cues;
    document.querySelector("#pace-label").textContent = paceLabel(settings);
  }

  setCombo(combo) {
    document.querySelector("#combo-line").textContent = combo.map((move) => MOVES[move].label).join("  |  ");
  }

  setCoach(text) {
    document.querySelector("#coach-cue").textContent = text;
  }

  flash(kind) {
    this.screenFlash.className = `screen-flash ${kind}`;
    window.setTimeout(() => {
      this.screenFlash.className = "screen-flash";
    }, 120);
  }

  showEnd(stats) {
    this.hud.classList.add("hidden");
    this.endScreen.classList.remove("hidden");
    const rows = [
      ["Combos", stats.combos],
      ["Total Cues", stats.cues],
      ["Punch Calls", stats.offense],
      ["Defense Calls", stats.defense],
      ["Body Calls", stats.bodyShots],
      ["Head Movement", stats.headMovement],
      ["Longest Combo", stats.longestCombo],
      ["Round Pace", stats.pace],
      ["Focus", stats.focus]
    ];
    this.summaryStats.innerHTML = rows.map(([label, value]) => `<div><b>${value}</b><span>${label}</span></div>`).join("");
  }
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

function formatTime(seconds) {
  const clamped = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(clamped / 60).toString().padStart(2, "0");
  const secs = (clamped % 60).toString().padStart(2, "0");
  return `${minutes}:${secs}`;
}
