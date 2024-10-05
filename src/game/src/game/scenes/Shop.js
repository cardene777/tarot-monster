import { Scene } from "phaser";
import { setBackground } from "../components/background";
import { createArrowButton } from "../components/deck/elements";
import { loadImage } from "../components/images";
import { createBuyButton } from "../components/shop/elements";
import { createBackButton } from "../components/element";
import { EventBus } from "../EventBus";
import { gameDataManager } from "../GameDataManager";
import { addHoverEffectScale } from "../components/hoverEffect";
export class Shop extends Scene {
  constructor() {
    super("Shop");
  }

  preload() {
    const assetsPath = "assets";
    const images = [
      { key: "shop-bg", path: `${assetsPath}/shop-bg.png` },
      { key: "pack-bg", path: `${assetsPath}/pack-bg.png` },
      { key: "arrow", path: `${assetsPath}/arrow.png` },
      { key: "buy", path: `${assetsPath}/buy.png` },
      { key: "buy", path: `${assetsPath}/buy.png` },
      { key: "pack-open-bg", path: `${assetsPath}/pack-open-bg.png` },
      { key: "open", path: `${assetsPath}/open.png` },
      { key: "close", path: `${assetsPath}/close.png` },
      { key: "back-button", path: `${assetsPath}/back-button.png` },
    ];
    loadImage(this, images);
  }

  init() {
    // シーンの初期化時にデータを取得
    this.updateGameData();

    // データの更新を監視
    EventBus.on("gameDataUpdated", this.handleDataUpdate, this);
  }

  updateGameData() {
    this.wallet = gameDataManager.getData("wallet");
    this.createNFT = gameDataManager.getData("createNFT");
  }

  handleDataUpdate(key, value) {
    this[key] = value;
  }

  create() {
    this.isPackOpen = false;
    setBackground(this, "shop-bg", 0.3);
    createArrowButton(this);
    createBuyButton(this);
    createBackButton(this);

    // パックを1つ表示する
    const packWidth = 500;
    const packHeight = 550;
    const packName = "Single Pack";
    const packPrice = "0.01 SOL";

    const currentX = this.cameras.main.width / 2;
    const currentY = 450;

    const packContainer = this.add.container(currentX, currentY);
    packContainer.setSize(packWidth, packHeight);
    packContainer.setInteractive();
    packContainer.setData("packData", { name: packName, price: packPrice });

    // パックのホバー効果
    addHoverEffectScale(this, packContainer, 1, 1.1);

    // パックの背景を設定
    const packBackground = this.add.image(0, 0, "pack-bg");
    packBackground.setDisplaySize(packWidth, packHeight);
    packContainer.add(packBackground);

    // パックの名前を表示
    const packNameText = this.add
      .text(0, -250, packName, {
        font: "32px Georgia",
        fill: "#ffd700",
        stroke: "#000000",
        strokeThickness: 4.5,
        align: "center",
      })
      .setOrigin(0.5);
    packContainer.add(packNameText);

    // パックの価格を表示
    const priceText = this.add
      .text(0, 250, packPrice, {
        font: "32px Georgia",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
        align: "center",
      })
      .setOrigin(0.5);
    packContainer.add(priceText);
  }
}
