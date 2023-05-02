import "phaser"
import { scenes, ObjectGame } from '../../globals'

export class StationaryEnemy implements ObjectGame{
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    readonly x: number;
    readonly y: number;

    constructor(x:number, y:number){
        this.x = x;
        this.y = y;
        this.sprite = null as unknown as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    }

    static preload(){
        scenes.currentScene?.load.image('star', 'sprites/star.png');

    }
}
