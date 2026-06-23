export const gameSettings = {
  difficulty: "medium",
  roundLength: 60,
  environment: "random",
  comboLengthPreset: "normal",
  comboMin: 2,
  comboMax: 4,
  cueSpeedPreset: "normal",
  cueSpeed: 6.7,
  rhythmPreset: "padwork",
  rhythm: 0.64,
  defensiveFrequency: 25,
  bodyShotFrequency: 20,
  intensity: "balanced",
  restPreset: "normal",
  restBetweenCombos: 0.95,
  telegraphTime: 0.95,
  trainingFocus: "mixed",
  offenseMode: true,
  defenseMode: true,
  demoAssist: true,
  audioCueMode: false,
  realisticGloves: false
};

export const ENVIRONMENTS = ["gym", "livingRoom", "backyard", "garage"];

export const comboLengthPresets = {
  beginner: [1, 2],
  normal: [2, 4],
  advanced: [4, 7],
  pro: [6, 10]
};

export const cueSpeedPresets = {
  slow: 4.8,
  normal: 6.7,
  fast: 8.4,
  fight: 9.8
};

export const rhythmPresets = {
  slow: 1.0,
  padwork: 0.64,
  fast: 0.46,
  chaos: 0.34
};

export const restPresets = {
  short: 0.5,
  normal: 0.95,
  long: 1.45
};

export const difficultyProfiles = {
  easy: {
    comboLengthPreset: "beginner",
    cueSpeedPreset: "slow",
    rhythmPreset: "slow",
    defensiveFrequency: 12,
    bodyShotFrequency: 12,
    restPreset: "long",
    telegraphTime: 1.35
  },
  medium: {
    comboLengthPreset: "normal",
    cueSpeedPreset: "normal",
    rhythmPreset: "padwork",
    defensiveFrequency: 25,
    bodyShotFrequency: 20,
    restPreset: "normal",
    telegraphTime: 0.95
  },
  hard: {
    comboLengthPreset: "advanced",
    cueSpeedPreset: "fast",
    rhythmPreset: "fast",
    defensiveFrequency: 38,
    bodyShotFrequency: 28,
    restPreset: "short",
    telegraphTime: 0.72
  }
};

export const intensityProfiles = {
  technical: {
    cueSpeed: 5.2,
    rhythm: 0.9,
    restBetweenCombos: 1.45,
    telegraphTime: 1.18,
    comboDelta: -1,
    defenseDelta: -8
  },
  balanced: {
    cueSpeed: 6.7,
    rhythm: 0.64,
    restBetweenCombos: 0.95,
    telegraphTime: 0.95,
    comboDelta: 0,
    defenseDelta: 0
  },
  conditioning: {
    cueSpeed: 8.3,
    rhythm: 0.48,
    restBetweenCombos: 0.62,
    telegraphTime: 0.78,
    comboDelta: 2,
    defenseDelta: 8
  },
  war: {
    cueSpeed: 9.8,
    rhythm: 0.36,
    restBetweenCombos: 0.32,
    telegraphTime: 0.58,
    comboDelta: 3,
    defenseDelta: 16
  }
};

export function normalizeSettings(settings) {
  const intensity = intensityProfiles[settings.intensity] ?? intensityProfiles.balanced;
  const comboMin = clamp(Math.round(settings.comboMin), 1, 8);
  const comboMax = clamp(Math.round(settings.comboMax), comboMin, 12);
  const offenseMode = settings.offenseMode !== false || settings.defenseMode === false;
  const defenseMode = settings.defenseMode !== false || settings.offenseMode === false;

  return {
    ...settings,
    offenseMode,
    defenseMode,
    cueSpeed: clamp(Number(settings.cueSpeed || intensity.cueSpeed), 4, 12),
    rhythm: clamp(Number(settings.rhythm || intensity.rhythm), 0.34, 1.4),
    defensiveFrequency:
      Number(settings.defensiveFrequency) <= 0
        ? 0
        : clamp(Number(settings.defensiveFrequency) + intensity.defenseDelta, 0, 60),
    bodyShotFrequency: clamp(Number(settings.bodyShotFrequency), 0, 50),
    restBetweenCombos: clamp(Number(settings.restBetweenCombos || intensity.restBetweenCombos), 0.25, 2.4),
    telegraphTime: clamp(Number(settings.telegraphTime || intensity.telegraphTime), 0.45, 1.8),
    comboMin: clamp(comboMin + Math.min(0, intensity.comboDelta), 1, 8),
    comboMax: clamp(comboMax + Math.max(0, intensity.comboDelta), comboMin, 12)
  };
}

export function chooseEnvironment(environment) {
  if (environment && environment !== "random") {
    return environment;
  }
  return ENVIRONMENTS[Math.floor(Math.random() * ENVIRONMENTS.length)];
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
