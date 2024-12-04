<template>
  <div class="emptyMain" :style="{ 'height': height }">
    <p>暂无数据</p>
    <img src="../../assets/images/页面通用/暂无数据.png" alt="" />
  </div>
</template>

<script>
export default {
  props: {
    height: String
  },
  
};
</script>

<style lang="less" scoped>
.emptyMain {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  border-radius: 24px 13px 18px 13px;
  // background: url("../assets/images/框/2_2.png");
  // background-repeat: round;
  margin-top: -29px;

  img {
    width: 62px;
    height: 63px;
    object-fit: contain;
  }

  p {
    width: 82px;
    height: 17px;
    line-height: 18px;
    margin: 0;
    font-size: 14px;
    font-family: "webfont-bold";
    font-weight: 500;
    background: linear-gradient(
      180deg,
      #ffffff 0%,
      #ffffff 29%,
      #95c6ff 50%,
      #5ca7ff 69%,
      #1c84ff 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
</style>