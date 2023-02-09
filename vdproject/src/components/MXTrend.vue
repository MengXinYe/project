<template>
  <div class="com-container">
    <div class="title"
         :style="fontSet">
      <span>{{ '▎ ' + curTitle }}</span><span class="iconfont icon"
            @click="selected"
            :style="fontSet">&#xe6eb;</span>
      <div class="selecte-con"
           v-show="selectboxShow">
        <div class="select-item"
             v-for="item in selectType"
             :key="item.key"
             @click="changeSelect(item.key)"
             :style="marginSet">{{ item.text }}</div>
      </div>
    </div>
    <div class="com-chart"
         ref="chart"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      curSelected: 'map',
      selectboxShow: false,
      fontSize: 0
    }
  },
  methods: {
    initChrat() {
      this.chartInstance = this.$echarts.init(this.$refs.chart, this.theme)
      const initOption = {
        xAxis: { type: 'category', boundaryGap: false },
        yAxis: { type: 'value' },
        grid: {
          left: '3%%',
          top: '35%',
          bottom: '1%',
          right: '6%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          left: 20,
          top: '15%',
          icon: 'circle'
        }
      }
      this.chartInstance.setOption(initOption)
    },
    getData(data) {
      // const data = await this.$api.getData('trend')
      this.allData = data
      // console.log(this.allData)
      this.updateChart()
    },
    updateChart() {
      const colorArr1 = ['rgba(11, 168, 44, 0.5)', 'rgba(44, 110, 255, 0.5)', 'rgba(22, 242, 217, 0.5)', 'rgba(254, 33, 30, 0.5)', 'rgba(250, 105, 0, 0.5)']
      // 全透明的颜色值
      const colorArr2 = ['rgba(11, 168, 44, 0)', 'rgba(44, 110, 255, 0)', 'rgba(22, 242, 217, 0)', 'rgba(254, 33, 30, 0)', 'rgba(250, 105, 0, 0)']
      const xData = this.allData.common.month
      const seriesData = this.allData[this.curSelected].data.map((item, index) => {
        return {
          name: item.name,
          data: item.data,
          type: 'line',
          stack: this.curSelected,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: colorArr1[index] },
              { offset: 1, color: colorArr2[index] }
            ])
          }
        }
      })
      const dataOption = {
        xAxis: { data: xData },
        series: seriesData
      }

      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
      const fs = (this.$refs.chart.offsetWidth / 100) * 3.6
      this.fontSize = fs
      const adapterOption = {
        legend: {
          itemWidth: this.fontSize / 1.5,
          itemHeight: this.fontSize / 1.5,
          textStyle: {
            fontSize: this.fontSize / 3
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    selected() {
      this.selectboxShow = !this.selectboxShow
    },
    changeSelect(key) {
      this.curSelected = key
      this.selectboxShow = false
      this.updateChart()
    }
  },
  computed: {
    selectType() {
      if (!this.allData) return []
      return this.allData.type.filter(item => item.key !== this.curSelected)
    },
    curTitle() {
      if (!this.allData) return ''
      else return this.allData.type.filter(item => item.key === this.curSelected)[0].text
    },
    fontSet() {
      return { fontSize: this.fontSize / 1.5 + 'px' }
    },
    marginSet() {
      return { marginLeft: this.fontSize / 1.5 + 'px' }
    },
    ...mapState(['theme'])
  },

  watch: {
    theme() {
      this.chartInstance.dispose()
      this.initChrat()
      this.screenAdapter()
      this.updateChart()
    }
  },
  created() {
    this.$socket.registerCallBack('trendData', this.getData)
  },
  mounted() {
    window.addEventListener('resize', this.screenAdapter)
    this.initChrat()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'trendData',
      chartName: 'trend',
      value: ''
    })
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('trendData')
  }
}
</script>

<style scoped lang="less">
.title {
  position: absolute;
  color: white;
  z-index: 10;
  left: 20px;
  top: 2%;
  .icon {
    margin-left: 15px;
    cursor: pointer;
  }
  .select-item {
    cursor: pointer;
  }
  .selecte-con {
    background-color: #222733;
  }
}
</style>
