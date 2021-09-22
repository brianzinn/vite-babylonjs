
import { AnimationPropertiesOverride } from '@babylonjs/core/Animations/animationPropertiesOverride'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { TransformNode } from '@babylonjs/core/Meshes/transformNode'
import { IInspectable } from '@babylonjs/core/Misc/iInspectable'
import { Scene } from '@babylonjs/core/scene'
import { ComponentPublicInstance, defineComponent, getCurrentInstance, PropType, watch } from 'vue'
import { bindObjectProp, bindProp } from '../tools'
import { EngineInjectionKey, EngineInterface } from './Engine'
import { SceneInjectionKey } from './Scene'

export interface TransformNodeSetupInterface {
  engine?: EngineInterface
  scene?: Scene
  o3d?: TransformNode
  parent?: ComponentPublicInstance
}

export type NodeProps = {
  addBehavior?: any;
  animationPropertiesOverride?: AnimationPropertiesOverride;
  animations?: Animation[];
  doNotSerialize?: boolean;
  id?: string;
  inspectableCustomProperties?: IInspectable[];
  metadata?: any;
  name?: string;
  onDispose?: () => void;
  onDisposeObservable?: any;
  onReady?: (node: Node) => void;
  parent?: Node;
  reservedDataStore?: any;
  setEnabled?: any;
  state?: string;
  uniqueId?: number;
}

export type TransformNodeProps = {
  addRotation?: any;
  billboardMode?: number;
  ignoreNonUniformScaling?: boolean;
  infiniteDistance?: boolean;
  onAfterWorldMatrixUpdateObservable?: any;
  position?: Vector3;
  preserveParentRotationForBillboard?: boolean;
  reIntegrateRotationIntoRotationQuaternion?: boolean;
  rotation?: Vector3;
  // rotationQuaternion?: @babylonjs/core/Quaternion;
  scaling?: Vector3;
  scalingDeterminant?: number;
  setAbsolutePosition?: any;
  setDirection?: any;
  setParent?: any;
  setPivotMatrix?: any;
  setPivotPoint?: any;
  setPositionWithLocalVector?: any;
  setPreTransformMatrix?: any;
  translate?: any;
} & NodeProps;

export interface TransformNodeInterface extends TransformNodeSetupInterface {
  addToParent(o?: TransformNode): boolean
  removeFromParent(o?: TransformNode): boolean
  add(o: TransformNode): void
  remove(o: TransformNode): void
}

export interface TransformNodePublicInterface extends ComponentPublicInstance, TransformNodeInterface {}

// export function object3DSetup(): Object3DSetupInterface {
//   const renderer = inject(RendererInjectionKey)
//   const scene = inject(SceneInjectionKey)
//   return { scene, renderer }
// }

export default defineComponent({
  name: 'TransformNode',
  // inject for sub components
  inject: {
    engine: EngineInjectionKey as symbol,
    scene: SceneInjectionKey as symbol,
  },
  emits: ['created', 'ready'],
  props: {
    position: { type: Object as PropType<Vector3>, default: () => Vector3.Zero() },
    rotation: { type: Object as PropType<Vector3>, default: () => Vector3.Zero() },
    scale: { type: Object as PropType<Vector3>, default: () => Vector3.Zero() },
    props: { type: Object, default: () => ({}) },
    disableAdd: { type: Boolean, default: false },
    disableRemove: { type: Boolean, default: false },
  },
  setup(): TransformNodeSetupInterface {
    // return object3DSetup()
    return {}
  },
  created() {
    if (!this.engine) {
      console.error('Missing parent Engine')
    }
    if (!this.scene) {
      console.error('Missing parent Scene')
    }
  },
  unmounted() {
    if (!this.disableRemove) this.removeFromParent()
    if (this.o3d) {
      this.o3d.dispose();
    }
  },
  methods: {
    initObject3D(o3d: TransformNode) {
      this.o3d = o3d
      // o3d.userData.component = this


      bindProp(this, 'position', o3d)
      bindProp(this, 'rotation', o3d)
      bindProp(this, 'scale', o3d)
      // bindProp(this, 'userData', o3d.userData)
      // bindProp(this, 'visible', o3d)

      bindObjectProp(this, 'props', o3d)

      this.$emit('created', o3d)

      this.parent = this.getParent()
      if (!this.disableAdd) {
        if (this.addToParent()) this.$emit('ready', this)
        else console.error('Missing parent (Scene, Group...)')
      }
    },
    getParent(): undefined | ComponentPublicInstance {
      let parent = this.$parent

      if (!parent) {
        // for script setup
        const instance = getCurrentInstance() as any // ctx is internal
        if (instance && instance.parent) parent = instance.parent.ctx
      }

      while (parent) {
        if ((parent as any).add) return parent
        parent = parent.$parent
      }
      return undefined
    },
    addToParent(o?: TransformNode): boolean {
      console.log('add to parent', this, o);
      // const o3d = o || this.o3d
      // if (this.parent) {
      //   (this.parent as any).add(o3d)
      //   return true
      // }
      // return false;
      return true;
    },
    removeFromParent(o?: TransformNode): boolean {
      console.log('removed from parent', this, o);
      return true;
    },
    add(o: TransformNode) {  },
    remove(o: TransformNode) { },
  },
  render() {
    return this.$slots.default ? this.$slots.default() : []
  },
  __hmrId: 'TransformNode',
})