import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  rules: {
    eqeqeq: ["error", "smart"],
    "no-var": "error",
    "no-lonely-if": "error",
    "no-else-return": "error",
    "vue/html-self-closing": "off",
    "vue/block-order": [
      "error",
      {
        order: ["script", "template", "style"],
      },
    ],
    "vue/no-useless-v-bind": "error",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/prefer-for-of": ["warn"],
  },
});
