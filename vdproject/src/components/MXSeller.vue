<template>
  <div class="com-container">
    <div class="com-chart"
         ref="chart"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      initChart: null,
      data: [],
      totalPages: 0,
      curPage: 1,
      timer: null
    }
  },
  methods: {
    initCharts() {
      this.initChart = this.$echarts.init(this.$refs.chart, this.theme)
      const initOption = {
        title: {
          text: '▎ 商家销售统计',
          textStyle: {
            fontSize: 66
          },
          left: '20',
          top: '20'
        },
        grid: {
          top: '20%',
          bottom: '5%',
          left: '3%',
          right: '6%',
          containLabel: true
        },
        xAxis: { type: 'value' },
        yAxis: { type: 'category' },
        series: [
          {
            type: 'bar',
            barWidth: '60',
            label: {
              show: true,
              position: 'right'
            },
            itemStyle: {
              borderRadius: [0, 30, 30, 0],
              color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                { offset: 0, color: '#5052EE' },
                { offset: 1, color: '#AB6EE5' }
              ])
            }
          }
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              width: 60,
              color: '#2D3443',
              type: 'solid'
            }
          }
        }
      }
      this.initChart.setOption(initOption)
      this.initChart.on('mouseover', () => {
        clearInterval(this.timer)
      })
      this.initChart.on('mouseout', () => {
        this.startInterval()
      })
    },
    async getData(data) {
      this.data = data
      this.totalPages = this.data.length / 5 || this.totalPages / 5 + 1
      this.startInterval()
    },
    updateData() {
      const start = (this.curPage - 1) * 5
      const end = this.curPage * 5
      const show = this.data.slice(start, end)
      const values = show.map(item => item.value)
      const names = show.map(item => item.name)
      const dataOption = {
        yAxis: { data: names },
        series: [
          {
            data: values
          }
        ]
      }
      this.initChart.setOption(dataOption)
    },
    startInterval() {
      if (this.timer) clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.curPage++
        if (this.curPage > this.totalPages) this.curPage = 1
        this.updateData()
      }, 3000)
    },
    // 屏幕适配
    screenAdapter() {
      const adapter = (this.$refs.chart.offsetWidth / 100) * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: adapter / 1.5
          }
        },
        series: [
          {
            barWidth: adapter,
            itemStyle: {
              borderRadius: [0, adapter / 2, adapter / 2, 0]
            }
          }
        ]
      }
      this.initChart.setOption(adapterOption)
      this.initChart.resize()
    }
  },
  computed: {
    ...mapState(['theme'])
  },

  watch: {
    theme() {
      this.initChart.dispose()
      this.initCharts()
      this.screenAdapter()
      this.updateData()
    }
  },
  created() {
    this.$socket.registerCallBack('sellerData', this.getData)
  },
  mounted() {
    this.initCharts()
    this.$socket.send({
      action: 'getData',
      socketType: 'sellerData',
      value: '',
      chartName: 'seller'
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    clearInterval(this.timer)
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('sellerData')
  }
}
</script>

<style>
</style>
