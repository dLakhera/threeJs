import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.123.0/build/three.module.js';
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js";


// Default constant variables
var SCREEN_WIDTH, SCREEN_HEIGHT;
const GROUND_ORDINATE = -1.25;


// Initial time logged
let previousTime = performance.now();

// Motion definition variables
const direction = new THREE.Vector3();
const velocity = 0.05;
var rotation = 0;
const movement = {
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false
};


//Create Scene
const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper())
scene.background = new THREE.Color(0xc8fbfb);
// scene.fog = new THREE.Fog(0xFFFFFF, 1, 40);
const loader = new GLTFLoader();




// EVENTS
window.addEventListener('resize', onWindowResize, false);
document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);


// EVENT HANDLERS
function onWindowResize() {
    // console.log("WINDOW RESIZED");
    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;

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


const size = 200;
const divisions = 200;

// const gridHelper = new THREE.GridHelper( size, divisions );
// gridHelper.position.y= GROUND_ORDINATE;
// scene.add( gridHelper );


//Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-4, 4, 4);
camera.rotation.set(-0.15, -0.34, -0.05);

//Renderer
const container = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
//renderer.setClearColor('#c8fbfb');
renderer.setSize(window.innerWidth, window.innerHeight);
//--------- Documentation Read to understand
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//---------
container.appendChild(renderer.domElement);


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
scene.add(new THREE.CameraHelper(dirLight.shadow.camera));


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

scene.add(ground);


//ADD MODELS

//Barbarian
loader.load('./barbarian/scene.gltf', function (gltf) {
    const model = gltf.scene;
    model.scale.multiplyScalar(1 / 10);

    centeringMethod(model);

    model.position.x = -4;
    scene.add(model);
    const animate = function () {
        requestAnimationFrame(animate);
        // console.log(camera.rotation);
        // model.rotation.x += 0.01;
        model.rotation.y += 0.01;
        renderer.render(scene, camera);
    };
    animate();

}, undefined, function (error) {

    console.error(error);

});


//CAR
var model;
var delta = 0;
loader.load('./car/scene.gltf', function (gltf) {
    model = gltf.scene;
    model.scale.multiplyScalar(1 / 25);
    centeringMethod(model);
    model.position.x = 3;
    scene.add(model);
    const time = performance.now();
    const animate = function () {
        const time = performance.now();
        var delta = (time - previousTime) / 1000;

        // const clock = new THREE.Clock();
        // delta = clock.getDelta();

        const distTravel = velocity * delta;

        direction.x = Number(movement.moveBackward) - Number(movement.moveForward);
        direction.z = Number(movement.moveRight) - Number(movement.moveLeft);

        direction.normalize();

        model.position.x += direction.z * distTravel;
        model.position.z += direction.x * distTravel;

        // model.rotation.x += direction.z * 

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };
    animate();
}, undefined, function (error) {
    console.log(error);
});

// function moveCar(){
//     var distanceMoved = velocity * delta;
//     var dir = new THREE.Vector3(model.position.x, model.position.y, model.position.z);
//     dir.sub(camera.position).normalize();


//     // direction.normalize();
//     // console.log(direction);

//     if(movement.moveForward){
//         model.position.x += distanceMoved * dir.x;
//         model.position.z += (dir.z) * distanceMoved;
//     } else if(movement.moveBackward){
//         model.position.x -= distanceMoved * dir.x;
//         model.position.z -= (dir.z) * distanceMoved;
//     }
// }

// function moveCamera() {
//     // var delta = clock.getDelta();
//     const time = performance.now();
//     const delta = (time - previousTime) / 1000;
//     var sensitivity = 150;
//     var rotateAngle = Math.PI / 2 * delta * sensitivity;

//     if(movement.moveRight) rotation -= rotateAngle;
//     if(movement.moveLeft) rotation += rotateAngle;

//     var rotZ = Math.cos(rotation)
//     var rotX = Math.sin(rotation)
//     var distance = 200;
//     camera.position.x = model.position.x - (distance * rotX);
//     camera.position.y = model.position.y + 50;
//     camera.position.z = model.position.z - (distance * rotZ);
//     camera.lookAt(model.position);
// }

const controls = new OrbitControls(camera, renderer.domElement);
// controls.minDistance = 2;
// controls.maxDistance = 10;
controls.target.set(0, 0, - 0.2);
controls.update();
