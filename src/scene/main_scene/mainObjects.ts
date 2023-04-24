import { Object, controls, scenes } from "../../globals";
import { mainMap } from "./mainMap";

export let mainObjects:{[index:string]:Object} = {};

mainObjects.player = {
    _speed: 100,
    _dashSpeed: 500,
    _dashFrames: 5,
    _dashCooldown: 20,

    _dashTimer: 0,
    _dashCooldownTimer: 0,
    tryDash: function(): boolean {
        if(mainObjects.player._dashCooldownTimer != 0){
            return true;
        }

        mainObjects.player._dashTimer = mainObjects.player._dashFrames;
        mainObjects.player._dashCooldownTimer = mainObjects.player._dashCooldown;
        
        return true;
    },

    preload: function(): void {
        scenes.currentScene?.load.spritesheet('slime', 'sprites/slime.png',{
            frameWidth: 16, frameHeight: 16
        });
    },
    create: function(): void {
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
        controls.setDashCallback(mainObjects.player.tryDash);
    },
    update: function(): void {
        //get direction
        let dir = controls.direction;
        (mainObjects.player.sprite?.body as Phaser.Physics.Arcade.Body).setVelocity(dir[0], dir[1]);

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

        //set speed, checking dash status
        let currSpeed = 0;
        if(mainObjects.player._dashTimer != 0){
            currSpeed = mainObjects.player._dashSpeed;
            mainObjects.player._dashTimer--;
        }else{
            currSpeed = mainObjects.player._speed;
        }
        (mainObjects.player.sprite?.body as Phaser.Physics.Arcade.Body).velocity.normalize().scale(currSpeed);

        //update dash cooldown
        if(mainObjects.player._dashCooldownTimer != 0){
            mainObjects.player._dashCooldownTimer--;
        }
    }
}