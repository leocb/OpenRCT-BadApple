import { badApple } from "./badApple";

const tool: ToolDesc = {
  id: "a",
  cursor: "tree_down",
  filter: ["terrain"],
  onDown: toolClick,
};

function toolClick(e: ToolEventArgs) {
  animate(e.mapCoords as CoordsXY);
}

function onClickMenuItem() {
  ui.activateTool(tool);
}

export function startup() {
  if (typeof ui !== "undefined") {
    ui.registerMenuItem("Bad Apple!", () => onClickMenuItem());
  }
}

function animate(base: CoordsXY) {
  // Clear all
  Clear(base);
  let prevFrame = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  let currFrame = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  let frame = 0;

  context.subscribe("interval.tick", () => {
    // Infinite loop
    if (frame == badApple.length) frame = 0;

    // Uncomment this to see the progress in the log:
    // console.log(frame);

    // 32x24, with 4 quadrants in each tile is 16x12
    // we go Row -> Column since that's how data is encoded in the array
    for (let y = 0; y < 12; y++) {
      for (let x = 0; x < 16; x++) {

        // rct coordinates
        let pos = {
          x: base.x + x * 32,
          y: base.y + y * 32,
        };

        // Grab 2 lines from the array
        let line1 = badApple[frame][y * 2];
        let line2 = badApple[frame][y * 2 + 1];

        // Extract each Tile quadrant info, if they should draw a white or black pixel
        let q0 = (line1 & (1 << (x * 2))) != 0 ? 0 : 1;
        let q1 = (line2 & (1 << (x * 2))) != 0 ? 0 : 1;
        let q2 = (line2 & (1 << (x * 2 + 1))) != 0 ? 0 : 1;
        let q3 = (line1 & (1 << (x * 2 + 1))) != 0 ? 0 : 1;

        // Create a representation of the current tile, ranging from 0x00 to 0x0F
        currFrame[y][x] = q0 + (q1 << 1) + (q2 << 2) + (q3 << 3);

        // Only call RCT Actions if the current frame is not equal to the previous (lazy update)
        if (currFrame[y][x] != prevFrame[y][x]) {
          q0 == 1 ? place(pos, 0) : Remove(pos, 0);
          q1 == 1 ? place(pos, 1) : Remove(pos, 1);
          q2 == 1 ? place(pos, 2) : Remove(pos, 2);
          q3 == 1 ? place(pos, 3) : Remove(pos, 3);
        }

        // Copy current frame data to previous
        prevFrame[y][x] = currFrame[y][x];
      }
    }
    frame++;
  });
}

// Quadrants:
//   0
// 3   1
//   2

// Place a random plant at specified coordinates and quadrant
function place(location: CoordsXY, quadrant: number) {
  const surface = map
    .getTile(location.x / 32, location.y / 32)
    .elements.filter((el) => el.type === "surface")[0] as TileElement;
  const surfaceZ = surface.baseZ;

  const placeArgs: SmallSceneryPlaceArgs = {
    x: location.x,
    y: location.y,
    z: surfaceZ,
    direction: Math.floor(Math.random() * 4),
    quadrant: quadrant,
    object: getRandomPlant(),
    primaryColour: 26,
    secondaryColour: 18,
    flags: 0,
  };

  context.queryAction("smallsceneryplace", placeArgs, (res) => {
    if (res.error == 0) 
      context.executeAction("smallsceneryplace", placeArgs, undefined);
  });
}

// Clear all the plot
function Clear(base: CoordsXY) {
  for (let x = 0; x < 16; x++) {
    for (let y = 0; y < 12; y++) {
      RemoveSmallSceneryFromLocation({
        x: base.x + x * 32,
        y: base.y + y * 32,
      });
    }
  }
}

// Removes all small scenery at specified coordinates and ALL quadrants
function RemoveSmallSceneryFromLocation(location: CoordsXY) {
  const sceneryItems = map
    .getTile(location.x / 32, location.y / 32)
    .elements.filter(
      (el) => el.type === "small_scenery"
    ) as SmallSceneryElement[];

  for (let i = 0; i < sceneryItems.length; i++) {
    let item = sceneryItems[i];
    let removeArgs: SmallSceneryRemoveArgs = {
      x: location.x,
      y: location.y,
      z: item.baseZ,
      object: item.object,
      quadrant: item.quadrant,
    };
    context.executeAction("smallsceneryremove", removeArgs, undefined);
  }
}

// Remove a small scenery at specified coordinates and quadrant
function Remove(location: CoordsXY, quadrant: number) {
  const sceneryItems = map
    .getTile(location.x / 32, location.y / 32)
    .elements.filter(
      (el) => el.type === "small_scenery" && el.quadrant === quadrant
    ) as SmallSceneryElement[];

  for (let i = 0; i < sceneryItems.length; i++) {
    let item = sceneryItems[i];
    let removeArgs: SmallSceneryRemoveArgs = {
      x: location.x,
      y: location.y,
      z: item.baseZ,
      object: item.object,
      quadrant: item.quadrant,
    };
    context.executeAction("smallsceneryremove", removeArgs, undefined);
  }
}

// return a random plant small scenery object id. Change this to whatever you want.
function getRandomPlant(): number {
  // plants object id: 62, 63, 64, 65, 66, 67
  return Math.floor(Math.random() * 6) + 62;
}
