
var ai_game_sketch = function(sketch)
{
  window.config = config;

  const NUMBER_OF_DINOS = units.length
  var player_count = NUMBER_OF_DINOS
  var all_dead = true

  var generation = 1
  var all_dinos = []
  var bestDino = null

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
  }
  // eslint-disable-next-line no-unused-vars
  let PressStartFont, sprite

  // global references for debugging
  window.sketch = sketch
  window.state = STATE

  function spriteImage (spriteName, ...clientCoords) {
    const { h, w, x, y } = config.sprites[spriteName]

    // eslint-disable-next-line no-useless-call
    return sketch.image.apply(sketch, [sprite, ...clientCoords, w / 2, h / 2, x, y, w, h])
  }

  
  function get_next_obstacle () {
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

  function resetGame () {
    start_next_generation()
    all_dead = true
    player_count = NUMBER_OF_DINOS
    if (STATE.highscore < STATE.score) { 
      STATE.highscore = STATE.score;
    }
    console.log(STATE.highscore)
    Object.assign(STATE, {
      birds: [],
      cacti: [],
      gameOver: false,
      isRunning: true,
      level: 0,
      score: 0
    })

    Object.assign(config.settings, SETTINGS_BACKUP)
    sketch.loop()
  }

  function increaseDifficulty () {
    const { settings } = config
    const { bgSpeed, cactiSpawnRate, dinoLegsRate } = settings
    const { level } = STATE

    if (level > 4 && level < 8) {
      settings.bgSpeed++
      settings.birdSpeed = settings.bgSpeed * 0.8
    } else if (level > 7) {
      settings.bgSpeed = Math.ceil(bgSpeed * 1.1)
      settings.birdSpeed = settings.bgSpeed * 0.9
      settings.cactiSpawnRate = Math.floor(cactiSpawnRate * 0.98)

      if (level > 7 && level % 2 === 0 && dinoLegsRate > 3) {
        settings.dinoLegsRate--
      }
    }
  }

  function updateScore () {
    if (sketch.frameCount % config.settings.scoreIncreaseRate === 0) {
      const oldLevel = STATE.level

      STATE.score++
      STATE.level = Math.floor(STATE.score / 100)

      if (STATE.level !== oldLevel) {
        increaseDifficulty()
      }
    }
  }

  function drawGround () {
    const { bgSpeed } = config.settings
    const groundImgWidth = config.sprites.ground.w / 2

    spriteImage('ground', STATE.groundX, STATE.groundY)
    STATE.groundX -= bgSpeed

    // append second image until first is fully translated
    if (STATE.groundX <= -groundImgWidth + sketch.width) {
      spriteImage('ground', (STATE.groundX + groundImgWidth), STATE.groundY)

      if (STATE.groundX <= -groundImgWidth) {
        STATE.groundX = -bgSpeed
      }
    }
  }

  function drawClouds () {
    const { clouds } = STATE

    for (let i = clouds.length - 1; i >= 0; i--) {
      const cloud = clouds[i]

      cloud.nextFrame()

      if (cloud.x <= -cloud.width) {
        // remove if off screen
        clouds.splice(i, 1)
      } else {
        spriteImage(cloud.sprite, cloud.x, cloud.y)
      }
    }

    if (sketch.frameCount % config.settings.cloudSpawnRate === 0) {
      clouds.push(new Cloud(sketch.width))
    }
  }

  function drawDinos () {
    for (var dino of all_dinos) {
      if (dino && dino.is_alive) {
        dino.nextFrame()
        spriteImage(dino.sprite, dino.x, dino.y)
      }
    }
  }

  function drawCacti () {
    const { cacti } = STATE

    for (let i = cacti.length - 1; i >= 0; i--) {
      const cactus = cacti[i]

      cactus.nextFrame()

      if (cactus.x <= -cactus.width) {
        // remove if off screen
        cacti.splice(i, 1)
      } else {
        spriteImage(cactus.sprite, cactus.x, cactus.y)
      }
    }

    if (sketch.frameCount % config.settings.cactiSpawnRate === 0) {
      // randomly either do or don't add cactus
      if (randBoolean()) {
        let canSpawn = true
        for (const bird of STATE.birds) {
          if (sketch.width - bird.x < config.settings.birdSpawnBuffer) {
            canSpawn = false
            break
          }
        }
        if (canSpawn) {
          cacti.push(new Cactus(sketch.width, sketch.height))
        }
      }
    }
  }

  function drawScore () {
    sketch.fill('#535353')
    sketch.textAlign(sketch.RIGHT)
    sketch.textFont(PressStartFont)
    sketch.textSize(12)
    sketch.text((STATE.score + '').padStart(5, '0'), sketch.width, sketch.textSize())
  }

  function drawBirds () {
    const { birds } = STATE

    for (let i = birds.length - 1; i >= 0; i--) {
      const bird = birds[i]

      bird.nextFrame()

      if (bird.x <= -bird.width) {
        // remove if off screen
        birds.splice(i, 1)
      } else {
        spriteImage(bird.sprite, bird.x, bird.y)
      }
    }

    if (sketch.frameCount % config.settings.birdSpawnRate === 0) {
      // randomly either do or don't add bird
      if (randBoolean()) {
        let canSpawn = true
        for (const cactus of STATE.cacti) {
          if (sketch.width - cactus.x < config.settings.birdSpawnBuffer) {
            canSpawn = false
            break
          }
        }
        if (canSpawn) {
          birds.push(new Bird(sketch.width, sketch.height))
        }
      }
    }
  }

  function start_next_generation () {
    console.log(">>> GENERATION: ", generation, " <<<");
    new_dinos = [];
    for (var unit of units) {
      new_dinos.push(new Dino(sketch.height, unit));
    }
    all_dinos = new_dinos;
  }

  // triggered on pageload
  sketch.preload = () => {
    PressStartFont = sketch.loadFont('static/running-dino/assets/PressStart2P-Regular.ttf')
    sprite = sketch.loadImage('static/running-dino/assets/sprite.png')
  }

  // triggered after preload
  sketch.setup = () => {

    const canvas = sketch.createCanvas(600, 150)
    canvas.parent("ai");
    STATE.groundY = sketch.height - config.sprites.ground.h / 2
    sketch.noLoop()

    start_next_generation();
    best_unit = all_dinos[NUMBER_OF_DINOS-1].unit;
    bestDino = all_dinos[NUMBER_OF_DINOS-1]

    canvas.mouseClicked(() => {
      if (STATE.gameOver) {
        resetGame()
      }
    })
  }

  // triggered for every frame
  sketch.draw = () => {
    sketch.background('#f7f7f7')
    drawGround()
    drawClouds()
    drawDinos()
    drawCacti()
    drawScore()

    // console.log('Player count is ', player_count)

    if (STATE.level > 3) {
      drawBirds()
    }

    
    for (var dino of all_dinos) {
      if (dino.is_alive && dino.hits([STATE.cacti[0], STATE.birds[0]])) {
        dino.is_alive = false
        dino.unit.score = STATE.score - dino.jumps
        player_count--
      }
      if (dino.is_alive) {
        var network_output = dino.unit.calculate(dino.inputs(get_next_obstacle()));
        if (network_output[0] > network_output[1] && network_output[0] > network_output[2]) {
          dino.jump()
          dino.jumps++
        } else if (network_output[2] > network_output[1] && network_output[2] > network_output[0]) {
          dino.duck()
        }
      }
    }

    if (!bestDino.is_alive) {
      for (var i = all_dinos.length-1; i >= 0; i--) {
          if (all_dinos[i].is_alive) {
            bestDino = all_dinos[i];
            best_unit = bestDino.unit;
            break;
          }
      }
    }
    
    if (player_count <= 0) {
      send_data();
      resetGame();
      generation++;
    }

    updateScore()
  }

  sketch.keyPressed = () => {
    if (sketch.key === ' ' || sketch.key === 'w') {
      if (!STATE.isRunning) {
        resetGame()
      }
    }
  }
}
