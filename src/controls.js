export let controls = {
    direction: [0,0],
    run: false,
    setupControls,
    updateControls
};

let _keybinds = {
    up: 'UP',
    down: 'DOWN',
    left: 'LEFT',
    right: 'RIGHT',
    run: 'SHIFT'
};

function updateControls(){
    controls.direction[0] = _keybinds.left.isDown*-1 + _keybinds.right.isDown*1;
    controls.direction[1] = _keybinds.up.isDown*-1 + _keybinds.down.isDown*1;
    controls.run = _keybinds.run.isDown;
}

function setupControls(scene){
    for (const inp in _keybinds){
        _keybinds[inp] = scene.input.keyboard.addKey(_keybinds[inp]);
    }
};

