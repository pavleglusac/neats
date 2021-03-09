/*import Actor from './Actor.js'
import config from '../config.js'
import { randInteger } from '../utils.js'*/

function generateYCoord (canvasHeight) {
  const maxBirdHeight = Math.max(config.sprites.birdUp.h, config.sprites.birdDown.h) / 2
  const padding = 10

  return randInteger(220, canvasHeight - maxBirdHeight - padding)
}

class Bird extends Actor {
  constructor (canvasWidth, canvasHeight, myConfig) {
    super()

    this.x = canvasWidth
    this.y = generateYCoord(canvasHeight)
    this.wingFrames = 0
    this.wingDirection = 'Up'
    this.sprite = `bird${this.wingDirection}`

    this.config = myConfig;
  }

  nextFrame () {
    this.x -= this.config.settings.bgSpeed
    // this.x -= config.settings.birdSpeed original speed
    this.determineSprite()
  }

  determineSprite () {
    const oldHeight = this.height

    if (this.wingFrames >= this.config.settings.birdWingsRate) {
      this.wingDirection = this.wingDirection === 'Up' ? 'Down' : 'Up'
      this.wingFrames = 0
    }

    this.sprite = `bird${this.wingDirection}`
    this.wingFrames++

    // if we're switching sprites, y needs to be
    // updated for the height difference
    if (this.height !== oldHeight) {
      this.y += this.wingDirection === 'Up' ? -6 : 6
    }
  }
}
