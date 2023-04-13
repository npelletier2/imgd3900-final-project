import { scenes } from "../../globals"

export let mainMap:{
    preload:()=>void,
    create:()=>void,
    update:()=>void,
    layers:{[index:string]: Phaser.Tilemaps.TilemapLayer},
    tilemap?: Phaser.Tilemaps.Tilemap
} = {
    layers: {},
    preload: function():void{
        scenes.currentScene.load.image('sheet', 'map/sheet.png');
        scenes.currentScene.load.tilemapTiledJSON('mainMap', 'map/map.json');
    },
    create: function():void{
        this.tilemap = scenes.currentScene.make.tilemap({key: 'mainMap'});
        let tiles = this.tilemap.addTilesetImage('sheet', 'sheet');
        this.layers.ground = this.tilemap.createLayer('ground', tiles, 0, 0);
        this.layers.collidable = this.tilemap.createLayer('collidable', tiles, 0, 0);
        this.layers.above = this.tilemap.createLayer('above', tiles, 0, 0);

        this.layers.collidable.setCollisionByProperty({collides: true});
        this.layers.above.setDepth(10);
    },
    update: function():void{}
}