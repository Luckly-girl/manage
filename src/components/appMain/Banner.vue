<template>
  <div class="banner">
    <img src="@/assets/images/user_banner.jpg" alt="">
    <ul>
      <li @click="changeTheme(0)">
        <i class="iconfont iconday"></i>
      </li>
      <li @click="changeTheme(1)">
        <i class="iconfont iconnight"></i>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    computed: {
      themeList () {
        return this.$store.state.themeList
      },
      theme () {
        return this.$store.state.theme
      }
    },
    methods: {
      changeTheme(index) {
        localStorage.setItem('theme', index)
        this.$store.commit('SET_THEME', this.themeList[index])
      }
    }
  }
</script>

<style lang="stylus">
  .banner{
    position relative;
    img{
      width 100%;
      height auto;
      display block;
    }
    ul{
      width 21%;
      position absolute;
      top 0;
      bottom 0;
      right 0;
      display flex;
    }
    li{
      flex 1;
      color #fff;
      display flex;
      align-items center;
      justify-content center;
      cursor pointer;
      &:nth-child(1){
        background-color rgba(77,113,238,.6);
        &:hover{
          background-color rgba(77,113,238,1);
        }
      }
      &:nth-child(2){
        background-color rgba(48,65,86,.6);
        &:hover{
          background-color rgba(48,65,86,1);
        }
      }
    }
    .iconfont{
      font-size 48px;
    }
  }
</style>