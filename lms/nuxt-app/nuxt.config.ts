// https://nuxt.com/docs/api/configuration/nuxt-config
import dotenv from "dotenv";
dotenv.config();

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  app: {
    head: {
      title: "Student LMS",
      meta: [
        {
          name: "description",
          content: "A nuxtjs/express lms app for students",
        },
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/icon?family=Material+Icons",
        },
      ],
    },
  },
  components: true,
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL,
    },
  },
});
