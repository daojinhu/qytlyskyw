// pages/testDevice/testDevice.js
var base64 = require("../../images/base64");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rid: null,
    list: [],
    status: "",
    sousuo: "",
    connectedDeviceId: "", //已连接设备uuid  
    services: "", // 连接设备的服务  
    characteristics: "", // 连接设备的状态值  
    writeServicweId: "", // 可写服务uuid  
    writeCharacteristicsId: "", //可写特征值uuid  
    readServicweId: "", // 可读服务uuid  
    readCharacteristicsId: "", //可读特征值uuid  
    notifyServicweId: "", //通知服务UUid  
    notifyCharacteristicsId: "", //通知特征值UUID  
    inputValue: "",
    characteristics1: "", // 连接设备的状态值 
    deviceId: "", //android设备id
    deviceName: "", //设备名称
    address: "", //设备位置
    accountBalance: "", //账户余额
    disabled: false,
    disabled1: true,
    platform: '', //手机型号
    rateConnect: "", //写费率字符串
    myDeviceId: "", //接收上一个页面的传值
    operOrderFlag: "", //查询是否结算标志
    rateReturn: "", //写费率回调
    useNumTwo: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          platform: res.platform
        })
      }
    })

    var url = getApp().globalData.requestUrl;
    that.setData({
      icon: base64.icon20
    });
    that.setData({
      rid: options.id,
      myDeviceId: options.deviceId
    })
    var rid = options.id;

    console.log("加载" + options.deviceId);
    // 初始化蓝牙适配器 
    wx.openBluetoothAdapter({
      success: function(res) {
        console.log("success" + res);
        //搜索设备 
        wx.startBluetoothDevicesDiscovery({
          success: function(res) {
            console.log("搜索设备" + JSON.stringify(res));
            // 获取所有已发现的设备 
            wx.getBluetoothDevices({
              success: function(res) {
                //是否有已连接设备  
                wx.getConnectedBluetoothDevices({
                  success: function(res) {
                    console.log(JSON.stringify(res.devices));
                    that.setData({
                      connectedDeviceId: res.deviceId
                    })
                  }
                })

                that.setData({
                  //msg: "搜索设备" + JSON.stringify(res.devices),
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

    //查询预付费---start
    // wx.request({
    //   url: url + '/operUser/queryOperOrderByDeviceId',
    //   data: {
    //   },
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded' // 默认值
    //   },
    //   method: "POST",
    //   success: function (res) {
    //     that.setData({
    //       operOrderFlag: res.data.operOrderFlag
    //     })

    //   },
    //   fail: function (err) {
    //     console.log("网络错误！");
    //     wx.navigateBack({
    //       delta: -1
    //     });
    //     wx.showToast({
    //       title: '网络错误！',
    //       icon: 'loading',
    //       duration: 1000
    //     })
    //     return;
    //   }
    // })
    //查询预付费---end

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
    //that.onLoad();
    var rid = that.data.rid;
    var url = getApp().globalData.requestUrl;
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
        console.log(res.data + "----" + res.data.operDeviceListById[0].deviceId + "----" + res.data.operDeviceListById[0].deviceName);
        that.setData({
          list: res.data.operDeviceListById,
          deviceName: res.data.operDeviceListById[0].deviceName,
          deviceId: res.data.operDeviceListById[0].deviceId,
          iosDeviceId: res.data.operDeviceListById[0].iosDeviceId,
          deviceNo: res.data.operDeviceListById[0].deviceNo,
          useNum: res.data.operDeviceListById[0].useNum,
          address: res.data.operDeviceListById[0].address,
          rateConnect: res.data.operDeviceListById[0].rateConnect
        })

        //连接写费率---start
        var selectDeviceId = that.data.myDeviceId;
        console.log("连接" + selectDeviceId);
        wx.createBLEConnection({
          deviceId: selectDeviceId,
          success: function(res) {
            console.log(res.errMsg);
            //存储设备id
            wx.setStorageSync("selectDeviceId", selectDeviceId);
            that.setData({
              connectedDeviceId: selectDeviceId,
              msg: "已连接" + selectDeviceId,
              msg1: "",
            })
            //////////////////////
            console.log(",,,,,,,,,,,,,,,,,,,,,,," + that.data.connectedDeviceId);
            // 获取连接设备的service服务
            wx.getBLEDeviceServices({
              // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
              deviceId: selectDeviceId,
              success: function(res) {
                console.log('device services:', JSON.stringify(res.services));
                that.setData({
                  services: res.services,
                  msg: JSON.stringify(res.services),
                })
                ///////////////////////////////
                //获取连接设备的所有特征值  for循环获取不到值
                wx.getBLEDeviceCharacteristics({
                  // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
                  //deviceId: that.data.connectedDeviceId,
                  deviceId: selectDeviceId,
                  // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取  
                  serviceId: that.data.services[0].uuid,
                  success: function(res) {
                    for (var i = 0; i < res.characteristics.length; i++) {
                      if (res.characteristics[i].properties.notify) {
                        console.log("11111111", that.data.services[0].uuid);
                        console.log("22222222", res.characteristics[1].uuid);
                        that.setData({
                          notifyServicweId: that.data.services[0].uuid,
                          notifyCharacteristicsId: res.characteristics[1].uuid,
                        })
                      }
                      if (res.characteristics[i].properties.write) {
                        that.setData({
                          writeServicweId: that.data.services[0].uuid,
                          writeCharacteristicsId: res.characteristics[0].uuid,
                        })

                      } else if (res.characteristics[i].properties.read) {
                        that.setData({
                          readServicweId: that.data.services[0].uuid,
                          readCharacteristicsId: res.characteristics[0].uuid,
                        })

                      }
                    }
                    console.log('device getBLEDeviceCharacteristics:', res.characteristics);

                    that.setData({
                      msg: JSON.stringify(res.characteristics),
                    })
                    ///////////////////////////////
                    //启用低功耗蓝牙设备特征值变化时的 notify 功能  获得服务特征值后启动监听
                    wx.notifyBLECharacteristicValueChange({
                      state: true, // 启用 notify 功能  
                      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取   
                      //deviceId: that.data.connectedDeviceId,
                      deviceId: selectDeviceId,
                      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取  
                      serviceId: that.data.notifyServicweId,
                      // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取  
                      characteristicId: that.data.notifyCharacteristicsId,
                      success: function(res) {
                        console.log('notifyBLECharacteristicValueChange success', res.errMsg)
                        console.log("1" + that.data.notifyServicweId);
                        console.log("2" + that.data.notifyCharacteristicsId);

                        //将从数据库中获取的费率字符串rateConnect写进设备中--start
                        var rateConnect = that.data.rateConnect;
                        console.log("费率字符串" + rateConnect);
                        var typedArray = new Uint8Array(rateConnect.match(/[\da-f]{2}/gi).map(function(h) {
                          return parseInt(h, 16)
                        }))
                        var buffer1 = typedArray.buffer
                        console.log("十六进制转换为arraybuffer" + buffer1)
                        console.log("writeServicweId", that.data.writeServicweId);
                        console.log("writeCharacteristicsId", that.data.writeCharacteristicsId);
                        //let dataView = new DataView(buffer)
                        //dataView.setUint8(0, 11)
                        //console.log(Uint8View)
                        wx.writeBLECharacteristicValue({
                          // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
                          deviceId: selectDeviceId,
                          // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取  
                          serviceId: that.data.writeServicweId,
                          // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取  
                          characteristicId: that.data.writeCharacteristicsId,
                          // 这里的value是ArrayBuffer类型  
                          value: buffer1,
                          success: function(res) {
                            console.log('writeBLECharacteristicValue success', res.errMsg)
                          }
                        })
                        // 这里的回调可以获取到 write 导致的特征值改变  
                        wx.onBLECharacteristicValueChange(function(characteristic) {
                          console.log('characteristic value changed:1', characteristic)
                          let hex = Array.prototype.map.call(new Uint8Array(characteristic.value), x => ('00' + x.toString(16)).slice(-2)).join('');
                          console.log("写费率回调" + hex);
                          that.setData({
                            jieshou: hex,
                            deviceNo: hex.substr(6, 10),
                            //使用次数
                            useNum: hex.substr(16, 6)
                          })

                          //判断是否有未结算的订单--start
                          var selectDeviceName = that.data.deviceName;
                          console.log("-------------" + selectDeviceName);
                          wx.request({
                            url: url + '/operUser/queryOperOrderByDeviceId',
                            data: {
                              deviceId: selectDeviceName
                            },
                            header: {
                              'content-type': 'application/x-www-form-urlencoded' // 默认值
                            },
                            method: "POST",
                            success: function(res) {
                              // that.setData({
                              //   operOrderFlag: res.data.operOrderFlag
                              // })
                              var operOrderFlag = res.data.operOrderFlag;
                              if (operOrderFlag == 2) {
                                //结算--start
                                var rateReturn = hex;
                                var str = rateReturn.substr(22, 16);
                                console.log("----------" + str);
                                var prepaid = 3;
                                var operDevice = {};
                                operDevice["deviceName"] = selectDeviceName;
                                operDevice["deviceNo"] = that.data.deviceNo;
                                operDevice["useNum"] = that.data.useNum;
                                operDevice["address"] = str;
                                operDevice["deviceType"] = prepaid;
                                wx.request({
                                  url: url + '/operUser/settle',
                                  data: JSON.stringify(operDevice),
                                  header: {
                                    'content-type': 'application/json'// 默认值
                                  },
                                  method: "POST",
                                  success: function(res) {
                                    var result = res.data.success;
                                    var toastText = "结算成功！";
                                    if (result != true) {
                                      toastText = "结算失败！";
                                    }
                                    wx.showToast({
                                      title: toastText,
                                      icon: '',
                                      duration: 2000
                                    });
                                  },
                                  fail: function(err) {
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
                                //结算--end
                              }
                            },
                            fail: function(err) {
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
                          //判断是否有未结算的订单--start
                        })
                        //将从数据库中获取的费率字符串rateConnect写进设备中--end
                      },
                      fail: function() {
                        console.log('shibai');
                        console.log(that.data.notifyServicweId);
                        console.log(that.data.notifyCharacteristicsId);
                      },
                    })
                    ///////////////////////////////

                  },
                  fail: function() {
                    console.log("fail");
                  },
                  complete: function() {
                    console.log("complete");
                  }
                })
                ///////////////////////////////
              }
            })

            /////////////////////

          },
          fail: function() {
            console.log("调用失败");
          },
          complete: function() {
            console.log("调用结束");
          }

        })
        ////////////////////////////////
        //连接写费率---end
      }
    })



    var account = wx.getStorageSync("account");
    wx.request({
      url: url + '/operUser/getUserByAccount',
      data: {
        account: account
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function(res) {
        console.log(res.data + "--" + res.data.operUserList[0].decAccountBalance)
        that.setData({
          accountBalance: res.data.operUserList[0].decAccountBalance
        })
      },
      fail: function(err) {
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



    //判断蓝牙是否打开--start
    that.setData({
      isbluetoothready: !that.data.isbluetoothready,
    })
    wx.onBluetoothAdapterStateChange(function(res) {
      console.log("蓝牙适配器状态变化", res)
    })
    if (that.data.isbluetoothready) {
      wx.openBluetoothAdapter({
        success: function(res) {
          console.log("初始化蓝牙适配器成功")
          wx.navigateTo({
            url: '../usewater/usewater',
          })
        },
        fail: function(res) {
          console.log("初始化蓝牙适配器失败")
          wx.showModal({
            title: '提示',
            content: '请检查手机蓝牙是否打开',
            success: function(res) {
              that.setData({

              })
            }
          })
        }
      })
    }
    //判断蓝牙是否打开--end



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

  userDevice: function() {
    var that = this;
    that.setData({
      disabled: true,
      disabled1: false
    })
    var rid = that.data.rid;
    var url = getApp().globalData.requestUrl;
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
        console.log(res.data + "--userDevice--" + res.data.operDeviceListById[0].deviceId + "----" + res.data.operDeviceListById[0].iosDeviceId);
        that.setData({
          list: res.data.operDeviceListById,
          deviceId: res.data.operDeviceListById[0].deviceId,
          iosDeviceId: res.data.operDeviceListById[0].iosDeviceId,
          deviceNo: res.data.operDeviceListById[0].deviceNo,
          useNumTwo: res.data.operDeviceListById[0].useNum,
          rateConnect: res.data.operDeviceListById[0].rateConnect
        })
      }
    })

    var account = wx.getStorageSync("account");
    wx.request({
      url: url + '/operUser/getUserByAccount',
      data: {
        account: account
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function(res) {
        console.log(res.data + "--" + res.data.operUserList[0].decAccountBalance)
        that.setData({
          accountBalance: res.data.operUserList[0].decAccountBalance
        })
      },
      fail: function(err) {
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

    //判断是否够3块钱用水
    var ab = that.data.accountBalance;
    if (ab < 3) {
      wx.showToast({
        title: '余额少于3元，请先充值',
        icon: 'loading',
        duration: 1000
      })
      return;
    }

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
        console.log("success" + res);
        //搜索设备 
        wx.startBluetoothDevicesDiscovery({
          success: function(res) {
            console.log("搜索设备" + JSON.stringify(res));
            // 获取所有已发现的设备 
            wx.getBluetoothDevices({
              success: function(res) {
                //是否有已连接设备  
                wx.getConnectedBluetoothDevices({
                  success: function(res) {
                    console.log(JSON.stringify(res.devices));
                    that.setData({
                      connectedDeviceId: res.deviceId
                    })
                  }
                })

                that.setData({
                  //msg: "搜索设备" + JSON.stringify(res.devices),
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

    //连接
    var selectDeviceId = that.data.myDeviceId;
    console.log("连接" + selectDeviceId);
    wx.createBLEConnection({
      deviceId: selectDeviceId,
      success: function(res) {
        console.log(res.errMsg);
        //存储设备id
        wx.setStorageSync("selectDeviceId", selectDeviceId);
        that.setData({
          connectedDeviceId: selectDeviceId,
          msg: "已连接" + selectDeviceId,
          msg1: "",
        })
        //////////////////////
        console.log(",,,,,,,,,,,,,,,,,,,,,,," + that.data.connectedDeviceId);
        // 获取连接设备的service服务
        wx.getBLEDeviceServices({
          // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
          deviceId: selectDeviceId,
          success: function(res) {
            console.log('device services:', JSON.stringify(res.services));
            that.setData({
              services: res.services,
              msg: JSON.stringify(res.services),
            })
            ///////////////////////////////
            //获取连接设备的所有特征值  for循环获取不到值
            wx.getBLEDeviceCharacteristics({
              // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
              //deviceId: that.data.connectedDeviceId,
              deviceId: selectDeviceId,
              // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取  
              serviceId: that.data.services[0].uuid,
              success: function(res) {
                for (var i = 0; i < res.characteristics.length; i++) {
                  if (res.characteristics[i].properties.notify) {
                    console.log("11111111", that.data.services[0].uuid);
                    console.log("22222222", res.characteristics[1].uuid);
                    that.setData({
                      notifyServicweId: that.data.services[0].uuid,
                      notifyCharacteristicsId: res.characteristics[1].uuid,
                    })
                  }
                  if (res.characteristics[i].properties.write) {
                    that.setData({
                      writeServicweId: that.data.services[0].uuid,
                      writeCharacteristicsId: res.characteristics[0].uuid,
                    })

                  } else if (res.characteristics[i].properties.read) {
                    that.setData({
                      readServicweId: that.data.services[0].uuid,
                      readCharacteristicsId: res.characteristics[0].uuid,
                    })

                  }
                }
                console.log('device getBLEDeviceCharacteristics:', res.characteristics);

                that.setData({
                  msg: JSON.stringify(res.characteristics),
                })
                ///////////////////////////////
                //启用低功耗蓝牙设备特征值变化时的 notify 功能  获得服务特征值后启动监听
                wx.notifyBLECharacteristicValueChange({
                  state: true, // 启用 notify 功能  
                  // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取   
                  //deviceId: that.data.connectedDeviceId,
                  deviceId: selectDeviceId,
                  // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取  
                  serviceId: that.data.notifyServicweId,
                  // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取  
                  characteristicId: that.data.notifyCharacteristicsId,
                  success: function(res) {
                    console.log('notifyBLECharacteristicValueChange success', res.errMsg)
                    console.log("1" + that.data.notifyServicweId);
                    console.log("2" + that.data.notifyCharacteristicsId);

                    //将从数据库中获取的费率字符串rateConnect写进设备中--start
                    var rateConnect = that.data.rateConnect;
                    console.log("费率字符串" + rateConnect);
                    var typedArray = new Uint8Array(rateConnect.match(/[\da-f]{2}/gi).map(function(h) {
                      return parseInt(h, 16)
                    }))
                    var buffer1 = typedArray.buffer
                    console.log("十六进制转换为arraybuffer" + buffer1)
                    console.log("writeServicweId", that.data.writeServicweId);
                    console.log("writeCharacteristicsId", that.data.writeCharacteristicsId);
                    //let dataView = new DataView(buffer)
                    //dataView.setUint8(0, 11)
                    //console.log(Uint8View)
                    wx.writeBLECharacteristicValue({
                      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
                      deviceId: selectDeviceId,
                      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取  
                      serviceId: that.data.writeServicweId,
                      // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取  
                      characteristicId: that.data.writeCharacteristicsId,
                      // 这里的value是ArrayBuffer类型  
                      value: buffer1,
                      success: function(res) {
                        console.log('writeBLECharacteristicValue success', res.errMsg)
                      }
                    })
                    // 这里的回调可以获取到 write 导致的特征值改变  
                    wx.onBLECharacteristicValueChange(function(characteristic) {
                      console.log('characteristic value changed:1', characteristic)
                      let hex = Array.prototype.map.call(new Uint8Array(characteristic.value), x => ('00' + x.toString(16)).slice(-2)).join('');
                      console.log("写费率回调" + hex);
                      that.setData({
                        jieshou: hex,
                      })
                    })
                    //将从数据库中获取的费率字符串rateConnect写进设备中--end

                    ///////////////////////////////////
                    //从服务器获取连接字符串
                    var url = getApp().globalData.requestUrl;
                    //开阀用水
                    var account = wx.getStorageSync("account");
                    var newAcc = account.substr(1, 10);
                    // var newAcc = PrefixInteger(account, 10);
                    var deviceNo = that.data.deviceNo;
                    // var ten = parseInt(that.data.useNum, 16) + 1;
                    // var hex = PrefixInteger(ten.toString(16), 6);
                    var hex = that.data.useNumTwo;
                    wx.request({
                      url: url + '/operUser/calculate',
                      data: {
                        deviceNo: deviceNo,
                        useNum: hex,
                        personNo: newAcc,
                        amount: "012c"
                      },
                      header: {
                        'content-type': 'application/x-www-form-urlencoded' // 默认值
                      },
                      method: "POST",
                      success: function(res) {
                        console.log(res.data);
                        ///////////////////////////////
                        //用水
                        var hex = res.data.calculateString;
                        //var hex = "A702107B139E1767C1ABAAB3839FAE436470A745";
                        var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function(h) {
                          return parseInt(h, 16)
                        }))
                        var buffer1 = typedArray.buffer
                        console.log("十六进制转换为arraybuffer" + buffer1)
                        console.log("writeServicweId", that.data.writeServicweId);
                        console.log("writeCharacteristicsId", that.data.writeCharacteristicsId);
                        //let dataView = new DataView(buffer)
                        //dataView.setUint8(0, 11)
                        console.log(that.data.iosDeviceId + "+++相等+++" + that.data.connectedDeviceId);
                        wx.writeBLECharacteristicValue({
                          // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
                          //deviceId: that.data.connectedDeviceId,
                          deviceId: selectDeviceId,
                          // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取  
                          serviceId: that.data.writeServicweId,
                          // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取  
                          characteristicId: that.data.writeCharacteristicsId,
                          // 这里的value是ArrayBuffer类型  
                          value: buffer1,
                          success: function(res) {
                            console.log('writeBLECharacteristicValue success', res.errMsg)
                          }
                        })
                        // 这里的回调可以获取到 write 导致的特征值改变  
                        wx.onBLECharacteristicValueChange(function(characteristic) {
                          console.log('characteristic value changed:1', characteristic)
                          let hex = Array.prototype.map.call(new Uint8Array(characteristic.value), x => ('00' + x.toString(16)).slice(-2)).join('');
                          console.log("回调:" + hex);
                          //判断是否结账---start
                          var aa = hex.substr(0, 6);
                          console.log("aa" + aa);
                          if (aa == "a80310") {
                            console.log("相等");
                            that.setData({
                              jieshou: hex,
                              disabled: false,
                              disabled1: true
                            })
                            ////////////////////////
                            // var accountBalance = that.data.accountBalance;
                            // //预充到水控机的十块钱用水剩下的钱数
                            // var lastMoney = parseInt(hex.substr(32, 4), 16) * 0.01;
                            // //消费的钱
                            // var useMoney = 3 - lastMoney;
                            // //最后的余额
                            // var ab = accountBalance - useMoney;
                            // var account = wx.getStorageSync("account");

                            // //记录用水交易记录--start
                            // var deviceName = that.data.deviceName;
                            // var address = that.data.address;
                            // var operOrder = {};
                            // operOrder["deviceId"] = deviceName;
                            // operOrder["customerPhone"] = account;
                            // operOrder["address"] = address;
                            // operOrder["paymentMode"] = "2"; //消费
                            // operOrder["prepaid"] = "3.00";
                            // operOrder["settlement"] = "1"; //已结算
                            // operOrder["consumption"] = useMoney;
                            // operOrder["accountBalance"] = ab;
                            // wx.request({
                            //   url: url + "/operUser/addOrderInfo", //调用java后台的方法  
                            //   data: JSON.stringify(operOrder),
                            //   header: {
                            //     'content-type': 'application/json' // 默认值
                            //   },
                            //   method: 'POST',
                            //   success: function(res) {
                            //     var result = res.data.success;

                            //     if (result != true) {
                            //       toastText = "结算失败！";
                            //       wx.showToast({
                            //         title: toastText,
                            //         icon: '',
                            //         duration: 2000
                            //       });
                            //     } else {
                            //       ///////////更新账户余额-start///////////////////
                            //       wx.request({
                            //         url: url + "/operUser/updateAccountBalance", //调用java后台的方法  
                            //         data: {
                            //           'account': account, //需要你获取用户的openid  
                            //           'accountBalance': ab
                            //         },
                            //         method: 'POST',
                            //         header: {
                            //           "content-type": 'application/x-www-form-urlencoded'
                            //         },
                            //         success: function(res) {
                            //           var result = res.data.success;
                            //           if (result != true) {
                            //             var toastText = "结算失败！";
                            //             wx.showToast({
                            //               title: toastText,
                            //               icon: '',
                            //               duration: 2000
                            //             });
                            //             return;
                            //           }
                            //           var toastText = "结算成功！";
                            //           wx.showToast({
                            //             title: toastText,
                            //             icon: '',
                            //             duration: 2000
                            //           });
                            //           //断开连接
                            //           wx.closeBLEConnection({
                            //             deviceId: wx.getStorageSync("selectDeviceId"),
                            //             success: function(res) {
                            //               console.log("断开蓝牙连接");
                            //               that.setData({
                            //                 connectedDeviceId: "",
                            //               })
                            //             }
                            //           })

                            //           // wx.navigateBack({
                            //           //   delta: -1
                            //           // });



                            //         }
                            //       })
                            //       /////////////////更新账户余额-end////////////
                            //     }

                            //   }
                            // })
                            // //记录用水交易记录--end
                            //结算--start
                            var rateReturn = hex;
                            var str = rateReturn.substr(6, 32);
                            console.log("----------" + str);
                            var prepaid = 3;
                            var operDevice = {};
                            operDevice["deviceName"] = that.data.deviceName;
                            operDevice["deviceNo"] = that.data.deviceNo;
                            operDevice["useNum"] = that.data.useNumTwo;
                            operDevice["address"] = str;//加密字符串
                            operDevice["deviceType"] = prepaid;//预付费
                            wx.request({
                              url: url + '/operUser/settlement',
                              data: JSON.stringify(operDevice),
                              header: {
                                'content-type': 'application/json' // 默认值
                              },
                              method: "POST",
                              success: function (res) {
                                var result = res.data.success;
                                var toastText = "结算成功！";
                                if (result != true) {
                                  toastText = "结算失败！";
                                }
                                wx.showToast({
                                  title: toastText,
                                  icon: '',
                                  duration: 2000
                                });
                                //断开连接
                                wx.closeBLEConnection({
                                  deviceId: wx.getStorageSync("selectDeviceId"),
                                  success: function (res) {
                                    console.log("断开蓝牙连接");
                                    that.setData({
                                      connectedDeviceId: "",
                                    })
                                  }
                                })
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
          //结算--end

                            //return;
                          }
                          //判断是否结账---end

                          that.setData({
                            jieshou: hex,
                            // //机器编号
                            // deviceNo: hex.substr(6, 10),
                            // //使用次数
                            // useNum: hex.substr(16, 6)
                          })
                          //a8011081371561fa0000061000000002033e01c4
                          console.log(hex.substr(6, 10) + "==" + hex.substr(16, 6) + "==" + hex.substr(22, 10));
                          // var deviceNo = hex.substr(6, 10);
                          // var useNum = hex.substr(16, 6);
                          
                          var deviceNo = that.data.deviceNo;
                          // var useNum = that.data.useNum;
                          // var ten = parseInt(useNum, 16) + 1;
                          // var he = PrefixInteger(ten.toString(16), 6);
                          if(hex.substr(0,6) == "a80210" && hex.length == 40){
                          wx.request({
                            url: url + "/operUser/updateOperDeviceUseNum", //调用java后台的方法  
                            data: {
                              'deviceNo': deviceNo //需要你获取用户的openid  
                            },
                            method: 'POST',
                            header: {
                              "content-type": 'application/x-www-form-urlencoded'
                            },
                            success: function(res) {
                              //生成用水订单---start
                              var deviceName = that.data.deviceName;
                              var address = that.data.address;
                              var prepaid = 3;
                              var accountBalance = that.data.accountBalance - prepaid;
                              var operOrder = {};
                              operOrder["deviceId"] = deviceName;
                              operOrder["customerPhone"] = account;
                              operOrder["address"] = address;
                              operOrder["orderNO"] = randomChar();
                              operOrder["paymentMode"] = "2"; //消费
                              operOrder["prepaid"] = prepaid;
                              operOrder["settlement"] = "2"; //未结算
                              operOrder["accountBalance"] = accountBalance;
                              wx.request({
                                url: url + "/operUser/addOrderInfo", //调用java后台的方法  
                                data: JSON.stringify(operOrder),
                                header: {
                                  'content-type': 'application/json' // 默认值
                                },
                                method: 'POST',
                                success: function(res) {
                                  var result = res.data.success;
                                  var toastText = "正在用水！";
                                  // if (result != true) {
                                  //   toastText = "结算失败！";
                                  // }
                                  wx.showToast({
                                    title: toastText,
                                    icon: '',
                                    duration: 2000
                                  });

                                }
                              })
                              //生成用水订单---end



                            }
                          })

                        }

                        })
                        ///////////////////////////////////

                      }


                    })



                  },
                  fail: function() {
                    console.log('shibai');
                    console.log(that.data.notifyServicweId);
                    console.log(that.data.notifyCharacteristicsId);
                  },
                })
                ///////////////////////////////

              },
              fail: function() {
                console.log("fail");
              },
              complete: function() {
                console.log("complete");
              }
            })
            ///////////////////////////////
          }
        })

        /////////////////////

      },
      fail: function() {
        console.log("调用失败");
      },
      complete: function() {
        console.log("调用结束");
      }

    })
    console.log(that.data.connectedDeviceId);
    ////////////////////////////////
  },

  //试水结束
  closeDevice: function() {
    var that = this;
    that.setData({
      disabled: false,
      disabled1: true
    })
    var deviceNo = that.data.deviceNo;
    var hex = that.data.useNumTwo;
    // var ten = parseInt(that.data.useNum, 16) + 1;
    // var hex = PrefixInteger(ten.toString(16), 6);
    var accountBalance = that.data.accountBalance;
    var url = getApp().globalData.requestUrl;
    wx.request({
      url: url + '/operUser/settleCalculate',
      data: {
        deviceNo: deviceNo,
        useNum: hex
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function(res) {
        console.log(res.data.settleCalculateString);
        /////////////////////////////////
        //结算
        var hex = res.data.settleCalculateString;
        var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function(h) {
          return parseInt(h, 16)
        }))
        var buffer1 = typedArray.buffer
        console.log("十六进制转换为arraybuffer" + buffer1)
        console.log("writeServicweId", that.data.writeServicweId);
        console.log("writeCharacteristicsId", that.data.writeCharacteristicsId);
        // let dataView = new DataView(buffer)
        // dataView.setUint8(0, 11)
        //console.log(Uint8View)
        wx.writeBLECharacteristicValue({
          // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
          //deviceId: that.data.connectedDeviceId,
          deviceId: wx.getStorageSync("selectDeviceId"),
          // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取  
          serviceId: that.data.writeServicweId,
          // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取  
          characteristicId: that.data.writeCharacteristicsId,
          // 这里的value是ArrayBuffer类型  
          value: buffer1,
          success: function(res) {
            console.log('writeBLECharacteristicValue success', res.errMsg)
          }
        })
        // 这里的回调可以获取到 write 导致的特征值改变  
        wx.onBLECharacteristicValueChange(function(characteristic) {
          console.log('characteristic value changed:1', characteristic)
          let hex = Array.prototype.map.call(new Uint8Array(characteristic.value), x => ('00' + x.toString(16)).slice(-2)).join('');
          console.log("结算回调" + hex);
          console.log(hex.substr(16, 6) + "---" + hex.substr(32, 10) + "===" + hex.substr(32, 4));
          that.setData({
            jieshou: hex,
          })
          ////////////////////////
          // //预充到水控机的十块钱用水剩下的钱数
          // var lastMoney = parseInt(hex.substr(32,4),16)*0.01;
          // //消费的钱
          // var useMoney = 3 - lastMoney;
          // //最后的余额
          // var ab = accountBalance - useMoney;
          // var account = wx.getStorageSync("account");

          // //记录用水交易记录--start
          // var deviceName = that.data.deviceName;
          // var address = that.data.address;
          // var operOrder = {};
          // operOrder["deviceId"] = deviceName;
          // operOrder["customerPhone"] = account;
          // operOrder["address"] = address;
          // operOrder["paymentMode"] = "2";
          // operOrder["prepaid"] = "3.00";
          // operOrder["settlement"] = "1";//已结算
          // operOrder["consumption"] = useMoney;
          // operOrder["accountBalance"] = ab;
          // wx.request({
          //   url: url + "/operUser/addOrderInfo",//调用java后台的方法  
          //   data: JSON.stringify(operOrder),
          //   header: {
          //     'content-type': 'application/json' // 默认值
          //   },
          //   method: 'POST',
          //   success: function (res) {
          //     var result = res.data.success;

          //     if (result != true) {
          //       toastText = "结算失败！";
          //       wx.showToast({
          //         title: toastText,
          //         icon: '',
          //         duration: 2000
          //       });
          //     } else {
          //       ///////////更新账户余额-start///////////////////
          //       wx.request({
          //         url: url + "/operUser/updateAccountBalance",//调用java后台的方法  
          //         data: {
          //           'account': account,//需要你获取用户的openid  
          //           'accountBalance': ab
          //         },
          //         method: 'POST',
          //         header: {
          //           "content-type": 'application/x-www-form-urlencoded'
          //         },
          //         success: function (res) {
          //           var result = res.data.success;
          //           if (result != true) {
          //             var toastText = "结算失败！";
          //             wx.showToast({
          //               title: toastText,
          //               icon: '',
          //               duration: 2000
          //             });
          //             return;
          //           }
          //           var toastText = "结算成功！";
          //           wx.showToast({
          //             title: toastText,
          //             icon: '',
          //             duration: 2000
          //           });
          //           //断开连接
          //           wx.closeBLEConnection({
          //             deviceId: wx.getStorageSync("selectDeviceId"),
          //             success: function (res) {
          //               console.log("断开蓝牙连接");
          //               that.setData({
          //                 connectedDeviceId: "",
          //               })
          //             }
          //           })

          //           // wx.navigateBack({
          //           //   delta: -1
          //           // });



          //         }
          //       })
          //       /////////////////更新账户余额-end////////////
          //     }

          //   }
          // })
          // //记录用水交易记录--end
          //结算--start
          var rateReturn = hex;
          var str = rateReturn.substr(6, 32);
          var dn = that.data.deviceName;
          console.log("----------" + str);
          var prepaid = 3;
          var operDevice = {};
          operDevice["deviceName"] = dn;
          operDevice["deviceNo"] = that.data.deviceNo;
          operDevice["useNum"] = that.data.useNumTwo;
          operDevice["address"] = str;//加密字符串
          operDevice["deviceType"] = prepaid;//预付费
          wx.request({
            url: url + '/operUser/settlement',
            data: JSON.stringify(operDevice),
            header: {
              'content-type': 'application/json' // 默认值
            },
            method: "POST",
            success: function(res) {
              var result = res.data.success;
              var toastText = "结算成功！";
              if (result != true) {
                toastText = "结算失败！";
              }
              wx.showToast({
                title: toastText,
                icon: '',
                duration: 2000
              });
                    //断开连接
                    wx.closeBLEConnection({
                      deviceId: wx.getStorageSync("selectDeviceId"),
                      success: function (res) {
                        console.log("断开蓝牙连接");
                        that.setData({
                          connectedDeviceId: "",
                        })
                      }
                    })
            },
            fail: function(err) {
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
          //结算--end
        })

        ///////////////////////////////////
      },
      fail: function(err) {
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
  }



})

//补零
function PrefixInteger(num, n) {
  return (Array(n).join(0) + num).slice(-n);
}

//生成随机字符串
function randomChar() {
  var l = 6;
  var x = "0123456789";
  var tmp = "";
  var timestamp = new Date().getTime();
  for (var i = 0; i < l; i++) {
    tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
  }
  return timestamp + tmp;
}