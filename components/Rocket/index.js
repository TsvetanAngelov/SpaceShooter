import CustomAnimatedSprite from "../../assets/utils/classes/CustomAnimatedSprite/index.js";
import waitUntil from "../../assets/utils/functions/waitUntil/index.js";
import AVAILABLE_STATUS from "../../assets/utils/constants/availableAppendingStatus/index.js";
import Explosion from "../Explosion/index.js";

export default class Rocket extends CustomAnimatedSprite {
  constructor({
    imageName,
    numberOfFrames,
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

  explode = () => {
    let explosion = new Explosion({
      imageName: "explosion.png",
      numberOfFrames: 33,
      width: 128,
      height: 128,
      x: this.animatedSprite.position._x,
      y: this.animatedSprite.position._y,
      animationSpeed: 0.5,
      stageBoundaries: this.stageBoundaries,
      name: `${this.name}_explosion`,
    });

    if (explosion.getAppendingStatus() === AVAILABLE_STATUS.SUCCESS) {
      return;
    }

    this.animatedSprite.stop();
    this.animatedSprite.destroy();
    explosion.appendTo(this.stage);
    explosion.explode();
  }

  fire = (meters = 0) => {
    if (meters) this.maxDistance = meters;

    waitUntil({
      condition: () => this.getAppendingStatus() === AVAILABLE_STATUS.SUCCESS,
    }).then(() => {
      this.top = new PIXI.Graphics();
      this.top.drawCircle(0, -this.height, 1);
      this.animatedSprite.addChild(this.top);

      //TODO: Find better way to handle the stage boundaries
      this.move((frame) => {
        let offset = 15;
        this.stage.emit('rocketMove', this);
        if (meters > 0 && this.maxDistance < offset) offset = this.maxDistance;

        let dx = parseInt(this.top.transform.worldTransform.tx, 10);
        let dy = parseInt(this.top.transform.worldTransform.ty, 10);

        if (this.stageBoundaries.x - dx < offset)
          offset = this.stageBoundaries.x - dx;

        if (this.stageBoundaries.y - dy < offset)
          offset = parseInt(this.stageBoundaries.y - dy, 10);

        if (
          dx <= 0 ||
          dy <= 0 ||
          dx >= this.stageBoundaries.x ||
          dy >= this.stageBoundaries.y ||
          (meters > 0 && this.maxDistance <= 0)
        ) {
          this.explode()
          return;
        }

        this.animatedSprite.x =
          this.animatedSprite.x +
          offset *
            Math.cos(this.animatedSprite.rotation - 90 * (Math.PI / 180));
        this.animatedSprite.y =
          this.animatedSprite.y +
          offset *
            Math.sin(this.animatedSprite.rotation - 90 * (Math.PI / 180));

        if (meters > 0) this.maxDistance -= offset;
      });
    });
  };
}
