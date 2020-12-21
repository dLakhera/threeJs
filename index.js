import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.123.0/build/three.module.js';
// import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three-orbitcontrols@2.110.3/OrbitControls.min.js";
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
const loader = new GLTFLoader();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setClearColor(0xff0000);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 2;


const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff);
dirLight.position.set(- 3, 10, - 10);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 2;
dirLight.shadow.camera.bottom = - 2;
dirLight.shadow.camera.left = - 2;
dirLight.shadow.camera.right = 2;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 40;
scene.add(dirLight);

//Microphone
loader.load('./microphone/scene.gltf', function (gltf) {
    const model = gltf.scene;
    const tl = new THREE.TextureLoader();
    const texture = tl.load('./microphone/textures/01___Default_metallicRoughness.png')



    // model.metalnessMap = texture;
    // const texture = textLoader.load('./microphone/textures/01___Default_normal.jpeg')
    // const mtrl = new THREE.MeshBasicMaterial({ map: texture });
    // const basetexture = new THREE.TextureLoader().load('/microphone/textures/01___Default_baseColor.jpeg');
    // const metalicRoughnesstexture = new THREE.TextureLoader().load('/microphone/textures/01___Default_metallicRoughness.png');
    // const normaltexture = new THREE.TextureLoader().load('/microphone/textures/01___Default_normal.jpeg');
    // const micMaterial = new THREE.MeshStandardMaterial({ color: 'purple' });
    // micMaterial.map = basetexture;
    // micMaterial.metalnessMap = metalicRoughnesstexture;
    // micMaterial.normalMap = normaltexture;
    // micMaterial.color = "#0xff0000";
    // model.material = micMaterial;


    scene.add(model);
    const animate = function () {
        requestAnimationFrame(animate);
    
        // model.rotation.x += 0.01;
        model.rotation.y += 0.01;
    
        renderer.render(scene, camera);
    };
    animate();
    
}, undefined, function (error) {

    console.error(error);

});


const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', render); // use if there is no animation loop
controls.minDistance = 2;
controls.maxDistance = 10;
controls.target.set(0, 0, - 0.2);
controls.update();

renderer.render(scene, camera);

// const animate = function () {
//     requestAnimationFrame(animate);

//     cube.rotation.x += 0.01;
//     cube.rotation.y += 0.01;

//     renderer.render(scene, camera);
// };

// animate();