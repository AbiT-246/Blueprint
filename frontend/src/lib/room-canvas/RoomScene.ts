import {
  ACESFilmicToneMapping,
  Box3,
  type Object3D,
  PCFShadowMap,
  type PerspectiveCamera,
  Raycaster,
  Scene,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from "three";
import type { ItemPlacement } from "@/lib/api/templates";
import { type CameraSettings, DEFAULT_CAMERA_SETTINGS } from "./cameraSettings";
import { ItemInteractionController } from "./ItemInteractionController";
import { type ModelDimensions, ModelLibrary } from "./ModelLibrary";
import { ITEM_SCALE } from "./itemScale";
import { getPlacementSize, type ItemSelection, type PlacedItem } from "./PlacedItem";
import { createPlacementStrategies } from "./placement/createPlacementStrategies";
import { applyCameraSettings, createRoomCamera } from "./RoomCamera";
import { DEFAULT_ROOM_BOUNDS } from "./roomBounds";
import { RoomStage } from "./RoomStage";
import { resolveRotationAxes } from "./rotationAxes";

export interface PlaceableItem extends ModelDimensions {
  title: string;
  modelUrl: string;
  placement: ItemPlacement;
}

export interface RoomSceneOptions {
  onSelectionChange: (selection: ItemSelection | null) => void;
}

interface Size {
  width: number;
  height: number;
}

const MAX_PIXEL_RATIO = 2;

/**
 * 3D room editor: models are rendered with a perspective camera posed to match the room photo,
 * which is drawn as the scene background. Renders on demand, since the scene only changes on user input.
 */
export class RoomScene {
  private readonly scene = new Scene();
  private readonly camera: PerspectiveCamera = createRoomCamera(DEFAULT_CAMERA_SETTINGS);
  private readonly renderer = createRenderer();
  private readonly textureLoader = new TextureLoader();
  private readonly modelLibrary = new ModelLibrary();
  private readonly strategies = createPlacementStrategies(DEFAULT_ROOM_BOUNDS);
  private readonly items = new Map<Object3D, PlacedItem>();
  private readonly stage: RoomStage;
  private readonly interaction: ItemInteractionController;
  private readonly resizeObserver: ResizeObserver;

  private backgroundAspectRatio: number | null = null;
  private pendingFrameId: number | null = null;
  private isDisposed = false;

  constructor(
    private readonly container: HTMLElement,
    options: RoomSceneOptions,
  ) {
    container.appendChild(this.renderer.domElement);
    this.stage = new RoomStage(this.scene, this.renderer, DEFAULT_ROOM_BOUNDS);
    this.interaction = new ItemInteractionController(this.renderer.domElement, this.camera, this.scene, this.items, {
      onChange: () => this.requestRender(),
      onRemove: (item) => this.removeItem(item),
      onSelectionChange: options.onSelectionChange,
    });

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.resize();
  }

  async setBackground(imageUrl: string): Promise<void> {
    const texture = await this.textureLoader.loadAsync(imageUrl);
    if (this.isDisposed) {
      texture.dispose();
      return;
    }

    texture.colorSpace = SRGBColorSpace;
    disposeBackground(this.scene);
    this.scene.background = texture;
    this.backgroundAspectRatio = texture.image.width / texture.image.height;
    this.resize();
  }

  async addItem(item: PlaceableItem): Promise<void> {
    const strategy = this.strategies[item.placement];
    const root = await this.modelLibrary.instantiate(item.modelUrl, item, strategy.pivot);
    if (this.isDisposed) return;

    const baseSize = new Box3().setFromObject(root).getSize(new Vector3());
    const placed: PlacedItem = {
      title: item.title,
      root,
      strategy,
      baseSize,
      scale: ITEM_SCALE.default,
      rotationAxes: resolveRotationAxes(strategy.rotationAxis, baseSize),
    };
    root.position.copy(this.findSpawnPosition(placed));

    this.scene.add(root);
    this.items.set(root, placed);
    this.interaction.select(placed);
  }

  setSelectedItemScale(scale: number): void {
    this.interaction.scaleSelected(scale);
  }

  setSelectedItemColor(color: string): void {
    this.interaction.setSelectedColor(color);
  }

  removeSelectedItem(): void {
    this.interaction.removeSelected();
  }

  setCameraSettings(settings: CameraSettings): void {
    applyCameraSettings(this.camera, settings);
    this.interaction.refreshSelection();
    this.requestRender();
  }

  setGridVisible(isVisible: boolean): void {
    this.stage.setGridVisible(isVisible);
    this.requestRender();
  }

  dispose(): void {
    this.isDisposed = true;
    if (this.pendingFrameId !== null) cancelAnimationFrame(this.pendingFrameId);
    this.resizeObserver.disconnect();
    this.interaction.dispose();

    for (const root of this.items.keys()) this.scene.remove(root);
    this.items.clear();
    this.modelLibrary.dispose();
    this.stage.dispose();
    disposeBackground(this.scene);

    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  private removeItem(item: PlacedItem): void {
    this.scene.remove(item.root);
    this.items.delete(item.root);
    this.requestRender();
  }

  /** Projects the strategy's spawn point on screen onto its surface, falling back to the surface origin. */
  private findSpawnPosition(item: PlacedItem): Vector3 {
    const { strategy } = item;
    const raycaster = new Raycaster();
    raycaster.setFromCamera(strategy.spawnScreenPoint, this.camera);
    const hit = raycaster.ray.intersectPlane(strategy.dragPlane, new Vector3());
    return strategy.constrain(hit ?? strategy.dragPlane.coplanarPoint(new Vector3()), getPlacementSize(item));
  }

  /** Sizes the canvas to the photo's aspect ratio (fitted inside the container) so the camera and photo line up. */
  private resize(): void {
    const { width, height } = this.getCanvasSize();
    const canvas = this.renderer.domElement;
    canvas.style.left = `${(this.container.clientWidth - width) / 2}px`;
    canvas.style.top = `${(this.container.clientHeight - height) / 2}px`;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / Math.max(height, 1);
    this.camera.updateProjectionMatrix();
    this.requestRender();
  }

  private getCanvasSize(): Size {
    const { clientWidth: width, clientHeight: height } = this.container;
    if (this.backgroundAspectRatio === null || height === 0) return { width, height };

    return width / height > this.backgroundAspectRatio
      ? { width: Math.round(height * this.backgroundAspectRatio), height }
      : { width, height: Math.round(width / this.backgroundAspectRatio) };
  }

  private requestRender(): void {
    if (this.pendingFrameId !== null || this.isDisposed) return;
    this.pendingFrameId = requestAnimationFrame(() => {
      this.pendingFrameId = null;
      this.renderer.render(this.scene, this.camera);
    });
  }
}

function createRenderer(): WebGLRenderer {
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.display = "block";
  return renderer;
}

function disposeBackground(scene: Scene): void {
  if (scene.background instanceof Texture) scene.background.dispose();
  scene.background = null;
}
