import { Animator } from "../src/index";
import Animation from "./Animation.vue";
import AnimtionTemplate from "./Animation.mdx";

export default {
  title: "Awesome/Animation",
  component: Animation,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { Animation },
    template: '<animation v-bind="$props" />',
  }),
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["rect", "circle"],
    },
    duration: {
      control: { type: "number" },
    },
    ease: {
      control: { type: "select" },
      options: [
        "linear",
        "swing",
        "ease",
        "easeInQuad",
        "easeOutQuad",
        "easeInOutQuad",
        "easeInCubic",
        "easeOutCubic",
        "easeInOutCubic",
        "easeInQuart",
        "easeOutQuart",
        "easeInOutQuart",
        "easeInQuint",
        "easeOutQuint",
        "easeInOutQuint",
        "easeInSine",
        "easeOutSine",
        "easeInOutSine",
        "easeInExpo",
        "easeOutExpo",
        "easeInOutExpo",
        "easeInCirc",
        "easeOutCirc",
        "easeInOutCirc",
        "easeInElastic",
        "easeOutElastic",
        "easeInOutElastic",
        "easeInBack",
        "easeOutBack",
        "easeInOutBack",
        "easeInBounce",
        "easeOutBounce",
        "easeInOutBounce",
      ],
    },
    rollback: {
      control: { type: "boolean" },
    },
    delay: {
      control: { type: "number" },
    },
    repeat: {
      control: { type: "number" },
    },
  },
  parameters: {
    docs: {
      page: AnimtionTemplate,
    },
  },
};

export const Basic = {
  args: {
    type: "rect",
    animationFn: (target, options) => {
      const animator = new Animator({
        beginValue: -15,
        finishValue: 185,
        setter(target, value) {
          target.style.left = value + "px";
        },
      });

      animator
        .start(target, {
          duration: options.duration || 1000, // ms
          easing: options.ease || "ease",
          delay: 0 || options.delay,
        })
        .repeat(options.repeat || 3, options.rollback);
    },
  },
};

export const useObject = {
  args: {
    type: "rect",
    animationFn: (target, options) => {
      const animator = new Animator({
        beginValue: { x: -15, y: -15 },
        finishValue: { x: 185, y: 185 },
        setter(target, value) {
          target.style.left = value.x + "px";
          target.style.top = value.y + "px";
        },
      });

      animator
        .start(target, {
          duration: options.duration || 1000, // ms
          easing: options.ease || "ease",
          delay: 0 || options.delay,
        })
        .repeat(options.repeat || 3, options.rollback);
    },
  },
};

export const multipleAnimation = {
  args: {
    type: "rect",
    animationFn: (target, options) => {
      const animator = new Animator({
        beginValue: { x: -15, y: -15 },
        finishValue: { x: 185, y: -15 },
        setter(target, value) {
          target.style.left = value.x + "px";
          target.style.top = value.y + "px";
        },
      });

      animator
        .pipe({
          beginValue: -15,
          finishValue: 185,
          setter(target, value) {
            target.style.top = value + "px";
          },
        })
        .pipe({
          beginValue: 185,
          finishValue: -15,
          setter(target, value) {
            target.style.left = value + "px";
          },
        })
        .pipe({
          beginValue: 185,
          finishValue: -15,
          setter(target, value) {
            target.style.top = value + "px";
          },
        });

      animator
        .start(target, {
          duration: options.duration || 1000, // ms
          easing: options.ease || "ease",
          delay: 0 || options.delay,
        })
        .repeat(options.repeat || 3, options.rollback);
    },
  },
};

export const repeatAnimation = {
  args: {
    type: "rect",
    repeat: 3,
    animationFn: (target, options) => {
      const animator = new Animator({
        beginValue: { x: -15, y: -15 },
        finishValue: { x: 185, y: 185 },
        setter(target, value) {
          target.style.left = value.x + "px";
          target.style.top = value.y + "px";
        },
      });

      animator
        .start(target, {
          duration: options.duration || 1000, // ms
          easing: options.ease || "ease",
          delay: 0 || options.delay,
        })
        .repeat(options.repeat || 3, options.rollback);
    },
  },
};

export const rollbackAnimation = {
  args: {
    type: "rect",
    repeat: 3,
    rollback: true,
    animationFn: (target, options) => {
      const animator = new Animator({
        beginValue: { x: -15, y: -15 },
        finishValue: { x: 185, y: 185 },
        setter(target, value) {
          target.style.left = value.x + "px";
          target.style.top = value.y + "px";
        },
      });

      animator
        .start(target, {
          duration: options.duration || 1000, // ms
          easing: options.ease || "ease",
          delay: 0 || options.delay,
        })
        .repeat(options.repeat || 3, options.rollback);
    },
  },
};
