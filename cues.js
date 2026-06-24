import * as THREE from "three";
import { clamp } from "./settings.js";

export const MOVES = {
  jab: {
    label: "Jab",
    coach: "Jab!",
    type: "offense",
    hand: "left",
    lane: -0.44,
    height: 0.18,
    padTurn: -0.2,
    rhythm: 0.86,
    color: 0xe14f4f
  },
  cross: {
    label: "Cross",
    coach: "Cross!",
    type: "offense",
    hand: "right",
    lane: 0.46,
    height: 0.15,
    padTurn: 0.22,
    rhythm: 0.92,
    color: 0x72a7ff
  },
  leadHook: {
    label: "Lead Hook",
    coach: "Lead hook!",
    type: "offense",
    hand: "left",
    lane: -0.82,
    height: 0.08,
    padTurn: -0.72,
    rhythm: 1.08,
    color: 0xff855c
  },
  rearHook: {
    label: "Rear Hook",
    coach: "Rear hook!",
    type: "offense",
    hand: "right",
    lane: 0.82,
    height: 0.08,
    padTurn: 0.72,
    rhythm: 1.08,
    color: 0x8fb6ff
  },
  bodyShot: {
    label: "Left Body",
    coach: "Left body!",
    type: "offense",
    hand: "left",
    lane: -0.18,
    height: -0.56,
    padTurn: -0.12,
    rhythm: 1.04,
    color: 0x55d6be
  },
  rearBodyShot: {
    label: "Right Body",
    coach: "Right body!",
    type: "offense",
    hand: "right",
    lane: 0.18,
    height: -0.56,
    padTurn: 0.12,
    rhythm: 1.04,
    color: 0x47c7df
  },
  leadUppercut: {
    label: "Left Uppercut",
    coach: "Left uppercut!",
    type: "offense",
    hand: "left",
    lane: -0.24,
    height: -0.16,
    padTurn: -0.08,
    padTilt: 0.56,
    rhythm: 1.08,
    color: 0x55d86f
  },
  rearUppercut: {
    label: "Right Uppercut",
    coach: "Right uppercut!",
    type: "offense",
    hand: "right",
    lane: 0.24,
    height: -0.16,
    padTurn: 0.08,
    padTilt: 0.56,
    rhythm: 1.08,
    color: 0x55d86f
  },
  block: {
    label: "Block",
    coach: "Block!",
    type: "defense",
    lane: 0,
    height: 0.16,
    defenseKind: "punch",
    rhythm: 1.04,
    color: 0xd84242
  },
  blockLeftHead: {
    label: "Block Left High",
    coach: "Block left high!",
    type: "defense",
    lane: -0.95,
    entryLane: -3.25,
    height: 0.2,
    defenseKind: "sidePunch",
    side: "left",
    level: "head",
    rhythm: 1.04,
    color: 0xd84242
  },
  blockRightHead: {
    label: "Block Right High",
    coach: "Block right high!",
    type: "defense",
    lane: 0.95,
    entryLane: 3.25,
    height: 0.2,
    defenseKind: "sidePunch",
    side: "right",
    level: "head",
    rhythm: 1.04,
    color: 0xd84242
  },
  blockLeftBody: {
    label: "Block Left Body",
    coach: "Block left body!",
    type: "defense",
    lane: -0.95,
    entryLane: -3.15,
    height: -0.45,
    defenseKind: "sidePunch",
    side: "left",
    level: "body",
    rhythm: 1.1,
    color: 0xc83e36
  },
  blockRightBody: {
    label: "Block Right Body",
    coach: "Block right body!",
    type: "defense",
    lane: 0.95,
    entryLane: 3.15,
    height: -0.45,
    defenseKind: "sidePunch",
    side: "right",
    level: "body",
    rhythm: 1.1,
    color: 0xc83e36
  },
  slipLeft: {
    label: "Slip Left",
    coach: "Slip left!",
    type: "defense",
    lane: 0.5,
    height: 0.08,
    defenseKind: "bar",
    rhythm: 1.02,
    color: 0xe14f4f
  },
  slipRight: {
    label: "Slip Right",
    coach: "Slip right!",
    type: "defense",
    lane: -0.5,
    height: 0.08,
    defenseKind: "bar",
    rhythm: 1.02,
    color: 0xe14f4f
  },
  duck: {
    label: "Duck",
    coach: "Duck!",
    type: "defense",
    lane: 0,
    height: 0.5,
    defenseKind: "bar",
    rhythm: 1.12,
    color: 0xeac46a
  },
  rollLeft: {
    label: "Roll Left",
    coach: "Roll left!",
    type: "defense",
    lane: -1.05,
    entryLane: -3.25,
    height: 0.66,
    defenseKind: "rollBar",
    side: "left",
    rhythm: 1.18,
    color: 0xeac46a
  },
  rollRight: {
    label: "Roll Right",
    coach: "Roll right!",
    type: "defense",
    lane: 1.05,
    entryLane: 3.25,
    height: 0.66,
    defenseKind: "rollBar",
    side: "right",
    rhythm: 1.18,
    color: 0xeac46a
  },
  pivotLeft: {
    label: "Pivot Left",
    coach: "Pivot left!",
    type: "defense",
    lane: -0.28,
    height: 0.08,
    defenseKind: "pivot",
    side: "left",
    rhythm: 1.24,
    color: 0x55d6be
  },
  pivotRight: {
    label: "Pivot Right",
    coach: "Pivot right!",
    type: "defense",
    lane: 0.28,
    height: 0.08,
    defenseKind: "pivot",
    side: "right",
    rhythm: 1.24,
    color: 0x55d6be
  }
};

const offenseOnly = ["jab", "cross", "leadHook", "rearHook", "bodyShot", "rearBodyShot", "leadUppercut", "rearUppercut"];
const sideBlockMoves = ["blockLeftHead", "blockRightHead", "blockLeftBody", "blockRightBody"];
const headMovementMoves = ["slipLeft", "slipRight", "duck", "rollLeft", "rollRight"];
const pivotMoves = ["pivotLeft", "pivotRight"];
const defenseMoves = ["block", ...sideBlockMoves, ...headMovementMoves, ...pivotMoves];
const comboDefenseMoves = ["block", ...sideBlockMoves, ...headMovementMoves];
const counterStarters = ["jab", "cross", "leadHook", "bodyShot", "rearBodyShot", "leadUppercut", "rearUppercut"];
const focusTemplates = {
  mixed: [
    ["jab"],
    ["jab", "cross"],
    ["jab", "cross", "leadHook"],
    ["jab", "cross", "leadHook", "cross"],
    ["jab", "bodyShot", "cross"],
    ["jab", "rearBodyShot", "leadHook"],
    ["jab", "leadUppercut", "cross"],
    ["jab", "cross", "slipRight", "cross"],
    ["blockLeftHead", "cross", "leadHook"],
    ["rollRight", "leadHook", "cross"],
    ["duck", "bodyShot", "leadHook"]
  ],
  jabCross: [
    ["jab"],
    ["jab", "jab"],
    ["jab", "cross"],
    ["jab", "jab", "cross"],
    ["jab", "cross", "jab"],
    ["jab", "cross", "jab", "cross"],
    ["cross", "jab", "cross"]
  ],
  hooks: [
    ["jab", "leadHook"],
    ["cross", "leadHook"],
    ["jab", "cross", "leadHook"],
    ["leadHook", "rearHook"],
    ["jab", "leadHook", "cross"],
    ["cross", "rearUppercut", "leadHook"],
    ["rollLeft", "rearHook", "leadHook"],
    ["bodyShot", "leadHook", "rearHook"]
  ],
  body: [
    ["jab", "bodyShot"],
    ["jab", "bodyShot", "cross"],
    ["cross", "rearBodyShot", "leadHook"],
    ["cross", "bodyShot", "leadHook"],
    ["duck", "bodyShot", "leadHook"],
    ["blockLeftBody", "bodyShot", "cross"],
    ["blockRightBody", "rearBodyShot", "leadHook"],
    ["jab", "cross", "bodyShot", "leadHook"],
    ["bodyShot", "rearBodyShot", "leadHook"]
  ],
  defense: [
    ["block", "cross"],
    ["blockLeftHead", "cross"],
    ["blockRightHead", "leadHook"],
    ["blockLeftBody", "bodyShot"],
    ["blockRightBody", "cross"],
    ["rollLeft", "rearHook"],
    ["rollRight", "leadHook"],
    ["slipLeft", "cross"],
    ["slipRight", "leadHook"],
    ["duck", "bodyShot"],
    ["duck", "rearUppercut"],
    ["block", "cross", "leadHook"],
    ["slipRight", "cross", "leadHook"],
    ["duck", "bodyShot", "cross"]
  ],
  headMovement: [
    ["slipLeft", "cross"],
    ["slipRight", "leadHook"],
    ["duck", "bodyShot"],
    ["duck", "leadUppercut"],
    ["rollLeft", "rearHook"],
    ["rollRight", "leadHook"],
    ["rollLeft", "rearHook", "cross"],
    ["slipLeft", "cross", "leadHook"],
    ["slipRight", "cross", "rollLeft", "rearHook"],
    ["duck", "leadHook", "rearHook"]
  ],
  chaos: [
    ["jab", "cross", "leadHook", "rearHook"],
    ["jab", "bodyShot", "cross", "leadHook"],
    ["jab", "leadUppercut", "cross", "rearUppercut"],
    ["slipRight", "cross", "leadHook", "rearHook"],
    ["blockRightHead", "cross", "duck", "bodyShot", "leadHook"],
    ["jab", "cross", "rollRight", "leadHook", "cross"],
    ["duck", "bodyShot", "rearBodyShot", "leadHook", "rearHook"]
  ]
};

export class CueManager {
  constructor(scene, onCueEvent) {
    this.scene = scene;
    this.onCueEvent = onCueEvent;
    this.activeCues = [];
    this.comboQueue = [];
    this.nextSpawnTime = 0;
    this.nextComboTime = 0;
    this.currentCombo = [];
    this.comboCount = 0;
    this.settings = null;
    this.running = false;
  }

  start(settings, now) {
    this.clear();
    this.settings = settings;
    this.running = true;
    this.comboCount = 0;
    this.nextComboTime = now + 0.35;
  }

  stop() {
    this.running = false;
    this.clear();
  }

  clear() {
    this.activeCues.forEach((cue) => this.scene.remove(cue.group));
    this.activeCues = [];
    this.comboQueue = [];
    this.currentCombo = [];
  }

  update(delta, now) {
    if (!this.running || !this.settings) {
      return;
    }

    if (!this.comboQueue.length && now >= this.nextComboTime) {
      this.comboCount += 1;
      this.currentCombo = generateCombo(this.settings, this.comboCount);
      this.comboQueue = [...this.currentCombo];
      this.nextSpawnTime = now + 0.28;
      this.onCueEvent({ type: "combo", combo: this.currentCombo });
    }

    if (this.comboQueue.length && now >= this.nextSpawnTime) {
      const move = this.comboQueue.shift();
      const nextMove = this.comboQueue[0];
      this.spawnCue(move, now);
      this.nextSpawnTime = now + spacingFor(move, nextMove, this.settings);
      if (!this.comboQueue.length) {
        this.nextComboTime = now + this.settings.telegraphTime + this.settings.restBetweenCombos;
      }
    }

    for (let index = this.activeCues.length - 1; index >= 0; index -= 1) {
      const cue = this.activeCues[index];
      const progress = clamp((now - cue.spawnedAt) / cue.telegraphTime, 0, 1.35);
      const arrival = easeOutCubic(clamp(progress, 0, 1));
      cue.group.position.z = THREE.MathUtils.lerp(cue.spawnZ, cue.targetZ, arrival);
      cue.group.position.x = sideAwareLane(cue, arrival) + Math.sin((now - cue.spawnedAt) * 5.5 + cue.phase) * cue.drift;
      cue.group.rotation.x = cue.baseRotation.x + Math.sin(now * 6 + cue.phase) * 0.025;
      cue.group.rotation.y = cue.baseRotation.y + Math.sin(now * 4 + cue.phase) * 0.035 + cue.sideYaw * arrival;
      cue.group.rotation.z = cue.baseRotation.z + cue.rollSpin * arrival;
      cue.group.scale.setScalar(1 + Math.max(0, 1 - Math.abs(cue.hitAt - now) / cue.telegraphTime) * 0.06);
      cue.warningRing.material.opacity = 0.14 + Math.sin(now * 16 + cue.phase) * 0.035;

      if (!cue.demoed && this.settings.demoAssist && now >= cue.hitAt - cue.demoLead) {
        cue.demoed = true;
        this.onCueEvent({ type: "demo", move: cue.move });
      }

      if (!cue.impacted && now >= cue.hitAt) {
        cue.impacted = true;
        addHitBurst(cue.group);
        this.onCueEvent({ type: "impact", cue, move: cue.move, force: cue.definition.type === "offense" ? 0.018 : 0.01 });
      }

      if (now > cue.hitAt + cue.exitTime) {
        this.scene.remove(cue.group);
        this.activeCues.splice(index, 1);
      }
    }
  }

  spawnCue(move, now) {
    const definition = MOVES[move];
    const telegraph = this.settings.telegraphTime;
    const speed = this.settings.cueSpeed;
    const targetZ = definition.type === "offense" ? -1.88 : -1.75;
    const sideCue = definition.defenseKind === "sidePunch" || definition.defenseKind === "rollBar";
    const sideSign = definition.side === "left" ? -1 : definition.side === "right" ? 1 : 0;
    const adjustedTargetZ = sideCue ? -1.42 : targetZ;
    const spawnZ = adjustedTargetZ - speed * telegraph;
    const entryLane = definition.entryLane ?? definition.lane;
    const group = definition.type === "offense"
      ? createPad(definition, this.settings.realisticGloves)
      : createDefenseCue(definition, definition.defenseKind === "pivot" ? false : this.settings.realisticGloves);
    group.position.set(entryLane, definition.height, spawnZ);
    group.rotation.set(definition.type === "offense" ? (definition.padTilt ?? -0.06) : 0, definition.padTurn ?? 0, 0);
    this.scene.add(group);

    this.activeCues.push({
      move,
      definition,
      group,
      warningRing: group.userData.warningRing,
      spawnedAt: now,
      hitAt: now + telegraph,
      targetZ: adjustedTargetZ,
      spawnZ,
      entryLane,
      speed,
      telegraphTime: telegraph,
      demoLead: clamp(0.18 + (0.7 - this.settings.rhythm) * 0.1, 0.1, 0.24),
      exitTime: definition.type === "offense" ? 0.22 : 0.3,
      drift: definition.type === "offense" ? 0.018 : sideCue ? 0.006 : 0.012,
      sideYaw:
        definition.defenseKind === "sidePunch"
          ? -sideSign * 0.7
          : definition.defenseKind === "rollBar"
            ? -sideSign * 0.55
            : 0,
      rollSpin: definition.defenseKind === "rollBar" ? -sideSign * 0.18 : 0,
      phase: Math.random() * Math.PI * 2,
      baseRotation: group.rotation.clone(),
      demoed: false,
      impacted: false
    });

    this.onCueEvent({ type: "spawn", cue: this.activeCues[this.activeCues.length - 1] });
  }
}

export function generateCombo(settings, comboCount = 1) {
  const templates = focusTemplates[settings.trainingFocus] ?? focusTemplates.mixed;
  const index = (comboCount + Math.floor(Math.random() * Math.min(3, templates.length))) % templates.length;
  const targetLength = targetComboLength(settings, comboCount);
  let combo = [...templates[index]];

  combo = applyFocusVariation(combo, settings, comboCount, targetLength);
  combo = enforceFrequencies(combo, settings);
  combo = fitComboLength(combo, settings, targetLength);
  combo = enforceMoveWeights(combo, settings);
  combo = smoothCombo(combo);
  combo = enforceMoveWeights(enforceFrequencies(combo, settings), settings).slice(0, targetLength);
  return maybeAddPivot(combo, settings);
}

function targetComboLength(settings, comboCount) {
  const min = clamp(Math.round(settings.comboMin), 1, 12);
  const max = clamp(Math.round(settings.comboMax), min, 12);
  const span = max - min;
  if (span <= 0) {
    return min;
  }

  const wave = (comboCount * 3) % (span + 1);
  const roll = Math.floor(Math.random() * (span + 1));
  return min + Math.max(wave, roll);
}

function applyFocusVariation(combo, settings, comboCount, targetLength) {
  const varied = [...combo];
  const canDefend = settings.defensiveFrequency > 0 && settings.trainingFocus !== "jabCross";
  const defenseChance = settings.trainingFocus === "defense" || settings.trainingFocus === "headMovement"
    ? Math.max(settings.defensiveFrequency, 42)
    : settings.defensiveFrequency;

  if (canDefend && Math.random() * 100 < defenseChance && !varied.some((move) => defenseMoves.includes(move))) {
    const defense = settings.trainingFocus === "headMovement" ? pickWeighted(headMovementMoves, settings) : pickWeighted(comboDefenseMoves, settings);
    const insertAt = clamp(Math.floor(varied.length / 2), 0, varied.length);
    varied.splice(insertAt, 0, defense, counterAfterDefense(defense));
  }

  if ((settings.trainingFocus === "chaos" || comboCount % 5 === 0) && varied.length < targetLength) {
    varied.push(pickWeighted(["cross", "leadHook", "bodyShot", "rearBodyShot", "leadUppercut", "rearUppercut"], settings));
  }

  return varied;
}

function enforceFrequencies(combo, settings) {
  if (settings.defenseMode === false || settings.defensiveFrequency <= 0) {
    combo = combo.filter((move) => !defenseMoves.includes(move));
  }

  if (settings.offenseMode === false) {
    combo = combo.filter((move) => !offenseOnly.includes(move));
  }

  if (settings.bodyShotFrequency <= 0) {
    combo = combo.map((move, index) => move === "bodyShot" || move === "rearBodyShot" ? (index % 2 === 0 ? "jab" : "cross") : move);
  }

  const hasBody = combo.includes("bodyShot") || combo.includes("rearBodyShot");
  const shouldAddBody =
    settings.offenseMode !== false &&
    settings.bodyShotFrequency > 0 &&
    (Math.random() * 100 < settings.bodyShotFrequency || settings.trainingFocus === "body");
  if (!hasBody && shouldAddBody) {
    const insertAt = combo[0] === "jab" ? 1 : Math.min(2, combo.length);
    combo.splice(insertAt, 0, pickWeighted(["bodyShot", "rearBodyShot"], settings));
  }

  return combo.length ? combo : [fallbackMove(settings)];
}

function maybeAddPivot(combo, settings) {
  const pivotFrequency = moveWeight("pivotLeft", settings) + moveWeight("pivotRight", settings);
  const canPivot = settings.defenseMode !== false && pivotFrequency > 0 && settings.trainingFocus !== "jabCross";
  const maxLength = clamp(Math.round(settings.comboMax), 1, 12);
  if (!canPivot || combo.length >= maxLength || Math.random() * 100 >= Math.min(100, pivotFrequency / 2)) {
    return combo;
  }

  return [...combo, pickWeighted(pivotMoves, settings)];
}

function fitComboLength(combo, settings, targetLength) {
  while (combo.length < targetLength) {
    combo.push(...nextPadworkFragment(combo, settings, targetLength - combo.length));
  }

  if (combo.length > targetLength) {
    combo = combo.slice(0, targetLength);
  }

  return combo;
}

function enforceMoveWeights(combo, settings) {
  return combo.map((move) => {
    if (moveWeight(move, settings) > 0) {
      return move;
    }

    if (offenseOnly.includes(move)) {
      return pickWeighted(offenseOnly.filter((candidate) => moveWeight(candidate, settings) > 0), settings);
    }

    if (comboDefenseMoves.includes(move)) {
      return pickWeighted(comboDefenseMoves.filter((candidate) => moveWeight(candidate, settings) > 0), settings);
    }

    return move;
  });
}


function nextPadworkFragment(combo, settings, spaceLeft) {
  const last = combo[combo.length - 1];
  const offenseAllowed = settings.offenseMode !== false;
  const defenseAllowed = settings.defenseMode !== false && settings.defensiveFrequency > 0 && settings.trainingFocus !== "jabCross";
  const shouldDefend = defenseAllowed && spaceLeft >= 2 && Math.random() * 100 < settings.defensiveFrequency;
  const shouldBody = settings.bodyShotFrequency > 0 && (Math.random() * 100 < settings.bodyShotFrequency || settings.trainingFocus === "body");

  if (!offenseAllowed) {
    return [pickWeighted(comboDefenseMoves, settings)];
  }

  if (shouldDefend) {
    const defense = settings.trainingFocus === "headMovement" ? pickWeighted(headMovementMoves, settings) : pickWeighted(comboDefenseMoves, settings);
    return [defense, counterAfterDefense(defense)];
  }

  if (settings.trainingFocus === "jabCross") {
    return last === "jab" ? ["cross"] : ["jab", "cross"].slice(0, spaceLeft);
  }

  if (settings.trainingFocus === "hooks") {
    return last === "leadHook" ? ["rearHook"] : ["jab", pickWeighted(["leadHook", "rearHook", "leadUppercut", "rearUppercut"], settings)].slice(0, spaceLeft);
  }

  if (shouldBody && last !== "bodyShot" && last !== "rearBodyShot") {
    return [pickWeighted(["bodyShot", "rearBodyShot"], settings), pickWeighted(["cross", "leadHook", "rearHook", "leadUppercut", "rearUppercut"], settings)].slice(0, spaceLeft);
  }

  const fragments = [
    ["jab", "cross"],
    ["jab", "cross", "leadHook"],
    ["cross", "leadHook"],
    ["jab", "bodyShot", "cross"],
    ["cross", "rearBodyShot", "leadHook"],
    ["jab", "leadUppercut", "cross"],
    ["leadHook", "rearHook"]
  ];

  return pick(fragments).map((move) => weightedVariant(move, settings)).slice(0, spaceLeft);
}

function fallbackMove(settings) {
  if (settings.offenseMode === false && settings.defenseMode !== false) {
    return pickWeighted(comboDefenseMoves, settings);
  }
  return pickWeighted(offenseOnly, settings);
}

function smoothCombo(combo) {
  return combo.map((move, index) => {
    const previous = combo[index - 1];
    if (move === previous && move !== "jab" && move !== "bodyShot" && move !== "rearBodyShot") {
      return defenseMoves.includes(move) ? counterAfterDefense(move) : move === "leadHook" ? "cross" : "jab";
    }
    return move;
  }).filter((move) => offenseOnly.includes(move) || defenseMoves.includes(move));
}

function spacingFor(move, nextMove, settings) {
  const definition = MOVES[move];
  const nextDefinition = nextMove ? MOVES[nextMove] : null;
  let spacing = settings.rhythm * (definition.rhythm ?? 1);

  if (move === "jab" && nextMove === "cross") {
    spacing *= 0.78;
  }
  if (definition.type === "defense" && nextDefinition?.type === "offense") {
    spacing *= 0.74;
  }
  if (move === "bodyShot" || move === "rearBodyShot" || nextMove === "bodyShot" || nextMove === "rearBodyShot") {
    spacing *= 1.05;
  }
  if (move === "pivotLeft" || move === "pivotRight") {
    spacing *= 1.16;
  }

  return clamp(spacing, 0.28, 1.28);
}

function sideAwareLane(cue, arrival) {
  if (cue.definition.defenseKind === "rollBar") {
    const sideHold = Math.pow(arrival, 1.8);
    return THREE.MathUtils.lerp(cue.entryLane, cue.definition.lane, sideHold);
  }

  if (cue.definition.defenseKind === "sidePunch") {
    const sideHold = Math.pow(arrival, 1.8);
    return THREE.MathUtils.lerp(cue.entryLane, cue.definition.lane, sideHold);
  }

  return THREE.MathUtils.lerp(cue.entryLane, cue.definition.lane, arrival);
}

function counterAfterDefense(move) {
  if (move === "block") {
    return "cross";
  }
  if (move === "duck") {
    return Math.random() < 0.55 ? "bodyShot" : "leadHook";
  }
  return Math.random() < 0.55 ? "cross" : "leadHook";
}

function weightedVariant(move, settings) {
  if (move === "bodyShot") {
    return pickWeighted(["bodyShot", "rearBodyShot"], settings);
  }
  if (move === "leadHook") {
    return pickWeighted(["leadHook", "rearHook", "leadUppercut", "rearUppercut"], settings);
  }
  return move;
}

function pickWeighted(items, settings) {
  if (!items.length) {
    return fallbackMove(settings);
  }
  const weighted = items.map((move) => ({ move, weight: moveWeight(move, settings) }));
  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  if (total <= 0) {
    return pick(items);
  }

  let needle = Math.random() * total;
  for (const item of weighted) {
    needle -= item.weight;
    if (needle <= 0) {
      return item.move;
    }
  }
  return weighted[weighted.length - 1].move;
}

function moveWeight(move, settings) {
  const frequencies = settings.moveFrequencies ?? {};
  if (move === "blockLeftHead" || move === "blockRightHead" || move === "blockLeftBody" || move === "blockRightBody") {
    return frequencies.sideBlock ?? 50;
  }
  if (move === "slipLeft" || move === "slipRight") {
    return frequencies.slips ?? 50;
  }
  if (move === "rollLeft" || move === "rollRight") {
    return frequencies.rolls ?? 50;
  }
  if (move === "pivotLeft" || move === "pivotRight") {
    return frequencies.pivots ?? 0;
  }
  return frequencies[move] ?? 50;
}

function createPad(definition, realistic = false) {
  if (realistic) {
    return createFocusMitt(definition);
  }

  const group = new THREE.Group();
  const padMaterial = new THREE.MeshStandardMaterial({
    color: definition.color,
    roughness: 0.48,
    metalness: 0.05,
    emissive: 0x080808
  });
  const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x171a1d, roughness: 0.82 });
  const trimMaterial = new THREE.MeshStandardMaterial({ color: 0xf6d680, roughness: 0.52, metalness: 0.08 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.4, 0.15), padMaterial);
  const face = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.035, 28), trimMaterial);
  face.scale.set(1.18, 0.82, 1);
  face.rotation.x = Math.PI / 2;
  face.position.z = 0.09;

  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(0.48, 0.2),
    new THREE.MeshBasicMaterial({ map: makeLabelTexture(definition.label), transparent: true })
  );
  label.position.z = 0.115;

  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.52, 16), darkMaterial);
  handle.rotation.x = Math.PI / 2;
  handle.position.z = -0.24;

  const wrist = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.065, 0.62, 16), darkMaterial);
  wrist.rotation.z = definition.hand === "left" ? -0.65 : 0.65;
  wrist.position.set(definition.hand === "left" ? -0.36 : 0.36, -0.1, -0.34);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.42, 0.011, 8, 56),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.18 })
  );
  ring.position.z = 0.13;

  group.add(body, face, label, handle, wrist, ring);
  group.userData.warningRing = ring;
  return group;
}

function createDefenseCue(definition, realistic = false) {
  if (realistic) {
    return createRealisticDefenseCue(definition);
  }

  const group = new THREE.Group();
  const red = new THREE.MeshStandardMaterial({ color: definition.color ?? 0xd84242, roughness: 0.56, metalness: 0.04 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x202326, roughness: 0.8 });

  if (definition.defenseKind === "punch") {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.105, 1.22, 18), dark);
    arm.rotation.x = Math.PI / 2;
    arm.position.z = -0.44;
    const glove = createOpponentGlove(red);
    glove.position.z = 0.06;
    group.add(arm, glove);
  } else if (definition.defenseKind === "sidePunch") {
    const sideSign = definition.side === "left" ? -1 : 1;
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.105, 1.55, 18), dark);
    arm.rotation.z = Math.PI / 2;
    arm.rotation.y = sideSign * 0.5;
    arm.position.set(sideSign * 0.62, definition.level === "body" ? -0.04 : 0, -0.06);
    const glove = createOpponentGlove(red);
    glove.position.set(sideSign * -0.22, 0, 0.03);
    glove.rotation.set(0, sideSign * 0.8, sideSign * -0.22);
    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), dark);
    shoulder.position.set(sideSign * 1.35, 0, -0.14);
    group.add(arm, glove, shoulder);
  } else if (definition.defenseKind === "rollBar") {
    const sideSign = definition.side === "left" ? -1 : 1;
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(2.65, 0.15, 0.16),
      new THREE.MeshStandardMaterial({
        color: definition.color,
        roughness: 0.43,
        emissive: 0x2a2200
      })
    );
    bar.rotation.z = sideSign * 0.5;
    bar.rotation.y = sideSign * 0.14;
    bar.position.set(sideSign * 0.2, 0.02, 0);
    const endCapA = new THREE.Mesh(new THREE.SphereGeometry(0.105, 16, 12), bar.material);
    const endCapB = new THREE.Mesh(new THREE.SphereGeometry(0.105, 16, 12), bar.material);
    endCapA.position.x = -1.32;
    endCapB.position.x = 1.32;
    endCapA.rotation.copy(bar.rotation);
    endCapB.rotation.copy(bar.rotation);
    group.add(bar, endCapA, endCapB);
  } else if (definition.defenseKind === "pivot") {
    const sideSign = definition.side === "left" ? -1 : 1;
    const pivotMaterial = new THREE.MeshStandardMaterial({
      color: definition.color,
      roughness: 0.4,
      emissive: 0x09201c
    });
    const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.46, 3), pivotMaterial);
    arrow.rotation.z = sideSign > 0 ? -Math.PI / 2 : Math.PI / 2;
    arrow.position.x = sideSign * 0.54;
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.1, 0.1), pivotMaterial);
    line.position.x = sideSign * 0.1;
    const platform = new THREE.Mesh(
      new THREE.TorusGeometry(0.46, 0.018, 10, 56, Math.PI * 1.35),
      pivotMaterial
    );
    platform.rotation.z = sideSign > 0 ? -0.7 : 2.44;
    platform.position.y = -0.2;
    group.add(arrow, line, platform);
  } else {
    const isDuck = definition.label === "Duck";
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(isDuck ? 2.3 : 0.16, isDuck ? 0.15 : 1.5, 0.14),
      new THREE.MeshStandardMaterial({
        color: definition.color,
        roughness: 0.43,
        emissive: isDuck ? 0x2a2200 : 0x270707
      })
    );
    bar.rotation.z = definition.label === "Slip Left" ? -0.18 : definition.label === "Slip Right" ? 0.18 : 0;
    group.add(bar);
  }

  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(0.72, 0.24),
    new THREE.MeshBasicMaterial({ map: makeLabelTexture(definition.label), transparent: true })
  );
  label.position.set(0, definition.defenseKind === "pivot" ? 0.44 : definition.label === "Duck" || definition.defenseKind === "rollBar" ? 0.33 : -0.34, 0.16);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.56, 0.011, 8, 56),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.18 })
  );
  ring.position.z = 0.16;
  group.add(label, ring);
  group.userData.warningRing = ring;
  return group;
}

function createFocusMitt(definition) {
  const group = new THREE.Group();
  const mittMaterial = new THREE.MeshStandardMaterial({
    color: 0x20252b,
    roughness: 0.62,
    metalness: 0.04
  });
  const faceMaterial = new THREE.MeshStandardMaterial({
    color: definition.color,
    roughness: 0.46,
    metalness: 0.05,
    emissive: 0x050505
  });
  const leatherTrim = new THREE.MeshStandardMaterial({ color: 0xf1d28a, roughness: 0.54, metalness: 0.05 });
  const strapMaterial = new THREE.MeshStandardMaterial({ color: 0x090a0c, roughness: 0.88 });

  const back = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.43, 0.12), mittMaterial);
  back.position.z = -0.03;

  const face = new THREE.Mesh(new THREE.SphereGeometry(0.27, 36, 20), faceMaterial);
  face.scale.set(1.03, 0.76, 0.26);
  face.position.z = 0.08;

  const target = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.012, 10, 48), leatherTrim);
  target.scale.y = 0.78;
  target.position.z = 0.16;

  const palmCup = new THREE.Mesh(new THREE.SphereGeometry(0.2, 28, 16), mittMaterial);
  palmCup.scale.set(1, 0.72, 0.22);
  palmCup.position.z = -0.13;

  const strap = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.055, 0.035), strapMaterial);
  strap.position.set(0, -0.17, -0.19);

  const wrist = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.064, 0.58, 18), strapMaterial);
  wrist.rotation.z = definition.hand === "left" ? -0.68 : 0.68;
  wrist.position.set(definition.hand === "left" ? -0.35 : 0.35, -0.12, -0.33);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.44, 0.01, 8, 56),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.14 })
  );
  ring.position.z = 0.16;

  group.add(back, face, target, palmCup, strap, wrist, ring);
  group.userData.warningRing = ring;
  return group;
}

function createRealisticDefenseCue(definition) {
  const group = new THREE.Group();
  const gloveMaterial = new THREE.MeshStandardMaterial({
    color: definition.color ?? 0xc93232,
    roughness: 0.48,
    metalness: 0.05,
    emissive: 0x080202
  });
  const sleeveMaterial = new THREE.MeshStandardMaterial({ color: 0x15171a, roughness: 0.82 });
  const sideSign = definition.side === "left" ? -1 : definition.side === "right" ? 1 : definition.lane < 0 ? -1 : 1;

  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.105, 1.26, 20), sleeveMaterial);
  const glove = createOpponentGlove(gloveMaterial);
  const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.115, 18, 12), sleeveMaterial);

  if (definition.defenseKind === "sidePunch") {
    arm.rotation.z = Math.PI / 2;
    arm.rotation.y = sideSign * 0.56;
    arm.position.set(sideSign * 0.62, definition.level === "body" ? -0.05 : 0.02, -0.08);
    glove.position.set(sideSign * -0.22, 0, 0.04);
    glove.rotation.set(0, sideSign * 0.82, sideSign * -0.24);
    shoulder.position.set(sideSign * 1.34, 0, -0.15);
  } else if (definition.defenseKind === "rollBar") {
    arm.rotation.z = sideSign * 1.16;
    arm.rotation.y = sideSign * 0.22;
    arm.position.set(sideSign * 0.35, 0.04, -0.15);
    glove.position.set(sideSign * -0.32, -0.06, 0.04);
    glove.rotation.set(0.08, sideSign * 0.8, sideSign * -0.6);
    shoulder.position.set(sideSign * 0.92, 0.28, -0.22);
  } else if (definition.defenseKind === "bar") {
    const isDuck = definition.label === "Duck";
    arm.rotation.z = isDuck ? Math.PI / 2 : sideSign * 0.22;
    arm.rotation.x = Math.PI / 2;
    arm.position.set(isDuck ? 0 : sideSign * 0.16, isDuck ? 0.02 : 0, -0.34);
    glove.position.set(isDuck ? sideSign * 0.64 : 0, isDuck ? 0 : 0.05, 0.08);
    glove.rotation.set(0.04, sideSign * 0.35, isDuck ? sideSign * 0.14 : sideSign * 0.28);
    shoulder.position.set(isDuck ? sideSign * 1.18 : sideSign * 0.42, isDuck ? 0.02 : 0, -0.84);
  } else {
    arm.rotation.x = Math.PI / 2;
    arm.position.z = -0.46;
    glove.position.z = 0.06;
    shoulder.position.z = -1.04;
  }

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.52, 0.01, 8, 56),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.14 })
  );
  ring.position.z = 0.18;

  group.add(arm, glove, shoulder, ring);
  group.userData.warningRing = ring;
  return group;
}

function createOpponentGlove(material) {
  const group = new THREE.Group();
  const knuckle = new THREE.Mesh(new THREE.SphereGeometry(0.2, 28, 18), material);
  knuckle.scale.set(1.18, 0.9, 1.24);
  const thumb = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), material);
  thumb.position.set(0.14, -0.04, 0.03);
  thumb.scale.set(0.9, 0.75, 1.15);
  const cuff = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.13, 0.18, 18),
    new THREE.MeshStandardMaterial({ color: 0x161616, roughness: 0.8 })
  );
  cuff.rotation.x = Math.PI / 2;
  cuff.position.z = -0.16;
  group.add(knuckle, thumb, cuff);
  return group;
}

function addHitBurst(group) {
  group.scale.setScalar(1.16);
  group.traverse((child) => {
    if (child.material?.emissive) {
      child.material.emissive.setHex(0x2c2200);
    }
  });
}

function makeLabelTexture(text) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 180;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "rgba(8, 10, 12, 0.72)";
  context.roundRect(28, 36, 456, 108, 22);
  context.fill();
  context.strokeStyle = "rgba(255, 255, 255, 0.52)";
  context.lineWidth = 5;
  context.stroke();
  context.fillStyle = "#f7f4ea";
  context.font = text.length > 8 ? "900 42px Arial" : "900 56px Arial";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text.toUpperCase(), 256, 92);
  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}
