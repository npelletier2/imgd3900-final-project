function createMap(scene){
    map = scene.make.tilemap({key: 'map'});
    let tiles = map.addTilesetImage('sheet', 'sheet');
    map.ground = map.createLayer('ground', tiles, 0, 0);
    map.collidable = map.createLayer('collidable', tiles, 0, 0);
    map.above = map.createLayer('above', tiles, 0, 0);
    
    map.collidable.setCollisionByProperty({collides: true});
    map.above.setDepth(10);
}