import { EventBus } from "./EventBus";

class GameDataManager {
  constructor() {
    this.data = {};
  }

  setData(key, value) {
    this.data[key] = value;
    EventBus.emit("gameDataUpdated", key, value);
  }

  getData(key) {
    return this.data[key];
  }
}

export const gameDataManager = new GameDataManager();
