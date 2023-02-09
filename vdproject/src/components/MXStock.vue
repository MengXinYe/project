<template>
  <div class="com-container">
    <div class="com-chart"
         ref="stock"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      echartInstance: null,
      allData: null,
      start: 0,
      end: 1,
      timer: null
    }
  },
  methods: {
    initChart() {
      this.echartInstance = this.$echarts.init(this.$refs.stock, this.theme)
      const initOption = {
        title: {
          text: '▎销量和库存分析',
          top: 20,
          left: 20
        }
      }
      this.echartInstance.setOption(initOption)
      this.echartInstance.on('mouseover', () => {
        clearInterval(this.timer)
      })
      this.echartInstance.on('mouseout', this.startInterval)
    },

    async getData(data) {
      this.allData = data
      this.updateChart()
      this.startInterval()
    },

    updateChart() {
      const showData = this.allData.slice(this.start * 5, this.end * 5)
      const centerArr = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ]
      const colorArr = [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF']
      ]
      const seriesArr = showData.map((item, index) => {
        return {
          type: 'pie',
          center: centerArr[index],
          data: [
            {
              value: item.sales,
              name: item.name + '\n\n' + item.sales,
              label: {
                position: 'center',
                color: colorArr[index][0]
              },
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  { offset: 0, color: colorArr[index][0] },
                  { offset: 1, color: colorArr[index][1] }
                ])
              }
            },
            { value: item.stock, itemStyle: { color: '#333843' } }
          ],
          hoverAnimation: false,
          labelLine: {
            show: false
          },
          name: item.name
        }
      })
      const dataOption = {
        series: seriesArr
      }
      this.echartInstance.setOption(dataOption)
    },

    screenAdapter() {
      const fs = (this.$refs.stock.offsetWidth / 100) * 3.6
      const innerRadius = fs * 2.5
      const outterRadius = innerRadius * 1.15
      const adapterOption = {
        title: {
          textStyle: { fontSize: fs }
        },
        series: [
          {
            type: 'pie',
            label: { fontSize: fs / 1.5 },
            radius: [innerRadius, outterRadius]
          },
          {
            type: 'pie',
            label: { fontSize: fs / 1.5 },
            radius: [innerRadius, outterRadius]
          },
          {
            type: 'pie',
            label: { fontSize: fs / 1.5 },
            radius: [innerRadius, outterRadius]
          },
          {
            type: 'pie',
            label: { fontSize: fs / 1.5 },
            radius: [innerRadius, outterRadius]
          },
          {
            type: 'pie',
            label: { fontSize: fs / 1.5 },
            radius: [innerRadius, outterRadius]
          }
        ]
      }
      this.echartInstance.setOption(adapterOption)
      this.echartInstance.resize()
    },

    startInterval() {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        this.start++
        if (this.end * 5 >= this.allData.length) {
          this.start = 0
          this.end = 1
        } else this.end++
        this.updateChart()
      }, 3000)
    }
  },
  created() {
    this.$socket.registerCallBack('stockData', this.getData)
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
      socketType: 'stockData',
      value: '',
      chartName: 'stock'
    })
    this.screenAdapter()
    window.addEventListener('resize', this.screenAdapter)
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timer)
    this.$socket.unRegisterCallBack('stockDat')
  }
}
</script>

<style>
</style>
