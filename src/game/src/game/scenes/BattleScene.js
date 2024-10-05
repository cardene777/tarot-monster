import { Scene } from "phaser";
import {
  createBackButton,
  createBattleButton,
  createCharacterIcons,
  createField,
  createGraveyard,
  createOpponentHand,
  createPlayerHand,
  setTimer,
} from "../components/battle/createElements";
import { setBackground } from "../components/background";
import { startCountdown } from "../components/battle/timer";
import {
  loadCharacterImages,
  loadImage,
  loadSelectedImages,
} from "../components/images";

export class BattleScene extends Scene {
  constructor() {
    super("BattleScene");
    this.playerPoints = 0;
    this.opponentPoints = 0;
  }

  init(data) {
    this.playerCards = data.playerCards;
    this.opponentCards = data.opponentCards;
  }

  preload() {
    const assetsPath = "assets";

    const images = [
      { key: "card-back", path: `${assetsPath}/card-back.png` },
      { key: "card-bg", path: `${assetsPath}/card-bg.png` },
      { key: "battle-bg", path: `${assetsPath}/battle-bg.png` },
      { key: "back-button", path: `${assetsPath}/back-button.png` },
      { key: "battle-start", path: `${assetsPath}/battle-start.png` },
      { key: "grave", path: `${assetsPath}/grave.png` },
    ];
    loadImage(this, images);
    console.log(`this.playerCards: ${JSON.stringify(this.playerCards)}`);
    console.log(`this.opponentCards: ${JSON.stringify(this.opponentCards)}`);
    loadSelectedImages(this, this.playerCards);
    loadSelectedImages(this, this.opponentCards);
    loadCharacterImages(this, assetsPath);
  }

  create() {
    setBackground(this, "battle-bg", 0.6);
    setTimer(this);
    startCountdown(this);
    createBackButton(this);
    createBattleButton(this);
    createCharacterIcons(this);
    createPlayerHand(this);
    createOpponentHand(this);
    createField(this);
    createGraveyard(this);
  }

  update() {
    // 描画更新が必要な場合はこの中で墓地の表示を更新
    this.graveyardCards.forEach((card, index) => {
      card.setDepth(10 + index); // 各カードの深度を更新
      card.setVisible(true); // カードが可視状態であることを確認
    });
  }
}
