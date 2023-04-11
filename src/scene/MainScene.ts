import "phaser"
import { objects } from "../globals";

export class MainScene extends Phaser.Scene{
    constructor() {
        super({
            key: 'MainScene'
        })
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
    }

    create(): void {
        for(let prop in objects){
            if(objects[prop].create){
                objects[prop].create();
            }
        }
    }

    update(): void {
        for(let prop in objects){
            if(objects[prop].update){
                objects[prop].update();
            }
        }
    }
}