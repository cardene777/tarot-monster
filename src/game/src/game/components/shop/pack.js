import { addHoverEffect } from "../../components/hoverEffect";

export const showModal = (scene) => {
  const modalWidth = 400;
  const modalHeight = 400;

  // オーバーレイが既に存在している場合は削除してから新たに作成
  if (scene.overlay) {
    scene.overlay.destroy();
  }

  // 半透明のオーバーレイを追加してモーダル外をクリックできないように設定
  scene.overlay = scene.add.graphics(); // scene.overlay を新たに定義
  scene.overlay.fillStyle(0x000000, 0.6);
  scene.overlay.fillRect(
    0,
    0,
    scene.cameras.main.width,
    scene.cameras.main.height
  );
  scene.overlay.setDepth(1);
  scene.overlay.setInteractive(); // クリックイベントをブロックするためにインタラクティブに設定

  // タロット風の半透明の背景（pack-open画像）
  const modalBackground = scene.add
    .image(
      scene.cameras.main.width / 2,
      scene.cameras.main.height / 2,
      "pack-open-bg"
    )
    .setDisplaySize(500, 500) // 画面全体に拡大
    .setOrigin(0.5)
    .setInteractive()
    .setDepth(2);

  modalBackground.overlay = scene.add.graphics();
  modalBackground.overlay.fillStyle(0x000000, 0.2);
  modalBackground.overlay.fillRect(
    0,
    0,
    scene.cameras.main.width,
    scene.cameras.main.height
  );
  modalBackground.overlay.setDepth(2);

  // モーダルの本体を作成
  const modalContainer = scene.add.container(
    scene.cameras.main.width / 2,
    scene.cameras.main.height / 2
  );
  modalContainer.setSize(modalWidth, modalHeight).setDepth(3);

  // パック背景としての画像
  const packImage = scene.add.image(0, -50, "pack-bg").setDisplaySize(300, 350);
  modalContainer.add(packImage);

  // パック画像を上下に弾ませるアニメーション
  scene.tweens.add({
    targets: packImage,
    y: -70,
    duration: 1000,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut",
  });

  // "Open"ボタンをopen画像に変更して追加
  const openButton = scene.add
    .image(0, 200, "open")
    .setDisplaySize(150, 50) // サイズ調整
    .setInteractive();

  addHoverEffect(scene, openButton, 150, 50, 180, 70);

  openButton.on("pointerdown", () => {
    showCard(scene, modalContainer, modalBackground, packImage, openButton);
  });

  modalContainer.add(openButton);
};

const showCard = async (
  scene,
  modalContainer,
  modalBackground,
  packImage,
  openButton
) => {
  // assets/monsterディレクトリ内のすべてのPNG画像を動的に取得
  const monsterImages = import.meta.glob(
    "../../../../public/assets/monster/*.png"
  );
  const imagePaths = Object.keys(monsterImages); // 画像パスのリストを取得
  // ランダムに画像を選択
  const randomIndex = Math.floor(Math.random() * imagePaths.length);
  const selectedPath = imagePaths[randomIndex];

  // 画像パスを非同期に解決
  const selectedCardModule = await monsterImages[selectedPath]();
  const selectedCardPath = selectedCardModule.default.replace("/public/", "");
  const key = selectedCardPath.split("/").pop().replace(".png", "");
  scene.load.image(key, selectedCardPath);
  scene.load.start();

  // カード名をフォーマット
  const cardName = formatCardName(
    selectedPath.split("/").pop().replace(".png", "")
  );
  console.log(`cardName: ${cardName}`);

  await scene.createNFT(selectedCardPath, cardName);

  console.log("NFT created");

  // パック画像の上下弾むアニメーションを停止
  scene.tweens.killTweensOf(packImage);

  // パック画像をひっくり返すアニメーション
  scene.tweens.add({
    targets: packImage,
    scaleX: 0,
    duration: 500,
    onComplete: () => {
      // パック画像を消し、カード画像を表示
      packImage.setAlpha(0);

      // モンスターカードの画像を表示
      const cardImage = scene.add
        .image(0, -70, key) // 解決された画像パスを使用
        .setDisplaySize(250, 250);
      modalContainer.add(cardImage);

      const cardNameText = scene.add
        .text(0, 120, cardName, {
          font: "32px Georgia",
          fill: "#ffd700", // ゴールドカラーでタロット風
        })
        .setOrigin(0.5);

      // テキストの寸法を取得
      const textBounds = cardNameText.getBounds();

      // 背景用の半透明のグレー矩形をテキストの背後に作成
      const backgroundRect = scene.add
        .rectangle(
          textBounds.centerX, // テキストの中心に合わせる
          textBounds.centerY,
          textBounds.width + 20, // テキストより少し大きめに背景を設定
          textBounds.height + 10,
          0x808080, // グレー (#808080)
          0.5 // 半透明
        )
        .setOrigin(0.5);

      // 背景矩形とテキストをモーダルコンテナに追加
      modalContainer.add(backgroundRect);
      modalContainer.add(cardNameText);

      // "Open"ボタンを非表示
      openButton.destroy();

      // "Close"ボタンをclose画像に変更して追加
      const closeButton = scene.add
        .image(0, 200, "close")
        .setDisplaySize(150, 50) // サイズ調整
        .setInteractive();

      addHoverEffect(scene, closeButton, 150, 50, 180, 70);

      closeButton.on("pointerdown", () => {
        modalBackground.overlay.destroy();
        modalBackground.destroy();
        modalContainer.destroy();
        scene.isPackOpen = false;
        scene.buyButton.setInteractive();
        if (scene.overlay) {
          scene.overlay.destroy(); // scene.overlayを削除して画面全体が暗くならないようにする
        }
      });

      modalContainer.add(closeButton);
    },
  });
};

// カード名をフォーマットする関数
const formatCardName = (filename) => {
  return filename
    .replace(".png", "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
