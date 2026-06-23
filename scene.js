import * as THREE from "three";
import { buildEnvironment } from "./environments.js";
import { PlayerGloves } from "./playerGloves.js";

export class BoxingScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x080b0e);
    this.scene.fog = new THREE.Fog(0x090d10, 8, 28);
    this.camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.05, 80);
    this.camera.position.set(0, 0.12, 0);
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, preserveDrawingBuffer: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.scene.add(this.camera);
    this.gloves = new PlayerGloves(this.camera);
    this.environmentRoot = null;
    this.shake = 0;
    window.addEventListener("resize", () => this.resize());
  }

  loadEnvironment(name) {
    if (this.environmentRoot) {
      this.scene.remove(this.environmentRoot);
    }
    this.environmentRoot = buildEnvironment(this.scene, name);
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  addShake(amount = 0.025) {
    this.shake = Math.max(this.shake, amount);
  }

  update(delta, elapsed, isRunning) {
    this.gloves.update(delta);

    const bob = isRunning ? Math.sin(elapsed * 5.1) * 0.018 : Math.sin(elapsed * 1.4) * 0.008;
    const sway = isRunning ? Math.sin(elapsed * 2.2) * 0.018 : 0;
    const shakeX = (Math.random() - 0.5) * this.shake;
    const shakeY = (Math.random() - 0.5) * this.shake;
    this.shake *= Math.pow(0.02, delta);

    this.camera.position.set(
      this.gloves.cameraOffset.x + sway + shakeX,
      0.12 + this.gloves.cameraOffset.y + bob + shakeY,
      0
    );
    this.camera.rotation.set(
      this.gloves.cameraOffset.y * 0.18,
      this.gloves.cameraOffset.x * -0.32,
      this.gloves.cameraOffset.x * -0.08
    );
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
