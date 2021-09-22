import { Camera } from '@babylonjs/core/Cameras/camera'
import { Engine } from '@babylonjs/core/Engines/engine'
import { EngineOptions } from '@babylonjs/core/Engines/thinEngine'
import { Scene } from '@babylonjs/core/scene'
import { ComponentPublicInstance, defineComponent, InjectionKey, PropType } from 'vue'
import { bindObjectProp } from '../tools'

type CallbackType<T> = (event: T) => void

// type EventType = 'init' | 'mounted' | 'beforerender' | 'afterrender' | 'resize'

export interface EventInterface {
  type: 'init' | 'mounted'
  engine: EngineInterface
}

export interface EngineEventInterface {
  type: 'beforerender' | 'afterrender'
  engine: EngineInterface
}

export interface SizeInterface {
  width: number | string
  height: number | string
}

export interface ResizeEventInterface {
  type: 'resize'
  engine: EngineInterface
  size: SizeInterface
}

type InitCallbackType = CallbackType<EventInterface>
type MountedCallbackType = CallbackType<EventInterface>
type RenderCallbackType = CallbackType<EngineEventInterface>
type ResizeCallbackType = CallbackType<ResizeEventInterface>
// type CallbackTypes = InitCallbackType | MountedCallbackType | RenderCallbackType | ResizeCallbackType

// interface EventMap {
//   'init': EventInterface;
//   'mounted': EventInterface;
//   'beforerender': RenderEventInterface;
//   'afterrender': RenderEventInterface;
//   'resize': ResizeEventInterface;
// }

interface EventCallbackMap {
  'init': InitCallbackType;
  'mounted': MountedCallbackType;
  'beforerender': RenderCallbackType;
  'afterrender': RenderCallbackType;
  'resize': ResizeCallbackType;
}

interface EngineSetupInterface {
  canvas: HTMLCanvasElement
  engine: Engine
  size: SizeInterface

  initCallbacks: InitCallbackType[]
  mountedCallbacks: MountedCallbackType[]

  beforeRenderCallbacks: RenderCallbackType[]
  afterRenderCallbacks: RenderCallbackType[]
  resizeCallbacks: ResizeCallbackType[]
}

export interface EngineInterface extends EngineSetupInterface {
  scene?: Scene

  onInit(cb: InitCallbackType): void
  onMounted(cb: MountedCallbackType): void

  onBeforeRender(cb: RenderCallbackType): void
  offBeforeRender(cb: RenderCallbackType): void
  onAfterRender(cb: RenderCallbackType): void
  offAfterRender(cb: RenderCallbackType): void

  onResize(cb: ResizeCallbackType): void
  offResize(cb: ResizeCallbackType): void

  addListener<T extends keyof EventCallbackMap>(t: T, cb: EventCallbackMap[T]): void
  removeListener<T extends keyof EventCallbackMap>(t: T, cb: EventCallbackMap[T]): void
}

export interface EnginePublicInterface extends ComponentPublicInstance, EngineInterface {}

export const EngineInjectionKey: InjectionKey<EnginePublicInterface> = Symbol('Engine')

export default defineComponent({
  name: 'Engine',
  props: {
    antialias: Boolean,
    alpha: Boolean,
    stencil: { type: Boolean, default: true },
    resize: { type: [Boolean, String] as PropType<boolean | string>, default: false },
    width: String,
    height: String,
    props: { type: Object, default: () => ({}) },
    onReady: Function as PropType<(r: EngineInterface) => void>,
  },
  inheritAttrs: false,
  setup(props, { attrs }): EngineSetupInterface {
    const initCallbacks: InitCallbackType[] = []
    const mountedCallbacks: MountedCallbackType[] = []
    const beforeRenderCallbacks: RenderCallbackType[] = []
    const afterRenderCallbacks: RenderCallbackType[] = []
    const resizeCallbacks: ResizeCallbackType[] = []

    const canvas = document.createElement('canvas')
    Object.entries(attrs).forEach(([key, value]) => {
      const matches = key.match(/^on([A-Z][a-zA-Z]*)$/)
      if (matches) {
        canvas.addEventListener(matches[1].toLowerCase(), value as {(): void })
      } else {
        canvas.setAttribute(key, value as string)
      }
    })

    // canvasOrContext: Nullable<HTMLCanvasElement | WebGLRenderingContext>, antialias?: boolean, options?: EngineOptions, adaptToDeviceRatio?: boolean
    const engineOptions: EngineOptions = {
      alpha: props.alpha,
      antialias: props.antialias,
      stencil : props.stencil
    };
    const engine: Engine = new Engine(canvas, props.antialias, engineOptions, true);

    setTimeout(() => {
      engine.runRenderLoop(() => {
        engine!.scenes.forEach(scene => {
          if (scene.cameras.length !== 0) {
            // console.log(`rendering scene: ${scene.getUniqueId()} with ${scene.activeCameras?.length} cameras.`)
            scene.render()
          }
        })
      })
    }, 1000);

    const size: SizeInterface = {
      width: '100%',
      height: '100%'
    }
    if (props.width) size.width = parseInt(props.width)
    if (props.height) size.height = parseInt(props.height)

    bindObjectProp(props, 'props', engine)

    return {
      canvas,
      engine,
      size,
      initCallbacks,
      mountedCallbacks,
      beforeRenderCallbacks,
      afterRenderCallbacks,
      resizeCallbacks,
    }
  },
  computed: {
    camera: {
      get: function(): Camera | undefined { return this.scene?.cameras[0] },
      set: function(camera: Camera): void { /* set automatically when created */},
    },
    scene: {
      get: function(): Scene | undefined { return this.engine.scenes[0] },
      set: function(scene: Scene): void { /* set automatically when created */ },
    },
  },
  provide() {
    return {
      [EngineInjectionKey as symbol]: this,
    }
  },
  mounted() {
    // appendChild won't work on reload
    this.$el.parentNode.insertBefore(this.canvas, this.$el)

    // this.three.config.onResize = (size) => {
    //   this.resizeCallbacks.forEach(e => e({ type: 'resize', engine: this, size }))
    // }

      // this.initCallbacks.forEach(e => e({ type: 'init', renderer: this }))
      

    this.mountedCallbacks.forEach(e => e({ type: 'mounted', engine: this }))
  },
  beforeUnmount() {
    this.canvas.remove()
    this.beforeRenderCallbacks = []
    this.afterRenderCallbacks = []
    this.engine.dispose()
  },
  methods: {
    onInit(cb: InitCallbackType) { this.addListener('init', cb) },
    onMounted(cb: MountedCallbackType) { this.addListener('mounted', cb) },
    onBeforeRender(cb: RenderCallbackType) { this.addListener('beforerender', cb) },
    offBeforeRender(cb: RenderCallbackType) { this.removeListener('beforerender', cb) },
    onAfterRender(cb: RenderCallbackType) { this.addListener('afterrender', cb) },
    offAfterRender(cb: RenderCallbackType) { this.removeListener('afterrender', cb) },
    onResize(cb: ResizeCallbackType) { this.addListener('resize', cb) },
    offResize(cb: ResizeCallbackType) { this.removeListener('resize', cb) },

    addListener(type: string, cb: {(e?: any): void}) {
      const callbacks = this.getCallbacks(type)
      callbacks.push(cb)
    },

    removeListener(type: string, cb: {(e?: any): void}) {
      const callbacks = this.getCallbacks(type)
      const index = callbacks.indexOf(cb)
      if (index !== -1) callbacks.splice(index, 1)
    },

    getCallbacks(type: string) {
      if (type === 'init') {
        return this.initCallbacks
      } else if (type === 'mounted') {
        return this.mountedCallbacks
      } else if (type === 'beforerender') {
        return this.beforeRenderCallbacks
      } else if (type === 'afterrender') {
        return this.afterRenderCallbacks
      } else {
        return this.resizeCallbacks
      }
    },
    // TODO: allow custom renderloops and render
    // render(time: number) {
    //   this.beforeRenderCallbacks.forEach(e => e({ type: 'beforerender', renderer: this, time }))
    //   // this.onFrame?.(cbParams)
    //   this.renderFn({ renderer: this, time })
    //   this.afterRenderCallbacks.forEach(e => e({ type: 'afterrender', renderer: this, time }))
    // },
    // renderLoop(time: number) {
    //   if (this.raf) requestAnimationFrame(this.renderLoop)
    //   this.render(time)
    // },
  },
  render() {
    return this.$slots.default ? this.$slots.default() : []
  },
  __hmrId: 'Engine',
})