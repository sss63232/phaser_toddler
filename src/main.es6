let game = new Phaser.Game(640, 360, Phaser.AUTO);
let animalDataArr = [{
		key: 'chicken',
		text: 'CHICKEN',
		frameWidth: 131
	},
	{
		key: 'horse',
		text: 'HORSE',
		frameWidth: 212
	},
	{
		key: 'pig',
		text: 'PIG',
		frameWidth: 297
	},
	{
		key: 'sheep',
		text: 'SHEEP',
		frameWidth: 244
	}
];

let GameState = {
	preload: function () {
		let imagesURL = '../assets/images/';
		let spritesheet = "_spritesheet.png";
		let audioURL = '../assets/audio/';
		let frameHeight = 200;

		// load spritesheets and audio
		animalDataArr.forEach(
			(value, index) => {
				this.load.spritesheet(
					value.key,
					imagesURL + value.key + spritesheet,
					value.frameWidth,
					frameHeight
				);
				this.load.audio(
					value.key + "Sound", [
						audioURL + value.key + ".ogg",
						audioURL + value.key + ".mp3"
					]
				)
			},
			this
		);

		this.load.image('background', imagesURL + 'background.png');
		this.load.image('arrow', imagesURL + 'arrow.png');
	},

	create: function () {
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;

		this.background = this.game.add.sprite(0, 0, 'background');

		this.animalsGroup = this.game.add.group();
		let animalSprite;
		animalDataArr.forEach(
			(value, index) => {
				// 最後一個參數指定 spritesheet 的 frame
				animalSprite = this.animalsGroup.create(-1000,
					this.game.world.centerY,
					value.key,
					0
				);
				animalSprite.customParams = {
					text: value.text,
					PhaserSound: this.game.add.audio(
						value.key + "Sound"
					)
				};
				animalSprite.anchor.setTo(0.5);
				animalSprite.animations.add('animate', [0, 1, 2, 1, 0, 1], 3, false);
				animalSprite.inputEnabled = true;
				animalSprite.input.pixelPerfectClick = true;
				animalSprite.events.onInputDown.add(this.animateAnimal, this);
			},
			this
		);

		this.currentAnimalSprite = this.animalsGroup.next();
		this.currentAnimalSprite.position.set(
			this.game.world.centerX,
			this.game.world.centerY
		);

		this.showCurrentAnimalText(this.currentAnimalSprite);

		// left arrow
		this.leftArrow = this.game.add.sprite(60, this.game.world.centerY, 'arrow');
		this.leftArrow.anchor.setTo(0.5);
		this.leftArrow.scale.x = -1;
		this.leftArrow.customParams = {
			direction: -1
		};

		this.leftArrow.inputEnabled = true;
		this.leftArrow.input.pixelPerfectClick = true;
		this.leftArrow.events.onInputDown.add(this.switchAnimal, this);


		// right arrow
		this.rightArrow = this.game.add.sprite(580, this.game.world.centerY, 'arrow');
		this.rightArrow.anchor.setTo(0.5);
		this.rightArrow.customParams = {
			direction: 1
		};

		this.rightArrow.inputEnabled = true;
		this.rightArrow.input.pixelPerfectClick = true;
		this.rightArrow.events.onInputDown.add(this.switchAnimal, this);

	},

	animateAnimal: function (sprite, event) {
		sprite.play('animate');
		sprite.customParams.PhaserSound.play();
	},

	switchAnimal: function (sprite, event) {
		let direction = sprite.customParams.direction;
		let newAnimal;
		let endX_for_currentAnimal;

		if (this.isMoving) return;

		this.isMoving = true;
		this.animalText.visible = false;
		if (direction > 0) {
			endX_for_currentAnimal = this.game.world.width + this.currentAnimalSprite.width / 2;
			newAnimal = this.animalsGroup.next();
			newAnimal.x = -newAnimal.width / 2;
		} else {
			endX_for_currentAnimal = -this.currentAnimalSprite.width / 2;
			newAnimal = this.animalsGroup.previous();
			newAnimal.x = this.game.world.width + newAnimal.width / 2;
		}

		let newAnimalMovement = this.game.add.tween(newAnimal);
		newAnimalMovement.to({
			x: this.game.world.centerX
		}, 500);
		newAnimalMovement.start();

		let currentAnimalMovement = this.game.add.tween(this.currentAnimalSprite);
		currentAnimalMovement.to({
			x: endX_for_currentAnimal
		}, 500);
		currentAnimalMovement.onComplete.add(
			function () {
				this.isMoving = false;
				this.showCurrentAnimalText(this.currentAnimalSprite);
			}, this
		);
		currentAnimalMovement.start();

		this.currentAnimalSprite = newAnimal;
	},

	showCurrentAnimalText(animalSprite) {
		if (!this.animalText) {
			let textStyle = {
				font: 'bold 30pt Arial',
				fill: '#D0171B',
				align: 'center'
			}
			this.animalText = this.game.add.text(
				this.game.world.centerX,
				this.game.world.height * 0.85,
				"",
				textStyle
			);
			this.animalText.anchor.setTo(0.5);
		}
		this.animalText.visible = true;
		this.animalText.setText(animalSprite.customParams.text);
	},

	update: function () {
		// // 旋轉 chicken
		// this.chicken.angle += 5;
	}
};

game.state.add('GameState', GameState);
game.state.start('GameState');