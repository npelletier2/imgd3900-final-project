//import { mainObjects } from "./mainObjects"
import { controls, scenes } from "../../globals"
import { bullets } from "./bullet"
import { enemies } from "./enemy";
import { mainMap } from "./mainMap"

let health = 100;
let healthText: Phaser.GameObjects.Text | undefined;
let baseSpeed = 150;
export let player : {
    sprite?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    atkDiagSprite?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    atkCardSprite?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
    preload: ()=>void,
    create: ()=>void,
    update: ()=>void,
    damage: (dmg:number)=>void
} = {
    preload, create, update, damage
}

function preload(): void {
    scenes.currentScene?.load.spritesheet('slime', 'sprites/player.png',{
        frameWidth: 32, frameHeight: 32
    });
    scenes.currentScene?.load.spritesheet('attack-diag', 'sprites/swing-diag.png', {
        frameWidth: 48, frameHeight: 48
    });
    scenes.currentScene?.load.spritesheet('attack-card', 'sprites/swing-vert.png', {
        frameWidth: 48, frameHeight: 48
    });
};

function create(): void {
    //make sprite
    player.sprite = (scenes.currentScene?.physics.add.sprite(200, 200, 'slime') as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody);
    player.atkDiagSprite = (scenes.currentScene?.physics.add.sprite(200, 200, 'atk-diag') as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody);
    player.atkCardSprite = (scenes.currentScene?.physics.add.sprite(200, 200, 'atk-card') as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody);

    //set player sprite size
    player.sprite.body.setSize(11,18).setOffset(11,7);

    //collide with collidable layer of map
    scenes.currentScene?.physics.add.collider((player.sprite as Phaser.GameObjects.GameObject), mainMap.layers.collidable);

    //setup attack sprites
    player.atkDiagSprite.setVisible(false);
    player.atkCardSprite.setVisible(false);

    //set up anims
    scenes.currentScene?.anims.create({
        key: 'down',
        frames: scenes.currentScene.anims.generateFrameNumbers('slime', {start: 1, end: 2}),
        frameRate: 10,
        repeat: -1
    });
    scenes.currentScene?.anims.create({
        key: 'right',
        frames: scenes.currentScene.anims.generateFrameNumbers('slime', {start: 4, end: 5}),
        frameRate: 10,
        repeat: -1
    });
    scenes.currentScene?.anims.create({
        key: 'left',
        frames: scenes.currentScene.anims.generateFrameNumbers('slime', {start: 7, end: 8}),
        frameRate: 10,
        repeat: -1
    });
    scenes.currentScene?.anims.create({
        key: 'up',
        frames: scenes.currentScene.anims.generateFrameNumbers('slime', {start: 10, end: 11}),
        frameRate: 10,
        repeat: -1
    });
    scenes.currentScene?.anims.create({
        key: 'stop',
        frames: [{key: 'slime', frame:0}],
        frameRate: 10,
    });

    //attack anims
    scenes.currentScene?.anims.create({
        key: 'atk-diag',
        frames: scenes.currentScene.anims.generateFrameNumbers('attack-diag', {start:0, end:2}),
        frameRate: 20,
    });
    scenes.currentScene?.anims.create({
        key: 'atk-card',
        frames: scenes.currentScene.anims.generateFrameNumbers('attack-card', {start:0, end:2}),
        frameRate: 20,
    });

    //camera follows player
    const camera = (scenes.currentScene?.cameras.main as Phaser.Cameras.Scene2D.Camera);
    camera.setBounds(0, 0, (mainMap.tilemap?.widthInPixels as number), (mainMap.tilemap?.heightInPixels as number));
    //camera.startFollow((player.sprite as Phaser.GameObjects.GameObject));

    //set dash callback
    controls.setDashCallback(dashHandler.tryDash);
    controls.setAttackCallback(()=>{return attackHandler.tryAttack(
        player.atkDiagSprite as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, 
        player.atkCardSprite as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody)});

    player.atkDiagSprite.anims.play('atk-diag');
    player.atkCardSprite.anims.play('atk-card');
    player.atkDiagSprite.body.enable = false;
    player.atkCardSprite.body.enable = false;

    //bullet hit callback
    bullets.addOverlap(player.sprite, (bullet)=>{
        let dmg = bullet.getData('damage');
        bullet.destroy();
        player.damage(dmg);
    })
    bullets.addOverlap(player.atkCardSprite, (bullet)=>{
        bullet.destroy();
    })
    bullets.addOverlap(player.atkDiagSprite, (bullet)=>{
        bullet.destroy();
    })

    //enemy damage
    enemies.addOverlap(player.atkCardSprite, (enemy)=>{
        enemy.getData('damage')(10);
    })
    enemies.addOverlap(player.atkDiagSprite, (enemy)=>{
        enemy.getData('damage')(10);
    })

    //health text
    healthText = scenes.currentScene?.add.text(20, 20, `Health: ${health}`)
};

function update(): void {
    let dashing = dashHandler.updateDash();
    let atkVector = attackHandler.updateAttack();
    
    //get dir and speed, checking dash and attack status
    let dir = controls.direction;
    let currSpeed = baseSpeed;
    if(dashing){
        dir = dashHandler.getDashDir();
        currSpeed = dashHandler.dashSpeed;
    }

    let vel = new Phaser.Math.Vector2(...dir);
    vel.normalize().scale(currSpeed);
    vel.add(atkVector);

    //set velocity
    player.sprite?.body.setVelocity(vel.x, vel.y);

    //play correct animation
    if(dir[0]===0 && dir[1]===0){
        player.sprite?.anims.play('stop');
    }else if(dir[0] > 0){
        player.sprite?.anims.play('right', true);
    }else if(dir[0] < 0){
        player.sprite?.anims.play('left', true);
    }else if(dir[1] > 0){
        player.sprite?.anims.play('down', true);
    }else{
        player.sprite?.anims.play('up', true);
    }

    //set atk sprite positions
    let center = (player.sprite?.getCenter() as Phaser.Math.Vector2);
    player.atkDiagSprite?.setPosition(center.x, center.y);
    player.atkCardSprite?.setPosition(center.x, center.y);
};

function damage(dmg: number){
    health -= dmg;
    updateText();
}

let dashHandler = (function(){
    let dashSpeed = 700;
    let dashFrames = 8;
    let dashCooldown = 23;

    let dashTimer = 0;
    let dashCooldownTimer = 0;
    let dashDir = [0,0];
    
    function tryDash(): boolean {
        if(dashCooldownTimer != 0){
            return false;
        }
        
        //pause scene briefly for more dash impact
        scenes.currentScene?.physics.world.pause();
        setTimeout(()=>{
            scenes.currentScene?.physics.world.resume();
        }, 50)
        
        dashTimer = dashFrames;
        dashCooldownTimer = dashCooldown;
        dashDir = [...controls.direction];
        
        return true;
    }

    function updateDash():boolean{
        let sprite = player.sprite
        if(dashCooldownTimer != 0){
            dashCooldownTimer--;
            if(sprite){
                sprite.tint = 0xff33ff;
            }
        }else{
            if(sprite){
                sprite.tint = 0xffffff;
            }
        }
        if(dashTimer != 0){
            if(sprite){
                sprite.tint = 0xff00ff;
            }
            dashTimer--;
            return true;
        }else{
            return false;
        }
    }

    function getDashDir(){
        return dashDir;
    }

    return {tryDash, updateDash, getDashDir, dashSpeed}
})();

let attackHandler = (function(){
    let attackCooldown = 5;
    let attackTimer = 0;
    let attackDir = new Phaser.Math.Vector2(0,0);

    function playAnim(sprite:Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, animName:string, rot:number):void{
        sprite.body.enable = true;
        sprite.setRotation(rot);
        sprite.setVisible(true);
        sprite.anims.play(animName).once('animationcomplete', ()=>{
            sprite.setVisible(false);
            sprite.body.enable = false;
        })
    }

    function setCardBox(
        atkCardSprite : Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, 
        angle: number)
        {
        let boxnum = 0;
        boxnum += +!(angle % (2*Math.PI)); //test for up
        boxnum += 2*(+!((angle - (Math.PI/2)) % (2*Math.PI))) //test for right
        boxnum += 4*(+!((angle - (Math.PI)) % (2*Math.PI))) //test for down
        boxnum += 8*(+!((angle - (3*Math.PI/2)) % (2*Math.PI))) //test for left
        switch(boxnum){
            case 1:
                atkCardSprite.body.setSize(38,18).setOffset(5,1);
                break;
            case 2:
                atkCardSprite.body.setSize(18,38).setOffset(29,5);
                break;
            case 4:
                atkCardSprite.body.setSize(38,18).setOffset(5,29);
                break;
            case 8:
                atkCardSprite.body.setSize(18,38).setOffset(1,5);
                break;
            default:
                console.log(boxnum)
        }
    }

    function setDiagBox(
        atkDiagSprite : Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, 
        angle: number)
        {
        let boxnum = 0;
        boxnum += +!(angle % (2*Math.PI)); //test for up
        boxnum += 2*(+!((angle - (Math.PI/2)) % (2*Math.PI))) //test for right
        boxnum += 4*(+!((angle - (Math.PI)) % (2*Math.PI))) //test for down
        boxnum += 8*(+!((angle - (3*Math.PI/2)) % (2*Math.PI))) //test for left
        switch(boxnum){
            case 1:
                atkDiagSprite.body.setSize(25,24).setOffset(0,1);
                break;
            case 2:
                atkDiagSprite.body.setSize(24,25).setOffset(23,0);
                break;
            case 4:
                atkDiagSprite.body.setSize(25,24).setOffset(23,23);
                break;
            case 8:
                atkDiagSprite.body.setSize(24,25).setOffset(1,23);
                break;
            default:
                console.log(boxnum)
        }
    }

    function tryAttack(
        atkDiagSprite : Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, 
        atkCardSprite : Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) : boolean
        {
        if(attackTimer != 0){
            return false;
        }
        attackTimer = attackCooldown;

        enemies.resetCanDamage();

        let angle = attackDir.angle() + Math.PI/2;
        if(angle%(Math.PI/2) === 0){
            setCardBox(atkCardSprite, angle);
            playAnim(atkCardSprite, 'atk-card', angle);
        }else{
            setDiagBox(atkDiagSprite, angle+Math.PI/4);
            playAnim(atkDiagSprite, 'atk-diag', angle+Math.PI/4);
        }

        return true;
    }
    
    function updateAttack(){
        let dir = new Phaser.Math.Vector2(...controls.direction);
        if(!(dir.x===0 && dir.y===0)){
            attackDir.x = dir.x;
            attackDir.y = dir.y;
        }
        let atkSpeed = 0;
        if(attackTimer != 0){
            attackTimer--;
            switch(attackTimer){
                case 4:
                    atkSpeed = 300;
                    break;
                case 3:
                    atkSpeed += 100;
                    break;
                case 2:
                    atkSpeed += 50;
                    break;
            }
        }
        let atkVector = attackDir.clone();
        atkVector.normalize().scale(atkSpeed);
        return atkVector;
    }

    return {tryAttack, updateAttack};
})();

function updateText(){
    if(healthText) healthText.text = `Health: ${health}`
}
//function setupPlayer(){
//    mainObjects.player = player;
//}