window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

Array.prototype.last = function () {
	return this[this.length - 1];
};

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const wait = 20;
const bird = new Image();
bird.src = 'image/bird.png';
bird.position = {
	y: canvas.height / 2,
	x: 30
}
bird.fallSpeed = 0;

bird.jump = () => {
	bird.fallSpeed = 7;
};

bird.reset = () => {
	const gameOver = document.querySelector('.game-over');
	gameOver.querySelector('.score').innerHTML = score;
	intervalPause = true;
	gameOver.style.transform = 'translate(-50%, -50%) scale(1)';


	gameOver.querySelector('button').addEventListener('click', () => {
		gameOver.style.transform = 'translate(-50%, -50%) scale(0)';

		bird.position.y = canvas.height / 2;
		bird.fallSpeed = 0;
		pipes = [];
		pipes.push(new Pipe('up'));
		pipes.push(new Pipe('down'));
		score = 0;
		intervalPause = false;
	}, { once: true });


};

let difference = 125
class Pipe {
	constructor(spot) {
		this.spot = spot;
		if (this.spot == 'up') {
			this.y = 0;
			this.height = randomInt(50, 350);
		}
		else {
			this.y = canvas.height;
			this.height = ~(canvas.height - pipes.last().height - difference);
		}

		this.x = canvas.width;
		this.width = 38;
	}
}

let pipes = [];
pipes.push(new Pipe('up'));
pipes.push(new Pipe('down'));

let score = 0;
let bestscore = 0;

let intervalPause = false;

canvas.addEventListener('click', bird.jump);
window.addEventListener('keydown', (e) => {
	if (e.code === 'Space' || e.code === 'ArrowUp') bird.jump()
});

function animate(timestamp) {
	if (!intervalPause) {
		// On efface tout
		context.clearRect(0, 0, canvas.width, canvas.height);

		// On dessine les tuyaux
		context.fillStyle = 'green';

		// On gère les tuyaux
		pipes.forEach(pipe => {
			pipe.x -= 2.5;
			context.fillStyle = 'green';
			context.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);

			if (pipe.x + pipe.width <= 0) {
				if (pipe.spot == 'up') score++;
				pipes.shift();
				pipes.push(new Pipe(pipe.spot))
			}

			if (pipe.spot == 'up' && pipe.x - pipe.width <= bird.position.x && bird.position.y < pipe.height) {
				bird.reset();
			}

			if (pipe.spot == 'down' && pipe.x - pipe.width <= bird.position.x && bird.position.y > canvas.height - ~pipe.height) {
				bird.reset();
			}
		});

		// Calcul de la gravité
		bird.position.y -= bird.fallSpeed -= 0.3;

		// On dessine l'oiseau
		context.drawImage(bird, bird.position.x, bird.position.y, 35, 25);

		// Si l'oiseau touche le sol
		if (bird.position.y >= canvas.height) bird.reset();

		// On incrémente le score
		context.fillStyle = 'black';
		context.font = '17px Consolas';
		context.fillText(`Score : ${score}`, 10, 23);
		if (bestscore < score) {
			bestscore = score;
		}
		// On affiche le score
		context.fillText(`Best score : ${bestscore}`, 10, 50);
	}
	window.requestAnimationFrame(animate);
}
animate();
