This project was initialized with `vue-ts` template:

```bash
$ npm init vite@latest vite-babylonjs --template vue-ts
```

Then I just shamelessly copied parts of [troij.js](https://github.com/troisjs/trois)

![Running the project](https://github.com/brianzinn/vite-babylonjs/raw/main/media/vite-babylonjs.gif)

> The result to me was that it looks like getting the basics was fairly easy (if you can overlook some hacks in place to get a scene rendering :) ).  If I went further with this project then I would look at generating the types like I do in `react-babylonjs`, but strongly typed using generics `defineComponent<T>(...)` instead of `defineComponent({props: ...})`.  I like how the plugins mechanism works, but would want to look for a way that would take advantage of tree-shaking.

# Vue 3 + Typescript + Vite

This template should help get you started developing with Vue 3 and Typescript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's `.vue` type support plugin by running `Volar: Switch TS Plugin on/off` from VSCode command palette.
