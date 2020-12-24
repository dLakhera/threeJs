import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three/examples/jsm/loaders/GLTFLoader.min.js';
import * as THREE from "https://threejs.org/build/three.module.js";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";


// Default constant variables
var SCREEN_WIDTH, SCREEN_HEIGHT;
const GROUND_ORDINATE = -1.25;


// Clock for delata time interval
const clock = new THREE.Clock();

// Motion definition variables
const direction = new THREE.Vector3();
const velocity = 4;
const movement = {
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false
};


//Create Scene
const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper())
//scene.background = new THREE.Color(0xc8fbfb);
//scene.fog = new THREE.Fog(0xFFFFFF, 10, 40);
const loader = new GLTFLoader();

//Renderer
const container = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);

renderer.setClearColor(0x000000, 0); // the default


//renderer.setClearColor('#c8fbfb');
renderer.setSize(container.clientWidth, container.clientHeight);
//--------- Docuntation Read to understand
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//---------

container.appendChild(renderer.domElement);

// EVENTS
window.addEventListener('resize', onWindowResize, false);
document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);


// EVENT HANDLERS
function onWindowResize() {
    // console.log("WINDOW RESIZED");
    SCREEN_WIDTH = container.clientWidth;
    SCREEN_HEIGHT = container.clientHeight;

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    camera.updateProjectionMatrix();

}

function onKeyDown(event) {
    console.log("KEY PRESSED DOWN: " + event.keyCode);
    switch (event.keyCode) {

        case 38: /*up*/
        case 87: /*W*/ 	movement.moveForward = true; break;

        case 40: /*down*/
        case 83: /*S*/ 	 movement.moveBackward = true; break;

        case 37: /*left*/
        case 65: /*A*/ movement.moveLeft = true; break;

        case 39: /*right*/
        case 68: /*D*/ movement.moveRight = true; break;

    }
}

function onKeyUp(event) {
    console.log("KEY PRESSED UP: " + event.keyCode);

    switch (event.keyCode) {

        case 38: /*up*/
        case 87: /*W*/ movement.moveForward = false; break;

        case 40: /*down*/
        case 83: /*S*/ 	 movement.moveBackward = false; break;

        case 37: /*left*/
        case 65: /*A*/ 	 movement.moveLeft = false; break;

        case 39: /*right*/
        case 68: /*D*/ movement.moveRight = false; break;

    }
}

// UTILITY FUNCTION
function centeringMethod(model) {
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());

    model.position.x += (model.position.x - center.x);
    model.position.y += (model.position.y - center.y);
    model.position.z += (model.position.z - center.z);

    return model;
}

function vectoriseObjects(params) {
    return new THREE.Vector3(params.x, params.y, params.z);
}

// Ground Grid

// const size = 200;
// const divisions = 200;

// const gridHelper = new THREE.GridHelper(size, divisions);
// gridHelper.position.y = -1
// scene.add(gridHelper);


//Camera

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(-4, 4, 4);
camera.rotation.set(-0.15, -0.34, -0.05);




//Lighting
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
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
// scene.add(new THREE.CameraHelper(dirLight.shadow.camera));

//GROUND
const gt = new THREE.TextureLoader().load("assets/grass/grass.jpg");
const gg = new THREE.PlaneGeometry(1600, 1600);
const gm = new THREE.MeshPhongMaterial({ color: 0xffffff, map: gt });

const ground = new THREE.Mesh(gg, gm);
ground.position.y = GROUND_ORDINATE;
ground.rotation.x = - Math.PI / 2;
ground.material.map.repeat.set(200, 200);
ground.material.map.wrapS = THREE.RepeatWrapping;
ground.material.map.wrapT = THREE.RepeatWrapping;
ground.material.map.encoding = THREE.sRGBEncoding;
ground.receiveShadow = true;

//scene.add(ground);


//ADD MODELS

//Barbarian
// loader.load('./barbarian/scene.gltf', function (gltf) {
//     const model = gltf.scene;
//     model.scale.multiplyScalar(1 / 10);

//     centeringMethod(model);

//     model.position.x = -4;
//     scene.add(model);
//     const animate = function () {
//         requestAnimationFrame(animate);
//         // console.log(camera.rotation);
//         // model.rotation.x += 0.01;
//         model.rotation.y += 0.01;
//         renderer.render(scene, camera);
//     };
//     animate();

// }, undefined, function (error) {

//     console.error(error);

// });


//CAR

var model;
loader.load('assets/car/scene.gltf', function (gltf) {
    model = gltf.scene;
    model.scale.multiplyScalar(1 / 25);
    centeringMethod(model);
    model.position.x = 3;
    // model.children.push(camera);
    scene.add(model);
    const offsetVector = new THREE.Vector3(model.position.x - camera.position.x, model.position.y - camera.position.y, model.position.z - camera.position.z);
    // console.log(model.position.x + " " + model.position.y + " " + model.position.z);
    // console.log(camera.position.x + " " + camera.position.y + " " + camera.position.z);
    // const time = performance.now();
    const animate = function () {

        direction.z = Number(movement.moveForward) - Number(movement.moveBackward);
        direction.x = Number(movement.moveRight) - Number(movement.moveLeft);
        const delta = clock.getDelta();

        if (direction.x != 0 || direction.z != 0) {
            direction.normalize();
            const changeInPos = new THREE.Vector3();
            changeInPos.y = 0;
            changeInPos.x = direction.x * velocity * delta;
            changeInPos.z = direction.z * velocity * delta;

            let theta = model.rotation.y - changeInPos.x;
            model.rotation.y = theta;
            model.position.x -= changeInPos.z * Math.sin(theta);
            model.position.z -= changeInPos.z * Math.cos(theta);

        }
        var vec = new THREE.Vector3(model.position.x - offsetVector.x, model.position.y - offsetVector.y, model.position.z - offsetVector.z);
        camera.position.set(vec.x, vec.y, vec.z);
        controls.target.copy(model.position);
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };
    animate();
}, undefined, function (error) {
    console.log(error);
});

const controls = new OrbitControls(camera, renderer.domElement);
// To achieve smooth camera motion. For example look here https://www.babylonjs.com/demos/pbrglossy/
// controls.target.set(0, 0, - 0.2);

controls.enablePan = false;
controls.enableZoom = false;
controls.enableDamping = true;
controls.minPolarAngle = 0.8;
controls.maxPolarAngle = 2.4;
controls.dampingFactor = 0.07;
controls.rotateSpeed = 0.07

// controls.update();
// var axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);
