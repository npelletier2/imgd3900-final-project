import { map } from './src/map.js';
import { controls } from './src/controls.js';
import { makePlayer } from './src/player.js';
import { objects } from './src/objects.js';
import { BattleScene } from './src/battle.js';

let MainScene = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function MainScene(){
        Phaser.Scene.call(this, {key: 'mainScene'});
    },

    preload: function(){
        //tileset from https://opengameart.org/content/top-down-dungeon-tileset
        this.load.image('sheet', 'assets/map/sheet.png');
        this.load.tilemapTiledJSON('map', 'assets/map/map.json');
        //spritesheet from https://opengameart.org/content/16x16-animated-critters
        this.load.spritesheet('slime', 'assets/sprites/slime.png', {
            frameWidth: 16, frameHeight: 16
        });
        this.load.image('barrel', 'assets/sprites/barrel.png');
    },

    create: function(){
        map.setupMap(this, drawDebug);
        map.addObjects(this);
        controls.setupControls(this);
        objects.player = makePlayer(this, map);
    },

    update: function(time, delta){
        controls.updateControls();
        for(const obj in objects){
            if(objects[obj].update){
                objects[obj].update(this);
            }
        }
    }
})

let tileWidth = 44;
let tileHeight = 25;

const config = {
    type: Phaser.AUTO,
    width: tileWidth*16,
    height: tileHeight*16,
    parent: 'game-div',
    scale:{
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        zoom: 2
    },
    scene: [MainScene, BattleScene],
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {y:0}
        }
    }
};
const game = new Phaser.Game(config);

let drawDebug = false;

