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
    createMap(this);
    camera.setupCamera(this);
    controls.setupControls(this);
    for(const obj in objects){
        objects[obj].setup(this);
    }
}

function update(time, delta){
    controls.getControls();
    for(const obj in objects){
        objects[obj].update(this);
    }
}