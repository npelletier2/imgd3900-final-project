import { controls, objects, scenes } from "./globals";
import { MainScene } from "./scene/main_scene/MainScene";
import { BaseScene } from "./scene/BaseScene";
import { setupPlayer } from "./scene/main_scene/player";
import "./style.css";
import "phaser";

//setup scenes object
scenes.all =  [MainScene];
scenes.keys = ['MainScene'];

//setup BaseScene
BaseScene.prototype.preload = function(){
  scenes.setup(this);
  for(let prop in objects){
    objects[prop].preload?.();
  }
}
BaseScene.prototype.create = function(){
  controls.setupControls(this);
  for(let prop in objects){
    objects[prop].create?.();
  }
}
BaseScene.prototype.update = function(){
  controls.updateControls();
  for(let prop in objects){
    objects[prop].update?.();
  }
}

//setup player
setupPlayer();

let widthTiles = 44;
let heightTiles = 25;
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: widthTiles*16,
  height: heightTiles*16,
  zoom: 2,
  parent: 'game',
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
  },
  scene: scenes.all
};

new Phaser.Game(config);
