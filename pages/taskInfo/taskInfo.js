// pages/taskInfo/taskInfo.js
//var base64 = require("../../images/base64");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    evaContent: '',
    list:[],
    school:'',
    deviceId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var url = getApp().globalData.requestUrl;
    var account = wx.getStorageSync("account");
    that.setData({
      //icon: base64.icon20,
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
          list: res.data.finishOperRepairByIdList,
          deviceId: res.data.finishOperRepairByIdList[0].deviceName
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
  //事件
  bindTextAreaBlur: function (e) {
    this.setData({
      evaContent: e.detail.value
    });
    console.log("content:"+e.detail.value);
  },

  //完成保修
  finishRepair: function () {
    var that = this;

    //提交(自定义的get方法)
    wx.showModal({
      title: '提示',
      content: '确定完成保修?',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          //console.log("用户点击确定");
          //维修问题描述
          var content1 = that.data.evaContent;
          console.log("content1" + content1);
          var url = getApp().globalData.requestUrl;
          if (content1.length == 0 || content1 == '' || content1 == null) {
            wx.showToast({
              title: '请输入维修问题描述',
              icon: 'loading',
              duration: 1000
            })
            return;
          }

          if (content1.length < 10 || content1.length > 500) {
            wx.showToast({
              title: '内容为10-500个字符',
              icon: 'loading',
              duration: 1000
            })
            return;
          }
          var operProblem = {};
          operProblem['deviceId'] = that.data.deviceId;
          operProblem['problem'] = content1;

          wx.request({
            url: url + '/operUser/addProblemInfo',
            data: JSON.stringify(operProblem),
            header: {
              'content-type': 'application/json' // 默认值
            },
            method: "POST",
            success: function (res) {
              //设备保修完成---start
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
                  wx.navigateBack({
                    delta: -1
                  });

                  var toaseText = "完成报修提交成功！";
                  wx.showToast({
                    title: toaseText,
                    icon: '',
                    duration: 2000
                  });

                }
              })
              //设备保修完成---end

            }
          })


        } else if (sm.cancel) {
          //console.log('用户点击取消');
          return;
        }
      }
    })

  },
  // /**
  //  * 完成报修
  //  */
  // finishRepair: function(){
  //   var that = this;
  //   //设备保修完成---start
  //   console.log("报修完成");
  //   //维修问题描述
  //   var content = that.data.evaContent;
  //   console.log(content);

  //   var url = getApp().globalData.requestUrl;
  //   var account = wx.getStorageSync("account");
  //   var rid = that.data.rid;
  //   var operRepair = {};
  //   operRepair["id"] = rid;
  //   operRepair["taskStatus"] = 3;//报修完成
  //   operRepair["maintainPerson"] = account;
  //   wx.request({
  //     url: url + '/operUser/receiveRepairTasks',
  //     data: JSON.stringify(operRepair),
  //     header: {
  //       'content-type': 'application/json' // 默认值
  //     },
  //     method: "POST",
  //     success: function (res) {
  //       //console.log(res.data)
  //       var result = res.data.success;
  //       if (result != true) {
  //         toaseText = "完成报修提交失败" + res.data.errMsg;
  //         wx.showToast({
  //           title: toaseText,
  //           icon: '',
  //           duration: 2000
  //         });
  //         return;
  //       }
  //       wx.navigateBack({
  //         delta: -1
  //       });
        
  //       var toaseText = "完成报修提交成功！";
  //       wx.showToast({
  //         title: toaseText,
  //         icon: '',
  //         duration: 2000
  //       });
        
  //     }
  //   })
  //   //设备保修完成---end
  // }
})