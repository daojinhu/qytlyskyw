// pages/addDeviceInfo/addDeviceInfo.js
var base64 = require("../../images/base64");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //设备名称
    deviceName:'',
    //设备类型
    deviceType: '',
    //学校
    school:[],
    //设备位置
    address:[''],
    //楼栋
    building:'',
    //楼层
    floor:'',
    //宿舍
    dormitory:'',
    //供应商
    supplier:'',
    //费率
    rate:'',
    //自动关阀时间
    closeTime:['10','15','20'],

    // text:"这是一个页面"
    array: ['Android', 'IOS', 'ReactNativ', 'WeChat', 'Web'],
    index: 0,
    time: '08:30',
    date: '2016-09-26',
    deviceId:'',
    services: '',
    characteristics: "",   // 连接设备的状态值  
    writeServicweId: "", // 可写服务uuid  
    writeCharacteristicsId: "",//可写特征值uuid  
    readServicweId: "", // 可读服务uuid  
    readCharacteristicsId: "",//可读特征值uuid  
    notifyServicweId: "", //通知服务UUid  
    notifyCharacteristicsId: "", //通知特征值UUID
    characteristics1: "", // 连接设备的状态值
    jieshou: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      icon: base64.icon20,
      deviceType: options.id,
      deviceName: options.devicename,
      deviceId: options.deviceid
    })
    console.log(options.id + "====" + options.devicename);

    var url = getApp().globalData.requestUrl;
    //获取学校
    wx.request({
      url: url + '/operUser/getAddress',
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "GET",
      success: function (res) {
        console.log(res.data)
        that.setData({
          school: res.data.operAddressList
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
  submitDeviceInfo: function(e){
    var that = this;
    var url = getApp().globalData.requestUrl;
    // that.setData({
    //   icon: base64.icon20
    // });
    // that.setData({
    //   rid: options.rid
    // })
    // var rid = options.rid;
    // console.log("dd" + options.rid);
    //var inpDeviceName = e
    //var inpValue = e.detail.value;
    console.log("ee"+inpValue);

    // wx.request({
    //   url: url + '/operUser/queryOperRepairFinById', 
    //   data: {
    //     rid: rid,
    //     maintainPerson: '15917072233'
    //   },
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded' // 默认值
    //   },
    //   method: "POST",
    //   success: function (res) {
    //     console.log(res.data)
    //     that.setData({
    //       list: res.data.finishOperRepairByIdList
    //     })
    //   }
    // })
  },
  formSubmit: function(e){
    var that = this;

    ////////////////////////////////
    //连接
    var deviceId = that.data.deviceId;
    wx.createBLEConnection({
      deviceId: deviceId,
      success: function (res) {
        console.log(res.errMsg);
        that.setData({
          connectedDeviceId: deviceId,
          msg: "已连接" + deviceId,
          msg1: "",
        })
        //////////////////////
        // 获取连接设备的service服务
        wx.getBLEDeviceServices({
          // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
          deviceId: that.data.connectedDeviceId,
          success: function (res) {
            console.log('device services:', JSON.stringify(res.services));
            that.setData({
              services: res.services,
              msg: JSON.stringify(res.services),
            })
            ///////////////////////////////
            //获取连接设备的所有特征值  for循环获取不到值
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
                ///////////////////////////////
                //启用低功耗蓝牙设备特征值变化时的 notify 功能  获得服务特征值后启动监听
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
                    ///////////////////////////////////
                    //写费率，只写一次
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
                      console.log("回调"+hex);
                      that.setData({
                        jieshou: hex,
                      })
                      //a8011081371561fa0000061000000002033e01c4
                      console.log(hex.substr(6, 10) + "==" + hex.substr(16, 6) + "==" + hex.substr(22, 10));

                    })
                    ///////////////////////////////////
                  },
                  fail: function () {
                    console.log('shibai');
                    console.log(that.data.notifyServicweId);
                    console.log(that.data.notifyCharacteristicsId);
                  },
                })
                ///////////////////////////////

              },
              fail: function () {
                console.log("fail");
              },
              complete: function () {
                console.log("complete");
              }
            })
            ///////////////////////////////
          }
        })

        /////////////////////

      },
      fail: function () {
        console.log("调用失败");
      },
      complete: function () {
        console.log("调用结束");
      }

    })
    console.log(that.data.connectedDeviceId);
    ////////////////////////////////
  //   var url = getApp().globalData.requestUrl; 
  //   //id为1代表为添加热水澡
  //   var deviceType = that.data.deviceType;
  //   var operDevice = e.detail.value;
  //   // if(operDevice.deviceName=='' || operDevice.deviceName == null || operDevice.deviceName.length == 0){
  //   //   wx.showToast({
  //   //     title: '设备号不能为空',
  //   //     icon: 'loading',
  //   //     duration: 1000
  //   //   })
  //   //   return;
  //   // }
  //   // if (operDevice.school == '' || operDevice.school == null || operDevice.school.length == 0) {
  //   //   wx.showToast({
  //   //     title: '学校不能为空',
  //   //     icon: 'loading',
  //   //     duration: 1000
  //   //   })
  //   //   return;
  //   // }
  //   // if (operDevice.address == '' || operDevice.address == null || operDevice.address.length == 0) {
  //   //   wx.showToast({
  //   //     title: '设备地址不能为空',
  //   //     icon: 'loading',
  //   //     duration: 1000
  //   //   })
  //   //   return;
  //   // }
  //   // if (operDevice.building == '' || operDevice.building == null || operDevice.building.length == 0) {
  //   //   wx.showToast({
  //   //     title: '楼栋号不能为空',
  //   //     icon: 'loading',
  //   //     duration: 1000
  //   //   })
  //   //   return;
  //   // }
  //   // if (operDevice.floor == '' || operDevice.floor == null || operDevice.floor.length == 0) {
  //   //   wx.showToast({
  //   //     title: '楼层号不能为空',
  //   //     icon: 'loading',
  //   //     duration: 1000
  //   //   })
  //   //   return;
  //   // }
  //   // if (operDevice.dormitory == '' || operDevice.dormitory == null || operDevice.dormitory.length == 0) {
  //   //   wx.showToast({
  //   //     title: '宿舍号不能为空',
  //   //     icon: 'loading',
  //   //     duration: 1000
  //   //   })
  //   //   return;
  //   // }
  //   // if (operDevice.rate == '' || operDevice.rate == null || operDevice.rate.length == 0) {
  //   //   wx.showToast({
  //   //     title: '费率不能为空',
  //   //     icon: 'loading',
  //   //     duration: 1000
  //   //   })
  //   //   return;
  //   // }
  //   // if (operDevice.closeTime == '' || operDevice.closeTime == null || operDevice.closeTime.length == 0) {
  //   //   wx.showToast({
  //   //     title: '自动关阀时间不能为空',
  //   //     icon: 'loading',
  //   //     duration: 1000
  //   //   })
  //   //   return;
  //   // }

  //   operDevice["deviceType"] = deviceType;
  //   operDevice["supplier"] = "深圳市乾元通科技有限公司";
  //  // console.log(JSON.stringify(operDevice));
  //   wx.request({
  //     url: url + '/operUser/addDevice',
  //     data: JSON.stringify(operDevice),
  //     header: {
  //       'content-type': 'application/json' // 默认值
  //     },
  //     method: "POST",
  //     success: function (res) {
  //       //console.log(res.data)
  //       var result = res.data.success;        
  //       if (result != true) {
  //         toaseText = "设备添加失败" + res.data.errMsg;
  //         wx.showToast({
  //           title: toaseText,
  //           icon: '',
  //           duration: 2000
  //         });
  //         return;
  //       }
  //       var toaseText = "设备添加成功！";
  //       wx.showToast({
  //         title: toaseText,
  //         icon: '',
  //         duration: 2000
  //       });
  //       wx.redirectTo({
  //         url: '../deviceManage/deviceManage',
  //       })

  //     }
  //   })
  },

  /**
 * 监听普通picker选择器
 */
  listenerPickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    this.setData({
      index: e.detail.value
    });
  },

  /**
   * 监听时间picker选择器
   */
  listenerTimePickerSelected: function (e) {
    //调用setData()重新绘制
    this.setData({
      time: e.detail.value,
    });
  },

  /**
   * 监听日期picker选择器
   */
  listenerDatePickerSelected: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  //监听学校选择器
  listenerPickerSchool: function(e){
    this.setData({
      index: e.detail.value
    })
  },


  //返回到选择蓝牙设备页面
  backToSelectBluetooth: function(e){
    wx.navigateBack({
      delta: -1
    });
  }

})