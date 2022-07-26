import Phaser from "phaser";
import { io } from "socket.io-client";

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super("helloworld");
    this.spriteNumber = 0;
    this.player = {};
    this.players = [];
    this.spawnPosition = { x: 160, y: 160 };
    this.cursors = {};
    this.speed = 100;
    this.currentAnimation = "";
    this.velocityX = 0;
    this.velocityY = 0;
    this.lastX = 160;
    this.lastY = 160;
    this.socket = {};
    this.planks = {};
  }

  connexion() {
    this.socket = io("https://phaser-portfolio-server.herokuapp.com/");
    //this.socket = io("http://localhost:5000");

    this.socket.on("connect", () => {
      console.log("socket.id :", this.socket.id);
      this.player.id = this.socket.id;
      this.socket.emit("setupPlayer", {
        position: { x: 160, y: 160 },
        anim: this.currentAnimation,
      });
    });

    this.socket.on("initialPlayers", (data) => {
      console.log("initialPlayers", data);
      this.createOtherPlayers(data);
    });

    this.socket.on("playerJoin", (data) => {
      console.log("New player:", data);
      this.addPlayer(data);
    });
    this.socket.on("playerLeave", (data) => {
      //console.log("playerLeave :", data);
      this.players.forEach((player) => {
        if (player.id === data && player.sprite) {
          player.sprite.destroy();
        }
      });
      this.players = [...this.players].filter((player) => {
        return player.id !== data;
      });
      //console.log("Leaving player :", data);
    });
    this.socket.on("disconnect", () => console.log("Disconected..."));

    this.socket.on("updatePlayer", (data) => {
      //console.log("receiving update: ", data);
      if (data.id !== this.socket.id) {
        this.updateOtherPlayer(data);
      }
    });
  }

  preload() {
    //Sprites from : https://0x72.itch.io/pixeldudesmaker
    for (let i = 1; i <= 13; i++) {
      this.load.spritesheet(
        "Char" + i,
        "assets/spritesheets/Char" + i + ".png",
        {
          frameWidth: 16,
          frameHeight: 24,
        }
      );
    }
    this.spriteNumber = Math.floor(1 + Math.random() * 12);
    console.log("spriteNumber", this.spriteNumber);
    this.currentAnimation = "idle" + this.spriteNumber;
    //planks image from : https://pixelartmaker-data-78746291193.nyc3.digitaloceanspaces.com/image/e762a106081c497.png
    this.load.image("planks", "assets/images/background_floor.png");
  }

  create() {
    this.connexion();
    this.planks = this.add.tileSprite(0, 0, 640, 640, "planks");
    this.cursors = this.input.keyboard.createCursorKeys();
    this.createAnims();
    this.createPlayer();
    setInterval(() => {
      if (this.lastX !== this.player.x || this.lastY !== this.player.y) {
        this.lastX = this.player.x;
        this.lastY = this.player.y;
        this.sendUpdate();
      }
    }, 60);
  }

  update() {
    this.setVelocityXY();
    this.setAnimations();
  }

  createPlayer() {
    this.player = this.physics.add
      .sprite(
        this.spawnPosition.x,
        this.spawnPosition.y,
        "Char" + this.spriteNumber
      )
      .setScale(2);
    this.player.setCollideWorldBounds(true);
    this.player.setVelocity(0);
  }

  createOtherPlayers(data) {
    //console.log("createOtherPlayers:", this.players);
    const otherPlayers = [...data];
    this.players = [];
    otherPlayers.forEach((player) => {
      this.addPlayer(player);
    });
  }

  addPlayer(newPlayer) {
    console.log("adding Player :", newPlayer);
    const newSprite = this.physics.add
      .sprite(
        newPlayer.position.x,
        newPlayer.position.y,
        "Char" + newPlayer.spriteNumber
      )
      .setScale(2);
    newPlayer.sprite = newSprite;
    this.players.push(newPlayer);
  }

  createAnims() {
    for (let i = 0; i < 13; i++) {
      this.anims.create({
        key: "run" + (i + 1),
        frames: this.anims.generateFrameNumbers("Char" + (i + 1), {
          frames: [8, 9, 10, 11],
        }),
        frameRate: 7,
      });

      this.anims.create({
        key: "idle" + (i + 1),
        frames: this.anims.generateFrameNumbers("Char" + (i + 1), {
          frames: [4, 5, 6, 7],
        }),
        frameRate: 7,
      });
    }
  }

  setAnimations() {
    //Apply animation
    if (this.velocityY !== 0 || this.velocityX !== 0) {
      this.currentAnimation = "run" + this.spriteNumber;
    } else {
      this.currentAnimation = "idle" + this.spriteNumber;
    }

    if (this.currentAnimation === "idle" + this.spriteNumber) {
      this.player.playAfterRepeat({ key: "idle" + this.spriteNumber });
    }
    if (this.currentAnimation === "run" + this.spriteNumber) {
      this.player.playAfterRepeat({ key: "run" + this.spriteNumber });
    }

    //otherPlayers Anims
    this.players.forEach((player) => {
      if (player.sprite) {
        player.sprite.playAfterRepeat({ key: player.anim });
      }
    });
  }

  setVelocityXY() {
    if (this.cursors.left.isDown) {
      this.velocityX = -this.speed;
      if (this.player.flipX === false) this.player.flipX = true;
    } else if (this.cursors.right.isDown) {
      this.velocityX = this.speed;
      if (this.player.flipX === true) this.player.flipX = false;
    } else {
      this.velocityX = 0;
    }

    if (this.cursors.up.isDown) {
      this.velocityY = -this.speed;
    } else if (this.cursors.down.isDown) {
      this.velocityY = this.speed;
    } else {
      this.velocityY = 0;
    }

    this.player.setVelocityX(this.velocityX);
    this.player.setVelocityY(this.velocityY);
  }

  updateOtherPlayer(otherPlayer) {
    //console.log("updateOtherPlayer :", otherPlayer);
    this.players.forEach((player) => {
      if (player.id === otherPlayer.id && player.sprite) {
        player.sprite.x = otherPlayer.position.x;
        player.sprite.y = otherPlayer.position.y;
        player.sprite.flipX = otherPlayer.flipX;
        player.anim = otherPlayer.anim;
      }
    });
  }

  sendUpdate() {
    if (this.player.x) {
      //console.log("sendUpdate", this.player.x, this.player.y, this.socket.id);
      this.socket.emit("updatePlayer", {
        id: this.socket.id,
        position: { x: this.player.x, y: this.player.y },
        desiredAnim: this.desiredAnim,
        anim: this.currentAnimation,
        flipX: this.player.flipX,
      });
    }
  }
}
