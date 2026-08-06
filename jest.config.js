const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  moduleNameMapper: {
    "^@pages$": "<rootDir>/src/pages",
    "^@components$": "<rootDir>/src/components",
    "^@ui$": "<rootDir>/src/components/ui",
    "^@ui-pages$": "<rootDir>/src/components/ui/pages",
    "^@utils-types$": "<rootDir>/src/utils/types",
    "^@api$": "<rootDir>/src/utils/burger-api",
    "^@slices$": "<rootDir>/src/services/slices",
    "^@selectors$": "<rootDir>/src/services/selectors",
  },
};
