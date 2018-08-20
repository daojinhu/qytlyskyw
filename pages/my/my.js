// pages/my/my.js
//var base64 = require("../../images/base64");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname:'乾元通科技',
    account:'15323408207',
    accountBlance:'5.00',
    version:'1.0.0',
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
    var account = wx.getStorageSync("account");
    var url = getApp().globalData.requestUrl;
    // that.setData({
    //   icon: base64.icon20
    // });
    wx.request({
      url: url + '/operUser/getUserByAccount',
      data: {
        account: account
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        console.log(res.data)
        that.setData({
          list: res.data.operUserList,
          accountBlance: res.data.operUserList[0].decAccountBalance
        })
      },
      fail: function (err) {
        console.log("网络错误！");
        wx.navigateBack({
          delta: -1
        });
        wx.showToast({
          title: '网络错误！',
          icon: 'loading',
          duration: 1000
        })
        return;
      }
    })
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
  //获取临时登录凭证code
  payoff: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否要进行充值?',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          //console.log("用户点击确定");
          wx.login({
            success: function (res) {
              console.log("临时登录凭证" + res.code);
              that.getOpenId(res.code);
            }
          });
          wx.showLoading({
            title: '正在处理',
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 1000)  

        } else if (sm.cancel) {
          //console.log('用户点击取消');
          return;
        }
      }
    })
    

  },
  //获取openid
  getOpenId: function (code) {
    var that = this;
    var url = getApp().globalData.requestUrl;
    wx.request({
      url: url + '/operUser/onlogin',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { 
        'code': code,
        'appid': "wx8eac7f97ba6c97a2",
        'secret': "9b3857541cf6b4665ee411c85830fcbb"
         },
      success: function (res) {
        var openId = res.data.openid;
        that.xiadan(openId);
      }
    })
  },
  xiadan: function (openId) {
    var that = this;
    var ab = that.data.accountBlance;
    var url = getApp().globalData.requestUrl;
    var price = 0.01 * 100;//一毛钱=0.1*100
    var schoolId = wx.getStorageSync("schoolId");
    wx.request({
      url: url + "/operUser/returnparam",//调用java后台的方法  
      data: {
        'openid': openId,//需要你获取用户的openid
        'schoolId': schoolId,
        'appid': "wx8eac7f97ba6c97a2", 
        'title': "shoplist",//订单名称 这里随便定义shoplist  
        'price': price,//一毛钱0.1  
        'goodsid': 100,///商品ID 这里随便定义成100  
      },
      method: 'POST',
      header: {
        "content-type": 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var orderNO = res.data.outTradeNo;
            console.log("orderNO" + orderNO);

        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success: function (res) {
            console.log("付款成功");
            var newAB = ab + price/100;
            var account = wx.getStorageSync("account");
            //存入充值记录--start
            var operOrder = {};
            //operOrder["deviceId"] = "";
            operOrder["customerPhone"] = account;
            operOrder["schoolId"] = schoolId;
            operOrder["orderNO"] = orderNO;
            operOrder["paymentMode"] = "1";
            operOrder["consumption"] = price/100;
            operOrder["accountBalance"] = newAB;
            wx.request({
              url: url + "/operUser/addOrderInfo",//调用java后台的方法  
              data: JSON.stringify(operOrder),
              header: {
                'content-type': 'application/json' // 默认值
              },
              method: 'POST',
              success: function (res) {
                var result = res.data.success;
  
                if (result != true) {
                  toastText = "支付失败！";
                  wx.showToast({
                    title: toastText,
                    icon: '',
                    duration: 2000
                  });
                } else {
                  ///////////更新账户余额-start///////////////////
                  wx.request({
                    url: url + "/operUser/updateAccountBalance",//调用java后台的方法  
                    data: {
                      'account': account,//需要你获取用户的openid  
                      'accountBalance': newAB,//一毛钱0.1  
                    },
                    method: 'POST',
                    header: {
                      "content-type": 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {
                      var result = res.data.success;
                      var toastText = "支付成功！";
                      if (result != true) {
                        toastText = "支付失败！";
                      } else {
                        wx.redirectTo({
                          url: '../my/my',
                        })
                      }
                      wx.showToast({
                        title: toastText,
                        icon: '',
                        duration: 2000
                      });

                    }
                  })
            /////////////////更新账户余额-end////////////
                }
                
              }
            })
            //存入充值记录--end
            
            
          },
          fail: function (res) {
            console.log("付款失败");
          }
        })

      }
    })
  },

  /**
   * 退出登录
   */
  logout: function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否要退出登录?',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用退出登录
          wx.removeStorageSync("account");
          wx.removeStorageSync("password");
          wx.redirectTo({
            url: '../login/login',
          })
          // console.log(e.currentTarget.dataset.id);
          // var url = getApp().globalData.requestUrl;
          // wx.request({
          //   url: url + '/operUser/deleteOperDevice',
          //   data: {
          //     rid: e.currentTarget.dataset.id
          //   },
          //   header: {
          //     'content-type': 'application/x-www-form-urlencoded' // 默认值
          //   },
          //   method: 'POST',
          //   success: function (res) {
          //     var result = res.data.success;
          //     var toastText = "删除成功！";
          //     if (result != true) {
          //       toastText = "删除失败！";
          //     } else {
          //       //删除数组的一行
          //       that.data.list.splice(e.currentTarget.dataset.index, 1);
          //       that.setData({
          //         list: that.data.list
          //       });
          //     }
          //     wx.showToast({
          //       title: toastText,
          //       icon: '',
          //       duration: 2000
          //     });
          //   }
          // })

        } else if (sm.cancel) {
          //console.log('用户点击取消');
          return;
        }
      }
    })
  }

})