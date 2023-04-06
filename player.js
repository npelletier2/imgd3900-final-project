objects.player = (function(){
    let _playerSprite;
    let _speed;
    let _baseSpeed;

    function setup(scene){
        _playerSprite = scene.physics.add.sprite(200, 200, 'slime');
        _speed = 100;
        _baseSpeed = 100;
        scene.physics.add.collider(_playerSprite, map.collidable);
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

    function update(){
        let dir = controls.direction;
        _playerSprite.body.setVelocityX(dir[0]);
        _playerSprite.body.setVelocityY(dir[1]);

        if(dir[0]===0 && dir[1]===0){
            _playerSprite.anims.play('stop');
        }else if(dir[0] > 0){
            _playerSprite.anims.play('right', true);
        }else if(dir[0] < 0){
            _playerSprite.anims.play('left', true);
        }else if(dir[1] > 0){
            _playerSprite.anims.play('down', true);
        }else{
            _playerSprite.anims.play('up', true);
        }

        if(controls.run) _speed = _baseSpeed*2;
        else _speed = _baseSpeed;

        _playerSprite.body.velocity.normalize().scale(_speed);   
    }

    return {setup, update}
})();


