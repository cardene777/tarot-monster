// game/main.js
import { Boot } from "./scenes/Boot";
import { Preloader } from "./scenes/Preloader";
import { CardSelection } from "./scenes/CardSelection";
import { BattleScene } from "./scenes/BattleScene";
import { Shop } from "./scenes/Shop";
import { AddressList } from "./scenes/AddressList";
import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth, // 画面全体の幅に設定
  height: window.innerHeight, // 画面全体の高さに設定
  parent: "game-container",
  scene: [
    Boot,
    Preloader,
    CardSelection,
    BattleScene,
    Shop,
    AddressList,
  ],
};

const StartGame = (parent) => {
  return new Phaser.Game({ ...config, parent });
};

export default StartGame;
