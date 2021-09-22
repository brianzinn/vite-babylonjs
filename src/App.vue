<template>
  <Engine ref="engine" antialias resize="window">
    <Scene>
      <ArcRotateCamera :beta="Math.PI / 2" :radius="3" />
      <HemisphericLight />
      <Box :size="1" ref="box"></Box>
    </Scene>
  </Engine>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Box, Engine, MeshPublicInterface, EnginePublicInterface, Scene } from './export'

export default defineComponent({
  components: { Box, Engine, Scene },
  mounted() {
    const engineSetup = this.$refs.engine as EnginePublicInterface;
    const mesh = (this.$refs.box as MeshPublicInterface).mesh;

    if (engineSetup && mesh) {
      engineSetup.engine.resize(); // TODO: have this working from window resize event listener
      engineSetup.engine.onBeginFrameObservable.add(() => {
        mesh.rotation.x += 0.01;
      })
    }
  },
})
</script>

<style>
body,
html {
  margin: 0;
}
canvas {
  display: block;
  height: 80%;
  width: 80%;
}
</style>