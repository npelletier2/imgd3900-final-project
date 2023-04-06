function setupCamera(scene){
    const camera = scene.cameras.main;
    camera.startFollow(objects.player);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
}