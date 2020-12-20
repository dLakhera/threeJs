import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.123.0/build/three.module.js';
const loader = new GLTFLoader();

const texture = new THREE.TextureLoader().load( '/microphone/textures/01___Default_baseColor.jpeg' );
const ematerial = new THREE.MeshBasicMaterial( { map: texture } );

loader.load( './microphone/scene.gltf', function ( gltf ) {
    const model = gltf.scene;
	scene.add(  model );
}, undefined, function ( error ) {
    
    console.error( error );
    
} );


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xffffff)
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
//scene.add(cube);
camera.position.z = 5;

const animate = function () {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
};

animate();