import VueRouter from 'vue-router'
import Vue from 'vue'

import SellerPage from '@/views/MXSellerPage'
import TrendPage from '@/views/MXTrendPage'
import MapPage from '@/views/MXMapPage'
import RankPage from '@/views/MXRankPage'
import HotPage from '@/views/MXHotPage'
import StockPage from '@/views/MXStockPage'
import ScreenPage from '@/views/MXScreenPage'

Vue.use(VueRouter)

const routes = [
  { path: '/sellerpage', component: SellerPage },
  { path: '/trendpage', component: TrendPage },
  { path: '/mappage', component: MapPage },
  { path: '/rankpage', component: RankPage },
  { path: '/hotpage', component: HotPage },
  { path: '/stockpage', component: StockPage },
  { path: '/', redirect: '/screenpage' },
  { path: '/screenpage', component: ScreenPage }
]

export default new VueRouter({
  routes
})
