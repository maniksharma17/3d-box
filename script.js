const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 20);
camera.position.z = 10;
scene.add(camera);

// Textures
let loader = new THREE.TextureLoader();
let color = loader.load('./text/color.jpg');
let roughness = loader.load('./text/roughness.jpg');
let normal = loader.load('./text/normal.png');
let height = loader.load('./text/height.png');

let box = new THREE.BoxGeometry(4, 4, 4);
let material = new THREE.MeshStandardMaterial({
  map: color,
  roughnessMap: roughness,
  normalMap: normal,
  metalness: 0
});
let cube = new THREE.Mesh(box, material);
cube.castShadow = true; // Allow shadows to be cast by the cube
cube.position.y = 2.5
scene.add(cube);

// Create a plane to serve as the base (floor)
let planeGeometry = new THREE.PlaneGeometry(10, 10);
let planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); // White color for the floor
let plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = - Math.PI / 2; // Rotate the plane to lay flat
plane.position.y = -0.1; // Position the plane just below the cube
plane.receiveShadow = true; // Enable receiving shadows on the plane
scene.add(plane);

// Ambient Light (soft overall light)
const ambientLight = new THREE.AmbientLight("white", 0.3); 
scene.add(ambientLight);

// Directional Light (main light source, simulating the sun)
const directionalLight = new THREE.DirectionalLight("white", 1);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true; // Enable shadows from directional light
scene.add(directionalLight);

// Set the shadow properties for the directional light
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;

// Point Light (adds interactive lighting with falloff)
const pointLight = new THREE.PointLight("white", 1, 100);
pointLight.position.set(0, 5, 5);
pointLight.castShadow = true; // Enable shadows from point light
scene.add(pointLight);


// Renderer setup
const canvas = document.querySelector('canvas');
let renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

// Set the background color to white
renderer.setClearColor(0xffffff, 1); // 0xffffff is white, 1 is full opacity

// Shadow settings
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadow type for realism

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = true;

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

let clock = new THREE.Clock();
function animate() {
  window.requestAnimationFrame(animate);
  renderer.render(scene, camera);
  cube.rotation.y += 0.01;
  controls.update();
}

animate();
