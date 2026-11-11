import { Color, type Material, Mesh, type Object3D } from "three";

export const DEFAULT_OBJECT_COLOR = "#ffffff";

/** Returns the first material color found under `root`, or white if none exist. */
export function getObjectColorHex(root: Object3D): string {
  let hex = DEFAULT_OBJECT_COLOR;
  let found = false;

  root.traverse((child) => {
    if (found || !(child instanceof Mesh)) return;

    for (const material of materialList(child)) {
      if (!hasColor(material)) continue;
      hex = `#${material.color.getHexString()}`;
      found = true;
      return;
    }
  });

  return hex;
}

/** Tints every color-capable material under `root`. Shared materials affect all clones. */
export function setObjectColor(root: Object3D, hex: string): void {
  const color = new Color(hex);

  root.traverse((child) => {
    if (!(child instanceof Mesh)) return;

    for (const material of materialList(child)) {
      if (!hasColor(material)) continue;
      material.color.copy(color);
    }
  });
}

function materialList(mesh: Mesh): Material[] {
  return Array.isArray(mesh.material) ? mesh.material : [mesh.material];
}

function hasColor(material: Material): material is Material & { color: Color } {
  return "color" in material && material.color instanceof Color;
}
