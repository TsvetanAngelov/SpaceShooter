import generateId from "./assets/utils/functions/generateId/index.js";
import InterstellarSoldier from "./components/InterstellarSoldier/index.js";

function addMultipleEventsListener(element, events, handler) {
  events.forEach((e) => element.addEventListener(e, (event) => handler(event)));
}

addMultipleEventsListener(window, ["resize", "load"], (event) => {
  let root = document.querySelector("#interstellarWar");
  const gl = root.getContext("webgl", { stencil: true });
  //TODO : Fix overlapping scenes issue

  let viewportHeight = window.innerHeight;
  let viewportWidth = window.innerWidth;
  let app = new PIXI.Application({
    width: viewportWidth,
    height: viewportHeight,
    view: root,
  });

  const soldier = new InterstellarSoldier({
    imageName: "shooter.png",
    numberOfFrames: 6,
    width: 53,
    height: 62,
    stageBoundaries: { x: viewportWidth, y: viewportHeight },
    speed: 0.5,
    name: "pesho",
    stage: app.stage,
  });

  soldier.appendTo(app.stage);

  root.addEventListener("click", (e) => {
    e.preventDefault();
    soldier.guns.fire({ speed: 0.9 });
  });

  root.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    soldier.walk(5);
  });

  app.stage.interactive = true;
  app.stage.on("pointermove", (e) => {
    //TODO: check if it is better to move the event on the canvas
    soldier.handleOrientation(e);
  });

  setInterval(() => {
    //TODO:
    // -add orientation and move logic for the enemies - they should move towards the our guy
    // -add call enemy.fire() on random interval

    let enemy = new InterstellarSoldier({
      imageName: "enemy1.png", //TODO add logic to get random pgn
      numberOfFrames: 6,
      x: Math.floor(Math.random() * (viewportWidth - 0 + 1) + 0),
      y: Math.floor(Math.random() * (viewportHeight - 0 + 1) + 0),
      width: 53,
      height: 62,
      stageBoundaries: { x: viewportWidth, y: viewportHeight },
      speed: 0.5,
      name: generateId(),
      stage: app.stage,
    });

    //TODO: We may need to have additional class for enemies to make them walk and fire constantly not only once after appending
    enemy.appendTo(app.stage).then(() => {
      enemy.walk(3);//TODO: we need to control the speed outside of the class
      enemy.guns.fire();
    });
  }, 6000);
});
