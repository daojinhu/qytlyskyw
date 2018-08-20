// pages/statisticalAnalysis/statisticalAnalysis.js
var chart = require("../../utils/chart.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    list: [],
    orderAmountList: '',//日均订单
    orderMoneyList: '',//日均金额
    orderAmountListCount: '',//订单总数
    orderMoneyListCount: '',//订单总金额
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
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
    wx.showLoading({
      title: '加载中...',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
    var url = getApp().globalData.requestUrl;
    var schoolId = wx.getStorageSync("schoolId");
    //查询预付费---start
    wx.request({
      url: url + '/operUser/queryOrderByDeptId',
      data: {
        deptId: schoolId,
        paymentMode: 2,
        day: 7
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        console.log(res.data.operOrderList);
        var orderAmountList = res.data.operOrderList[0].orderAmount;
        var orderMoneyList = res.data.operOrderList[0].orderMoney;
        that.setData({
          orderAmountListCount: res.data.operOrderList[0].orderAmount,
          orderMoneyListCount: res.data.operOrderList[0].orderMoney,
          orderAmountList: ((res.data.operOrderList[0].orderAmount) / 7).toFixed(2),
          orderMoneyList: ((res.data.operOrderList[0].orderMoney) / 7).toFixed(2)
        })
       
        var aa = [];
        var bb = [];
        var cc = [];
        for (var i = 1; i < res.data.operOrderList.length; i++){
          console.log(res.data.operOrderList[1].orderMoney);
          aa.push(res.data.operOrderList[i].orderAmount);
          bb.push(res.data.operOrderList[i].orderMoney);
          cc.push((res.data.operOrderList[i].timeInterval).substr(5,5));
        }
        console.log("aa"+aa+"--"+bb);
        that.chartDraw('canvas1', aa, bb, cc);
        
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
    //查询预付费---end
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
    //---------------------
    var canvas = "";
    var day = "";
    if (e.detail.current == 1) {
      day = 30;
      canvas = "canvas2";
    } else if (e.detail.current == 2) {
      day = 90;
      canvas = "canvas3";
    } else {
      day = 7;
      canvas = "canvas1";

    }

    var url = getApp().globalData.requestUrl;
    var schoolId = wx.getStorageSync("schoolId");
    //查询预付费---start
    wx.request({
      url: url + '/operUser/queryOrderByDeptId',
      data: {
        deptId: schoolId,
        paymentMode: 2,
        day: day
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        console.log(res.data.operOrderList);
        var orderAmountList = res.data.operOrderList[0].orderAmount;
        var orderMoneyList = res.data.operOrderList[0].orderMoney;
        that.setData({
          orderAmountListCount: res.data.operOrderList[0].orderAmount,
          orderMoneyListCount: res.data.operOrderList[0].orderMoney,
          orderAmountList: ((res.data.operOrderList[0].orderAmount) / day).toFixed(2),
          orderMoneyList: ((res.data.operOrderList[0].orderMoney) / day).toFixed(2)
        })

        var aa = [];
        var bb = [];
        var cc = [];
        for (var i = 1; i < res.data.operOrderList.length; i++) {
          console.log(res.data.operOrderList[1].orderMoney);
          aa.push(res.data.operOrderList[i].orderAmount);
          bb.push(res.data.operOrderList[i].orderMoney);
          cc.push((res.data.operOrderList[i].timeInterval).substr(5, 5));
        }
        console.log("aa" + aa + "--" + bb);
        that.chartDraw(canvas, aa, bb, cc);

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
    //查询预付费---end
    //---------------------
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
      var canvas = "";
      var day = "";
      if(e.target.dataset.current == 1){
        day = 30;
        canvas = "canvas2";
      } else if (e.target.dataset.current == 2){
        day = 90;
        canvas = "canvas3";
      }else{
        day = 7;
        canvas = "canvas1";
        
      }
      
      var url = getApp().globalData.requestUrl;
      var schoolId = wx.getStorageSync("schoolId");
      //查询预付费---start
      wx.request({
        url: url + '/operUser/queryOrderByDeptId',
        data: {
          deptId: schoolId,
          paymentMode: 2,
          day: day
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        method: "POST",
        success: function (res) {
          console.log(res.data.operOrderList);
          var orderAmountList = res.data.operOrderList[0].orderAmount;
          var orderMoneyList = res.data.operOrderList[0].orderMoney;
          that.setData({
            orderAmountListCount: res.data.operOrderList[0].orderAmount,
            orderMoneyListCount: res.data.operOrderList[0].orderMoney,
            orderAmountList: ((res.data.operOrderList[0].orderAmount) / day).toFixed(2),
            orderMoneyList: ((res.data.operOrderList[0].orderMoney) / day).toFixed(2)
          })

          var aa = [];
          var bb = [];
          var cc = [];
          for (var i = 1; i < res.data.operOrderList.length; i++) {
            aa.push(res.data.operOrderList[i].orderAmount);
            bb.push(res.data.operOrderList[i].orderMoney);
            cc.push((res.data.operOrderList[i].timeInterval).substr(5, 5));
          }
          console.log("aa" + aa + "--" + bb);
          that.chartDraw(canvas, aa, bb, cc);

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
    //查询预付费---end


    }

    

  },
  chartDraw: function (canvas, order, money,time) {
    //图形切换：category:柱状图-》bar；折线图-》line；饼状图-》pie

    chart.draw(this, canvas , {
      title: {
        text: "热水澡订单统计(笔)",
        color: "#333333"
      },
      //x轴刻度
      xAxis: {
        data: time
        //data: ['北京', '上海', '杭州', '深圳', '广州', '成都', '南京', '西安']
      },
      series: [
        {
          name: "订单",
          category: "line",
          //data: [37, 63, 60, 78, 92, 63, 57, 48]
          data: order
        },
        {
          name: "金额",
          category: "line",
          //data: [20, 35, 38, 59, 48, 27, 43, 35]
          data: money
        },
        // {
        //   name: ['北京', '上海', '杭州', '深圳', '广州', '成都'],
        //   category: "pie",
        //   data: [40, 38, 39, 28, 27, 33]
        // }
      ]
    });
  },
  goToRechargeAnalysis: function(){
    wx.navigateTo({
      url: '../rechargeAnalysis/rechargeAnalysis',
    })
  }
})