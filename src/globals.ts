import { MainScene } from "./scene/main_scene/MainScene";
import { BattleScene } from "./scene/battle_scene/BattleScene";

export let objects:any = {};

// ---------- Scene Switching ----------

export let scenes:{
    all:Class[],
    keys:string[]
    currentScene: BaseScene | undefined,
    switchTo:(sceneName:string)=>void,
    setup:(scene:BaseScene)=>void
} = {
    all: [MainScene, BattleScene],
    keys: ['MainScene', 'BattleScene'],
    currentScene: undefined,
    switchTo: function(sceneName):void{
        this.currentScene?.scene.launch(sceneName);
    },
    setup: function(scene):void {
        this.currentScene = scene;
    }
}

export class BaseScene extends Phaser.Scene{
    constructor(key:string){
        super({key});
        scenes.setup(this);
    }
    preload():void{}
    create():void{}
    update():void{}
}

// ---------- Controls ----------

export let controls = {
    direction: [0,0],
    run: false,
    setupControls,
    updateControls,
    onSelect
};

let _keybinds:any = {
    up: 'UP',
    down: 'DOWN',
    left: 'LEFT',
    right: 'RIGHT',
    run: 'SHIFT',
    select: 'ENTER'
};

function setupControls(scene: Phaser.Scene){
    for (const inp in _keybinds){
        _keybinds[inp] = scene.input.keyboard.addKey(_keybinds[inp]);
    }
}

function updateControls(){
    controls.direction[0] = _keybinds.left.isDown*-1 + _keybinds.right.isDown*1;
    controls.direction[1] = _keybinds.up.isDown*-1 + _keybinds.down.isDown*1;
    controls.run = _keybinds.run.isDown;
}

function onSelect(callback:()=>void) {
    _keybinds.select.on('up', callback);
}