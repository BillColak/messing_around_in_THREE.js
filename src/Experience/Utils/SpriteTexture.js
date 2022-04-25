import * as THREE from 'three'
// import Experience from '../Experience.js'

export default class SpriteTexture
{
    constructor(parent, texture, tilesHoriz, tilesVert, tileDispDuration= 1000, numberOfTiles=null)
    {
        // todo has to display storm in specific lat long, like the data in og globe
        this.parent = parent
        this.texture = texture
        this.tilesHoriz = tilesHoriz
        this.tilesVert = tilesVert
        this.tileDuration = tileDispDuration

        // this.experience = new Experience()
        this.experience = this.parent.experience
        this.scene = this.experience.scene
        // this.resources = this.experience.resources
        this.time = this.experience.time

        // how many images does this sprite sheet contain? usually equals tilesHoriz * tilesVert, but not necessarily, if there at blank tiles at the bottom of the spritesheet.
        numberOfTiles ? this.numberOfTiles = numberOfTiles : this.numberOfTiles = this.tilesHoriz * this.tilesVert
        this.currentDisplayTime = 0 // how long has the current image been displayed?
        this.currentTile = 0  // which image is currently being displayed?

        this.setTextures()
        this.update()  // might have to wait a bit before using this?
    };

    sprite = () => this.textures.color


    setTextures()
    {
        this.textures = {}
        // this.textures.color = this.resources.items.Storm
        this.textures.color = this.texture
        this.textures.color.wrapS = this.textures.color.wrapT = THREE.RepeatWrapping
        this.textures.color.repeat.set(1/this.tilesHoriz, 1/this.tilesVert)
    };
    // update(milliSec)
//     update()
//     {
//         // this.currentDisplayTime += milliSec
//         this.currentDisplayTime += this.time.delta
//         while (this.currentDisplayTime > this.tileDuration)
//         {
//             this.currentDisplayTime -= this.tileDuration
//             this.currentTile++
//
//             if (this.currentTile === this.numberOfTiles)
//                 this.currentTile = 0
//
//             const currentColumn = this.currentTile % this.tilesHoriz
//             this.textures.color.offset.x = currentColumn / this.tilesHoriz
//
//             const currentRow = Math.floor( this.currentTile / this.tilesHoriz)
//             this.textures.color.offset.y = currentRow / this.tilesVert
//         }
//     }
};
