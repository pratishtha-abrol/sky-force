import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {OBJLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/MTLLoader.js';

import {InputManager} from './input.js'

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas});

    const fov = 45;
    const aspect = 2;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set( 0,64,-25 );

    const controls = new OrbitControls( camera, canvas );
    controls.target.set( 0,0,0 )
    controls.update();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('skyblue'); 

    {
        const skyColor = 0x000000;  // black
        const groundColor = 0xB97A20;  // brownish orange
        const intensity = 1;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(light);
    }

    function addLight(...pos) {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(...pos);
        scene.add(light);
        scene.add(light.target);
    }
    addLight(-20, 20, 20)

    const models = {
        player: {
            obj: 'assets/fighter.obj',
            mtl: 'assets/fighter.mtl'
        }
    }
    
    // player jet
    {
        const mtlLoader = new MTLLoader();
        for (const model of Object.values(models)) {
            mtlLoader.load(model.mtl, (mtl) => {
                mtl.preload();
                const objLoader = new OBJLoader();
                objLoader.setMaterials(mtl);
                objLoader.load(model.obj, (root) => {
                    scene.add(root);
                });
            });
        }
    }



    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
          renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function render() {
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        renderer.render(scene, camera);
        requestAnimationFrame(render);
        // console.log(camera.position)
    }
    requestAnimationFrame(render);
}

main();