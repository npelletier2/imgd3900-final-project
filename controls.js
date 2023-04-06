controls = (function(){
    let _keybinds = {
        up: 'UP',
        down: 'DOWN',
        left: 'LEFT',
        right: 'RIGHT',
        run: 'SHIFT'
    }
    direction = [0,0],
    run = false

    function setupControls(scene){
        for (const inp in _keybinds){
            _keybinds[inp] = scene.input.keyboard.addKey(_keybinds[inp]);
        }
    }

    function getControls(){
        direction[0] = _keybinds.left.isDown*-1 + _keybinds.right.isDown*1;
        direction[1] = _keybinds.up.isDown*-1 + _keybinds.down.isDown*1;
        run = _keybinds.run.isDown;
    }

    return {setupControls, getControls, direction, run}
}());

