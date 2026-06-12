const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];
// npm workspaces: resolve expo/babel from the mobile app first
config.resolver.disableHierarchicalLookup = true;
config.resolver.extraNodeModules = {
  expo: path.resolve(projectRoot, "node_modules/expo"),
  "babel-preset-expo": path.resolve(
    projectRoot,
    "node_modules/babel-preset-expo",
  ),
};

module.exports = config;
