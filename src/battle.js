import { controls } from "./controls.js";
import { map } from "./map.js";

export {BattleScene, startBattle}

let _enemyList = [];
let _triggeringSprite;

let BattleScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function BattleScene(){
        Phaser.Scene.call(this, {key: 'battleScene'})
    },
    preload: function(){
        this.load.tilemapTiledJSON('battle_bg', 'assets/map/battle_bg.json');
    },
    create: function(){
        controls.setupControls(this);
        setupBattle(this);
    },
    update: function(){

    }
})

function startBattle(scene, enemies, triggeringSprite){
    _triggeringSprite = triggeringSprite;
    scene.scene.launch('battleScene');
    scene.scene.pause();
}

function setupBattle(scene){
    let tilemap = scene.make.tilemap({key: 'battle_bg'});
    let tiles = tilemap.addTilesetImage('sheet', 'sheet');
    let bg = tilemap.createLayer('bg', tiles, 0, 0);
    let playerSprite = tilemap.createFromObjects('objects', {
        name: 'player',
        key: 'slime'
    })[0];
    // temp enemy generation code
    for(let i = 0; i < 4; i++){
        let name = 'enemy'+i;
        let enemy = tilemap.createFromObjects('objects', {
            name, key: 'barrel' 
        })[0];
        enemy.setDisplaySize(12, 15);
        _enemyList.push(enemy);
    }
    controls.onSelect(()=>{
        destroyEnemy(scene, 0);
    });
}

function destroyEnemy(scene, index){
    _enemyList[index].destroy();
    _enemyList.splice(index, 1);
    if(_enemyList.length === 0){
        endBattle(scene);
    }
}

function endBattle(scene){
    console.log('main scene');
    map.endBattle(scene, _triggeringSprite);
}