var e = require("utils/core.js");

App({
  onShow: function() {
    this.onLaunch();
  },
  onLaunch: function() {
    var that = this;
    let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
    if (extConfig) {
      that.globalData.appid = extConfig.appid;
      that.globalData.api = extConfig.api;
      that.globalData.approot = extConfig.approot;
    }
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function(res) {
        console.log(res)
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function() {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function(res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function() {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
    var e = this;
    wx.getSystemInfo({
      success: function(t) {
        "0" == t.model.indexOf("iPhone X") ? e.setCache("isIpx", t.model) : e.setCache("isIpx", "");
      }
    });
    var t = this;
    wx.getSystemInfo({
      success: function(e) {
        wx.setStorageSync("systemInfo", e);
        var i = e.windowWidth,
          n = e.windowHeight;
        t.globalData.ww = i, t.globalData.hh = n;
      }
    }), this.getConfig();
    // this.getUserInfo(function(e) {}, function(e, t) {
    //   var t = t ? 1 : 0,
    //     e = e || "";
    //   t && wx.redirectTo({
    //     url: "/pages/message/auth/index?close=" + t + "&text=" + e
    //   });
    // });
  },
  requirejs: function(e) {
    return require("utils/" + e + ".js");
  },
  getConfig: function() {
    if (null !== this.globalData.api) return {
      api: this.globalData.api,
      approot: this.globalData.approot,
      appid: this.globalData.appid
    };
    var e = wx.getExtConfigSync();
    return console.log(e), this.globalData.api = e.config.api, this.globalData.approot = e.config.approot,
      this.globalData.appid = e.config.appid, e.config;
  },
  getCache: function(e, t) {
    var i = +new Date() / 1e3,
      n = "";
    i = parseInt(i);
    try {
      (n = wx.getStorageSync(e + this.globalData.appid)).expire > i || 0 == n.expire ? n = n.value : (n = "",
        this.removeCache(e));
    } catch (e) {
      n = void 0 === t ? "" : t;
    }
    return n = n || "";
  },
  setCache: function(e, t, i) {
    var n = +new Date() / 1e3,
      o = !0,
      a = {
        expire: i ? n + parseInt(i) : 0,
        value: t
      };
    try {
      wx.setStorageSync(e + this.globalData.appid, a);
    } catch (e) {
      o = !1;
    }
    return o;
  },
  removeCache: function(e) {
    var t = !0;
    try {
      wx.removeStorageSync(e + this.globalData.appid);
    } catch (e) {
      t = !1;
    }
    return t;
  },

  getUserInfo: function(t, i) {
    var n = this,
      o = {};
    !(o = n.getCache("userinfo")) || o.needauth ? wx.login({
      success: function(a) {
        a.code ? e.post("wxapp/login", {
          code: a.code

        }, function(a) {
          a.error ? e.alert("获取用户登录态失败:" + a.message) : a.isclose && i && "function" == typeof i ? i(a.closetext, !0) : wx.getUserInfo({
            success: function(i) {
              o = i.userInfo, e.get("wxapp/auth", {
                data: i.encryptedData,
                iv: i.iv,
                sessionKey: a.session_key,
                fid: wx.getStorageSync("fid")
              }, function(e) {
                i.userInfo.openid = e.openId, i.userInfo.id = e.id, i.userInfo.uniacid = e.uniacid,
                  i.needauth = 0, n.setCache("userinfo", i.userInfo, 7200), n.setCache("userinfo_openid", i.userInfo.openid),
                  n.setCache("userinfo_id", e.id), n.getSet(), t && "function" == typeof t && t(o);
              });
            },
            fail: function() {
              console.log(a), e.get("wxapp/check", {
                openid: a.openid
              }, function(e) {
                e.needauth = 1, n.setCache("userinfo", e, 7200), n.setCache("userinfo_openid", a.openid),
                  n.setCache("userinfo_id", a.id), n.getSet(), t && "function" == typeof t && t(o);
              });
            }
          });
        }) : e.alert("获取用户登录态失败:" + a.errMsg);
      },
      fail: function() {
        e.alert("获取用户信息失败!");
      }
    }) : t && "function" == typeof t && t(o);
  },

  getSet: function() {
    var t = this;
    "" == t.getCache("cacheset") && setTimeout(function() {
      var i = t.getCache("cacheset");
      e.get("cacheset", {
        version: i.version
      }, function(e) {
        e.update && t.setCache("cacheset", e.data);
      });
    }, 10);
  },
  url: function(e) {
    if (e.mid) {
      wx.setStorageSync("fid", e.mid)
    }
    e = e || {};
    var t = {},
      i = "",
      n = "",
      o = this.getCache("usermid");
    i = e.mid || "", n = e.merchid || "", "" != o ? ("" != o.mid && void 0 !== o.mid || (t.mid = i),
        "" != o.merchid && void 0 !== o.merchid || (t.merchid = n)) : (t.mid = i, t.merchid = n),
      this.setCache("usermid", t, 7200);
  },
  impower: function(e, t, i) {
    wx.getSetting({
      success: function(n) {
        console.log(n), n.authSetting["scope." + e] || wx.showModal({
          title: "用户未授权",
          content: "您点击了拒绝授权，暂时无法" + t + "，点击去设置可重新获取授权喔~",
          confirmText: "去设置",
          success: function(e) {
            e.confirm ? wx.openSetting({
              success: function(e) {}
            }) : "route" == i ? wx.switchTab({
              url: "/pages/index/index"
            }) : "details" == i || wx.navigateTo({
              url: "/pages/index/index"
            });
          }
        });
      }
    });
  },
  globalData: {
    appid: "",
    api: "",
    approot: '',
    userInfo: "",
  }
});