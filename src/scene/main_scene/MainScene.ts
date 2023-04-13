import "phaser"
import { BaseScene, objects } from "../../globals";
import { mainObjects } from "./MainObjects";

export class MainScene extends BaseScene{
    constructor() {
        super('MainScene')
    }

    preload(): void {
        this.load.setBaseURL('../../assets');
        this.load.image('sheet', 'map/sheet.png');
        this.load.tilemapTiledJSON('map', 'map/map.json');
        this.load.spritesheet('slime', 'sprites/slime.png',{
            frameWidth: 16, frameHeight: 16
        });
        this.load.image('barrel', 'sprites/barrel.png');
        for(let prop in objects){
            if(objects[prop].preload){
                objects[prop].preload();
            }
        }
        for(let prop in mainObjects){
            if(mainObjects[prop].preload){
                mainObjects[prop].preload();
            }
        }
    }

    create(): void {
        for(let prop in objects){
            if(objects[prop].create){
                objects[prop].create();
            }
        }
        for(let prop in mainObjects){
            if(mainObjects[prop].create){
                mainObjects[prop].create();
            }
        }
    }

    update(): void {
        for(let prop in objects){
            if(objects[prop].update){
                objects[prop].update();
            }
        }
        for(let prop in mainObjects){
            if(mainObjects[prop].update){
                mainObjects[prop].update();
            }
        }
    }
}