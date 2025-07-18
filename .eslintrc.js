module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "vue/no-deprecated-slot-attribute": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
  ignorePatterns: [
    ".DS_Store",
    "node_modules",
    "/coverage",
    "/dist",
    "/ios",
    "/android",
    // local env files
    ".env.local",
    ".env.*.local",
    //  Log files
    "npm-debug.log*",
    "yarn-debug.log*",
    "yarn-error.log*",
    "pnpm-debug.log*",
    // Editor directories and files
    ".idea",
    ".vscode",
    "*.suo",
    "*.ntvs*",
    "*.njsproj",
    "*.sln",
    "*.sw?",
  ],
};
