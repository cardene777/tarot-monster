import { handleTimeUp, placeRandomOpponentCard } from "./actions";

export const startCountdown = (scene) => {
  scene.countdownEvent = scene.time.addEvent({
    delay: 1000, // 毎秒実行
    callback: () => {
      if (scene.timer <= 0) {
        handleTimeUp(scene);
      } else {
        scene.timer--;
        scene.timerText.setText(`Time: ${scene.timer}`);

        if (!scene.playerFieldCard) {
          // 0.2秒後に相手のカードをフィールドに置く
          scene.time.delayedCall(0, () => {
            placeRandomOpponentCard(scene);
          });
        }
      }
    },
    loop: true,
  });
};
