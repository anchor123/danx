<template>
  <div class="animation-wrapper">
    <div :class="type">
      <div class="inner" ref="animator"></div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    /**
     * 类型
     */
    type: {
      type: String,
      default: "rect",
    },
    /**
     * 执行函数
     */
    animationFn: {
      type: Function,
      default: () => {},
    },
    /**
     * 持续时间
     */
    duration: {
      type: Number,
      default: 1000,
    },
    /**
     * 缓动函数
     */
    ease: {
      type: String,
      default: "ease",
    },
    /**
     * 是否重复播放，默认播放次数为1，设置为true表示无限次循环
     */
    repeat: {
      type: [Boolean, Number],
      default: 1,
    },
    /**
     * 是否回滚播放，默认为false
     */
    rollback: {
      type: Boolean,
      default: false,
    },
    /**
     * 延迟播放时间
     */
    delay: {
      type: Number,
      default: 0,
    },
  },
  mounted() {
    setTimeout(() => {
      this.animationFn(this.$refs.animator, this);
    }, 100);
  },
};
</script>
<style lang="less">
.animation-wrapper {
  width: 100%;
  height: 100%;
  min-height: 600px;
  background-color: aliceblue;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 100px;
  .rect {
    width: 200px;
    height: 200px;
    background-color: #fff;
    position: relative;
    .inner {
      width: 30px;
      height: 30px;
      left: -15px;
      top: -15px;
      border-radius: 50%;
      background-color: aqua;
      padding: 20px;
      position: absolute;
      opacity: 0.5;
    }
  }
  .circle {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background-color: #fff;
    position: relative;
    .inner {
      width: 30px;
      height: 30px;
      left: -15px;
      top: -15px;
      border-radius: 50%;
      background-color: aqua;
      padding: 20px;
      position: absolute;
      opacity: 0.5;
    }
  }
}
</style>
