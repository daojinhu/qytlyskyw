var app = getApp(); 
Page({
  data: {
    phone: '',
    password: ''
  },

  onLoad: function (options) {
    //获取缓存的信息
    var usernames = wx.getStorageSync("phone")
    var passwords = wx.getStorageSync("password")

    //判断用户名是否为null,如果为null,默认显示'请输入用户名'
    if (usernames == null) {
      usernames = '请输入用户名'
    }
    //判断密码是否为null,如果为null,默认显示'请输入密码'
    if (passwords == null) {
      passwords = '请输入密码'
    }
    this.setData({
      phone: usernames,
      password: passwords
    })
    //调用btnLoginClick方法,因为此方法中就是验证用户信息正确和        //       实现登录的代码
    this.login()
  },

  // 获取输入账号 
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 登录 
  login: function () {
    var phone = this.data.phone;
    var password = this.data.password;
    if (phone.length == 0) {
      wx.showToast({
        title: '用户名不能为空',
        icon: 'loading',
        duration: 1000
      })
      return;
    }
    if (password.length == 0) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'loading',
        duration: 1000
      })
      return;
    }

    //var pass = md5(password);
    wx.request({
      url: 'http://eys6mv.natappfree.cc/QYTLYSK/cAPPLogin',
      method: 'GET',
      data:{
        username: phone,
        password: password
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res){
        //console.log(res.data);
        var result = res.data;
        if(result == 2){
          wx.showToast({
            title: '不存在此用户',
            duration: 1000
          })
          return;
        }
        if(result == 3){
          //信息正确弹出检测账户的提示框
          wx.showLoading({
            title: '检测中',
            duration: 1000
          })
          //信息正确,给userInfo赋值
          app.globalData.userInfo = { phone: phone, password: password }
          //将用户名和密码缓存下来,留着实现不用重复登录  
          wx.setStorageSync("phone", phone)
          wx.setStorageSync("password", password)
          // 这里修改成跳转的页面 
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 1000
          })
          //跳转页面,并且关闭当前页面
          wx.redirectTo({
            url: '../main/main'
          })
        }
      }
    })

    

    
  },

  //跳转到注册界面
  register: function() {
    wx.navigateTo({
      url: '../register/register',
    })
  }




})