const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;


/** @type {import("jest").Config} **/

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],   // ловит .env.test
};


module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
};