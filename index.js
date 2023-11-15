/* Course: SENG 513 */
/* Date: Nov 10, 2023 */
/* Assignment 3 */
/* Name: Mahira Zabin */
/* UCID: 30150211 */

/**
 * Shoot first is a 2 player local multiplayer shooter style game.
 * The target platform is fullscreen desktop on the web.
 * Shoot the other person until they lose all their health and you win!
 *
 * Rules:
 * - Shoot the other person first :P
 *
 * Mechanics:
 * - Move left and right
 * - Jump over crates
 * - Shoot gun
 * - Last alive wins!
 * - Dynamic health and ammo counter
 */

/**
 * Player Class
 */
class Player {
  id;
  health;
  x;
  y;
  isJump;
  ammo;
  playerElement;
  playerHealthElement;
  playerHealthValElement;
  playerAmmoElement;
  dir;
  jump = false;

  constructor(id, x, y, gameWidth) {
    this.id = id;
    this.health = 100;
    this.isJump = false;
    this.ammo = 31;
    this.width = gameWidth;
    this.playerElement = document.getElementById(`player-${id}`);
    this.x = Math.max(0, x - 32);
    this.y = y;
    this.playerHealthElement = document.getElementById(`player-${id}-health`);
    this.playerHealthValElement = document.getElementById(
      `player-${id}-health-val`
    );
    this.playerAmmoElement = document.getElementById(`player-${id}-ammo`);
    this.dir = id === 1 ? "right" : "left";
  }

  /**
   * handle player movement
   * @param {'right' | 'left' | 'jump'} type
   * @param {*} obstactles
   */
  move(type, obstactles) {
    if (this.x < 0 || this.x >= this.width) {
      this.x = this.x < 0 ? 0 : this.width;
      return;
    }
    let newX = this.x;
    let newY = this.y;
    let obstactle;
    switch (type) {
      case "jump":
        if (!this.jump) {
          newY = this.y + this.playerElement.offsetHeight * 1.5;
          this.jump = true;
          setTimeout(() => {
            this.jump = false;
            obstactle = this.#checkCollision(obstactles, this.x, this.y);
            if (obstactle) {
              this.y = obstactle.y + obstactle.obstactleElement.offsetHeight;
            } else {
              this.y = Math.max(
                0,
                this.y - this.playerElement.offsetHeight * 1.5
              );
            }
          }, 550);
        }
        break;
      case "left":
        this.dir = "left";
        newX = this.x - 32;
        obstactle = this.#checkCollision(obstactles, newX, newY);
        if (
          obstactle &&
          obstactle.y + obstactle.obstactleElement.offsetHeight >= newY
        ) {
          newX =
            this.y < 0
              ? obstactle.x - 32
              : obstactle.x - this.x + this.playerElement.offsetWidth <
                this.x - obstactle.x
              ? obstactle.x + obstactle.obstactleElement.offsetWidth
              : obstactle.x - 32;
        }

        break;
      case "right":
        this.dir = "right";
        newX = this.x + 32;
        obstactle = this.#checkCollision(obstactles, newX, newY);
        if (
          obstactle &&
          obstactle.y + obstactle.obstactleElement.offsetHeight >= newY
        ) {
          newX =
            this.y > 0
              ? obstactle.x + obstactle.obstactleElement.offsetWidth
              : obstactle.x - this.x + this.playerElement.offsetWidth <
                this.x - obstactle.x
              ? obstactle.x + obstactle.obstactleElement.offsetWidth
              : obstactle.x - 32;
        }
        break;
    }
    this.x = newX;
    this.y = this.jump ? newY : 0;
  }

  draw() {
    this.playerElement.style = `left: ${
      this.x - this.playerElement.offsetWidth > 0
        ? this.x - this.playerElement.offsetWidth
        : 0
    }px; bottom: ${this.y}px`;
    if (this.dir === "left" && !this.playerElement.classList.contains("flip")) {
      this.playerElement.classList.add("flip");
    } else if (this.dir === "right") {
      this.playerElement.classList.remove("flip");
    }

    this.playerHealthElement.style = `width: ${Math.floor(this.health)}%;`;
    this.playerHealthValElement.innerHTML = `&nbsp;${Math.floor(
      this.health
    )}&nbsp;/&nbsp;100`;
    this.playerAmmoElement.innerHTML = `&nbsp;${this.ammo}&nbsp;/&nbsp;31`;
  }

  /**
   * shoot bullet
   * @param {*} bullet
   */
  shoot(bullet) {
    bullet.fire();
    this.ammo--;
  }

  #checkCollision(obstactles, x, y) {
    const playerWidth = this.playerElement.offsetWidth;
    for (let obstactle of obstactles) {
      if (
        obstactle.x <= x + playerWidth &&
        obstactle.x + obstactle.obstactleElement.offsetWidth >= x
      ) {
        return obstactle;
      }
    }
    return false;
  }
}

class Bullet {
  id;
  player;
  players;
  clearBullet;
  bulletElement;
  x;
  y;
  gameWidth;
  obstactles;

  constructor(player, players, obstactles, gameWidth, clearBullet) {
    this.player = player;
    this.x = this.player.x;
    this.y = this.player.y + this.player.playerElement.offsetHeight / 3 + 5;
    this.players = players;
    this.clearBullet = clearBullet;
    this.obstactles = obstactles;
    this.id = `bullet-${player.id}-${player.ammo}`;
    this.bulletElement = document.getElementById(this.id);
    this.width = gameWidth;
  }

  /**
   * fire bullet
   */
  fire() {
    this.xVel =
      this.player.dir === "left"
        ? -this.bulletElement.offsetWidth / 2
        : this.bulletElement.offsetWidth / 2;
  }

  /**
   * draw bullet
   */
  draw() {
    if (this.x < 0 || this.x >= this.width) {
      this.clearBullet(this);
      return;
    }
    const bulletWidth = this.bulletElement.offsetWidth;
    for (let obstactle of this.obstactles) {
      if (
        obstactle.x <= this.x + bulletWidth &&
        obstactle.x + obstactle.obstactleElement.offsetWidth >= this.x &&
        obstactle.y + obstactle.obstactleElement.offsetHeight >= this.y
      ) {
        this.clearBullet(this);
        return;
      }
    }

    for (let player of this.players.filter((p) => p.id !== this.player.id)) {
      if (
        player.x <= this.x + bulletWidth &&
        player.x + player.playerElement.offsetWidth >= this.x &&
        player.y + player.playerElement.offsetHeight >= this.y
      ) {
        this.clearBullet(this);
        player.health -= 20;
        return;
      }
    }

    this.bulletElement.style = `left: ${
      this.x - this.bulletElement.offsetWidth > 0
        ? this.x - this.bulletElement.offsetWidth
        : 0
    }px; bottom: ${this.y}px`;
    this.x += this.xVel;
  }
}

/**
 * Obstactle class
 */
class Obstactle {
  id;
  x;
  y;
  obstactleElement;

  constructor(x, y, id) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.obstactleElement = document.getElementById(`obstactle-${id}`);
    this.obstactleElement.style = `left: ${
      this.x - this.obstactleElement.offsetWidth > 0
        ? this.x - this.obstactleElement.offsetWidth
        : 0
    }px; bottom: ${this.y}px`;
  }
}

/**
 * Game class
 */
class Game {
  players = [];
  obstactles = [];
  bullets = [];
  framerate = 60;
  gameElement;
  width;
  height;
  status;

  constructor() {
    this.gameElement = document.getElementById("game");
    this.width = this.gameElement.offsetWidth;
    this.height = this.gameElement.offsetHeight;
    this.gameElement.innerHTML = this.#getMenuElements();
    this.status = "menu";
  }

  /**
   * Starts Game
   */
  startGame() {
    this.gameElement.innerHTML = this.#getGameElements();
    this.players.push(new Player(1, 0, 0, this.width));
    this.players.push(new Player(2, this.width, 0, this.width));
    for (let i = 0; i < 5; i++) {
      this.obstactles.push(
        new Obstactle(
          (i + Math.floor(Math.random() * 10 + Math.random() * 10)) * 40 + 200,
          0,
          i
        )
      );
    }
    this.status = "start";
    /** Draw loop, set to 60 fps */
    const fps = setInterval(() => {
      this.draw();
      if (this.status === "gameover") {
        clearInterval(fps);
      }
    }, 1000 / this.framerate);
  }

  resetGame() {
    this.players = [];
    this.obstactles = [];
    this.startGame();
  }

  /**
   * Handle player moves
   * @param {*} id
   * @param {*} type
   */
  movePlayer(id, type) {
    this.#getPlayerById(id).move(type, this.obstactles);
  }

  /**
   * Handle Player shoot
   */
  shoot(id) {
    const player = this.#getPlayerById(id);
    const bulletHTML = document.createElement("div");
    bulletHTML.classList.add("bullet");
    bulletHTML.id = `bullet-${player.id}-${player.ammo}`;

    if (player.dir === "left") {
      bulletHTML.classList.add("flip");
    }
    bulletHTML.style = `left: ${player.x}px; bottom: ${player.y}px`;
    this.gameElement.appendChild(bulletHTML);
    const bullet = new Bullet(
      player,
      this.players,
      this.obstactles,
      this.width,
      (b) => {
        this.bullets = this.bullets.filter((bullet) => bullet !== b);
        this.gameElement.removeChild(b.bulletElement);
      }
    );
    this.bullets.push(bullet);
    player.shoot(bullet);
  }

  /**
   * Draw updated entities
   */
  draw() {
    this.players.forEach((player) => player.draw());
    this.bullets.forEach((bullet) => bullet.draw());

    for (let player of this.players) {
      if (player.health <= 0 || player.ammo === 0) {
        this.endGame(this.players.filter((p) => p.id !== player.id)[0].id);
      }
    }
  }

  endGame(id) {
    this.state = "gameover";
    this.gameElement.innerHTML = this.#getGameOverElements(id);
  }

  #getPlayerById(id) {
    return this.players[id - 1];
  }

  /**
   * Get the game elements html
   */
  #getGameElements() {
    return `
    <img src="bg.jpg" alt="bg image" class="game-container-bg" />
    <div class="stats-bar stats-bar-left">
      <p>Player 1</p>
      <div class="stats-bar-health">
        <div id="player-1-health"></div>
      </div>
      <div class="stats-bar-val">
        <div >
          <p>Health:</p>
          <p id="player-1-health-val"></p>
        </div>
        <div>
          <p>Ammo:</p>
          <p id="player-1-ammo"></p>
        </div>
      </div>
    </div>
    <div class="stats-bar stats-bar-right">
      <p>Player 2</p>
      <div class="stats-bar-health flip">
        <div id="player-2-health"></div>
      </div>
      <div class="stats-bar-val">
        <div >
          <p>Health:</p>
          <p id="player-2-health-val"></p>
        </div>
        <div>
          <p>Ammo:</p>
          <p id="player-2-ammo"></p>
        </div>
      </div>
    </div>
    <div 
      class="player-container"
      id="player-1"
    >
      <img
        class="player-image player-image-1"
        src="player.png"
        alt="player 1"
      />
    </div>
    <div 
      class="player-container"
      id="player-2"
    >
      <img
        class="player-image player-image-2"
        src="player.png"
        alt="player 2"
      />
    </div>
    <img
      class="obstactle"
      src="crate.png"
      alt="obstactle"
      id="obstactle-0"
    />
		<img
		  class="obstactle"
		  src="crate.png"
		  alt="obstactle"
		  id="obstactle-1"
		/>
		<img
		  class="obstactle"
		  src="crate.png"
		  alt="obstactle"
		  id="obstactle-2"
		/>
		<img
		  class="obstactle"
		  src="crate.png"
		  alt="obstactle"
		  id="obstactle-3"
		/>
		<img
		  class="obstactle"
		  src="crate.png"
		  alt="obstactle"
		  id="obstactle-4"
		/>
    `;
  }

  /**
   * Get the menu elements html
   */
  #getMenuElements() {
    return `<p class="game-text">Press 'Space' to start game!</p>`;
  }

  /**
   * Get the game over elements html
   */
  #getGameOverElements(id) {
    return `<p class="game-text">Player ${id} wins!<br/>Press 'Space' to start game!</p>`;
  }
}

const main = () => {
  let game = new Game();
  // game.startGame();

  document.onkeydown = (ev) => {
    const keyCode = ev.code;
    switch (keyCode) {
      case "Space":
        if (game.status === "menu") {
          game.startGame();
        } else if (game.state === "gameover") {
          game.resetGame();
        }
        break;
      case "KeyA":
        game.movePlayer(1, "left");
        break;
      case "KeyD":
        game.movePlayer(1, "right");
        break;
      case "KeyW":
        game.movePlayer(1, "jump");
        break;
      case "ShiftLeft":
        game.shoot(1);
        break;
      case "ArrowLeft":
        game.movePlayer(2, "left");
        break;
      case "ArrowRight":
        game.movePlayer(2, "right");
        break;
      case "ArrowUp":
        game.movePlayer(2, "jump");
        break;
      case "ShiftRight":
        game.shoot(2);
        break;
    }
  };

  document.getElementById("rules-btn").addEventListener("click", () => {
    document
      .getElementById("rules-popup")
      .classList.toggle("nav-btn-rules-active");
  });
};

var tid = setInterval(() => {
  if (document.readyState !== "complete") return;
  clearInterval(tid);
  main();
}, 100);
