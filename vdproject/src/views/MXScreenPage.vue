<template>
  <div id="container">
    <div class="header">
      <div class="title">电商实时监控系统</div>
      <div class="skin">
        <img src="@/assets/screen/qiehuan_dark.png" @click="changeTheme">
      </div>
    </div>
    <div :class="['trend', fullScreen.trend ? 'full_screen' : '']">
      <Trend ref="trend"></Trend>
      <div @click="change('trend')"
           class="resize"><span :class="['iconfont', fullScreen.trend? 'icon-expand-alt' : 'icon-compress-alt']"></span></div>
    </div>
    <div :class="['map', fullScreen.map ? 'full_screen' : '']">

      <Map ref="map"></Map>
      <div @click="change('map')"
           class="resize"><span :class="['iconfont', fullScreen.map? 'icon-expand-alt' : 'icon-compress-alt']"></span></div>
    </div>
    <div :class="['hot', fullScreen.hot ? 'full_screen' : '']">

      <Hot ref="hot"></Hot>
      <div @click="change('hot')"
           class="resize"><span :class="['iconfont', fullScreen.hot? 'icon-expand-alt' : 'icon-compress-alt']"></span></div>
    </div>
    <div :class="['seller', fullScreen.seller ? 'full_screen' : '']">

      <Seller ref="seller"></Seller>
      <div @click="change('seller')"
           class="resize"><span :class="['iconfont', fullScreen.seller? 'icon-expand-alt' : 'icon-compress-alt']"></span></div>
    </div>
    <div :class="['rank', fullScreen.rank ? 'full_screen' : '']">

      <Rank ref="rank"></Rank>
      <div @click="change('rank')"
           class="resize"><span :class="['iconfont', fullScreen.rank? 'icon-expand-alt' : 'icon-compress-alt']"></span></div>
    </div>
    <div :class="['stock', fullScreen.stock ? 'full_screen' : '']">

      <Stock ref="stock"></Stock>
      <div @click="change('stock')"
           class="resize"><span :class="['iconfont', fullScreen.stock? 'icon-expand-alt' : 'icon-compress-alt']"></span></div>
    </div>
  </div>
</template>

<script>
import Hot from '@/components/MXHot'
import Map from '@/components/MXMap'
import Rank from '@/components/MXRank'
import Seller from '@/components/MXSeller'
import Stock from '@/components/MXStock'
import Trend from '@/components/MXTrend'
export default {
  components: { Hot, Map, Rank, Seller, Stock, Trend },
  data() {
    return {
      fullScreen: {
        trend: false,
        seller: false,
        map: false,
        stock: false,
        hot: false,
        rank: false
      }
    }
  },
  methods: {
    change(type) {
      const targetStatus = !this.fullScreen[type]
      this.$socket.send({
        action: 'fullScreen',
        socketType: 'fullScreen',
        chartName: type,
        value: targetStatus
      })
    },
    screenChange(data) {
      const { chartName, value } = data
      this.fullScreen[chartName] = value
      this.$nextTick(this.$refs[chartName].screenAdapter)
    },
    changeTheme() {
      this.$store.commit('changeTheme')
    }
  },

  created() {
    this.$socket.registerCallBack('fullScreen', this.screenChange)
  },
  destroyed() {
    this.$socket.unRegisterCallBack('fullScreen')
  }
}
</script>

<style scoped lang="less">
.full_screen {
  position: fixed !important;
  top: -50px !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  z-index: 999;
}
#container {
  padding: 0 20px 0 20px;
  background: rgb(5, 1, 34);
  height: 100%;
  overflow: hidden;
  .header {
    height: 50px;
    width: 100%;
    background-image: url('@/assets/screen/header_border_light.png');
    background-position: bottom;
    background-size: contain;
    position: relative;
    .title {
      position: absolute;
      border-radius: 30px;
      height: 60px;
      width: 480px;
      background: rgb(43, 43, 43);
      text-align: center;
      left: 50%;
      transform: translateX(-50%);
      top: -5px;
      line-height: 60px;
      font-size: 20px;
      color: white;
      background-image: url('@/assets/screen/header_border_dark.png');
      background-repeat: no-repeat;
      background-position: bottom;
      letter-spacing: 3px;
    }
    .skin {
      position: absolute;
      right: 50px;
      top: 10px;
    }
  }
  .trend,
  .hot,
  .map,
  .seller,
  .rank,
  .stock {
    width: 25%;
    height: 40%;
    // border: 1px solid red;
    float: left;
    margin: 3% 3% 0 0;
    border-radius: 6%;
    background: rgb(78, 77, 77);
    min-width: 300px;
    position: relative;
  }
  .map,
  .rank {
    width: 44%;
  }
  .hot,
  .stock {
    margin-right: 0px;
  }
  .resize {
    position: absolute;
    top: 20px;
    right: 20px;
    color: white;
    cursor: pointer;
  }
}
</style>
