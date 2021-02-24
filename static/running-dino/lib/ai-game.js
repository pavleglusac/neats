
var aiLocalConfig;

var ai_game_sketch = function(sketch)
{
  
  window.config = config;
  aiLocalConfig = JSON.parse(JSON.stringify(window.config));

  const NUMBER_OF_DINOS = units.length;
  var playerCount = NUMBER_OF_DINOS;

  var generation = 1;
  var allDinos = [];
  var bestDino = null;

  // for resetting settings that change due to
  // difficulty increasing
  const SETTINGS_BACKUP = { ...config.settings }
  const STATE = {
    birds: [],
    cacti: [],
    clouds: [],
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
    const { h, w, x, y } = aiLocalConfig.sprites[spriteName];

    // eslint-disable-next-line no-useless-call
    return sketch.image.apply(sketch, [sprite, ...clientCoords, w / 2, h / 2, x, y, w, h]);
  }

  
  function getNextObstacle () {
    if (!STATE.cacti && !STATE.birds) { return null }
    let closest = STATE.cacti ? STATE.cacti[0] : null;
    let closestx = closest ? closest.x : 1000;
    for (bird of STATE.birds) {
      if (bird.x < closestx && bird.x > bestDino.x) {
        closest = bird;
        break;
      }
    }
    for (cactus of STATE.cacti) {
      if (cactus.x < closestx && cactus.x > bestDino.x) {
        closest = cactus;
        break;
      }
    }
    return closest;
  }

  function handleHighscore () {
    if (STATE.highscore < STATE.score) { 
      STATE.highscore = STATE.score;
    }
    console.log('HIGHSCORE >>> ', STATE.highscore)
  }

  function resetGame () {
    console.log(">>> GENERATION: ", generation, " <<<");
    startNextGeneration();
    handleHighscore();

    Object.assign(STATE, {
      birds: [],
      cacti: [],
      gameOver: false,
      isRunning: true,
      level: 0,
      score: 0
    });

    playerCount = NUMBER_OF_DINOS;
    bestDino = allDinos[NUMBER_OF_DINOS-1];
    best_unit = bestDino.unit;

    Object.assign(aiLocalConfig.settings, SETTINGS_BACKUP);
    sketch.loop();
  }

  function increaseDifficulty () {
    const { settings } = aiLocalConfig;
    const { bgSpeed, cactiSpawnRate, dinoLegsRate } = settings;
    const { level } = STATE;

    if (level > 5 && level < 9) {
      settings.bgSpeed++;
      settings.cactiSpawnRate = Math.floor(cactiSpawnRate * 0.94);
      if (level > 7 && level % 2 === 0 && dinoLegsRate > 3) {
        settings.dinoLegsRate--;
      }
    }
  }

  function updateScore () {
    if (sketch.frameCount % aiLocalConfig.settings.scoreIncreaseRate === 0) {
      const oldLevel = STATE.level;

      STATE.score++;
      STATE.level = Math.floor(STATE.score / 100);

      if (STATE.level !== oldLevel) {
        increaseDifficulty();
      }
    }
  }

  function drawGround () {
    const { bgSpeed } = aiLocalConfig.settings;
    const groundImgWidth = aiLocalConfig.sprites.ground.w / 2;

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

    if (sketch.frameCount % aiLocalConfig.settings.cloudSpawnRate === 0) {
      clouds.push(new Cloud(sketch.width));
    }
  }

  function drawDinos () {
    for (var dino of allDinos) {
      if (dino && dino.isAlive) {
        dino.nextFrame();
        spriteImage(dino.sprite, dino.x, dino.y);
      }
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

    if (sketch.frameCount % aiLocalConfig.settings.cactiSpawnRate === 0) {
      // randomly either do or don't add cactus
      if (Math.random() < 3/5) {
        let canSpawn = true;
        for (const bird of STATE.birds) {
          if (sketch.width - bird.x < aiLocalConfig.settings.spawnBuffer) {
            canSpawn = false;
            break;
          }
        }
        for (const c of cacti) {
          if (sketch.width - c.x < aiLocalConfig.settings.spawnBuffer / 2) {
            console.log("SKIPPED CACTUS SPAWN");
            canSpawn = false;
            break;
          }
        }
        if (canSpawn) {
          cacti.push(new Cactus(sketch.width, sketch.height, aiLocalConfig));
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

  function drawInfo() {
    sketch.push();
    sketch.textAlign(sketch.CENTER);
    sketch.fill(55, 55, 55);
    sketch.textSize(12);
    sketch.text("generation " + generation, sketch.width / 2, sketch.textSize() + 20);
    sketch.pop();

    sketch.push();
    sketch.textAlign(sketch.CENTER);
    sketch.textSize(10);
    sketch.text("left alive " + playerCount, sketch.width / 2, sketch.textSize() + 35);
    sketch.pop();

    sketch.push();
    sketch.textAlign(sketch.LEFT);
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

    if (sketch.frameCount % aiLocalConfig.settings.birdSpawnRate === 0) {
      // randomly either do or don't add bird
      if (randBoolean()) {
        let canSpawn = true;
        for (const cactus of STATE.cacti) {
          if (sketch.width - cactus.x < aiLocalConfig.settings.spawnBuffer) {
            canSpawn = false;
            break;
          }
        }
        if (canSpawn) {
          birds.push(new Bird(sketch.width, sketch.height, aiLocalConfig));
        }
      }
    }
  }

  function startNextGeneration () {
    newDinos = [];
    for (var unit of units) {
      newDinos.push(new Dino(sketch.height, aiLocalConfig, unit));
    }
    allDinos = newDinos;
  }

  function displayStartingText() {
    sketch.push();  
    sketch.textAlign(sketch.CENTER);
    sketch.fill(55, 55, 55);
    sketch.textSize(45);
    sketch.text("AI DINO", sketch.width / 2, sketch.height / 2);
    sketch.pop();
    
    sketch.push();  
    sketch.textAlign(sketch.CENTER);
    sketch.fill(55, 55, 55);
    sketch.textSize(25);
    sketch.text("Click to start", sketch.width / 2, sketch.height / 2 + 30);
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

    startNextGeneration();
    bestDino = allDinos[allDinos.length-1];

    canvas.parent("ai");
    STATE.groundY = sketch.height - aiLocalConfig.sprites.ground.h / 2;
    sketch.noLoop();

    canvas.mouseClicked(() => {
      if (!STATE.isRunning) {
        resetGame();
      }
    })
  }

  // triggered for every frame
  sketch.draw = () => {
    sketch.background('#f7f7f7');
    drawGround();
    drawClouds();
    drawDinos();
    drawCacti();
    drawScore();
    drawInfo();

    if (!STATE.isRunning) {
      displayStartingText();
    }

    if (STATE.level > 3) {
      drawBirds();
    }

    for (var dino of allDinos) {
      if (dino.isAlive && dino.hits([STATE.cacti[0], STATE.birds[0]])) {
        dino.isAlive = false;
        dino.unit.score = STATE.score - dino.jumps;
        playerCount--;
      }
      if (dino.isAlive) {
        var network_output = dino.unit.calculate(dino.inputs(getNextObstacle()));
        if (network_output[0] > network_output[1] && network_output[0] > network_output[2]) {
          dino.duck(false);
          dino.jump();
          dino.jumps++;
        } else if (network_output[2] > network_output[1] && network_output[2] > network_output[0]) {
          dino.duck(true);
        } else {
          dino.duck(false);
        }
      }
    }

    if (!bestDino.isAlive) {
      for (var i = allDinos.length-1; i >= 0; i--) {
          if (allDinos[i].isAlive) {
            bestDino = allDinos[i];
            best_unit = bestDino.unit;
            break;
          }
      }
    }
    
    if (playerCount <= 0) {
      send_data();
      resetGame();
      generation++;
    }
    updateScore();
  }
}
