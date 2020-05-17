module.exports = {
  apps: [
    {
      name: "app",
      script: "serve",
      watch: ".",
      env: {
        PM2_SERVE_PATH: "./build",
        PM2_SERVE_PORT: 3002,
        PM2_SERVE_SPA: "true",
        PM2_SERVE_HOMEPAGE: "/index.html",
      },
      env_produccion: {
        PM2_SERVE_PATH: "./build",
        PM2_SERVE_PORT: 5000,
        PM2_SERVE_SPA: "true",
        PM2_SERVE_HOMEPAGE: "/index.html",
      },
    },
  ],
};
