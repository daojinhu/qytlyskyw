// pages/taskInfo/taskInfo.js
var base64 = require("../../images/base64");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    school:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var url = getApp().globalData.requestUrl;
    var account = wx.getStorageSync("account");
    that.setData({
      icon: base64.icon20,
      school: wx.getStorageSync("school")
    });
    that.setData({
      rid: options.rid
    })
    var rid = options.rid;
    console.log("dd" + options.rid);
    wx.request({
      url: url + '/operUser/queryOperRepairFinById',
      data: {
        rid: rid,
        maintainPerson: account
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        console.log(res.data)
        that.setData({
          list: res.data.finishOperRepairByIdList
        })
      }
    })
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
  /**
   * 完成报修
   */
  finishRepair: function(){
    var that = this;
    console.log("报修完成");

    var url = getApp().globalData.requestUrl;
    var account = wx.getStorageSync("account");
    var rid = that.data.rid;
    var operRepair = {};
    operRepair["id"] = rid;
    operRepair["taskStatus"] = 3;//报修完成
    operRepair["maintainPerson"] = account;
    wx.request({
      url: url + '/operUser/receiveRepairTasks',
      data: JSON.stringify(operRepair),
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "POST",
      success: function (res) {
        //console.log(res.data)
        var result = res.data.success;
        if (result != true) {
          toaseText = "完成报修提交失败" + res.data.errMsg;
          wx.showToast({
            title: toaseText,
            icon: '',
            duration: 2000
          });
          return;
        }
        var toaseText = "完成报修提交成功！";
        wx.showToast({
          title: toaseText,
          icon: '',
          duration: 2000
        });
        wx.navigateBack({
          delta: -1
        });
      }
    })
  }
})