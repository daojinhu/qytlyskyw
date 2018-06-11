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
    address:[],
    //楼栋
    building:[],
    //楼层
    floor:[],
    //宿舍
    room:[],
    //供应商
    supplier:'',
    //费率
    rate:[],
    //扣费金额
    deduction:[],
    //脉冲
    pulse:[],
    //自动关阀时间
    closeTime:['10','15','20'],
    //学校id
    schoolId: '',
    //楼栋id
    buildingId:'',
    //楼层id
    floorId:'',
    //宿舍id
    roomId:'',

    // text:"这是一个页面"
    array: ['Android', 'IOS', 'ReactNativ', 'WeChat', 'Web'],
    index: 0, //学校索引
   // indexAddress: 0,//地址索引
    indexBuilding: 0,//楼栋索引
    indexFloor: 0,//楼层索引
    indexRoom: 0,//宿舍索引
    indexRate: 0,//费率索引
    indexColseTime: 0,//自动关阀时间索引
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
    jieshou: '',
    deviceNo: '', //机器编号
    useNum: '', //使用次数

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

    //获取费率
    wx.request({
      url: url + '/operUser/queryOperRateInfo',
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "GET",
      success: function (res) {
        console.log(res.data)
        that.setData({
          rate: res.data.rateInfoList
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
    var indexRate = that.data.indexRate;
    var rate = that.data.rate;
    //扣费金额
    //var deduction = rate[indexRate].money;
    var deduction = "05";
    //脉冲
    //var pulse = rate[indexRate].pulse;
    var pulse = "21";
    //自动关阀时间
    var indexCloseTime = that.data.indexCloseTime;
    var closeTime = rate[indexCloseTime].closeTime;
    console.log(deduction + "==" + pulse + "==" + closeTime);
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
                    //从服务器获取连接字符串
                    var url = getApp().globalData.requestUrl;
                    wx.request({
                      url: url + '/operUser/connectCalculate', 
                      data: {
                        deduction: deduction,
                        pulse: pulse,
                        delay: closeTime
                      },
                      header: {
                        'content-type': 'application/x-www-form-urlencoded' // 默认值
                      },
                      method: "POST",
                      success: function (res) {
                        console.log(res.data);
                        ///////////////////////////////
                        //写费率，只写一次
                        var hex = res.data.connCalString;
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
                          console.log("回调" + hex);
                          that.setData({
                            jieshou: hex,
                            //机器编号
                            deviceNo: hex.substr(6, 10),
                            //使用次数
                            useNum: hex.substr(16, 6)
                          })
                          //a8011081371561fa0000061000000002033e01c4
                          console.log(hex.substr(6, 10) + "==" + hex.substr(16, 6) + "==" + hex.substr(22, 10));
                          /////////////////////////////////
                          var indexRate = that.data.indexRate;
                          var selectRate = rate[indexRate].rate;
                          var url = getApp().globalData.requestUrl;
                          //id为1代表为添加热水澡
                          var deviceType = that.data.deviceType;
                          var operDevice = e.detail.value;

                          var roomIndex = that.data.indexRoom;
                          var newroom = that.data.room;
                          var roomid = newroom[roomIndex].roomId;

                          operDevice["deviceName"] = that.data.deviceName;
                          operDevice["deviceId"] = that.data.deviceId;
                          operDevice["deviceNo"] = hex.substr(6, 10);
                          operDevice["useNum"] = hex.substr(16, 6);
                          operDevice["deviceType"] = deviceType;
                          operDevice["school"] = that.data.schoolId;
                          operDevice["building"] = that.data.buildingId;
                          operDevice["floor"] = that.data.floorId;
                          operDevice["dormitory"] = roomid;
                          operDevice["supplier"] = "深圳市乾元通科技有限公司";
                          operDevice["rate"] = selectRate;
                          operDevice["closeTime"] = closeTime;
                          // console.log(JSON.stringify(operDevice));
                          wx.request({
                            url: url + '/operUser/addDevice',
                            data: JSON.stringify(operDevice),
                            header: {
                              'content-type': 'application/json' // 默认值
                            },
                            method: "POST",
                            success: function (res) {
                              //console.log(res.data)
                              var result = res.data.success;
                              if (result != true) {
                                toaseText = "设备添加失败" + res.data.errMsg;
                                wx.showToast({
                                  title: toaseText,
                                  icon: '',
                                  duration: 2000
                                });
                                return;
                              }
                              var toaseText = "设备添加成功！";
                              wx.showToast({
                                title: toaseText,
                                icon: '',
                                duration: 2000
                              });
                              wx.redirectTo({
                                url: '../deviceManage/deviceManage',
                              })

                            }
                          })
                          ///////////////////////////////

                        })
                    ///////////////////////////////////
                      }
                    })
                    
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

  },


  //监听学校选择器
  listenerPickerSchool: function(e){
    this.setData({
      index: e.detail.value
    })
  },
  //监听楼栋号选择器
  listenerPickerBuilding: function (e) {
    this.setData({
      indexBuilding: e.detail.value
    })
  },
  //监听楼层号选择器
  listenerPickerFloor: function (e) {
    this.setData({
      indexFloor: e.detail.value
    })
  },
  //监听宿舍号选择器
  listenerPickerRoom: function (e) {
    this.setData({
      indexRoom: e.detail.value
    })
  },
  //监听费率选择器
  listenerPickerRate: function (e) {
    var that = this;
    that.setData({
      indexRate: e.detail.value
    })
  },
  //监听自动关阀时间选择器
  listenerPickerColseTime: function (e) {
    this.setData({
      indexCloseTime: e.detail.value
    })
  },

  //加载楼栋号
  loadBuilding: function(){
    var that = this;
    var index = that.data.index;
    var xx = that.data.school;
    console.log("学校"+xx[index].deptId);
    that.setData({
      schoolId: xx[index].deptId
    })
    if(index == '' || index == null){
      wx.showToast({
        title: '请选择学校号',
        icon: 'loading',
        duration: 1000
      })
      return;
    }
    var url = getApp().globalData.requestUrl;
    //获取楼栋
    wx.request({
      url: url + '/operUser/queryOperBuildingById',
      data: {
        deptId: xx[index].deptId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        console.log(res.data)
        that.setData({
          building: res.data.queryOperBuildingByIdList
        })
      }
    })
  },
  //加载楼层号
  loadFloor: function(){
    var that = this;
    var indexBuilding = that.data.indexBuilding;
    var xx = that.data.building;
    console.log("学校" + xx[indexBuilding].buildingId);
    that.setData({
      buildingId: xx[indexBuilding].buildingId
    })
    if (indexBuilding == '' || indexBuilding == null) {
      wx.showToast({
        title: '请选择楼栋号',
        icon: 'loading',
        duration: 1000
      })
      return;
    }
    var url = getApp().globalData.requestUrl;
    //获取楼层
    wx.request({
      url: url + '/operUser/queryOperFloorByBuildingId',
      data: {
        buildingId: xx[indexBuilding].buildingId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        console.log(res.data)
        that.setData({
          floor: res.data.queryOperFloorByBuildingIdList
        })
      }
    })
  },
  //加载房间号
  loadRoom: function(){
    var that = this;
    var indexFloor = that.data.indexFloor;
    var xx = that.data.floor;
    console.log("房间" + xx[indexFloor].floorId);
    that.setData({
      floorId: xx[indexFloor].floorId
    })
    if (indexFloor == '' || indexFloor == null) {
      wx.showToast({
        title: '请选择楼层号',
        icon: 'loading',
        duration: 1000
      })
      return;
    }
    var url = getApp().globalData.requestUrl;
    //获取楼层
    wx.request({
      url: url + '/operUser/queryOperRoomByFloorId',
      data: {
        floorId: xx[indexFloor].floorId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        console.log(res.data)
        that.setData({
          room: res.data.queryOperRoomByFloorId,
        })
      }
    })
  },
  


  //返回到选择蓝牙设备页面
  backToSelectBluetooth: function(e){
    wx.navigateBack({
      delta: -1
    });
  }

})