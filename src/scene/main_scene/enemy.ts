import "phaser"
import { scenes, ObjectGame } from '../../globals'
import { player } from "./player"
//import { mainObjects } from "./mainObjects"
import { bullets } from "./bullet"

export let enemies : {
    group?: Phaser.GameObjects.Group,
    preload: ()=>void,
    create: ()=>void,
    addOverlap: (other:Phaser.GameObjects.GameObject, callback:ArcadePhysicsCallback)=>void,
    makeEnemy: (id:number, pos:Phaser.Math.Vector2)=>Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    updateAll: ()=>void,
    resetCanDamage: ()=>void
} = {
    preload, create, addOverlap, makeEnemy, updateAll, resetCanDamage
}

function findVecToPlayer(enemy:Phaser.Types.Physics.Arcade.SpriteWithDynamicBody): Phaser.Math.Vector2{
    let playerLoc = player.sprite?.getCenter() as Phaser.Math.Vector2;
    let enemyLoc = enemy.getCenter() as Phaser.Math.Vector2;
    return playerLoc.subtract(enemyLoc);
}

// define logic of enemy types
let initFunctions: ((enemy:Phaser.Types.Physics.Arcade.SpriteWithDynamicBody)=>void)[] = [];
let updateFunctions: ((enemy:Phaser.Types.Physics.Arcade.SpriteWithDynamicBody)=>void)[] = [];

initFunctions[0] = (enemy)=>{
    enemy.setSize(10,15).setOffset(1,0);
    enemy.setData('atkCooldown', 60);
    enemy.setData('atkTimer', 60);
    enemy.setData('health', 30);
    enemy.setData('damage', (dmg:number)=>{
        if(enemy.getData('canReceiveDamage')){
            enemy.setData('health', enemy.getData('health')-dmg);
            enemy.setData('canReceiveDamage', false);
            if(enemy.getData('health') <= 0){
                enemy.destroy();
            }
        }
    })
    enemy.setData('canReceiveDamage', true);
}
updateFunctions[0] = (enemy)=>{
    enemy.setData('atkTimer', enemy.getData('atkTimer')-1);
    if(enemy.getData('atkTimer') === 0){
        enemy.setData('atkTimer', enemy.getData('atkCooldown'));

        let angle = findVecToPlayer(enemy).angle();
        let speed = 100;
        let enemyPos = enemy.getCenter() as Phaser.Math.Vector2;
        bullets.makeBulletRTheta(enemyPos, angle, speed, 10);
        bullets.makeBulletRTheta(enemyPos, angle+(Math.PI/8), speed, 10);
        bullets.makeBulletRTheta(enemyPos, angle-(Math.PI/8), speed, 10);
    }
}

function preload(){
    scenes.currentScene?.load.image('enemy0', 'sprites/barrel.png');
}

function create(){
    enemies.group = (scenes.currentScene?.add.group() as Phaser.GameObjects.Group);
}

function addOverlap(other:Phaser.GameObjects.GameObject, callback:ArcadePhysicsCallback):void{
    scenes.currentScene?.physics.add.overlap(enemies.group as Phaser.GameObjects.Group, other, callback);
}

function makeEnemy(id:number, pos:Phaser.Math.Vector2){
    let sprite = scenes.currentScene?.physics.add.sprite(pos.x, pos.y, `enemy${id}`) as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    initFunctions[id](sprite);
    sprite.update = updateFunctions[id];
    enemies.group?.add(sprite);

    return sprite;
}

function updateAll(){
    enemies.group?.getChildren().forEach((enemy)=>{enemy.update(enemy)})
}

function resetCanDamage(){
    enemies.group?.getChildren().forEach((enemy)=>{enemy.setData('canReceiveDamage', true)})
}

export class StationaryEnemy implements ObjectGame{
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    readonly x: number;
    readonly y: number;

    constructor(x:number, y:number){
        this.x = x;
        this.y = y;
        this.sprite = null as unknown as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    }
}
