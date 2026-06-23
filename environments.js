import * as THREE from "three";

const mat = (color, options = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.75, ...options });

export function buildEnvironment(scene, name) {
  const root = new THREE.Group();
  root.name = `environment-${name}`;
  scene.add(root);

  const hemi = new THREE.HemisphereLight(0xbcdcff, 0x202015, 1.25);
  const key = new THREE.DirectionalLight(0xffffff, 1.8);
  key.position.set(-3.8, 6, 4.4);
  key.castShadow = true;
  root.add(hemi, key);

  if (name === "livingRoom") {
    livingRoom(root);
  } else if (name === "backyard") {
    backyard(root);
  } else if (name === "garage") {
    garage(root);
  } else {
    gym(root);
  }

  return root;
}

function box(root, size, position, material, rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  root.add(mesh);
  return mesh;
}

function cylinder(root, radiusTop, radiusBottom, height, position, material, radial = 24, rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radial), material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  root.add(mesh);
  return mesh;
}

function sphere(root, radius, position, material, scale = [1, 1, 1]) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 16), material);
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  root.add(mesh);
  return mesh;
}

function floorAndBack(root, floorColor, wallColor) {
  box(root, [18, 0.08, 18], [0, -1.22, -5], mat(floorColor));
  box(root, [18, 6, 0.12], [0, 1.7, -12.8], mat(wallColor));
  box(root, [0.12, 6, 18], [-9, 1.7, -5], mat(wallColor));
  box(root, [0.12, 6, 18], [9, 1.7, -5], mat(wallColor));
}

function gym(root) {
  floorAndBack(root, 0x33404a, 0x1d262c);
  box(root, [7.8, 0.12, 7.8], [0, -1.11, -5.8], mat(0xd8d3c1));
  box(root, [1.2, 0.012, 7.4], [0, -1.035, -5.8], mat(0xb92832, { roughness: 0.68 }));
  box(root, [7.4, 0.013, 1.2], [0, -1.025, -5.8], mat(0x2f5e84, { roughness: 0.68 }));
  const ropeMat = mat(0xd83b37);
  [-0.5, 0.05, 0.6].forEach((height) => {
    box(root, [8.6, 0.05, 0.05], [0, height, -1.8], ropeMat);
    box(root, [8.6, 0.05, 0.05], [0, height, -9.8], ropeMat);
    box(root, [0.05, 0.05, 8], [-4.3, height, -5.8], ropeMat);
    box(root, [0.05, 0.05, 8], [4.3, height, -5.8], ropeMat);
  });
  [-4.3, 4.3].forEach((x) => [-1.8, -9.8].forEach((z) => cylinder(root, 0.08, 0.08, 1.9, [x, -0.25, z], mat(0xf2f2f2))));
  cylinder(root, 0.34, 0.38, 1.8, [-6.2, 0.1, -6.4], mat(0x1c1c1c), 28);
  box(root, [0.04, 0.85, 0.04], [-6.2, 1.42, -6.4], mat(0xd7d7d7));
  box(root, [2.4, 0.08, 0.9], [5.6, -0.55, -8.2], mat(0x151515));
  box(root, [2.2, 1.2, 0.08], [0, 1.65, -12.7], mat(0x40515c));
  box(root, [1.7, 0.72, 0.08], [-3.1, 1.45, -12.65], mat(0x7b2228));
  box(root, [1.7, 0.72, 0.08], [3.1, 1.45, -12.65], mat(0x1d4b70));
  cylinder(root, 0.18, 0.28, 0.5, [6.2, 0.05, -5.2], mat(0x9b2d2f), 24);
  box(root, [0.03, 0.5, 0.03], [6.2, 0.58, -5.2], mat(0xd7d7d7));
  const overhead = new THREE.PointLight(0xffffff, 1.1, 8);
  overhead.position.set(0, 3.6, -5.6);
  root.add(overhead);
}

function livingRoom(root) {
  floorAndBack(root, 0x5c4231, 0x6f8282);
  box(root, [3.2, 0.16, 2.1], [-2.4, -1.08, -5.6], mat(0x8f3042));
  box(root, [3.3, 0.72, 0.72], [-4.8, -0.82, -8.1], mat(0x214c57));
  box(root, [3.5, 0.36, 0.18], [-4.8, -0.36, -8.38], mat(0x214c57));
  box(root, [2.1, 1.1, 0.08], [4.4, 0.1, -11.8], mat(0x111111, { metalness: 0.3 }));
  box(root, [2.4, 0.12, 0.44], [4.4, -0.56, -11.55], mat(0x2f241d));
  box(root, [1.4, 0.12, 0.9], [0.7, -0.76, -6.4], mat(0x3a271f));
  cylinder(root, 0.06, 0.06, 0.45, [0.18, -1.0, -6.1], mat(0x231814), 12);
  cylinder(root, 0.06, 0.06, 0.45, [1.22, -1.0, -6.1], mat(0x231814), 12);
  cylinder(root, 0.06, 0.06, 0.45, [0.18, -1.0, -6.72], mat(0x231814), 12);
  cylinder(root, 0.06, 0.06, 0.45, [1.22, -1.0, -6.72], mat(0x231814), 12);
  cylinder(root, 0.22, 0.22, 0.08, [2.7, -0.2, -6.4], mat(0xeac46a), 32);
  cylinder(root, 0.04, 0.04, 1.5, [2.7, -0.55, -6.4], mat(0x2f241d), 16);
  cylinder(root, 0.38, 0.48, 0.5, [2.7, 0.42, -6.4], mat(0xf0dcb5), 28);
  box(root, [1.6, 1.1, 0.08], [-6.1, 0.65, -12.66], mat(0xbfd9e6, { emissive: 0x182833 }));
  cylinder(root, 0.22, 0.26, 0.32, [-6.8, -0.88, -6.1], mat(0x7a5540), 24);
  cylinder(root, 0.04, 0.06, 0.78, [-6.8, -0.4, -6.1], mat(0x2d492e), 12);
  sphere(root, 0.32, [-6.8, 0.06, -6.1], mat(0x3d7a43), [1.1, 0.75, 1.1]);
  const lamp = new THREE.PointLight(0xffcf8c, 1.2, 4.5);
  lamp.position.set(2.7, 0.75, -6.4);
  root.add(lamp);
}

function backyard(root) {
  root.children[0].intensity = 1.6;
  box(root, [22, 0.08, 22], [0, -1.22, -5], mat(0x315b34));
  box(root, [20, 3.5, 0.12], [0, 0.45, -13.4], mat(0x7a5537));
  [-7.8, -5.6, -3.4, -1.2, 1, 3.2, 5.4, 7.6].forEach((x) => box(root, [0.12, 2.3, 0.18], [x, -0.1, -13.25], mat(0x9a7048)));
  for (let i = 0; i < 7; i += 1) {
    const x = -7 + i * 2.4;
    cylinder(root, 0.06, 0.08, 1.5, [x, -0.46, -9.5 - (i % 2)], mat(0x5a3823), 14);
    const crown = new THREE.Mesh(new THREE.SphereGeometry(0.55, 18, 12), mat(i % 2 ? 0x4e8b55 : 0x2f773d));
    crown.position.set(x, 0.52, -9.5 - (i % 2));
    crown.castShadow = true;
    root.add(crown);
  }
  for (let i = 0; i < 7; i += 1) {
    box(root, [0.78, 0.035, 0.55], [-2.4 + i * 0.8, -1.16, -4.2 - i * 0.18], mat(0x7b7568), [0, 0.18, 0]);
  }
  box(root, [3.6, 0.08, 2.5], [5.2, -1.15, -5.4], mat(0x8a6a4b));
  box(root, [2.8, 0.1, 0.65], [5.1, -0.65, -8.6], mat(0x54402e));
  cylinder(root, 0.08, 0.08, 1.0, [4.0, -0.92, -8.6], mat(0x54402e), 12);
  cylinder(root, 0.08, 0.08, 1.0, [6.2, -0.92, -8.6], mat(0x54402e), 12);
  const wire = mat(0x1f1f1f);
  box(root, [12, 0.025, 0.025], [0, 1.9, -7.8], wire);
  for (let i = 0; i < 8; i += 1) {
    const bulb = new THREE.PointLight(0xffd187, 0.5, 3.2);
    bulb.position.set(-5.8 + i * 1.65, 1.86, -7.8);
    root.add(bulb);
    cylinder(root, 0.06, 0.06, 0.06, [bulb.position.x, bulb.position.y, bulb.position.z], mat(0xffd187), 16);
  }
}

function garage(root) {
  floorAndBack(root, 0x565b5d, 0x344047);
  box(root, [4, 0.16, 1.3], [4.8, -0.72, -9.6], mat(0x765137));
  box(root, [3.8, 0.08, 0.18], [4.8, -0.35, -9.1], mat(0x252525));
  box(root, [0.18, 0.08, 0.62], [3.3, -0.05, -9.1], mat(0x252525));
  box(root, [0.18, 0.08, 0.62], [5.0, -0.05, -9.1], mat(0x252525));
  box(root, [0.18, 0.08, 0.62], [6.4, -0.05, -9.1], mat(0x252525));
  box(root, [0.18, 2.4, 0.8], [-6.6, -0.2, -8.4], mat(0x273038));
  [-0.8, -0.15, 0.5].forEach((y) => box(root, [2.7, 0.1, 0.65], [-6.6, y, -8.4], mat(0x606b70)));
  box(root, [0.9, 0.7, 0.7], [-6.6, -0.55, -8.4], mat(0xb68b52));
  box(root, [0.7, 0.45, 0.5], [-5.75, 0.15, -8.4], mat(0x446b93));
  cylinder(root, 0.32, 0.36, 1.65, [0, -0.02, -8.7], mat(0x8d2028), 28);
  box(root, [0.04, 0.75, 0.04], [0, 1.32, -8.7], mat(0xd7d7d7));
  box(root, [5, 0.08, 2.5], [0, -1.08, -5.3], mat(0x2c3539));
  cylinder(root, 0.48, 0.48, 0.28, [-4.6, -0.94, -5.2], mat(0x151515), 32, [Math.PI / 2, 0, 0]);
  cylinder(root, 0.34, 0.34, 0.3, [-4.6, -0.94, -5.2], mat(0x565b5d), 32, [Math.PI / 2, 0, 0]);
  box(root, [0.06, 0.7, 0.06], [6.6, -0.5, -5.0], mat(0x222222), [0, 0, 0.7]);
  box(root, [0.06, 0.7, 0.06], [6.9, -0.5, -5.2], mat(0x222222), [0, 0, -0.7]);
  const shopLight = new THREE.PointLight(0xbfdcff, 1.0, 6);
  shopLight.position.set(0, 3.2, -6.2);
  root.add(shopLight);
}
