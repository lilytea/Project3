import * as THREE from "./build/three.module.js";
import { PointerLockControls } from "./src/PointerLockControls.js";
import { GLTFLoader } from "./src/GLTFLoader.js";

let camera, scene, renderer, controls;
let raycaster;
const clickableObjects = [];

let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false, canJump = false;
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
let prevTime = performance.now();

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 10, 100);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);
  scene.fog = new THREE.Fog(0xf0f0f0, 0, 750);

  const light = new THREE.HemisphereLight(0xffffff, 0x444444);
  light.position.set(0, 200, 0);
  scene.add(light);

  // Floor (non-clickable)
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000),
    new THREE.MeshStandardMaterial({ color: 0xdddddd })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // Controls
  controls = new PointerLockControls(camera, document.body);
  scene.add(controls.getObject());

  const blocker = document.getElementById("blocker");
  const instructions = document.getElementById("instructions");

  instructions.addEventListener("click", () => controls.lock());
  controls.addEventListener("lock", () => {
    instructions.style.display = "none";
    blocker.style.display = "none";
  });
  controls.addEventListener("unlock", () => {
    blocker.style.display = "block";
    instructions.style.display = "";
  });

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  raycaster = new THREE.Raycaster();

  // --- Product 1: GLTF model ---
  const loader = new GLTFLoader();
  loader.load(
    "https://cdn.glitch.me/62a23053-ce70-4d1c-b386-dbfe331a4076%2Fshoe_with_human.glb?v=1636907298860",
    gltf => {
      const model = gltf.scene;
      model.position.set(-50, 0, -100);
      model.scale.set(50, 50, 50);
      model.userData.name = "3D Shoe Product"; // ✅ add to top-level
      clickableObjects.push(model);
      scene.add(model);
    }
  );

  // --- Product 2: Image panel ---
  const texture = new THREE.TextureLoader().load(
    "https://cdn.glitch.global/62a23053-ce70-4d1c-b386-dbfe331a4076/sample-image.png"
  );
  const imagePlane = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
  );
  imagePlane.position.set(0, 20, -150);
  imagePlane.userData.name = "Poster Display";
  clickableObjects.push(imagePlane);
  scene.add(imagePlane);

  // --- Product 3: Cube ---
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(20, 20, 20),
    new THREE.MeshStandardMaterial({ color: 0x44aa88 })
  );
  cube.position.set(60, 10, -100);
  cube.userData.name = "Product Cube";
  clickableObjects.push(cube);
  scene.add(cube);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize);
  window.addEventListener("click", onClick);
}

function onClick(event) {
  raycaster.setFromCamera({ x: 0, y: 0 }, camera);
  const intersects = raycaster.intersectObjects(clickableObjects, true);

  if (intersects.length > 0) {
    let clicked = intersects[0].object;

    // 🔁 Traverse up until we find a parent with userData.name
    while (clicked && !clicked.userData.name && clicked.parent) {
      clicked = clicked.parent;
    }

    if (clicked && clicked.userData.name) {
      alert("You clicked on: " + clicked.userData.name);
    }
  }
}

function onKeyDown(event) {
  switch (event.code) {
    case "KeyW": moveForward = true; break;
    case "KeyS": moveBackward = true; break;
    case "KeyA": moveLeft = true; break;
    case "KeyD": moveRight = true; break;
    case "Space":
      if (canJump) velocity.y += 350;
      canJump = false;
      break;
  }
}

function onKeyUp(event) {
  switch (event.code) {
    case "KeyW": moveForward = false; break;
    case "KeyS": moveBackward = false; break;
    case "KeyA": moveLeft = false; break;
    case "KeyD": moveRight = false; break;
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  const time = performance.now();

  if (controls.isLocked) {
    const delta = (time - prevTime) / 1000;
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    velocity.y -= 9.8 * 100.0 * delta;

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();

    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);
    controls.getObject().position.y += velocity.y * delta;

    if (controls.getObject().position.y < 10) {
      velocity.y = 0;
      controls.getObject().position.y = 10;
      canJump = true;
    }
  }

  prevTime = time;
  renderer.render(scene, camera);
}
