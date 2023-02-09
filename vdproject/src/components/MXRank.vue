<template>
  <div class="com-container">
    <div class="com-chart"
         ref="rank">aa</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      echartInstance: null,
      allData: null,
      timer: null,
      start: 0,
      end: 7
    }
  },
  methods: {
    initChart() {
      this.echartInstance = this.$echarts.init(this.$refs.rank, this.theme)
      const initOption = {
        xAxis: { type: 'category' },
        yAxis: { type: 'value' },
        series: [{ type: 'bar' }],
        title: {
          text: '▎地区销售排行',
          left: 20,
          top: 20
        },
        grid: {
          top: '40%',
          bottom: '5%',
          left: '5%',
          right: '5%',
          containLabel: true
        },
        tooltip: {}
      }
      this.echartInstance.setOption(initOption)
      this.echartInstance.on('mouseover', () => {
        clearInterval(this.timer)
      })
      this.echartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },

    async getData(data) {
      this.allData = data
      this.allData.sort((a, b) => b.value - a.value)
      this.updateChart()
      this.startInterval()
    },

    updateChart() {
      let data = null
      if (this.start < this.end) data = this.allData.slice(this.start, this.end)
      else {
        data = this.allData.slice(this.start, this.allData.length)
        const datas = this.allData.slice(0, this.end + 1)
        datas.forEach(item => {
          data.push(item)
        })
      }
      const provinceArr = data.map(item => item.name)
      const valueArr = data.map(item => item.value)
      const dataOption = {
        xAxis: { data: provinceArr },
        series: [
          {
            data: valueArr,
            itemStyle: {
              color: arg => {
                const colorArr = [
                  ['#0BA82C', '#4FF778'],
                  ['#2E72BF', '#23E5E5'],
                  ['#5052EE', '#AB6EE5']
                ]
                let showColor = null
                if (arg.value > 300) showColor = colorArr[0]
                else if (arg.value > 200) showColor = colorArr[1]
                else showColor = colorArr[2]
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: showColor[0] },
                  { offset: 1, color: showColor[1] }
                ])
              }
            }
          }
        ]
      }
      this.echartInstance.setOption(dataOption)
    },

    screenAdapter() {
      const fs = (this.$refs.rank.offsetWidth / 100) * 3.6
      const adapter = {
        title: {
          textStyle: {
            fontSize: fs
          }
        },
        series: [
          {
            barWidth: fs,
            itemStyle: {
              borderRadius: [fs / 2, fs / 2, 0, 0]
            }
          }
        ]
      }
      this.echartInstance.setOption(adapter)
      this.echartInstance.resize()
    },

    startInterval() {
      if (this.timer) clearInterval(this.timer)
      this.timer = setInterval(() => {
        if (this.start >= this.allData.length) {
          this.start = 1
          this.end += 2
        } else if (this.end >= this.allData.length) {
          this.end = 0
          this.start++
        } else {
          this.end++
          this.start++
        }
        this.updateChart()
      }, 1000)
    }
  },
  created() {
    this.$socket.registerCallBack('rankData', this.getData)
  },

  computed: {
    ...mapState(['theme'])
  },

  watch: {
    theme() {
      this.echartInstance.dispose()
      this.initChart()
      this.screenAdapter()
      this.updateChart()
    }
  },

  mounted() {
    this.initChart()
    this.$socket.send({
      action: 'getData',
      socketType: 'rankData',
      value: '',
      chartName: 'rank'
    })
    this.screenAdapter()
    window.addEventListener('resize', this.screenAdapter)
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timer)
    this.$socket.unRegisterCallBack('rankData')
  }
}
</script>

<style>
</style>
