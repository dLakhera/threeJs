import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.123.0/build/three.module.js';
import { OrbitControls } from "./node_modules/three/examples/jsm/controls/OrbitControls.js";


// Clock for delata time interval
const clock = new THREE.Clock();


// Sperical coordinate variables
let theta;

//Create Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xc8fbfb);
scene.fog = new THREE.Fog(0xFFFFFF, 1, 40);
const loader = new GLTFLoader();

const movement = {

    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false

};



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
    // console.log("KEY PRESSED DOWN: " + event.keyCode);
    switch (event.keyCode) {

        case 38: /*up*/
        case 87: /*W*/ 	controls.moveForward = true; break;

        case 40: /*down*/
        case 83: /*S*/ 	 controls.moveBackward = true; break;

        case 37: /*left*/
        case 65: /*A*/ controls.moveLeft = true; break;

        case 39: /*right*/
        case 68: /*D*/ controls.moveRight = true; break;

        //case 67: /*C*/     controls.crouch = true; break;
        //case 32: /*space*/ controls.jump = true; break;
        //case 17: /*ctrl*/  controls.attack = true; break;

    }

}

function onKeyUp(event) {
    // console.log("KEY PRESSED UP: " + event.keyCode);

    switch (event.keyCode) {

        case 38: /*up*/
        case 87: /*W*/ controls.moveForward = false; break;

        case 40: /*down*/
        case 83: /*S*/ 	 controls.moveBackward = false; break;

        case 37: /*left*/
        case 65: /*A*/ 	 controls.moveLeft = false; break;

        case 39: /*right*/
        case 68: /*D*/ controls.moveRight = false; break;

        //case 67: /*C*/     controls.crouch = false; break;
        //case 32: /*space*/ controls.jump = false; break;
        //case 17: /*ctrl*/  controls.attack = false; break;

    }
}

const size = 200;
const divisions = 200;

const gridHelper = new THREE.GridHelper( size, divisions );
gridHelper.position.y=-0.9
scene.add( gridHelper );


//Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-4, 1, 10);
camera.rotation.set(-0.15, -0.34, -0.05);

//Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
//renderer.setClearColor('#c8fbfb');
renderer.setSize(window.innerWidth, window.innerHeight);
//--------- Documentation Read to understand
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//---------
document.body.appendChild(renderer.domElement);


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
scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );


function centeringMethod(model) {
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());

    model.position.x += (model.position.x - center.x);
    model.position.y += (model.position.y - center.y);
    model.position.z += (model.position.z - center.z);

    return model;
}


//GROUND

const gt = new THREE.TextureLoader().load("Assets/grass/grass.jpg");
const gg = new THREE.PlaneGeometry(1600, 1600);
const gm = new THREE.MeshPhongMaterial({ color: 0xffffff, map: gt });

const ground = new THREE.Mesh(gg, gm);
ground.position.y = -1;
ground.rotation.x = - Math.PI / 2;
ground.material.map.repeat.set(200,200);
ground.material.map.wrapS = THREE.RepeatWrapping;
ground.material.map.wrapT = THREE.RepeatWrapping;
ground.material.map.encoding = THREE.sRGBEncoding;
// note that because the ground does not cast a shadow, .castShadow is left false
ground.receiveShadow = true;

scene.add(ground);


//Add Models

//Barbarian
var barb = loader.load('./barbarian/scene.gltf', function (gltf) {
    const model = gltf.scene;
    model.scale.multiplyScalar(1 / 10);

    centeringMethod(model);

    model.position.x = -4;
    scene.add(model);
    const animate = function () {
        requestAnimationFrame(animate);
        console.log(camera.rotation);
        // model.rotation.x += 0.01;
        model.rotation.y += 0.01;
        renderer.render(scene, camera);
    };
    animate();

}, undefined, function (error) {

    console.error(error);

});
//CAR
loader.load('./fallout/scene.gltf', function (gltf) {
    const model = gltf.scene;
    model.scale.multiplyScalar(1 / 25);
    centeringMethod(model);
    model.position.x = 4;
    scene.add(model);
    const animate = function () {
        requestAnimationFrame(animate);
        let direction = new THREE.Vector2();
        
        let translation = Number(movement.moveForward) - Number(movement.moveBackward);
        let angle = Number(movement.moveRight) - Number(movement.moveLeft);

        
        
        renderer.render(scene, camera);
    };
}, undefined, function (error) {
    console.log(error);
});



const controls = new OrbitControls(camera, renderer.domElement);
// controls.minDistance = 2;
// controls.maxDistance = 10;
controls.target.set(0, 0, - 0.2);
controls.update();
