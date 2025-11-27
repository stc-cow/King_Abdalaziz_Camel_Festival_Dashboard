const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const repo = 'King_Abdalaziz_Camel_Festival_Dashboard';

const config = {
  output: 'export',
  distDir: 'out',
  images: { unoptimized: true },
  trailingSlash: true,
  ...(isGithubActions
    ? {
        basePath: `/${repo}`,
        assetPrefix: `/${repo}/`,
      }
    : {}),
};

export default config;
