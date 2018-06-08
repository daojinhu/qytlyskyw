// pages/main/main.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grids: [0, 1, 2],
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
    var url = getApp().globalData.requestUrl;
    wx.request({
      url: url + '/operUser/queryOperRepair',
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "GET",
      success: function (res) {
        console.log(res.data)
        that.setData({
          list: res.data.operRepairList
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

  addHandle: function(){
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType
        console.log(res.networkType)
        if (networkType == 'none'){
          //console.log('没有网络');
          wx.showToast({
            title: '请检查网络连接！',
            icon: 'loading',
            duration: 1000
          })
        }
      }
    })
    wx.navigateTo({
      url: '../my/my'
    })
  },

  goRepairUpcomingInfo: function(e){
    var rid = parseInt(e.currentTarget.id);
    wx.navigateTo({
      url: '../upcomingTaskInfo/upcomingTaskInfo?rid='+rid
    })
  },

  goToChangeSchool: function(){
    wx.navigateTo({
      url: '../changeSchool/changeSchool'
    })
  }

})