import { mainObjects } from "./mainObjects"
import { controls, scenes } from "../../globals"
import { mainMap } from "./mainMap"

export {setupPlayer}

let dashHandler = (function(){
    let dashSpeed = 500;
    let dashFrames = 5;
    let dashCooldown = 20;

    let dashTimer = 0;
    let dashCooldownTimer = 0;
    let dashDir = [0,0];
    
    function tryDash(): boolean {
        if(dashCooldownTimer != 0){
            return false;
        }
        
        dashTimer = dashFrames;
        dashCooldownTimer = dashCooldown;
        dashDir = [...controls.direction];
        
        return true;
    }

    function updateDash():boolean{
        if(dashCooldownTimer != 0){
            dashCooldownTimer--;
        }
        if(dashTimer != 0){
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

let player = (function(){
    const _speed = 100;

    const preload = function(): void {
        scenes.currentScene?.load.spritesheet('slime', 'sprites/slime.png',{
            frameWidth: 16, frameHeight: 16
        });
    };
    let create = function(): void {
        //make sprite
        mainObjects.player.sprite = scenes.currentScene?.physics.add.sprite(200, 200, 'slime');

        //set sprite size
        (mainObjects.player.sprite?.body as Phaser.Physics.Arcade.Body).setSize(8,4).setOffset(4,9);

        //collide with collidable layer of map
        scenes.currentScene?.physics.add.collider((mainObjects.player.sprite as Phaser.GameObjects.GameObject), mainMap.layers.collidable);

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

        //camera follows player
        const camera = (scenes.currentScene?.cameras.main as Phaser.Cameras.Scene2D.Camera);
        camera.setBounds(0, 0, (mainMap.tilemap?.widthInPixels as number), (mainMap.tilemap?.heightInPixels as number));
        camera.startFollow((mainObjects.player.sprite as Phaser.GameObjects.GameObject));

        //set dash callback
        controls.setDashCallback(dashHandler.tryDash);
    };
    let update = function(): void {
        let dashing = dashHandler.updateDash();

        //get dir and speed, checking dash status
        let dir = controls.direction;
        let currSpeed = _speed;
        if(dashing){
            dir = dashHandler.getDashDir();
            console.log(dir);
            currSpeed = dashHandler.dashSpeed;
        }

        //set velocity
        (mainObjects.player.sprite?.body as Phaser.Physics.Arcade.Body).setVelocity(dir[0], dir[1]);
        (mainObjects.player.sprite?.body as Phaser.Physics.Arcade.Body).velocity.normalize().scale(currSpeed);

        //play correct animation
        if(dir[0]===0 && dir[1]===0){
            mainObjects.player.sprite?.anims.play('stop');
        }else if(dir[0] > 0){
            mainObjects.player.sprite?.anims.play('right', true);
        }else if(dir[0] < 0){
            mainObjects.player.sprite?.anims.play('left', true);
        }else if(dir[1] > 0){
            mainObjects.player.sprite?.anims.play('down', true);
        }else{
            mainObjects.player.sprite?.anims.play('up', true);
        }
    };

    return {preload, create, update};
})();

function setupPlayer(){
    mainObjects.player = player;
}