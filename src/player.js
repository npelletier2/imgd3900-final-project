import { controls } from './controls.js';
import { map } from './map.js';

export {makePlayer}

function makePlayer(scene){
    //setup
    let _sprite = scene.physics.add.sprite(200, 200, 'slime');
    let _speed = 100;
    let _baseSpeed = 100;
    scene.physics.add.collider(_sprite, map.collidable);
    scene.anims.create({
        key: 'down',
        frames: scene.anims.generateFrameNumbers('slime', {start:0, end:3}),
        frameRate: 10,
        repeat: -1
    });
    scene.anims.create({
        key: 'left',
        frames: scene.anims.generateFrameNumbers('slime', {start:4, end:7}),
        frameRate: 10,
        repeat: -1
    });
    scene.anims.create({
        key: 'right',
        frames: scene.anims.generateFrameNumbers('slime', {start:8, end:11}),
        frameRate: 10,
        repeat: -1
    });
    scene.anims.create({
        key: 'up',
        frames: scene.anims.generateFrameNumbers('slime', {start:12, end:15}),
        frameRate: 10,
        repeat: -1
    });
    scene.anims.create({
        key: 'stop',
        frames: [{key:'slime', frame:0}],
        frameRate: 10
    });
    _sprite.body.setSize(8, 4).setOffset(4, 9);
    const camera = scene.cameras.main;
    camera.setBounds(0, 0, map.tilemap.widthInPixels, map.tilemap.heightInPixels);
    camera.startFollow(_sprite);

    function update(){
        let dir = controls.direction;
        _sprite.body.setVelocityX(dir[0]);
        _sprite.body.setVelocityY(dir[1]);

        if(dir[0]===0 && dir[1]===0){
            _sprite.anims.play('stop');
        }else if(dir[0] > 0){
            _sprite.anims.play('right', true);
        }else if(dir[0] < 0){
            _sprite.anims.play('left', true);
        }else if(dir[1] > 0){
            _sprite.anims.play('down', true);
        }else{
            _sprite.anims.play('up', true);
        }

        if(controls.run) _speed = _baseSpeed*2;
        else _speed = _baseSpeed;

        _sprite.body.velocity.normalize().scale(_speed);
    }
    
    return {update};
};
