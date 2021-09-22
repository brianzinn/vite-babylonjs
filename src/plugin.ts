
import { App, createApp as _createApp } from 'vue'
import { ArcRotateCamera } from './camera'
import { Scene } from './core'
import { HemisphericLight } from './light'
import Box from './meshes/Box'

export const ViteBabylonPlugin = {
  install(app: App): void {
    const comps: Record<string, any> = {
      'Scene': Scene, // seems unneeded

      'HemisphericLight': HemisphericLight,

      // 'StandardMaterial',

      'Box': Box,

      'ArcRotateCamera': ArcRotateCamera,

    }

    console.log('installing comps:')

    Object.getOwnPropertyNames(comps).forEach(componentName => {
      console.log('registering component:', componentName, comps[componentName]);
      app.component(componentName, comps[componentName])
    })
  },
}

export function createApp(params: any): App {
  return _createApp(params).use(ViteBabylonPlugin)
}