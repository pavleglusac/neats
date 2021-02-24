var playerLocalConfig;

var player_game_sketch = function(sketch)
{
  window.config = config;
  playerLocalConfig = JSON.parse(JSON.stringify(window.config));

  // for resetting settings that change due to
  // difficulty increasing
  const SETTINGS_BACKUP = { ...config.settings };
  const STATE = {
    birds: [],
    cacti: [],
    clouds: [],
    dino: null,
    gameOver: false,
    groundX: 0,
    groundY: 0,
    isRunning: false,
    level: 0,
    score: 0,
    highscore: 0
  };
  // eslint-disable-next-line no-unused-vars
  let PressStartFont, sprite;

  // global references for debugging
  window.sketch = sketch;
  window.state = STATE;

  function spriteImage (spriteName, ...clientCoords) {
    const { h, w, x, y } = playerLocalConfig.sprites[spriteName];

    // eslint-disable-next-line no-useless-call
    return sketch.image.apply(sketch, [sprite, ...clientCoords, w / 2, h / 2, x, y, w, h]);
  }

  function resetGame () {
    if (STATE.highscore < STATE.score) { 
      STATE.highscore = STATE.score;
    }
    Object.assign(STATE, {
      birds: [],
      cacti: [],
      dino: new Dino(sketch.height, playerLocalConfig),
      gameOver: false,
      isRunning: true,
      level: 0,
      score: 0
    });

    Object.assign(playerLocalConfig, SETTINGS_BACKUP);
    sketch.loop();
  }

  function endGame () {
    const iconSprite = playerLocalConfig.sprites.replayIcon;
    const padding = 15;

    sketch.fill('#535353');
    sketch.textAlign(sketch.CENTER);
    sketch.textFont(PressStartFont);
    sketch.textSize(12);
    sketch.text('G A M E  O V E R', (sketch.width / 2), (sketch.height / 2 - sketch.textSize() / 2 - padding));
    spriteImage('replayIcon', (sketch.width / 2 - iconSprite.w / 4), (sketch.height / 2 - iconSprite.h / 4 + padding));

    STATE.isRunning = false;
    sketch.noLoop();
  }

  function increaseDifficulty () {
    const { settings } = playerLocalConfig;
    const { bgSpeed, cactiSpawnRate, dinoLegsRate } = settings;
    const { level } = STATE;

    if (level > 5 && level < 8) {
      settings.bgSpeed++;
    } else if (level > 7 && level < 10) {
      settings.bgSpeed = Math.ceil(bgSpeed * 1.01);
      settings.cactiSpawnRate = Math.floor(cactiSpawnRate * 0.94);
      if (level > 7 && level % 2 === 0 && dinoLegsRate > 3) {
        settings.dinoLegsRate--;
      }
    }
  }

  function updateScore () {
    if (sketch.frameCount % playerLocalConfig.settings.scoreIncreaseRate === 0) {
      const oldLevel = STATE.level;

      STATE.score++;
      STATE.level = Math.floor(STATE.score / 100);

      if (STATE.level !== oldLevel) {
        increaseDifficulty();
      }
    }
  }

  function drawGround () {
    const { bgSpeed } = playerLocalConfig.settings;
    const groundImgWidth = playerLocalConfig.sprites.ground.w / 2;

    spriteImage('ground', STATE.groundX, STATE.groundY);
    STATE.groundX -= bgSpeed;

    // append second image until first is fully translated
    if (STATE.groundX <= -groundImgWidth + sketch.width) {
      spriteImage('ground', (STATE.groundX + groundImgWidth), STATE.groundY);
      if (STATE.groundX <= -groundImgWidth) {
        STATE.groundX = -bgSpeed;
      }
    }
  }

  function drawClouds () {
    const { clouds } = STATE;

    for (let i = clouds.length - 1; i >= 0; i--) {
      const cloud = clouds[i];

      cloud.nextFrame();

      if (cloud.x <= -cloud.width) {
        // remove if off screen
        clouds.splice(i, 1);
      } else {
        spriteImage(cloud.sprite, cloud.x, cloud.y);
      }
    }

    if (sketch.frameCount % playerLocalConfig.settings.cloudSpawnRate === 0) {
      clouds.push(new Cloud(sketch.width));
    }
  }

  function drawDino () {
    const { dino } = STATE;

    if (dino) {
      dino.nextFrame();
      spriteImage(dino.sprite, dino.x, dino.y);
    } else {
      spriteImage('dino', 25, (sketch.height - (playerLocalConfig.sprites.dino.h / 2) - 4));
    }
  }

  function drawCacti () {
    const { cacti } = STATE;

    for (let i = cacti.length - 1; i >= 0; i--) {
      const cactus = cacti[i];

      cactus.nextFrame();

      if (cactus.x <= -cactus.width) {
        // remove if off screen
        cacti.splice(i, 1);
      } else {
        spriteImage(cactus.sprite, cactus.x, cactus.y);
      }
    }

    if (sketch.frameCount % playerLocalConfig.settings.cactiSpawnRate === 0) {
      // randomly either do or don't add cactus
      if (Math.random() < 2/3) {
        let canSpawn = true;
        for (const bird of STATE.birds) {
          if (sketch.width - bird.x < playerLocalConfig.settings.spawnBuffer) {
            canSpawn = false;
            break;
          }
        }
        for (const c of cacti) {
          if (sketch.width - c.x < playerLocalConfig.settings.spawnBuffer / 2) {
            canSpawn = false;
            break;
          }
        }
        if (canSpawn) {
          cacti.push(new Cactus(sketch.width, sketch.height, playerLocalConfig));
        }
      }
    }
  }

  function drawScore () {
    sketch.fill('#535353');
    sketch.textAlign(sketch.RIGHT);
    sketch.textFont(PressStartFont);
    sketch.textSize(12);
    sketch.text((STATE.score + '').padStart(5, '0'), sketch.width, sketch.textSize() + 2);
  }
  
  function drawHighScore () {
    sketch.push();
    sketch.textAlign(sketch.LEFT);
    sketch.fill(55, 55, 55);
    sketch.textSize(12);
    sketch.text("pb:" + STATE.highscore, 2, sketch.textSize() + 2);
    sketch.pop();
  }

  function drawBirds () {
    const { birds } = STATE;
    for (let i = birds.length - 1; i >= 0; i--) {
      const bird = birds[i];

      bird.nextFrame();

      if (bird.x <= -bird.width) {
        // remove if off screen
        birds.splice(i, 1);
      } else {
        spriteImage(bird.sprite, bird.x, bird.y);
      }
    }

    if (sketch.frameCount % playerLocalConfig.settings.birdSpawnRate === 0) {
      // randomly either do or don't add bird
      if (randBoolean()) {
        let canSpawn = true;
        for (const cactus of STATE.cacti) {
          if (sketch.width - cactus.x < playerLocalConfig.settings.spawnBuffer) {
            canSpawn = false;
            break;
          }
        }
        if (canSpawn) {
          birds.push(new Bird(sketch.width, sketch.height, playerLocalConfig));
        }
      }
    }
  }

  function displayStartingText() {
    sketch.push();  
    sketch.textAlign(sketch.CENTER);
    sketch.fill(55, 55, 55);
    sketch.textSize(42);
    sketch.text("PLAYER'S DINO", sketch.width / 2, sketch.height / 2);
    sketch.pop();
    
    sketch.push();
    sketch.textAlign(sketch.CENTER);
    sketch.fill(55, 55, 55);
    sketch.textSize(25);
    sketch.text("Jump to start", sketch.width / 2, sketch.height / 2 + 32);
    sketch.pop();

    sketch.push();
    sketch.textAlign(sketch.CENTER);
    sketch.fill(55, 55, 55);
    sketch.textSize(15);
    sketch.text("Controls: W/SPACE = jump, S = duck", sketch.width / 2, sketch.height / 2 + 120);
    sketch.pop();
  }

  // triggered on pageload
  sketch.preload = () => {
    PressStartFont = sketch.loadFont('static/running-dino/assets/PressStart2P-Regular.ttf');
    sprite = sketch.loadImage('static/running-dino/assets/sprite.png');
  }

  // triggered after preload
  sketch.setup = () => {
    const canvas = sketch.createCanvas(1200, 300);
    canvas.parent("player");
    STATE.groundY = sketch.height - playerLocalConfig.sprites.ground.h / 2;
    sketch.noLoop();

    canvas.mouseClicked(() => {
      if (STATE.gameOver) {
        resetGame();
      }
    })
  }

  // triggered for every frame
  sketch.draw = () => {
    sketch.background('#f7f7f7');
    drawGround();
    drawClouds();
    drawDino();
    drawCacti();
    drawScore();
    drawHighScore();

    if (!STATE.isRunning) {
      displayStartingText();
    }

    if (STATE.level > 3) {
      drawBirds();
    }

    if (STATE.dino && STATE.dino.hits([STATE.cacti[0], STATE.birds[0]])) {
      STATE.gameOver = true;
    }

    if (STATE.gameOver) {
      endGame();
    } else {
      updateScore();
    }
  }

  sketch.keyPressed = () => {
    if (sketch.key === ' ' || sketch.key === 'w') {
      if (STATE.isRunning) {
        STATE.dino.jump();
      } else {
        resetGame();
      }
    } else if (sketch.key === 's') {
      if (STATE.isRunning) {
        STATE.dino.duck(true);
      }
    }
  }

  sketch.keyReleased = () => {
    if (sketch.key === 's') {
      STATE.dino.duck(false);
    }
  }
}
