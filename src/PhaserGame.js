import Phaser from "phaser";

import HelloWorldScene from "./scenes/HelloWorldScene";

const config = {
  type: Phaser.AUTO,
  width: 320,
  height: 320,
  parent: "phaser-container",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: [HelloWorldScene],
};

export default new Phaser.Game(config);
