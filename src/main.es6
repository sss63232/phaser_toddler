import UnsplashHandler from './UnsplashHandler';

let unsplashImageURL;
let game = new Phaser.Game(640, 360, Phaser.AUTO);
let imagesURL = '../assets/images/';
let GameState = {
    preload: function () {
        this.load.crossOrigin = 'anonymous';
        this.load.image('background', imagesURL + 'background.png');
        this.load.image('arrow', imagesURL + 'arrow.png');
        this.load.image('unsplash', unsplashImageURL + ".jpg");

        // animation spritesheet
        // let spritesheet = "_spritesheet.png";
        // this.load.spritesheet("chicken", imagesURL + "chicken" + spritesheet, 131, 200, 3);
    },
    create: function () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        this.background = this.game.add.sprite(0, 0, 'unsplash');

        let animalData = [{
                key: 'chicken',
                text: 'CHICKEN'
            },
            {
                key: 'horse',
                text: 'HORSE'
            },
            {
                key: 'pig',
                text: 'PIG'
            }
        ];

        this.animals = this.game.add.group();
        animalData.forEach(
            function (element) {
                let animal = this.animals.create(-200, this.game.world.centerY, element.key, 0);
                animal.customParams = {
                    text: element.text
                };
                animal.anchor.setTo(0.5);
                animal.animations.add('animate', [0, 1, 2, 1, 0, 1], 3, false);
                animal.inputEnabled = true;
                animal.input.pixelPerfectClick = true;
                animal.events.onInputDown.add(this.animateAnimal, this);
            },
            this
        );

        this.currentAnimal = this.animals.next();
        this.currentAnimal.position.set(
            this.game.world.centerX,
            this.game.world.centerY
        );


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
    },

    switchAnimal: function (sprite, event) {
        let direction = sprite.customParams.direction;
        let newAnimal;
        let endX_for_currentAnimal;

        if (this.isMoving) return;

        this.isMoving = true;
        if (direction > 0) {
            endX_for_currentAnimal = this.game.world.width + this.currentAnimal.width / 2;
            newAnimal = this.animals.next();
            newAnimal.x = -newAnimal.width / 2;
        } else {
            endX_for_currentAnimal = -this.currentAnimal.width / 2;
            newAnimal = this.animals.previous();
            newAnimal.x = this.game.world.width + newAnimal.width / 2;
        }

        let newAnimalMovement = this.game.add.tween(newAnimal);
        newAnimalMovement.to({
            x: this.game.world.centerX
        }, 500);
        newAnimalMovement.start();

        let currentAnimalMovement = this.game.add.tween(this.currentAnimal);
        currentAnimalMovement.to({
            x: endX_for_currentAnimal
        }, 500);
        currentAnimalMovement.onComplete.add(
            function () {
                this.isMoving = false;
            }, this
        );
        currentAnimalMovement.start();

        this.currentAnimal = newAnimal;
    },

    update: function () {
        // // 旋轉 chicken
        // this.chicken.angle += 5;
    }
};

let unsplash = new UnsplashHandler;
unsplash.getRandomPhoto()
    .then(fetchedURL => {
        unsplashImageURL = fetchedURL;
        (function (gameStateObj) {
            game.state.add('GameState', gameStateObj);
            game.state.start('GameState');
        })(GameState);
    })
    .catch((reason) => {
        console.log('------------------------------------');
        console.log(`error, reason ${reason}`);
        console.log('------------------------------------');
    });