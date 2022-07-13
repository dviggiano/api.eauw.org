module.exports = {
  env: {
    es2021: true,
    node: true
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "airbnb-base",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module"
  },
  ignorePatterns: ["node_modules", "dist", "assets"],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "quotes": ["error", "double"],
    "quote-props": ["error", "consistent"],
    "no-multi-str": "off",
    "comma-dangle": ["error", "never"],
    "function-paren-newline": 0,
    "implicit-arrow-linebreak": 0,
    "import/extensions": 0,
    "operator-linebreak": 0
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".ts"]
      }
    }
  }
};
