export const setBackground = (scene, bgImageName, transparent) => {
  scene.background = scene.add
    .image(
      scene.cameras.main.width / 2,
      scene.cameras.main.height / 2,
      bgImageName
    )
    .setDepth(-100);

  scene.overlay = scene.add.graphics();
  scene.overlay.fillStyle(0x000000, transparent);
  scene.overlay.fillRect(
    0,
    0,
    scene.cameras.main.width,
    scene.cameras.main.height
  );
  scene.overlay.setDepth(-99);
};
