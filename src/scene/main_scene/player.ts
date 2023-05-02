import { mainObjects } from "./mainObjects"
import { ObjectGame, controls, scenes } from "../../globals"
import { bullets } from "./bullet"
import { mainMap } from "./mainMap"

export {setupPlayer}

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
        let sprite = (mainObjects.player as ObjectGame).sprite
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
                    atkSpeed = 400;
                    break;
                case 3:
                    atkSpeed += 300;
                    break;
                case 2:
                    atkSpeed += 200;
                    break;
                case 1:
                    atkSpeed += 100;
                    break;
            }
        }
        let atkVector = attackDir.clone();
        atkVector.normalize().scale(atkSpeed);
        return atkVector;
    }

    return {tryAttack, updateAttack};
})();

let player = (function(){
    const _speed = 150;
    let atkDiagSprite : Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    let atkCardSprite : Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    let sprite : Phaser.Types.Physics.Arcade.SpriteWithDynamicBody = null as unknown as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    let health = 100;

    const preload = function(): void {
        scenes.currentScene?.load.spritesheet('slime', 'sprites/slime.png',{
            frameWidth: 16, frameHeight: 16
        });
        scenes.currentScene?.load.spritesheet('attack-diag', 'sprites/swing-diag.png', {
            frameWidth: 48, frameHeight: 48
        });
        scenes.currentScene?.load.spritesheet('attack-card', 'sprites/swing-vert.png', {
            frameWidth: 48, frameHeight: 48
        });
    };
    let create = function(): void {
        //make sprite
        sprite = (scenes.currentScene?.physics.add.sprite(200, 200, 'slime') as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody);
        atkDiagSprite = (scenes.currentScene?.physics.add.sprite(200, 200, 'atk-diag') as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody);
        atkCardSprite = (scenes.currentScene?.physics.add.sprite(200, 200, 'atk-card') as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody);

        //set player sprite size
        sprite.body.setSize(8,4).setOffset(4,6);

        //collide with collidable layer of map
        scenes.currentScene?.physics.add.collider((sprite as Phaser.GameObjects.GameObject), mainMap.layers.collidable);

        //setup attack sprites
        atkDiagSprite.setVisible(false);
        atkCardSprite.setVisible(false);

        //set up anims
        scenes.currentScene?.anims.create({
            key: 'down',
            frames: scenes.currentScene.anims.generateFrameNumbers('slime', {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });
        scenes.currentScene?.anims.create({
            key: 'left',
            frames: scenes.currentScene.anims.generateFrameNumbers('slime', {start: 4, end: 7}),
            frameRate: 10,
            repeat: -1
        });
        scenes.currentScene?.anims.create({
            key: 'right',
            frames: scenes.currentScene.anims.generateFrameNumbers('slime', {start: 8, end: 11}),
            frameRate: 10,
            repeat: -1
        });
        scenes.currentScene?.anims.create({
            key: 'up',
            frames: scenes.currentScene.anims.generateFrameNumbers('slime', {start: 12, end: 15}),
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
        camera.startFollow((sprite as Phaser.GameObjects.GameObject));

        //set dash callback
        controls.setDashCallback(dashHandler.tryDash);
        controls.setAttackCallback(()=>{return attackHandler.tryAttack(atkDiagSprite, atkCardSprite)});

        atkDiagSprite.anims.play('atk-diag');
        atkCardSprite.anims.play('atk-card');
        atkDiagSprite.body.enable = false;
        atkCardSprite.body.enable = false;

        //bullet hit callback
        bullets.addOverlap(sprite, (bullet, other)=>{
            let dmg = bullet.getData('damage');
            bullet.destroy();
            player.damage(dmg)
        })
    };

    let update = function(): void {
        let dashing = dashHandler.updateDash();
        let atkVector = attackHandler.updateAttack();
        
        //get dir and speed, checking dash and attack status
        let dir = controls.direction;
        let currSpeed = _speed;
        if(dashing){
            dir = dashHandler.getDashDir();
            currSpeed = dashHandler.dashSpeed;
        }

        let vel = new Phaser.Math.Vector2(...dir);
        vel.normalize().scale(currSpeed);
        vel.add(atkVector);

        //set velocity
        sprite.body.setVelocity(vel.x, vel.y);

        //play correct animation
        if(dir[0]===0 && dir[1]===0){
            sprite.anims.play('stop');
        }else if(dir[0] > 0){
            sprite.anims.play('right', true);
        }else if(dir[0] < 0){
            sprite.anims.play('left', true);
        }else if(dir[1] > 0){
            sprite.anims.play('down', true);
        }else{
            sprite.anims.play('up', true);
        }

        //set atk sprite positions
        let center = (sprite.getCenter() as Phaser.Math.Vector2);
        atkDiagSprite.setPosition(center.x, center.y);
        atkCardSprite.setPosition(center.x, center.y);
    };

    let damage = function(dmg: number){
        health -= dmg;
        console.log(health)
    }

    return {sprite, preload, create, update, damage};
})();

function setupPlayer(){
    mainObjects.player = player;
}