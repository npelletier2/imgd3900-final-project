import { makeBarrel } from "./barrel_enemy.js";
import { objects } from "./objects.js";

export let map = {
    setupMap,
    addObjects
};

function setupMap(scene, drawDebug){
    let tilemap = scene.make.tilemap({key: 'map'});
    let tiles = tilemap.addTilesetImage('sheet', 'sheet');
    map.ground = tilemap.createLayer('ground', tiles, 0, 0);
    map.collidable = tilemap.createLayer('collidable', tiles, 0, 0);
    map.above = tilemap.createLayer('above', tiles, 0, 0);
    map.enemy = tilemap.createLayer('enemy', tiles, 0, 0);
    
    map.collidable.setCollisionByProperty({collides: true});
    map.above.setDepth(10);

    map = {...map, tilemap, tiles};

    //debug: graphics for tile hitboxes
    if(drawDebug){
        const debugGraphics = scene.add.graphics().setAlpha(0.75);
        map.collidable.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(255, 125, 48, 255),
            faceColor: new Phaser.Display.Color(0, 0, 0, 255)
        });
    }
}

function addObjects(scene){
    let barrelEnemySprite = map.tilemap.createFromObjects('enemy', {
        name: 'barrel_enemy'
    })[0];
    objects.barrelEnemy = makeBarrel(scene, barrelEnemySprite)
}