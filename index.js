import * as modeling from "@jscad/modeling";
import * as hexagonsLib from "@justinsdk/src/hexagons.scad?use";
import * as starburstLib from "@justinsdk/src/starburst.scad?use";

export function main() {
  const plate = modeling.extrusions.extrudeLinear(
    { height: 3 },
    hexagonsLib.hexagons(3.2, 0.8, 3),
  );
  const crown = modeling.transforms.translate(
    [0, 0, 3],
    starburstLib.starburst(10, 5, 6, 6),
  );

  return modeling.booleans.union(plate, crown);
}
