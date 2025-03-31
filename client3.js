import * as THREE from "./libs/three.module.js";
import { PointerLockControls } from "./libs/PointerLockControls.js";
import { GLTFLoader } from "./libs/GLTFLoader.js";

let camera, scene, renderer, controls;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false, canJump = false;
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

init();
animate();

function init() {
  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 10, 100);

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  // Lighting
  const light = new THREE.HemisphereLight(0xffffff, 0x444444);
  light.position.set(0, 200, 0);
  scene.add(light);

  // Floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1000),
    new THREE.MeshStandardMaterial({ color: 0xdddddd })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // Pointer Lock Controls
  controls = new PointerLockControls(camera, document.body);
  scene.add(controls.getObject());

  const blocker = document.getElementById('blocker');
  const instructions = document.getElementById('instructions');

  instructions.addEventListener('click', () => {
    controls.lock();
  });

  controls.addEventListener('lock', () => {
    instructions.style.display = 'none';
    blocker.style.display = 'none';
  });

  controls.addEventListener('unlock', () => {
    blocker.style.display = 'block';
    instructions.style.display = '';
  });

  // Key listeners
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  // Product 1: Cube
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(30, 30, 30),
    new THREE.MeshStandardMaterial({ color: 0x44aa88 })
  );
  cube.position.set(50, 15, -100);
  scene.add(cube);

  // Product 2: GLTF Model
  const loader = new GLTFLoader();
  loader.load(
    "https://cdn.glitch.me/62a23053-ce70-4d1c-b386-dbfe331a4076%2Fshoe_with_human.glb?v=1636907298860",
    gltf => {
      const model = gltf.scene;
      model.scale.set(50, 50, 50);
      model.position.set(-100, 0, -150);
      scene.add(model);
    },
    undefined,
    error
