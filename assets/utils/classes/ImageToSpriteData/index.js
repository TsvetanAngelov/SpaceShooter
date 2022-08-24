export default class PGNToSpriteData {
  frames = {};
  meta = {};
  animations = {};

  #createFrames = (from=0,width=0,height=0) => {
    this.animations.frame.forEach((value, index) => {
      this.frames[value] = {
        frame: {
          x: index ? width* index + 1 : 0,
          y: 0,
          w: width,
          h:height,
          position: {
            x: width* index,
          },
        },
        sourceSize: { w: width, h: height },
        spriteSourceSize: { x: 0, y: 0, w: width, h: height },
      };
    });
  };

  constructor(imageName, numberOfFrames,x=0,y=0,width=0,height=0,name) {
    this.width = width
    this.height=height
    this.animations = {
      frame: Array(numberOfFrames)
        .fill(``)
        .map((_, index) => `${name}_frame` + (index + 1)),
      };

    this.#createFrames(0,width,height);

    this.meta = {
      image: `../assets/images/${imageName}`,
      format: "RGBA8888",
      size: { w: numberOfFrames * width, h: height },
      scale: 0.5,
    };
    //this.animations.frame.push(`${name}_frame1`)

  }
}
