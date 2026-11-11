import {
  DirectionalLight,
  GridHelper,
  HemisphereLight,
  Mesh,
  PlaneGeometry,
  PMREMGenerator,
  type Scene,
  ShadowMaterial,
  type Texture,
  type WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import type { RoomBounds } from "./roomBounds";

const ENVIRONMENT_BLUR = 0.04;
const ENVIRONMENT_INTENSITY = 0.8;
const HEMISPHERE_SKY_COLOR = 0xffffff;
const HEMISPHERE_GROUND_COLOR = 0x8d7b68;
const HEMISPHERE_INTENSITY = 0.6;
const KEY_LIGHT_INTENSITY = 1.6;
const KEY_LIGHT_POSITION = { x: 2, y: 6, z: 1 } as const;
const SHADOW_MAP_SIZE = 2048;
const SHADOW_RADIUS = 6;
const SHADOW_BIAS = -0.0005;
const SHADOW_CAMERA_FAR = 20;
const SHADOW_OPACITY = 0.35;
const FLOOR_SIZE_METERS = 30;
const GRID_DIVISIONS_PER_METER = 2;
const GRID_CENTER_COLOR = 0x7b52a8;
const GRID_LINE_COLOR = 0xb896dc;
const GRID_LIFT_METERS = 0.001;

/**
 * Lighting and ground for compositing 3D models over a photo: image-based lighting for realistic materials,
 * one shadow-casting key light, an invisible floor that only shows shadows, and an optional calibration grid.
 */
export class RoomStage {
  private readonly environment: Texture;
  private readonly keyLight: DirectionalLight;
  private readonly hemisphereLight = new HemisphereLight(
    HEMISPHERE_SKY_COLOR,
    HEMISPHERE_GROUND_COLOR,
    HEMISPHERE_INTENSITY,
  );
  private readonly shadowFloor: Mesh<PlaneGeometry, ShadowMaterial>;
  private readonly grid: GridHelper;

  constructor(
    private readonly scene: Scene,
    renderer: WebGLRenderer,
    bounds: RoomBounds,
  ) {
    this.environment = createEnvironment(renderer);
    scene.environment = this.environment;
    scene.environmentIntensity = ENVIRONMENT_INTENSITY;

    this.keyLight = createKeyLight(bounds);
    this.shadowFloor = createShadowFloor();
    this.grid = createGrid(bounds);

    scene.add(this.hemisphereLight, this.keyLight, this.keyLight.target, this.shadowFloor, this.grid);
  }

  setGridVisible(isVisible: boolean): void {
    this.grid.visible = isVisible;
  }

  dispose(): void {
    this.scene.remove(this.hemisphereLight, this.keyLight, this.keyLight.target, this.shadowFloor, this.grid);
    this.scene.environment = null;
    this.environment.dispose();
    this.keyLight.shadow.dispose();
    this.shadowFloor.geometry.dispose();
    this.shadowFloor.material.dispose();
    this.grid.dispose();
  }
}

function createEnvironment(renderer: WebGLRenderer): Texture {
  const pmrem = new PMREMGenerator(renderer);
  const roomEnvironment = new RoomEnvironment();
  const environment = pmrem.fromScene(roomEnvironment, ENVIRONMENT_BLUR).texture;
  roomEnvironment.dispose();
  pmrem.dispose();
  return environment;
}

function createKeyLight(bounds: RoomBounds): DirectionalLight {
  const light = new DirectionalLight(0xffffff, KEY_LIGHT_INTENSITY);
  const roomCenterZ = (bounds.nearZ + bounds.backWallZ) / 2;
  light.position.set(KEY_LIGHT_POSITION.x, KEY_LIGHT_POSITION.y, roomCenterZ + KEY_LIGHT_POSITION.z);
  light.target.position.set(0, 0, roomCenterZ);

  light.castShadow = true;
  light.shadow.mapSize.set(SHADOW_MAP_SIZE, SHADOW_MAP_SIZE);
  light.shadow.radius = SHADOW_RADIUS;
  light.shadow.bias = SHADOW_BIAS;

  const shadowCamera = light.shadow.camera;
  const halfDepth = (bounds.nearZ - bounds.backWallZ) / 2;
  const halfExtent = Math.max(bounds.halfWidth, halfDepth);
  shadowCamera.left = -halfExtent;
  shadowCamera.right = halfExtent;
  shadowCamera.top = halfExtent;
  shadowCamera.bottom = -halfExtent;
  shadowCamera.far = SHADOW_CAMERA_FAR;
  shadowCamera.updateProjectionMatrix();
  return light;
}

function createShadowFloor(): Mesh<PlaneGeometry, ShadowMaterial> {
  const floor = new Mesh(new PlaneGeometry(FLOOR_SIZE_METERS, FLOOR_SIZE_METERS), new ShadowMaterial({ opacity: SHADOW_OPACITY }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  return floor;
}

function createGrid(bounds: RoomBounds): GridHelper {
  const sizeMeters = Math.ceil(Math.max(bounds.halfWidth * 2, -bounds.backWallZ * 2));
  const grid = new GridHelper(sizeMeters, sizeMeters * GRID_DIVISIONS_PER_METER, GRID_CENTER_COLOR, GRID_LINE_COLOR);
  grid.position.y = GRID_LIFT_METERS;
  grid.visible = false;
  return grid;
}
