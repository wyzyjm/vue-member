import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/member',
    children: [
        {
            path: '/member',
            redirect: '/information',
            component: () => import('@/views/member/index'),
            children: [
                {
                    path: '/information',
                    name: 'information',
                    component: () => import('@/views/member/information/index'),
                    meta: { title: '我的资料', icon: '' }
                },{
                    path: '/form',
                    name: 'form',
                    component: () => import('@/views/member/form/index'),
                    meta: { title: '我的表单', icon: '' }
                },{
                    path: '/order',
                    redirect: '/order/list',
                    component: () => import('@/views/member/order/index'),
                    children: [
                        {
                            path: 'list',
                            name: 'orderList',
                            component: () => import('@/views/member/order/list'),
                            meta: { title: '订单列表', icon: '' }
                        },
                        {
                            path: 'detail',
                            name: 'orderDetail',
                            component: () => import('@/views/member/order/detail'),
                            meta: { title: '订单详情', icon: '' }
                        }
                    ],
                },{
                    path: '/collection',
                    name: 'collection',
                    component: () => import('@/views/member/collection/index'),
                    meta: { title: '我的收藏', icon: '' }
                },{
                    path: '/address',
                    name: 'address',
                    component: () => import('@/views/member/address/index'),
                    meta: { title: '我的收货地址', icon: '' }
                },{
                    path: '/memberCart',
                    name: 'memberCart',
                    component: () => import('@/views/member/cart/index'),
                    meta: { title: '我的购物车', icon: '' }
                }
            ]
        },
        {
            path: '/cart',
            name: 'cart',
            component: () => import('@/views/cart/index'),
            meta: { title: '购物车列表', icon: '' }
        },{
            path: '/settlement',
            name: 'settlement',
            component: () => import('@/views/settlement/index'),
            meta: { title: '订单结算', icon: '' }
        },{
            path: '/payment',
            redirect: '/payment/pay',
            component: () => import('@/views/payment/index'),
            children: [
                {
                    path: '/payment/pay',
                    name: 'pay',
                    component: () => import('@/views/payment/pay'),
                    meta: { title: '订单支付', icon: '' }
                },
                {
                    path: '/payment/result',
                    name: 'payResult',
                    component: () => import('@/views/payment/result'),
                    meta: { title: '支付结果', icon: '' }
                }
            ],
        }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
