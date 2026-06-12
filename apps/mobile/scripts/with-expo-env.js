#!/usr/bin/env node
const { spawnSync } = require("child_process");
const path = require("path");

const mobileRoot = path.resolve(__dirname, "..");
const mobileModules = path.join(mobileRoot, "node_modules");

process.env.NODE_PATH = [mobileModules, process.env.NODE_PATH]
  .filter(Boolean)
  .join(path.delimiter);
require("module").Module._initPaths();

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: node scripts/with-expo-env.js <command> [...args]");
  process.exit(1);
}

const [command, ...commandArgs] = args;
const result = spawnSync(command, commandArgs, {
  cwd: mobileRoot,
  stdio: "inherit",
  env: process.env,
});

process.exit(result.status ?? 1);
