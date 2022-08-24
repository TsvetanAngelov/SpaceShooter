import ImageToSpriteData from "../ImageToSpriteData/index.js";
import waitUntil from "../../functions/waitUntil/index.js";
import AVAILABLE_STATUS from "../../constants/availableAppendingStatus/index.js";

export default class CustomAnimatedSprite extends ImageToSpriteData {
  animatedSprite = {};
  #spritesheet = new PIXI.Spritesheet(
    PIXI.BaseTexture.from(this.meta.image),
    this
  );
  #animationRepetition = 1;
  #animatedSpriteSettings = {};
  #APPENDING_STATUS = AVAILABLE_STATUS.UNSTATED;
  name = "";

  constructor({
    imageName,
    numberOfFrames,
    x = 150,
    y = 150,
    width = 0,
    height = 0,
    rotation = 90 * (Math.PI / 180),
    animationSpeed = 0.027,
    name,

  }) {
    super(imageName, numberOfFrames, 250, 250, width, height, name);

    this.name = name;
    this.#animatedSpriteSettings.animationSpeed = animationSpeed;
    this.#animatedSpriteSettings.x = x;
    this.#animatedSpriteSettings.y = y;
    this.#animatedSpriteSettings.rotation = rotation;
  }

  appendTo = (stage) => {
    this.#APPENDING_STATUS = AVAILABLE_STATUS.PENDING;
    return this.#spritesheet
      .parse()
      .then(() => {
        this.animatedSprite = new PIXI.AnimatedSprite(
          this.#spritesheet.animations.frame
        );

        this.animatedSprite.name=this.name,
        this.animatedSprite.animationSpeed =
          this.#animatedSpriteSettings.animationSpeed;
        this.animatedSprite.x = this.#animatedSpriteSettings.x;
        this.animatedSprite.y = this.#animatedSpriteSettings.y;
        this.animatedSprite.rotation = this.#animatedSpriteSettings.rotation;
        this.animatedSprite.anchor.set(0.5, 0.5);
        this.animatedSprite.autoUpdate

        stage.addChild(this.animatedSprite);
        this.stage = stage;
      })
      .then(() => (this.#APPENDING_STATUS = AVAILABLE_STATUS.SUCCESS));
  };

  handleOrientation = (e, callback = undefined) => {
    if (!callback) {
      let position = e.data.global;
      const dx = position.x - this.animatedSprite.x;
      const dy = position.y - this.animatedSprite.y;

      this.animatedSprite.rotation = Math.atan2(dy, dx) + 90 * (Math.PI / 180);
      return;
    }
    callback(e);
  };

  move = (handleAnimation = undefined) => {
    async function moveAfterAppend(currentInstance) {
      waitUntil({
        condition: () =>
          currentInstance.#APPENDING_STATUS === AVAILABLE_STATUS.SUCCESS,
      }).then(() => {
        if (handleAnimation)
          currentInstance.animatedSprite.onFrameChange = (frame) =>
            handleAnimation(frame);

        currentInstance.animatedSprite.play();
      });
    }
    moveAfterAppend(this);
  };

  getAppendingStatus = () => this.#APPENDING_STATUS;
}
