<template>
  <div class="com-container">
    <div class="com-chart"
         ref="hot"></div>
    <span class="iconfont arr-left"
          @click="toLeft"
          :style="fsStyle">&#xe6ef;</span>
    <span class="iconfont arr-right"
          @click="toRight"
          :style="fsStyle">&#xe6ed;</span>
    <span class="title"
          :style="fsStyle">{{ titleName }}</span>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      echartsInstance: null,
      allData: null,
      curIndex: 0,
      fs: 0
    }
  },

  methods: {
    initChart() {
      this.echartsInstance = this.$echarts.init(this.$refs.hot, this.theme)
      const initOption = {
        title: {
          text: '▎热销商品的占比',
          top: 20,
          left: 20
        },
        series: [
          {
            type: 'pie',
            label: false,
            emphasis: {
              label: { show: true }
            }
          }
        ],
        legend: {
          icon: 'circle',
          top: '15%'
        }
      }
      this.echartsInstance.setOption(initOption)
    },

    async getData(data) {
      this.allData = data
      this.updateChart()
    },

    updateChart() {
      const showData = this.allData[this.curIndex].children.map(item => {
        return { name: item.name, value: item.value, children: item.children }
      })
      const legendData = this.allData[this.curIndex].children.map(item => item.name)
      const dataOption = {
        series: [
          {
            data: showData
          }
        ],
        legend: {
          data: legendData
        },
        tooltip: {
          formatter: arg => {
            const childrenArr = arg.data.children
            let total = 0
            childrenArr.forEach(item => {
              total += item.value
            })
            let result = ''
            childrenArr.forEach(item => {
              result = result + `${item.name}:${((item.value / total) * 100).toFixed(2)}%<br>`
            })
            return result
          }
        }
      }
      this.echartsInstance.setOption(dataOption)
    },

    screenAdapter() {
      this.fs = (this.$refs.hot.offsetWidth / 100) * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.fs
          }
        },
        legend: {
          itemWidth: this.fs / 1.125,
          itemHeight: this.fs / 1.125,
          itemGap: this.fs / 2,
          textStyle: {
            fontSize: this.fs / 2
          }
        },
        series: [
          {
            center: ['50%', '55%'],
            radius: this.fs * 4.5
          }
        ]
      }
      this.echartsInstance.setOption(adapterOption)
      this.echartsInstance.resize()
    },

    toLeft() {
      if (this.allData.length) {
        if (this.curIndex === 0) this.curIndex = this.allData.length - 1
        else this.curIndex--
        this.updateChart()
      }
    },

    toRight() {
      if (this.allData.length) {
        if (this.curIndex === this.allData.length - 1) this.curIndex = 0
        else this.curIndex++
        this.updateChart()
      }
    }
  },

  computed: {
    titleName() {
      if (!this.allData) return ''
      else return this.allData[this.curIndex].name
    },
    fsStyle() {
      return { fontSize: this.fs + 'px' }
    },
    ...mapState(['theme'])
  },

  watch: {
    theme() {
      this.echartsInstance.dispose()
      this.initChart()
      this.screenAdapter()
      this.updateChart()
    }
  },

  created() {
    this.$socket.registerCallBack('hotData', this.getData)
  },

  mounted() {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'hotData',
      value: '',
      chartName: 'hotproduct'
    })
    this.screenAdapter()
    window.addEventListener('resize', this.screenAdapter)
  },

  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('hotData')
  }
}
</script>

<style scoped lang="less">
.arr-left,
.arr-right {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.arr-left {
  left: 20%;
}
.arr-right {
  right: 20%;
}
.title {
  position: absolute;
  bottom: 20%;
  left: 70%;
  color: white;
}
</style>
