const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const repo = 'King_Abdalaziz_Camel_Festival_Dashboard';

const config = {
  ...(isGithubActions
    ? {
        output: 'export',
        distDir: 'out',
        basePath: `/${repo}`,
        assetPrefix: `/${repo}/`,
      }
    : {}),
  images: { unoptimized: true },
  trailingSlash: true,
};

export default config;
