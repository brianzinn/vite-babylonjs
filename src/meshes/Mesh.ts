import { ComponentPropsOptions, ComponentPublicInstance, defineComponent, inject, InjectionKey, watch } from 'vue'

import { Mesh as TMesh } from '@babylonjs/core/Meshes/mesh';

import { Node } from '@babylonjs/core/node';

import TransformNode, { TransformNodeProps, TransformNodeSetupInterface } from '../core/transformNode'
import { bindProp } from '../tools'
import { Material } from '@babylonjs/core/Materials/material';
import { Scene } from '@babylonjs/core/scene';
import { SceneInjectionKey } from '../core/Scene';
import { InstancedMesh } from '@babylonjs/core/Meshes/instancedMesh';
import { MorphTargetManager } from '@babylonjs/core/Morph/morphTargetManager';
import { ActionManager } from '@babylonjs/core/Actions/actionManager';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Skeleton } from '@babylonjs/core/Bones/skeleton';
import { SubMesh } from '@babylonjs/core/Meshes/subMesh';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';

export type AbstractMeshProps = {
  actionManager?: ActionManager;
  addChild?: any;
  alphaIndex?: number;
  alwaysSelectAsActiveMesh?: boolean;
  applyFog?: boolean;
  checkCollisions?: boolean;
  collisionGroup?: number;
  collisionMask?: number;
  collisionResponse?: boolean;
  computeBonesUsingShaders?: boolean;
  cullingStrategy?: number;
  definedFacingForward?: boolean;
  doNotSyncBoundingInfo?: boolean;
  edgesColor?: Color4;
  edgesWidth?: number;
  ellipsoid?: Vector3;
  ellipsoidOffset?: Vector3;
  enableEdgesRendering?: any;
  enablePointerMoveEvents?: boolean;
  facetDepthSortFrom?: Vector3;
  hasVertexAlpha?: boolean;
  instancedBuffers?: { [key: string]: any; };
  isBlocker?: boolean;
  isPickable?: boolean;
  isVisible?: boolean;
  layerMask?: number;
  material?: Material;
  mustDepthSortFacets?: boolean;
  numBoneInfluencers?: number;
  onCollide?: () => void;
  onCollideObservable?: any;
  onCollisionPositionChange?: () => void;
  onCollisionPositionChangeObservable?: any;
  onMaterialChangedObservable?: any;
  onRebuildObservable?: any;
  outlineColor?: Color3;
  outlineWidth?: number;
  overlayAlpha?: number;
  overlayColor?: Color3;
  partitioningBBoxRatio?: number;
  partitioningSubdivisions?: number;
  receiveShadows?: boolean;
  renderingGroupId?: number;
  scaling?: Vector3;
  setBoundingInfo?: any;
  setIndices?: any;
  setVerticesData?: any;
  showSubMeshesBoundingBox?: boolean;
  skeleton?: Skeleton;
  subMeshes?: SubMesh[];
  surroundingMeshes?: AbstractMesh[];
  useOctreeForCollisions?: boolean;
  useOctreeForPicking?: boolean;
  useOctreeForRenderingSelection?: boolean;
  useVertexColors?: boolean;
  visibility?: number;
} & TransformNodeProps;

export type MeshProps = {
  addInstance?: any;
  addLODLevel?: any;
  computeBonesUsingShaders?: boolean;
  delayLoadingFile?: string;
  delayLoadState?: number;
  instances?: InstancedMesh[];
  isUnIndexed?: boolean;
  manualUpdateOfWorldMatrixInstancedBuffer?: boolean;
  morphTargetManager?: MorphTargetManager;
  normalizeSkinFourWeights?: any;
  normalizeSkinWeightsAndExtra?: any;
  onBeforeDraw?: () => void;
  onLODLevelSelection?: (distance: number, mesh: TMesh, selectedLevel: TMesh) => void;
  overrideMaterialSideOrientation?: number;
  overridenInstanceCount?: number;
  setIndices?: any;
  setMaterialByID?: any;
  setVerticesBuffer?: any;
  setVerticesData?: any;
} & AbstractMeshProps;

export type FiberMeshPropsCtor = {
  name: string;
  parent?: Node;
  source?: TMesh;
  doNotCloneChildren?: boolean;
  clonePhysicsImpostor?: boolean;
};

export interface MeshSetupInterface extends TransformNodeSetupInterface {
  mesh?: TMesh
  material?: Material
  loading?: boolean
}

export interface MeshInterface extends MeshSetupInterface {
  setMaterial(m: Material): void
}

export interface MeshPublicInterface extends ComponentPublicInstance, MeshInterface {}

export const MeshInjectionKey: InjectionKey<MeshPublicInterface> = Symbol('Mesh')

const Mesh = defineComponent({
  name: 'Mesh',
  extends: TransformNode,
  props: {
    castShadow: Boolean,
    receiveShadow: Boolean,
  },
  setup(): MeshSetupInterface {
    return {}
  },
  provide() {
    return {
      [MeshInjectionKey as symbol]: this,
    }
  },
  mounted() {
    // TODO : proper ?
    if (!this.mesh && !this.loading) this.initMesh()
  },
  methods: {
    initMesh() {
      // TODO: make this a hook to get scene
      const scene = inject(SceneInjectionKey) as (Scene | undefined)

      if (!scene) {
        console.error('Engine not found')
        return
      }

      const mesh = new TMesh('mesh-name', scene)

      bindProp(this, 'castShadow', mesh)
      bindProp(this, 'receiveShadow', mesh)

      this.mesh = mesh
      this.initObject3D(mesh)
    },
    setMaterial(material: Material) {
      this.material = material
      if (this.mesh) this.mesh.material = material
    },
  },
  unmounted() {
    // for predefined mesh (geometry/material are not unmounted)
    this.mesh?.dispose();
    // if (this.material) this.material.dispose()
  },
  __hmrId: 'Mesh',
})

export default Mesh

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function meshComponent<P extends Readonly<ComponentPropsOptions>>(
  name: string,
  props: P,
  createMesh: (props: any, scene: Scene) => TMesh
) {
  return defineComponent({
    name,
    extends: Mesh,
    props,
    created() {
      this.createMesh()
    },
    methods: {
      createMesh() {
        const scene = inject(SceneInjectionKey)
        if (!scene) {
          console.error('Scene not found')
          return
        }
        this.mesh = createMesh(this.props, scene);
      },
    },
  })
}