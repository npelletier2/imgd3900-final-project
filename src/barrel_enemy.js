import { objects } from "./objects.js";
import { map } from "./map.js";

export {makeBarrel}

function makeBarrel(scene, sprite){
    let _sprite = sprite;
    let _overlapping = false;
    scene.physics.add.existing(_sprite);

    function onPlayerOverlap(barrelSprite, playerSprite){
        if(!_overlapping){
            _overlapping = true;
            map.swapToBattle(scene, [{sprite: _sprite}], _sprite);
        }
    }

    function update(){
       scene.physics.overlap(_sprite, objects.player.sprite, onPlayerOverlap);
    }

    return {update};
}