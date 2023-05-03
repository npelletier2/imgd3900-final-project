import "phaser"
import { BaseScene } from "../BaseScene";
import { scenes } from "../../globals";
import { mainObjects } from "./mainObjects";
import { mainMap } from "./mainMap";
import { enemies } from "./enemy"
import { bullets } from "./bullet";
import { player } from "./player";

export class MainScene extends BaseScene{
    constructor() {
        super('MainScene');
        scenes.setup(this);
    }

    preload(): void {
        super.preload();
        this.load.setBaseURL('../../assets');
        mainMap.preload();
        //mainObjects.preloadAll();
        player.preload();
        enemies.preload();
        bullets.preload();
    }

    create(): void {
        super.create();
        bullets.create();
        mainMap.create();
        //mainObjects.createAll();
        player.create();
        enemies.create();
        this.physics.add.collider(bullets.group as Phaser.GameObjects.Group, mainMap.layers.collidable, (bullet)=>{
            bullet.destroy();
        })
        enemies.makeEnemy(0, new Phaser.Math.Vector2(100,100))
    }

    update(): void {
        super.update();
        mainMap.update();
        player.update();
        //mainObjects.updateAll();
        enemies.updateAll();
    }
}