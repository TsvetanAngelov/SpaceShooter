import CustomAnimatedSprite from "../../assets/utils/classes/CustomAnimatedSprite/index.js";
import AVAILABLE_STATUS from "../../assets/utils/constants/availableAppendingStatus/index.js";

export default class Explosion extends CustomAnimatedSprite {
  #animationRepetition = 1;
  constructor({
    imageName,
    numberOfFrames,
    app,
    x,
    y,
    width,
    height,
    rotation,
    name,
    animationSpeed,
    stageBoundaries,
  }) {
    super({
      imageName,
      numberOfFrames,
      app,
      x,
      y,
      width,
      height,
      rotation,
      name,
      animationSpeed,
    });
    this.stageBoundaries = stageBoundaries;
  }

  explode = () =>
    this.move((frame) => {
      if (this.animatedSprite.totalFrames === frame + 1) {
        this.animatedSprite.stop();
        this.animatedSprite.destroy();
      }
    });
}
