import { Scene, SceneOptions } from '@babylonjs/core/scene'
import { defineComponent, inject, InjectionKey, provide } from 'vue'

import { EngineInjectionKey } from './Engine'

export const SceneInjectionKey: InjectionKey<Scene> = Symbol('Scene')

export default defineComponent({
  name: 'Scene',
  props: {
    useClonedMeshesMap: Boolean,
  },
  setup(props) {
    const engineSetupInterface = inject(EngineInjectionKey)

    if (!engineSetupInterface?.engine) {
      console.error('Engine not found')
      return
    }

    const sceneOptions: SceneOptions = {
      useClonedMeshMap: props.useClonedMeshesMap // NOTE: missing import { watch} from 'vue'
    }

    const scene = new Scene(engineSetupInterface.engine, sceneOptions);
    // setTimeout(() => {
    //   // canvas is not mounted // TypeError: Cannot read properties of null (reading 'ownerDocument') at Function.Inspector2._CreateCanvasContainer (@babylonjs_inspector.js:81413
    //   scene.debugLayer.show();
    // }, 100);
    
    provide(SceneInjectionKey, scene)

    const add = (o: any): void => { console.log('added to scene:', o) }
    const remove = (o: any): void => { console.log('removed from scene') }

    return { scene, add, remove }
  },
  render() {
    return this.$slots.default ? this.$slots.default() : []
  },
  __hmrId: 'Scene',
})