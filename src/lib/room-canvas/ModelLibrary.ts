import { Box3, Group, Mesh, type Material, type Object3D, Texture, Vector3 } from "three";
import { type GLTF, GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";

export interface ModelDimensions {
  widthMeters: number;
  depthMeters: number;
  heightMeters: number;
}

/**
 * Loads each glTF once and hands out lightweight clones that share geometry and materials.
 * Clones are normalized: scaled uniformly to fit inside the item's real-world dimensions,
 * and wrapped in a pivot group whose origin is the model's base center.
 */
export class ModelLibrary {
  private readonly loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  private readonly cache = new Map<string, Promise<GLTF>>();

  async instantiate(modelUrl: string, dimensions: ModelDimensions): Promise<Group> {
    const gltf = await this.load(modelUrl);
    const model = gltf.scene.clone(true);
    enableShadows(model);
    return createNormalizedPivot(model, dimensions);
  }

  dispose(): void {
    for (const gltfPromise of this.cache.values()) {
      gltfPromise.then((gltf) => disposeObjectResources(gltf.scene)).catch(() => undefined);
    }
    this.cache.clear();
  }

  private load(modelUrl: string): Promise<GLTF> {
    const cached = this.cache.get(modelUrl);
    if (cached) return cached;

    const gltfPromise = this.loader.loadAsync(encodeURI(modelUrl)).catch((error: unknown) => {
      this.cache.delete(modelUrl);
      throw new Error(`Failed to load model ${modelUrl}.`, { cause: error });
    });
    this.cache.set(modelUrl, gltfPromise);
    return gltfPromise;
  }
}

function createNormalizedPivot(model: Object3D, dimensions: ModelDimensions): Group {
  const bounds = new Box3().setFromObject(model);
  const size = bounds.getSize(new Vector3());
  const scale = Math.min(
    dimensions.widthMeters / size.x,
    dimensions.heightMeters / size.y,
    dimensions.depthMeters / size.z,
  );

  const baseCenter = new Vector3((bounds.min.x + bounds.max.x) / 2, bounds.min.y, (bounds.min.z + bounds.max.z) / 2);
  model.scale.setScalar(scale);
  model.position.copy(baseCenter).multiplyScalar(-scale);

  const pivot = new Group();
  pivot.add(model);
  return pivot;
}

function enableShadows(model: Object3D): void {
  model.traverse((child) => {
    if (child instanceof Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}

function disposeObjectResources(root: Object3D): void {
  root.traverse((child) => {
    if (!(child instanceof Mesh)) return;
    child.geometry.dispose();
    const materials: Material[] = Array.isArray(child.material) ? child.material : [child.material];
    for (const material of materials) disposeMaterial(material);
  });
}

function disposeMaterial(material: Material): void {
  for (const value of Object.values(material)) {
    if (value instanceof Texture) value.dispose();
  }
  material.dispose();
}
