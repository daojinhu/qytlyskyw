// pages/updatePassword/updatePassword.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //旧密码
    password: '',
    //新密码
    newPassword: '',
    //确认密码
    confirmPassword: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  //清除输入框
  passwordInput: function(e) {
    var name = e.currentTarget.dataset.name;
    this.setData({
      [name]: e.detail.value.replace(/\s+/g, '')
    })
  },
  clearOldPwd: function(e) {
    this.setData({
      password: ''
    })
  },
  //清除新密码
  clearNewPwd: function() {
    this.setData({
      newPassword: ''
    })
  },
  //清除确认密码
  clearConfirmPwd: function() {
    this.setData({
      confirmPassword: ''
    })
  },
  //提交修改密码
  submitPassword: function() {
    var that = this;
    var password = this.data.password;
    var newPassword = this.data.newPassword;
    var confirmPassword = this.data.confirmPassword;
    if (password.length == 0) {
      wx.showToast({
        title: '请输入旧密码',
        icon: 'loading',
        duration: 1000
      })
      return;
    }
    if (newPassword.length == 0) {
      wx.showToast({
        title: '请输入新密码',
        icon: 'loading',
        duration: 1000
      })
      return;
    }
    if (confirmPassword.length == 0) {
      wx.showToast({
        title: '请输入确认密码',
        icon: 'loading',
        duration: 1000
      })
      return;
    }
    if (newPassword != confirmPassword) {
      wx.showToast({
        title: '确认密码不一致',
        icon: 'loading',
        duration: 1000
      })
      return;
    }

    wx.showModal({
      title: '提示',
      content: '是否要修改密码?',
      success: function(sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用修改密码方法
          var url = getApp().globalData.requestUrl;
          var account = wx.getStorageSync("account");
          wx.request({
            url: url + '/operUser/updatePassword',
            data: {
              "account": account,
              "password": confirmPassword
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            method: 'POST',
            success: function(res) {
              var result = res.data.success;
              var toastText = "密码修改成功！";
              if (result != true) {
                toastText = "密码修改失败！";
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
        } else if (sm.cancel) {
          return;
        }
      }
    })
  }
})