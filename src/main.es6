import UnsplashHandler from './UnsplashHandler';
import CoinAPI from './CoinAPI';

let unsplashImageURL;

let game = new Phaser.Game(800, 600, Phaser.AUTO);
let imagesURL = '../assets/images/';
let coinsTypeArr = [{
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC'
    },
    {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH'
    }, {
        id: 'ripple',
        name: 'Ripple',
        symbol: 'XRP'
    },
    {
        id: 'bitcoin-cash',
        name: 'Bitcoin Cash',
        symbol: 'BCH'
    },
    {
        id: 'litecoin',
        name: 'Litecoin',
        symbol: 'LTC'
    }
];
let GameState = {
    preload: function () {
        // load images
        this.load.crossOrigin = 'anonymous';
        this.load.image('arrow', imagesURL + 'arrow_circle.png');
        this.load.image('unsplash', unsplashImageURL + ".jpg");
        for (let i = 0, length = coinsTypeArr.length; i < length; i++) {
            let id = coinsTypeArr[i].id;
            this.load.image(
                id,
                `${imagesURL}${id}.png`
            );
        }

        // load audiosprite
        let audiospriteJSON = {
            "resources": [
                "audiosprite.ogg",
                "audiosprite.m4a",
                "audiosprite.mp3",
                "audiosprite.ac3"
            ],
            "spritemap": {
                "bitcoin-cash": {
                    "start": 0,
                    "end": 1.56,
                    "loop": false
                },
                "bitcoin": {
                    "start": 3,
                    "end": 3.5856009070294785,
                    "loop": false
                },
                "ethereum": {
                    "start": 5,
                    "end": 8.082448979591836,
                    "loop": false
                },
                "litecoin": {
                    "start": 10,
                    "end": 11.28,
                    "loop": false
                },
                "ripple": {
                    "start": 13,
                    "end": 13.484353741496598,
                    "loop": false
                }
            }
        };
        this.load.audioSprite(
            'sound',
            '../assets/audio/audiosprite.ogg',
            null,
            audiospriteJSON
        );
    },
    create: function () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.stage.backgroundColor = "#0c9fc7";
        // this.background = this.game.add.sprite(0, 0, 'unsplash');

        this.Phaser_AudioSprite_sound = this.game.add.audioSprite('sound');
        this.Phaser_AudioSprite_sound.allowMultiple = true;

        // add two text into one group for showing exchanger rate
        this.exchangeRatesText = this.game.add.group();
        this.changeRateText_usd = this.game.add.text(
            this.game.world.centerX,
            this.game.world.centerY + 50,
            `1 BTC => ${CoinAPI.getRate("bitcoin", "usd")}`, {},
            this.exchangeRatesText);
        this.changeRateText_usd.anchor.setTo(0.5);
        this.changeRateText_twd = this.game.add.text(
            this.game.world.centerX,
            this.game.world.centerY + 100,
            `1 BTC => ${CoinAPI.getRate("bitcoin", "twd")}`, {},
            this.exchangeRatesText);
        this.changeRateText_twd.anchor.setTo(0.5);

        // add the images of each coin
        this.coins = this.game.add.group();
        for (let i = 0, length = coinsTypeArr.length; i < length; i++) {
            let coin = this.coins.create(
                10000,
                this.game.world.centerY - 100,
                coinsTypeArr[i].id,
                0
            );
            coin.customParams = {
                id: coinsTypeArr[i].id,
                name: coinsTypeArr[i].name,
                symbol: coinsTypeArr[i].symbol
            };
            coin.anchor.setTo(0.5);
            coin.inputEnabled = true;
            coin.events.onInputDown.add(this.pronounceCoinName, this);
        }

        // take bitcoin to be the first one
        this.currentCoin = this.coins.getBottom();
        this.currentCoin.position.set(
            this.game.world.centerX,
            this.game.world.centerY - 100
        );


        // left arrow
        this.leftArrow = this.game.add.sprite(
            this.game.world.x + 100,
            this.game.world.centerY,
            'arrow');
        this.leftArrow.anchor.setTo(0.5);
        this.leftArrow.scale.x = -1;
        this.leftArrow.customParams = {
            direction: -1
        };

        this.leftArrow.inputEnabled = true;
        this.leftArrow.events.onInputDown.add(this.switchCoin, this);


        // right arrow
        this.rightArrow = this.game.add.sprite(
            this.world.x + 700,
            this.game.world.centerY,
            'arrow');
        this.rightArrow.anchor.setTo(0.5);
        this.rightArrow.customParams = {
            direction: 1
        };

        this.rightArrow.inputEnabled = true;
        this.rightArrow.events.onInputDown.add(this.switchCoin, this);
    },

    pronounceCoinName: function (sprite, event) {
        this.Phaser_AudioSprite_sound.play(this.currentCoin.customParams.id);
    },

    switchCoin: function (sprite, event) {
        let direction = sprite.customParams.direction;
        let newCoin;
        let endX_for_currentCoin;

        if (this.isMoving) return;

        this.isMoving = true;
        if (direction > 0) {
            endX_for_currentCoin = this.game.world.width + this.currentCoin.width / 2;
            newCoin = this.coins.next();
            newCoin.x = -newCoin.width / 2;
        } else {
            endX_for_currentCoin = -this.currentCoin.width / 2;
            newCoin = this.coins.previous();
            newCoin.x = this.game.world.width + newCoin.width / 2;
        }

        let newCoinMovement = this.game.add.tween(newCoin);
        newCoinMovement.to({
            x: this.game.world.centerX
        }, 500);
        newCoinMovement.start();

        let currentCoinMovement = this.game.add.tween(this.currentCoin);
        currentCoinMovement.to({
            x: endX_for_currentCoin
        }, 500);
        currentCoinMovement.onComplete.add(
            function () {
                this.isMoving = false;
            }, this
        );
        currentCoinMovement.start();

        this.currentCoin = newCoin;
        this.changeRateText_usd.setText(
            `1 ${this.currentCoin.customParams.symbol} => ${CoinAPI.getRate(this.currentCoin.customParams.id, "usd")} usd`
        );
        this.changeRateText_twd.setText(
            `1 ${this.currentCoin.customParams.symbol} => ${CoinAPI.getRate(this.currentCoin.customParams.id, "twd")} twd`
        );
    },

    update: function () {}
};


let startPhaser = () => {
    game.state.add('GameState', GameState);
    game.state.start('GameState');
};

CoinAPI.getExchangeRates();
startPhaser();


let unsplash = new UnsplashHandler;
unsplash.getRandomPhoto()
    .then(fetchedURL => {
        unsplashImageURL = fetchedURL;
    })
    .catch((reason) => {
        console.log('------------------------------------');
        console.log(`error, reason ${reason}`);
        console.log('------------------------------------');
    });