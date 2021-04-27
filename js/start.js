import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {OBJLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/MTLLoader.js';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas});

    const players = [];
    var count=0;
    var shoot = false;
    var score = 0;
    var health = 1000;
    var gameOver;

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
    addLight(0,10,0);

    const models = {
        player: {
            obj: "assets/fighter.obj",
            mtl: "assets/fighter.mtl",
        },
        enemy: {
            obj: "assets/flare_Hub.obj",
            mtl: "assets/flare_Hub.mtl"
        },
        star: {
            obj: "assets/star.obj",
            mtl: "assets/star.mtl"
        },
        bullet: {
            obj: "assets/bullet.obj",
            mtl: "assets/bullet.mtl"
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

    var stars = []

    for (var i=0; i<10; i++) {
        const mtlLoader = new MTLLoader();
        mtlLoader.load('assets/star.mtl', (mtl) => {
            mtl.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(mtl);
            objLoader.load('assets/star.obj', (star) => {
                star.position.x = (Math.random() * 60) - 30;
                star.position.y = 0;
                star.position.z = (Math.random() * 50) + 20;
                scene.add(star);
                stars.push(star);
            });
        });
    }
    

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
        if (health === 0) {
            gameOver = true;
        }

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
            //     count++;
            //     shoot = true;
            // }
        })
        function move (val) {
            for (var i=0; i<players.length;i++) {
                //update player[i]
                if (val === 1 && !gameOver) {
                    if (players[i].position.x < 30) {
                        players[i].position.x += 0.002;
                    }
                }
                if (val === 2 && !gameOver) {
                    if (players[i].position.x > -30) {
                        players[i].position.x -= 0.002;
                    }
                }
                if (val === 3 && !gameOver) {
                    if (players[i].position.z < 70) {
                        players[i].position.z += 0.002;
                    }
                }
                if (val === 4 && !gameOver) {
                    if (players[i].position.z > -15) {
                        players[i].position.z -= 0.002;
                    }
                }
            }         
        }
        for (var i=0; i<enemies.length;i++) {
            if (enemies[i].position.z > -15  && !gameOver) {
                enemies[i].position.z -= 0.1;
            } else {
                if (!gameOver) {
                    enemies[i].position.x = (Math.random() * 60) - 30;
                    enemies[i].position.y = 0;
                    enemies[i].position.z = (Math.random() * 50) + 20;
                }
            }
        }
        for (var i=0; i<stars.length;i++) {
            if (stars[i].position.z > -15  && !gameOver) {
                stars[i].position.z -= 0.1;
            } else {
                if (!gameOver) {
                    stars[i].position.x = (Math.random() * 60) - 30;
                    stars[i].position.y = 0;
                    stars[i].position.z = (Math.random() * 50) + 20;
                }
            }
        }

        // Collision handling
        {
            // player and star
            for (var i=0; i<players.length; i++) {
                for (var j=0; j<stars.length; j++) {
                    if (stars[j].position.z < players[i].position.z + 5 && stars[j].position.z < players[i].position.z + 5 && stars[j].position.x < players[i].position.x + 3 && stars[j].position.x > players[i].position.x- 3 && stars[j].position.y < players[i].position.y + 1.5 && stars[j].position.y > players[i].position.y- 1.5) {
                        score += 10;
                        document.getElementById("score").innerHTML = score;
                        stars[j].position.x = (Math.random() * 60) - 30;
                        stars[j].position.y = 0;
                        stars[j].position.z = (Math.random() * 50) + 20;
                    }
                }
            }

            // player and enemy
            for (var i=0; i<players.length; i++) {
                for (var j=0; j<enemies.length; j++) {
                    if (enemies[j].position.z < players[i].position.z + 5 && enemies[j].position.z < players[i].position.z + 5 && enemies[j].position.x < players[i].position.x + 5 && enemies[j].position.x > players[i].position.x- 5 && enemies[j].position.y < players[i].position.y + 3 && enemies[j].position.y > players[i].position.y- 3) {
                        health -= 10;
                        document.getElementById("health").innerHTML = health;
                        enemies[j].position.x = (Math.random() * 60) - 30;
                        enemies[j].position.y = 0;
                        enemies[j].position.z = (Math.random() * 50) + 20;
                    }
                }
            }
        }


        renderer.render(scene, camera);
        requestAnimationFrame(render);
        // console.log(camera.position)
    }
    requestAnimationFrame(render);
}

main();