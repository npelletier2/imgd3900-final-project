function createPlayer(scene){
    objects.player = scene.physics.add.sprite(200, 200, 'slime');
    objects.player.speed = 100;
    scene.physics.add.collider(objects.player, map.collidable);
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
}

function movePlayer(dir){
    objects.player.body.setVelocityX(dir[0]);
    objects.player.body.setVelocityY(dir[1]);

    if(dir[0]===0 && dir[1]===0){
        objects.player.anims.play('stop');
    }else if(dir[0] > 0){
        objects.player.anims.play('right', true);
    }else if(dir[0] < 0){
        objects.player.anims.play('left', true);
    }else if(dir[1] > 0){
        objects.player.anims.play('down', true);
    }else{
        objects.player.anims.play('up', true);
    }

    objects.player.body.velocity.normalize().scale(objects.player.speed);   
}