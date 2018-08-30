// pages/deviceInfo/deviceInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rid: null,
    list: [],
    connnectDeviceId: "",
    connectDeviceName: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var url = getApp().globalData.requestUrl;
    that.setData({
      rid: options.rid
    })
    var rid = options.rid;
    wx.request({
      url: url + '/operUser/queryOperDeviceById',
      data: {
        rid: rid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function(res) {
        that.setData({
          list: res.data.operDeviceListById,
          connectDeviceName: res.data.operDeviceListById[0].deviceName
        })

        //判断蓝牙是否打开--start
        that.setData({
          isbluetoothready: !that.data.isbluetoothready,
        })
        wx.onBluetoothAdapterStateChange(function(res) {
          //console.log("蓝牙适配器状态变化", res)
        })
        if (that.data.isbluetoothready) {
          wx.openBluetoothAdapter({
            success: function(res) {
              //console.log("初始化蓝牙适配器成功")
            },
            fail: function(res) {
              //console.log("初始化蓝牙适配器失败")
              wx.showModal({
                title: '提示',
                content: '请检查手机蓝牙是否打开',
                success: function(res) {
                  if (res.confirm) {
                    // 用户点击了确定 可以调用删除方法了
                    wx.navigateBack({
                      delta: -1
                    });
                  } else if (res.cancel) {
                    wx.navigateBack({
                      delta: -1
                    });
                  }
                }
              })
            }
          })
        }
        //判断蓝牙是否打开--end

        if (wx.openBluetoothAdapter) {
          wx.openBluetoothAdapter()
        } else {
          // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示  
          wx.showModal({
            title: '提示',
            content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
          })
        }

        // 初始化蓝牙适配器 
        wx.openBluetoothAdapter({
          success: function(res) {
            //搜索设备 
            wx.startBluetoothDevicesDiscovery({
              success: function(res) {
                //console.log("搜索设备" + JSON.stringify(res));
                // 获取所有已发现的设备 
                wx.getBluetoothDevices({
                  success: function(res) {
                    //是否有已连接设备  
                    wx.getConnectedBluetoothDevices({
                      success: function(res) {
                        //console.log(JSON.stringify(res.devices));
                        that.setData({
                          // connectedDeviceId: res.deviceId
                        })
                      }
                    })

                    var connectDevicename = that.data.connectDeviceName;
                    var d = res.devices;
                    var a = JSON.stringify(res.devices);
                    var c = JSON.parse(a);
                    for (var i = 0; i < d.length; i++) {
                      if (c[i].name == connectDevicename) {
                        that.setData({
                          connectDeviceId: c[i].deviceId
                        })
                      }
                    }

                    that.setData({
                      devices: res.devices
                    })
                    //监听蓝牙适配器状态  
                    wx.onBluetoothAdapterStateChange(function(res) {
                      that.setData({
                        sousuo: res.discovering ? "在搜索。" : "未搜索。",
                        status: res.available ? "可用。" : "不可用。",
                      })
                    })
                  }
                })
              }
            })

          }
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

  }

})