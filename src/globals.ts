import { MainScene } from "./scene/main_scene/MainScene";
import { BattleScene } from "./scene/battle_scene/BattleScene";
import { BaseScene } from "./scene/BaseScene";

export interface Object {
    sprite?: Phaser.GameObjects.Sprite,
    preload?:(()=>void),
    create?:(()=>void),
    update?:(()=>void),
    [index: string]: any //fields for use by the object internally
}

export let objects:{[index:string]:Object} = {};

// ---------- Scene Switching ----------

export let scenes:{
    all:Class[],
    keys:string[]
    currentScene: BaseScene,
    switchTo:(sceneName:string)=>void,
    setup:(scene:BaseScene)=>void
} = {
    all: [MainScene, BattleScene],
    keys: ['MainScene', 'BattleScene'],
    currentScene: new BaseScene('undefined'),
    switchTo: function(sceneName):void{
        this.currentScene.scene.launch(sceneName);
    },
    setup: function(scene):void {
        this.currentScene = scene;
    }
}

// ---------- Controls ----------

export let controls = {
    direction: [0,0],
    run: false,
    setupControls,
    updateControls,
    onSelect
};

let _keybinds:{[index: string]: string} = {
    up: 'UP',
    down: 'DOWN',
    left: 'LEFT',
    right: 'RIGHT',
    run: 'SHIFT',
    select: 'ENTER'
};

let _keyboard:{[index: string]: Phaser.Input.Keyboard.Key} = {}

function setupControls(scene: Phaser.Scene){
    for (const inp in _keybinds){
        _keyboard[inp] = scene.input.keyboard.addKey(_keybinds[inp]);
    }
}

function updateControls(){
    controls.direction[0] = +!!_keyboard.left.isDown*-1 + +!!_keyboard.right.isDown*1;
    controls.direction[1] = +!!_keyboard.up.isDown*-1 + +!!_keyboard.down.isDown*1;
    controls.run = _keyboard.run.isDown;
}

function onSelect(callback:()=>void) {
    _keyboard.select.on('up', callback);
}