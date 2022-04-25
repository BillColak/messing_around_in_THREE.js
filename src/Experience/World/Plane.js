import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Plane
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time  // always around 16

        this.tilesHoriz = 8
        this.tilesVert = 8

        this.numberOfTiles = this.tilesHoriz * this.tilesVert
        this.imgDispInterval = 250
        this.currentDisplayTime = 0
        this.currentTile = 0

        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()
    };

    setGeometry()
    {
        this.geometry = new THREE.PlaneGeometry(5,5)
    };

    setTextures()
    {
        this.textures = {}
        this.textures.color = this.resources.items.Storm
        this.textures.color.wrapS = this.textures.color.wrapT = THREE.RepeatWrapping
        this.textures.color.repeat.set(1/this.tilesHoriz, 1/this.tilesVert)
        // this.sprite = new SpriteTexture(this, this.textures.color, 8,8)
    };

    setMaterial()
    {
        this.material = new THREE.MeshStandardMaterial({  // Basic Material does not receive shadows.
            map: this.textures.color,
            flatShading: true,
            // transparent: false,
            opacity: 0.7,
            color: 0x00ffff,
            side: THREE.DoubleSide,
        });
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.rotation.y = Math.PI * 0.5
        this.mesh.position.set(-4,3,-3)
        // this.mesh.position.set(2,2.5,-2)
        this.mesh.receiveShadow = true
        this.scene.add(this.mesh);

        this.mesh.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
            }
        });
    }
    update()
    {
        // todo the fucking storm should do five updates, wait for 5 secs and
        //kkkk think of it as events..... and ina  storm events this is what happens....

        if(this.time.elapsed - this.imgDispInterval > this.currentDisplayTime)
        {
            this.currentDisplayTime = this.time.elapsed
            this.currentTile ++
            if (this.currentTile === this.numberOfTiles)
                this.currentTile = 0

            const currentColumn = this.currentTile % this.tilesHoriz
            this.textures.color.offset.x = currentColumn / this.tilesHoriz

            const currentRow = Math.floor( this.currentTile / this.tilesHoriz)
            this.textures.color.offset.y = currentRow / this.tilesVert
        }
    }
}
