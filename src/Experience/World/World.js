// import * as THREE from 'three'
import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Fox from './Fox.js'
import Earth from './Earth.js'
import Plane from './Plane.js'

// todo
// https://github.com/vasturiano/globe.gl
//http://planetpixelemporium.com/earth.html
//http://learningthreejs.com/blog/2013/09/16/how-to-make-the-earth-in-webgl/
// going hardcore with wasm https://www.youtube.com/watch?v=UXD97l7ZT0w


export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // const testMesh = new THREE.Mesh(
        //     new THREE.SphereGeometry(1,32, 16),
        //     new THREE.MeshBasicMaterial({wireframe: true})
        // )
        // testMesh.position.set(0, 2, -2)
        // this.scene.add(testMesh)

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            this.environment = new Environment()
            this.plane = new Plane()
            this.floor = new Floor()
            this.fox = new Fox()
            this.earth = new Earth()
        })
    }

    update()
    {
        if(this.fox)
            this.fox.update()

        if(this.earth)
            this.earth.update()

        if(this.plane)
                    this.plane.update()

    }
}
