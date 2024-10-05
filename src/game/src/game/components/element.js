import { addHoverEffect } from "./hoverEffect";

export const createBackButton = (scene) => {
  const backButton = scene.add
    .image(100, 100, "back-button")
    .setDisplaySize(100, 100)
    .setInteractive()
    .setFlipX(true)
    .on("pointerdown", () => {
      scene.scene.start("CardSelection");
    });

  addHoverEffect(scene, backButton, 100, 100, 110, 110);
};
