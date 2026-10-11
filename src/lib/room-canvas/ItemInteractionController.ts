import { Box3, Box3Helper, type Camera, type Object3D, Raycaster, type Scene, Vector2, Vector3 } from "three";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import { clampItemScale, ITEM_SCALE } from "./itemScale";
import { getPlacementSize, type ItemSelection, type PlacedItem } from "./PlacedItem";
import type { RotationAxis } from "./placement/PlacementStrategy";

export interface ItemInteractionCallbacks {
  onChange: () => void;
  onRemove: (item: PlacedItem) => void;
  onSelectionChange: (selection: ItemSelection | null) => void;
}

interface ActiveDrag {
  item: PlacedItem;
  pointerId: number;
  /** Offset from the grabbed point to the item's base, so it doesn't jump under the cursor. */
  grabOffset: Vector3;
}

const NDC_SCALE = 2;
const QUARTER_TURN = Math.PI / 2;
const ROTATE_GIZMO_SIZE = 1.2;
const SELECTION_COLOR = 0x3b82f6;
const ROTATE_KEY = "r";
const DESELECT_KEY = "Escape";
const REMOVE_KEYS = new Set(["Delete", "Backspace"]);
const GROW_KEYS = new Set(["+", "="]);
const SHRINK_KEYS = new Set(["-", "_"]);
const TEXT_ENTRY_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

/**
 * Selects, drags, rotates, resizes and removes placed items. Dragging projects the pointer onto the item's
 * placement surface; rotation uses a ring gizmo around the strategy's rotation axis (or the R key for quarter turns).
 */
export class ItemInteractionController {
  private readonly raycaster = new Raycaster();
  private readonly rotateControls: TransformControls;
  private readonly selectionBounds = new Box3();
  private readonly selectionOutline = new Box3Helper(this.selectionBounds, SELECTION_COLOR);
  private selected: PlacedItem | null = null;
  private activeDrag: ActiveDrag | null = null;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly camera: Camera,
    private readonly scene: Scene,
    private readonly items: ReadonlyMap<Object3D, PlacedItem>,
    private readonly callbacks: ItemInteractionCallbacks,
  ) {
    this.rotateControls = createRotateControls(camera, canvas);
    this.rotateControls.addEventListener("change", this.handleGizmoChange);
    this.selectionOutline.visible = false;
    scene.add(this.rotateControls.getHelper(), this.selectionOutline);

    canvas.addEventListener("pointerdown", this.handlePointerDown);
    canvas.addEventListener("pointermove", this.handlePointerMove);
    canvas.addEventListener("pointerup", this.handlePointerUp);
    canvas.addEventListener("pointercancel", this.handlePointerUp);
    window.addEventListener("keydown", this.handleKeyDown);
  }

  select(item: PlacedItem | null): void {
    this.selected = item;
    this.rotateControls.detach();
    if (item) {
      showOnlyAxis(this.rotateControls, item.strategy.rotationAxis);
      this.rotateControls.attach(item.root);
    }

    this.selectionOutline.visible = item !== null;
    this.refreshSelection();
    this.notifySelection();
    this.callbacks.onChange();
  }

  scaleSelected(scale: number): void {
    const item = this.selected;
    if (!item) return;

    item.scale = clampItemScale(scale);
    item.root.scale.setScalar(item.scale);
    this.keepOnSurface(item);
    this.notifySelection();
    this.callbacks.onChange();
  }

  removeSelected(): void {
    const removed = this.selected;
    if (!removed) return;

    this.select(null);
    this.callbacks.onRemove(removed);
  }

  /** Call after the selected item is moved or rotated from outside the controller. */
  refreshSelection(): void {
    if (this.selected) this.selectionBounds.setFromObject(this.selected.root);
  }

  dispose(): void {
    this.canvas.removeEventListener("pointerdown", this.handlePointerDown);
    this.canvas.removeEventListener("pointermove", this.handlePointerMove);
    this.canvas.removeEventListener("pointerup", this.handlePointerUp);
    this.canvas.removeEventListener("pointercancel", this.handlePointerUp);
    window.removeEventListener("keydown", this.handleKeyDown);

    this.rotateControls.removeEventListener("change", this.handleGizmoChange);
    this.rotateControls.detach();
    this.scene.remove(this.rotateControls.getHelper(), this.selectionOutline);
    this.rotateControls.dispose();
    this.selectionOutline.dispose();
  }

  private readonly handleGizmoChange = (): void => {
    if (this.selected) this.keepOnSurface(this.selected);
    this.callbacks.onChange();
  };

  private readonly handlePointerDown = (event: PointerEvent): void => {
    if (event.button !== 0 || this.isGizmoActive()) return;

    const item = this.pickItem(event);
    this.select(item);
    if (!item) return;

    const grabPoint = this.projectOntoSurface(event, item);
    if (!grabPoint) return;

    this.activeDrag = {
      item,
      pointerId: event.pointerId,
      grabOffset: item.root.position.clone().sub(grabPoint),
    };
    this.canvas.setPointerCapture(event.pointerId);
    this.canvas.style.cursor = "grabbing";
  };

  private readonly handlePointerMove = (event: PointerEvent): void => {
    if (!this.activeDrag) {
      if (!this.isGizmoActive()) this.canvas.style.cursor = this.pickItem(event) ? "grab" : "default";
      return;
    }
    if (event.pointerId !== this.activeDrag.pointerId) return;

    const { item, grabOffset } = this.activeDrag;
    const surfacePoint = this.projectOntoSurface(event, item);
    if (!surfacePoint) return;

    item.root.position.copy(item.strategy.constrain(surfacePoint.add(grabOffset), getPlacementSize(item)));
    this.refreshSelection();
    this.callbacks.onChange();
  };

  private readonly handlePointerUp = (event: PointerEvent): void => {
    if (!this.activeDrag || event.pointerId !== this.activeDrag.pointerId) return;

    if (this.canvas.hasPointerCapture(event.pointerId)) {
      this.canvas.releasePointerCapture(event.pointerId);
    }
    this.activeDrag = null;
    this.canvas.style.cursor = "grab";
  };

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.selected || isTextEntryTarget(event.target)) return;

    if (event.key.toLowerCase() === ROTATE_KEY) {
      this.selected.root.rotation[this.selected.strategy.rotationAxis] += QUARTER_TURN;
      this.keepOnSurface(this.selected);
      this.callbacks.onChange();
    } else if (GROW_KEYS.has(event.key)) {
      this.scaleSelected(this.selected.scale + ITEM_SCALE.keyStep);
    } else if (SHRINK_KEYS.has(event.key)) {
      this.scaleSelected(this.selected.scale - ITEM_SCALE.keyStep);
    } else if (event.key === DESELECT_KEY) {
      this.select(null);
    } else if (REMOVE_KEYS.has(event.key)) {
      this.removeSelected();
    }
  };

  /** Re-applies the surface constraints after a resize or rotation changes the item's footprint. */
  private keepOnSurface(item: PlacedItem): void {
    item.root.position.copy(item.strategy.constrain(item.root.position, getPlacementSize(item)));
    this.refreshSelection();
  }

  private notifySelection(): void {
    const item = this.selected;
    this.callbacks.onSelectionChange(item ? { title: item.title, scale: item.scale } : null);
  }

  /** True while the pointer is over (or dragging) the rotation ring, so item dragging stays out of its way. */
  private isGizmoActive(): boolean {
    return this.rotateControls.dragging || this.rotateControls.axis !== null;
  }

  /** Returns the nearest placed item under the pointer, if any. */
  private pickItem(event: PointerEvent): PlacedItem | null {
    this.raycaster.setFromCamera(this.toNdc(event), this.camera);
    const [closestHit] = this.raycaster.intersectObjects([...this.items.keys()], true);
    return closestHit ? this.findOwningItem(closestHit.object) : null;
  }

  private findOwningItem(object: Object3D): PlacedItem | null {
    for (let current: Object3D | null = object; current; current = current.parent) {
      const item = this.items.get(current);
      if (item) return item;
    }
    return null;
  }

  private projectOntoSurface(event: PointerEvent, item: PlacedItem): Vector3 | null {
    this.raycaster.setFromCamera(this.toNdc(event), this.camera);
    return this.raycaster.ray.intersectPlane(item.strategy.dragPlane, new Vector3());
  }

  private toNdc(event: PointerEvent): Vector2 {
    const rect = this.canvas.getBoundingClientRect();
    return new Vector2(
      ((event.clientX - rect.left) / rect.width) * NDC_SCALE - 1,
      -((event.clientY - rect.top) / rect.height) * NDC_SCALE + 1,
    );
  }
}

function createRotateControls(camera: Camera, canvas: HTMLCanvasElement): TransformControls {
  const controls = new TransformControls(camera, canvas);
  controls.setMode("rotate");
  controls.setSize(ROTATE_GIZMO_SIZE);
  return controls;
}

function showOnlyAxis(controls: TransformControls, axis: RotationAxis): void {
  controls.showX = false;
  controls.showY = axis === "y";
  controls.showZ = axis === "z";
}

function isTextEntryTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && (TEXT_ENTRY_TAGS.has(target.tagName) || target.isContentEditable);
}
