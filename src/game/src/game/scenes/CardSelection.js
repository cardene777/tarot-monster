// game/scenes/CardSelection.js
import { Scene } from "phaser";
import { dummyCards } from "../../data/dummyCards";
import { setBackground } from "../components/background";
import {
  createArrowButton,
  createBattleButton,
  createShopButton,
  createWalletConnectButton,
  createAddressListButton,
} from "../components/deck/elements";
import { loadImage, loadSelectedImages } from "../components/images";
import { EventBus } from "../EventBus";
import { gameDataManager } from "../GameDataManager";

export class CardSelection extends Scene {
  constructor() {
    super("CardSelection");
    this.selectedCards = [];
    this.currentPage = 0; // 現在のページ番号
    this.cardsPerPage = 8; // 1ページに表示するカードの枚数
  }

  init() {
    // シーンの初期化時にデータを取得
    this.updateGameData();

    // データの更新を監視
    EventBus.on("gameDataUpdated", this.handleDataUpdate, this);

    EventBus.on("gameDataUpdated", (key, value) => {
      if (key === "wallet") {
        this.updateWalletDisplay(value); // wallet の表示を更新
      }
    });
  }

  updateGameData() {
    this.wallet = gameDataManager.getData("wallet");
    this.createNFT = gameDataManager.getData("createNFT");
  }

  handleDataUpdate(key, value) {
    this[key] = value;
  }

  preload() {
    const assetsPath = "assets";
    const images = [
      { key: "deck-bg", path: `${assetsPath}/deck-bg.png` },
      { key: "card-bg", path: `${assetsPath}/card-bg.png` },
      { key: "shop", path: `${assetsPath}/shop.png` },
      { key: "address", path: `${assetsPath}/address.png` },
      { key: "wallet-connect", path: `${assetsPath}/wallet-connect.png` },
      { key: "arrow", path: `${assetsPath}/arrow.png` },
      { key: "play", path: `${assetsPath}/play.png` },
    ];
    loadImage(this, images);
    loadSelectedImages(this, dummyCards);
  }

  create() {
    this.renderPage();
    this.selectedCards = [];
    this.opponentCards = [];
    setBackground(this, "deck-bg", 0.3);

    createShopButton(this);
    createAddressListButton(this);
    createWalletConnectButton(this);

    createArrowButton(this);

    // Battleボタン（初期は非表示）
    createBattleButton(this);
  }

  renderPage() {
    // 既存のカードをクリア
    console.log(this.children.list);
    this.children.list.forEach((child) => {
      if (
        child !== this.prevButton &&
        child !== this.nextButton &&
        child !== this.background &&
        child !== this.overlay &&
        child !== this.battleButton &&
        child !== this.shopButton &&
        child !== this.addressListButton
      ) {
        child.destroy();
      }
    });

    const cardWidth = 210; // カードの幅
    const spacing = 255; // カード間の間隔（幅）
    const rowSpacing = 350; // カード間の間隔（高さ）
    const cardsPerRow = 4; // 1行に表示するカードの枚数

    let currentY = 350; // カードの表示開始のY座標
    let currentX = 0; // カードの表示開始のX座標

    // 現在のページに表示するカードのデータを取得
    const start = this.currentPage * this.cardsPerPage;
    const end = start + this.cardsPerPage;
    const pageCards = dummyCards.slice(start, end);

    pageCards.forEach((card, index) => {
      // 1行のカード数とスペーシングに基づいて現在の行のカードの幅を計算し、中央に寄せる
      if (index % cardsPerRow === 0) {
        const cardsInCurrentRow = Math.min(
          cardsPerRow,
          pageCards.length - index
        );
        const totalRowWidth = (cardsInCurrentRow - 1) * spacing + cardWidth;
        currentX = (this.cameras.main.width - totalRowWidth) / 2;
      }

      // カード全体を囲むコンテナを作成
      const cardContainer = this.add.container(currentX + 100, currentY);
      cardContainer.setSize(cardWidth, 300); // コンテナのサイズを設定
      cardContainer.setInteractive(); // コンテナ全体をクリックできるようにする
      cardContainer.setData("cardData", card);
      cardContainer.setData(
        "selected",
        this.selectedCards.some((selectedCard) => selectedCard.id === card.id)
      );

      // カードのホバーイベント
      cardContainer.on("pointerover", () => {
        this.tweens.add({
          targets: cardContainer,
          scaleX: 1.1,
          scaleY: 1.1,
          ease: "Power1", // 緩やかな拡大
          duration: 300,
        });
        this.input.manager.canvas.style.cursor =
          'url("assets/cursor_2.png"), auto';
      });
      cardContainer.on("pointerout", () => {
        this.tweens.add({
          targets: cardContainer,
          scaleX: 1,
          scaleY: 1,
          ease: "Power1", // 緩やかな縮小
          duration: 300,
        });
        this.input.manager.canvas.style.cursor = "default";
      });

      // カードのクリックイベント
      cardContainer.on("pointerdown", () => {
        if (
          this.selectedCards.length < 6 ||
          cardContainer.getData("selected")
        ) {
          this.toggleCardSelection(cardContainer);
        }
      });

      // カードの背景を指定された画像に設定
      const cardBackground = this.add.image(0, 0, "card-bg");
      cardBackground.setDisplaySize(cardWidth, 300);
      cardContainer.add(cardBackground);

      // 枠のデザインを変更（タロットカード風）
      const cardFrame = this.add.graphics();
      cardFrame.lineStyle(7.5, 0xdaa520, 1); // 線の太さを変更
      cardFrame.strokeRect(-105, -150, 210, 300); // フレームのサイズを設定
      cardContainer.add(cardFrame);

      // カードの画像を表示
      const cardImage = this.add.image(0, -15, `card-${card.id}`);
      cardImage.setDisplaySize(165, 165); // カードのサイズを縮小
      cardContainer.add(cardImage);

      // カードの名前を中央上部に表示
      const cardNameText = this.add
        .text(0, -120, card.name, {
          font: "27px Georgia", // フォントサイズを変更
          fill: "#ffd700", // ゴールド色
          stroke: "#000000", // 黒い縁取り
          strokeThickness: 4.5, // 縁取りの太さ
          align: "center",
        })
        .setOrigin(0.5);
      cardContainer.add(cardNameText);

      // 効果の背景（半透明）を追加
      const effectBackground = this.add.graphics();
      effectBackground.fillStyle(0x000000, 0.5); // 背景色を50%の透明度で設定
      effectBackground.fillRect(-80, 70, 160, 50); // 効果テキストの背景を設定
      cardContainer.add(effectBackground);

      // カードの効果を画像に重なるように表示
      const cardDescriptionText = this.add
        .text(0, 95, card.description, {
          font: "12px Georgia", // フォントサイズを変更
          fill: "#ffffff",
          wordWrap: { width: 120 }, // テキスト幅
          align: "center",
        })
        .setOrigin(0.5);
      cardContainer.add(cardDescriptionText);

      // 攻撃力と防御力を六角形の中に表示
      this.drawHexagon(cardContainer, -80, 120, "#ff0000", card.attack); // 左下に配置（攻撃力）
      this.drawHexagon(cardContainer, 80, 120, "#0000ff", card.defense); // 右下に配置（防御力）

      // 選択状態の場合、選択エフェクトを追加
      if (cardContainer.getData("selected")) {
        this.addSelectionFrame(cardContainer);
      }

      // 次のカードの位置を計算
      currentX += spacing;
      if ((index + 1) % cardsPerRow === 0) {
        currentY += rowSpacing; // Y座標を次の行に
      }
    });

    // 選択されたカードの表示を更新
    this.updateSelectedCardsDisplay();
    // createWalletConnectButton(this);
  }

  addSelectionFrame(cardContainer) {
    // 新しい選択エフェクト（枠）を追加
    const frame = this.add.graphics();
    frame.lineStyle(5, 0xb4e0ca, 1); // 新しい枠の色 (#B26BDB)
    frame.strokeRect(
      -cardContainer.width / 2,
      -cardContainer.height / 2,
      cardContainer.width,
      cardContainer.height
    );
    cardContainer.setData("selectedFrame", frame);
    cardContainer.add(frame);
  }

  drawHexagon(container, x, y, color, text) {
    // 六角形のグラフィックスオブジェクトを作成
    const hexagon = this.add.graphics();

    // タロットカード風に複数の直線を組み合わせた幾何学的なデザイン
    hexagon.fillStyle(0x333366, 1); // 内側を濃い紫色で塗りつぶし
    hexagon.beginPath();
    const size = 28; // 六角形のサイズ
    for (let i = 0; i < 6; i++) {
      const angle = Phaser.Math.DegToRad(60 * i - 30); // 回転を加えて幾何学的に調整
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

    // 六角形の枠線を描画（外側の太い枠線）
    hexagon.lineStyle(3, 0xffd700, 1); // ゴールドの枠線
    hexagon.strokePath();

    // 六角形の内側の幾何学模様を追加
    hexagon.lineStyle(1.5, 0xffffff, 0.8); // 内側の細い白いライン
    hexagon.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = Phaser.Math.DegToRad(60 * i - 30); // 回転を加えて線を描く
      const xPos = x + (size - 5) * Math.cos(angle);
      const yPos = y + (size - 5) * Math.sin(angle);
      if (i === 0) {
        hexagon.moveTo(xPos, yPos);
      } else {
        hexagon.lineTo(xPos, yPos);
      }
    }
    hexagon.closePath();
    hexagon.strokePath();

    // コンテナに六角形を追加
    container.add(hexagon);

    // 六角形の中に数字を追加（フォントを変更してスタイリッシュに）
    const hexText = this.add
      .text(x, y, text, {
        font: "24px 'Cinzel', serif", // フォントを変更（タロットカード風）
        fill: "#ffd700", // ゴールド色
        stroke: "#000000", // 黒い縁取り
        strokeThickness: 3, // 縁取りの太さ
      })
      .setOrigin(0.5);
    container.add(hexText);
  }

  updateSelectedCardsDisplay() {
    // 既存の選択カード表示をクリア
    this.selectedCardsDisplay?.forEach((child) => child.destroy());
    this.selectedCardsDisplay = [];

    // 半透明の背景色を追加（選択されたカード全体のセットに対して）
    const backgroundOverlay = this.add.graphics();
    backgroundOverlay.fillStyle(0x000000, 0.5); // 半透明の黒
    backgroundOverlay.fillRect(50, 50, this.selectedCards.length * 100, 100);
    this.selectedCardsDisplay.push(backgroundOverlay);

    // 「Deck」のタイトル
    const deckTitle = this.add
      .text(this.cameras.main.width / 2, 100, "Deck", {
        font: "50px Georgia",
        fill: "#ffffff",
      })
      .setOrigin(0.5);
    this.selectedCardsDisplay.push(deckTitle);

    // 選択されたカードを表示
    this.selectedCards.forEach((card, index) => {
      const cardContainer = this.add.container(100 + index * 100, 100);
      const cardBackground = this.add.image(0, 0, "card-bg");

      // 先頭2枚にグラデーション付きのアニメーション枠を適用
      if (index < 2) {
        this.createGradientFrameWithAnimation(cardContainer, 95, 95);
      }

      cardBackground.setDisplaySize(90, 90); // 小さく表示
      cardContainer.add(cardBackground);

      const cardImage = this.add.image(0, 0, `card-${card.id}`);
      cardImage.setDisplaySize(80, 80); // 小さく表示
      cardContainer.add(cardImage);

      this.selectedCardsDisplay.push(cardContainer);
    });
  }

  createGradientFrameWithAnimation(container, width, height) {
    const frame = this.add.graphics();

    // シンプルに赤色の枠線を作成
    frame.lineStyle(2, 0xff0000, 1); // 赤色の枠線、太さは4ピクセル
    frame.strokeRoundedRect(-width / 2, -height / 2, width, height, 5); // 角丸の枠を描画

    container.add(frame);

    // アニメーションを設定
    this.tweens.add({
      targets: frame,
      scaleX: 1.01,
      scaleY: 1.01,
      ease: "Sine.easeInOut",
      duration: 1000,
      yoyo: true,
      repeat: -1, // 無限ループ
    });
  }

  toggleCardSelection(cardContainer) {
    const isSelected = cardContainer.getData("selected");
    const cardData = cardContainer.getData("cardData");

    if (isSelected) {
      // 選択解除された場合
      this.selectedCards = this.selectedCards.filter(
        (card) => card.id !== cardData.id
      );

      // 選択エフェクト（枠）を削除
      const selectedFrame = cardContainer.getData("selectedFrame");
      if (selectedFrame) {
        selectedFrame.destroy();
        cardContainer.setData("selectedFrame", null);
      }

      // カードのデフォルトの枠に戻す
      const defaultFrame = cardContainer.getData("defaultFrame");
      if (defaultFrame) {
        defaultFrame.setVisible(true);
      }

      // カード全体のスケールを元に戻す
      cardContainer.setScale(1);
    } else {
      if (this.selectedCards.length < 6) {
        // 選択された場合
        this.selectedCards.push(cardData);

        // 既存のデフォルト枠を非表示にする
        const defaultFrame = cardContainer.getData("defaultFrame");
        if (defaultFrame) {
          defaultFrame.setVisible(false);
        }

        // 新しい選択エフェクト（枠）を追加
        this.addSelectionFrame(cardContainer);
        cardContainer.setScale(1.1);
      }
    }

    cardContainer.setData("selected", !isSelected);

    // 選択カード表示を更新
    this.updateSelectedCardsDisplay();

    this.updateBattleButtonVisibility();
  }

  updateBattleButtonVisibility() {
    if (this.selectedCards.length === 6) {
      this.battleButton.setVisible(true);
    }
  }
}
