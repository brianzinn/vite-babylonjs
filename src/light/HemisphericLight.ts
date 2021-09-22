
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { defineComponent, inject } from 'vue'


import Light from './Light'
import { SceneInjectionKey } from '../core/Scene';
import { HemisphericLight } from '@babylonjs/core';

export default defineComponent({
  extends: Light,
  name: 'HemisphericLight',
  props: {
    direction: { type: Vector3, default: Vector3.Zero() },
  },
  setup(props) {
    const scene = inject(SceneInjectionKey)
    if (!scene) {
      console.error('Scene not found')
      return
    }

    const light = new HemisphericLight('light', props.direction, scene);
    console.log('light created:', light);

    // bindProp(props, 'direction', light)
    
    // ['left', 'right', 'top', 'bottom', 'near', 'far', 'zoom'].forEach(p => {
    //   // @ts-ignore
    //   watch(() => props[p], (value) => {
    //     cameraSetProp(camera, p, value)
    //   })
    // })

    return { light }
  },
  __hmrId: 'HemisphericLight',
})