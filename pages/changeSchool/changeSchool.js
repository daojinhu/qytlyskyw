// pages/changeSchool/changeSchool.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    listSchool: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var url = getApp().globalData.requestUrl;
    that.setData({
      listSchool: options.name
    });

    wx.request({
      url: url + '/operUser/getAddress',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "GET",
      success: function(res) {
        that.setData({
          list: res.data.operAddressList
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  funChangeSchool: function(e) {
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    var account = wx.getStorageSync("account");
    wx.showModal({
      title: '提示',
      content: '是否要切换该学校?',
      success: function(sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          var url = getApp().globalData.requestUrl;
          wx.request({
            url: url + '/operUser/updateSchool',
            data: {
              account: account,
              deptId: id
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            method: 'POST',
            success: function(res) {
              var result = res.data.success;
              wx.setStorageSync("school", name);
              wx.setStorageSync("schoolId", id);
              var toastText = "修改成功！";
              if (result != true) {
                toastText = "修改失败！";
              } else {
                wx.navigateBack({
                  delta: -1
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
          return;
        }
      }
    })
  }
})