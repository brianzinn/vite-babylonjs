import { defineComponent } from 'vue'

export default defineComponent({

  props: {
    props: { type: Object, default: () => ({}) },
  },

  render() {
    return this.$slots.default ? this.$slots.default() : []
  },
})