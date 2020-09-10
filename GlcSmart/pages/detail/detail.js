// pages/detail/detail.js
//获取应用实例
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        express: [],   //收件人地址信息
        group: {},     //教材和绑定的商品
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //组合订单概览
        let express = []
        const order_data = JSON.parse(options.order_data)
        express.push(order_data.tracking_id)
        express.push(order_data.user_addr)
        express.push(order_data.user_name)
        express.push(order_data.user_phone)
        //组合教材数组
        let group = []
        const curMap = JSON.parse(options.cur)
        const curList = Object.values(curMap).flat()//如果多个课程包含相同教材会有bug
        const gNumMap = {}//保存下每个教材需要的数量
        const bindData = {}
        for (let index in curList) {
            let cur = curList[index]
            let goodsList = []
            for (let g_id in cur.c_goods_list) {
                let g_data = cur.c_goods_list[g_id]
                goodsList.push({
                    g_id: g_data.g_id,
                    g_name: [g_data.g_p_0, g_data.g_p_1, g_data.g_p_2, g_data.g_p_3, g_data.g_p_4, g_data.g_p_5].filter(s => s).join(','),
                    no_sotck: cur.c_num > g_data.goods_stock,//是否库存不能满足需求
                })
                gNumMap[g_data.g_id] = gNumMap[g_data.g_id] === undefined ? 1 : gNumMap[g_data.g_id] + 1;
                bindData[g_data.g_id] = 0
            }
            group.push({
                c_name: cur.c_name,
                c_num: cur.c_num,
                g_list: goodsList,
            })
        }
        if (Object.keys(gNumMap).length === 0) {
            wx.showToast({ title: '课程下没有教材', image: '../image/error.png' })
        }
        this.setData({
            express,
            group,
            gNumMap,
            bindData,
            orderId:order_data.order_id,
        })
        wx.setNavigationBarTitle({
            title: "校验订单"
        })
    },
    //扫描教材码
    getQRCode: function () {
        var _this = this;
        wx.scanCode({        //扫描API
            success: function (res) {
                var scancode = res.result
                console.log(scancode);    //输出回调信息
                _this.bingScanCode(scancode);
            }, fail: res => {
                console.log(res)
            }
        })
    },
    //绑定教材到订单中,判断是否已全部绑定完
    bingScanCode: function (code) {
        //扫描错误
        if (code.length == 0) {
            wx.showToast({
                title: '条形码异常',
                duration: 2000
            })
            return;
        }
        //在需求map中没有找到对应教材
        if (this.data.gNumMap[code] === undefined) {
            wx.showToast({
                title: '商品错误',
                duration: 2000,
                image: '../image/error.png'
            })
            return;
        }
        const bindData = this.data.bindData || {}
        bindData[code] = Math.min(bindData[code] + 1,this.data.gNumMap[code]);
        let bindFinish = true
        //判断是否所有教材都录入完成
        for (let key in this.data.gNumMap) {
            let num = this.data.gNumMap[key]
            let scanNum = bindData[key]
            if (num != scanNum) {
                bindFinish = false
                break
            }
        }
        this.setData({
            bindData,
            bindFinish
        })
    },
    //提交订单
    setOrderStatus: function () {
        wx.showLoading({
            title: "提交发货",
        })
        wx.request({
            url: app.globalData.requestUrl + 'order/set_Status',
            header: {
                // 'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36",
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            },
            data: {
                o_status: "4",
                o_id: this.data.orderId,
                token: app.globalData.user_token
            },
            method: 'POST',
            success: res => {
                var result = res.data.result
                console.log(JSON.stringify(result))
                this.setData({
                    orderFinish:true
                })
            },
            fail: res => {
                wx.hideLoading()
                wx.showToast({ title: '网络异常', image: '../image/error.png' })
            },
            complete: res => {
                wx.hideLoading()
            },
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})