import { scenes } from "../../globals";

export let bullets: {
    group?: Phaser.GameObjects.Group,
    create: ()=>void,
    addOverlap: (other:Phaser.GameObjects.GameObject, callback:ArcadePhysicsCallback)=>void,
    makeBulletXY: (pos:{x:number, y:number}, vel:{x:number, y:number}, damage?:number)=>Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    makeBulletRTheta: (pos:{x:number, y:number}, angle:number, speed:number, damage?:number)=>Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    preload: ()=>void;
} = {
    create, addOverlap, makeBulletXY, makeBulletRTheta, preload
}

function create():void{
    bullets.group = (scenes.currentScene?.add.group() as Phaser.GameObjects.Group);
}

//callback: (bullet, other)=>void
function addOverlap(other:Phaser.GameObjects.GameObject, callback:ArcadePhysicsCallback):void{
    scenes.currentScene?.physics.add.collider(bullets.group as Phaser.GameObjects.Group, other, callback);
}

function makeBulletXY(pos:{x:number, y:number}, vel:{x:number, y:number}, damage:number=10) : Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    let sprite = scenes.currentScene?.physics.add.sprite(pos.x, pos.y, 'bullet') as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    sprite.body.setSize(4,4).setOffset(2,2);
    sprite.body.setVelocity(vel.x, vel.y);
    sprite.setData('damage', damage);
    bullets.group?.add(sprite);
    return sprite;
}

function makeBulletRTheta(pos:{x:number, y:number}, angle:number, speed:number, damage:number=10) : Phaser.Types.Physics.Arcade.SpriteWithDynamicBody{
    let vel = new Phaser.Math.Vector2(1,0);
    vel.rotate(angle).scale(speed);
    return makeBulletXY(pos, {x:vel.x, y:vel.y}, damage);
}

function preload(){
    scenes.currentScene?.load.image('bullet', 'sprites/bullet.png');
}

//export class Bullet implements ObjectGame{
//    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
//    readonly startpos: {x:number, y:number};
//    vel: {x:number, y:number};
//    dmg: number;
//
//    constructor(startpos:{x:number, y:number}, vel:{x:number, y:number}, dmg=10){
//        this.sprite = null as unknown as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
//        this.startpos = {...startpos};
//        this.vel = {...vel};
//        this.dmg = dmg;
//        if(scenes.currentScene){
//            this.create();
//        }
//    }
//
//    static preload(){
//        scenes.currentScene?.load.image('bullet', 'sprites/bullet.png');
//    }
//
//    onWallCollide(sprite:Phaser.Types.Physics.Arcade.GameObjectWithBody){
//        sprite.destroy();
//    }
//
//    create(){
//        this.sprite = scenes.currentScene?.physics.add.sprite(this.startpos.x, this.startpos.y, 'bullet') as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
//        bullets.group?.add(this.sprite);
//        this.sprite.body.setSize(4,4).setOffset(2,2);
//        this.sprite.body.setVelocity(this.vel.x, this.vel.y);
//        this.sprite.setData('damage', this.dmg);
//
//        scenes.currentScene?.physics.add.collider(
//            this.sprite, 
//            mainMap.layers.collidable, 
//            this.onWallCollide
//        );
//    }
//
//    update(){
//    }
//}