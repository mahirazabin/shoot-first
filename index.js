/* Course: SENG 513 */
/* Date: OCT 22, 2023 */
/* Assignment 2 */
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

	constructor(id, x, y) {
		this.id = id;
		this.health = 100;
		this.x = x;
		this.y = y;
		this.isJump = false;
		this.ammo = 100;
		this.playerElement = document.getElementById(`player-${id}`);
		this.playerHealthElement = document.getElementById(`player-${id}-health`);
		this.playerHealthValElement = document.getElementById(
			`player-${id}-health-val`
		);
		this.playerAmmoElement = document.getElementById(`player-${id}-ammo`);
		this.dir = id - 1;
	}

	/**
	 * handle player movement
	 * @param {'right' | 'left' | 'jump'} type
	 * @param {*} obstactles
	 */
	move(type, obstactles) {}

	draw() {
		this.playerElement.style = `left: ${
			this.x - this.playerElement.offsetWidth > 0
				? this.x - this.playerElement.offsetWidth
				: 0
		}px; bottom: ${this.y}px`;

		if (this.dir === 1) {
			this.playerElement.classList.add('flip');
		} else {
			this.playerElement.classList.remove('flip');
		}

		this.playerHealthElement.style = `width: ${Math.floor(this.health)}%;`;
		this.playerHealthValElement.innerHTML = `&nbsp;${Math.floor(
			this.health
		)}&nbsp;/&nbsp;100`;
		this.playerAmmoElement.innerHTML = `&nbsp;${this.ammo}&nbsp;/&nbsp;100`;

		// temporary to show some interactivity
		this.health = this.health - 0.1 === 0 ? 100 : this.health - 0.1;
	}

	/**
	 * shoot bullet
	 * @param {*} bullet
	 */
	shoot(bullet) {
		bullet.fire();
		this.ammo--;
	}
}

class Bullet {
	playerId;
	x;
	y;
	xVel;
	yVel;
	clearBullet;

	constructor(x, y, playerId, clearBullet) {
		this.x = x;
		this.y = y;
		this.playerId = playerId;
		this.clearBullet;
	}

	/**
	 * fire bullet
	 */
	fire() {}

	/**
	 * draw bullet
	 */
	draw() {}
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
		this.obstactleElement = document.getElementById(`obstacle-${id}`);
		console.log(this.obstactleElement, this.x, this.y);
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
		this.gameElement = document.getElementById('game');
		this.width = this.gameElement.offsetWidth;
		this.height = this.gameElement.offsetHeight;
		this.gameElement.innerHTML = this.#getMenuElements();
		this.status = 'menu';
	}

	/**
	 * Starts Game
	 */
	startGame() {
		this.gameElement.innerHTML = this.#getGameElements();
		this.players.push(new Player(1, 0, 0));
		this.players.push(new Player(2, this.width, 0));
		for (let i = 0; i < 5; i++) {
			this.obstactles.push(
				new Obstactle(
					(i + Math.floor(Math.random() * 10 + Math.random() * 10)) * 48,
					0,
					i
				)
			);
		}
		this.status = 'start';
		/** Draw loop, set to 60 fps */
		const fps = setInterval(() => {
			this.draw();
			if (this.status === 'gameOver') {
				clearInterval(fps);
			}
		}, 1000 / this.framerate);
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
		const bullet = new Bullet(player.x, player.y, player.id, () =>
			this.bullets.splice(this.bullets.length, 1)
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
    <img
      class="player-image player-image-1"
      src="player.png"
      alt="player 1"
      id="player-1"
    />
    <img
      class="player-image player-image-2"
      src="player.png"
      alt="player 2"
      id="player-2"
    />
    <img
      class="obstacle"
      src="crate.png"
      alt="obstactle"
      id="obstacle-0"
    />
    <img
      class="obstacle"
      src="crate.png"
      alt="obstactle"
      id="obstacle-1"
    />
    <img
      class="obstacle"
      src="crate.png"
      alt="obstactle"
      id="obstacle-2"
    />
    <img
      class="obstacle"
      src="crate.png"
      alt="obstactle"
      id="obstacle-3"
    />
    <img
      class="obstacle"
      src="crate.png"
      alt="obstactle"
      id="obstacle-4"
    />
    `;
	}

	/**
	 * Get the menu elements html
	 */
	#getMenuElements() {
		return `<p class="game-text">Press 'Space' to start game!</p>`;
	}
}

const main = () => {
	let game = new Game();
	document.onkeydown = (ev) => {
		const keyCode = ev.code;
		if (game.status === 'menu' && keyCode === 'Space') {
			game.startGame();
		} else if (game.status === 'start') {
			console.log(keyCode);
		}
	};

	document.getElementById('rules-btn').addEventListener('click', () => {
		document
			.getElementById('rules-popup')
			.classList.toggle('nav-btn-rules-active');
	});
};

var tid = setInterval(() => {
	if (document.readyState !== 'complete') return;
	clearInterval(tid);
	main();
}, 100);
