//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
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
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //获取临时登录凭证code
  payoff: function (e) {
    var that = this;
    wx.login({
      success: function (res) {
        console.log("临时登录凭证"+res.code);
        that.getOpenId(res.code);
      }
    });

  },
  //获取openid
  getOpenId: function (code) {
    var that = this;
    var url = getApp().globalData.requestUrl; 
    wx.request({
      url: url+'/operUser/onlogin',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { 'code': code },
      success: function (res) {
        var openId = res.data.openid;
        that.xiadan(openId);
      }
    })
  },
  // //下单
  // xiadan: function (openId) {
  //   var that = this;
  //   wx.request({
  //     url: 'https://www.see-source.com/weixinpay/xiadan',
  //     method: 'POST',
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded'
  //     },
  //     data: { 'openid': openId },
  //     success: function (res) {
  //       var prepay_id = res.data.prepay_id;
  //       console.log("统一下单返回 prepay_id:" + prepay_id);
  //       that.sign(prepay_id);
  //     }
  //   })
  // },
  // //签名
  // sign: function (prepay_id) {
  //   var that = this;
  //   wx.request({
  //     url: 'https://www.see-source.com/weixinpay/sign',
  //     method: 'POST',
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded'
  //     },
  //     data: { 'repay_id': prepay_id },
  //     success: function (res) {
  //       that.requestPayment(res.data);

  //     }
  //   })
  // },
  // //申请支付
  // requestPayment: function (obj) {
  //   wx.requestPayment({
  //     'timeStamp': obj.timeStamp,
  //     'nonceStr': obj.nonceStr,
  //     'package': obj.package,
  //     'signType': obj.signType,
  //     'paySign': obj.paySign,
  //     'success': function (res) {
  //     },
  //     'fail': function (res) {
  //     }
  //   })
  // } 

  xiadan:function(openId){
    var url = getApp().globalData.requestUrl; 
    wx.request({
      url: url+"/operUser/returnparam",//调用java后台的方法  
      data: {
        'openid': openId,//需要你获取用户的openid  
        'title': "shoplist",//订单名称 这里随便定义shoplist  
        'price': 0.1 * 100,//一毛钱  
        'goodsid': 100,///商品ID 这里随便定义成100  
      },
      method: 'POST',
      header: {
        "content-type": 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success: function (res) {
            console.log("付款成功")
          },
          fail: function (res) {
            console.log("付款失败")
          }
        })

      }
    }) 
  },

  bt:function(){
    wx.navigateTo({
      url: '../bluetooth/bluetooth'
    })
  },

  bindMottoTap: function () {
    // this.setData({
    //   motto: "Hello 哈哈"
    // })
    wx.setStorageSync("account", "18194243392");
    wx.navigateTo({
      url: '../main/main',
    })
  }
   

})
