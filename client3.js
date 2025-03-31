// Art 109 Three.js Demo Site
// client3.js
// A three.js scene which uses basic shapes to generate a scene which can be traversed with basic WASD and mouse controls, this scene is full screen with an overlay.

// Import required source code
// Import three.js core
import * as THREE from "./build/three.module.js";
// Import pointer lock controls
import { PointerLockControls } from "./src/PointerLockControls.js";
import { GLTFLoader } from "./src/GLTFLoader.js";
// Establish variables
let camera, scene, renderer, controls;

const objects = [];
let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();

let num = 10;
let count1 = num;
let count2 = num;

let num1 = 30;
let move = 1;
let move1 = 1;

var mesh, mesh2, mesh3, mesh4, mesh5, mesh6, mesh7;
// Initialization and animation function calls
init();
animate();
//addGridHelper();
// Initialize the scene
function init() {
  // Establish the camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.y = 0;
  camera.position.z = 200;
  camera.position.x = 0;

  // Define basic scene parameters
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  scene.fog = new THREE.Fog(0xffffff, 0, 750);

  // Define scene lighting
  //const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
  const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
  light.position.set(0.5, 1, 0.75);
  scene.add(light);

  // Define controls
  controls = new PointerLockControls(camera, document.body);

  // Identify the html divs for the overlays
  const blocker = document.getElementById("blocker");
  const instructions = document.getElementById("instructions");

  // Listen for clicks and respond by removing overlays and starting mouse look controls
  // Listen
  instructions.addEventListener("click", function() {
    controls.lock();
  });
  // Remove overlays and begin controls on click
  controls.addEventListener("lock", function() {
    instructions.style.display = "none";
    blocker.style.display = "none";
  });
  // Restore overlays and stop controls on esc
  controls.addEventListener("unlock", function() {
    blocker.style.display = "block";
    instructions.style.display = "";
  });
  // Add controls to scene
  scene.add(controls.getObject());

  // Define key controls for WASD controls
  const onKeyDown = function(event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = true;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = true;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = true;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = true;
        break;

      case "Space":
        if (canJump === true) velocity.y += 350;
        canJump = false;
        break;
    }
  };

  const onKeyUp = function(event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = false;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = false;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = false;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = false;
        break;
    }
  };

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  // Add raycasting for mouse controls
  raycaster = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(0, -1, 0),
    0,
    10
  );

  // Generate the ground
  let floorGeometry = new THREE.PlaneGeometry(1000, 2000, 100, 100);
  floorGeometry.rotateX(-Math.PI / 2);

  //Vertex displacement pattern for ground
  let position = floorGeometry.attributes.position;
  /*
  for (let i = 0, l = position.count; i < l; i++) {
    vertex.fromBufferAttribute(position, i);

    vertex.x += Math.random() * 20 - 10;
    vertex.y += Math.random() * 2;
    vertex.z += Math.random() * 20 - 10;

    position.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }
*/

  /*******self floor
  //floorGeometry.material.color.setHex( 0xFFFFFF );
  position = floorGeometry.attributes.position;
  const texture_floor = new THREE.TextureLoader().load( 'https://cdn.glitch.me/62a23053-ce70-4d1c-b386-dbfe331a4076%2Fjake-nackos-C2PCa6DhlYE-unsplash.jpg?v=1636705017571' );
  // Immediately use the texture for material creation
  const floorMaterial = new THREE.MeshBasicMaterial( { map: texture_floor, side: THREE.DoubleSide } );
  // Create plane geometry
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    
  // Insert completed floor into the scene
  scene.add(floor);
***********/

  floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

  position = floorGeometry.attributes.position;
  const colorsFloor = [];

  for (let i = 0, l = position.count; i < l; i = i + 1) {
    if (i % 64 == 0) {
      color.setHSL(
        Math.random() * 0.3 + 0.5,
        0.75,
        Math.random() * 0.25 + 0.75
      );
      colorsFloor.push(color.r, color.g, color.b);
    } else {
      colorsFloor.push(color.r, color.g, color.b);
    }
  }

  floorGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colorsFloor, 3)
  );

  const floorMaterial = new THREE.MeshBasicMaterial({ vertexColors: true });
  //color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
  //const floorMaterial= new THREE.MeshBasicMaterial( {color: color, side: THREE.DoubleSide} );

  const floor = new THREE.Mesh(floorGeometry, floorMaterial);

  // Insert completed floor into the scene
  scene.add(floor);

  //***************************

  let wallGeometry_back = new THREE.PlaneGeometry(800, 1500);
  color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
  const wall_material_back = new THREE.MeshBasicMaterial({
    color: color,
    side: THREE.DoubleSide
  });
  const wall_plane_back = new THREE.Mesh(wallGeometry_back, wall_material_back);
  wall_plane_back.position.set(75, 35, -2000);

  scene.add(wall_plane_back);

  let wallGeometry_right = new THREE.PlaneGeometry(1600, 1500);
  color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
  const wall_material_right = new THREE.MeshBasicMaterial({
    color: color,
    side: THREE.DoubleSide
  });
  const wall_plane_right = new THREE.Mesh(
    wallGeometry_right,
    wall_material_right
  );
  wall_plane_right.position.set(1025, 35, -175);
  wall_plane_right.rotation.y = -90;
  scene.add(wall_plane_right);

  let wallGeometry_left = new THREE.PlaneGeometry(1600, 1500);
  color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
  const wall_material_left = new THREE.MeshBasicMaterial({
    color: color,
    side: THREE.DoubleSide
  });
  const wall_plane_left = new THREE.Mesh(wallGeometry_left, wall_material_left);
  wall_plane_left.position.set(-1075, 35, -175);
  wall_plane_left.rotation.y = -90;
  scene.add(wall_plane_left);

  let wallGeometry_top = new THREE.PlaneGeometry(1600, 1500);
  color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
  const wall_material_top = new THREE.MeshBasicMaterial({
    color: color,
    side: THREE.DoubleSide
  });
  const wall_plane_top = new THREE.Mesh(wallGeometry_top, wall_material_top);
  wall_plane_top.position.set(0, 1500, 0);
  wall_plane_top.rotation.x = -90;
  scene.add(wall_plane_top);

  // Generate objects (cubes)
  const boxGeometry = new THREE.BoxGeometry(20, 20, 20).toNonIndexed();

  position = boxGeometry.attributes.position;
  const colorsBox = [];

  for (let i = 0, l = position.count; i < l; i++) {
    color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
    colorsBox.push(color.r, color.g, color.b);
  }

  boxGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colorsBox, 3)
  );

  /*for (let i = 0; i < 500; i++) {
    const boxMaterial = new THREE.MeshPhongMaterial({
      specular: 0xffffff,
      flatShading: true,
      vertexColors: true
    });
    boxMaterial.color.setHSL(
      Math.random() * 0.2 + 0.5,
      0.75,
      Math.random() * 0.25 + 0.75
    );

    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.x = Math.floor(Math.random() * 20 - 10) * 20;
    box.position.y = Math.floor(Math.random() * 20) * 20 + 10;
    box.position.z = Math.floor(Math.random() * 20 - 10) * 20;
    */
  // Insert completed boxes into the scene

  const loader = new GLTFLoader().load(
    "https://cdn.glitch.me/62a23053-ce70-4d1c-b386-dbfe331a4076%2Fshoe_with_human.glb?v=1636907298860",
    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        //if (child.isMesh) {
        // child.material = newMaterial;
        //}
      });
      // set position and scale
      mesh = gltf.scene;
      mesh.position.x = 150;
      mesh.position.y = 100;
      mesh.position.z = -285;
      mesh.scale.set(80, 80, 80);
      mesh.rotation.y = -45;
      // Add model to scene
      scene.add(mesh);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );
  const loader2 = new GLTFLoader().load(
    "https://cdn.glitch.me/62a23053-ce70-4d1c-b386-dbfe331a4076%2Fclock_with_man.glb?v=1636908106496",
    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        //if (child.isMesh) {
        // child.material = newMaterial;
        //}
      });
      // set position and scale
      mesh2 = gltf.scene;
      mesh2.position.x = -350;
      mesh2.position.y = 210;
      mesh2.position.z = -440;
      mesh2.scale.set(100, 100, 100);
      mesh2.rotation.y = 250;
      // Add model to scene
      scene.add(mesh2);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );

  const loader3 = new GLTFLoader().load(
    "https://cdn.glitch.me/62a23053-ce70-4d1c-b386-dbfe331a4076%2Fbanana_with_man.glb?v=1636913402621",
    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        //if (child.isMesh) {
        // child.material = newMaterial;
        //}
      });
      // set position and scale
      mesh3 = gltf.scene;
      mesh3.position.x = 250;
      mesh3.position.y = 60;
      mesh3.position.z = -850;
      mesh3.scale.set(60, 60, 60);
      mesh3.rotation.y = 175;
      // Add model to scene
      scene.add(mesh3);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );

  const loader4 = new GLTFLoader().load(
    "https://cdn.glitch.me/62a23053-ce70-4d1c-b386-dbfe331a4076%2Frabbit.glb?v=1637037714646",
    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        //if (child.isMesh) {
        // child.material = newMaterial;
        //}
      });
      // set position and scale
      mesh4 = gltf.scene;
      // mesh4.position.x = 0;
      mesh4.position.x = -400;
      mesh4.position.y = 8;
      mesh4.position.z = -540;
      //mesh4.position.z = 100;
      mesh4.scale.set(8, 8, 8);
      mesh4.rotation.y = 45;
      // Add model to scene
      scene.add(mesh4);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );

  const loader5 = new GLTFLoader().load(
    "https://cdn.glitch.me/62a23053-ce70-4d1c-b386-dbfe331a4076%2Frabbit.glb?v=1637037714646",
    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        //if (child.isMesh) {
        // child.material = newMaterial;
        //}
      });
      // set position and scale
      mesh5 = gltf.scene;
      mesh5.position.x = -420;
      mesh5.position.y = 8;
      mesh5.position.z = -530;
      mesh5.scale.set(4, 4, 4);
      mesh5.rotation.y = 45;
      // Add model to scene
      scene.add(mesh5);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );

  const loader6 = new GLTFLoader().load(
    "https://cdn.glitch.me/62a23053-ce70-4d1c-b386-dbfe331a4076%2Frabbit.glb?v=1637037714646",
    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        //if (child.isMesh) {
        // child.material = newMaterial;
        //}
      });
      // set position and scale
      mesh6 = gltf.scene;
      mesh6.position.x = -440;
      mesh6.position.y = 8;
      mesh6.position.z = -520;
      mesh6.scale.set(4, 4, 4);
      mesh6.rotation.y = 45;
      // Add model to scene
      scene.add(mesh6);
    },
    undefined,
    function(error) {
      console.error(error);
    }
  );

  /*
  const loader7 = new GLTFLoader().load(
  "https://cdn.glitch.me/62a23053-ce70-4d1c-b386-dbfe331a4076%2Frabbit.glb?v=1637037714646",
  function(gltf) {
    // Scan loaded model for mesh and apply defined material if mesh is present
    gltf.scene.traverse(function(child) {
      //if (child.isMesh) {
       // child.material = newMaterial;
      //}
    });
    // set position and scale
    mesh7 = gltf.scene;
    mesh7.position.x = -400;
    mesh7.position.y = 0;
    mesh7.position.z = -540;
    mesh7.scale.set(4,4 ,4);
    mesh7.rotation.y=45;
    // Add model to scene
    scene.add(mesh7);
  },
  undefined,
  function(error) {
    console.error(error);
  }
  );
  */
  //mushroom
  /* 
   const loader3 = new GLTFLoader().load(
  "https://cdn.glitch.me/62a23053-ce70-4d1c-b386-dbfe331a4076%2Fman1.glb?v=1636820227200",
  function(gltf) {
    // Scan loaded model for mesh and apply defined material if mesh is present
    gltf.scene.traverse(function(child) {
      //if (child.isMesh) {
       // child.material = newMaterial;
      //}
    });
    // set position and scale
    mesh3 = gltf.scene;
    mesh3.position.x = 80;
    mesh3.position.y = 35;
    mesh3.position.z = 85;
    mesh3.scale.set(15, 15 ,15);
    mesh3.rotation.y=180;
    // Add model to scene
    scene.add(mesh3);
  },
  undefined,
  function(error) {
    console.error(error);
  }
  );
  */
  // }
  /*
  const texture = new THREE.TextureLoader().load( 'https://cdn.glitch.me/62a23053-ce70-4d1c-b386-dbfe331a4076%2Fe7ceSnFL.png?v=1636875398875' );
  // Immediately use the texture for material creation
  const material1 = new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide } );
  // Create plane geometry
  const geometry = new THREE.PlaneGeometry(400,40  );
  // Apply image texture to plane geometry
  const plane = new THREE.Mesh( geometry, material1);
  // Position plane geometry
  plane.position.set(0 , 15 , 200);
  plane.rotation.z=195;
//   plane.rotation.y=45;
   //Place plane geometry
  scene.add( plane );
  */
  /*
  // Second Image (Text with image and white background)
  // Load image as texture
  const texture2 = new THREE.TextureLoader().load( 'https://cdn.glitch.me/62a23053-ce70-4d1c-b386-dbfe331a4076%2Fmanoj-kumar-iUR6hQv_idE-unsplash.jpg?v=1636701846931' );
  // immediately use the texture for material creation
  const material2 = new THREE.MeshBasicMaterial( { map: texture2, side: THREE.DoubleSide } );
  // Create plane geometry
  const geometry2 = new THREE.PlaneGeometry( 160, 550 );
  // Apply image texture to plane geometry
  const plane2 = new THREE.Mesh( geometry2, material2 );
  // Position plane geometry
  plane2.position.set(-350 , 15 , 0);
  // Place plane geometry
    plane2.rotation.y=-90;
  scene.add( plane2 );
  
  
  const texture3 = new THREE.TextureLoader().load( 'https://cdn.glitch.me/62a23053-ce70-4d1c-b386-dbfe331a4076%2Fmanoj-kumar-iUR6hQv_idE-unsplash.jpg?v=1636701846931' );
  // immediately use the texture for material creation
  const material3 = new THREE.MeshBasicMaterial( { map: texture3, side: THREE.DoubleSide } );
  // Create plane geometry
  const geometry3 = new THREE.PlaneGeometry( 300, 550 );
  // Apply image texture to plane geometry
  const plane3 = new THREE.Mesh( geometry3, material3 );
  // Position plane geometry
  plane3.position.set(0 , 15 , -75);
  // Place plane geometry
  scene.add( plane3 );
  
  const texture4 = new THREE.TextureLoader().load( 'https://cdn.glitch.me/62a23053-ce70-4d1c-b386-dbfe331a4076%2Fmanoj-kumar-iUR6hQv_idE-unsplash.jpg?v=1636701846931' );
  // immediately use the texture for material creation
  const material4 = new THREE.MeshBasicMaterial( { map: texture4, side: THREE.DoubleSide } );
  // Create plane geometry
  const geometry4 = new THREE.PlaneGeometry( 100, 350 );
  // Apply image texture to plane geometry
  const plane4 = new THREE.Mesh( geometry4, material4);
  // Position plane geometry
  plane4.position.set(-150 , 15 , 75);
  // Place plane geometry
//  scene.add( plane4);
  /*
  const texture5 = new THREE.TextureLoader().load( 'https://cdn.glitch.me/62a23053-ce70-4d1c-b386-dbfe331a4076%2Fmanoj-kumar-iUR6hQv_idE-unsplash.jpg?v=1636701846931' );
  // immediately use the texture for material creation
  const material5 = new THREE.MeshBasicMaterial( { map: texture5, side: THREE.DoubleSide } );
  // Create plane geometry
  const geometry5 = new THREE.PlaneGeometry( 100, 150 );
  // Apply image texture to plane geometry
  const plane5 = new THREE.Mesh( geometry5, material5);
  // Position plane geometry
  plane5.position.set(110 , 15 , 75);
  // Place plane geometry
  scene.add( plane5);
  */

  // Define Rendered and html document placement
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.toneMapping = THREE.reinhardToneMapping;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Listen for window resizing
  window.addEventListener("resize", onWindowResize);
}

// Window resizing function
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation function

function animate() {
  requestAnimationFrame(animate);

  const time = performance.now();

  // Check for controls being activated (locked) and animate scene according to controls
  if (controls.isLocked === true) {
    raycaster.ray.origin.copy(controls.getObject().position);
    raycaster.ray.origin.y -= 10;

    const intersections = raycaster.intersectObjects(objects, false);

    const onObject = intersections.length > 0;

    const delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveForward || moveBackward) velocity.z -= direction.z * 1600.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 1600.0 * delta;

    if (onObject === true) {
      velocity.y = Math.max(0, velocity.y);
      canJump = true;
    }

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);

    controls.getObject().position.y += velocity.y * delta; // new behavior

    if (controls.getObject().position.y < 10) {
      velocity.y = 0;

      controls.getObject().position.y = 10;

      canJump = true;
    }
  }
  // rabbit 1/*

  if (camera.position.z <= -200) {
    if (count1 >= 0) {
      count1--;
      mesh4.position.set(mesh4.position.x, 8, mesh4.position.z);
      if (count1 == 0) {
        count2 = num;
      }
    } else if (count2 >= 0) {
      count2--;
      mesh4.position.set(mesh4.position.x, 13, mesh4.position.z);
      if (count2 == 0) {
        count1 = num;
      }
    }

    if (mesh4.position.x < 950 && mesh4.position.z > -950) {
      mesh4.position.set(
        mesh4.position.x + 0.5,
        mesh4.position.y,
        mesh4.position.z
      );
      mesh4.position.set(
        mesh4.position.x,
        mesh4.position.y,
        mesh4.position.z - 0.5
      );
    } else {
      mesh4.position.set(500, 10, -950);
    }
    /*
  if ( mesh4.position.z > 0.0 ) {
          mesh4.position.set(0.0, mesh4.position.y, mesh4.position.z-0.5);
        
        
      }
  if ( mesh4.position.x >-550 && mesh4.position.z >-120 ) {
          mesh4.position.set(mesh4.position.x-0.5, mesh4.position.y , mesh4.position.z);
          mesh4.position.set(mesh4.position.x, mesh4.position.y, mesh4.position.z-0.5);
      }
  else if (mesh4.position.x <50 && mesh4.position.z >-300){
         // mesh4.position.set(mesh4.position.x+0.5, 30 , mesh4.position.z);
          mesh4.position.set(mesh4.position.x, mesh4.position.y, mesh4.position.z-0.5);
     
      }  
   else if (mesh4.position.x <250 && mesh4.position.z >-1200){
          mesh4.position.set(mesh4.position.x+0.5, mesh4.position.y , mesh4.position.z);
          mesh4.position.set(mesh4.position.x, mesh4.position.y, mesh4.position.z-0.5);
     
      }  
  
 // else if (mesh4.position.y==0){ mesh4.position.set(mesh4.position.x, 30, mesh4.position.z);}
     
  else { 
        mesh4.position.set(350, 8, -950); 
      }
 */
    // ***************rabbit2
    if (move1 == 1) {
      if (camera.position.z <= -200) {
        if (count1 >= 0) {
          count1--;
          mesh6.position.set(mesh6.position.x, 5, mesh6.position.z);
          if (count1 == 0) {
            count2 = num1;
          }
        } else if (count2 >= 0) {
          count2--;
          mesh6.position.set(mesh6.position.x, 8, mesh6.position.z);
          if (count2 == 0) {
            count1 = num1;
          }
        }

        if (mesh6.position.x < 950 && mesh6.position.z > -950) {
          mesh6.position.set(
            mesh6.position.x + 0.5,
            mesh6.position.y,
            mesh6.position.z
          );
          mesh6.position.set(
            mesh6.position.x,
            mesh6.position.y,
            mesh6.position.z - 0.5
          );
        } else {
          mesh6.position.set(20, 90, -185);
          move1=0;
        }
      }
    }
    /*if(move1==1) {
  if (count1>=0){
        count1--;
        mesh6.position.set(mesh6.position.x, 5, mesh6.position.z);
         if(count1==0){count2=num1;}
     
      }
  else if(count2>=0)
    {
      count2--;
      mesh6.position.set(mesh6.position.x, 8, mesh6.position.z);
      if(count2==0){count1=num1;}
  }
  
  if ( mesh6.position.z > 30.0 ) {
          mesh6.position.set(0.0, mesh6.position.y, mesh6.position.z-0.5);
        
        
      }
  if ( mesh6.position.x >-550 && mesh6.position.z >-90 ) {
          mesh6.position.set(mesh6.position.x-0.5, mesh6.position.y , mesh6.position.z);
          mesh6.position.set(mesh6.position.x, mesh6.position.y, mesh6.position.z-0.5);
      }
  else if (mesh6.position.x <50 && mesh6.position.z >-270){
         // mesh4.position.set(mesh4.position.x+0.5, 30 , mesh4.position.z);
          mesh6.position.set(mesh6.position.x, mesh6.position.y, mesh6.position.z-0.5);
     
      }  
   else if (mesh6.position.x <250 && mesh4.position.z >-1180){
          mesh6.position.set(mesh6.position.x+0.5, mesh6.position.y , mesh6.position.z);
          mesh6.position.set(mesh6.position.x, mesh6.position.y, mesh6.position.z-0.5);
     
      }  
    
  
 // else if (mesh4.position.y==0){ mesh4.position.set(mesh4.position.x, 30, mesh4.position.z);}
     
  else { 
        mesh6.position.set(20, 90, -185); 
        move1=0;
      }
  }
  */
    //********************rabbit 3
    if (move == 1) {
      if (camera.position.z <= -200) {
        if (count1 >= 0) {
          count1--;
          mesh5.position.set(mesh5.position.x, 5, mesh5.position.z);
          if (count1 == 0) {
            count2 = num1;
          }
        } else if (count2 >= 0) {
          count2--;
          mesh5.position.set(mesh5.position.x, 8, mesh5.position.z);
          if (count2 == 0) {
            count1 = num1;
          }
        }

        if (mesh5.position.x < 950 && mesh6.position.z > -950) {
          mesh5.position.set(
            mesh5.position.x + 0.5,
            mesh5.position.y,
            mesh5.position.z
          );
          mesh5.position.set(
            mesh5.position.x,
            mesh5.position.y,
            mesh5.position.z - 0.5
          );
        } else {
          mesh5.position.set(-355, 268, -440);
          move=0;
        }
      }
    }
    /*
  if(move==1){
   if (count1>=0){
        count1--;
        mesh5.position.set(mesh5.position.x, 5, mesh5.position.z);
         if(count1==0){count2=num1;}
     
      }
  else if(count2>=0)
    {
      count2--;
      mesh5.position.set(mesh5.position.x, 8, mesh5.position.z);
      if(count2==0){count1=num1;}
  }
  
  if ( mesh5.position.z > 20.0 ) {
          mesh5.position.set(0.0, mesh5.position.y, mesh5.position.z-0.5);
        
        
      }
  if ( mesh5.position.x >-550 && mesh5.position.z >-100 ) {
          mesh5.position.set(mesh4.position.x-0.5, mesh5.position.y , mesh5.position.z);
          mesh5.position.set(mesh5.position.x, mesh5.position.y, mesh5.position.z-0.5);
      }
  else if (mesh5.position.x <50 && mesh5.position.z >-280){
         // mesh4.position.set(mesh4.position.x+0.5, 30 , mesh4.position.z);
          mesh5.position.set(mesh5.position.x, mesh5.position.y, mesh5.position.z-0.5);
     
      }  
   else if (mesh5.position.x <250 && mesh5.position.z >-1190){
          mesh5.position.set(mesh5.position.x+0.5, mesh5.position.y , mesh5.position.z);
          mesh5.position.set(mesh5.position.x, mesh5.position.y, mesh5.position.z-0.5);
     
      }  
  
 // else if (mesh4.position.y==0){ mesh4.position.set(mesh4.position.x, 30, mesh4.position.z);}
     
  else { 
        mesh5.position.set(-355, 268, -440); 
        move=0;
      }
  }*/
  }

  prevTime = time;

  renderer.render(scene, camera);
}

function addGridHelper() {
  var helper = new THREE.GridHelper(100, 100);
  helper.material.opacity = 0.25;
  helper.material.transparent = true;
  scene.add(helper);

  var axis = new THREE.AxesHelper(1000);
  scene.add(axis);
}
