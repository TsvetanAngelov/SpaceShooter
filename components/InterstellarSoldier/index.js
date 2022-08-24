import AVAILABLE_STATUS from "../../assets/utils/constants/availableAppendingStatus/index.js";
import generateId from "../../assets/utils/functions/generateId/index.js";
import CustomAnimatedSprite from "../../assets/utils/classes/CustomAnimatedSprite/index.js";
import Rocket from "../Rocket/index.js";

export default class InterstellarSoldier extends CustomAnimatedSprite {
  #animationRepetition = 0;
  rockets = {};
  constructor({
    imageName,
    numberOfFrames,
    x,
    y,
    width,
    height,
    name,
    stageBoundaries,
    speed,
    stage,
  }) {
    super({
      imageName,
      numberOfFrames,
      x,
      y,
      width,
      height,
      name,
      animationSpeed: speed,
    });
    this.stageBoundaries = stageBoundaries;

    this.guns = {
      fire: ({ meters = undefined, speed = 0.5 } = {}) => {
        let rocketId = `rocket_${generateId()}`;
        this.rockets[rocketId] = true;
        let rocket = new Rocket({
          imageName: "rocket.png",
          numberOfFrames: 4,
          width: 25,
          height: 48,
          x: this.animatedSprite.position._x,
          y: this.animatedSprite.position._y,
          rotation: this.animatedSprite.rotation,
          animationSpeed: speed,
          stageBoundaries: stageBoundaries,
          name: rocketId,
        });

        if (rocket.getAppendingStatus() === AVAILABLE_STATUS.SUCCESS) return;

        rocket.appendTo(this.stage);
        rocket.fire(meters);
      },
    };

    stage.on("rocketMove", (rocket) => {
      let soldier = this.animatedSprite;

      //TODO:
      //  --calculate the intersection between the soldier and the rocket(if the rocket is not own of the soldier) and call rocket.explode + destroy the soldier
      //  --find out if usage rocket.animatedSprite.top is good solution or there is better one
      // --we may need for identifying the type of soldier to avoid hitting soldier from the same type with rocket fired from its team
    });
  }

  walk = (meters = 1) => {
    this.#animationRepetition = 0;
    !this.animatedSprite._playing && //this is going to reset the animation if the user is continuously clicking and the soldier will follow the mouse
      this.move((frame, repetitions = meters) => {
        let step = 15;

        this.animatedSprite.x =
          this.animatedSprite.x +
          step * Math.cos(this.animatedSprite.rotation - 90 * (Math.PI / 180));
        this.animatedSprite.y =
          this.animatedSprite.y +
          step * Math.sin(this.animatedSprite.rotation - 90 * (Math.PI / 180));

        if (this.animatedSprite.totalFrames === frame + 1)
          this.#animationRepetition += 1;

        if (this.#animationRepetition === repetitions)
          this.animatedSprite.stop();
      });
  };
}
