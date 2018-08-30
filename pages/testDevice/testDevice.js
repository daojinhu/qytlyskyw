// pages/testDevice/testDevice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rid: null,
    list: [],
    status: "",
    sousuo: "",
    aconnectedDeviceId: "",
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
    useNumTwo: "",
    prepaymentValue: "", //预付费金额
    prepaymentHex: "" //预付费16进制
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
    //延时--start
    wx.showLoading({
      title: '加载中...',
    })
    setTimeout(function() {
      wx.hideLoading()
    }, 2000)
    //延时--end

    var url = getApp().globalData.requestUrl;
    that.setData({
      rid: options.id,
      myDeviceName: options.deviceId
    })
    var rid = options.id;

    //获取预付费金额--start
    wx.request({
      url: url + '/operUser/queryPrepayment',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function(res) {
        that.setData({
          prepaymentValue: res.data.operPrepayment.prepaymentValue,
          prepaymentHex: res.data.operPrepayment.prepaymentHex
        })
      },
      fail: function(err) {
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
    //获取预付费金额--end
    //搜索设备 
    wx.startBluetoothDevicesDiscovery({
      success: function(res) {
        // 获取所有已发现的设备 
        wx.getBluetoothDevices({
          success: function(res) {
            //是否有已连接设备  
            wx.getConnectedBluetoothDevices({
              success: function(res) {
                that.setData({
                  // connectedDeviceId: res.deviceId
                })
              }
            })
            var connectDevicename = that.data.myDeviceName;
            var d = res.devices;
            var a = JSON.stringify(res.devices);
            var c = JSON.parse(a);
            for (var i = 0; i < d.length; i++) {
              if (c[i].name == connectDevicename) {
                that.setData({
                  myDeviceId: c[i].deviceId
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
        wx.createBLEConnection({
          deviceId: selectDeviceId,
          success: function(res) {
            //存储设备id
            wx.setStorageSync("selectDeviceId", selectDeviceId);
            that.setData({
              connectedDeviceId: selectDeviceId,
              msg: "已连接" + selectDeviceId,
              msg1: "",
            })
            //////////////////////
            // 获取连接设备的service服务
            wx.getBLEDeviceServices({
              // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
              deviceId: selectDeviceId,
              success: function(res) {
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
                  serviceId: that.data.services[1].uuid,
                  success: function(res) {
                    for (var i = 0; i < res.characteristics.length; i++) {
                      if (res.characteristics[i].properties.notify) {
                        //console.log("11111111", that.data.services[0].uuid);
                        //console.log("22222222", res.characteristics[1].uuid);
                        that.setData({
                          notifyServicweId: that.data.services[1].uuid,
                          notifyCharacteristicsId: res.characteristics[1].uuid,
                        })
                      }
                      if (res.characteristics[i].properties.write) {
                        that.setData({
                          writeServicweId: that.data.services[1].uuid,
                          writeCharacteristicsId: res.characteristics[0].uuid,
                        })

                      } else if (res.characteristics[i].properties.read) {
                        that.setData({
                          readServicweId: that.data.services[0].uuid,
                          readCharacteristicsId: res.characteristics[0].uuid,
                        })

                      }
                    }

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
                        // console.log('notifyBLECharacteristicValueChange success', res.errMsg)
                        //将从数据库中获取的费率字符串rateConnect写进设备中--start
                        var rateConnect = that.data.rateConnect;
                        //console.log("费率字符串" + rateConnect);
                        var typedArray = new Uint8Array(rateConnect.match(/[\da-f]{2}/gi).map(function(h) {
                          return parseInt(h, 16)
                        }))
                        var buffer1 = typedArray.buffer
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
                            //console.log('writeBLECharacteristicValue success', res.errMsg)
                          }
                        })
                        // 这里的回调可以获取到 write 导致的特征值改变  
                        wx.onBLECharacteristicValueChange(function(characteristic) {
                          //console.log('characteristic value changed:1', characteristic)
                          let hex = Array.prototype.map.call(new Uint8Array(characteristic.value), x => ('00' + x.toString(16)).slice(-2)).join('');
                          //console.log("写费率回调" + hex);
                          that.setData({
                            jieshou: hex,
                            deviceNo: hex.substr(6, 10),
                            //使用次数
                            useNum: hex.substr(16, 6)
                          })

                          //断开连接
                          wx.closeBLEConnection({
                            deviceId: wx.getStorageSync("selectDeviceId"),
                            success: function(res) {
                              that.setData({
                                connectedDeviceId: "",
                              })
                            }
                          })

                          //判断是否有未结算的订单--start
                          var selectDeviceName = that.data.deviceName;
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
                              var operOrderFlag = res.data.operOrderFlag;
                              if (operOrderFlag == 2) {
                                //结算--start
                                var rateReturn = hex;
                                var str = rateReturn.substr(22, 16);
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
                                    'content-type': 'application/json' // 默认值
                                  },
                                  method: "POST",
                                  success: function(res) {
                                    var result = res.data.success;
                                  },
                                  fail: function(err) {
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
                        // console.log('shibai');
                      },
                    })
                    ///////////////////////////////
                  },
                  fail: function() {
                    //console.log("fail"); 
                  },
                  complete: function() {
                    //console.log("complete");
                  }
                })
                ///////////////////////////////
              }
            })
            /////////////////////
          },
          fail: function() {
            //console.log("调用失败");
          },
          complete: function() {
            //console.log("调用结束");
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
        that.setData({
          accountBalance: res.data.operUserList[0].decAccountBalance
        })
      },
      fail: function(err) {
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
    wx.onBluetoothAdapterStateChange(function(res) {})
    if (that.data.isbluetoothready) {
      wx.openBluetoothAdapter({
        success: function(res) {},
        fail: function(res) {
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

  userDevice: function() {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    setTimeout(function() {
      wx.hideLoading()
    }, 2000)
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
        wx.setStorageSync("useNum", res.data.operDeviceListById[0].useNum);
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
        that.setData({
          accountBalance: res.data.operUserList[0].decAccountBalance
        })
      },
      fail: function(err) {
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

    //搜索设备 
    wx.startBluetoothDevicesDiscovery({
      success: function(res) {
        // 获取所有已发现的设备 
        wx.getBluetoothDevices({
          success: function(res) {
            //是否有已连接设备  
            wx.getConnectedBluetoothDevices({
              success: function(res) {
                that.setData({
                  // connectedDeviceId: res.deviceId
                })
              }
            })

            var connectDevicename = that.data.myDeviceName;
            var d = res.devices;
            var a = JSON.stringify(res.devices);
            var c = JSON.parse(a);
            for (var i = 0; i < d.length; i++) {
              if (c[i].name == connectDevicename) {
                that.setData({
                  myDeviceId: c[i].deviceId
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

    //连接
    var selectDeviceId = that.data.myDeviceId;
    wx.createBLEConnection({
      deviceId: that.data.myDeviceId,
      success: function(res) {
        wx.setStorageSync("selectDeviceId", selectDeviceId);
        that.setData({
          connectedDeviceId: selectDeviceId,
          msg: "已连接" + selectDeviceId,
          msg1: "",
        })
        //////////////////////
        // 获取连接设备的service服务
        wx.getBLEDeviceServices({
          // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
          deviceId: selectDeviceId,
          success: function(res) {
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
              serviceId: that.data.services[1].uuid,
              success: function(res) {
                for (var i = 0; i < res.characteristics.length; i++) {
                  if (res.characteristics[i].properties.notify) {
                    that.setData({
                      notifyServicweId: that.data.services[1].uuid,
                      notifyCharacteristicsId: res.characteristics[1].uuid,
                    })
                  }
                  if (res.characteristics[i].properties.write) {
                    that.setData({
                      writeServicweId: that.data.services[1].uuid,
                      writeCharacteristicsId: res.characteristics[0].uuid,
                    })
                  } else if (res.characteristics[i].properties.read) {
                    that.setData({
                      readServicweId: that.data.services[0].uuid,
                      readCharacteristicsId: res.characteristics[0].uuid,
                    })
                  }
                }

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
                    // console.log('notifyBLECharacteristicValueChange success', res.errMsg)
                    //将从数据库中获取的费率字符串rateConnect写进设备中--start
                    var rateConnect = that.data.rateConnect;
                    //console.log("费率字符串" + rateConnect);
                    var typedArray = new Uint8Array(rateConnect.match(/[\da-f]{2}/gi).map(function(h) {
                      return parseInt(h, 16)
                    }))
                    var buffer1 = typedArray.buffer
                    // console.log("十六进制转换为arraybuffer" + buffer1)
                    // console.log("writeServicweId", that.data.writeServicweId);
                    // console.log("writeCharacteristicsId", that.data.writeCharacteristicsId);
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
                        //console.log('writeBLECharacteristicValue success', res.errMsg)   
                      }
                    })
                    // 这里的回调可以获取到 write 导致的特征值改变  
                    wx.onBLECharacteristicValueChange(function(characteristic) {
                      //console.log('characteristic value changed:1', characteristic)
                      let hex = Array.prototype.map.call(new Uint8Array(characteristic.value), x => ('00' + x.toString(16)).slice(-2)).join('');
                      //console.log("写费率回调" + hex);
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
                    var deviceNo = that.data.deviceNo;
                    var hex = that.data.useNumTwo;
                    setTimeout(function() {
                      wx.request({
                        url: url + '/operUser/calculate',
                        data: {
                          deviceNo: deviceNo,
                          useNum: wx.getStorageSync("useNum"),
                          personNo: newAcc,
                          amount: that.data.prepaymentHex
                          //amount: "012c"
                        },
                        header: {
                          'content-type': 'application/x-www-form-urlencoded' // 默认值
                        },
                        method: "POST",
                        success: function(res) {
                          ///////////////////////////////
                          //用水
                          var hex = res.data.calculateString;
                          var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function(h) {
                            return parseInt(h, 16)
                          }))
                          var buffer1 = typedArray.buffer
                          // console.log("十六进制转换为arraybuffer" + buffer1)
                          // console.log("writeServicweId", that.data.writeServicweId);
                          // console.log("writeCharacteristicsId", that.data.writeCharacteristicsId);
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
                              // 这里的回调可以获取到 write 导致的特征值改变  
                              wx.onBLECharacteristicValueChange(function(characteristic) {
                                let hex = Array.prototype.map.call(new Uint8Array(characteristic.value), x => ('00' + x.toString(16)).slice(-2)).join('');
                                //console.log("回调:" + hex);
                                //判断是否结账---start
                                var aa = hex.substr(0, 6);
                                if (aa == "a80310") {
                                  that.setData({
                                    jieshou: hex,
                                    disabled: false,
                                    disabled1: true
                                  })

                                  //结算--start
                                  var rateReturn = hex;
                                  var str = rateReturn.substr(6, 32);
                                  var prepaid = that.data.prepaymentValue;
                                  var operDevice = {};
                                  operDevice["deviceName"] = that.data.deviceName;
                                  operDevice["deviceNo"] = that.data.deviceNo;
                                  operDevice["useNum"] = that.data.useNumTwo;
                                  operDevice["address"] = str; //加密字符串
                                  operDevice["deviceType"] = prepaid; //预付费
                                  wx.request({
                                    url: url + '/operUser/settlement',
                                    data: JSON.stringify(operDevice),
                                    header: {
                                      'content-type': 'application/json' // 默认值
                                    },
                                    method: "POST",
                                    success: function(res) {
                                      var result = res.data.success;
                                      if (result != true) {
                                        wx.showLoading({
                                          title: '结算成功！',
                                        })
                                        setTimeout(function() {
                                          wx.hideLoading()
                                        }, 2000)
                                      } else {
                                        wx.showLoading({
                                          title: '结算失败！',
                                        })
                                        setTimeout(function() {
                                          wx.hideLoading()
                                        }, 2000)
                                      }
                                      //断开连接
                                      wx.closeBLEConnection({
                                        deviceId: wx.getStorageSync("selectDeviceId"),
                                        success: function(res) {
                                          that.setData({
                                            connectedDeviceId: "",
                                          })
                                        }
                                      })
                                    },
                                    fail: function(err) {
                                      //console.log("网络错误！");
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
                                //判断是否结账---end

                                that.setData({
                                  jieshou: hex
                                })
                                //a8011081371561fa0000061000000002033e01c4
                                var deviceNo = that.data.deviceNo;
                                if (hex.substr(0, 6) == "a80210" && hex.length == 40) {
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
                                      var prepaid = that.data.prepaymentValue;
                                      var accountBalance = that.data.accountBalance - prepaid;
                                      var operOrder = {};
                                      operOrder["deviceId"] = deviceName;
                                      operOrder["customerPhone"] = account;
                                      operOrder["deptId"] = wx.getStorageSync("schoolId");
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
                        }
                      })
                    }, 300)
                  },
                  fail: function() {
                    //console.log('shibai');
                  },
                })
                ///////////////////////////////
              },
              fail: function() {
                //console.log("fail");
              },
              complete: function() {
                //console.log("complete");
              }
            })
            ///////////////////////////////
          }
        })
        /////////////////////
      },
      fail: function() {
        //console.log("调用失败");
      },
      complete: function() {
        // console.log("调用结束");
      }
    })
    ////////////////////////////////
  },

  //试水结束
  closeDevice: function() {
    var that = this;
    wx.showLoading({
      title: '正在结算..',
    })
    setTimeout(function() {
      wx.hideLoading()
    }, 4000)
    that.setData({
      disabled: false,
      disabled1: true
    })
    var deviceNo = that.data.deviceNo;
    var hex = that.data.useNumTwo;
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
        /////////////////////////////////
        //结算
        var hex = res.data.settleCalculateString;
        var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function(h) {
          return parseInt(h, 16)
        }))
        var buffer1 = typedArray.buffer
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
            //console.log('writeBLECharacteristicValue success', res.errMsg)
          }
        })
        // 这里的回调可以获取到 write 导致的特征值改变  
        wx.onBLECharacteristicValueChange(function(characteristic) {
          //console.log('characteristic value changed:1', characteristic)
          let hex = Array.prototype.map.call(new Uint8Array(characteristic.value), x => ('00' + x.toString(16)).slice(-2)).join('');
          //console.log("结算回调" + hex);
          that.setData({
            jieshou: hex,
          })

          //结算--start
          var rateReturn = hex;
          var str = rateReturn.substr(6, 32);
          var dn = that.data.deviceName;
          var prepaid = that.data.prepaymentValue; //预付费
          var operDevice = {};
          operDevice["deviceName"] = dn;
          operDevice["deviceNo"] = that.data.deviceNo;
          operDevice["useNum"] = that.data.useNumTwo;
          operDevice["address"] = str; //加密字符串
          operDevice["deviceType"] = prepaid; //预付费
          wx.request({
            url: url + '/operUser/settlement',
            data: JSON.stringify(operDevice),
            header: {
              'content-type': 'application/json' // 默认值
            },
            method: "POST",
            success: function(res) {
              var result = res.data.consumption;
              if (result > 0) {
                wx.showLoading({
                  title: '结算成功！',
                })
                setTimeout(function() {
                  wx.hideLoading()
                }, 3000)
              } else {
                wx.showLoading({
                  title: '结算失败！',
                })
                setTimeout(function() {
                  wx.hideLoading()
                }, 3000)
              }
              //断开连接
              wx.closeBLEConnection({
                deviceId: wx.getStorageSync("selectDeviceId"),
                success: function(res) {
                  that.setData({
                    connectedDeviceId: "",
                  })
                }
              })
            },
            fail: function(err) {
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