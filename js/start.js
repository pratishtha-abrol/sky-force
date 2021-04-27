import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {OBJLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/MTLLoader.js';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas});

    const players = [];

    const fov = 90;
    const aspect = 2;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set( 0,10,-10 );

    const controls = new OrbitControls( camera, canvas );
    controls.target.set( 0,0,0 )
    controls.update();

    const scene = new THREE.Scene();
    // scene.background = new THREE.Color('skyblue'); 
    
    {
        const skyColor = 0x000000;  // black
        const groundColor = 0xB97A20;  // brownish orange
        const intensity = 0.5;
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
            mtl: 'assets/fighter.mtl',
        },
        enemy: {
            obj: "assets/flare_Hub.obj",
            mtl: "assets/flare_Hub.mtl"
        }
    }

    {
        // player
        const mtlLoader = new MTLLoader();
        mtlLoader.load('assets/fighter.mtl', (mtl) => {
            mtl.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(mtl);
            objLoader.load('assets/fighter.obj', (player) => {
                player.position.set(0,0,0);
                scene.add(player);
                players.push(player);
            });
        });
    }

    var enemies = []

    for (var i=0; i<10; i++) {
        const mtlLoader = new MTLLoader();
        mtlLoader.load('assets/flare_Hub.mtl', (mtl) => {
            mtl.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(mtl);
            objLoader.load('assets/flare_Hub.obj', (enemy) => {
                enemy.position.x = (Math.random() * 60) - 30;
                enemy.position.y = 0;
                enemy.position.z = (Math.random() * 50) + 20;
                scene.add(enemy);
                enemies.push(enemy);
            });
        });
    }
    
    // {
    //     const mtlLoader = new MTLLoader();
    //     for (const model of Object.values(models)) {
    //         mtlLoader.load(model.mtl, (mtl) => {
    //             mtl.preload();
    //             const objLoader = new OBJLoader();
    //             objLoader.setMaterials(mtl);
    //             objLoader.load(model.obj, (root) => {
    //                 scene.add(root);
    //             });
    //         });
    //     }
    // }

    {
        const loader = new THREE.TextureLoader();
        const texture = loader.load(
            'images/sky.jpg',
            () => {
                const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
                rt.fromEquirectangularTexture(renderer, texture);
                scene.background = rt.texture;
        });
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
        window.addEventListener('keydown', function(e) {
            var key = e.code;
            // console.log(key, e.code)
            if (key === 'ArrowLeft') {
                move(1);
            }
            if (key === 'ArrowRight') {
                move(2);
            }
            if (key === 'ArrowUp') {
                move(3);
            }
            if (key === 'ArrowDown') {
                move(4);
            }
            // if (key === 'KeyF') {

            // }
        })
        function move (val) {
            for (var i=0; i<players.length;i++) {
                //update player[i]
                if (val === 1) {
                    players[i].position.x += 0.002;
                }
                if (val === 2) {
                    players[i].position.x -= 0.002;
                }
                if (val === 3) {
                    players[i].position.z += 0.002;
                }
                if (val === 4) {
                    players[i].position.z -= 0.002;
                }
            }            
        }
        for (var i=0; i<enemies.length;i++) {
            if (enemies[i].position.z > -15) {
                enemies[i].position.z -= 0.1;
            } else {
                enemies[i].position.x = (Math.random() * 60) - 30;
                enemies[i].position.y = 0;
                enemies[i].position.z = (Math.random() * 50) + 20;
            }
        }
        renderer.render(scene, camera);
        requestAnimationFrame(render);
        // console.log(camera.position)
    }
    requestAnimationFrame(render);
}

main();