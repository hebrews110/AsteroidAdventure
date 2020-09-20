/**
 * 
 * Game configurations.
 * @name configurations
 */
const configurations = {
    type: Phaser.AUTO,
    width: 288,
    height: 512,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 300
            },
            debug: false
        }
    },
    input: {
        windowEvents: false
    },
    scale: {
        mode: Phaser.Scale.FIT
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

var isTopDivPressed = false, isBottomDivPressed = false;

window.onload = function() {
    
}

/**
 *  Game assets.
 *  @name assets
 */
const assets = {
    bird: {
        red: 'bird-red',
        yellow: 'bird-yellow',
        blue: 'bird-blue'
    },
    sounds: {
        spaceship: {
            idles: 'spaceship-idles',
            moves: 'spaceship-moves'
        },
        player: {
            answers_correctly: 'player-answers-correctly'
        }
    },
    obstacle: {
        pipe: {
            green: {
                top: 'pipe-green-top',
                bottom: 'pipe-green-bottom'
            },
            red: {
                top: 'pipe-red-top',
                bottom: 'pipe-red-bo'
            }
        },
        asteroid: 'asteroid'
    },
    scene: {
        width: 144,
        background: {
            day: 'background-day',
            night: 'background-night'
        },
        ground: 'ground',
        gameOver: 'game-over',
        restart: 'restart-button',
        messageInitial: 'message-initial'
    },
    spaceship: 'spaceship',
    scoreboard: {
        width: 25,
        base: 'number',
        number0: 'number0',
        number1: 'number1',
        number2: 'number2',
        number3: 'number3',
        number4: 'number4',
        number5: 'number5',
        number6: 'number6',
        number7: 'number7',
        number8: 'number8',
        number9: 'number9'
    },
    animation: {
        bird: {
            red: {
                clapWings: 'red-clap-wings',
                stop: 'red-stop'
            },
            blue: {
                clapWings: 'blue-clap-wings',
                stop: 'blue-stop'
            },
            yellow: {
                clapWings: 'yellow-clap-wings',
                stop: 'yellow-stop'
            }
        },
        ground: {
            moving: 'moving-ground',
            stop: 'stop-ground'
        }
    }
}

// Game
/**
 * The main controller for the entire Phaser game.
 * @name game
 * @type {object}
 */
let game
let operation
let maxResultSize
window.addEventListener("load", function() {
    Swal.fire({
        title: 'Asteroid Adventure',
        text: 'Choose a facts category.',
        input: 'select',
        allowOutsideClick: false,
        allowEscapeKey: false,
        inputOptions: {
            '5': 'Facts to 5',
            '10': 'Facts to 10',
        }
    }).then(function(result) {
        let values = result.value;
        maxResultSize = parseInt(values);
        let suffix = ' (to ' + maxResultSize + ')';
        Swal.fire({
            title: 'Asteroid Adventure',
            text: 'Choose a game mode.',
            input: 'select',
            allowOutsideClick: false,
            allowEscapeKey: false,
            inputOptions: {
                'add': 'Addition' + suffix,
                'subtract': 'Subtraction' + suffix,
                'multiply': 'Multiplication' + suffix,
                'divide': 'Division' + suffix,
            }
        }).then(function(result) {
            operation = result.value;
            game = new Phaser.Game(configurations);
        });
    });
}) 
/**
 * If it had happened a game over.
 * @type {boolean}
 */
let gameOver
/**
 * If the game has been started.
 * @type {boolean}
 */
let gameStarted
/**
 * Up button component.
 * @type {object}
 */
let upButton
/**
 * Restart button component.
 * @type {object}
 */
let restartButton
/**
 * Game over banner component.
 * @type {object}
 */
let gameOverBanner
/**
 * Message initial component.
 * @type {object}
 */
let messageInitial
// Bird
/**
 * Player component.
 * @type {object}
 */
let player
/**
 * Bird name asset.
 * @type {string}
 */
let birdName

let isMuted = false;

/**
 * Quantity frames to move up.
 * @type {number}
 */
let framesMoveUp
// Background
/**
 * Day background component.
 * @type {object}
 */
let backgroundDay
let idleSound
let moveSound
/**
 * Ground component.
 * @type {object}
 */
let ground
// pipes
/**
 * Pipes group component.
 * @type {object}
 */
let pipesGroup
/**
 * Gaps group component.
 * @type {object}
 */
let gapsGroup
/**
 * Counter till next pipes to be created.
 * @type {number}
 */
let nextPipes
/**
 * Current pipe asset.
 * @type {object}
 */
let currentPipe
// score variables
/**
 * Scoreboard group component.
 * @type {object}
 */
let scoreboardGroup
/**
 * Score counter.
 * @type {number}
 */
let score

var GAME_SPEED = -160;

var backgroundDivOffset = 0;
var body;

/**
 *   Load the game assets.
 */
function preload() {

    body = document.querySelector("body");
    // Backgrounds and ground
    this.load.image(assets.scene.background.day, 'assets/background-day.png')
    this.load.image(assets.scene.background.night, 'assets/background-night.png')
    this.load.spritesheet(assets.scene.ground, 'assets/ground-sprite.png', {
        frameWidth: 336,
        frameHeight: 112
    })

    // Pipes
    this.load.image(assets.obstacle.pipe.green.top, 'assets/pipe-green-top.png')
    this.load.image(assets.obstacle.pipe.green.bottom, 'assets/pipe-green-bottom.png')
    this.load.image(assets.obstacle.pipe.red.top, 'assets/pipe-red-top.png')
    this.load.image(assets.obstacle.pipe.red.bottom, 'assets/pipe-red-bottom.png')
    this.load.image(assets.obstacle.asteroid, 'assets/asteroid.png')

    // Start game
    this.load.image(assets.scene.messageInitial, 'assets/message-initial.png')

    // End game
    this.load.image(assets.scene.gameOver, 'assets/gameover.png')
    this.load.image(assets.scene.restart, 'assets/restart-button.png')

    // Spaceship
    this.load.image(assets.spaceship, 'assets/spaceship.png');
    // Birds
    this.load.spritesheet(assets.bird.red, 'assets/bird-red-sprite.png', {
        frameWidth: 34,
        frameHeight: 24
    })
    this.load.spritesheet(assets.bird.blue, 'assets/bird-blue-sprite.png', {
        frameWidth: 34,
        frameHeight: 24
    })
    this.load.spritesheet(assets.bird.yellow, 'assets/bird-yellow-sprite.png', {
        frameWidth: 34,
        frameHeight: 24
    })

    // Numbers
    this.load.image(assets.scoreboard.number0, 'assets/number0.png')
    this.load.image(assets.scoreboard.number1, 'assets/number1.png')
    this.load.image(assets.scoreboard.number2, 'assets/number2.png')
    this.load.image(assets.scoreboard.number3, 'assets/number3.png')
    this.load.image(assets.scoreboard.number4, 'assets/number4.png')
    this.load.image(assets.scoreboard.number5, 'assets/number5.png')
    this.load.image(assets.scoreboard.number6, 'assets/number6.png')
    this.load.image(assets.scoreboard.number7, 'assets/number7.png')
    this.load.image(assets.scoreboard.number8, 'assets/number8.png')
    this.load.image(assets.scoreboard.number9, 'assets/number9.png')

    // Sounds
    this.load.audio(assets.sounds.spaceship.idles, 'assets/sounds/spaceship_idles.wav');
    this.load.audio(assets.sounds.spaceship.moves, 'assets/sounds/spaceship_moves.wav');
    this.load.audio(assets.sounds.player.answers_correctly, 'assets/sounds/correct.wav');
}

/**
 *   Create the game objects (images, groups, sprites and animations).
 */
function create() {
    var touchControlUp = document.querySelector("canvas");
    touchControlUp.addEventListener("touchstart", function(e) {
        if(gameOver || !gameStarted)
            return;
        if(e.touches[0].clientY <= (touchControlUp.clientHeight / 2))
            isTopDivPressed = true;
        else
            isBottomDivPressed = true;
    });
    touchControlUp.addEventListener("touchend", function(e) {
        if(gameOver || !gameStarted)
            return;
        if(e.changedTouches[0].clientY <= (touchControlUp.clientHeight / 2))
            isTopDivPressed = false;
        else
            isBottomDivPressed = false;
    });
    backgroundDay = this.add.tileSprite(0, 0, 288*2, 512*2, assets.scene.background.day).setInteractive()
    backgroundDay.on('pointerdown', startGameIfNotOver)

    try {
        idleSound = this.sound.add(assets.sounds.spaceship.idles, {
            loop: true
        });
    } catch(e) {

    }
    

    try {
        moveSound = this.sound.add(assets.sounds.spaceship.moves);
    } catch(e) {

    }


    gapsGroup = this.physics.add.group()
    pipesGroup = this.physics.add.group()
    scoreboardGroup = this.physics.add.staticGroup()

    ground = this.physics.add.sprite(assets.scene.width, 508, assets.scene.ground)
    ground.setCollideWorldBounds(true)
    ground.setDepth(10)
    ground.visible = false

    messageInitial = this.add.image(assets.scene.width, 156, assets.scene.messageInitial)
    messageInitial.setDepth(30)
    messageInitial.visible = false

    upButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
    downButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)

    prepareGame(this)

    gameOverBanner = this.add.image(assets.scene.width, 206, assets.scene.gameOver)
    gameOverBanner.setDepth(20)
    gameOverBanner.visible = false

    restartButton = this.add.image(assets.scene.width, 300, assets.scene.restart).setInteractive()
    restartButton.on('pointerdown', restartGame)
    restartButton.setDepth(20)
    restartButton.visible = false
}

var inDialog = false;
function dialogAndWait(scene, fn) {
    scene.physics.pause()
    isBottomDivPressed = false
    isTopDivPressed = false
    scene.sound.setMute(true)
    inDialog = true;
    fn(function() {
        inDialog = false;
        scene.sound.setMute(isMuted)
        scene.physics.resume();
        document.querySelector("canvas").focus();
    });

}
/**
 *  Update the scene frame by frame, responsible for move and rotate the bird and to create and move the pipes.
 */
function update() {
    if (gameOver || !gameStarted || inDialog)
        return

    
    backgroundDay.tilePositionX += 0.5;
    
    if (framesMoveUp > 0)
        framesMoveUp--
    else if (upButton.isDown || isTopDivPressed)
        moveBird(-1)
    else if (downButton.isDown || isBottomDivPressed) {
        moveBird(1)
    } else {
        player.setVelocityY(0)
        if(moveSound != null)
            moveSound.stop()
    }

    player.setVelocityX(0)
    player.x = 60
    pipesGroup.children.iterate(function (child) {
        if (child == undefined)
            return

        if (child.x < -50)
            child.destroy()
        else
            child.setVelocityX(GAME_SPEED)
    })

    gapsGroup.children.iterate(function (child) {
        child.body.setVelocityX(GAME_SPEED)
    })

    nextPipes++
    if (nextPipes === Math.round(50*(200/Math.abs(GAME_SPEED)))) {
        
        makePipes(game.scene.scenes[0])
        nextPipes = 0
    }
}

function setGameOver() {
    gameOver = true
    gameStarted = false

    if(idleSound != null)
        idleSound.stop()

    ground.anims.play(assets.animation.ground.stop)

    gameOverBanner.visible = true
    restartButton.visible = true
}

/**
 *  Bird collision event.
 *  @param {object} player - Game object that collided, in this case the bird. 
 */
function hitBird(player, target) {
    var currentCorrectAnswer = getRandomIntInclusive(1, maxResultSize);
    var firstFactor, secondFactor, symbol;
    
    if(operation != null)
        operation = operation.trim();
    
    if(operation == "add") {
        symbol = "&plus;";
        firstFactor = getRandomIntInclusive(1, currentCorrectAnswer);
        secondFactor = currentCorrectAnswer - firstFactor;
    } else if(operation == "subtract") {
        symbol = "&minus;";
        currentCorrectAnswer = getRandomIntInclusive(1, maxResultSize);
        secondFactor = getRandomIntInclusive(1, maxResultSize);
        firstFactor = currentCorrectAnswer + secondFactor;
    } else if(operation == "multiply") {
        symbol = "&times;";
        firstFactor = getRandomIntInclusive(1, maxResultSize);
        secondFactor = getRandomIntInclusive(1, maxResultSize);
        currentCorrectAnswer = firstFactor * secondFactor;
    } else if(operation == "divide") {
        var divisor = getRandomIntInclusive(2, 6);
        firstFactor = currentCorrectAnswer * divisor;
        secondFactor = divisor;
        symbol = "&divide;";
    } else
        window.alert("Unknown ?operation");
    player.x = 60
    dialogAndWait(game.scene.scenes[0], function(res) {
        Swal.fire({
            title: firstFactor + ' ' + symbol + ' ' + secondFactor + ' = ?',
            input: 'text',
            allowOutsideClick: false,
            allowEscapeKey: false,
            inputPlaceholder: 'Enter your answer',
            inputAttributes: {
                pattern: "[0-9]*",
                inputmode: "numeric",
                autocapitalize: 'off'
            },
            showCancelButton: false,
            preConfirm: function(val) {
                if(typeof val == 'undefined' || val.trim().length == 0) {
                    Swal.showValidationMessage("Your answer cannot be blank.");
                    return;
                }
                return val;
            }
        }).then(function(val) {
            if(val.value == currentCorrectAnswer) {
                target.destroy();
                player.setVelocityY(0)
                player.x = 60
                framesMoveUp = 0
                updateScore(null, null);
                updateScore(null, null);
                try {
                    game.scene.scenes[0].sound.play(assets.sounds.player.answers_correctly);
                } catch(e) {

                }
                res();
            } else {
                Swal.fire({
                    title: 'Hmm...',
                    html: 'Not quite. ' + firstFactor + ' ' + symbol + ' ' + secondFactor + ' = ' + currentCorrectAnswer + '.'
                }).then(function() {
                    game.scene.scenes[0].sound.setMute(isMuted);
                });
                setGameOver();
            }
        });
        
    });
}

/**
 *   Update the scoreboard.
 *   @param {object} _ - Game object that overlapped, in this case the bird (ignored).
 *   @param {object} gap - Game object that was overlapped, in this case the gap.
 */
function updateScore(_, gap) {
    score++
    if(gap)
        gap.destroy()

    if (score % 10 == 0) {

        if (currentPipe === assets.obstacle.pipe.green)
            currentPipe = assets.obstacle.pipe.red
        else
            currentPipe = assets.obstacle.pipe.green
    }

    if(score >= 300) {
        dialogAndWait(game.scene.scenes[0], function(res) {
            Swal.fire({
                title: 'Nice work!.',
                html: 'You reached 300 points!'
            }).then(function() {
                game.scene.scenes[0].sound.setMute(isMuted);
                setGameOver();
            });
        });
        
    }

    updateScoreboard()
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive 
  }

/**
 * Create pipes and gap in the game.
 * @param {object} scene - Game scene.
 */
function makePipes(scene) {
    if (!gameStarted || gameOver) return


    updateScore(null, null);

    const numPipes = getRandomIntInclusive(2, 10);
    const pipesAdded = [];
    for(var i = 0; i < numPipes; i++) {
        let numTries = 0;
        let pipeTopY = undefined;
        do {
            pipeTopY = Phaser.Math.Between(-200, 200)
        } while((numTries++ <= 3) && pipesAdded.some(function(num) { return Math.abs(pipeTopY-num) <= 20 }));
        if(typeof pipeTopY == 'undefined')
            continue;
        pipesAdded.push(pipeTopY);

    
        const gap = scene.add.image(288, pipeTopY + 210, assets.obstacle.asteroid);
        gapsGroup.add(gap)
        gap.body.allowGravity = false
        gap.visible = true
    
        
    }
}

function startGameIfNotOver() {
    if (gameOver)
        return

    if (!gameStarted)
        startGame(game.scene.scenes[0])

}

/**
 * Move the bird in the screen.
 */
function moveBird(sign) {
    if (gameOver)
        return

    startGameIfNotOver();

    player.setVelocityY(sign * 200)
    framesMoveUp = 10
    if(moveSound != null)
        moveSound.play()
}



/**
 * Get a random bird color.
 * @return {string} Bird color asset.
 */
function getRandomBird() {
    switch (Phaser.Math.Between(0, 2)) {
        case 0:
            return assets.bird.red
        case 1:
            return assets.bird.blue
        case 2:
        default:
            return assets.bird.yellow
    }
}

/**
 * Get the animation name from the bird.
 * @param {string} birdColor - Game bird color asset.
 * @return {object} - Bird animation asset.
 */
function getAnimationBird(birdColor) {
    switch (birdColor) {
        case assets.bird.red:
            return assets.animation.bird.red
        case assets.bird.blue:
            return assets.animation.bird.blue
        case assets.bird.yellow:
        default:
            return assets.animation.bird.yellow
    }
}

/**
 * Update the game scoreboard.
 */
function updateScoreboard() {
    scoreboardGroup.clear(true, true)

    const scoreAsString = score.toString()
    if (scoreAsString.length == 1)
        scoreboardGroup.create(assets.scene.width, 30, assets.scoreboard.base + score).setDepth(10)
    else {
        let initialPosition = assets.scene.width - ((score.toString().length * assets.scoreboard.width) / 2)

        for (let i = 0; i < scoreAsString.length; i++) {
            scoreboardGroup.create(initialPosition, 30, assets.scoreboard.base + scoreAsString[i]).setDepth(10)
            initialPosition += assets.scoreboard.width
        }
    }
}

/**
 * Restart the game. 
 * Clean all groups, hide game over objects and stop game physics.
 */
function restartGame() {
    pipesGroup.clear(true, true)
    pipesGroup.clear(true, true)
    gapsGroup.clear(true, true)
    scoreboardGroup.clear(true, true)
    player.destroy()
    gameOverBanner.visible = false
    restartButton.visible = false

    const gameScene = game.scene.scenes[0]
    prepareGame(gameScene)

    gameScene.physics.resume()
    inDialog = false
}

/**
 * Restart all variable and configurations, show main and recreate the bird.
 * @param {object} scene - Game scene.
 */
function prepareGame(scene) {
    framesMoveUp = 0
    nextPipes = 0
    currentPipe = assets.obstacle.pipe.green
    score = 0
    gameOver = false
    backgroundDay.visible = true
    messageInitial.visible = true

    birdName = assets.spaceship
    player = scene.physics.add.sprite(60, 265, birdName)
    player.setCollideWorldBounds(true)
    player.body.allowGravity = false

    scene.physics.add.collider(player, ground, function(){}, null, scene)
    scene.physics.add.collider(player, gapsGroup, hitBird, null, scene)

    ground.anims.play(assets.animation.ground.moving, true)

    Swal.fire({
        title: 'Help',
        text: 'On a PC, use the up and down arrow keys to steer the ship. On mobile, tap the top and bottom half of your screen. Avoid the asteroids!'
    });
}

/**
 * Start the game, create pipes and hide the main menu.
 * @param {object} scene - Game scene.
 */
function startGame(scene) {
    gameStarted = true
    messageInitial.visible = false

    const score0 = scoreboardGroup.create(assets.scene.width, 30, assets.scoreboard.number0)
    score0.setDepth(20)

    makePipes(scene)
    if(idleSound != null)
        idleSound.play()
}