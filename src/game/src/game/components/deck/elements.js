import { addHoverEffectScale } from "../hoverEffect";
import { dummyCards } from "../../../data/dummyCards";
import { EventBus } from "../../EventBus";

export const createShopButton = (scene) => {
  scene.shopButton = scene.add
    .image(
      scene.cameras.main.width - 330, // 画面の右端から少し離れた位置
      100, // 画面の上から少し下の位置
      "shop"
    )
    .setInteractive()
    .setScale(0.2) // ボタンのサイズを調整
    .on("pointerdown", () => {
      // 「Shop」ボタンがクリックされたときの処理
      scene.scene.start("Shop"); // 「ShopScene」へ遷移
    });

  // ホバー時のエフェクトを追加
  addHoverEffectScale(scene, scene.shopButton, 0.2, 0.22);
};

export const createAddressListButton = (scene) => {
  scene.addressListButton = scene.add
    .image(
      scene.cameras.main.width - 480, // 画面の右端から少し離れた位置
      100, // 画面の上から少し下の位置
      "address"
    )
    .setInteractive()
    .setScale(0.32) // ボタンのサイズを調整
    .on("pointerdown", () => {
      // 「AddressList」ボタンがクリックされたときの処理
      scene.scene.start("AddressList"); // 「AddressListScene」へ遷移
    });

  // ホバー時のエフェクトを追加
  addHoverEffectScale(scene, scene.addressListButton, 0.32, 0.34);
};

export const createWalletConnectButton = (scene) => {
  let walletDisplay;

  const createOrUpdateDisplay = (wallet) => {
    if (walletDisplay) {
      walletDisplay.destroy();
    }

    let publicKeyString = null;
    if (
      wallet &&
      wallet.publicKey &&
      typeof wallet.publicKey.toBase58 === "function"
    ) {
      publicKeyString = wallet.publicKey.toBase58();
    }

    if (publicKeyString) {
      const shortenedKey = `${publicKeyString.slice(
        0,
        6
      )}...${publicKeyString.slice(-4)}`;
      walletDisplay = scene.add
        .text(scene.cameras.main.width - 150, 100, shortenedKey, {
          font: "24px Georgia",
          fill: "#ffffff",
          backgroundColor: "#737091",
          padding: { x: 10, y: 10 },
        })
        .setOrigin(0.5);
      addHoverEffectColor(scene, walletDisplay);
    } else {
      // PublicKey がない場合は画像を表示
      walletDisplay = scene.add
        .image(scene.cameras.main.width - 150, 100, "wallet-connect")
        .setScale(0.24);
      addHoverEffectScale(scene, walletDisplay, 0.24, 0.26);
    }

    // インタラクティブにして、クリックイベントを追加
    walletDisplay.setInteractive().on("pointerdown", async () => {
      if (wallet) {
        try {
          await wallet.connect();
          // 接続が成功した場合、EventBusで状態変更を通知し、再描画をトリガー
          EventBus.emit("gameDataUpdated", "wallet", wallet);
        } catch (error) {
          console.error("ウォレット接続に失敗しました", error);
        }
      }
    });
  };

  // 初期表示を作成
  createOrUpdateDisplay(scene.wallet);

  // ウォレットの接続状態が変更されたときの更新関数
  scene.updateWalletDisplay = (newWallet) => {
    createOrUpdateDisplay(newWallet);
  };
};

// ホバーエフェクト（色変更）を追加する関数
const addHoverEffectColor = (scene, target) => {
  target.on("pointerover", () => {
    target.setStyle({ fill: "#ffff00" }); // 黄色にハイライト
  });
  target.on("pointerout", () => {
    target.setStyle({ fill: "#ffffff" }); // 元の白色に戻す
  });
};

export const createArrowButton = (scene) => {
  // 左矢印ボタン（前のページ）
  scene.prevButton = scene.add
    .image(170, scene.cameras.main.height - 70, "arrow")
    .setInteractive()
    .setScale(0.3, 0.3)
    .setFlipX(true)
    .on("pointerdown", () => {
      if (scene.currentPage > 0) {
        scene.currentPage--;
        scene.renderPage();
      }
    });

  addHoverEffectScale(scene, scene.prevButton, 0.3, 0.35);

  // 右矢印ボタン（次のページ）
  scene.nextButton = scene.add
    .image(
      scene.cameras.main.width - 170,
      scene.cameras.main.height - 70,
      "arrow"
    )
    .setInteractive()
    .setScale(0.3)
    .on("pointerdown", () => {
      if ((scene.currentPage + 1) * scene.cardsPerPage < dummyCards.length) {
        scene.currentPage++;
        scene.renderPage();
      }
    });

  addHoverEffectScale(scene, scene.nextButton, 0.3, 0.35);
};

export const createBattleButton = (scene) => {
  scene.battleButton = scene.add
    .image(scene.cameras.main.width / 2, scene.cameras.main.height - 70, "play")
    .setInteractive()
    .setScale(0.55)
    .setVisible(false) // 初期状態では非表示
    .on("pointerdown", () => {
      // 選ばれていないカードからランダムに6枚選択
      const unselectedCards = dummyCards.filter(
        (card) =>
          !scene.selectedCards.some(
            (selectedCard) => selectedCard.id === card.id
          )
      );
      const randomCards = Phaser.Utils.Array.Shuffle(unselectedCards).slice(
        0,
        6
      );

      console.log(`scene.selectedCards: ${JSON.stringify(scene.selectedCards)}`);
      console.log(`randomCards: ${JSON.stringify(randomCards)}`);

      // プレイヤーの6枚と相手の後ろ4枚を合わせた10枚
      const playerHand = [
        ...scene.selectedCards, // プレイヤーの選択した6枚
        ...randomCards.slice(2, 6), // 相手の選択した6枚のうち、後ろ4枚
      ];

      console.log(`playerHand: ${JSON.stringify(playerHand)}`);

      // 相手の6枚とプレイヤーの後ろ4枚を合わせた10枚
      const opponentHand = [
        ...randomCards, // 相手のランダムに選ばれた6枚
        ...scene.selectedCards.slice(2, 6), // プレイヤーの選択した6枚のうち、後ろ4枚
      ];

      // BattleSceneへプレイヤーと相手の手札を渡して遷移
      scene.scene.start("BattleScene", {
        playerCards: playerHand,
        opponentCards: opponentHand,
      });
    });

  addHoverEffectScale(scene, scene.battleButton, 0.55, 0.6);
};
