var app = getApp();
Page({
  data: {
    status: "",
    sousuo: "",
    connectedDeviceId: "", //已连接设备uuid  
    services: "", // 连接设备的服务  
    characteristics: "",   // 连接设备的状态值  
    writeServicweId: "", // 可写服务uuid  
    writeCharacteristicsId: "",//可写特征值uuid  
    readServicweId: "", // 可读服务uuid  
    readCharacteristicsId: "",//可读特征值uuid  
    notifyServicweId: "", //通知服务UUid  
    notifyCharacteristicsId: "", //通知特征值UUID  
    inputValue: "",
    characteristics1: "", // 连接设备的状态值  
  },
  onLoad: function () {
    if (wx.openBluetoothAdapter) {
      wx.openBluetoothAdapter()
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示  
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }

  },
  // 初始化蓝牙适配器  
  lanya1: function () {
    var that = this;
    wx.openBluetoothAdapter({
      success: function (res) {
        that.setData({
          msg: "初始化蓝牙适配器成功！" + JSON.stringify(res),
        })
        //监听蓝牙适配器状态  
        wx.onBluetoothAdapterStateChange(function (res) {
          that.setData({
            sousuo: res.discovering ? "在搜索。" : "未搜索。",
            status: res.available ? "可用。" : "不可用。",
          })
        })
      }
    })
  },
  // 本机蓝牙适配器状态  
  lanya2: function () {
    var that = this;
    wx.getBluetoothAdapterState({
      success: function (res) {
        that.setData({
          msg: "本机蓝牙适配器状态" + "/" + JSON.stringify(res.errMsg),
          sousuo: res.discovering ? "在搜索。" : "未搜索。",
          status: res.available ? "可用。" : "不可用。",
        })
        //监听蓝牙适配器状态  
        wx.onBluetoothAdapterStateChange(function (res) {
          that.setData({
            sousuo: res.discovering ? "在搜索。" : "未搜索。",
            status: res.available ? "可用。" : "不可用。",
          })
        })
      }
    })
  },
  //搜索设备  
  lanya3: function () {
    var that = this;
    wx.startBluetoothDevicesDiscovery({
      success: function (res) {
        that.setData({
          msg: "搜索设备" + JSON.stringify(res),
        })
        //监听蓝牙适配器状态  
        wx.onBluetoothAdapterStateChange(function (res) {
          that.setData({
            sousuo: res.discovering ? "在搜索。" : "未搜索。",
            status: res.available ? "可用。" : "不可用。",
          })
        })
      }
    })
  },
  // 获取所有已发现的设备  
  lanya4: function () {
    var that = this;
    wx.getBluetoothDevices({
      success: function (res) {
        //是否有已连接设备  
        wx.getConnectedBluetoothDevices({
          success: function (res) {
            console.log(JSON.stringify(res.devices));
            that.setData({
              connectedDeviceId: res.deviceId
            })
          }
        })

        that.setData({
          msg: "搜索设备" + JSON.stringify(res.devices),
          devices: res.devices,
        })
        //监听蓝牙适配器状态  
        wx.onBluetoothAdapterStateChange(function (res) {
          that.setData({
            sousuo: res.discovering ? "在搜索。" : "未搜索。",
            status: res.available ? "可用。" : "不可用。",
          })
        })
      }
    })
  },
  //停止搜索周边设备  
  lanya5: function () {
    var that = this;
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        that.setData({
          msg: "停止搜索周边设备" + "/" + JSON.stringify(res.errMsg),
          sousuo: res.discovering ? "在搜索。" : "未搜索。",
          status: res.available ? "可用。" : "不可用。",
        })
      }
    })
  },
  //连接设备  
  connectTO: function (e) {
    var that = this;
    wx.createBLEConnection({
      deviceId: e.currentTarget.id,
      success: function (res) {
        console.log(res.errMsg);
        that.setData({
          connectedDeviceId: e.currentTarget.id,
          msg: "已连接" + e.currentTarget.id,
          msg1: "",
        })
      },
      fail: function () {
        console.log("调用失败");
      },
      complete: function () {
        console.log("调用结束");
      }

    })
    console.log(that.data.connectedDeviceId);
  },
  // 获取连接设备的service服务  
  lanya6: function () {
    var that = this;
    wx.getBLEDeviceServices({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
      deviceId: that.data.connectedDeviceId,
      success: function (res) {
        console.log('device services:', JSON.stringify(res.services));
        that.setData({
          services: res.services,
          msg: JSON.stringify(res.services),
        })
      }
    })
  },
  //获取连接设备的所有特征值  for循环获取不到值  
  lanya7: function () {
    var that = this;
    wx.getBLEDeviceCharacteristics({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
      deviceId: that.data.connectedDeviceId,
      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取  
      serviceId: that.data.services[0].uuid,
      success: function (res) {
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
      },
      fail: function () {
        console.log("fail");
      },
      complete: function () {
        console.log("complete");
      }
    })

    //   wx.getBLEDeviceCharacteristics({
    //     // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
    //     deviceId: that.data.connectedDeviceId,
    //     // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取  
    //     serviceId: that.data.services[1].uuid,
    //     success: function (res) {
    //       for (var i = 0; i < res.characteristics.length; i++) {
    //         if (res.characteristics[i].properties.notify) {
    //           that.setData({
    //             notifyServicweId: that.data.services[1].uuid,
    //             notifyCharacteristicsId: res.characteristics[i].uuid,
    //           })
    //         }
    //         if (res.characteristics[i].properties.write) {
    //           that.setData({
    //             writeServicweId: that.data.services[1].uuid,
    //             writeCharacteristicsId: res.characteristics[i].uuid,
    //           })

    //         } else if (res.characteristics[i].properties.read) {
    //           that.setData({
    //             readServicweId: that.data.services[1].uuid,
    //             readCharacteristicsId: res.characteristics[i].uuid,
    //           })

    //         }
    //       }
    //       console.log('device getBLEDeviceCharacteristics1:', res.characteristics);

    //       that.setData({
    //         msg1: JSON.stringify(res.characteristics),
    //       })
    //     },
    //     fail: function () {
    //       console.log("fail1");
    //     },
    //     complete: function () {
    //       console.log("complete1");
    //     }
    //   })
  },
  //断开设备连接  
  lanya0: function () {
    var that = this;
    wx.closeBLEConnection({
      deviceId: that.data.connectedDeviceId,
      success: function (res) {
        that.setData({
          connectedDeviceId: "",
        })
      }
    })
  },
  //监听input表单  
  inputTextchange: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  //发送  
  lanya: function () {
    var that = this;
    // 这里的回调可以获取到 write 导致的特征值改变  
    wx.onBLECharacteristicValueChange(function (characteristic) {
      console.log('characteristic value changed:1', characteristic)
    })
    var buf = new ArrayBuffer(40)
    var dataView = new DataView(buf)

    wx.request({
      url: "",
      success: function (data) {
        var arr = data.data.data.split(",");
        console.log(arr);
        for (var i = 0; i < arr.length; i++) {
          dataView.setInt8(i, arr[i]);
        }
        console.log('str', buf);
        console.log("writeServicweId", that.data.writeServicweId);
        console.log("writeCharacteristicsId", that.data.writeCharacteristicsId);
        wx.writeBLECharacteristicValue({
          // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
          deviceId: that.data.connectedDeviceId,
          // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取  
          serviceId: that.data.writeServicweId,
          // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取  
          characteristicId: that.data.writeCharacteristicsId,
          // 这里的value是ArrayBuffer类型  
          value: buf,
          success: function (res) {
            console.log('writeBLECharacteristicValue success', res.errMsg)
          }
        })
      }
    })

  },
  //启用低功耗蓝牙设备特征值变化时的 notify 功能  获得服务特征值后启动监听
  lanya9: function () {
    var that = this;
    //var notifyServicweId = that.data.notifyServicweId.toUpperCase();  
    //var notifyCharacteristicsId = that.data.notifyCharacteristicsId.toUpperCase();  
    //console.log("11111111", notifyServicweId);  
    //console.log("22222222222222222", notifyCharacteristicsId);  
    wx.notifyBLECharacteristicValueChange({
      state: true, // 启用 notify 功能  
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取   
      deviceId: that.data.connectedDeviceId,
      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取  
      serviceId: that.data.notifyServicweId,
      // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取  
      characteristicId: that.data.notifyCharacteristicsId,
      success: function (res) {
        console.log('notifyBLECharacteristicValueChange success', res.errMsg)
        console.log("1" + that.data.notifyServicweId);
        console.log("2" + that.data.notifyCharacteristicsId);
      },
      fail: function () {
        console.log('shibai');
        console.log(that.data.notifyServicweId);
        console.log(that.data.notifyCharacteristicsId);
      },
    })
  },
  //写费率，只写一次
  lanya8: function () {
    var that = this;
    var hex = 'A701101122334455667788430000010A0002553E'
    var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
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
      deviceId: that.data.connectedDeviceId,
      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取  
      serviceId: that.data.writeServicweId,
      // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取  
      characteristicId: that.data.writeCharacteristicsId,
      // 这里的value是ArrayBuffer类型  
      value: buffer1,
      success: function (res) {
        console.log('writeBLECharacteristicValue success', res.errMsg)
      }
    })
    // 这里的回调可以获取到 write 导致的特征值改变  
    wx.onBLECharacteristicValueChange(function (characteristic) {
      console.log('characteristic value changed:1', characteristic)
      let hex = Array.prototype.map.call(new Uint8Array(characteristic.value), x => ('00' + x.toString(16)).slice(-2)).join('');
      console.log(hex);
      that.setData({
        jieshou: hex,
      })
    })
  },
  //使用设备 出水
  lanya10: function () {
    var that = this;
    var hex = 'A7021081371561f900000B1000000002012800D9'
    var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
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
      deviceId: that.data.connectedDeviceId,
      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取  
      serviceId: that.data.writeServicweId,
      // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取  
      characteristicId: that.data.writeCharacteristicsId,
      // 这里的value是ArrayBuffer类型  
      value: buffer1,
      success: function (res) {
        console.log('writeBLECharacteristicValue success', res.errMsg)
      }
    })
    // 这里的回调可以获取到 write 导致的特征值改变  
    wx.onBLECharacteristicValueChange(function (characteristic) {
      console.log('characteristic value changed:1', characteristic)
      let hex = Array.prototype.map.call(new Uint8Array(characteristic.value), x => ('00' + x.toString(16)).slice(-2)).join('');
      console.log(hex);
      that.setData({
        jieshou: hex,
      })
    }) 
  },
  //结算
  lanya11: function () {
    var that = this;
    var hex = 'A7031081371561f900000B000000000000000013'
    var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
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
      deviceId: that.data.connectedDeviceId,
      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取  
      serviceId: that.data.writeServicweId,
      // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取  
      characteristicId: that.data.writeCharacteristicsId,
      // 这里的value是ArrayBuffer类型  
      value: buffer1,
      success: function (res) {
        console.log('writeBLECharacteristicValue success', res.errMsg)
      }
    })
    // 这里的回调可以获取到 write 导致的特征值改变  
    wx.onBLECharacteristicValueChange(function (characteristic) {
      console.log('characteristic value changed:1', characteristic)
      let hex = Array.prototype.map.call(new Uint8Array(characteristic.value), x => ('00' + x.toString(16)).slice(-2)).join('');
      console.log(hex);
      that.setData({
        jieshou: hex,
      })
    })
  }

}) 