import { calculateBattleResult } from "./logic";
import { sendToGraveyard, resetBattleState } from "./actions";

export const performAttackAnimations = (scene) => {
  // 自分のカードが前方に移動するアニメーション
  scene.tweens.add({
    targets: scene.playerFieldCard.container,
    x: scene.playerFieldCard.container.x + 30,
    duration: 300,
    yoyo: true, // 往復させる
    ease: "Power1",
    onComplete: () => {
      // 相手が自分に攻撃するモーション
      performOpponentAttackAnimation(scene);
    },
  });
};

// 相手が自分に攻撃するモーション
const performOpponentAttackAnimation = (scene) => {
  scene.tweens.add({
    targets: scene.opponentFieldCardContainer,
    x: scene.opponentFieldCardContainer.x - 30,
    duration: 300,
    yoyo: true, // 往復させる
    ease: "Power1",
    onComplete: () => {
      performDamageResultAnimation(scene); // 勝敗モーションを呼び出し
    },
  });
};

const performDamageResultAnimation = (scene) => {
  const playerCardId = Number(scene.playerFieldCard.container.getData("id"));
  const opponentCardId = Number(scene.opponentFieldCardContainer.getData("id"));
  console.log(`playerCardId: ${playerCardId}`);
  console.log(`opponentCardId: ${opponentCardId}`);
  const playerCardData = scene.playerCards.find(
    (card) => card.id === playerCardId
  );
  const opponentCardData = scene.opponentCards.find(
    (card) => card.id === opponentCardId
  );
  console.log(`playerCardData: ${JSON.stringify(playerCardData)}`);
  console.log(`opponentCardData: ${JSON.stringify(opponentCardData)}`);

  // 勝敗結果を計算
  const battleResult = calculateBattleResult(
    scene,
    playerCardData.attack,
    opponentCardData.attack,
    playerCardData.defense,
    opponentCardData.defense
  );

  // 勝者に勝利モーション、敗者に敗北モーションを適用
  if (battleResult > 0) {
    animateWin(scene, scene.playerFieldCard.container, () => {
      sendToGraveyard(scene, scene.playerFieldCard.container); // プレイヤーのカードを墓地に送る
    });
    animateLoss(scene, scene.opponentFieldCardContainer, () => {
      sendToGraveyard(scene, scene.opponentFieldCardContainer); // 相手のカードを墓地に送る
    });
  } else if (battleResult < 0) {
    animateLoss(scene, scene.playerFieldCard.container, () => {
      sendToGraveyard(scene, scene.playerFieldCard.container); // プレイヤーのカードを墓地に送る
    });
    animateWin(scene, scene.opponentFieldCardContainer, () => {
      sendToGraveyard(scene, scene.opponentFieldCardContainer); // 相手のカードを墓地に送る
    });
  } else {
    animateLoss(scene, scene.playerFieldCard.container, () => {
      sendToGraveyard(scene, scene.playerFieldCard.container); // プレイヤーのカードを墓地に送る
    });
    animateLoss(scene, scene.opponentFieldCardContainer, () => {
      sendToGraveyard(scene, scene.opponentFieldCardContainer); // 相手のカードを墓地に送る
    });
  }

  // バトルの状態をリセットする処理はアニメーションがすべて完了してから実行
  scene.time.delayedCall(1500, () => {
    resetBattleState(scene);
  });
};

// 勝者のアニメーション
const animateWin = (scene, winnerContainer, callback) => {
  scene.tweens.add({
    targets: winnerContainer,
    scaleX: 1.3,
    scaleY: 1.3,
    duration: 500,
    yoyo: true,
    ease: "Bounce.easeOut",
    onComplete: callback,
  });
};

// 敗者のアニメーション
const animateLoss = (scene, loserContainer, callback) => {
  scene.tweens.add({
    targets: loserContainer,
    alpha: 0,
    duration: 1000,
    onComplete: () => {
      callback();
      loserContainer.destroy();
    },
  });
};
