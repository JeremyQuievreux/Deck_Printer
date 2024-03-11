// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
  // SCSS file in the project
  '~/style/main.scss'
  ],
   modules: [
    '@nuxt/image',
  ]
})
