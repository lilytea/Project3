import * as THREE from "./build/three.module.js";
import { PointerLockControls } from "./src/PointerLockControls.js";
import { GLTFLoader } from "./src/GLTFLoader.js";

let camera, scene, renderer, controls;
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

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000),
    new THREE.MeshStandardMaterial({ color: 0xdddddd })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

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

  // Just load one product to test visuals
  const loader = new GLTFLoader();
  loader.load(
    "https://cdn.glitch.me/62a23053-ce70-4d1c-b386-dbfe331a4076%2Fshoe_with_human.glb?v=1636907298860",
    gltf => {
      const model = gltf.scene;
      model.position.set(0, 0, -100);
      model.scale.set(50, 50, 50);
      scene.add(model);
    }
  );

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize);
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
