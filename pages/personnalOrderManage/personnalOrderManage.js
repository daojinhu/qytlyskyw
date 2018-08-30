// pages/personnalOrderManage/personnalOrderManage.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    list: [], //已结算订单
    noList: [], //未结算订单
    rechargeList1: [], //充值订单
    // 触摸开始时间
    touchStartTime: 0,
    // 触摸结束时间
    touchEndTime: 0,
    //下拉加载更多--start
    hidden: true, //隐藏加载中的字样
    pageStart: 0, //查找开始
    pageSize: 8, //查找个数
    isFromSearch: true, // 用于判断searchSongList数组是不是空数组，默认true，空的数组
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏
    account: '' //账户
    //下拉加载更多--end
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      account: options.account
    })
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          scrollHeight: res.windowHeight - 45
        });
      }
    });
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
    var that = this;
    //获取所有已结算订单信息---start
    that.endkeywordSearch();
    //获取所有已结算订单信息---end
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

  //滑动切换
  swiperTab: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    if (e.detail.current == 0) {
      //获取所有已结算订单信息---start
      that.endkeywordSearch();
      //获取所有已结算订单信息---end
    } else if (e.detail.current == 1) {
      //获取所有待结算订单信息---start
      that.nokeywordSearch();
      //获取所有待结算订单信息---end
    } else {
      //获取所有充值订单信息---start
      that.keywordSearch();
      //获取所有充值订单信息---end
    }
  },
  //点击切换
  clickTab: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
      if (e.target.dataset.current == 0) {
        //获取所有已结算订单信息---start
        that.endkeywordSearch();
        //获取所有已结算订单信息---end
      } else if (e.target.dataset.current == 1) {
        //获取所有待结算订单信息---start
        that.nokeywordSearch();
        //获取所有待结算订单信息---end
      } else {
        //获取所有充值订单信息---start
        that.keywordSearch();
        //获取所有充值订单信息---end
      }
    }
  },

  //点击按钮跳转到设备详情页面
  goOrderInfo: function(e) {
    var that = this;
    var rid = parseInt(e.currentTarget.dataset.id);
    if (that.touchEndTime - that.touchStartTime < 350) {
      wx.navigateTo({
        url: '../orderInfo/orderInfo?rid=' + rid
      })
    }
  },

  /// 按钮触摸开始触发的事件
  touchStart: function(e) {
    this.touchStartTime = e.timeStamp;
  },

  /// 按钮触摸结束触发的事件
  touchEnd: function(e) {
    this.touchEndTime = e.timeStamp;
  },

  //已结算订单下拉加载更多---start
  //点击导航，触发事件
  endkeywordSearch: function(e) {
    this.setData({
      pageStart: 0, //第一次加载，设置1
      isFromSearch: true, //第一次加载，设置true
      searchLoading: true, //把"上拉加载"的变量设为true，显示
      searchLoadingComplete: false //把“没有数据”设为false，隐藏
    })
    this.loadEndOrder(this.data.pageStart, this.data.pageSize);
  },

  //滚动到底部触发事件
  endsearchScrollLower: function() {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        pageStart: (that.data.pageStart + 1) * that.data.pageSize, //每次触发上拉事件，把searchPageNum+1
        isFromSearch: false //触发到上拉事件，把isFromSearch设为为false
      });
      that.loadEndOrder(that.data.pageStart, that.data.pageSize);
    }
  },

  //加载已结算订单
  loadEndOrder: function(pageStart, pageSize) {
    var that = this;
    var url = getApp().globalData.requestUrl;
    var schoolId = wx.getStorageSync("schoolId");
    //获取所有已结算订单信息---start
    wx.request({
      url: url + '/operUser/queryOperOrderByAccountAndSettlement',
      data: {
        account: that.data.account,
        paymentMode: 2,
        settlement: 1,
        pageStart: pageStart,
        pageSize: pageSize
      },
      method: 'POST',
      header: {
        "content-type": 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        var list1 = res.data.operOrderByDeptIdAndSettlement;
        if (list1.length != 0) {
          let searchList = [];
          //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
          that.data.isFromSearch ? searchList = list1 : searchList = that.data.list.concat(list1)
          that.setData({
            list: searchList, //获取数据数组
            searchLoading: true //把"上拉加载"的变量设为false，显示
          });
          //没有数据了，把“没有数据”显示，把“上拉加载”隐藏
        } else {
          that.setData({
            searchLoadingComplete: true, //把“没有数据”设为true，显示
            searchLoading: false //把"上拉加载"的变量设为false，隐藏
          });
        }
      }
    })
    //获取所有已结算订单信息---end
  },
  //已结算订单下拉加载更多---end

  //未结算订单下拉加载更多---start
  //点击导航，触发事件
  nokeywordSearch: function(e) {
    this.setData({
      pageStart: 0, //第一次加载，设置1
      isFromSearch: true, //第一次加载，设置true
      searchLoading: true, //把"上拉加载"的变量设为true，显示
      searchLoadingComplete: false //把“没有数据”设为false，隐藏
    })
    this.loadNoOrder(this.data.pageStart, this.data.pageSize);
  },

  //滚动到底部触发事件
  nosearchScrollLower: function() {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        pageStart: (that.data.pageStart + 1) * that.data.pageSize, //每次触发上拉事件，把searchPageNum+1
        isFromSearch: false //触发到上拉事件，把isFromSearch设为为false
      });
      that.loadNoOrder(that.data.pageStart, that.data.pageSize);
    }
  },

  //加载未结算订单
  loadNoOrder: function(pageStart, pageSize) {
    var that = this;
    var url = getApp().globalData.requestUrl;
    var schoolId = wx.getStorageSync("schoolId");
    //获取所有未结算订单信息---start
    wx.request({
      url: url + '/operUser/queryOperOrderByAccountAndSettlement',
      data: {
        account: that.data.account,
        paymentMode: 2,
        settlement: 2,
        pageStart: pageStart,
        pageSize: pageSize
      },
      method: 'POST',
      header: {
        "content-type": 'application/x-www-form-urlencoded'
      },

      success: function(res) {
        var list1 = res.data.operOrderByDeptIdAndSettlement;
        if (list1.length != 0) {
          let searchList = [];
          //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
          that.data.isFromSearch ? searchList = list1 : searchList = that.data.noList.concat(list1)
          that.setData({
            noList: searchList, //获取数据数组
            searchLoading: true //把"上拉加载"的变量设为false，显示
          });
          //没有数据了，把“没有数据”显示，把“上拉加载”隐藏
        } else {
          that.setData({
            searchLoadingComplete: true, //把“没有数据”设为true，显示
            searchLoading: false //把"上拉加载"的变量设为false，隐藏
          });
        }
      }
    })
    //获取所有未结算订单信息---end
  },
  //未结算订单下拉加载更多---end

  //充值订单下拉加载更多---start
  //点击导航，触发事件
  keywordSearch: function(e) {
    this.setData({
      pageStart: 0, //第一次加载，设置1
      isFromSearch: true, //第一次加载，设置true
      searchLoading: true, //把"上拉加载"的变量设为true，显示
      searchLoadingComplete: false //把“没有数据”设为false，隐藏
    })
    this.loadRechargeOrder(this.data.pageStart, this.data.pageSize);
  },

  //滚动到底部触发事件
  searchScrollLower: function() {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        pageStart: (that.data.pageStart + 1) * that.data.pageSize, //每次触发上拉事件，把searchPageNum+1
        isFromSearch: false //触发到上拉事件，把isFromSearch设为为false
      });
      that.loadRechargeOrder(that.data.pageStart, that.data.pageSize);
    }
  },

  //加载充值订单
  loadRechargeOrder: function(pageStart, pageSize) {
    var that = this;
    var url = getApp().globalData.requestUrl;
    var schoolId = wx.getStorageSync("schoolId");
    //获取所有充值订单信息---start
    wx.request({
      url: url + '/operUser/queryOperOrderByAccountAndPaymentMode',
      data: {
        account: that.data.account,
        paymentMode: 1,
        pageStart: pageStart,
        pageSize: pageSize
      },
      method: 'POST',
      header: {
        "content-type": 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        var list = res.data.operOrderRecharge;
        if (list.length != 0) {
          let searchList = [];
          //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
          that.data.isFromSearch ? searchList = list : searchList = that.data.rechargeList1.concat(list)
          that.setData({
            rechargeList1: searchList, //获取数据数组
            searchLoading: true //把"上拉加载"的变量设为false，显示
          });
          //没有数据了，把“没有数据”显示，把“上拉加载”隐藏
        } else {
          that.setData({
            searchLoadingComplete: true, //把“没有数据”设为true，显示
            searchLoading: false //把"上拉加载"的变量设为false，隐藏
          });
        }
      }
    })
    //获取所有充值订单信息---end
  }
  //充值订单下拉加载更多---end

})