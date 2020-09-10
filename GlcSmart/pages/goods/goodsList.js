// pages/goods/goodsList.js
//获取应用实例
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        allGoods: [],  //所有需要匹配的商品
        isHideLoadMore: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: "教材列表"
        })
        this.sendRequest();
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

    },
    //请求数据
    sendRequest: function (page_index = 0, page_size = 20) {
        if (page_index == 0) {
            wx.showLoading({
                title: "请求中",
            })
        }
        wx.request({
            url: app.globalData.requestUrl + 'goods/get_list',
            header: {
                // 'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36",
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            },
            data: { page_index, page_size, token: app.globalData.user_token },
            method: 'POST',
            success: res => {
                var result = res.data.result
                if (result.list.length == 0) {
                    wx.showToast({ title: '没有数据' })
                    return;
                }
                //判断是下拉刷新还是上拉加载
                let listData = result.list
                if (result.page_index > 0) {
                    listData = [...this.data.listData, ...result.list]
                }
                this.setData({
                    listData: listData,
                    contentHeight: listData.length * 100,
                })
                this._pageIndex = result.page_index
                console.log(JSON.stringify(result.list[0]))
            },
            fail: res => {
                wx.hideLoading()
                wx.showToast({ title: '网络异常' })
            },
            complete: res => {
                wx.hideLoading()
                this.setData({ isHideLoadMore: true })
            },
        })
    },
    onReachBottom: function () { //触底开始下一页
        console.log('滚动到了底部')
        this.setData({ isHideLoadMore: false })
        this.sendRequest(this._pageIndex + 1);
    },
    bindtapEvent: function () {
        wx.showToast({
            title: '不可编辑',
            image: '../image/error.png'
        })
    },
})