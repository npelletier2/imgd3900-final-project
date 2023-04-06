let cursors;

function setupCursors(scene){
    cursors = scene.input.keyboard.createCursorKeys();
}

function getDirection(){
    let dir = [];
    dir[0] = cursors.left.isDown*-1 + cursors.right.isDown*1;
    dir[1] = cursors.up.isDown*-1 + cursors.down.isDown*1;
    return dir;
}