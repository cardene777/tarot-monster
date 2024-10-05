import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { gameDataManager } from "../GameDataManager";
import { setBackground } from "../components/background";
import { loadImage } from "../components/images";
import { addHoverEffectScale } from "../components/hoverEffect";
import { createBackButton } from "../components/element";

export class AddressList extends Scene {
  constructor() {
    super("AddressList");
    this.currentPage = 0; // 現在のページ番号
    this.addressesPerPage = 16; // 1ページに表示するアドレスの数（4行×4列）
    this.addressesPerRow = 4; // 1行に表示するアドレスの数（最大4つ）
  }

  init() {
    // シーンの初期化時にデータを取得
    this.updateGameData();

    // データの更新を監視
    EventBus.on("gameDataUpdated", this.handleDataUpdate, this);
  }

  updateGameData() {
    this.wallet = gameDataManager.getData("wallet");
    this.addresses = this.generateDummyAddresses(100); // ダミーアドレスを100個生成
  }

  handleDataUpdate(key, value) {
    this[key] = value;
  }

  generateDummyAddresses(count) {
    // ダミーアドレスを生成する関数
    const addresses = [];
    for (let i = 0; i < count; i++) {
      addresses.push(`0x${Math.random().toString(16).substr(2, 40)}`);
    }
    return addresses;
  }

  preload() {
    const assetsPath = "assets";
    const images = [
      { key: "deck-bg", path: `${assetsPath}/deck-bg.png` },
      { key: "card-bg", path: `${assetsPath}/card-bg.png` },
      { key: "address-bg", path: `${assetsPath}/address-bg.png` },
      { key: "back-button", path: `${assetsPath}/back-button.png` },
    ];
    loadImage(this, images);
  }

  create() {
    this.renderPage();
    setBackground(this, "deck-bg", 0.3);
    createBackButton(this);
  }

  renderPage() {
    // 既存のアドレス表示をクリア
    this.children.list.forEach((child) => {
      child.destroy();
    });

    this.add
      .text(this.cameras.main.width / 2, 100, "Address List", {
        font: "50px Georgia",
        fill: "#ffffff",
      })
      .setOrigin(0.5);


    const addressWidth = 300; // アドレスを表示するカードの幅
    const spacing = 320; // カード間の間隔（幅）
    const rowSpacing = 200; // カード間の間隔（高さ）

    let currentY = 250; // 表示開始のY座標
    let currentX = 0; // 表示開始のX座標

    // 現在のページに表示するアドレスのデータを取得
    const start = this.currentPage * this.addressesPerPage;
    const end = start + this.addressesPerPage;
    const pageAddresses = this.addresses.slice(start, end);

    pageAddresses.forEach((address, index) => {
      // 1行のカード数とスペーシングに基づいて現在の行のカードの幅を計算し、中央に寄せる
      if (index % this.addressesPerRow === 0) {
        const addressesInCurrentRow = Math.min(
          this.addressesPerRow,
          pageAddresses.length - index
        );
        const totalRowWidth =
          (addressesInCurrentRow - 1) * spacing + addressWidth;
        currentX = (this.cameras.main.width - totalRowWidth) / 2;
      }

      // アドレス全体を囲むコンテナを作成
      const addressContainer = this.add.container(currentX + 150, currentY);
      addressContainer.setSize(addressWidth, 50); // コンテナのサイズを設定
      addressContainer.setInteractive(); // コンテナ全体をクリックできるようにする

      // 背景画像を追加
      const cardBackground = this.add.image(0, 0, "address-bg");
      cardBackground.setDisplaySize(addressWidth, 230);
      addressContainer.add(cardBackground);

      // アドレステキストを追加
      const addressText = this.add
        .text(0, 0, address, {
          font: "20px Georgia",
          fill: "#000000",
        })
        .setOrigin(0.5);
      addressContainer.add(addressText);

      addHoverEffectScale(this, addressContainer, 1, 1.1);

      // 次のカードの位置を計算
      currentX += spacing;
      if ((index + 1) % this.addressesPerRow === 0) {
        currentY += rowSpacing; // Y座標を次の行に
      }
    });
  }
}
