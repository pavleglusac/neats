// import Actor from './Actor.js'
// import config from '../config.js'

class Dino extends Actor {
  constructor (canvasHeight, unit=null) {
    super()

    this.canvasHeight = canvasHeight
    this.isDucking = false
    this.legFrames = 0
    this.legShowing = 'Left'
    this.sprite = `dino${this.legShowing}Leg`
    this.velocity = 0
    this.x = 25
    this.relativeY = 0

    this.unit = unit
    this.is_alive = true
    this.jumps = 0

  }

  inputs (next_obstacle) {
    // returns dino velocity, Y position of dino, distance to closest obstacle, y value of the closest obstacle
    if (next_obstacle) {
      return [config.settings.bgSpeed, this.relativeY, next_obstacle.x - this.x - 100, next_obstacle.y]
    } else {
      return [config.settings.bgSpeed, this.relativeY, 500, 0]
    }
  }

  get y () {
    return this.canvasHeight - this.height - 4 + this.relativeY
  }

  jump () {
    if (this.relativeY === 0) {
      this.velocity = -config.settings.dinoLift
    }
  }

  duck (value) {
    this.isDucking = Boolean(value)
  }

  nextFrame () {
    // use gravity to gradually decrease velocity
    this.velocity += config.settings.dinoGravity
    this.relativeY += this.velocity

    // stop falling once back down to the ground
    if (this.relativeY > 0) {
      this.velocity = 0
      this.relativeY = 0
    }

    this.determineSprite()
  }

  determineSprite () {
    if (this.relativeY < 0) {
      // in the air stiff
      this.sprite = 'dino'
    } else {
      // on the ground running
      if (this.legFrames >= config.settings.dinoLegsRate) {
        this.legShowing = this.legShowing === 'Left' ? 'Right' : 'Left'
        this.legFrames = 0
      }

      if (this.isDucking) {
        this.sprite = `dinoDuck${this.legShowing}Leg`
      } else {
        this.sprite = `dino${this.legShowing}Leg`
      }

      this.legFrames++
    }
  }
}
