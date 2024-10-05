export const addHoverEffect = (
  scene,
  button,
  normalWidth,
  normalHeight,
  hoverWidth,
  hoverHeight
) => {
  button.on("pointerover", () => {
    button.setDisplaySize(hoverWidth, hoverHeight);
    scene.input.manager.canvas.style.cursor =
      'url("assets/cursor_2.png"), auto';
  });
  button.on("pointerout", () => {
    button.setDisplaySize(normalWidth, normalHeight);
    scene.input.manager.canvas.style.cursor = "default";
  });
};

export const addHoverEffectScale = (
  scene,
  button,
  normalScale,
  hoverScale
) => {
  button.on("pointerover", () => {
    button.setScale(hoverScale);
    scene.input.manager.canvas.style.cursor =
      'url("assets/cursor_2.png"), auto';
  });
  button.on("pointerout", () => {
    button.setScale(normalScale);
    scene.input.manager.canvas.style.cursor = "default";
  });
};

export const disableAllHoverEffects = (scene) => {
  // 手持ちのカードのホバー効果無効化
  scene.playerHand.forEach((cardContainer) => {
    cardContainer.off("pointerover"); // ホバー効果を無効化
    cardContainer.off("pointerout"); // ホバー解除を無効化
  });
  scene.opponentHand.forEach((cardContainer) => {
    cardContainer.off("pointerover"); // 相手カードのホバー効果無効化
    cardContainer.off("pointerout");
  });

  // フィールド上のカードのホバー効果無効化
  if (scene.playerFieldCard) {
    scene.playerFieldCard.container.off("pointerover");
    scene.playerFieldCard.container.off("pointerout");
  }
  if (scene.opponentFieldCard) {
    scene.opponentFieldCard.off("pointerover");
    scene.opponentFieldCard.off("pointerout");
  }
};
