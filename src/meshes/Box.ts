
import { Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector4 } from '@babylonjs/core/Maths/math.vector';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { Scene } from '@babylonjs/core/scene';
import { meshComponent } from './Mesh'

// props are this combined with Mesh properties
export type BoxPropsCtor = {
  name: string;
  size?: number;
  width?: number;
  height?: number;
  depth?: number;
  faceUV?: Vector4[];
  faceColors?: Color4[];
  sideOrientation?: number;
  frontUVs?: Vector4;
  backUVs?: Vector4;
  wrap?: boolean;
  topBaseAt?: number;
  bottomBaseAt?: number;
  updatable?: boolean;
};

export const BoxProps = {
  size: Number,
  width: { type: Number, default: 1 },
  height: { type: Number, default: 1 },
  depth: { type: Number, default: 1 },
}

export type BoxPropsType = {
  size: number,
  width: number,
  height: number,
  depth: number
}

const FactoryMethod = (props: BoxPropsType, scene: Scene) => {
  console.log('box props:', props, scene);
  return MeshBuilder.CreateBox('box-1', {
    size: props.size
  }, scene);
}

export default meshComponent('Box', BoxProps, FactoryMethod)