// game/scenes/Boot.js
import { Scene } from "phaser";

export class Boot extends Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    this.load.image("background", "assets/bg.png");
  }

  create() {
    // 適当な5枚のカードを作成して BattleScene に渡す
    const dummyCards = [
      {
        id: 1,
        name: "Fireball",
        attack: 7,
        defense: 5,
        description: "Me: Attack + 3 Defenece + 2",
        image: "assets/monster/monster1.png",
      },
      {
        id: 2,
        name: "Shield",
        attack: 3,
        defense: 8,
        description: "Attack 🔄 Defense",
        image: "assets/monster/monster2.png",
      },
      {
        id: 3,
        name: "Sword Strike",
        attack: 6,
        defense: 4,
        description: "negating the effect",
        image: "assets/monster/monster3.png",
      },
      {
        id: 4,
        name: "Healing Potion",
        attack: 2,
        defense: 6,
        description: "negating the effect",
        image: "assets/monster/monster4.png",
      },
      {
        id: 5,
        name: "Assassin",
        attack: 8,
        defense: 3,
        description: "Me: Attack + 3 Defenece + 2",
        image: "assets/monster/monster5.png",
      },
      {
        id: 6,
        name: "Ice Blast",
        attack: 5,
        defense: 6,
        description: "Invert Plus and Minus after this",
        image: "assets/monster/monster6.png",
      },
      {
        id: 7,
        name: "Thunder Strike",
        attack: 9,
        defense: 2,
        description: "invariably win",
        image: "assets/monster/monster7.png",
      },
      {
        id: 8,
        name: "Earthquake",
        attack: 7,
        defense: 7,
        description: "negating the effect",
        image: "assets/monster/monster8.png",
      },
      {
        id: 9,
        name: "Wind Slash",
        attack: 6,
        defense: 5,
        description: "Attack 🔄 Defense",
        image: "assets/monster/monster9.png",
      },
      {
        id: 10,
        name: "Vampire Bite",
        attack: 8,
        defense: 4,
        description: "Plus 🔄 Minus",
        image: "assets/monster/monster10.png",
      },
    ];
    this.scene.start("CardSelection");
    // this.scene.start("AddressList");
    // this.scene.start("Shop");
    // this.scene.start("BattleScene", { selectedCards: dummyCards });
  }
}
