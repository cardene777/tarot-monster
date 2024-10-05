import { disableAllHoverEffects } from "../hoverEffect";
import { performAttackAnimations } from "./animations";
import { createCardContainer } from "./createElements";
import { checkGameOver } from "./logic";
import { startCountdown } from "./timer";

export const addCardInteraction = (scene, cardContainer) => {
  cardContainer
    .setInteractive({ draggable: true })
    .on("pointerover", () => {
      scene.tweens.add({
        targets: cardContainer,
        scaleX: 1.5,
        scaleY: 1.5,
        ease: "Power1", // 緩やかな拡大
        duration: 300,
      });
      scene.input.manager.canvas.style.cursor =
        'url("assets/cursor_2.png"), auto';
    })
    .on("pointerout", () => {
      scene.tweens.add({
        targets: cardContainer,
        scaleX: 1,
        scaleY: 1,
        ease: "Power1", // 緩やかな縮小
        duration: 300,
      });
      scene.input.manager.canvas.style.cursor = "default";
    })
    .on("dragstart", (pointer, dragX, dragY) => {
      cardContainer.input.dragStartX = cardContainer.x;
      cardContainer.input.dragStartY = cardContainer.y;
      scene.children.bringToTop(cardContainer);
    })
    .on("drag", (pointer, dragX, dragY) => {
      cardContainer.x = dragX;
      cardContainer.y = dragY;
    })
    .on("dragend", () => {
      const isInField = Phaser.Geom.Rectangle.Overlaps(
        scene.playerFieldRect,
        cardContainer.getBounds()
      );
      if (isInField) {
        placeCardInField(scene, cardContainer);
      } else {
        resetCardPosition(scene, cardContainer);
      }
    });
};

const enablePlayerCardInteraction = (scene) => {
  scene.playerHand.forEach((cardContainer) => {
    cardContainer.setInteractive({ draggable: true });
    addCardInteraction(scene, cardContainer);
  });
};

const enableOpponentCardInteraction = (scene) => {
  if (scene.opponentFieldCard) {
    scene.opponentFieldCard.setInteractive();
  }
};

export const resetBattleState = (scene) => {
  // タイマーのリセット
  scene.timer = 30;
  scene.timerText.setText(`Time: ${scene.timer}`);
  startCountdown(scene);

  // バトルボタンを無効化
  scene.battleButton.setAlpha(0.5);
  scene.battleButton.disableInteractive();

  // プレイヤーと相手のフィールドをリセット
  if (scene.playerFieldCard) {
    scene.playerFieldCard.container.destroy(); // プレイヤーカードを削除
    scene.playerFieldCard = null;
  }

  if (scene.opponentFieldCardContainer) {
    scene.opponentFieldCardContainer.destroy(); // 相手カードを削除
    scene.opponentFieldCardContainer = null;
  }

  // 相手のフィールドカードを裏側にする
  if (scene.opponentFieldCard) {
    scene.opponentFieldCard.setTexture();
    scene.opponentFieldCard = null;
  }

  // プレイヤーと相手のインタラクションを再度有効化
  enablePlayerCardInteraction(scene);
  enableOpponentCardInteraction(scene);
};

const resetCardPosition = (scene, cardContainer) => {
  scene.tweens.add({
    targets: cardContainer,
    x: cardContainer.input.dragStartX,
    y: cardContainer.input.dragStartY,
    duration: 300,
    ease: "Power1",
  });
};

export const placeCardInField = (scene, cardContainer) => {
  // すでにフィールドにカードがある場合は元のカードを戻す
  if (scene.playerFieldCard && scene.playerFieldCard.container) {
    const previousCardContainer = scene.playerFieldCard.container;
    scene.tweens.add({
      targets: previousCardContainer,
      x: cardContainer.input.dragStartX,
      y: cardContainer.input.dragStartY,
      duration: 300,
      ease: "Power1",
    });
    // フィールドから手札に戻す
    scene.playerHand.push(previousCardContainer);
  }

  // カードデータを保存
  cardContainer.setData("id", cardContainer.list[1].texture.key.split("-")[1]);

  // フィールドに配置する際の深度を設定
  cardContainer.setDepth(10); // 必要に応じて値を調整

  scene.tweens.add({
    targets: cardContainer,
    x: scene.playerFieldRect.x + scene.playerFieldRect.width / 2,
    y: scene.playerFieldRect.y + scene.playerFieldRect.height / 2,
    scaleX: 1, // フィールド上のサイズをリセット
    scaleY: 1,
    duration: 300,
    ease: "Power1",
  });

  scene.playerFieldCard = { container: cardContainer };
  scene.playerHand = scene.playerHand.filter((c) => c !== cardContainer);
  rearrangeHand(scene);

  // プレイヤーがカードを置いたら相手のカードをフィールドに置く
  if (!scene.opponentFieldCard && scene.opponentHand.length > 0) {
    placeRandomOpponentCard(scene); // 相手の手札からランダムなカードをフィールドに配置
  }

  // カードが配置されたらバトルボタンの有効化をチェック
  updateBattleButtonState(scene);
};

const rearrangeHand = (scene) => {
  scene.playerHand.forEach((cardContainer, index) => {
    scene.tweens.add({
      targets: cardContainer,
      x: 150 + index * 140,
      duration: 300,
      ease: "Power1",
    });
  });
};

export const placeRandomOpponentCard = (scene) => {
  if (scene.opponentHand.length > 0 && !scene.opponentFieldCard) {
    const randomIndex = Phaser.Math.Between(0, scene.opponentHand.length - 1);
    const randomCard = scene.opponentHand[randomIndex];

    // カードをフィールドに配置
    randomCard.x =
      scene.opponentFieldRect.x + scene.opponentFieldRect.width / 2;
    randomCard.y =
      scene.opponentFieldRect.y + scene.opponentFieldRect.height / 2;
    randomCard.setDisplaySize(100, 170); // フィールドサイズに合わせる

    // 手札から削除
    scene.opponentHand.splice(randomIndex, 1); // 正しく手札からカードを削除
    scene.opponentFieldCard = randomCard; // フィールドに配置したカードを記録

    // 手札が減るようにUIを再配置
    rearrangeOpponentHand(scene);

    // 相手がカードを置いたらバトルボタンの有効化をチェック
    updateBattleButtonState(scene);
  }
};

const rearrangeOpponentHand = (scene) => {
  const startX = 150; // 左寄せの開始位置
  const spacing = 100; // カード同士のスペースを固定

  // 各カードを左寄せで詰めて表示
  scene.opponentHand.forEach((cardContainer, index) => {
    scene.tweens.add({
      targets: cardContainer,
      x: startX + index * spacing, // 左寄せでカードを再配置
      duration: 300,
      ease: "Power1",
    });
  });
};

const updateBattleButtonState = (scene) => {
  if (checkBattleStartCondition(scene)) {
    // バトル開始条件が揃ったらボタンを有効化
    scene.battleButton.setAlpha(1);
    scene.battleButton.setInteractive();
  } else {
    // 条件が揃っていない場合はボタンを無効化
    scene.battleButton.setAlpha(0.5);
    scene.battleButton.disableInteractive();
  }
};

const checkBattleStartCondition = (scene) => {
  // 自分と相手のフィールドにカードがあるかどうかをチェック
  const playerFieldHasCard = !!scene.playerFieldCard;
  const opponentFieldHasCard = !!scene.opponentFieldCard;
  return playerFieldHasCard && opponentFieldHasCard;
};

export const handleTimeUp = (scene) => {
  scene.timer = 0;
  scene.timerText.setText("Duel!!!");
  disablePlayerCardInteraction(scene);
  if (!scene.playerFieldCard && scene.playerHand.length > 0) {
    const randomCardIndex = Phaser.Math.Between(0, scene.playerHand.length - 1);
    placeCardInField(scene, scene.playerHand[randomCardIndex]);
  }
  if (!scene.opponentFieldCard && scene.opponentHand.length > 0) {
    placeRandomOpponentCard(scene);
  }
  handleBattleStart(scene, scene.battleButton);
};

const disablePlayerCardInteraction = (scene) => {
  // 手持ちのカードのインタラクション無効化
  scene.playerHand.forEach((cardContainer) => {
    cardContainer.disableInteractive(); // カードをドラッグできなくする
  });
  scene.opponentHand.forEach((cardContainer) => {
    cardContainer.disableInteractive(); // 相手のカードもドラッグできなくする
  });

  // フィールド上のカードのインタラクション無効化
  if (scene.playerFieldCard) {
    scene.playerFieldCard.container.disableInteractive();
  }
  if (scene.opponentFieldCard) {
    scene.opponentFieldCard.disableInteractive();
  }
};

// タイマーが0になった時に全てのカードを無効化
export const handleBattleStart = (scene, battleButton) => {
  if (scene.countdownEvent) {
    scene.countdownEvent.remove();
  }

  // バトルボタンが存在する場合のみ無効化
  if (battleButton) {
    battleButton.disableInteractive();
    battleButton.setAlpha(0.5); // 透明度を0.5に設定
  }

  // プレイヤーのカードのドラッグ&ドロップを無効化
  disablePlayerCardInteraction(scene);

  // 全てのホバー効果を無効化
  disableAllHoverEffects(scene);

  // ホバー効果を無効化
  scene.battleStarted = true;
  scene.input.manager.canvas.style.cursor = "default";

  // フィールドにあるカードのインタラクションも無効化
  if (scene.playerFieldCard) {
    scene.playerFieldCard.container.disableInteractive();
    scene.playerFieldCard.container.off("pointerover");
    scene.playerFieldCard.container.off("pointerout");
  }

  if (scene.opponentFieldCard) {
    scene.opponentFieldCard.disableInteractive();
    scene.opponentFieldCard.off("pointerover");
    scene.opponentFieldCard.off("pointerout");
  }

  // プレイヤーと相手のカードがフィールドにあるかチェックしてバトル解決
  if (scene.playerFieldCard && scene.opponentFieldCard) {
    resolveBattle(scene);
  }
};

export const resolveBattle = (scene) => {
  if (scene.opponentFieldCard) {
    const unusedCards = scene.opponentCards.filter(
      (card) =>
        !scene.opponentHand.find(
          (handCard) => handCard.texture.key === `card-${card.id}`
        ) && scene.opponentFieldCard.texture.key === "card-back"
    );

    if (unusedCards.length > 0) {
      const randomCardIndex = Phaser.Math.Between(0, unusedCards.length - 1);
      const selectedCard = unusedCards[randomCardIndex];

      // 相手のフィールドカードをランダムな未使用カードに変更
      scene.opponentFieldCard.setTexture();

      // 既存のカードコンテナを削除して新たに詳細を描画
      scene.opponentFieldCardContainer?.destroy();
      scene.opponentFieldCardContainer = createCardContainer(
        scene,
        scene.opponentFieldRect.x + scene.opponentFieldRect.width / 2,
        scene.opponentFieldRect.y + scene.opponentFieldRect.height / 2,
        selectedCard
      );

      // フィールドに配置する際の深度を設定
      scene.opponentFieldCardContainer.setDepth(10); // 必要に応じて値を調整

      // カードデータを保存
      scene.opponentFieldCardContainer.setData("id", selectedCard.id);

      // アニメーション: カードが表になるアニメーションが終わったらバトルを集計
      scene.tweens.add({
        targets: scene.opponentFieldCardContainer,
        alpha: 1,
        duration: 500,
        onComplete: () => {
          performAttackAnimations(scene); // 攻撃モーション
        },
      });
    }
  }
};

export const updatePointsText = (scene) => {
  scene.playerPointsText.setText(`Player: ${scene.playerPoints} points`);
  scene.opponentPointsText.setText(`Enemy: ${scene.opponentPoints} points`);
};

export const sendToGraveyard = (scene, cardContainer) => {
  if (!cardContainer) {
    console.error("Card container is undefined or null.");
    return;
  }

  // 墓地内にカードを小さくして表示させる
  const cardIndex = scene.graveyardCards.length;
  const xOffset = (cardIndex % 3) * 30; // カードが重ならないようにX方向にずらす
  const yOffset = Math.floor(cardIndex / 3) * 40; // カードが重ならないようにY方向にずらす

  // カードを墓地に移動させるアニメーション
  scene.tweens.add({
    targets: cardContainer,
    x: scene.cameras.main.width - 130 + xOffset, // 墓地のX座標
    y: scene.cameras.main.height - 130 + yOffset, // 墓地のY座標
    angle: 160, // 角度を145度に設定
    scaleX: 0.4, // カードを縮小
    scaleY: 0.4,
    duration: 500, // アニメーションの速度
    onComplete: () => {
      // カードを可視化し、墓地に表示
      cardContainer.setVisible(true); // カードを再び表示
      cardContainer.setDepth(10 + cardIndex); // カードの深度を設定して背景より上に表示
      scene.graveyardCards.push(cardContainer); // 墓地リストに追加
      console.log("Card sent to graveyard", cardContainer);

      // 手札がなくなった場合の勝敗判定を実施
      checkGameOver(scene);
    },
  });
};
