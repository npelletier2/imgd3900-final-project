import "phaser"
import { BaseScene } from "../BaseScene";
import { scenes } from "../../globals";
import { mainObjects } from "./mainObjects";
import { mainMap } from "./mainMap";
import { StationaryEnemy } from "./enemy"
import { bullets } from "./bullet";

export class MainScene extends BaseScene{
    constructor() {
        super('MainScene');
        scenes.setup(this);
    }

    preload(): void {
        super.preload();
        this.load.setBaseURL('../../assets');
        mainMap.preload();
        mainObjects.preloadAll();
        StationaryEnemy.preload();
        bullets.preload();
    }

    create(): void {
        super.create();
        bullets.create();
        mainMap.create();
        mainObjects.createAll();
        bullets.addOverlap(mainMap.layers.collidable, (bullet)=>{
            bullet.destroy();
        })
    }

    bulletTimer = 20;
    update(): void {
        super.update();
        mainMap.update();
        mainObjects.updateAll();
        this.bulletTimer--;
        if(this.bulletTimer === 0){
            this.bulletTimer = 60;
            bullets.makeBulletXY({x:300, y:200}, {x:0, y:50});
        }
    }
}