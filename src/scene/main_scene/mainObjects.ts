import { Object, controls, scenes } from "../../globals";
import { mainMap } from "./mainMap";

export let mainObjects:{[index:string]:Object} = {};

mainObjects.player = {
    _speed: 100,
    _baseSpeed: 100,
    preload: function(): void {
        scenes.currentScene.load.spritesheet('slime', 'sprites/slime.png',{
            frameWidth: 16, frameHeight: 16
        });
    },
    create: function(): void {
        this.sprite = scenes.currentScene.physics.add.sprite(200, 200, 'slime');

        scenes.currentScene.physics.add.collider(this.sprite, mainMap.layers.collidable);

        scenes.currentScene.anims.create({
            key: 'down',
            frames: scenes.currentScene.anims.generateFrameNumbers('slime', {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });
        scenes.currentScene.anims.create({
            key: 'left',
            frames: scenes.currentScene.anims.generateFrameNumbers('slime', {start: 4, end: 7}),
            frameRate: 10,
            repeat: -1
        });
        scenes.currentScene.anims.create({
            key: 'right',
            frames: scenes.currentScene.anims.generateFrameNumbers('slime', {start: 8, end: 11}),
            frameRate: 10,
            repeat: -1
        });
        scenes.currentScene.anims.create({
            key: 'up',
            frames: scenes.currentScene.anims.generateFrameNumbers('slime', {start: 12, end: 15}),
            frameRate: 10,
            repeat: -1
        });
        scenes.currentScene.anims.create({
            key: 'stop',
            frames: [{key: 'slime', frame:0}],
            frameRate: 10,
        });

        (this.sprite.body as Phaser.Physics.Arcade.Body).setSize(8,4).setOffset(4,9);

        const camera = scenes.currentScene.cameras.main;
        camera.setBounds(0, 0, (mainMap.tilemap?.widthInPixels as number), (mainMap.tilemap?.heightInPixels as number));
        camera.startFollow(this.sprite);
    },
    update: function(): void {
        let dir = controls.direction;
        (this.sprite?.body as Phaser.Physics.Arcade.Body).setVelocity(dir[0], dir[1]);

        if(dir[0]===0 && dir[1]===0){
            this.sprite?.anims.play('stop');
        }else if(dir[0] > 0){
            this.sprite?.anims.play('right', true);
        }else if(dir[0] < 0){
            this.sprite?.anims.play('left', true);
        }else if(dir[1] > 0){
            this.sprite?.anims.play('down', true);
        }else{
            this.sprite?.anims.play('up', true);
        }

        if(controls.run){
            this._speed = this._baseSpeed*2;
        }else{
            this._speed = this._baseSpeed;
        }

        (this.sprite?.body as Phaser.Physics.Arcade.Body).velocity.normalize().scale(this._speed);
    }
}