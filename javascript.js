setTimeout(function() {
	document.getElementById("message").classList.add("fade");
}, 7000);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);  // field of view, camera aspect ratio, near clipping plane distance, far clipping plane distance

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// Cast shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;
// Append renderer
document.body.appendChild(renderer.domElement);

//- MATERIALS
var textureLoader = new THREE.TextureLoader();

var snowTexture = textureLoader.load("textures/Snow_001_SD/Snow_001_COLOR.jpg");
snowTexture.wrapS = THREE.RepeatWrapping;
snowTexture.wrapT = THREE.RepeatWrapping;
snowTexture.repeat.set(600, 600);
snowTexture.anisotropy = 4;
var snowBumpMap = textureLoader.load("textures/Snow_001_SD/Snow_001_DISP.png");
snowBumpMap.wrapS = THREE.RepeatWrapping;
snowBumpMap.wrapT = THREE.RepeatWrapping;
var snowNormalMap = textureLoader.load("textures/Snow_001_SD/Snow_001_NORM.jpg");
snowNormalMap.wrapS = THREE.RepeatWrapping;
snowNormalMap.wrapT = THREE.RepeatWrapping;
var snowMaterial = new THREE.MeshPhongMaterial({color: 0xc9d4ff,map: snowTexture, bumpMap: snowBumpMap, normalMap: snowNormalMap});

var tilesTexture = textureLoader.load("textures/Tiles_011_SD/Tiles_011_COLOR.jpg");
tilesTexture.wrapS = THREE.RepeatWrapping;
tilesTexture.wrapT = THREE.RepeatWrapping;
tilesTexture.repeat.set(1, 1);
tilesTexture.anisotropy = 2;
var tilesBumpMap = textureLoader.load("textures/Tiles_011_SD/Tiles_011_DISP.png");
tilesBumpMap.wrapS = THREE.RepeatWrapping;
tilesBumpMap.wrapT = THREE.RepeatWrapping;
var tilesNormalMap = textureLoader.load("textures/Tiles_011_SD/Tiles_011_NORM.jpg");
tilesNormalMap.wrapS = THREE.RepeatWrapping;
tilesNormalMap.wrapT = THREE.RepeatWrapping;
var tilesMaterial = new THREE.MeshPhongMaterial({map: tilesTexture, bumpMap: tilesBumpMap, normalMap: tilesNormalMap});

var metalTexture = textureLoader.load("textures/Metal_grunge_001/Metal_grunge_001_COLOR.jpg");
metalTexture.wrapS = THREE.RepeatWrapping;
metalTexture.wrapT = THREE.RepeatWrapping;
metalTexture.repeat.set(2, 2);
metalTexture.anisotropy = 0;
var metalBumpMap = textureLoader.load("textures/Metal_grunge_001/Metal_grunge_001_DISP.jpg");
metalBumpMap.wrapS = THREE.RepeatWrapping;
metalBumpMap.wrapT = THREE.RepeatWrapping;
var metalNormalMap = textureLoader.load("textures/Metal_grunge_001/Metal_grunge_001_NORM.jpg");
metalNormalMap.wrapS = THREE.RepeatWrapping;
metalNormalMap.wrapT = THREE.RepeatWrapping;
var metalMaterial = new THREE.MeshPhongMaterial({map: metalTexture, bumpMap: metalBumpMap, normalMap: metalNormalMap});

var metalPaintedTexture = textureLoader.load("textures/Metal_Painted_001_SD/Metal_Painted_001_COLOR.jpg");
metalPaintedTexture.wrapS = THREE.RepeatWrapping;
metalPaintedTexture.wrapT = THREE.RepeatWrapping;
metalPaintedTexture.repeat.set(4, 4);
metalPaintedTexture.anisotropy = 1;
var metalPaintedBumpMap = textureLoader.load("textures/Metal_Painted_001_SD/Metal_Painted_001_DISP.png");
metalPaintedBumpMap.wrapS = THREE.RepeatWrapping;
metalPaintedBumpMap.wrapT = THREE.RepeatWrapping;
var metalPaintedNormalMap = textureLoader.load("textures/Metal_Painted_001_SD/Metal_Painted_001_NORM.jpg");
metalPaintedNormalMap.wrapS = THREE.RepeatWrapping;
metalPaintedNormalMap.wrapT = THREE.RepeatWrapping;
var metalPaintedMaterial = new THREE.MeshPhongMaterial({color: 0xffffff, specular: 0xe7f2fd, shininess: 8, map: metalPaintedTexture, bumpMap: metalPaintedBumpMap, normalMap: metalPaintedNormalMap, side: THREE.DoubleSide});
var metalPaintedMaterial2 = new THREE.MeshPhongMaterial({color: 0xfcfdd9, specular: 0xfff397, shininess: 8, map: metalPaintedTexture, bumpMap: metalPaintedBumpMap, normalMap: metalPaintedNormalMap, side: THREE.DoubleSide});
var metalPaintedMaterial3 = new THREE.MeshPhongMaterial({color: 0x323328, specular: 0xb5a841, shininess: 8, map: metalPaintedTexture, bumpMap: metalPaintedBumpMap, normalMap: metalPaintedNormalMap, side: THREE.DoubleSide});

//- MODELS
/*var mtlLoader = new THREE.MTLLoader();
mtlLoader.setPath("/models/");
var objLoader = new THREE.OBJLoader();
objLoader.setPath("/models/");

mtlLoader.load("atw/atw.mtl", function(materials) {
	materials.preload();
	objLoader.setMaterials(materials);
	objLoader.load("atw/atw.obj", function(mesh) {
		
		mesh.traverse(function(node) {
			node.castShadow = true;
			node.receiveShadow = false;
			if (node instanceof THREE.Mesh) {
            	node.material = metalPaintedMaterial;
				node.position.set(1, 1, 1);
        	}
			console.log(node);
		})
		
		scene.add(mesh);
		mesh.position.set(5, 0, 0);
		mesh.scale.set(0.001, 0.001, 0.001);
	})
})*/

//- ELEMENTS
var geometry = new THREE.PlaneGeometry(700, 700, 1);
var ground = new THREE.Mesh(geometry, snowMaterial);
ground.receiveShadow = true;
ground.position.set(0, 0, 0);
ground.rotateX(-Math.PI / 2);
scene.add(ground);

geometry = new THREE.PlaneGeometry(900, 900, 1);
var farPlane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());  // Used as raytracing target to aim the head fo the walker.
farPlane.material.transparent = true;
farPlane.material.opacity = 0;
farPlane.position.set(0, 0, -600);
//ground.rotateX(-Math.PI / 2);
scene.add(farPlane);

//- AT-AT WALKER
//  Body
var length = 0.8, width = 1.6;
var shape = new THREE.Shape();
shape.moveTo(0, 0);
shape.lineTo(0, width);
shape.lineTo(length, width);
shape.lineTo(length, 0);
shape.lineTo(0, 0);

var extrudeSettings = {
	steps: 1,
	depth: 1.4,
	bevelEnabled: true,
	bevelThickness: 0.1,
	bevelSize: 0.2,
	bevelSegments: 1
};

var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
var body1 = new THREE.Mesh(geometry, metalPaintedMaterial);
body1.position.set(0, 3.2, 0);
scene.add(body1);
//  -
var length = 0.6, width = 1.2;
var shape = new THREE.Shape();
shape.moveTo(0, 0);
shape.lineTo(0, width);
shape.lineTo(length, width);
shape.lineTo(length, 0);
shape.lineTo(0, 0);

var extrudeSettings = {
	steps: 1,
	depth: 1.4,
	bevelEnabled: true,
	bevelThickness: 1.4,
	bevelSize: 0.3,
	bevelSegments: 1
};

var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
var body2 = new THREE.Mesh(geometry, metalPaintedMaterial);
body2.position.set(0.1, 0.1, 0);
body1.add(body2);
//  -
var geometry = new THREE.CylinderGeometry(0.2, 0.2, 3.2, 20);
var body3 = new THREE.Mesh(geometry, metalPaintedMaterial);
body3.position.set(0.4, -0.1, 1);
body3.rotation.set(Math.PI / 2, 0, 0);
body1.add(body3);

//  Neck
var NECK_RADIUS = 0.2;
var NECK_LENGTH = 1.8;
var neckGeometry = new THREE.CylinderGeometry(NECK_RADIUS, NECK_RADIUS, NECK_LENGTH, 20);
var neck = new THREE.Mesh(neckGeometry, metalPaintedMaterial);
neck.position.set(0.4, 0.5, -1.2);
neck.rotation.set(Math.PI / 2, Math.PI / 2, 0);
body1.add(neck);

//  Head
var geometry = new THREE.BoxGeometry(0.7, 0.9, 0.9);
var head1 = new THREE.Mesh(geometry, metalPaintedMaterial);
head1.position.set(0, -NECK_LENGTH / 2 - 0.3, 0);
head1.rotation.set(0, 0, 0);
neck.add(head1);
//  -
var geometry = new THREE.BoxGeometry(0.7, 1.1, 0.9);
var head2 = new THREE.Mesh(geometry, metalPaintedMaterial);
head2.position.set(-0.08, -0.2, 0);
head2.rotation.set(0, 0, -0.1);
head1.add(head2);

//  Cannons
var geometry = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 4);
var cannon1 = new THREE.Mesh(geometry, metalPaintedMaterial);
cannon1.position.set(-0.3, -0.3, -0.47);
cannon1.rotation.set(0, 0, 0);
head1.add(cannon1);
//  -
var geometry = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 4);
var cannon2 = new THREE.Mesh(geometry, metalPaintedMaterial);
cannon2.position.set(-0.3, -0.3, 0.47);
cannon2.rotation.set(0, 0, 0);
head1.add(cannon2);

//  Hips
var HIP_RADIUS = 0.2;
var HIP_WIDTH = 0.1;
var hipGeometry = new THREE.CylinderGeometry(HIP_RADIUS, HIP_RADIUS, HIP_WIDTH, 20);

var hipRR = new THREE.Mesh(hipGeometry, metalPaintedMaterial);
hipRR.position.set(0.7, -0.1, 1.9);
hipRR.rotation.set(0, 0, Math.PI / 2);
body1.add(hipRR);

var hipRL = new THREE.Mesh(hipGeometry, metalPaintedMaterial);
hipRL.position.set(0.1, -0.1, 1.9);
hipRL.rotation.set(0, 0, Math.PI / 2);
body1.add(hipRL);

var hipFR = new THREE.Mesh(hipGeometry, metalPaintedMaterial);
hipFR.position.set(0.7, -0.1, -0.5);
hipFR.rotation.set(0, 0, Math.PI / 2);
body1.add(hipFR);

var hipFL = new THREE.Mesh(hipGeometry, metalPaintedMaterial);
hipFL.position.set(0.1, -0.1, -0.5);
hipFL.rotation.set(0, 0, Math.PI / 2);
body1.add(hipFL);

//  Legs - Rotates around Y.
var legRR = new THREE.Mesh(hipGeometry, metalPaintedMaterial);
legRR.position.set(0.0, -0.1, 0);
legRR.rotation.set(0, 0, 0);
hipRR.add(legRR);

var legRL = new THREE.Mesh(hipGeometry, metalPaintedMaterial);
legRL.position.set(0.0, 0.1, 0);
legRL.rotation.set(0, 0, 0);
hipRL.add(legRL);

var legFR = new THREE.Mesh(hipGeometry, metalPaintedMaterial);
legFR.position.set(0.0, -0.1, 0);
legFR.rotation.set(0, 0, 0);
hipFR.add(legFR);

var legFL = new THREE.Mesh(hipGeometry, metalPaintedMaterial);
legFL.position.set(0.0, 0.1, 0);
legFL.rotation.set(0, 0, 0);
hipFL.add(legFL);

//  Bones1
var TOP_LEG_LENGTH = 1.5;
var BONE1_LENGTH = TOP_LEG_LENGTH / 2;
var bone1Geometry = new THREE.BoxGeometry(BONE1_LENGTH, HIP_WIDTH, HIP_RADIUS * 2);

var boneRR1 = new THREE.Mesh(bone1Geometry, metalPaintedMaterial);
boneRR1.position.set(-BONE1_LENGTH / 2, 0, 0);
legRR.add(boneRR1);

var boneRL1 = new THREE.Mesh(bone1Geometry, metalPaintedMaterial);
boneRL1.position.set(-BONE1_LENGTH / 2, 0, 0);
legRL.add(boneRL1);

var boneFR1 = new THREE.Mesh(bone1Geometry, metalPaintedMaterial);
boneFR1.position.set(-BONE1_LENGTH / 2, 0, 0);
legFR.add(boneFR1);

var boneFL1 = new THREE.Mesh(bone1Geometry, metalPaintedMaterial);
boneFL1.position.set(-BONE1_LENGTH / 2, 0, 0);
legFL.add(boneFL1);

//  Bones2 - Extends along X, negative values.
var BONE2_FLEX_EXTENSION = 0.2
var BONE2_LENGTH = TOP_LEG_LENGTH / 2 + BONE2_FLEX_EXTENSION;
var bone2Geometry = new THREE.BoxGeometry(BONE2_LENGTH, HIP_WIDTH - 0.02, HIP_RADIUS * 2 - 0.05);

var boneRR2 = new THREE.Mesh(bone2Geometry, metalPaintedMaterial);
boneRR2.position.set(-BONE1_LENGTH / 2 - BONE2_LENGTH + BONE2_FLEX_EXTENSION * 2, 0, 0);
legRR.add(boneRR2);

var boneRL2 = new THREE.Mesh(bone2Geometry, metalPaintedMaterial);
boneRL2.position.set(-BONE1_LENGTH / 2 - BONE2_LENGTH + BONE2_FLEX_EXTENSION * 2, 0, 0);
legRL.add(boneRL2);

var boneFR2 = new THREE.Mesh(bone2Geometry, metalPaintedMaterial);
boneFR2.position.set(-BONE1_LENGTH / 2 - BONE2_LENGTH + BONE2_FLEX_EXTENSION * 2, 0, 0);
legFR.add(boneFR2);

var boneFL2 = new THREE.Mesh(bone2Geometry, metalPaintedMaterial);
boneFL2.position.set(-BONE1_LENGTH / 2 - BONE2_LENGTH + BONE2_FLEX_EXTENSION * 2, 0, 0);
legFL.add(boneFL2);

//  Knees - Rotates around Y.
var kneeGeometry = new THREE.CylinderGeometry(HIP_RADIUS, HIP_RADIUS, HIP_WIDTH + 0.05, 20);

var kneeRR = new THREE.Mesh(kneeGeometry, metalPaintedMaterial);
kneeRR.position.set(-BONE2_LENGTH / 2, 0, 0);
kneeRR.rotation.set(0, 0, 0);
boneRR2.add(kneeRR);

var kneeRL = new THREE.Mesh(kneeGeometry, metalPaintedMaterial);
kneeRL.position.set(-BONE2_LENGTH / 2, 0, 0);
kneeRL.rotation.set(0, 0, 0);
boneRL2.add(kneeRL);

var kneeFR = new THREE.Mesh(kneeGeometry, metalPaintedMaterial);
kneeFR.position.set(-BONE2_LENGTH / 2, 0, 0);
kneeFR.rotation.set(0, 0, 0);
boneFR2.add(kneeFR);

var kneeFL = new THREE.Mesh(kneeGeometry, metalPaintedMaterial);
kneeFL.position.set(-BONE2_LENGTH / 2, 0, 0);
kneeFL.rotation.set(0, 0, 0);
boneFL2.add(kneeFL);

//  Bones3
var BOTTOM_LEG_LENGTH = 1.1;
var BONE3_LENGTH = BOTTOM_LEG_LENGTH;
var bone3Geometry = new THREE.BoxGeometry(BONE3_LENGTH, HIP_WIDTH, HIP_RADIUS * 2);

var boneRR3 = new THREE.Mesh(bone3Geometry, metalPaintedMaterial);
boneRR3.position.set(-BONE3_LENGTH / 2, 0, 0);
kneeRR.add(boneRR3);

var boneRL3 = new THREE.Mesh(bone3Geometry, metalPaintedMaterial);
boneRL3.position.set(-BONE3_LENGTH / 2, 0, 0);
kneeRL.add(boneRL3);

var boneFR3 = new THREE.Mesh(bone3Geometry, metalPaintedMaterial);
boneFR3.position.set(-BONE3_LENGTH / 2, 0, 0);
kneeFR.add(boneFR3);

var boneFL3 = new THREE.Mesh(bone3Geometry, metalPaintedMaterial);
boneFL3.position.set(-BONE3_LENGTH / 2, 0, 0);
kneeFL.add(boneFL3);

//  Ankles - Rotates around Z.
var ankleGeometry = new THREE.TorusBufferGeometry(HIP_RADIUS + 0.05, 0.05, 4, 16);

var ankleRR = new THREE.Mesh(ankleGeometry, metalPaintedMaterial);
ankleRR.position.set(-BONE3_LENGTH / 2 - HIP_RADIUS / 2, 0, 0);
ankleRR.rotation.set(Math.PI / 2, 0, 0);
boneRR3.add(ankleRR);

var ankleRL = new THREE.Mesh(ankleGeometry, metalPaintedMaterial);
ankleRL.position.set(-BONE3_LENGTH / 2 - HIP_RADIUS / 2, 0, 0);
ankleRL.rotation.set(Math.PI / 2, 0, 0);
boneRL3.add(ankleRL);

var ankleFR = new THREE.Mesh(ankleGeometry, metalPaintedMaterial);
ankleFR.position.set(-BONE3_LENGTH / 2 - HIP_RADIUS / 2, 0, 0);
ankleFR.rotation.set(Math.PI / 2, 0, 0);
boneFR3.add(ankleFR);

var ankleFL = new THREE.Mesh(ankleGeometry, metalPaintedMaterial);
ankleFL.position.set(-BONE3_LENGTH / 2 - HIP_RADIUS / 2, 0, 0);
ankleFL.rotation.set(Math.PI / 2, 0, 0);
boneFL3.add(ankleFL);

//  Feets
var FOOT_RADIUS = 0.25;
var FOOT_HEIGHT = 0.5;
var footGeometry = new THREE.CylinderGeometry(FOOT_RADIUS, FOOT_RADIUS, FOOT_HEIGHT, 20);

var footRR = new THREE.Mesh(footGeometry, metalPaintedMaterial);
footRR.position.set(-FOOT_HEIGHT / 2, 0, 0);
footRR.rotation.set(0, 0, Math.PI / 2);
ankleRR.add(footRR);

var footRL = new THREE.Mesh(footGeometry, metalPaintedMaterial);
footRL.position.set(-FOOT_HEIGHT / 2, 0, 0);
footRL.rotation.set(0, 0, Math.PI / 2);
ankleRL.add(footRL);

var footFR = new THREE.Mesh(footGeometry, metalPaintedMaterial);
footFR.position.set(-FOOT_HEIGHT / 2, 0, 0);
footFR.rotation.set(0, 0, Math.PI / 2);
ankleFR.add(footFR);

var footFL = new THREE.Mesh(footGeometry, metalPaintedMaterial);
footFL.position.set(-FOOT_HEIGHT / 2, 0, 0);
footFL.rotation.set(0, 0, Math.PI / 2);
ankleFL.add(footFL);

//  Hooves
var HOOF_RADIUS = 0.38;
var HOOF_HEIGHT = FOOT_HEIGHT / 2;
var hoofGeometry = new THREE.CylinderGeometry(HOOF_RADIUS, HOOF_RADIUS, HOOF_HEIGHT, 20);

var hoofRR = new THREE.Mesh(hoofGeometry, metalPaintedMaterial);
hoofRR.position.set(0, HOOF_HEIGHT / 2, 0);
hoofRR.rotation.set(0, 0, 0);
footRR.add(hoofRR);

var hoofRL = new THREE.Mesh(hoofGeometry, metalPaintedMaterial);
hoofRL.position.set(0, HOOF_HEIGHT / 2, 0);
hoofRL.rotation.set(0, 0, 0);
footRL.add(hoofRL);

var hoofFR = new THREE.Mesh(hoofGeometry, metalPaintedMaterial);
hoofFR.position.set(0, HOOF_HEIGHT / 2, 0);
hoofFR.rotation.set(0, 0, 0);
footFR.add(hoofFR);

var hoofFL = new THREE.Mesh(hoofGeometry, metalPaintedMaterial);
hoofFL.position.set(0, HOOF_HEIGHT / 2, 0);
hoofFL.rotation.set(0, 0, 0);
footFL.add(hoofFL);

body1.castShadow = true;
body2.castShadow = true;
boneRR1.castShadow = true;
boneRL1.castShadow = true;
boneFR1.castShadow = true;
boneFL1.castShadow = true;
boneRR2.castShadow = true;
boneRL2.castShadow = true;
boneFR2.castShadow = true;
boneFL2.castShadow = true;;
boneRR3.castShadow = true;
boneRL3.castShadow = true;
boneFR3.castShadow = true;
boneFL3.castShadow = true;
hoofRR.castShadow = true;
hoofRL.castShadow = true;
hoofFR.castShadow = true;
hoofFL.castShadow = true;
neck.castShadow = true;
head1.castShadow = true;
head2.castShadow = true;

function setPos(bf,   bh,   ba,   h1,   h2,   h3,   h4,   k1,   k2,   k3,   k4,   l1,   l2,   l3,   l4,   f1,   f2,   f3,   f4,   a1,   a2,   a3,   a4) {
	body1.position.set(body1.position.x, 3.2 + bh, body1.position.z);
	body1.rotation.set(0, ba, 0);
	legRR.rotation.set(0, -Math.PI / 180 * h1, 0);
	legRL.rotation.set(0, -Math.PI / 180 * h2, 0);
	legFR.rotation.set(0, -Math.PI / 180 * h3, 0);
	legFL.rotation.set(0, -Math.PI / 180 * h4, 0);
	kneeRR.rotation.set(0, -Math.PI / 180 * k1, 0);
	kneeRL.rotation.set(0, -Math.PI / 180 * k2, 0);
	kneeFR.rotation.set(0, -Math.PI / 180 * k3, 0);
	kneeFL.rotation.set(0, -Math.PI / 180 * k4, 0);
	boneRR2.position.set(-BONE1_LENGTH / 2 - BONE2_LENGTH + BONE2_FLEX_EXTENSION * 2 - l1, 0, 0);
	boneRL2.position.set(-BONE1_LENGTH / 2 - BONE2_LENGTH + BONE2_FLEX_EXTENSION * 2 - l2, 0, 0);
	boneFR2.position.set(-BONE1_LENGTH / 2 - BONE2_LENGTH + BONE2_FLEX_EXTENSION * 2 - l3, 0, 0);
	boneFL2.position.set(-BONE1_LENGTH / 2 - BONE2_LENGTH + BONE2_FLEX_EXTENSION * 2 - l4, 0, 0);
	hoofRR.position.set(0, HOOF_HEIGHT / 2 + f1, 0);
	hoofRL.position.set(0, HOOF_HEIGHT / 2 + f2, 0);
	hoofFR.position.set(0, HOOF_HEIGHT / 2 + f3, 0);
	hoofFL.position.set(0, HOOF_HEIGHT / 2 + f4, 0);
	ankleRR.rotation.set(Math.PI / 2, 0, Math.PI / 180 * a1);
	ankleRL.rotation.set(Math.PI / 2, 0, Math.PI / 180 * a2);
	ankleFR.rotation.set(Math.PI / 2, 0, Math.PI / 180 * a3);
	ankleFL.rotation.set(Math.PI / 2, 0, Math.PI / 180 * a4);
};

function setPos_2(bf,   bh,   ba,   h1,   h2,   h3,   h4,   k1,   k2,   k3,   k4,   l1,   l2,   l3,   l4,   f1,   f2,   f3,   f4,   a1,   a2,   a3,   a4) {
	body1_2.position.set(body1_2.position.x, 3.2 + bh, body1_2.position.z);
	body1_2.rotation.set(0, ba, 0);
	legRR_2.rotation.set(0, -Math.PI / 180 * h1, 0);
	legRL_2.rotation.set(0, -Math.PI / 180 * h2, 0);
	legFR_2.rotation.set(0, -Math.PI / 180 * h3, 0);
	legFL_2.rotation.set(0, -Math.PI / 180 * h4, 0);
	kneeRR_2.rotation.set(0, -Math.PI / 180 * k1, 0);
	kneeRL_2.rotation.set(0, -Math.PI / 180 * k2, 0);
	kneeFR_2.rotation.set(0, -Math.PI / 180 * k3, 0);
	kneeFL_2.rotation.set(0, -Math.PI / 180 * k4, 0);
	boneRR2_2.position.set(-BONE1_LENGTH / 2 - BONE2_LENGTH + BONE2_FLEX_EXTENSION * 2 - l1, 0, 0);
	boneRL2_2.position.set(-BONE1_LENGTH / 2 - BONE2_LENGTH + BONE2_FLEX_EXTENSION * 2 - l2, 0, 0);
	boneFR2_2.position.set(-BONE1_LENGTH / 2 - BONE2_LENGTH + BONE2_FLEX_EXTENSION * 2 - l3, 0, 0);
	boneFL2_2.position.set(-BONE1_LENGTH / 2 - BONE2_LENGTH + BONE2_FLEX_EXTENSION * 2 - l4, 0, 0);
	hoofRR_2.position.set(0, HOOF_HEIGHT / 2 + f1, 0);
	hoofRL_2.position.set(0, HOOF_HEIGHT / 2 + f2, 0);
	hoofFR_2.position.set(0, HOOF_HEIGHT / 2 + f3, 0);
	hoofFL_2.position.set(0, HOOF_HEIGHT / 2 + f4, 0);
	ankleRR_2.rotation.set(Math.PI / 2, 0, Math.PI / 180 * a1);
	ankleRL_2.rotation.set(Math.PI / 2, 0, Math.PI / 180 * a2);
	ankleFR_2.rotation.set(Math.PI / 2, 0, Math.PI / 180 * a3);
	ankleFL_2.rotation.set(Math.PI / 2, 0, Math.PI / 180 * a4);
};

function setPos_3(bf,   bh,   ba,   h1,   h2,   h3,   h4,   k1,   k2,   k3,   k4,   l1,   l2,   l3,   l4,   f1,   f2,   f3,   f4,   a1,   a2,   a3,   a4) {
	body1_3.position.set(body1_3.position.x, 3.2 + bh, body1_3.position.z);
	body1_3.rotation.set(0, ba, 0);
	legRR_3.rotation.set(0, -Math.PI / 180 * h1, 0);
	legRL_3.rotation.set(0, -Math.PI / 180 * h2, 0);
	legFR_3.rotation.set(0, -Math.PI / 180 * h3, 0);
	legFL_3.rotation.set(0, -Math.PI / 180 * h4, 0);
	kneeRR_3.rotation.set(0, -Math.PI / 180 * k1, 0);
	kneeRL_3.rotation.set(0, -Math.PI / 180 * k2, 0);
	kneeFR_3.rotation.set(0, -Math.PI / 180 * k3, 0);
	kneeFL_3.rotation.set(0, -Math.PI / 180 * k4, 0);
	boneRR2_3.position.set(-BONE1_LENGTH / 2 - BONE2_LENGTH + BONE2_FLEX_EXTENSION * 2 - l1, 0, 0);
	boneRL2_3.position.set(-BONE1_LENGTH / 2 - BONE2_LENGTH + BONE2_FLEX_EXTENSION * 2 - l2, 0, 0);
	boneFR2_3.position.set(-BONE1_LENGTH / 2 - BONE2_LENGTH + BONE2_FLEX_EXTENSION * 2 - l3, 0, 0);
	boneFL2_3.position.set(-BONE1_LENGTH / 2 - BONE2_LENGTH + BONE2_FLEX_EXTENSION * 2 - l4, 0, 0);
	hoofRR_3.position.set(0, HOOF_HEIGHT / 2 + f1, 0);
	hoofRL_3.position.set(0, HOOF_HEIGHT / 2 + f2, 0);
	hoofFR_3.position.set(0, HOOF_HEIGHT / 2 + f3, 0);
	hoofFL_3.position.set(0, HOOF_HEIGHT / 2 + f4, 0);
	ankleRR_3.rotation.set(Math.PI / 2, 0, Math.PI / 180 * a1);
	ankleRL_3.rotation.set(Math.PI / 2, 0, Math.PI / 180 * a2);
	ankleFR_3.rotation.set(Math.PI / 2, 0, Math.PI / 180 * a3);
	ankleFL_3.rotation.set(Math.PI / 2, 0, Math.PI / 180 * a4);
};

/*var atat2 = body1.clone();
atat2.position.set(22, 3.2, -3.5);
scene.add(atat2);*/

/*var atat3 = body1.clone();
atat3.position.set(-10, 3.2, 4);
scene.add(atat3);*/



	//- AT-AT WALKER 2
	//  Body
	var length = 0.8, width = 1.6;
	var shape = new THREE.Shape();
	shape.moveTo(0, 0);
	shape.lineTo(0, width);
	shape.lineTo(length, width);
	shape.lineTo(length, 0);
	shape.lineTo(0, 0);

	var extrudeSettings = {
		steps: 1,
		depth: 1.4,
		bevelEnabled: true,
		bevelThickness: 0.1,
		bevelSize: 0.2,
		bevelSegments: 1
	};

	var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
	var body1_2 = new THREE.Mesh(geometry, metalPaintedMaterial);
	body1_2.position.set(-10, 3.2, 4);
	scene.add(body1_2);
	//  -
	var length = 0.6, width = 1.2;
	var shape = new THREE.Shape();
	shape.moveTo(0, 0);
	shape.lineTo(0, width);
	shape.lineTo(length, width);
	shape.lineTo(length, 0);
	shape.lineTo(0, 0);

	var extrudeSettings = {
		steps: 1,
		depth: 1.4,
		bevelEnabled: true,
		bevelThickness: 1.4,
		bevelSize: 0.3,
		bevelSegments: 1
	};

	var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
	var body2_2 = new THREE.Mesh(geometry, metalPaintedMaterial);
	body2_2.position.set(0.1, 0.1, 0);
	body1_2.add(body2_2);
	//  -
	var geometry = new THREE.CylinderGeometry(0.2, 0.2, 3.2, 20);
	var body3_2 = new THREE.Mesh(geometry, metalPaintedMaterial);
	body3_2.position.set(0.4, -0.1, 1);
	body3_2.rotation.set(Math.PI / 2, 0, 0);
	body1_2.add(body3_2);

	//  Neck
	var NECK_RADIUS = 0.2;
	var NECK_LENGTH = 1.8;
	var neckGeometry = new THREE.CylinderGeometry(NECK_RADIUS, NECK_RADIUS, NECK_LENGTH, 20);
	var neck_2 = new THREE.Mesh(neckGeometry, metalPaintedMaterial);
	neck_2.position.set(0.4, 0.5, -1.2);
	neck_2.rotation.set(Math.PI / 2, Math.PI / 2, 0);
	body1_2.add(neck_2);

	//  Head
	var geometry = new THREE.BoxGeometry(0.7, 0.9, 0.9);
	var head1_2 = new THREE.Mesh(geometry, metalPaintedMaterial);
	head1_2.position.set(0, -NECK_LENGTH / 2 - 0.3, 0);
	head1_2.rotation.set(0, 0, 0);
	neck_2.add(head1_2);
	//  -
	var geometry = new THREE.BoxGeometry(0.7, 1.1, 0.9);
	var head2_2 = new THREE.Mesh(geometry, metalPaintedMaterial);
	head2_2.position.set(-0.08, -0.2, 0);
	head2_2.rotation.set(0, 0, -0.1);
	head1_2.add(head2_2);

	//  Cannons
	var geometry = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 4);
	var cannon1_2 = new THREE.Mesh(geometry, metalPaintedMaterial);
	cannon1_2.position.set(-0.3, -0.3, -0.47);
	cannon1_2.rotation.set(0, 0, 0);
	head1_2.add(cannon1_2);
	//  -
	var geometry = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 4);
	var cannon2_2 = new THREE.Mesh(geometry, metalPaintedMaterial);
	cannon2_2.position.set(-0.3, -0.3, 0.47);
	cannon2_2.rotation.set(0, 0, 0);
	head1_2.add(cannon2_2);

	//  Hips
	var HIP_RADIUS = 0.2;
	var HIP_WIDTH = 0.1;
	var hipGeometry = new THREE.CylinderGeometry(HIP_RADIUS, HIP_RADIUS, HIP_WIDTH, 20);

	var hipRR_2 = new THREE.Mesh(hipGeometry, metalPaintedMaterial);
	hipRR_2.position.set(0.7, -0.1, 1.9);
	hipRR_2.rotation.set(0, 0, Math.PI / 2);
	body1_2.add(hipRR_2);

	var hipRL_2 = new THREE.Mesh(hipGeometry, metalPaintedMaterial);
	hipRL_2.position.set(0.1, -0.1, 1.9);
	hipRL_2.rotation.set(0, 0, Math.PI / 2);
	body1_2.add(hipRL_2);

	var hipFR_2 = new THREE.Mesh(hipGeometry, metalPaintedMaterial);
	hipFR_2.position.set(0.7, -0.1, -0.5);
	hipFR_2.rotation.set(0, 0, Math.PI / 2);
	body1_2.add(hipFR_2);

	var hipFL_2 = new THREE.Mesh(hipGeometry, metalPaintedMaterial);
	hipFL_2.position.set(0.1, -0.1, -0.5);
	hipFL_2.rotation.set(0, 0, Math.PI / 2);
	body1_2.add(hipFL_2);

	//  Legs - Rotates around Y.
	var legRR_2 = new THREE.Mesh(hipGeometry, metalPaintedMaterial);
	legRR_2.position.set(0.0, -0.1, 0);
	legRR_2.rotation.set(0, 0, 0);
	hipRR_2.add(legRR_2);

	var legRL_2 = new THREE.Mesh(hipGeometry, metalPaintedMaterial);
	legRL_2.position.set(0.0, 0.1, 0);
	legRL_2.rotation.set(0, 0, 0);
	hipRL_2.add(legRL_2);

	var legFR_2 = new THREE.Mesh(hipGeometry, metalPaintedMaterial);
	legFR_2.position.set(0.0, -0.1, 0);
	legFR_2.rotation.set(0, 0, 0);
	hipFR_2.add(legFR_2);

	var legFL_2 = new THREE.Mesh(hipGeometry, metalPaintedMaterial);
	legFL_2.position.set(0.0, 0.1, 0);
	legFL_2.rotation.set(0, 0, 0);
	hipFL_2.add(legFL_2);

	//  Bones1
	var TOP_LEG_LENGTH = 1.5;
	var BONE1_LENGTH = TOP_LEG_LENGTH / 2;
	var bone1Geometry = new THREE.BoxGeometry(BONE1_LENGTH, HIP_WIDTH, HIP_RADIUS * 2);

	var boneRR1_2 = new THREE.Mesh(bone1Geometry, metalPaintedMaterial);
	boneRR1_2.position.set(-BONE1_LENGTH / 2, 0, 0);
	legRR_2.add(boneRR1_2);

	var boneRL1_2 = new THREE.Mesh(bone1Geometry, metalPaintedMaterial);
	boneRL1_2.position.set(-BONE1_LENGTH / 2, 0, 0);
	legRL_2.add(boneRL1_2);

	var boneFR1_2 = new THREE.Mesh(bone1Geometry, metalPaintedMaterial);
	boneFR1_2.position.set(-BONE1_LENGTH / 2, 0, 0);
	legFR_2.add(boneFR1_2);

	var boneFL1_2 = new THREE.Mesh(bone1Geometry, metalPaintedMaterial);
	boneFL1_2.position.set(-BONE1_LENGTH / 2, 0, 0);
	legFL_2.add(boneFL1_2);

	//  Bones2 - Extends along X, negative values.
	var BONE2_FLEX_EXTENSION = 0.2
	var BONE2_LENGTH = TOP_LEG_LENGTH / 2 + BONE2_FLEX_EXTENSION;
	var bone2Geometry = new THREE.BoxGeometry(BONE2_LENGTH, HIP_WIDTH - 0.02, HIP_RADIUS * 2 - 0.05);

	var boneRR2_2 = new THREE.Mesh(bone2Geometry, metalPaintedMaterial);
	boneRR2_2.position.set(-BONE1_LENGTH / 2 - BONE2_LENGTH + BONE2_FLEX_EXTENSION * 2, 0, 0);
	legRR_2.add(boneRR2_2);

	var boneRL2_2 = new THREE.Mesh(bone2Geometry, metalPaintedMaterial);
	boneRL2_2.position.set(-BONE1_LENGTH / 2 - BONE2_LENGTH + BONE2_FLEX_EXTENSION * 2, 0, 0);
	legRL_2.add(boneRL2_2);

	var boneFR2_2 = new THREE.Mesh(bone2Geometry, metalPaintedMaterial);
	boneFR2_2.position.set(-BONE1_LENGTH / 2 - BONE2_LENGTH + BONE2_FLEX_EXTENSION * 2, 0, 0);
	legFR_2.add(boneFR2_2);

	var boneFL2_2 = new THREE.Mesh(bone2Geometry, metalPaintedMaterial);
	boneFL2_2.position.set(-BONE1_LENGTH / 2 - BONE2_LENGTH + BONE2_FLEX_EXTENSION * 2, 0, 0);
	legFL_2.add(boneFL2_2);

	//  Knees - Rotates around Y.
	var kneeGeometry = new THREE.CylinderGeometry(HIP_RADIUS, HIP_RADIUS, HIP_WIDTH + 0.05, 20);

	var kneeRR_2 = new THREE.Mesh(kneeGeometry, metalPaintedMaterial);
	kneeRR_2.position.set(-BONE2_LENGTH / 2, 0, 0);
	kneeRR_2.rotation.set(0, 0, 0);
	boneRR2_2.add(kneeRR_2);

	var kneeRL_2 = new THREE.Mesh(kneeGeometry, metalPaintedMaterial);
	kneeRL_2.position.set(-BONE2_LENGTH / 2, 0, 0);
	kneeRL_2.rotation.set(0, 0, 0);
	boneRL2_2.add(kneeRL_2);

	var kneeFR_2 = new THREE.Mesh(kneeGeometry, metalPaintedMaterial);
	kneeFR_2.position.set(-BONE2_LENGTH / 2, 0, 0);
	kneeFR_2.rotation.set(0, 0, 0);
	boneFR2_2.add(kneeFR_2);

	var kneeFL_2 = new THREE.Mesh(kneeGeometry, metalPaintedMaterial);
	kneeFL_2.position.set(-BONE2_LENGTH / 2, 0, 0);
	kneeFL_2.rotation.set(0, 0, 0);
	boneFL2_2.add(kneeFL_2);

	//  Bones3
	var BOTTOM_LEG_LENGTH = 1.1;
	var BONE3_LENGTH = BOTTOM_LEG_LENGTH;
	var bone3Geometry = new THREE.BoxGeometry(BONE3_LENGTH, HIP_WIDTH, HIP_RADIUS * 2);

	var boneRR3_2 = new THREE.Mesh(bone3Geometry, metalPaintedMaterial);
	boneRR3_2.position.set(-BONE3_LENGTH / 2, 0, 0);
	kneeRR_2.add(boneRR3_2);

	var boneRL3_2 = new THREE.Mesh(bone3Geometry, metalPaintedMaterial);
	boneRL3_2.position.set(-BONE3_LENGTH / 2, 0, 0);
	kneeRL_2.add(boneRL3_2);

	var boneFR3_2 = new THREE.Mesh(bone3Geometry, metalPaintedMaterial);
	boneFR3_2.position.set(-BONE3_LENGTH / 2, 0, 0);
	kneeFR_2.add(boneFR3_2);

	var boneFL3_2 = new THREE.Mesh(bone3Geometry, metalPaintedMaterial);
	boneFL3_2.position.set(-BONE3_LENGTH / 2, 0, 0);
	kneeFL_2.add(boneFL3_2);

	//  Ankles - Rotates around Z.
	var ankleGeometry = new THREE.TorusBufferGeometry(HIP_RADIUS + 0.05, 0.05, 4, 16);

	var ankleRR_2 = new THREE.Mesh(ankleGeometry, metalPaintedMaterial);
	ankleRR_2.position.set(-BONE3_LENGTH / 2 - HIP_RADIUS / 2, 0, 0);
	ankleRR_2.rotation.set(Math.PI / 2, 0, 0);
	boneRR3_2.add(ankleRR_2);

	var ankleRL_2 = new THREE.Mesh(ankleGeometry, metalPaintedMaterial);
	ankleRL_2.position.set(-BONE3_LENGTH / 2 - HIP_RADIUS / 2, 0, 0);
	ankleRL_2.rotation.set(Math.PI / 2, 0, 0);
	boneRL3_2.add(ankleRL_2);

	var ankleFR_2 = new THREE.Mesh(ankleGeometry, metalPaintedMaterial);
	ankleFR_2.position.set(-BONE3_LENGTH / 2 - HIP_RADIUS / 2, 0, 0);
	ankleFR_2.rotation.set(Math.PI / 2, 0, 0);
	boneFR3_2.add(ankleFR_2);

	var ankleFL_2 = new THREE.Mesh(ankleGeometry, metalPaintedMaterial);
	ankleFL_2.position.set(-BONE3_LENGTH / 2 - HIP_RADIUS / 2, 0, 0);
	ankleFL_2.rotation.set(Math.PI / 2, 0, 0);
	boneFL3_2.add(ankleFL_2);

	//  Feets
	var FOOT_RADIUS = 0.25;
	var FOOT_HEIGHT = 0.5;
	var footGeometry = new THREE.CylinderGeometry(FOOT_RADIUS, FOOT_RADIUS, FOOT_HEIGHT, 20);

	var footRR_2 = new THREE.Mesh(footGeometry, metalPaintedMaterial);
	footRR_2.position.set(-FOOT_HEIGHT / 2, 0, 0);
	footRR_2.rotation.set(0, 0, Math.PI / 2);
	ankleRR_2.add(footRR_2);

	var footRL_2 = new THREE.Mesh(footGeometry, metalPaintedMaterial);
	footRL_2.position.set(-FOOT_HEIGHT / 2, 0, 0);
	footRL_2.rotation.set(0, 0, Math.PI / 2);
	ankleRL_2.add(footRL_2);

	var footFR_2 = new THREE.Mesh(footGeometry, metalPaintedMaterial);
	footFR_2.position.set(-FOOT_HEIGHT / 2, 0, 0);
	footFR_2.rotation.set(0, 0, Math.PI / 2);
	ankleFR_2.add(footFR_2);

	var footFL_2 = new THREE.Mesh(footGeometry, metalPaintedMaterial);
	footFL_2.position.set(-FOOT_HEIGHT / 2, 0, 0);
	footFL_2.rotation.set(0, 0, Math.PI / 2);
	ankleFL_2.add(footFL_2);

	//  Hooves
	var HOOF_RADIUS = 0.38;
	var HOOF_HEIGHT = FOOT_HEIGHT / 2;
	var hoofGeometry = new THREE.CylinderGeometry(HOOF_RADIUS, HOOF_RADIUS, HOOF_HEIGHT, 20);

	var hoofRR_2 = new THREE.Mesh(hoofGeometry, metalPaintedMaterial);
	hoofRR_2.position.set(0, HOOF_HEIGHT / 2, 0);
	hoofRR_2.rotation.set(0, 0, 0);
	footRR_2.add(hoofRR_2);

	var hoofRL_2 = new THREE.Mesh(hoofGeometry, metalPaintedMaterial);
	hoofRL_2.position.set(0, HOOF_HEIGHT / 2, 0);
	hoofRL_2.rotation.set(0, 0, 0);
	footRL_2.add(hoofRL_2);

	var hoofFR_2 = new THREE.Mesh(hoofGeometry, metalPaintedMaterial);
	hoofFR_2.position.set(0, HOOF_HEIGHT / 2, 0);
	hoofFR_2.rotation.set(0, 0, 0);
	footFR_2.add(hoofFR_2);

	var hoofFL_2 = new THREE.Mesh(hoofGeometry, metalPaintedMaterial);
	hoofFL_2.position.set(0, HOOF_HEIGHT / 2, 0);
	hoofFL_2.rotation.set(0, 0, 0);
	footFL_2.add(hoofFL_2);

	body1_2.castShadow = true;
body2_2.castShadow = true;
boneRR1_2.castShadow = true;
boneRL1_2.castShadow = true;
boneFR1_2.castShadow = true;
boneFL1_2.castShadow = true;
boneRR2_2.castShadow = true;
boneRL2_2.castShadow = true;
boneFR2_2.castShadow = true;
boneFL2_2.castShadow = true;;
boneRR3_2.castShadow = true;
boneRL3_2.castShadow = true;
boneFR3_2.castShadow = true;
boneFL3_2.castShadow = true;
hoofRR_2.castShadow = true;
hoofRL_2.castShadow = true;
hoofFR_2.castShadow = true;
hoofFL_2.castShadow = true;
neck_2.castShadow = true;
head1_2.castShadow = true;
head2_2.castShadow = true;






//- AT-AT WALKER 3
	//  Body
	var length = 0.8, width = 1.6;
	var shape = new THREE.Shape();
	shape.moveTo(0, 0);
	shape.lineTo(0, width);
	shape.lineTo(length, width);
	shape.lineTo(length, 0);
	shape.lineTo(0, 0);

	var extrudeSettings = {
		steps: 1,
		depth: 1.4,
		bevelEnabled: true,
		bevelThickness: 0.1,
		bevelSize: 0.2,
		bevelSegments: 1
	};

	var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
	var body1_3 = new THREE.Mesh(geometry, metalPaintedMaterial);
	body1_3.position.set(22, 3.2, -3.5);
	scene.add(body1_3);
	//  -
	var length = 0.6, width = 1.2;
	var shape = new THREE.Shape();
	shape.moveTo(0, 0);
	shape.lineTo(0, width);
	shape.lineTo(length, width);
	shape.lineTo(length, 0);
	shape.lineTo(0, 0);

	var extrudeSettings = {
		steps: 1,
		depth: 1.4,
		bevelEnabled: true,
		bevelThickness: 1.4,
		bevelSize: 0.3,
		bevelSegments: 1
	};

	var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
	var body2_3 = new THREE.Mesh(geometry, metalPaintedMaterial);
	body2_3.position.set(0.1, 0.1, 0);
	body1_3.add(body2_3);
	//  -
	var geometry = new THREE.CylinderGeometry(0.2, 0.2, 3.2, 20);
	var body3_3 = new THREE.Mesh(geometry, metalPaintedMaterial);
	body3_3.position.set(0.4, -0.1, 1);
	body3_3.rotation.set(Math.PI / 2, 0, 0);
	body1_3.add(body3_3);

	//  Neck
	var NECK_RADIUS = 0.2;
	var NECK_LENGTH = 1.8;
	var neckGeometry = new THREE.CylinderGeometry(NECK_RADIUS, NECK_RADIUS, NECK_LENGTH, 20);
	var neck_3 = new THREE.Mesh(neckGeometry, metalPaintedMaterial);
	neck_3.position.set(0.4, 0.5, -1.2);
	neck_3.rotation.set(Math.PI / 2, Math.PI / 2, 0);
	body1_3.add(neck_3);

	//  Head
	var geometry = new THREE.BoxGeometry(0.7, 0.9, 0.9);
	var head1_3 = new THREE.Mesh(geometry, metalPaintedMaterial);
	head1_3.position.set(0, -NECK_LENGTH / 2 - 0.3, 0);
	head1_3.rotation.set(0, 0, 0);
	neck_3.add(head1_3);
	//  -
	var geometry = new THREE.BoxGeometry(0.7, 1.1, 0.9);
	var head2_3 = new THREE.Mesh(geometry, metalPaintedMaterial);
	head2_3.position.set(-0.08, -0.2, 0);
	head2_3.rotation.set(0, 0, -0.1);
	head1_3.add(head2_3);

	//  Cannons
	var geometry = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 4);
	var cannon1_3 = new THREE.Mesh(geometry, metalPaintedMaterial);
	cannon1_3.position.set(-0.3, -0.3, -0.47);
	cannon1_3.rotation.set(0, 0, 0);
	head1_3.add(cannon1_3);
	//  -
	var geometry = new THREE.CylinderGeometry(0.05, 0.05, 1.2, 4);
	var cannon2_3 = new THREE.Mesh(geometry, metalPaintedMaterial);
	cannon2_3.position.set(-0.3, -0.3, 0.47);
	cannon2_3.rotation.set(0, 0, 0);
	head1_3.add(cannon2_3);

	//  Hips
	var HIP_RADIUS = 0.2;
	var HIP_WIDTH = 0.1;
	var hipGeometry = new THREE.CylinderGeometry(HIP_RADIUS, HIP_RADIUS, HIP_WIDTH, 20);

	var hipRR_3 = new THREE.Mesh(hipGeometry, metalPaintedMaterial);
	hipRR_3.position.set(0.7, -0.1, 1.9);
	hipRR_3.rotation.set(0, 0, Math.PI / 2);
	body1_3.add(hipRR_3);

	var hipRL_3 = new THREE.Mesh(hipGeometry, metalPaintedMaterial);
	hipRL_3.position.set(0.1, -0.1, 1.9);
	hipRL_3.rotation.set(0, 0, Math.PI / 2);
	body1_3.add(hipRL_3);

	var hipFR_3 = new THREE.Mesh(hipGeometry, metalPaintedMaterial);
	hipFR_3.position.set(0.7, -0.1, -0.5);
	hipFR_3.rotation.set(0, 0, Math.PI / 2);
	body1_3.add(hipFR_3);

	var hipFL_3 = new THREE.Mesh(hipGeometry, metalPaintedMaterial);
	hipFL_3.position.set(0.1, -0.1, -0.5);
	hipFL_3.rotation.set(0, 0, Math.PI / 2);
	body1_3.add(hipFL_3);

	//  Legs - Rotates around Y.
	var legRR_3 = new THREE.Mesh(hipGeometry, metalPaintedMaterial);
	legRR_3.position.set(0.0, -0.1, 0);
	legRR_3.rotation.set(0, 0, 0);
	hipRR_3.add(legRR_3);

	var legRL_3 = new THREE.Mesh(hipGeometry, metalPaintedMaterial);
	legRL_3.position.set(0.0, 0.1, 0);
	legRL_3.rotation.set(0, 0, 0);
	hipRL_3.add(legRL_3);

	var legFR_3 = new THREE.Mesh(hipGeometry, metalPaintedMaterial);
	legFR_3.position.set(0.0, -0.1, 0);
	legFR_3.rotation.set(0, 0, 0);
	hipFR_3.add(legFR_3);

	var legFL_3 = new THREE.Mesh(hipGeometry, metalPaintedMaterial);
	legFL_3.position.set(0.0, 0.1, 0);
	legFL_3.rotation.set(0, 0, 0);
	hipFL_3.add(legFL_3);

	//  Bones1
	var TOP_LEG_LENGTH = 1.5;
	var BONE1_LENGTH = TOP_LEG_LENGTH / 2;
	var bone1Geometry = new THREE.BoxGeometry(BONE1_LENGTH, HIP_WIDTH, HIP_RADIUS * 2);

	var boneRR1_3 = new THREE.Mesh(bone1Geometry, metalPaintedMaterial);
	boneRR1_3.position.set(-BONE1_LENGTH / 2, 0, 0);
	legRR_3.add(boneRR1_3);

	var boneRL1_3 = new THREE.Mesh(bone1Geometry, metalPaintedMaterial);
	boneRL1_3.position.set(-BONE1_LENGTH / 2, 0, 0);
	legRL_3.add(boneRL1_3);

	var boneFR1_3 = new THREE.Mesh(bone1Geometry, metalPaintedMaterial);
	boneFR1_3.position.set(-BONE1_LENGTH / 2, 0, 0);
	legFR_3.add(boneFR1_3);

	var boneFL1_3 = new THREE.Mesh(bone1Geometry, metalPaintedMaterial);
	boneFL1_3.position.set(-BONE1_LENGTH / 2, 0, 0);
	legFL_3.add(boneFL1_3);

	//  Bones2 - Extends along X, negative values.
	var BONE2_FLEX_EXTENSION = 0.2
	var BONE2_LENGTH = TOP_LEG_LENGTH / 2 + BONE2_FLEX_EXTENSION;
	var bone2Geometry = new THREE.BoxGeometry(BONE2_LENGTH, HIP_WIDTH - 0.02, HIP_RADIUS * 2 - 0.05);

	var boneRR2_3 = new THREE.Mesh(bone2Geometry, metalPaintedMaterial);
	boneRR2_3.position.set(-BONE1_LENGTH / 2 - BONE2_LENGTH + BONE2_FLEX_EXTENSION * 2, 0, 0);
	legRR_3.add(boneRR2_3);

	var boneRL2_3 = new THREE.Mesh(bone2Geometry, metalPaintedMaterial);
	boneRL2_3.position.set(-BONE1_LENGTH / 2 - BONE2_LENGTH + BONE2_FLEX_EXTENSION * 2, 0, 0);
	legRL_3.add(boneRL2_3);

	var boneFR2_3 = new THREE.Mesh(bone2Geometry, metalPaintedMaterial);
	boneFR2_3.position.set(-BONE1_LENGTH / 2 - BONE2_LENGTH + BONE2_FLEX_EXTENSION * 2, 0, 0);
	legFR_3.add(boneFR2_3);

	var boneFL2_3 = new THREE.Mesh(bone2Geometry, metalPaintedMaterial);
	boneFL2_3.position.set(-BONE1_LENGTH / 2 - BONE2_LENGTH + BONE2_FLEX_EXTENSION * 2, 0, 0);
	legFL_3.add(boneFL2_3);

	//  Knees - Rotates around Y.
	var kneeGeometry = new THREE.CylinderGeometry(HIP_RADIUS, HIP_RADIUS, HIP_WIDTH + 0.05, 20);

	var kneeRR_3 = new THREE.Mesh(kneeGeometry, metalPaintedMaterial);
	kneeRR_3.position.set(-BONE2_LENGTH / 2, 0, 0);
	kneeRR_3.rotation.set(0, 0, 0);
	boneRR2_3.add(kneeRR_3);

	var kneeRL_3 = new THREE.Mesh(kneeGeometry, metalPaintedMaterial);
	kneeRL_3.position.set(-BONE2_LENGTH / 2, 0, 0);
	kneeRL_3.rotation.set(0, 0, 0);
	boneRL2_3.add(kneeRL_3);

	var kneeFR_3 = new THREE.Mesh(kneeGeometry, metalPaintedMaterial);
	kneeFR_3.position.set(-BONE2_LENGTH / 2, 0, 0);
	kneeFR_3.rotation.set(0, 0, 0);
	boneFR2_3.add(kneeFR_3);

	var kneeFL_3 = new THREE.Mesh(kneeGeometry, metalPaintedMaterial);
	kneeFL_3.position.set(-BONE2_LENGTH / 2, 0, 0);
	kneeFL_3.rotation.set(0, 0, 0);
	boneFL2_3.add(kneeFL_3);

	//  Bones3
	var BOTTOM_LEG_LENGTH = 1.1;
	var BONE3_LENGTH = BOTTOM_LEG_LENGTH;
	var bone3Geometry = new THREE.BoxGeometry(BONE3_LENGTH, HIP_WIDTH, HIP_RADIUS * 2);

	var boneRR3_3 = new THREE.Mesh(bone3Geometry, metalPaintedMaterial);
	boneRR3_3.position.set(-BONE3_LENGTH / 2, 0, 0);
	kneeRR_3.add(boneRR3_3);

	var boneRL3_3 = new THREE.Mesh(bone3Geometry, metalPaintedMaterial);
	boneRL3_3.position.set(-BONE3_LENGTH / 2, 0, 0);
	kneeRL_3.add(boneRL3_3);

	var boneFR3_3 = new THREE.Mesh(bone3Geometry, metalPaintedMaterial);
	boneFR3_3.position.set(-BONE3_LENGTH / 2, 0, 0);
	kneeFR_3.add(boneFR3_3);

	var boneFL3_3 = new THREE.Mesh(bone3Geometry, metalPaintedMaterial);
	boneFL3_3.position.set(-BONE3_LENGTH / 2, 0, 0);
	kneeFL_3.add(boneFL3_3);

	//  Ankles - Rotates around Z.
	var ankleGeometry = new THREE.TorusBufferGeometry(HIP_RADIUS + 0.05, 0.05, 4, 16);

	var ankleRR_3 = new THREE.Mesh(ankleGeometry, metalPaintedMaterial);
	ankleRR_3.position.set(-BONE3_LENGTH / 2 - HIP_RADIUS / 2, 0, 0);
	ankleRR_3.rotation.set(Math.PI / 2, 0, 0);
	boneRR3_3.add(ankleRR_3);

	var ankleRL_3 = new THREE.Mesh(ankleGeometry, metalPaintedMaterial);
	ankleRL_3.position.set(-BONE3_LENGTH / 2 - HIP_RADIUS / 2, 0, 0);
	ankleRL_3.rotation.set(Math.PI / 2, 0, 0);
	boneRL3_3.add(ankleRL_3);

	var ankleFR_3 = new THREE.Mesh(ankleGeometry, metalPaintedMaterial);
	ankleFR_3.position.set(-BONE3_LENGTH / 2 - HIP_RADIUS / 2, 0, 0);
	ankleFR_3.rotation.set(Math.PI / 2, 0, 0);
	boneFR3_3.add(ankleFR_3);

	var ankleFL_3 = new THREE.Mesh(ankleGeometry, metalPaintedMaterial);
	ankleFL_3.position.set(-BONE3_LENGTH / 2 - HIP_RADIUS / 2, 0, 0);
	ankleFL_3.rotation.set(Math.PI / 2, 0, 0);
	boneFL3_3.add(ankleFL_3);

	//  Feets
	var FOOT_RADIUS = 0.25;
	var FOOT_HEIGHT = 0.5;
	var footGeometry = new THREE.CylinderGeometry(FOOT_RADIUS, FOOT_RADIUS, FOOT_HEIGHT, 20);

	var footRR_3 = new THREE.Mesh(footGeometry, metalPaintedMaterial);
	footRR_3.position.set(-FOOT_HEIGHT / 2, 0, 0);
	footRR_3.rotation.set(0, 0, Math.PI / 2);
	ankleRR_3.add(footRR_3);

	var footRL_3 = new THREE.Mesh(footGeometry, metalPaintedMaterial);
	footRL_3.position.set(-FOOT_HEIGHT / 2, 0, 0);
	footRL_3.rotation.set(0, 0, Math.PI / 2);
	ankleRL_3.add(footRL_3);

	var footFR_3 = new THREE.Mesh(footGeometry, metalPaintedMaterial);
	footFR_3.position.set(-FOOT_HEIGHT / 2, 0, 0);
	footFR_3.rotation.set(0, 0, Math.PI / 2);
	ankleFR_3.add(footFR_3);

	var footFL_3 = new THREE.Mesh(footGeometry, metalPaintedMaterial);
	footFL_3.position.set(-FOOT_HEIGHT / 2, 0, 0);
	footFL_3.rotation.set(0, 0, Math.PI / 2);
	ankleFL_3.add(footFL_3);

	//  Hooves
	var HOOF_RADIUS = 0.38;
	var HOOF_HEIGHT = FOOT_HEIGHT / 2;
	var hoofGeometry = new THREE.CylinderGeometry(HOOF_RADIUS, HOOF_RADIUS, HOOF_HEIGHT, 20);

	var hoofRR_3 = new THREE.Mesh(hoofGeometry, metalPaintedMaterial);
	hoofRR_3.position.set(0, HOOF_HEIGHT / 2, 0);
	hoofRR_3.rotation.set(0, 0, 0);
	footRR_3.add(hoofRR_3);

	var hoofRL_3 = new THREE.Mesh(hoofGeometry, metalPaintedMaterial);
	hoofRL_3.position.set(0, HOOF_HEIGHT / 2, 0);
	hoofRL_3.rotation.set(0, 0, 0);
	footRL_3.add(hoofRL_3);

	var hoofFR_3 = new THREE.Mesh(hoofGeometry, metalPaintedMaterial);
	hoofFR_3.position.set(0, HOOF_HEIGHT / 2, 0);
	hoofFR_3.rotation.set(0, 0, 0);
	footFR_3.add(hoofFR_3);

	var hoofFL_3 = new THREE.Mesh(hoofGeometry, metalPaintedMaterial);
	hoofFL_3.position.set(0, HOOF_HEIGHT / 2, 0);
	hoofFL_3.rotation.set(0, 0, 0);
	footFL_3.add(hoofFL_3);







//  Laser beam
var laserBaseGeometry = new THREE.BoxGeometry(1, 1, 1);
var laserBaseMaterial = new THREE.MeshBasicMaterial();
var laserGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 3);
var laserMaterial = new THREE.MeshLambertMaterial({color: 0xff6767, emissive: 0xff0000});
var lasers = {};
var laserIndex = 0;
var cannonIndex = 0;
var aimPoint = null;
function spawnLaser() {
	var laserBase = new THREE.Mesh(laserBaseGeometry, laserBaseMaterial);
	laserBase.material.transparent = true;
	laserBase.material.opacity = 0;
	scene.updateMatrixWorld(true);
	var position = new THREE.Vector3();
	if (cannonIndex == 0) {
		position.setFromMatrixPosition(cannon1.matrixWorld);
	} else {
		position.setFromMatrixPosition(cannon2.matrixWorld);
	}
	cannonIndex += 1;
	cannonIndex %= 2;
	laserBase.position.x = position.x;
	laserBase.position.y = position.y;
	laserBase.position.z = position.z;
	if (aimPoint != null) {
		laserBase.lookAt(aimPoint);
	}
	laserBase.rotateX(Math.PI / 2);
	//var laserLight = new THREE.PointLight(0xff0000, 0.05, 100);
	//laser.add(laserLight);
	scene.add(laserBase);
	var laser = new THREE.Mesh(laserGeometry, laserMaterial);
	laserBase.add(laser);
	lasers[laserIndex] = laser;
	laserIndex += 1;
	
	spawnAllyLaser();
}

var d = new Date();
var lastShoot = 0;
function shoot() {
	d = new Date();
	if (d.getTime() - lastShoot > 500) {
		spawnLaser();
		lastShoot = d.getTime();
	}
}

document.addEventListener("click", function() {
	shoot();
	spawnEnemyLaser();  // Adds to difficulty.
});


var turretts = []
var destroyedTurrets = []
var turrettsHits = []
function addTurretts(n, distance) {
	//- TURRETS
	for (var i = 0; i < n; i += 1) {
		var geometry = new THREE.CylinderGeometry(0.6, 0.6, 1.2, 8);
		var turrett = new THREE.Mesh(geometry, metalPaintedMaterial2);
		turrett.position.set(0, 0.6, 0)
		scene.add(turrett);

		var geometry = new THREE.SphereGeometry(0.6, 8, 6);
		var sphere = new THREE.Mesh(geometry, metalPaintedMaterial2);
		sphere.position.set(0, 0.6, 0)
		turrett.add(sphere);

		var geometry = new THREE.CylinderGeometry(0.12, 0.12, 1.2, 4);
		var turrettCannon = new THREE.Mesh(geometry, metalPaintedMaterial3);
		turrettCannon.position.set(0, 0.3, 0.4);
		turrettCannon.rotation.set(Math.PI / 2, 0, 0);
		sphere.add(turrettCannon);

		turrett.position.set(generateRandomNumber(-90, 90), 0.75, -distance + generateRandomNumber(-1, 1));
		turretts.push(turrett);
		turrettsHits.push(0);
	}
}
addTurretts(generateRandomNumber(8, 9), 100);
addTurretts(generateRandomNumber(9, 11), 200);

explosions = []
function spawnExplosion(x, y, z) {
	var geometry = new THREE.SphereGeometry(1, 32, 32);
	var material = new THREE.MeshBasicMaterial({color: 0xffffff});
	material.transparent = true;
	var sphere = new THREE.Mesh(geometry, material);
	sphere.position.set(x, y, z);
	scene.add(sphere);
	explosions.push(sphere)
}

//  Enemy laser beam
var enemyLaserBaseGeometry = new THREE.BoxGeometry(1, 1, 1);
var enemyLaserBaseMaterial = new THREE.MeshBasicMaterial();
var enemyLaserGeometry = new THREE.CylinderGeometry(0.09, 0.09, 0.9, 3);
var enemyLaserMaterial = new THREE.MeshLambertMaterial({color: 0x67c5ff, emissive: 0x00ffff});
var enemyLasers = {};
var enemyLaserIndex = 0;
var turrettIndex = 0;
function spawnEnemyLaser() {
	var enemyLaserBase = new THREE.Mesh(enemyLaserBaseGeometry, enemyLaserBaseMaterial);
	enemyLaserBase.material.transparent = true;
	enemyLaserBase.material.opacity = 0;
	scene.updateMatrixWorld(true);
	var position = new THREE.Vector3();
	position.setFromMatrixPosition(turretts[turrettIndex].matrixWorld);
	turrettIndex += 1;
	turrettIndex %= turretts.length
	
	if (destroyedTurrets.includes(turrettIndex)) {
		return;
	}
	enemyLaserBase.position.x = position.x;
	enemyLaserBase.position.y = position.y;
	enemyLaserBase.position.z = position.z;
	
	// Aim somewhere
	//enemyLaserBase.lookAt(body1);  // TODO!
	enemyLaserBase.rotation.set(-Math.PI / 2 / 90 * generateRandomNumber(0.5, 1.5), Math.PI / 2 / 90 * generateRandomNumber(-25, 25), 0)
	
	enemyLaserBase.rotateX(Math.PI / 2);
	//var laserLight = new THREE.PointLight(0xff0000, 0.05, 100);
	//laser.add(laserLight);
	scene.add(enemyLaserBase);
	var enemyLaser = new THREE.Mesh(enemyLaserGeometry, enemyLaserMaterial);
	enemyLaserBase.add(enemyLaser);
	enemyLasers[enemyLaserIndex] = enemyLaser;
	enemyLaserIndex += 1;
}

function spawnAllyLaser() {
	var laserBase = new THREE.Mesh(laserBaseGeometry, laserBaseMaterial);
	laserBase.material.transparent = true;
	laserBase.material.opacity = 0;
	scene.updateMatrixWorld(true);
	var position = new THREE.Vector3();
	if (cannonIndex == 0) {
		position.setFromMatrixPosition(cannon1_3.matrixWorld);
	} else {
		position.setFromMatrixPosition(cannon2_2.matrixWorld);
	}
	laserBase.position.x = position.x;
	laserBase.position.y = position.y;
	laserBase.position.z = position.z;
	if (aimPoint != null) {
		laserBase.lookAt(aimPoint);
	}
	laserBase.rotateX(Math.PI / 2);
	//var laserLight = new THREE.PointLight(0xff0000, 0.05, 100);
	//laser.add(laserLight);
	scene.add(laserBase);
	var laser = new THREE.Mesh(laserGeometry, laserMaterial);
	laserBase.add(laser);
	lasers[laserIndex] = laser;
	laserIndex += 1;
}

window.setInterval(function(){
  	spawnEnemyLaser();
}, 330);

//- AMBIENT
//  Trees
function addTrees(n) {
	var material = new THREE.MeshPhongMaterial({color: 0xc9d4ff, specular: 0x464646});
	for (var i = 0; i < n; i += 1) {
		geometry = new THREE.ConeBufferGeometry(0.5, 1.4 + generateRandomNumber(0, 1.4), 4);
		var tree = new THREE.Mesh(geometry, material);
		tree.castShadow = true;
		tree.position.set(generateRandomNumber(-150, 150), 0, generateRandomNumber(-150, 150));
		scene.add(tree);
	}
}
addTrees(180);

function generateRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
};


//- SKYBOX
geometry = new THREE.BoxGeometry(1000, 1000, 1000);
var skyMaterials = [
	new THREE.MeshBasicMaterial({map: textureLoader.load("textures/Skybox/iceflow_ft.jpg"), side: THREE.DoubleSide}),
	new THREE.MeshBasicMaterial({map: textureLoader.load("textures/Skybox/iceflow_bk.jpg"), side: THREE.DoubleSide}),
	new THREE.MeshBasicMaterial({map: textureLoader.load("textures/Skybox/iceflow_up.jpg"), side: THREE.DoubleSide}),
	new THREE.MeshBasicMaterial({map: textureLoader.load("textures/Skybox/iceflow_dn.jpg"), side: THREE.DoubleSide}),
	new THREE.MeshBasicMaterial({map: textureLoader.load("textures/Skybox/iceflow_rt.jpg"), side: THREE.DoubleSide}),
	new THREE.MeshBasicMaterial({map: textureLoader.load("textures/Skybox/iceflow_lf.jpg"), side: THREE.DoubleSide}),
];
var skyMaterial = new THREE.MeshFaceMaterial(skyMaterials);
var sky = new THREE.Mesh(geometry, skyMaterial);
sky.position.set(0, 25, 0);
scene.add(sky);

//- LIGHTS
var ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.44);
scene.add(ambientLight);

/*var pointLight = new THREE.PointLight(0xFFFFFF, 0.8);
pointLight.castShadow = true;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 25;
pointLight.position.set(2, 5, 3);
scene.add(pointLight);*/

var directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.12);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 4096;
directionalLight.shadow.mapSize.height = 4096;
directionalLight.shadow.camera.near = 0.5;  // default
directionalLight.shadow.camera.far = 500;  // default
directionalLight.position.set(20, 50, 30);
directionalLight.shadow.camera.bottom = -25;
directionalLight.shadow.camera.left = -25;
directionalLight.shadow.camera.top = 25;
directionalLight.shadow.camera.right = 25;
scene.add(directionalLight);

//- MISCELLANEOUS
var controls = new THREE.OrbitControls(camera, renderer.domElement);
// Change mouse button
// https://stackoverflow.com/questions/52785940/way-to-modify-orbitcontrols-to-rotate-camera-with-right-click-hold-and-orbit-ta
controls.mouseButtons = {LEFT: THREE.MOUSE.RIGHT, MIDDLE: THREE.MOUSE.MIDDLE, RIGHT: THREE.MOUSE.MIDDLE};



body2.add(camera);
camera.position.set(5, 3, 8);
controls.maxPolarAngle = 3 * Math.PI / 4;
controls.target = new THREE.Vector3(5, 3, 0);
controls.update();
controls.saveState();

window.addEventListener("resize", function() {
	// - Resize render viewport when windows is resized.
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
});

document.addEventListener( 'mousemove', onDocumentMouseMove, false );

var mouseDown = false;
document.addEventListener( 'mousedown', onDocumentMouseDown, false );
function onDocumentMouseDown() {
	mouseDown = true;
}

document.addEventListener( 'mouseup', onDocumentMouseUp, false );
function onDocumentMouseUp() {
	mouseDown = false;
	// Reset camera.
	controls.reset();
	controls.target = new THREE.Vector3(5, 3, body1.position.z);
	controls.update();
}

var keyboard = {};

function keydown(event) {
	keyboard[event.keyCode] = true;
};

function keyup(event) {
	keyboard[event.keyCode] = false;
};

//scene.fog = new THREE.Fog(0xcedcdf, 0.1, 1000);

window.addEventListener("keydown", keydown);
window.addEventListener("keyup", keyup);

var update = function() {
	if (keyboard[87] == true) { // W
		
	}
	if (keyboard[83] == true) { // S
		
	}
	if (keyboard[65] == true) { // A
		
	}
	if (keyboard[68] == true) { // D
		
	}
	if (keyboard[39] == true) { // RIGHT
		
	}
	if (keyboard[37] == true) { // LEFT
		
	}
}

var render = function() {
	renderer.render(scene, camera);
}

function interpolate(a, b, r) {
	return a * (1 - r) + b * r;
};

var pose1 = [0,    0,    0, 13.0, -5.0,  2.0, 11.0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,  -13,    5,   -2,  -11];
var pose2 = [0,    0,    0, 12.0,  7.0, -1.0,  8.0,    0,-15.0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,  -12,    8,    1,   -8];
var pose3 = [0,    0,    0, 11.0, 15.0, -5.0,  5.0,    0,-15.0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,  -11,    0,    5,   -5];
var pose4 = [0,    0,    0,  8.0, 13.0,  7.0,  2.0,    0,    0,-15.0,    0,    0,    0,    0,    0,    0,    0,    0,    0,   -8,  -13,    8,   -2];
var pose5 = [0,    0,    0,  5.0, 12.0, 15.0, -1.0,    0,    0,-15.0,    0,    0,    0,    0,    0,    0,    0,    0,    0,   -5,  -12,    0,    1];
var pose6 = [0,    0,    0,  2.0, 11.0, 13.0, -5.0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,   -2,  -11,  -13,    5];
var pose7 = [0,    0,    0, -1.0,  8.0, 12.0,  7.0,    0,    0,    0,-15.0,    0,    0,    0,    0,    0,    0,    0,    0,    1,   -8,  -12,    8];
var pose8 = [0,    0,    0, -5.0,  5.0, 11.0, 15.0,    0,    0,    0,-15.0,    0,    0,    0,    0,    0,    0,    0,    0,    5,   -5,  -11,    0];
var pose9 = [0,    0,    0,  7.0,  2.0,  8.0, 13.0,-15.0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    8,   -2,   -8,  -13];
var pose10 =[0,    0,    0, 15.0, -1.0,  5.0, 12.0,-15.0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    0,    1,   -5,  -12];
var poses = [pose1, pose2, pose3, pose4, pose5, pose6, pose7, pose8, pose9, pose10];

var speed = 0.065;
var LASER_SPEED = 1.25;

var atatHits = 0;

var frame = 0;
let FRAMES = 6.0;
var pose = 0;
var POSES = 10;
var gameLoop = function() {
	setTimeout( function() {
        requestAnimationFrame(gameLoop);
    }, 1000 / 30);
	
	// Move AT-AT.
	frame += 1;
	var poseA = poses[pose];
	var poseB = poses[(pose + 1) % POSES];
	var r = frame / FRAMES;
	setPos(interpolate(poseA[0], poseB[0], r),
		   interpolate(poseA[1], poseB[1], r),
		   interpolate(poseA[2], poseB[2], r),
		   interpolate(poseA[3], poseB[3], r),
		   interpolate(poseA[4], poseB[4], r),
		   interpolate(poseA[5], poseB[5], r),
		   interpolate(poseA[6], poseB[6], r),
		   interpolate(poseA[7], poseB[7], r),
		   interpolate(poseA[8], poseB[8], r),
		   interpolate(poseA[9], poseB[9], r),
		   interpolate(poseA[10], poseB[10], r),
		   interpolate(poseA[11], poseB[11], r),
		   interpolate(poseA[12], poseB[12], r),
		   interpolate(poseA[13], poseB[13], r),
		   interpolate(poseA[14], poseB[14], r),
		   interpolate(poseA[15], poseB[15], r),
		   interpolate(poseA[16], poseB[16], r),
		   interpolate(poseA[17], poseB[17], r),
		   interpolate(poseA[18], poseB[18], r),
		   interpolate(poseA[19], poseB[19], r),
		   interpolate(poseA[20], poseB[20], r),
		   interpolate(poseA[21], poseB[21], r),
		   interpolate(poseA[22], poseB[22], r)
	);
	var poseA = poses[(pose + 5) % POSES];
	var poseB = poses[(pose + 6) % POSES];
	setPos_2(interpolate(poseA[0], poseB[0], r),
		   interpolate(poseA[1], poseB[1], r),
		   interpolate(poseA[2], poseB[2], r),
		   interpolate(poseA[3], poseB[3], r),
		   interpolate(poseA[4], poseB[4], r),
		   interpolate(poseA[5], poseB[5], r),
		   interpolate(poseA[6], poseB[6], r),
		   interpolate(poseA[7], poseB[7], r),
		   interpolate(poseA[8], poseB[8], r),
		   interpolate(poseA[9], poseB[9], r),
		   interpolate(poseA[10], poseB[10], r),
		   interpolate(poseA[11], poseB[11], r),
		   interpolate(poseA[12], poseB[12], r),
		   interpolate(poseA[13], poseB[13], r),
		   interpolate(poseA[14], poseB[14], r),
		   interpolate(poseA[15], poseB[15], r),
		   interpolate(poseA[16], poseB[16], r),
		   interpolate(poseA[17], poseB[17], r),
		   interpolate(poseA[18], poseB[18], r),
		   interpolate(poseA[19], poseB[19], r),
		   interpolate(poseA[20], poseB[20], r),
		   interpolate(poseA[21], poseB[21], r),
		   interpolate(poseA[22], poseB[22], r)
	);
	var poseA = poses[(pose + 7) % POSES];
	var poseB = poses[(pose + 8) % POSES];
	setPos_3(interpolate(poseA[0], poseB[0], r),
		   interpolate(poseA[1], poseB[1], r),
		   interpolate(poseA[2], poseB[2], r),
		   interpolate(poseA[3], poseB[3], r),
		   interpolate(poseA[4], poseB[4], r),
		   interpolate(poseA[5], poseB[5], r),
		   interpolate(poseA[6], poseB[6], r),
		   interpolate(poseA[7], poseB[7], r),
		   interpolate(poseA[8], poseB[8], r),
		   interpolate(poseA[9], poseB[9], r),
		   interpolate(poseA[10], poseB[10], r),
		   interpolate(poseA[11], poseB[11], r),
		   interpolate(poseA[12], poseB[12], r),
		   interpolate(poseA[13], poseB[13], r),
		   interpolate(poseA[14], poseB[14], r),
		   interpolate(poseA[15], poseB[15], r),
		   interpolate(poseA[16], poseB[16], r),
		   interpolate(poseA[17], poseB[17], r),
		   interpolate(poseA[18], poseB[18], r),
		   interpolate(poseA[19], poseB[19], r),
		   interpolate(poseA[20], poseB[20], r),
		   interpolate(poseA[21], poseB[21], r),
		   interpolate(poseA[22], poseB[22], r)
	);
	body1.position.z -= speed;
	body1_2.position.z -= speed;
	body1_3.position.z -= speed;
	frame %= FRAMES;
	if (frame == 0) {
		pose += 1;
		pose %= POSES;
	}
	
	// Aim head
	raycaster.setFromCamera(mouse.clone(), camera);
	var intersects = raycaster.intersectObjects([ground, farPlane]);
	if (intersects.length > 0 && mouseDown == false) {  // mouseDown prevents aim change when orbiting.
		var previousAimPoint = aimPoint;
		aimPoint = intersects[0].point;
		// Slow down head
		if (previousAimPoint != null) {
			var angleInBetween = previousAimPoint.angleTo(aimPoint);
			const limitAngle = Math.PI / 90 * 1;
			if (angleInBetween > limitAngle) {
				var angeRatio = limitAngle / angleInBetween;
				aimPoint = getPointInBetweenByPerc(previousAimPoint, aimPoint, angeRatio);
			}
		}
	}
	if (aimPoint != null) {
		head1.lookAt(aimPoint);
		head1.rotateX(-Math.PI / 2);
		head1.rotateY(-Math.PI / 2);
		// Limit head rotation
		if (head1.rotation.x > 1) {
			head1.rotation.x = 1;
		} else if (head1.rotation.x < -1) {
			head1.rotation.x = -1;
		}
		if (head1.rotation.z > 1) {
			head1.rotation.z = 1;
		} else if (head1.rotation.z < -1) {
			head1.rotation.z = -1;
		}
	}
	
	// Move laser beams.
	for (const [key, value] of Object.entries(lasers)) {
    	value.position.y += LASER_SPEED;
		// Remove far lasers.
		var vector = new THREE.Vector3();
		vector.setFromMatrixPosition(value.matrixWorld);
		if (vector.y < -0.5 || vector.z < -300) {
			value.parent.parent.remove(value.parent);  // Laser is child of laserBase.
			delete lasers[key];
		}
	}
	for (const [key, value] of Object.entries(enemyLasers)) {
    	value.position.y += LASER_SPEED;
		// Remove far lasers.
		var vector = new THREE.Vector3();
		vector.setFromMatrixPosition(value.matrixWorld);
		if (vector.y < -0.5 || vector.z > 100) {
			value.parent.parent.remove(value.parent);  // Laser is child of laserBase.
			delete enemyLasers[key];
		}
	}
	
	// Fade explosions.
	for (var i = 0; i < explosions.length; i += 1) {
		explosions[i].material.opacity -= 0.03;
		if (explosions[i].material.opacity <= 0) {
			scene.remove(explosions[i]);
		}
	}
	
	// Detect hits.
	for (const [key, value] of Object.entries(enemyLasers)) {
		var vector = new THREE.Vector3();
		vector.setFromMatrixPosition(value.matrixWorld)
		if (vector.x == 0 && vector.y == 0 && vector.z == 0) {
			continue
		}
		if (vector.z < body1.position.z + 1.5 && vector.z > body1.position.z - 1.5) {
			if (vector.x < body1.position.x + 0.7 && vector.x > body1.position.x - 0.7) {
				console.log("HIT!");
				spawnExplosion(vector.x, vector.y, vector.z);
				value.parent.parent.remove(value.parent);  // Laser is child of laserBase.
				delete enemyLasers[key];
				
				atatHits += 1;
				if (atatHits >= 5) {
					document.getElementById("message").innerHTML = "<p>GAME OVER</p>"
					document.getElementById("message").classList.remove("fade");
					speed = 0;
					LASER_SPEED = 0;
					setTimeout( function() {
        				window.location.reload()
    				}, 2000);
					// GAME OVER
				}
			}
		}
	}
	
	if (body1.position.z < -250) {
		document.getElementById("message").innerHTML = "<p>YOU SURVIVED</p>"
					document.getElementById("message").classList.remove("fade");
					setTimeout( function() {
        				window.location.reload()
    				}, 2000);
					// GAME OVER
	}
	
	for (const [key, value] of Object.entries(lasers)) {
		var vector = new THREE.Vector3();
		vector.setFromMatrixPosition(value.matrixWorld)
		if (vector.x == 0 && vector.y == 0 && vector.z == 0) {
			continue
		}
		
		for (var i = 0; i < turretts.length; i += 1) {
			if (destroyedTurrets.includes(i)) {
				continue;
			}
			if (vector.z < turretts[i].position.z + 0.6 && vector.z > turretts[i].position.z - 0.6) {
				if (vector.x < turretts[i].position.x + 0.6 && vector.x > turretts[i].position.x - 0.6) {
					console.log("TURRET HIT!");
					spawnExplosion(vector.x, vector.y, vector.z);
					value.parent.parent.remove(value.parent);  // Laser is child of laserBase.
					delete lasers[key];
					
					turrettsHits[i] += 1;
					if (turrettsHits[i] >= 5) {
						scene.remove(turretts[i]);
						destroyedTurrets.concat([i]);
					}
				}
			}
		}
	}
	
	// Move shadow camera frustum to keep AT-AT into it.
	// Constants calculated based on light position.
	directionalLight.shadow.camera.bottom += speed / 1.8;
	directionalLight.shadow.camera.left += speed / 1.8;
	directionalLight.shadow.camera.top += speed / 1.2;
	directionalLight.shadow.camera.right += speed / 1.2;
	directionalLight.shadow.camera.updateProjectionMatrix();
	
	update();
	render();
}

function getPointInBetweenByLen(pointA, pointB, length) {  // https://stackoverflow.com/questions/27426053/find-specific-point-between-2-points-three-js
    var dir = pointB.clone().sub(pointA).normalize().multiplyScalar(length);
    return pointA.clone().add(dir);
}

function getPointInBetweenByPerc(pointA, pointB, percentage) {  // https://stackoverflow.com/questions/27426053/find-specific-point-between-2-points-three-js
    var dir = pointB.clone().sub(pointA);
    var len = dir.length();
    dir = dir.normalize().multiplyScalar(len*percentage);
    return pointA.clone().add(dir);

}

var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
function onDocumentMouseMove( event ) {
	mouse.x = (event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
	mouse.y = - (event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
}

gameLoop();