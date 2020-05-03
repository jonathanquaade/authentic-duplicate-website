import * as THREE from '../build/three.module.js';

import { OrbitControls } from '../examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from '../examples/jsm/loaders/RGBELoader.js';
import { RoughnessMipmapper } from '../examples/jsm/utils/RoughnessMipmapper.js';
import { HDRCubeTextureLoader } from '../examples/jsm/loaders/HDRCubeTextureLoader.js';

var params = {
    envMap: 'HDR',
    roughness: 0.0,
    metalness: 0.0,
    exposure: 1.0,
    debug: false
};

var renderer, scene, camera, distance, stats, main1, main2, main3, sec1, sec2, sec3;
var mainLogoArray = [main1, main2, main3];
var secArray = [sec1, sec2, sec3];
var index2 = 0;
var index = 0;


var files = [
    "../assets/glb/ad-paper.glb",
    "../assets/glb/ad-metal.glb",
    "../assets/glb/ad-metal.glb",
];
var secFiles = [
    "../assets/glb/logotest2.gltf",
    "../assets/glb/logotest4.gltf",
    "../assets/glb/logotest5.gltf",
    "../assets/glb/logotest4.gltf",
    "../assets/glb/logotest5.gltf",
    "../assets/glb/logotest2.gltf",
    "../assets/glb/logotest5.gltf",
    "../assets/glb/logotest2.gltf",
    "../assets/glb/logotest4.gltf",
    "../assets/glb/logotest2.gltf",
    "../assets/glb/logotest4.gltf",
    "../assets/glb/logotest5.gltf",
];

function init() {

    THREE.Cache.enabled = true;
    //RENDERER
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x454734);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    //SCENE & CAMERA
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, 50);
    scene.add(camera);

    //LIGHTS
    var light1 = new THREE.PointLight(0xffffff, 1, 4000);
    light1.position.set(50, 0, 100);
    var light2 = new THREE.PointLight(0xffffff, 1, 0.5);
    light2.position.set(-100, 300, 300);
    var lightAmbient = new THREE.AmbientLight(0x0808080);

    scene.add(light1, light2, lightAmbient);
    // scene.add(light1, light2);

    stats = new Stats();
    stats.showPanel(1);
    document.body.appendChild(stats.domElement);

    createLogos();
    // createSmallLogos();

    renderer.render(scene, camera);

    window.addEventListener("resize", onWindowResize, false);
    // document.addEventListener('mousemove', onMouseMove, false);
}

function createLogos() {

    var pmremGenerator = new THREE.PMREMGenerator( renderer );
    pmremGenerator.compileEquirectangularShader();

    new RGBELoader()
	.setDataType( THREE.UnsignedByteType )
	.setPath( '../assets/textures/' )
	.load( 'royal_esplanade_1k.hdr', function ( texture ) {
		var envMap = pmremGenerator.fromEquirectangular( texture ).texture;
		scene.background = envMap;
		scene.environment = envMap;
		texture.dispose();
		pmremGenerator.dispose();
        render();

        var roughnessMipmapper = new RoughnessMipmapper( renderer );

        var loader = new GLTFLoader().setPath( '../assets/glb/' );
        loader.load( 'ad-metal.glb', function ( gltf ) {

            gltf.scene.traverse( function ( child ) {

                if ( child.isMesh ) {

                    roughnessMipmapper.generateMipmaps( child.material );
                }
            } );
            scene.add( gltf.scene );
            roughnessMipmapper.dispose();

        } );

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.8;
        renderer.outputEncoding = THREE.sRGBEncoding;
        // container.appendChild( renderer.domElement );


    } );
    renderer.render(scene, camera);
			// model

    // for (var i = 0; i < 3; i++) {
    //     var file = files[i];
    //     loader.load(file, function (gltf) {
    //         mainLogoArray[index] = gltf.scene;
    //         mainLogoArray[index].children[0].material = metal;
    //         mainLogoArray[index].position.z = -5;
    //         mainLogoArray[index].position.x = -48 + index * 48;
    //         mainLogoArray[index].rotation.y = 0.005 + 0.1 * index;
    //         mainLogoArray[index].rotation.z = 0.005 + 0.25 * index;
    //         mainLogoArray[index].scale.set(2.5, 2.5, 2.5);

    //         scene.add(mainLogoArray[index]);
    //         renderer.render(scene, camera);
    //         index++;
    //     });
    // }
}

function createSmallLogos() {
    var loader = new THREE.GLTFLoader();

    for (var i = 0; i < 12; i++) {
        //
        var file = secFiles[i];
        loader.load(file, function (gltf) {
            secArray[index2] = gltf.scene;
            secArray[index2].children[0].material = new THREE.MeshPhongMaterial({
                color: 0xff00000,
                shading: THREE.FlatShading,
            });
            secArray[index2].position.x = -100 + Math.random() * 0.5 * 500;
            secArray[index2].position.z = -20;
            secArray[index2].scale.set(0.65, 0.65, 0.65);

            scene.add(secArray[index2]);
            renderer.render(scene, camera);
            index2++;
        });
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.updateProjectionMatrix();
}

function onMouseMove(event) {
    mouseX = event.clientX - window.innerWidth / 1.0;
    mouseY = event.clientY - window.innerHeight / 1.0;
    camera.position.x += (mouseX - camera.position.x) * 0.000005;
    camera.position.y += (mouseY - camera.position.y) * 0.000005;
    console.log(camera.position.y);
    camera.lookAt(scene.position);
}

function animate() {
    stats.begin();

    requestAnimationFrame(animate);
    render();

    stats.end();
}

var xspeed = 0.3;
var yspeed = 0.3;
var width = 100;
var height = 60;
var r = 3;

function render() {
    var timer = 0.00001 * Date.now();
    var counter = 0.00001;
    counter += 0.0001;

    // for (let i = 0; i < 3; i++) {
    //     if (mainLogoArray[i]) {
    //         mainLogoArray[i].rotation.y += 0.001;
    //         mainLogoArray[i].rotation.z += 0.001;
    //     }
    // }
    if (secArray[0] && secArray[1] && secArray[11]) {
        for (var i = 0, l = secArray.length; i < l; i++) {
            var object = secArray[i];
            object.position.y = 50 * Math.cos(timer + i);
            object.position.x += counter;
            object.rotation.y += Math.PI / 900;
        }
    }

    if (secArray[0] && index2 === 11) {
        for (let i = 0; i < secArray.length; i++) {
            secArray[i];
            if (
                secArray[i].position.x > width - r ||
                secArray[i].position.x < r - width
            ) {
                console.log("here");
                xspeed = -xspeed;
            }
            if (
                secArray[i].position.y > height - r ||
                secArray[i].position.y < r - height
            ) {
                console.log("here2");
                yspeed = -yspeed;
            }
        }
    }
    //     if (xRight) {
    //         secArray[i].position.x += 0.5 ;
    //         if (secArray[i].position.x > xFar) {
    //              xRight = false;
    //        }
    //      }
    //     else if (!xRight) {
    //         secArray[i].position.x += -0.5 ;
    //         if (secArray[i].position.x < xNear) {
    //              xRight = true;
    //        }
    //     }
    //     else {
    //         secArray[i].position.set(0, 0, 0)
    //     }

    //     secArray[i].rotation.y += 0.011;
    //     secArray[i].rotation.z += 0.011;
    //   }
    //   //Y
    //   for (let i = 0; i < 3; i++) {
    //     if (yUp) {
    //         secArray[i].position.y += 0.5 ;
    //         if (secArray[i].position.y > yTop) {
    //             yUp= false;
    //        }
    //      }
    //     else if (!yUp) {
    //         secArray[i].position.y += -0.5 ;
    //         if (secArray[i].position.y < yBot) {
    //              yUp = true;
    //        }
    //     }
    //     else {
    //         secArray[i].position.set(0, 0, 0)
    //        }
    renderer.render(scene, camera);
}

// // index = 0;
// for (var i = 0; i < 3; i++) {
//     //
//     var file = secFiles[i]
//      loader.load(file, secondary_load);
// }

// function main_load(gltf) {

//         mainLogoArray[index] = gltf.scene;
//         mainLogoArray[index].children[0].material = new THREE.MeshLambertMaterial();
//         scene.add(mainLogoArray[index]);
//         mainLogoArray[index].position.z = -5;
//         mainLogoArray[index].position.x = -12 + (index * 12)
//         mainLogoArray[index].rotation.y = 0.005 + (0.10 * index);
//         mainLogoArray[index].rotation.z = 0.005 + (0.25 * index);
//         mainLogoArray[index].scale.set(0.45,0.45,0.45)

//         console.log(scene)
//         index++;
// }

// function secondary_load(gltf) {
//         secArray[index2] = gltf.scene
//         secArray[index2].children[0].material = new THREE.MeshLambertMaterial();
//         secArray[index2].position.x = (Math.random() * 0.5) * 20;
//         // secArray[index2].position.y = (Math.random() * 0.5) * 20;
//         secArray[index2].position.z = -5;

//         secArray[index2].scale.set(0.2,0.2,0.2)
//         // scene.add( secArray[index] );
//         scene.add(secArray[index2]);
//         index2++;
// }

// camera.position.set( 0 , 0 , 10 );

// render();

// function render() {

// // delta += 0.1;
// //  for (let i = 0; i < 3; i++) {
// //     if (mainLogoArray[i] && secArray[1]) {
// //         mainLogoArray[i].rotation.y += 0.001;
// //         mainLogoArray[i].rotation.z += 0.001;
// //   }
// // }

// // controls.update();
// requestAnimationFrame(render);

// }

init();
animate();
