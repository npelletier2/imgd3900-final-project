import "phaser"
import { BaseScene } from "../BaseScene";
import { controls, objects, scenes } from "../../globals";
import { mainObjects } from "./mainObjects";
import { mainMap } from "./mainMap";

export class MainScene extends BaseScene{
    constructor() {
        super('MainScene');
        scenes.setup(this);
    }

    preload(): void {
        super.preload();
        this.load.setBaseURL('../../assets');
        mainMap.preload();
        this.load.image('barrel', 'sprites/barrel.png');
        for(let prop in mainObjects){
            mainObjects[prop].preload?.();
        }
    }

    create(): void {
        super.create();
        mainMap.create();
        for(let prop in mainObjects){
            mainObjects[prop].create?.();
        }
    }

    update(): void {
        super.update();
        mainMap.update();
        for(let prop in mainObjects){
            mainObjects[prop].update?.();
        }
    }
}