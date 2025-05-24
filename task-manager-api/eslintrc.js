module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ["airbnb-base", "plugin:prettier/recommended"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["prettier"],
  rules: {
    "no-console": "warn",
    "prettier/prettier": ["error", { singleQuote: false }],
  },
};
