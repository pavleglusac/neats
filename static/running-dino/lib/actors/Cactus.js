// import Actor from './Actor.js'
// import config from '../config.js'
// import { randItem } from '../utils.js'

const VARIANTS = ['cactus', 'cactusDouble', 'cactusDoubleB', 'cactusTriple']

class Cactus extends Actor {
  constructor (canvasWidth, canvasHeight, myConfig) {
    super();
    this.sprite = randItem(VARIANTS);
    this.x = canvasWidth;
    this.y = canvasHeight - this.height - 2;
    this.config = myConfig;
  }

  nextFrame () {
    this.x -= this.config.settings.bgSpeed;
  }
}
