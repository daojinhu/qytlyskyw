var app = getApp();
Page({
  data: {
    account: '',
    password: ''
  },

  onLoad: function(options) {
    //获取缓存的信息
    var usernames = wx.getStorageSync("account");
    var passwords = wx.getStorageSync("password");

    //判断用户名是否为null,如果为null,默认显示'请输入用户名'
    if (usernames == null) {
      usernames = '请输入用户名'
    }
    //判断密码是否为null,如果为null,默认显示'请输入密码'
    if (passwords == null) {
      passwords = '请输入密码'
    }
    this.setData({
      account: usernames,
      password: passwords
    })
    //调用btnLoginClick方法,因为此方法中就是验证用户信息正确和        //       实现登录的代码
    this.login();
  },

  // 获取输入账号 
  phoneInput: function(e) {
    this.setData({
      account: e.detail.value
    })
  },

  // 获取输入密码 
  passwordInput: function(e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 登录 
  login: function() {
    var phone = this.data.account;
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

    var url = getApp().globalData.requestUrl;
    wx.request({
      url: url + '/operUser/login',
      method: 'POST',
      data: {
        username: phone,
        password: password
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        var result = res.data.operUserInfoList;
        if (result == null || result == '') {
          wx.showToast({
            title: '不存在此用户',
            duration: 1000
          })
          return;
        }
        //信息正确弹出检测账户的提示框
        wx.showLoading({
          title: '检测中',
          duration: 1000
        })
        //信息正确,给userInfo赋值
        app.globalData.userInfo = {
          phone: phone,
          password: password
        }
        //将用户名和密码缓存下来,留着实现不用重复登录  
        wx.setStorageSync("account", phone)
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
    })
  }
})