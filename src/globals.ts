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
    currentScene?: BaseScene,
    switchTo:(sceneName:string)=>void,
    setup:(scene:BaseScene)=>void
} = {
    all: [],
    keys: [],
    switchTo: function(sceneName){
        this.currentScene?.scene.launch(sceneName);
    },
    setup: function(scene){
        this.currentScene = scene;
    }
}
// = {
//    all: [MainScene, BattleScene],
//    keys: ['MainScene', 'BattleScene'],
//    currentScene: new BaseScene('undefined'),
//    switchTo: function(sceneName):void{
//        this.currentScene.scene.launch(sceneName);
//    },
//    setup: function(scene):void {
//        this.currentScene = scene;
//    }
//}

// ---------- Controls ----------

export let controls = {
    direction: [0,0],
    dash: false,
    attack: false,
    setupControls,
    updateControls,
    setDashCallback,
    setAttackCallback
};

let _keybinds:{[index: string]: string} = {
    up: 'UP',
    down: 'DOWN',
    left: 'LEFT',
    right: 'RIGHT',
    dash: 'X',
    attack: 'C',
    select: 'ENTER'
};

let _keyboard:{[index: string]: Phaser.Input.Keyboard.Key} = {}
let _buffer:{[index:string]: number} = {};
let _attackCallback:()=>boolean = function(){return false;};
let _dashCallback:()=>boolean = function(){return false;};

const buf_window = 5;

function setupControls(scene: Phaser.Scene){
    for (const inp in _keybinds){
        _keyboard[inp] = scene.input.keyboard.addKey(_keybinds[inp]);
    }
    _buffer.dash = 0;
    _buffer.attack = 0;

    _keyboard.attack.on('down', ()=>{
        _buffer.attack = buf_window;
    })
    
    _keyboard.dash.on('down', ()=>{
        _buffer.dash = buf_window;
    })
}

function updateControls(){
    controls.direction[0] = +!!_keyboard.left.isDown*-1 + +!!_keyboard.right.isDown*1;
    controls.direction[1] = +!!_keyboard.up.isDown*-1 + +!!_keyboard.down.isDown*1;

    if(_buffer.dash > 0) {
        let success = _dashCallback();
        if(success) _buffer.dash = 0;
        else _buffer.dash--;
    }
    if(_buffer.attack > 0){
        let success = _attackCallback();
        if(success) _buffer.attack = 0;
        else _buffer.attack--;
    }
}

function setAttackCallback(callback:()=>boolean): void{
    _attackCallback = callback;
}
function setDashCallback(callback:()=>boolean): void{
    _dashCallback = callback;
}
