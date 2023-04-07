export let map = {
    setupMap
};

function setupMap(scene){
    let tilemap = scene.make.tilemap({key: 'map'});
    let tiles = tilemap.addTilesetImage('sheet', 'sheet');
    tilemap.ground = tilemap.createLayer('ground', tiles, 0, 0);
    tilemap.collidable = tilemap.createLayer('collidable', tiles, 0, 0);
    tilemap.above = tilemap.createLayer('above', tiles, 0, 0);
    
    tilemap.collidable.setCollisionByProperty({collides: true});
    tilemap.above.setDepth(10);

    map = {...map, ...tilemap};
}