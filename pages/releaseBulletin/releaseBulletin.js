// pages/releaseBulletin/releaseBulletin.js
var base64 = require("../../images/base64");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    evaContent: '',
    index: 0,
    date: '2018-06-01'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      icon: base64.icon20
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var time1 = new Date().Format("yyyy-MM-dd");
    that.setData({
      date: time1
    })
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
    // if (e.detail.value.length == 0 || e.detail.value == '' || e.detail.value == null) {
    //   wx.showToast({
    //     title: '请输入发布内容',
    //     icon: 'loading',
    //     duration: 1000
    //   })
    //   return;
    // }
    // if (e.detail.value.length < 10 || e.detail.value.length > 500) {
    //   wx.showToast({
    //     title: '内容为10-500个字符',
    //     icon: 'loading',
    //     duration: 1000
    //   })
    //   return;     
    // }
    this.setData({
      // evaContent: e.detail.value.replace(/\s+/g, '')
      evaContent: e.detail.value
    });
  },

  //提交事件
  evaSubmit: function (eee) {
    var that = this;
    //创建人
    var account = wx.getStorageSync("account");
    //状态
    var status = "0";
    //内容
    var content = that.data.evaContent;
    console.log(content);
    //结束时间
    var endTime = that.data.date;
    
    //提交(自定义的get方法)
    wx.showModal({
      title: '提示',
      content: '确定要发布该信息?',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          //console.log("用户点击确定");
          var url = getApp().globalData.requestUrl;
          if (content.length == 0 || content == '' || content == null) {
            wx.showToast({
              title: '请输入发布内容',
              icon: 'loading',
              duration: 1000
            })
            return;
          }

          if (content.length < 10 || content.length > 500) {
            wx.showToast({
              title: '内容为10-500个字符',
              icon: 'loading',
              duration: 1000
            })
            return;
          }
          var operBulletinDO = eee.detail.value;
          //var operBulletinDO = [];
          operBulletinDO['status'] = status;
          operBulletinDO['createPerson'] = account;
          operBulletinDO['content'] = content;
          operBulletinDO['endTime'] = endTime+" 23:59:59";

          wx.request({
            url: url + '/operUser/addBulletinInfo',
            data: JSON.stringify(operBulletinDO),
            header: {
              'content-type': 'application/json' // 默认值
            },
            method: "POST",
            success: function (res) {
              //console.log(res.data)
              var result = res.data.success;
              if (result != true) {
                toaseText = "公告发布失败" + res.data.errMsg;
                wx.showToast({
                  title: toaseText,
                  icon: '',
                  duration: 2000
                });
                return;
              }
              var toaseText = "公告发布成功！";
              wx.showToast({
                title: toaseText,
                icon: '',
                duration: 2000
              });
              wx.redirectTo({
                url: '../bulletinManage/bulletinManage',
              })

            }
          })
          
          console.log("提交后" + content);

        } else if (sm.cancel) {
          //console.log('用户点击取消');
          return;
        }
      }
    })
    
  },

  /**
 * 监听日期picker选择器
 */
  listenerDatePickerSelected: function (e) {
    this.setData({
      date: e.detail.value
    })
  }

})

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) { //author: meizz 
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}