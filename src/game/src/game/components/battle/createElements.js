import { addHoverEffect } from "../hoverEffect";
import { addCardInteraction, handleBattleStart } from "./actions";
import { getCardDescriptionStyle, getCardTextStyle } from "./style";

export const setTimer = (scene) => {
  scene.timer = 30;
  scene.timerText = scene.add
    .text(scene.cameras.main.width / 2, 280, `Time: ${scene.timer}`, {
      font: "32px Georgia",
      fill: "#ffffff",
    })
    .setOrigin(0.5);
};

export const createBackButton = (scene) => {
  const backButton = scene.add
    .image(150, 890, "back-button")
    .setDisplaySize(80, 80)
    .setInteractive()
    .setFlipX(true)
    .on("pointerdown", () => {
      scene.scene.start("CardSelection");
    });

  addHoverEffect(scene, backButton, 80, 80, 90, 90);
};

export const createBattleButton = (scene) => {
  scene.battleButton = scene.add
    .image(scene.cameras.main.width / 2, 880, "battle-start")
    .setDisplaySize(200, 100)
    .setInteractive()
    .on("pointerdown", () => {
      handleBattleStart(scene, scene.battleButton);
    });

  addHoverEffect(scene, scene.battleButton, 200, 100, 210, 110);

  scene.battleButton.setAlpha(0.5); // 初期状態は透明度を0.5に設定して無効化
  scene.battleButton.disableInteractive(); // 初期状態ではボタンを無効化
};

export const createCharacterIcons = (scene) => {
  scene.playerPointsText = createCharacterIcon(
    scene,
    300,
    880,
    "character1",
    "Player: 0 points",
    350,
    870
  );
  scene.opponentPointsText = createCharacterIcon(
    scene,
    scene.cameras.main.width - 300,
    150,
    "character2",
    "Enemy: 0 points",
    scene.cameras.main.width - 480,
    140
  );
};

const createCharacterIcon = (scene, x, y, key, label, textX, textY) => {
  const icon = scene.add.image(x, y, key).setDisplaySize(80, 80);
  const maskShape = scene.make.graphics({ x: 0, y: 0, add: false });
  maskShape.fillStyle(0xffffff);
  maskShape.fillCircle(icon.x, icon.y, 40); // 半径40pxの円を描画

  // マスクを作成し、画像に適用
  const mask = maskShape.createGeometryMask();
  icon.setMask(mask);
  return scene.add.text(textX, textY, label, {
    font: "18px Georgia",
    fill: "#ffffff",
    strokeThickness: 1.5,
  });
};

export const createPlayerHand = (scene) => {
  const hand = [];
  scene.playerCards.forEach((card, index) => {
    const cardContainer = createCardContainer(
      scene,
      150 + index * 140,
      700,
      card
    );
    addCardInteraction(scene, cardContainer);
    hand.push(cardContainer);
  });
  scene.playerHand = hand;
};

export const createOpponentHand = (scene) => {
  const hand = [];
  scene.opponentCards.forEach((_, index) => {
    const opponentCard = scene.add
      .image(150 + index * 90, 150, "card-back")
      .setDisplaySize(75, 100);
    hand.push(opponentCard);
  });
  scene.opponentHand = hand;
};

export const createField = (scene) => {
  scene.playerFieldRect = createFieldRect(
    scene,
    scene.cameras.main.width / 2 - 150,
    350
  );
  scene.opponentFieldRect = createFieldRect(
    scene,
    scene.cameras.main.width / 2 + 50,
    350
  );
};

const createFieldRect = (scene, x, y) => {
  const rect = new Phaser.Geom.Rectangle(x, y, 100, 170);
  scene.add
    .graphics()
    .lineStyle(2, 0xffffff, 1)
    .strokeRectShape(rect)
    .setAlpha(0.5);
  return rect;
};

export const createGraveyard = (scene) => {
  scene.graveyardBackground = scene.add
    .image(
      scene.cameras.main.width - 200,
      scene.cameras.main.height - 130,
      "grave"
    )
    .setDisplaySize(150, 150)
    .setDepth(0);

  scene.graveyardCards = [];
};

export const createCardContainer = (scene, x, y, card) => {
  const container = scene.add.container(x, y).setSize(100, 140);
  const background = scene.add.image(0, 0, "card-bg").setDisplaySize(100, 170);
  const image = scene.add
    .image(0, -10, `card-${card.id}`)
    .setDisplaySize(90, 90);
  const nameText = scene.add
    .text(0, -70, card.name, getCardTextStyle())
    .setOrigin(0.5);
  const descriptionBackground = scene.add.graphics();
  descriptionBackground.fillStyle(0x000000, 0.4);
  descriptionBackground.fillRect(-40, 40, 80, 30);
  const descriptionText = scene.add
    .text(0, 55, card.description, getCardDescriptionStyle())
    .setOrigin(0.5);

  container.add([
    background,
    image,
    nameText,
    descriptionBackground,
    descriptionText,
  ]);
  addStatsToCard(scene, container, card);
  return container;
};

const addStatsToCard = (scene, container, card) => {
  drawHexagon(scene, container, -40, 80, "#ff0000", card.attack); // 攻撃力
  drawHexagon(scene, container, 40, 80, "#0000ff", card.defense); // 防御力
};

const drawHexagon = (scene, container, x, y, color, text) => {
  const hexagon = scene.add.graphics();
  hexagon.fillStyle(0x333366, 1);
  hexagon.beginPath();
  const size = 20;
  for (let i = 0; i < 6; i++) {
    const angle = Phaser.Math.DegToRad(60 * i - 30);
    const xPos = x + size * Math.cos(angle);
    const yPos = y + size * Math.sin(angle);
    if (i === 0) {
      hexagon.moveTo(xPos, yPos);
    } else {
      hexagon.lineTo(xPos, yPos);
    }
  }
  hexagon.closePath();
  hexagon.fillPath();

  hexagon.lineStyle(3, 0xffd700, 1);
  hexagon.strokePath();

  const hexText = scene.add
    .text(x, y, text, {
      font: "16px 'Cinzel', serif",
      fill: "#ffd700",
      stroke: "#000000",
      strokeThickness: 3,
    })
    .setOrigin(0.5);
  container.add([hexagon, hexText]);
};
