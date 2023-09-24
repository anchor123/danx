/** @type { import('@storybook/vue-vite').StorybookConfig } */
import vue2 from "@vitejs/plugin-vue2";
import react from "@vitejs/plugin-react";
const config = {
  stories: [
    "../packages/**/*.mdx",
    "../packages/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/vue-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  viteFinal(config) {
    config.plugins.push(vue2());
    config.plugins.push(react());
    return config;
  },
};
export default config;
