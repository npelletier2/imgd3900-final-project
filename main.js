const config = {
    type: Phaser.AUTO,
    width: 700,
    height: 400,
    parent: 'game-div',
    scale:{
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        zoom: 2
    },
    scene: {preload, create, update},
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y:0}
        }
    }
};
const game = new Phaser.Game(config);

let objects = {};
let map;
let cursors;

function getDirection(){
    let dir = [];
    dir[0] = cursors.left.isDown*-1 + cursors.right.isDown*1;
    dir[1] = cursors.up.isDown*-1 + cursors.down.isDown*1;
    return dir;
}

function preload(){
    //tileset from https://opengameart.org/content/top-down-dungeon-tileset
    this.load.image('sheet', 'assets/map/sheet.png');
    this.load.tilemapTiledJSON('map', 'assets/map/map.json');
    //spritesheet from https://opengameart.org/content/16x16-animated-critters
    this.load.spritesheet('slime', 'assets/sprites/slime.png', {
        frameWidth: 16, farmeHeight: 16
    });
}

function create(){
    //set up tilemap
    map = createMap(this);
    
    //set up player
    createPlayer(this);

    //set up camera movement
    const camera = this.cameras.main;
    camera.startFollow(objects.player);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    //set up cursors
    cursors = this.input.keyboard.createCursorKeys();
}

function update(time, delta){
    //update player
    objects.player.body.setVelocity(0);

    //directional input
    let dir = getDirection();
    
    movePlayer(dir);
}