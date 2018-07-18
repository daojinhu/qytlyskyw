// pages/orderManage/orderManage.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    list: [],
    // 触摸开始时间
    touchStartTime: 0,
    // 触摸结束时间
    touchEndTime: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight - 45
        });
      }
    }); 
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
    var url = getApp().globalData.requestUrl;
    var schoolId = wx.getStorageSync("schoolId");
    wx.request({
      url: url + '/operUser/queryOperDevice',
      data: {
        'schoolId': schoolId,
      },
      method: 'POST',
      header: {
        "content-type": 'application/x-www-form-urlencoded'
      },

      success: function (res) {
        var list = res.data.operDeviceList;
        if (list == null) {
          var toastText = '获取数据失败' + res.data.errMsg;
          wx.showToast({
            title: toastText,
            icon: '',
            duration: 2000
          });
        } else {
          that.setData({
            list: list
          })
        }
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

  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  //点击按钮跳转到添加设备界面
  openAddDevice: function () {
    wx.navigateTo({
      url: '../addDevice/addDevice'
    })
  },
  //点击按钮跳转到设备详情页面
  goDeviceInfo: function (e) {
    var that = this;
    var rid = parseInt(e.currentTarget.dataset.id);
    if (that.touchEndTime - that.touchStartTime < 350) {
      wx.navigateTo({
        url: '../orderInfo/orderInfo?rid=' + rid
      })
    }
  },

  /// 按钮触摸开始触发的事件
  touchStart: function (e) {
    this.touchStartTime = e.timeStamp;
  },

  /// 按钮触摸结束触发的事件
  touchEnd: function (e) {
    this.touchEndTime = e.timeStamp;
  },
  /// 长按
  bingLongTap: function (e) {
    console.log("是否删除设备");
    var that = this;
    //var rid = parseInt(e.currentTarget.id);
    console.log(e.currentTarget.dataset.id + "---" + e.currentTarget.dataset.devicename);
    wx.showModal({
      title: '提示',
      content: '是否要删除该设备?',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          console.log(e.currentTarget.dataset.id);
          var url = getApp().globalData.requestUrl;
          wx.request({
            url: url + '/operUser/deleteOperDevice',
            data: {
              rid: e.currentTarget.dataset.id
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            method: 'POST',
            success: function (res) {
              var result = res.data.success;
              var toastText = "删除成功！";
              if (result != true) {
                toastText = "删除失败！";
              } else {
                //删除数组的一行
                that.data.list.splice(e.currentTarget.dataset.index, 1);
                that.setData({
                  list: that.data.list
                });
              }
              wx.showToast({
                title: toastText,
                icon: '',
                duration: 2000
              });
            }
          })

        } else if (sm.cancel) {
          //console.log('用户点击取消');
          return;
        }
      }
    })
  }

})