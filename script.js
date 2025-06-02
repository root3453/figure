const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Model group and loader
let model, modelGroup = new THREE.Group();
scene.add(modelGroup);

const loader = new THREE.GLTFLoader();
const dracoLoader = new THREE.DRACOLoader();
dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/libs/draco/');
loader.setDRACOLoader(dracoLoader);

// Load GLB model
loader.load(
  'figure3.glb',
  function (gltf) {
    model = gltf.scene;
    model.scale.set(10, 10, 10);

    // Центруем модель по геометрическому центру
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    console.log('🧩 Model size:', size);
    console.log('📍 Model center:', center);

    model.position.sub(center); // центрируем
    modelGroup.add(model); // добавляем в обёртку

    // Статические повороты по Y и Z (в градусах)
    modelGroup.rotation.y = THREE.MathUtils.degToRad(60); // поворот по Y
    modelGroup.rotation.z = THREE.MathUtils.degToRad(10); // поворот по Z

    camera.position.z = size.length() * 0.6;
    document.getElementById('loading').style.display = 'none';
  },
  undefined,
  function (error) {
    console.error('Error loading model:', error);
    document.getElementById('loading').textContent = 'Error loading model';
  }
);

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop (вращаем по локальной оси X модели после поворотов)
function animate() {
  requestAnimationFrame(animate);

  if (model) {
    model.rotation.x += 0.01; // вращение вокруг локальной оси X
  }

  renderer.render(scene, camera);
}

animate();

