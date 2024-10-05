import { updatePointsText } from "./actions";

export const calculateBattleResult = (
  scene,
  playerAttack,
  opponentAttack,
  playerDefense,
  opponentDefense
) => {
  // 攻撃力と防御力の差分を計算
  const playerAttackVsOpponentDefense = playerDefense - opponentAttack;
  const opponentAttackVsPlayerDefense = opponentDefense - playerAttack;

  // 勝者の判定
  if (playerAttackVsOpponentDefense > opponentAttackVsPlayerDefense) {
    scene.playerPoints += 1;
  } else if (playerAttackVsOpponentDefense < opponentAttackVsPlayerDefense) {
    scene.opponentPoints += 1;
  }

  // ポイント表示を更新
  updatePointsText(scene);

  return playerAttackVsOpponentDefense - opponentAttackVsPlayerDefense;
};

export const checkGameOver = (scene) => {
  if (scene.playerHand.length === 0 && scene.opponentHand.length === 0) {
    let resultText;
    let fillColor;

    if (scene.playerPoints > scene.opponentPoints) {
      resultText = "Player win!!!";
      fillColor = "#ffd700"; // 金色
    } else if (scene.playerPoints < scene.opponentPoints) {
      resultText = "Enemy win!!!";
      fillColor = "#ff0000"; // 赤色
    } else {
      resultText = "Draw...";
      fillColor = "#00ffff"; // 青緑色（引き分け時の色）
    }

    // 勝敗表示
    const victoryText = scene.add
      .text(
        scene.cameras.main.width / 2,
        scene.cameras.main.height / 2,
        resultText,
        {
          font: "48px Georgia",
          fill: fillColor,
          stroke: "#000000",
          strokeThickness: 6,
        }
      )
      .setOrigin(0.5);

    // 勝利演出（フェードイン）
    scene.tweens.add({
      targets: victoryText,
      alpha: 0,
      alpha: 1, // フェードイン
      duration: 1000,
      ease: "Power1",
    });

    // 勝ったとわかる演出（画面揺れ、引き分けならフェード効果）
    if (resultText === "Draw...") {
      scene.cameras.main.fadeIn(500); // 引き分け時にフェード演出
    } else {
      scene.cameras.main.shake(500); // 勝ち負け時には画面を揺らす
    }

    scene.time.delayedCall(2000, () => {
      resetPoints(scene); // ポイントのリセット
      scene.scene.start("CardSelection"); // メインメニューに戻る（必要であれば別のシーンに）
    });
  }
};

// プレイヤーと相手のポイントをリセット
const resetPoints = (scene) => {
  scene.playerPoints = 0;
  scene.opponentPoints = 0;
};
