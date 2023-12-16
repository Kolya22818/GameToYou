//ПЕРЕМЕННЫЕ
	
let rightPosition = 0;
let imgBlockPosition = 0;
let direction = 'right';
let hit = false;
let jump = false;
let fall = false;
let timer = null;
let x = 0;
let halfWidth = window.screen.width / 2;
let tileArray = [];
let objectsArray = [];
let enemiesArray = [];
let maxLives = 6;
let lives = 6;
let heartsArray = [];
let isRightSideBlocked = false;
let isLeftSideBlocked = false;
let wasHeroHit = false;


let jumpBlock = window.document.querySelector('#jump-block');
let hitBlock = window.document.querySelector('#hit-block');
let heroImg = window.document.querySelector('#hero-img');
let imgBlock = window.document.querySelector('#img-block');
let canvas = window.document.querySelector('#canvas');
let fsBtn = window.document.querySelector('#fsBtn');
let info = window.document.querySelector('#info');

let heroX = Math.floor((Number.parseInt(imgBlock.style.left)+1)/1);
let heroY = Math.floor(Number.parseInt(imgBlock.style.bottom)/32);

jumpBlock.style.top = `${window.screen.height/1.5 - 52}px`;
hitBlock.style.top = `${window.screen.height/2 - 72}px`;
console.log(`heroX = ${heroX}, heroY = ${heroY}`);

heroImg.onclick = (event) => {
	event.preventDefault();
}
fsBtn.onclick = () => {
	if(window.document.fullscreen){
		fsBtn.src = './img/fullscreen.png';
		window.document.exitFullscreen();
	}else{
		fsBtn.src = './img/cancel.png';
		canvas.requestFullscreen();
	}
}
jumpBlock.onclick = () => {jump = true};
hitBlock.onclick = () => {hit = true};

// TARGET

const moveWorldLeft = () => {
	objectsArray.map((elem, index) => {
		elem.style.left = Number.parseInt(elem.style.left) - 32;
	});
	tileArray.map((elem) => {
		elem[0] -= 1
	});
	enemiesArray.map(elem => elem.moveLeft());
}

const moveWorldRight = () => {
	objectsArray.map((elem, index) => {
		elem.style.left = Number.parseInt(elem.style.left) + 32;
	});
	tileArray.map((elem) => {
		elem[0] += 1
	});
	enemiesArray.map(elem => elem.moveRight());
}

function updateHeroXY() {
	heroX = Math.ceil((Number.parseInt(imgBlock.style.left) + 32) / 32);
	heroY = Math.ceil(Number.parseInt(imgBlock.style.bottom) / 32);

	info.innerText = `heroX = ${heroX}, heroY = ${heroY}`;
}
const checkFalling = () => {
	updateHeroXY();
	let isFalling = true;
	for(let i = 0; i < tileArray.length; i++){
		if ((tileArray[i][0] === heroX) && ((tileArray[i][1]+1) === heroY )) {
			isFalling = false;
		}
	}

	if(isFalling) {
		info.innerText = info.innerText + ', Falling';
		fall = true;
	} else {
		info.innerText = info.innerText + ', Not falling';
		fall = false;
	}
}
const fallHandler = () => {
	heroImg.style.top = '-96px';
	imgBlock.style.bottom = `${Number.parseInt(imgBlock.style.bottom)-32}px`;
	checkFalling();
}
const rightHandler = () => {
	if(!isRightSideBlocked) {
		heroImg.style.transform = "scale(-1,1)";
		rightPosition = rightPosition + 1;
		imgBlockPosition = imgBlockPosition + 1;
			if (rightPosition > 5) {
			rightPosition = 0;
		}
		heroImg.style.left = `-${rightPosition * 96}px`;
		heroImg.style.top = '-192px';
		imgBlock.style.left = `${imgBlockPosition * 20}px`;
	
		checkFalling();
		wasHeroHit = false;
		moveWorldLeft();
	}      
}
const leftHandler = () => {
	if(!isLeftSideBlocked) {
		heroImg.style.transform = "scale(1,1)";
		rightPosition = rightPosition + 1;
		imgBlockPosition = imgBlockPosition - 1;
			if (rightPosition > 5) {
				rightPosition = 0;
			}
		heroImg.style.left = `-${rightPosition * 96}px`;
		heroImg.style.top = '-192px';
		imgBlock.style.left = `${imgBlockPosition * 20}px`;

		checkFalling();  
		wasHeroHit = false;
		moveWorldRight();
	}                               
}	
const standHanlder = () => {
	switch (direction) {
		case 'right': {
			heroImg.style.transform = "scale(-1,1)";		
			if (rightPosition > 4) {
				rightPosition = 1;
			}				
			break;
		}
		case 'left': {
			heroImg.style.transform = "scale(1,1)";		
			if (rightPosition > 3) {
				rightPosition = 0;
			}					
			break;
		}
		default: break;
	}

	rightPosition = rightPosition + 1;
	heroImg.style.left = `-${rightPosition * 96}px`;
	heroImg.style.top = '0px';

	checkFalling();
}
const hitHandler = () => {
	switch (direction) {
		case 'right': {
			heroImg.style.transform = "scale(-1,1)";		
			if (rightPosition > 4) {
				rightPosition = 1;
				hit = false;
				wasHeroHit = true;
			}				
			break;
		}
		case 'left': {
			heroImg.style.transform = "scale(1,1)";		
			if (rightPosition > 3) {
				rightPosition = 0;
				hit = false;
				wasHeroHit = true;
			}					
			break;
		}
		default: break;
	}

	rightPosition = rightPosition + 1;
	heroImg.style.left = `-${rightPosition * 96}px`;
	heroImg.style.top = '-288px';
}
const jumpHandler = () => {
	switch (direction) {
		case 'right': {
			heroImg.style.transform = "scale(-1,1)";		
			if (rightPosition > 4) {
				rightPosition = 1;
				jump = false;
				imgBlock.style.bottom = `${Number.parseInt(imgBlock.style.bottom)+160}px`;
				imgBlockPosition = imgBlockPosition + 6;
				imgBlock.style.left = `${imgBlockPosition * 20}px`;
			}				
			break;
		}
		case 'left': {
			heroImg.style.transform = "scale(1,1)";		
			if (rightPosition > 3) {
				rightPosition = 0;
				jump = false;
				imgBlock.style.bottom = `${Number.parseInt(imgBlock.style.bottom)+160}px`;
				imgBlockPosition = imgBlockPosition - 6;
				imgBlock.style.left = `${imgBlockPosition * 20}px`;
			}					
			break;
		}
		default: break;
	}

	rightPosition = rightPosition + 1;
	heroImg.style.left = `-${rightPosition * 96}px`;
	heroImg.style.top = '-96px';
}	

// ОБРАБОТЧИКИ СОБЫТИЙ

let onTouchStart = (event) => {
	clearInterval(timer);
	x = (event.type === 'mousedown') ? event.screenX : event.touches[0].screenX;
	timer = setInterval(() => {
		if(x > halfWidth) {
			direction = 'right';
			rightHandler();
		} else {
			direction = 'left';
			leftHandler();
		}
	}, 130);
}
let onTouchEnd = (event) => {
	clearInterval(timer);
	lifeCycle();
}

window.onmousedown = onTouchStart;
window.ontouchstart = onTouchStart;
window.onmouseup = onTouchEnd;
window.ontouchend = onTouchEnd;	

const lifeCycle = () => {
	timer = setInterval(()=>{
		if (hit) {
			hitHandler();
		} else if (jump) {
			jumpHandler();
		} else if (fall) {
			fallHandler(); 
		} else {
			standHanlder();
		}
	}, 150);
}

const createTileBlack = (x, y = 0) => {
	let tileBlack = window.document.createElement('img');
	tileBlack.src = './grafics/1 Tiles/Tile_04.png';
	tileBlack.style.position = 'absolute';
	tileBlack.style.left = x*32;
	tileBlack.style.bottom = y*32;
	objectsArray.push(tileBlack);	
	canvas.appendChild(tileBlack);
}

const createTile = (x, y = 1) => {
	let tile = window.document.createElement('img');
	tile.src = './grafics/1 Tiles/Tile_02.png';
	tile.style.position = 'absolute';
	tile.style.left = x*32;
	tile.style.bottom = y*32;
	canvas.appendChild(tile);	
	objectsArray.push(tile);
	tileArray.push([x, y]);
}
const createTilesPlatform = (startX, startY, length) => {
	for (let i = 0; i < length; i++) {
		createTile(startX+i, startY);
	}
}
const addTiles = (i) => {
	createTile(i);
	createTileBlack(i);
}


class Bots {

	ATTAK = 'attack';
	DEATH = 'death';
	HURT = 'hurt';
	IDLE = 'idle';
	WALK = 'walk';

	state;
	animateWasChanged;
	lives;

	startX;
	startY;
	posX;
	posY;
	img;
	block;
	botPos;
	botMaxPos;
	timer;
	sourcePath;
	dir;
	stop;
	
	constructor(x,y) {
		this.posX = x;
		this.startX = this.posX;
		this.startY = this.posY;
		this.posY = y;
		this.blockSize = 96;
		this.botPos = 0;
		this.botMaxPos = 3;
		this.dir = 1;
		this.sourcePath = './bots/1/';
		this.lives = 30;

		this.state = this.IDLE;
		this.animateWasChanged = false;
		this.stop = false;

		this.createImg();
		this.changeAnnimate(this.WALK);
		enemiesArray.push(this);
		this.lifeCycle();
	}
	lifeCycle() {
		this.timer = setInterval(() => {

			if (this.animateWasChanged) {
				this.animateWasChanged = false;
				switch (this.state) {
					case this.ATTAK:
						this.setAttack();
						break;

				case this.ATTAK:
						this.setAttack();
						break;
				
				case this.DEATH:
						this.setDeath();
						break;
				
				case this.HURT:
						this.setHurt();
						break;

				case this.IDLE:
						this.setIdel();
						break;

				case this.WALK:
						this.setWalk();
						break;
						
					default:
						break;
				}
			}

			this.botPos++;
			this.checkCollide();
			
			if(!this.stop) {
				this.move();
			}else {
				if(this.state != this.DEATH) {
					if(this.state !== this.HURT) {
						this.changeAnnimate(this.ATTAK);
					}
				}
			}	
			this.animate();	
		}, 200);
	}
	createImg() {
		this.block = window.document.createElement('div');
		this.block.src = this.sourcePath+'Idle.png';
		this.block.style.position = 'absolute';
		this.block.style.left = this.posX*32;
		this.block.style.bottom = this.posY*32;
		this.block.style.width = `${this.blockSize}px`;
		this.block.style.height = `${this.blockSize}px`;
		this.block.style.overflow = 'hidden';

		this.img = window.document.createElement('img');
		this.img.src = this.sourcePath+'Idle.png';
		this.img.style.position = 'absolute';
		this.img.style.left = 0;
		this.img.style.bottom = 0;
		this.img.style.width = `${this.blockSize*4 + 1}px`;
		this.img.style.height = `${this.blockSize}px`;

		this.block.appendChild(this.img);
		canvas.appendChild(this.block);	
	}
	animate() {
		if (this.botPos > this.botMaxPos) {
			this.botPos = 0;
			if (this.state === this.ATTAK) {
				lives--;
				updateHearts();
			
			}
			
			if(this.state === this.HURT) {
				this.state === this.changeAnnimate(this.HURT === this.ATTAK);
				if (this.dir > 0) {
					this.botPos = 1;
				}
			}

			if(this.state === this.DEATH) {
				clearInterval(this.timer);
				isRightSideBlocked = false;
				isLeftSideBlocked = false;
				if (this.dir > 0) {
					this.botPos = 5;
				}
			}

		}
		this.img.style.left = -(this.botPos * this.blockSize);
	}
	setAttack() {
		this.img.src = this.sourcePath+'Attack.png';
		this.img.style.width = `${this.blockSize*6 + 1}px`
		this.botMaxPos = 5;
	}
	setDeath() {
		this.img.src = this.sourcePath+'Death.png';
		this.img.style.width = `${this.blockSize*6 + 1}px`
		this.botMaxPos = 5;
	}
	setHurt() {
		this.img.src = this.sourcePath+'Hurt.png';
		this.img.style.width = `${this.blockSize*2 + 1}px`
		this.botMaxPos = 1;
	}
	setIdel() {
		this.img.src = this.sourcePath+'Idle.png';
		this.img.style.width = `${this.blockSize*4 + 1}px`
		this.botMaxPos = 3;
	}
	setWalk() {
		this.img.src = this.sourcePath+'Walk.png';
		this.img.style.width = `${this.blockSize*6 + 1}px`
		this.botMaxPos = 5;
	}
	changeAnnimate(stateStr) {
		this.state = stateStr;
		this.animateWasChanged = true;
	}
	move() {
		if(this.posX > (this.startX + 6)){
			this.dir *= -1;
			this.img.style.transform = "scale(-1,1)";
		} else if(this.posX <= this.startX){
			this.dir = Math.abs(this.dir);
			this.img.style.transform = "scale(1,1)";
		}
		this.posX += this.dir;
		this.block.style.left = this.posX * 32;
	
	}
	checkHurt() {
		if(wasHeroHit) {
			if(this.lives <= 10) {
				wasHeroHit = false;
				this.changeAnnimate(this.DEATH);
			}else {
				wasHeroHit = false;
				this.changeAnnimate(this.HURT);
				this.showHurt();
				this.lives -= 10;
			}
		}
	}
	checkCollide() {
		if(heroY == this.posY) {
			if(heroX == this.posX){
				// attack left side
				this.checkHurt();
				isRightSideBlocked = true;
				this.stop = true;
			}else if (heroX == (this.posX + 3)) {
				//attack right side
				this.checkHurt();
				isLeftSideBlocked = true;
				this.stop = true;
			}else {
				isRightSideBlocked = false;
				isLeftSideBlocked = false;
				this.stop = false;
				this.changeAnnimate(this.WALK);
			}
		}else {
			isRightSideBlocked = false;
			isLeftSideBlocked = false;
			this.stop = false;
			this.changeAnnimate(this.WALK);
		}
	}
	showHurt() {
		let pos = 0;
		let text = window.document.createElement('p');
		text.innerText = '-10';
		text.style.position = 'absolute';
		text.style.left = (this.dir < 0) ? Number.parseInt(this.block.style.left) + 52 : Number.parseInt(this.block.style.left)+10;
		text.style.bottom = Number.parseInt(this.block.style.bottom) + 42;
		text.style.fontFamily = "'Permanent Marker', cursive";
		let hurtTimer = setInterval(() => {
			text.style.bottom = Number.parseInt(text.style.bottom) + 16;
			if(pos > 1) {
				clearInterval(hurtTimer);
				text.style.display = 'none';
			}
			pos++;
		}, 100);

		canvas.appendChild(text);
	}
	moveRight() {
		this.startX += 1;
		this.posX += 1;
	}
	moveLeft() {
		this.startX -= 1;
		this.posX -= 1;
	}
}

class Heart {
	img;
	x;
	constructor(x, src){
		this.x = x+1;
		this.img = window.document.createElement('img');
		this.img.src = src;
		this.img.style.position = 'absolute';
		this.img.style.left = `${this.x * 32}px`;
		this.img.style.bottom = `${((window.screen.height / 32) - 2) * 32}px`;
		this.img.style.width = '32px';
		this.img.style.height = '32px';

		canvas.appendChild(this.img);
	}
}
class HeartEmpty extends Heart {
	constructor(x){
		super(x, './grafics/Hearts/black_heart.png');
	}
}
class HeartRed extends Heart {
	constructor(x){
		super(x, './grafics/Hearts/heart.png');
	}
}
const addHearts = () => {
	for (let i = 0; i < maxLives; i++) {
		let heartEmpty = new HeartEmpty(i);
		let heartRed = new HeartRed(i);
		heartsArray.push(heartRed);
	}
}

const updateHearts = () => {
	if (lives < 1) {
		lives = 1;
	}
	for (let i = 0; i < lives; i++) {
		heartsArray[i].img.style.display = 'block';
	}
	for (let i = lives; i < maxLives; i++) {
		heartsArray[i].img.style.display = 'none';
	}
}

const createBackImg = (i) => {
	let img = window.document.createElement('img');
	img.src = './grafics/2 Background/Day/Background.png';
	img.style.position = 'absolute';
	img.style.left = i*window.screen.width;
	img.style.bottom = `${32}px`;
	img.style.width = window.screen.width;
	canvas.appendChild(img);
	objectsArray.push(img);
}

const addBackgroundImages = () => {
	for (let i = 0; i < 5; i++) {
		
	}
}

const start = () => {
	addBackgroundImages();
	lifeCycle();
	for(let i = 0; i < 50; i = i + 1){
		// if((i > 10) && (i < 17) ){
		// 	continue;
		// }
		addTiles(i);
	}

	createTilesPlatform(10, 10, 10);
	createTilesPlatform(15, 5, 10);
	let bots = new Bots(10, 2);

	addHearts();
	updateHearts();
}
start();