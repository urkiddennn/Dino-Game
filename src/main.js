import kaboom from "kaboom";

kaboom({
  global: true,
  fullscreen: true,
  scale: 2,
  debug: true,
  clearColor: [0, 0, 1, 1],
});

setGravity(1600);
loadSprite("dino", "../src/assets/dino.png", {
  x: 0,
  y: 0,
  sliceX: 24,

  anims: {
    run: { from: 17, to: 22, loop: true },
    jump: { from: 12, to: 12 },
    hit: { from: 14, to: 16 },
  },
});
//scenes
scene("game", () => {
  let score = 0;
  const scoreLabel = add([text(score), pos(24, 24)]);
  const player = add([
    sprite("dino"),
    pos(64, height() / 1.5),
    area(),
    scale(3),
    area(),
    body(),
    "player",
  ]);

  add([
    rect(width(), 48),
    pos(0, height() - 48),
    outline(4),
    area(),
    body({ isStatic: true }),
    color(127, 200, 255),
    "ground",
  ]);

  loop(2, () => {
    //obstacle
    add([
      rect(48, rand(24, 64)),
      area(),
      outline(4),
      pos(width(), height() - 48),
      anchor("botleft"),
      color(255, 180, 255),
      move(LEFT, 240),
      "tree", // add a tag here
    ]);
  });

  onUpdate(() => {
    score++;
    scoreLabel.text = score;
  });

  player.onCollide("tree", () => {
    // go to "lose" scene and pass the score
    player.play("hit");
    burp();
    addKaboom(player.pos);
    go("lose", score);
  });
  onKeyPress("space", () => {
    if (player.isGrounded()) {
      player.play("jump");
      player.jump();
    }
  });

  player.onCollide("ground", () => {
    player.play("run");
  });
});

scene("lose", (score) => {
  add([
    sprite("dino"),
    pos(width() / 2, height() / 2 - 80),
    scale(2),
    anchor("center"),
  ]);

  // display score
  add([
    text(score),
    pos(width() / 2, height() / 2 + 80),
    scale(2),
    anchor("center"),
  ]);

  // go back to game with space is pressed
  onKeyPress("space", () => go("game"));
  onClick(() => go("game"));
});

go("game");
