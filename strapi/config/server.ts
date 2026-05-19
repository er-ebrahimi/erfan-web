export default ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  app: {
    keys: env.array("APP_KEYS") || ["tobemodified1", "tobemodified2"],
  },
  dirs: {
    public: "./public",
  },
  // Windows-specific configuration
  url: env(
    "PUBLIC_URL",
    `http://127.0.0.1:${env.int("PORT", 1337)}`,
  ),
});
