import * as THREE from "three";

const gloveMaterials = {
  leather: new THREE.MeshStandardMaterial({ color: 0xb9252e, roughness: 0.5, metalness: 0.06 }),
  shadow: new THREE.MeshStandardMaterial({ color: 0x111214, roughness: 0.78 }),
  trim: new THREE.MeshStandardMaterial({ color: 0xf1d79a, roughness: 0.56, metalness: 0.04 }),
  stitch: new THREE.MeshStandardMaterial({ color: 0x2a0d0f, roughness: 0.72 })
};

const guard = {
  left: {
    position: new THREE.Vector3(-0.44, -0.48, -0.98),
    rotation: new THREE.Euler(-0.1, -0.18, -0.12)
  },
  right: {
    position: new THREE.Vector3(0.44, -0.48, -0.98),
    rotation: new THREE.Euler(-0.1, 0.18, 0.12)
  }
};

const realisticGuard = {
  left: {
    position: new THREE.Vector3(-0.4, -0.44, -0.96),
    rotation: new THREE.Euler(-0.08, -0.1, -0.08)
  },
  right: {
    position: new THREE.Vector3(0.4, -0.44, -0.96),
    rotation: new THREE.Euler(-0.08, 0.1, 0.08)
  }
};

const moveDurations = {
  jab: 0.34,
  cross: 0.38,
  leadHook: 0.44,
  rearHook: 0.46,
  bodyShot: 0.42,
  rearBodyShot: 0.42,
  leadUppercut: 0.46,
  rearUppercut: 0.48,
  block: 0.44,
  blockLeftHead: 0.44,
  blockRightHead: 0.44,
  blockLeftBody: 0.48,
  blockRightBody: 0.48,
  slipLeft: 0.42,
  slipRight: 0.42,
  duck: 0.48,
  rollLeft: 0.58,
  rollRight: 0.58,
  rollBack: 0.6,
  pivotLeft: 0.62,
  pivotRight: 0.62
};

export class PlayerGloves {
  constructor(camera) {
    this.group = new THREE.Group();
    this.realisticMode = false;
    this.left = this.createGlove("left");
    this.right = this.createGlove("right");
    this.group.add(this.left.group, this.right.group);
    camera.add(this.group);
    this.activeAction = null;
    this.cameraOffset = new THREE.Vector3();
    this.baseCameraOffset = new THREE.Vector3();
    this.setGuard();
  }

  createGlove(side) {
    const group = new THREE.Group();
    const knuckle = new THREE.Mesh(new THREE.SphereGeometry(0.19, 32, 20), gloveMaterials.leather);
    knuckle.scale.set(1.18, 0.86, 1.25);
    knuckle.position.z = -0.03;

    const palm = new THREE.Mesh(new THREE.SphereGeometry(0.15, 28, 18), gloveMaterials.leather);
    palm.scale.set(0.98, 0.84, 0.95);
    palm.position.set(0, -0.07, 0.12);

    const thumb = new THREE.Mesh(new THREE.SphereGeometry(0.072, 18, 14), gloveMaterials.leather);
    thumb.scale.set(0.9, 0.72, 1.08);
    thumb.position.set(side === "left" ? 0.15 : -0.15, -0.06, 0.03);
    thumb.rotation.z = side === "left" ? -0.52 : 0.52;

    const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.16, 0.22, 24), gloveMaterials.shadow);
    cuff.rotation.x = Math.PI / 2;
    cuff.position.set(0, -0.1, 0.24);

    const wristWrap = new THREE.Mesh(new THREE.TorusGeometry(0.135, 0.013, 8, 32), gloveMaterials.trim);
    wristWrap.rotation.x = Math.PI / 2;
    wristWrap.position.set(0, -0.1, 0.12);

    const seam = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.19, 0.012), gloveMaterials.stitch);
    seam.position.set(0, 0.02, -0.22);

    const lace = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.13, 0.016), gloveMaterials.trim);
    lace.position.set(side === "left" ? -0.045 : 0.045, 0.055, -0.235);
    lace.rotation.z = side === "left" ? -0.16 : 0.16;

    const fingerRidge = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.008, 8, 32, Math.PI), gloveMaterials.stitch);
    fingerRidge.position.set(0, 0.08, -0.12);
    fingerRidge.rotation.set(Math.PI / 2, 0, side === "left" ? -0.08 : 0.08);

    group.add(knuckle, palm, thumb, cuff, wristWrap, seam, lace, fingerRidge);
    return { group, side };
  }

  setRealisticMode(enabled) {
    this.realisticMode = enabled;
    const scale = enabled ? 1.06 : 1;
    this.left.group.scale.setScalar(scale);
    this.right.group.scale.setScalar(scale);
  }

  setGuard() {
    this.applyPose(this.left.group, guard.left);
    this.applyPose(this.right.group, guard.right);
  }

  animateMove(move) {
    this.activeAction = {
      move,
      time: 0,
      duration: moveDurations[move] ?? 0.38
    };
  }

  update(delta) {
    const pose = {
      left: clonePose(this.realisticMode ? realisticGuard.left : guard.left),
      right: clonePose(this.realisticMode ? realisticGuard.right : guard.right),
      camera: new THREE.Vector3()
    };

    if (this.activeAction) {
      this.activeAction.time += delta;
      const progress = Math.min(1, this.activeAction.time / this.activeAction.duration);
      this.applyMovePose(this.activeAction.move, progress, pose);

      if (progress >= 1) {
        this.activeAction = null;
      }
    }

    this.cameraOffset.lerp(pose.camera, 1 - Math.pow(0.0005, delta));
    this.lerpPose(this.left.group, pose.left, delta);
    this.lerpPose(this.right.group, pose.right, delta);
  }

  applyMovePose(move, progress, pose) {
    const out = punchOut(progress);
    const recoil = Math.sin(progress * Math.PI);
    const turn = easeInOut(progress);

    if (move === "jab") {
      pose.left.position.set(-0.17, -0.41, -1.72 - out * 0.16);
      pose.left.rotation.set(-0.18, -0.04, -0.03);
      pose.right.position.x += 0.05 * recoil;
      pose.camera.x = -0.018 * recoil;
    } else if (move === "cross") {
      pose.right.position.set(0.12, -0.39, -1.86 - out * 0.18);
      pose.right.rotation.set(-0.16, -0.05, -0.02);
      pose.left.position.x -= 0.04 * recoil;
      pose.camera.x = -0.035 * recoil;
      pose.camera.z = -0.012 * recoil;
    } else if (move === "leadHook") {
      pose.left.position.set(-0.06, -0.35, -1.48);
      pose.left.rotation.set(-0.08, -0.62 * recoil, -0.82 * recoil);
      pose.right.position.x += 0.06 * recoil;
      pose.camera.x = 0.025 * recoil;
    } else if (move === "rearHook") {
      pose.right.position.set(0.08, -0.35, -1.5);
      pose.right.rotation.set(-0.08, 0.64 * recoil, 0.82 * recoil);
      pose.left.position.x -= 0.06 * recoil;
      pose.camera.x = -0.025 * recoil;
    } else if (move === "bodyShot") {
      pose.left.position.set(-0.1, -0.78, -1.58);
      pose.left.rotation.set(0.14, -0.2, -0.38 * recoil);
      pose.right.position.set(0.32, -0.55, -1.04);
      pose.camera.y = -0.07 * recoil;
      pose.camera.x = 0.012 * recoil;
    } else if (move === "rearBodyShot") {
      pose.right.position.set(0.1, -0.78, -1.62);
      pose.right.rotation.set(0.14, 0.2, 0.38 * recoil);
      pose.left.position.set(-0.32, -0.55, -1.04);
      pose.camera.y = -0.07 * recoil;
      pose.camera.x = -0.012 * recoil;
    } else if (move === "leadUppercut") {
      pose.left.position.set(-0.08, -0.48 + 0.16 * recoil, -1.55);
      pose.left.rotation.set(-0.46 * recoil, -0.08, -0.24 * recoil);
      pose.right.position.x += 0.04 * recoil;
      pose.camera.y = 0.035 * recoil;
      pose.camera.x = 0.018 * recoil;
    } else if (move === "rearUppercut") {
      pose.right.position.set(0.08, -0.48 + 0.16 * recoil, -1.62);
      pose.right.rotation.set(-0.48 * recoil, 0.08, 0.24 * recoil);
      pose.left.position.x -= 0.04 * recoil;
      pose.camera.y = 0.035 * recoil;
      pose.camera.x = -0.018 * recoil;
    } else if (move === "block") {
      pose.left.position.set(-0.18, -0.24, -0.78);
      pose.right.position.set(0.18, -0.24, -0.78);
      pose.left.rotation.set(-0.08, 0.1, 0.18);
      pose.right.rotation.set(-0.08, -0.1, -0.18);
      pose.camera.z = -0.012 * recoil;
    } else if (move === "blockLeftHead") {
      pose.left.position.set(-0.52, -0.25, -0.78);
      pose.left.rotation.set(-0.04, 0.42, 0.72);
      pose.right.position.set(0.22, -0.38, -0.92);
      pose.camera.x = -0.055 * recoil;
      pose.camera.z = -0.012 * recoil;
    } else if (move === "blockRightHead") {
      pose.right.position.set(0.52, -0.25, -0.78);
      pose.right.rotation.set(-0.04, -0.42, -0.72);
      pose.left.position.set(-0.22, -0.38, -0.92);
      pose.camera.x = 0.055 * recoil;
      pose.camera.z = -0.012 * recoil;
    } else if (move === "blockLeftBody") {
      pose.left.position.set(-0.48, -0.72, -0.84);
      pose.left.rotation.set(0.28, 0.28, 0.56);
      pose.right.position.set(0.28, -0.36, -0.9);
      pose.camera.x = -0.045 * recoil;
      pose.camera.y = -0.05 * recoil;
    } else if (move === "blockRightBody") {
      pose.right.position.set(0.48, -0.72, -0.84);
      pose.right.rotation.set(0.28, -0.28, -0.56);
      pose.left.position.set(-0.28, -0.36, -0.9);
      pose.camera.x = 0.045 * recoil;
      pose.camera.y = -0.05 * recoil;
    } else if (move === "slipLeft") {
      pose.left.position.x -= 0.12 * recoil;
      pose.right.position.x -= 0.12 * recoil;
      pose.camera.x = -0.2 * Math.sin(turn * Math.PI);
      pose.camera.y = -0.015 * recoil;
    } else if (move === "slipRight") {
      pose.left.position.x += 0.12 * recoil;
      pose.right.position.x += 0.12 * recoil;
      pose.camera.x = 0.2 * Math.sin(turn * Math.PI);
      pose.camera.y = -0.015 * recoil;
    } else if (move === "duck") {
      pose.left.position.y -= 0.13 * recoil;
      pose.right.position.y -= 0.13 * recoil;
      pose.camera.y = -0.24 * Math.sin(turn * Math.PI);
      pose.camera.z = -0.02 * recoil;
    } else if (move === "rollLeft") {
      const arc = Math.sin(turn * Math.PI);
      pose.left.position.x -= 0.16 * arc;
      pose.right.position.x -= 0.16 * arc;
      pose.left.position.y -= 0.1 * arc;
      pose.right.position.y -= 0.1 * arc;
      pose.camera.x = -0.19 * arc;
      pose.camera.y = -0.18 * arc;
      pose.camera.z = -0.015 * arc;
    } else if (move === "rollRight") {
      const arc = Math.sin(turn * Math.PI);
      pose.left.position.x += 0.16 * arc;
      pose.right.position.x += 0.16 * arc;
      pose.left.position.y -= 0.1 * arc;
      pose.right.position.y -= 0.1 * arc;
      pose.camera.x = 0.19 * arc;
      pose.camera.y = -0.18 * arc;
      pose.camera.z = -0.015 * arc;
    } else if (move === "rollBack") {
      const arc = Math.sin(turn * Math.PI);
      pose.left.position.y -= 0.14 * arc;
      pose.right.position.y -= 0.14 * arc;
      pose.left.position.z += 0.08 * arc;
      pose.right.position.z += 0.08 * arc;
      pose.camera.y = -0.2 * arc;
      pose.camera.z = 0.12 * arc;
    } else if (move === "pivotLeft") {
      const arc = Math.sin(turn * Math.PI);
      pose.left.position.x -= 0.2 * arc;
      pose.right.position.x -= 0.14 * arc;
      pose.left.rotation.z -= 0.28 * arc;
      pose.right.rotation.z -= 0.2 * arc;
      pose.camera.x = -0.22 * arc;
      pose.camera.z = -0.04 * arc;
    } else if (move === "pivotRight") {
      const arc = Math.sin(turn * Math.PI);
      pose.left.position.x += 0.14 * arc;
      pose.right.position.x += 0.2 * arc;
      pose.left.rotation.z += 0.2 * arc;
      pose.right.rotation.z += 0.28 * arc;
      pose.camera.x = 0.22 * arc;
      pose.camera.z = -0.04 * arc;
    }
  }

  applyPose(group, pose) {
    group.position.copy(pose.position);
    group.rotation.copy(pose.rotation);
  }

  lerpPose(group, pose, delta) {
    const blend = 1 - Math.pow(0.0006, delta);
    group.position.lerp(pose.position, blend);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, pose.rotation.x, blend);
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, pose.rotation.y, blend);
    group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, pose.rotation.z, blend);
  }
}

function clonePose(pose) {
  return {
    position: pose.position.clone(),
    rotation: pose.rotation.clone()
  };
}

function punchOut(progress) {
  if (progress < 0.42) {
    return easeOut(progress / 0.42);
  }
  return 1 - easeIn((progress - 0.42) / 0.58);
}

function easeOut(value) {
  return 1 - Math.pow(1 - value, 3);
}

function easeIn(value) {
  return value * value * value;
}

function easeInOut(value) {
  return value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2;
}
