<template>
  <div class="com-container"
       @dblclick="reset">
    <div class="com-chart"
         ref="map"></div>
  </div>
</template>

<script>
import axios from 'axios'
import { getProvinceMapInfo } from '@/utils/map_utils'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      allData: null,
      echartInstance: null,
      register: {}
    }
  },

  methods: {
    async initChart() {
      this.echartInstance = this.$echarts.init(this.$refs.map, this.theme)
      const { data } = await axios.get('http://127.0.0.1:8000/static/map/china.json')
      this.$echarts.registerMap('china', data)
      const initOption = {
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2E72BF',
            borderColor: '#333'
          }
        },
        title: {
          text: '▎商家分布',
          top: 20,
          left: 20
        },
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical'
        }
      }
      this.echartInstance.setOption(initOption)

      this.echartInstance.on('click', async arg => {
        const provinceInfo = getProvinceMapInfo(arg.name)
        if (!this.register[provinceInfo.key]) {
          const { data } = await axios('http://127.0.0.1:8000' + provinceInfo.path)
          this.$echarts.registerMap(provinceInfo.key, data)
          this.register[provinceInfo.key] = data
        }
        const choickOption = {
          geo: {
            map: provinceInfo.key
          }
        }
        this.echartInstance.setOption(choickOption)
      })
    },

    async getData(data) {
      this.allData = data
      this.updateChart()
    },

    updateChart() {
      const legendArr = this.allData.map(item => item.name)
      const seriesArr = this.allData.map(item => {
        return {
          type: 'effectScatter',
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo',
          rippleEffect: {
            scale: 5,
            brushType: 'stroke'
          }
        }
      })
      const dataOption = {
        legend: { data: legendArr },
        series: seriesArr
      }
      this.echartInstance.setOption(dataOption)
    },

    screenAdapter() {
      const adapter = (this.$refs.map.offsetWidth / 100) * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: adapter
          }
        },
        legend: {
          itemWidth: adapter / 2,
          itemHeight: adapter / 2,
          itemGap: adapter / 2,
          textStyle: {
            fontSize: adapter / 2
          }
        }
      }
      this.echartInstance.setOption(adapterOption)
      this.echartInstance.resize()
    },

    reset() {
      const resetOption = {
        geo: {
          map: 'china'
        }
      }
      this.echartInstance.setOption(resetOption)
    }
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

  created() {
    this.$socket.registerCallBack('mapData', this.getData)
  },

  mounted() {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'mapData',
      value: '',
      chartName: 'map'
    })
    this.screenAdapter()
    window.addEventListener('resize', this.screenAdapter)
  },

  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('mapData')
  }
}
</script>

<style>
</style>
