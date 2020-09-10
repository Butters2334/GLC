//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        errorStr: '',
        qRCodeMsg: '',
        motto: '',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        loginUserName: 'scan_wx',
        loginPassword: app.globalData.DEBUG ? 'scan' : '',
        glc_token: app.globalData.user_token
    },
    // getGoodsList: function (reqeustFunction) {
    //     var eleUrl = "https://gitee.com/rohm/GLCFile/raw/master/guolicheng";
    //     const headers = {
    //         // 'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36",
    //         'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    //     };
    //     wx.showLoading({
    //         title: "更新商品数据中",
    //     })
    //     wx.request({
    //         url: eleUrl,
    //         header: headers,
    //         success: res => {
    //             var newData = res.data.split('\n')
    //             var listdata = {}
    //             for (var index in newData) {
    //                 var datas = newData[index].split('\t')
    //                 //取出商品key作为关键key
    //                 listdata[datas[datas.length - 1]] = datas
    //             }
    //             reqeustFunction(listdata)
    //             app.globalData.allData = listdata
    //             console.log(listdata);
    //             this.getGroupList();
    //         },
    //         fail: res => {
    //             wx.hideLoading()
    //             wx.showToast({ title: '网络异常' })
    //         },
    //         complete: res => {
    //             wx.hideLoading()
    //         },
    //     })
    // },
    // getGroupList: function (reqeustFunction) {
    //     var eleUrl = "https://gitee.com/rohm/GLCFile/raw/master/guolicheng_group";
    //     const headers = {
    //         // 'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36",
    //         'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    //     };
    //     wx.showLoading({
    //         title: "更新教材数据中",
    //     })
    //     wx.request({
    //         url: eleUrl,
    //         header: headers,
    //         success: res => {
    //             var newData = res.data.split('\n')
    //             var listdata = {}
    //             for (var index in newData) {
    //                 var datas = newData[index].split('\t')
    //                 //取出商品key作为关键key
    //                 listdata[datas[4]] = datas
    //             }
    //             app.globalData.groupData = listdata
    //             console.log(listdata);
    //             this.getExpressList();
    //         },
    //         fail: res => {
    //             wx.hideLoading()
    //         },
    //         complete: res => {
    //             wx.hideLoading()
    //         },
    //     })
    // },
    // getExpressList: function (reqeustFunction) {
    //     var eleUrl = "https://gitee.com/rohm/GLCFile/raw/master/guolicheng_express";
    //     const headers = {
    //         // 'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36",
    //         'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    //     };
    //     wx.showLoading({
    //         title: "更新教材数据中",
    //     })
    //     wx.request({
    //         url: eleUrl,
    //         header: headers,
    //         success: res => {
    //             var newData = res.data.split('\n')
    //             var listdata = {}
    //             for (var index in newData) {
    //                 var datas = newData[index].split('\t')
    //                 //取出商品key作为关键key
    //                 listdata[datas[1]] = datas
    //             }
    //             app.globalData.expressData = listdata
    //             console.log(listdata);
    //             var keyList = []
    //             for (var key in listdata) {
    //                 keyList.push(key)
    //             }
    //             // var bself = this;
    //             // setTimeout(function () {
    //             //   bself.resetViewList(keyList[5])
    //             // }, 100);
    //         },
    //         fail: res => {
    //             wx.hideLoading()
    //         },
    //         complete: res => {
    //             wx.hideLoading()
    //         },
    //     })
    // },
    //init
    onLoad: function () {
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
        if (app.globalData.DEBUG) {
            this.bindLoginEvent();//debug
        }
    },
    //账户输入
    bindUserInput: function (e) {
        this.setData({ loginUserName: e.detail.value })
    },
    //密码输入
    bindPwdInput: function (e) {
        this.setData({ loginPassword: e.detail.value })
    },
    //登录事件
    bindLoginEvent: function (e) {
        if (!this.data.loginUserName) {
            wx.showToast({
                title: '请输入账户名称', image: '../image/error.png'
            })
            return;
        }
        if (!this.data.loginPassword) {
            wx.showToast({
                title: '请输入账户密码', image: '../image/error.png'
            })
            return;
        }
        wx.showLoading({
            title: "登录中",
        })
        wx.request({
            url: app.globalData.requestUrl + 'user/login',
            header: {
                // 'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36",
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            },
            data: { username: this.data.loginUserName, password: this.data.loginPassword },
            method: 'POST',
            success: res => {
                var result = res.data.result
                if (!!result.user_token) {
                    app.globalData.user_type = result.user_type
                    app.globalData.user_token = result.user_token
                    this.setData({
                        glc_token: result.user_token
                    })
                    // this.showGoodsList()//debug
                    // this.showCurList()//debug
                } else {
                    wx.showToast({ title: '登录失败', image: '../image/error.png' })
                }
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
    //展示商品列表
    showGoodsList: function () {
        wx.navigateTo({
            url: '/pages/goods/goodsList',
        })
    },
    //展示课程列表
    showCurList: () => {
        wx.navigateTo({
            url: '/pages/cur/curList',
        })
    },
    //扫描二维码    
    onScanEvent: function () {
        var _this = this;
        wx.scanCode({
            //扫描API
            success: function (res) {
                var scancode = res.result
                console.log(scancode);    //输出回调信息
                _this.setData({
                    qRCodeMsg: scancode
                });
                _this.searchTackingId(scancode);
            }, fail: res => {
                console.log(res)
                wx.showToast({ title: '扫描失败', image: '../image/error.png' })
            }
        })
    },
    //查询扫描的面单号是否能找到订单
    searchTackingId: function (code) {
        if (code.length == 0) {
            wx.showToast({ title: '数据异常', image: '../image/error.png' })
            return;
        }
        if (code.endsWith('-1-1-')) {
            code = code.slice(0, code.length - 5)
        }
        wx.showLoading({
            title: "请求中",
        })
        wx.request({
            url: app.globalData.requestUrl + 'order/get_list',
            header: {
                // 'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36",
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            },
            data: {
                page_index: 0, page_size: 1, tracking_id: code
                , token: app.globalData.user_token
            },
            method: 'POST',
            success: res => {
                var result = res.data.result
                if (result.list.length == 0) {
                    wx.hideLoading({
                        complete: res => {
                            wx.showToast({ title: '没有数据' })
                        }
                    })
                    return;
                }
                let order_data = result.list[0]
                //['待拣货', '拣货中', '待打包', '待发货', '发货中', '已收件', '已存档']
                if (order_data.order_db_status !== 0) {
                    wx.hideLoading({
                        complete: res => {
                            wx.showToast({ title: '订单已发货', duration: 3000 })
                        }
                    })
                    return;
                }
                console.log(JSON.stringify(order_data))
                this.searchCurriculum(order_data)
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
    //查询课程详细
    searchCurriculum: function (order_data) {
        wx.showLoading({
            title: "请求中",
        })
        console.log(`order_data.curriculum = ${order_data.curriculum}`)
        wx.request({
            url: app.globalData.requestUrl + 'curriculum/findCur',
            header: {
                // 'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36",
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            },
            data: {
                curNameList: order_data.curriculum.split(','),
                token: app.globalData.user_token
            },
            method: 'POST',
            success: res => {
                var result = res.data.result
                if (Object.keys(result).length===0) {
                    wx.hideLoading({
                        complete: res => {
                            wx.showToast({ title: '没有找到对应课程', duration: 3000 })
                        }
                    })
                    return;
                }
                console.log(JSON.stringify(result))
                wx.navigateTo({
                    url: '/pages/detail/detail?order_data=' + JSON.stringify(order_data) + "&cur=" + JSON.stringify(result),
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
})
