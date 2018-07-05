// pages/repairManage/repairManage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    listBegining: [],
    rid:null
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
    //获取已报修的设备信息
    wx.request({
      url: url + '/operUser/queryOperRepairFinish',
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "GET",
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
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "GET",
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
  goTaskInfo: function(e){
    var rid = parseInt(e.currentTarget.id);
    wx.navigateTo({
      url: '../taskInfo/taskInfo?rid=' + rid
    })
  }


})