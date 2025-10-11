export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS') || ['tobemodified1', 'tobemodified2'],
  },
  // Configure upload settings to avoid temp file permission issues
  upload: {
    config: {
      sizeLimit: 100000000, // 100MB
      tmpDir: './tmp', // Use local tmp directory instead of system temp
    },
  },
});
