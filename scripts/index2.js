import * as THREE from '../build/three.module.js';

			import Stats from '../examples/jsm/libs/stats.module.js';

			import { GUI } from '../examples/jsm/libs/dat.gui.module.js';
            import { OrbitControls } from '../examples/jsm/controls/OrbitControls.js';
            import { GLTFLoader } from '../examples/jsm/loaders/GLTFLoader.js';
            import { RoughnessMipmapper } from '../examples/jsm/utils/RoughnessMipmapper.js';
			import { HDRCubeTextureLoader } from '../examples/jsm/loaders/HDRCubeTextureLoader.js';

			var params = {
				envMap: 'HDR',
				roughness: 0.0,
				metalness: 0.0,
				exposure: 2.0,
				debug: false
			};

			var container, stats;
			var camera, scene, renderer, controls;
			var torusMesh, planeMesh;
			var generatedCubeRenderTarget, ldrCubeRenderTarget, hdrCubeRenderTarget, rgbmCubeRenderTarget;
			var ldrCubeMap, hdrCubeMap, rgbmCubeMap;

			init();
			animate();

			function getEnvScene() {

				var envScene = new THREE.Scene();

				var geometry = new THREE.BoxBufferGeometry();
				geometry.deleteAttribute( 'uv' );
				var roomMaterial = new THREE.MeshStandardMaterial( { metalness: 0, side: THREE.BackSide } );
				var room = new THREE.Mesh( geometry, roomMaterial );
				room.scale.setScalar( 10 );
				envScene.add( room );

				var mainLight = new THREE.PointLight( 0x454734, 50, 0, 2 );
				envScene.add( mainLight );

				var lightMaterial = new THREE.MeshLambertMaterial( { color: 0xfffff, emissive: 0xffffff, emissiveIntensity: 10 } );

				var light1 = new THREE.Mesh( geometry, lightMaterial );
				light1.material.color.setHex( 0xffffff );
				light1.position.set( - 5, 2, 0 );
				light1.scale.set( 0.1, 1, 1 );
				envScene.add( light1 );

				var light2 = new THREE.Mesh( geometry, lightMaterial.clone() );
				light2.material.color.setHex( 0xffffff );
				light2.position.set( 0, 5, 0 );
				light2.scale.set( 1, 0.1, 1 );
				envScene.add( light2 );

				var light3 = new THREE.Mesh( geometry, lightMaterial.clone() );
				light3.material.color.setHex( 0xffffff );
				light3.position.set( 2, 1, 5 );
				light3.scale.set( 1.5, 2, 0.1 );
                envScene.add( light3 );

				return envScene;

			}

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.set( 0, 0, 120 );

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0x000000 );

				renderer = new THREE.WebGLRenderer();
				renderer.physicallyCorrectLights = true;
                renderer.toneMapping = THREE.ACESFilmicToneMapping;

                // var light1 = new THREE.PointLight(0xffffff, 1, 20);
                // light1.position.set(50, 20, 100);
                // var light2 = new THREE.PointLight(0xffffff, 1, 0.5);
                // light2.position.set(-100, 300, 300);
                var lightAmbient = new THREE.AmbientLight(0xffffff);
				scene.add(lightAmbient);
                // scene.add(light1, light2, lightAmbient);
                
                var material = new THREE.MeshStandardMaterial( {
					color: 0xffffff,
					metalness: params.metalness,
					roughness: params.roughness
				} );
                //
                var roughnessMipmapper = new RoughnessMipmapper( renderer );

                var loader = new GLTFLoader().setPath( '../assets/glb/' );
                loader.load( 'ad-metal.gltf', function ( gltf ) {
                    torusMesh = gltf.scene;
                    torusMesh.position.z = -5;
					torusMesh.position.x = 0 ;
					torusMesh.children[0].material = new THREE.MeshStandardMaterial( {
						color: 0xff0000,
						metalness: params.metalness,
						roughness: params.roughness
					} );
					
                    torusMesh.rotation.y = 0.005 + 0.1 * 1;
                    torusMesh.rotation.z = 0.005 + 0.25 * 1;
                    torusMesh.scale.set(2.5, 2.5, 2.5);
                    scene.add( torusMesh );
                    } );
        
                

				// var geometry = new THREE.TorusKnotBufferGeometry( 18, 8, 150, 20 );
				// //var geometry = new THREE.SphereBufferGeometry( 26, 64, 32 );
				// var material = new THREE.MeshStandardMaterial( {
				// 	color: 0xffffff,
				// 	metalness: params.metalness,
				// 	roughness: params.roughness
				// } );

				// torusMesh = new THREE.Mesh( geometry, material );
				// scene.add( torusMesh );


				var geometry = new THREE.PlaneBufferGeometry( 200, 200 );
				var material = new THREE.MeshBasicMaterial();

				planeMesh = new THREE.Mesh( geometry, material );
				planeMesh.position.y = - 50;
				planeMesh.rotation.x = - Math.PI * 0.5;
				scene.add( planeMesh );

				THREE.DefaultLoadingManager.onLoad = function ( ) {

					pmremGenerator.dispose();

				};

				var hdrUrls = [ 'px.hdr', 'nx.hdr', 'py.hdr', 'ny.hdr', 'pz.hdr', 'nz.hdr' ];
				hdrCubeMap = new HDRCubeTextureLoader()
					.setPath( '../examples/textures/cube/pisaHDR/' )
					.setDataType( THREE.UnsignedByteType )
					.load( hdrUrls, function () {

						hdrCubeRenderTarget = pmremGenerator.fromCubemap( hdrCubeMap );

						hdrCubeMap.magFilter = THREE.LinearFilter;
						hdrCubeMap.needsUpdate = true;

					} );

				var ldrUrls = [ 'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png' ];
				ldrCubeMap = new THREE.CubeTextureLoader()
					.setPath( '../examples/textures/cube/pisa/' )
					.load( ldrUrls, function () {

						ldrCubeMap.encoding = THREE.sRGBEncoding;

						ldrCubeRenderTarget = pmremGenerator.fromCubemap( ldrCubeMap );

					} );


				var rgbmUrls = [ 'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png' ];
				rgbmCubeMap = new THREE.CubeTextureLoader()
					.setPath( '../examples/textures/cube/pisaRGBM16/' )
					.load( rgbmUrls, function () {

						rgbmCubeMap.encoding = THREE.RGBM16Encoding;
						rgbmCubeMap.format = THREE.RGBAFormat;

						rgbmCubeRenderTarget = pmremGenerator.fromCubemap( rgbmCubeMap );

						rgbmCubeMap.magFilter = THREE.LinearFilter;
						rgbmCubeMap.needsUpdate = true;

					} );

				var pmremGenerator = new THREE.PMREMGenerator( renderer );
				pmremGenerator.compileCubemapShader();

				var envScene = getEnvScene();
				generatedCubeRenderTarget = pmremGenerator.fromScene( envScene, 0.04 );

				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				//renderer.toneMapping = ReinhardToneMapping;
				renderer.outputEncoding = THREE.sRGBEncoding;

				stats = new Stats();
				container.appendChild( stats.dom );

				controls = new OrbitControls( camera, renderer.domElement );
				controls.minDistance = 50;
				controls.maxDistance = 300;

				window.addEventListener( 'resize', onWindowResize, false );

				var gui = new GUI();

				gui.add( params, 'envMap', [ 'Generated', 'LDR', 'HDR', 'RGBM16' ] );
				gui.add( params, 'roughness', 0, 1, 0.01 );
				gui.add( params, 'metalness', 0, 1, 0.01 );
				gui.add( params, 'exposure', 0, 2, 0.01 );
				gui.add( params, 'debug', false );
				gui.open();

			}

			function onWindowResize() {

				var width = window.innerWidth;
				var height = window.innerHeight;

				camera.aspect = width / height;
				camera.updateProjectionMatrix();

				renderer.setSize( width, height );

			}

			function animate() {

				requestAnimationFrame( animate );

				stats.begin();
				render();
				stats.end();

			}

			function render() {
                console.log(torusMesh.children[0].material)
				torusMesh.children[0].material.roughness = params.roughness;
				torusMesh.children[0].material.metalness = params.metalness;

				var renderTarget, cubeMap;

				switch ( params.envMap ) {

					case 'Generated':
						renderTarget = generatedCubeRenderTarget;
						cubeMap = generatedCubeRenderTarget.texture;
						break;
					case 'LDR':
						renderTarget = ldrCubeRenderTarget;
						cubeMap = ldrCubeMap;
						break;
					case 'HDR':
						renderTarget = hdrCubeRenderTarget;
						cubeMap = hdrCubeMap;
						break;
					case 'RGBM16':
						renderTarget = rgbmCubeRenderTarget;
						cubeMap = rgbmCubeMap;
						break;

				}

				var newEnvMap = renderTarget ? renderTarget.texture : null;

				if ( newEnvMap && newEnvMap !== torusMesh.children[0].material.envMap ) {

					torusMesh.children[0].material.envMap = newEnvMap;
					torusMesh.children[0].material.needsUpdate = true;

					planeMesh.material.map = newEnvMap;
					planeMesh.material.needsUpdate = true;

				}

				torusMesh.rotation.y += 0.005;
				planeMesh.visible = params.debug;

				scene.background = cubeMap;
				renderer.toneMappingExposure = params.exposure;

				renderer.render( scene, camera );

			}