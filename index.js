import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.123.0/build/three.module.js';
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
const loader = new GLTFLoader();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

// camera.position.x = 5;
camera.position.y = 5;
// camera.position.z = 5;
camera.position.x = -3.4;
camera.position.y = 1.4;
camera.position.z = 10;

camera.rotation._x = -0.15;
camera.rotation._y = -0.34;
camera.rotation._z = -0.05;


renderer.setClearColor('#c8fbfb');
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);


const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
hemiLight.position.set(20, 20, 20);
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


function centeringMethod(model) {
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());

    model.position.x += (model.position.x - center.x);
    model.position.y += (model.position.y - center.y);
    model.position.z += (model.position.z - center.z);

    return model;
}

//Microphone
var barb = loader.load('./barbarian/scene.gltf', function (gltf) {
    const model = gltf.scene;

    model.scale.multiplyScalar(1 / 10);

    centeringMethod(model);

    model.position.x = -4;
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

var fallout = loader.load('./fallout/scene.gltf', function (gltf) {
    const model = gltf.scene;
    model.scale.multiplyScalar(1 / 20);
    centeringMethod(model);

    model.position.x = 4;
    scene.add(model);
    const animate = function () {
        requestAnimationFrame(animate);

        // model.rotation.x += 0.01;
        model.rotation.y += 0.01;
        renderer.render(scene, camera);
    };
    animate();
}, undefined, function (error) {
    console.log(error);
});

const texture = new THREE.TextureLoader().load("./grassTexture.png");
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(200, 200);


const geometry = new THREE.PlaneGeometry(1000, 1000);
const material = new THREE.MeshBasicMaterial({ map: texture });
const plane = new THREE.Mesh(geometry, material);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1;
scene.add(plane);


const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 2;
controls.maxDistance = 10;
controls.target.set(0, 0, - 0.2);
controls.update();
