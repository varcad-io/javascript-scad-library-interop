import * as modeling from "@jscad/modeling";
import * as hexagonsLib from "@justinsdk/src/hexagons.scad?use";
import * as starburstLib from "@justinsdk/src/starburst.scad?use";

const toFiniteNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toInteger = (value, fallback = 1, { min = 1, max = 24 } = {}) => {
  const parsed = Math.round(toFiniteNumber(value, fallback));
  return Math.max(min, Math.min(max, parsed));
};

const toBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["false", "0", "off", "no"].includes(normalized)) {
      return false;
    }
    if (["true", "1", "on", "yes"].includes(normalized)) {
      return true;
    }
  }
  return Boolean(value);
};

const degreesToRadians = (degrees) => (toFiniteNumber(degrees, 0) * Math.PI) / 180;

export function main({ variables = {} } = {}) {
  const hexRadius = toFiniteNumber(variables.hex_radius, 3.2);
  const hexSpacing = toFiniteNumber(variables.hex_spacing, 0.8);
  const hexCount = toInteger(variables.hex_count, 3, { min: 1, max: 8 });
  const plateHeight = toFiniteNumber(variables.plate_height, 3);
  const showCrown = toBoolean(variables.show_crown, true);
  const crownOuterRadius = toFiniteNumber(variables.crown_outer_radius, 10);
  const crownInnerRadius = toFiniteNumber(variables.crown_inner_radius, 5);
  const crownPoints = toInteger(variables.crown_points, 6, { min: 3, max: 14 });
  const crownHeight = toFiniteNumber(variables.crown_height, 6);
  const crownSpinDeg = toFiniteNumber(variables.crown_spin_deg, 0);

  const plate = modeling.extrusions.extrudeLinear(
    { height: plateHeight },
    hexagonsLib.hexagons(hexRadius, hexSpacing, hexCount),
  );
  const parts = [plate];

  if (showCrown) {
    const crownShape = starburstLib.starburst(
      crownOuterRadius,
      crownInnerRadius,
      crownPoints,
      crownHeight,
    );
    const crown = modeling.transforms.translate(
      [0, 0, plateHeight],
      crownSpinDeg
        ? modeling.transforms.rotateZ(degreesToRadians(crownSpinDeg), crownShape)
        : crownShape,
    );
    parts.push(crown);
  }

  return parts.length === 1 ? parts[0] : modeling.booleans.union(...parts);
}
