//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  getRestList: function (reqeustFunction) {
    var eleUrl = "";
    const userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36";
    const headers = {
      'User-Agent': userAgent,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    };
    wx.showLoading({
      title: '更新数据中',
    })
    wx.request({
      url: eleUrl,
      header: headers,
      success: res => {
        // var newData = res.data.map(sdata => {
        //   return { "name": sdata["name"], "id": sdata["id"] };
        // })
        console.log(res.data);
        reqeustFunction(res.data);
      },
      fail: res => {
        wx.hideLoading()
      }
      // complete:res => {
      //   wx.hideLoading()
      // }
    })
  },
  onLoad: function () {
    // this.setData({
    //   logs: (wx.getStorageSync('logs') || []).map(log => {
    //     return util.formatTime(new Date(log))
    //   })
    // })
    this.getRestList({

    });
  }
})



// 步骤先写出来
//0,下载数据/更新/
//1,log页面改为展示所有数据
//2,扫描权限看看怎么做
//3,扫描之后的简单显示和匹配之后的显示