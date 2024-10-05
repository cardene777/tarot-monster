import { addHoverEffectScale } from "../hoverEffect";
import { showModal } from "./pack";

export const createBuyButton = (scene) => {
  scene.buyButton = scene.add
    .image(scene.cameras.main.width / 2, scene.cameras.main.height - 70, "buy")
    .setInteractive()
    .setScale(0.35)
    .on("pointerdown", () => {
      // パックが開かれた時にモーダルを表示し、buyボタンを無効化
      if (!scene.isPackOpen) {
        scene.isPackOpen = true;
        showModal(scene);
        scene.buyButton.disableInteractive(); // ボタンを無効化
      }
    });

  addHoverEffectScale(scene, scene.buyButton, 0.35, 0.4);
};
