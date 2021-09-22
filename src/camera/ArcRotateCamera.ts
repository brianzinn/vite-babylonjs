import { ArcRotateCamera } from '@babylonjs/core'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { defineComponent, inject } from 'vue'

import { bindProp } from '../tools'
import Camera from './Camera'
import { SceneInjectionKey } from '../core/Scene';

export default defineComponent({
  extends: Camera,
  name: 'ArcRotateCamera',
  props: {
    alpha: { type: Number, default: Math.PI / 8 },
    beta: { type: Number, default: 0 },
    radius: { type: Number, default: 5 },
    target: { type: Vector3, default: Vector3.Zero() },
    setActiveOnSceneIfNoneActive: { type: Boolean, default: false },
  },
  setup(props) {
    const scene = inject(SceneInjectionKey)
    if (!scene) {
      console.error('Scene not found')
      return
    }

    const camera = new ArcRotateCamera('camera', props.alpha, props.beta, props.radius, props.target, scene, props.setActiveOnSceneIfNoneActive)

    setTimeout(() => {
      const canvas = scene.getEngine().getRenderingCanvas();
      camera.attachControl(canvas, true);
      scene.activeCameras!.push(camera)
      console.log('camera attached to canvas', canvas, scene);
    }, 1);

    console.log('camera created', camera, scene);

    bindProp(props, 'radius', camera)
    bindProp(props, 'alpha', camera)
    bindProp(props, 'beta', camera)

    // bindObjectProp(props, 'props', camera, true, cameraSetProp);

    // ['left', 'right', 'top', 'bottom', 'near', 'far', 'zoom'].forEach(p => {
    //   // @ts-ignore
    //   watch(() => props[p], (value) => {
    //     cameraSetProp(camera, p, value)
    //   })
    // })

    return { camera }
  },
  __hmrId: 'ArcRotateCamera',
})