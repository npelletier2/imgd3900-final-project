import { mainObjects } from "./mainObjects"
import { controls, scenes } from "../../globals"
import { mainMap } from "./mainMap"

export {setupPlayer}

let dashHandler = (function(){
    let dashSpeed = 500;
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
        if(dashCooldownTimer != 0){
            dashCooldownTimer--;
            if(mainObjects.player.sprite){
                mainObjects.player.sprite.tint = 0xff33ff;
            }
        }else{
            if(mainObjects.player.sprite){
                mainObjects.player.sprite.tint = 0xffffff;
            }
        }
        if(dashTimer != 0){
            if(mainObjects.player.sprite){
                mainObjects.player.sprite.tint = 0xff00ff;
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

    function playAnim(sprite:Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, animName:string, rot:integer):void{
        sprite.body.enable = true;
        sprite.setRotation(rot);
        sprite.setVisible(true);
        sprite.anims.play(animName).once('animationcomplete', ()=>{
            sprite.setVisible(false);
            sprite.body.enable = false;
        })
    }

    function tryAttack(
        atkDiagSprite : Phaser.Types.Physics.Arcade.SpriteWithDynamicBody, 
        atkCardSprite : Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) : boolean{
        if(attackTimer != 0){
            return false;
        }
        attackTimer = attackCooldown;

        let dir = new Phaser.Math.Vector2(...controls.direction);
        let angle = dir.angle() + Math.PI/2;
        if(angle%(Math.PI/2) === 0){
            playAnim(atkCardSprite, 'atk-card', angle);
        }else{
            playAnim(atkDiagSprite, 'atk-diag', angle+Math.PI/4);
        }

        return true;
    }
    
    function updateAttack(){
        if(attackTimer != 0){
            attackTimer--;
        }
        return attackTimer;
    }

    return {tryAttack, updateAttack};
})();

let player = (function(){
    const _speed = 100;
    let atkDiagSprite : Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    let atkCardSprite : Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    let sprite : Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

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
        (atkCardSprite.body as Phaser.Physics.Arcade.Body).setSize(38,18).setOffset(5,1);
        (atkDiagSprite.body as Phaser.Physics.Arcade.Body).setSize(25,24).setOffset(0,1);
        atkDiagSprite.body.enable = false;
        atkCardSprite.body.enable = false;
    };

    let update = function(): void {
        let dashing = dashHandler.updateDash();
        let attackFrame = attackHandler.updateAttack();

        //get dir and speed, checking dash and attack status
        let dir = controls.direction;
        let currSpeed = _speed;
        if(dashing){
            dir = dashHandler.getDashDir();
            currSpeed = dashHandler.dashSpeed;
        }
        switch(attackFrame){
            case 5:
                currSpeed += 400;
                break;
            case 4:
                currSpeed += 300;
                break;
            case 3:
                currSpeed += 100;
                break;
        }

        //set velocity
        sprite.body.setVelocity(dir[0], dir[1]);
        sprite.body.velocity.normalize().scale(currSpeed);

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

    return {preload, create, update};
})();

function setupPlayer(){
    mainObjects.player = player;
}