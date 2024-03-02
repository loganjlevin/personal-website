import './style.css';

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

// CAMERA
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// TORUS
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({
  color: 0xff6347,
  roughness: 1,
  metalness: 1,
});
const torus = new THREE.Mesh(geometry, material);
torus.position.z = -30;
scene.add(torus);

// LIGHTING
const pointLight = new THREE.PointLight(0xffffff, 10000);
pointLight.position.set(50, 50, 50);

const ambientLight = new THREE.AmbientLight(0xffffff, 1000);
scene.add(pointLight, ambientLight);

// HELPERS
// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

// ORBITAL CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);

// STARS
function addStar() {
  const radius = THREE.MathUtils.randFloatSpread(1);
  const geometry = new THREE.SphereGeometry(radius, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  material.colorSpace = THREE.SRGBColorSpace;
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// BACKGROUND
const spaceTexture = new THREE.TextureLoader().load('./images/space.jpg');
spaceTexture.colorSpace = THREE.SRGBColorSpace;
scene.background = spaceTexture;

// LOGAN BOX
const loganTexture = new THREE.TextureLoader().load('./images/logan.jpg');
loganTexture.colorSpace = THREE.SRGBColorSpace;

const logan = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: loganTexture })
);

logan.position.z = -10;
logan.position.x = 3;
logan.position.y = 2;
scene.add(logan);

// MOON
const moonTexture = new THREE.TextureLoader().load('./images/moon.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshBasicMaterial({
    map: moonTexture,
  })
);
moon.position.x = 10;
scene.add(moon);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.005;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.005;

  logan.rotation.y += 0.01;
  logan.rotation.x += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera;

// ANIMATE
function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  renderer.render(scene, camera);
}

animate();
