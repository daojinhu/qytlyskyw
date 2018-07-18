// pages/repairManage/repairManage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    listBegining: [],
    rid:null,
    currentTab: 0,
    // 触摸开始时间
    touchStartTime: 0,
    // 触摸结束时间
    touchEndTime: 0
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
    var url = getApp().globalData.requestUrl;
    var schoolId = wx.getStorageSync("schoolId");
    //获取已报修的设备信息
    wx.request({
      url: url + '/operUser/queryOperRepairFinish',
      data: {
        'schoolId': schoolId,
      },
      method: 'POST',
      header: {
        "content-type": 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          list: res.data.finishOperRepairList
        })
      }
    })

    //获取接受任务，正在报修的设备信息
    wx.request({
      url: url + '/operUser/queryOperBeingRepair',
      data: {
        'schoolId': schoolId,
      },
      method: 'POST',
      header: {
        "content-type": 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          listBegining: res.data.operBeingRepairList
        })
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
  //跳转到报修详情
  goTaskInfo: function(e){
    var that = this;
    var rid = parseInt(e.currentTarget.id);
    if (that.touchEndTime - that.touchStartTime < 350) {
      wx.navigateTo({
        url: '../taskInfo/taskInfo?rid=' + rid
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

  //长按删除完成的报修任务
  deleteTask: function(e){
    var that = this;
    var rid = parseInt(e.currentTarget.id);
    wx.showModal({
      title: '提示',
      content: '删除该报修记录?',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          var url = getApp().globalData.requestUrl;
          wx.request({
            url: url + '/operUser/deleteFinishRepair',
            data: {
              rid: rid
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