import * as THREE from 'three'
import Experience from '../Experience.js'
// import {log} from "three/examples/jsm/renderers/nodes/ShaderNode";
// import * as fragmentShader from '../../../static/textures/earth/shaders/fragmentShader.glsl'

// todo add storms
// todo add night time lights overlay


const Shaders = {
    'earth': {
        uniforms: {
            'texture': {type: 't', value: null}
        },
        vertexShader: [
            'varying vec3 vNormal;',
            'varying vec2 vUv;',
            'void main() {',
            'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
            'vNormal = normalize( normalMatrix * normal );',
            'vUv = uv;',
            '}'
        ].join('\n'),
        fragmentShader: [
            'uniform sampler2D texture;',
            'varying vec3 vNormal;',
            'varying vec2 vUv;',
            'void main() {',
            // 'vec3 diffuse = texture2D( texture, vUv ).xyz;',
            'float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );',
            'vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );',
            // 'gl_FragColor = vec4( diffuse + atmosphere, 1.0 );',
            '}'
        ].join('\n')
    },
    'atmosphere': {
        uniforms: {},
        vertexShader: [
            'varying vec3 vNormal;',
            'void main() {',
            'vNormal = normalize( normalMatrix * normal );',
            'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
            '}'
        ].join('\n'),
        fragmentShader: [
            'varying vec3 vNormal;',
            'void main() {',
            'float intensity = pow( 0.8 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 12.0 );',
            'gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;',
            '}'
        ].join('\n')
    }
};


export default class Earth
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('earth')
        }
        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()
    };

    setGeometry()
    {
        this.geometry = new THREE.SphereGeometry( 1, 64, 32)
        this.clouds = new THREE.SphereGeometry( 1.01, 64, 32)
    };

    setTextures()
    {
        this.textures = {}
        this.textures.color = this.resources.items.earthMapTexture
        this.textures.bumpMap = this.resources.items.earthBumpMap
        this.textures.specular = this.resources.items.earthSpecularMap
        this.textures.clouds = this.resources.items.cloudMap
    };
    setMaterial()
    {
        this.material = new THREE.MeshPhongMaterial({  // ==> shader
            map: this.textures.color,
            bumpMap: this.textures.bumpMap,
            bumpScale: 0.02,
            specularMap: this.textures.specular,
            specular: new THREE.Color('grey')
        });

        this.cloud_material = new THREE.MeshPhongMaterial({
            map: this.textures.clouds,
            side: THREE.DoubleSide,
            opacity: 0.8,
            transparent: true,
            depthWrite: false,
        });
    };

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.set(0,2,-2)

        this.mesh.receiveShadow = true
        this.cloudMesh = new THREE.Mesh(this.clouds, this.cloud_material)

        this.mesh.add(this.cloudMesh)
        this.scene.add(this.mesh)

        this.mesh.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
            }
        });
    };

    update()
    {
        this.cloudMesh.rotation.y += this.time.delta * 0.00005;
        this.cloudMesh.rotation.x += this.time.delta * 0.00001;
    };
};
// function TextureAnimator(texture, tilesHoriz, tilesVert, tileDispDuration)
// {
//     let obj = {};
//
//     obj.texture = texture;
//     obj.tilesHorizontal = tilesHoriz;
//     obj.tilesVertical = tilesVert;
//     obj.tileDisplayDuration = tileDispDuration;
//
//     obj.numberOfTiles = tilesHoriz * tilesVert;
//
//     obj.texture.wrapS = THREE.RepeatWrapping;
//     obj.texture.wrapT = THREE.RepeatWrapping;
//     obj.texture.repeat.set( 1/tilesHoriz, 1/tilesVert );
//     obj.currentTile = 0;
//
//     obj.nextFrame = function()
//     {
//         obj.currentTile++;
//         if (obj.currentTile === obj.numberOfTiles)
//             obj.currentTile = 0;
//
//         let currentColumn = obj.currentTile % obj.tilesHorizontal;
//         obj.texture.offset.x = currentColumn / obj.tilesHorizontal;
//
//         let currentRow = Math.floor( obj.currentTile / obj.tilesHorizontal );
//         obj.texture.offset.y = obj.tilesVertical - currentRow / obj.tilesVertical;
//     }
//
//     obj.start = function()
//     { obj.intervalID = setInterval(obj.nextFrame, obj.tileDisplayDuration); }
//
//     obj.stop = function()
//     { clearInterval(obj.intervalID); }
//
//     obj.start();
//     return obj;
// }

// THREE.SpriteSheetTexture = function(imageURL, framesX, framesY, frameDelay, _endFrame) {
//
//     var timer, frameWidth, frameHeight,
//         x = y = count = startFrame = 0,
//         endFrame = _endFrame || framesX * framesY,
//         CORSProxy = 'https://cors-anywhere.herokuapp.com/',
//         canvas = document.createElement('canvas'),
//         ctx = canvas.getContext('2d'),
//         canvasTexture = new THREE.CanvasTexture(canvas),
//         img = new Image();
//
//     img.crossOrigin = "Anonymous"
//     img.onload = function(){
//         canvas.width = frameWidth = img.width / framesX;
//         canvas.height = frameHeight = img.height / framesY;
//         timer = setInterval(nextFrame, frameDelay);
//     }
//     img.src = CORSProxy + imageURL;
//
//     function nextFrame() {
//         count++;
//
//         if(count >= endFrame ) {
//             count = 0;
//         };
//
//         x = (count % framesX) * frameWidth;
//         y = ((count / framesX)|0) * frameHeight;
//
//         ctx.clearRect(0, 0, frameWidth, frameHeight);
//         ctx.drawImage(img, x, y, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
//
//         canvasTexture.needsUpdate = true;
//     }
//
//     return canvasTexture;
// }
//
//
// var width = window.innerWidth, height = window.innerHeight / 2;
// var camera, scene, renderer, geometry, texture, mesh;
//
//
// function init() {
//     renderer = new THREE.WebGLRenderer({
//         antialias: true
//     });
//     renderer.setSize(width, height);
//     document.body.appendChild(renderer.domElement);
//
//     scene = new THREE.Scene();
//
//     camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000);
//     camera.position.z = 500;
//     scene.add(camera);
//
//     texture = new THREE.SpriteSheetTexture('https://s3-us-west-2.amazonaws.com/s.cdpn.io/68819/grid-sprite.jpg', 4, 4, 100, 16);
//     var material = new THREE.MeshBasicMaterial({
//         map: texture
//     });
//     geometry = new THREE.BoxGeometry( 200, 200, 200 );
//     mesh = new THREE.Mesh( geometry, material );
//     scene.add( mesh );
//
// }
//
// function animate() {
//     requestAnimationFrame(animate);
//     mesh.rotation.y += 0.01;
//     renderer.render(scene, camera);
// }
// init();
// animate();

