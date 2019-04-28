const app = getApp();
Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
    },

    onLoad: function (a) {
        var that = this
        wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    wx.reLaunch({
                        url: "/pages/index/index"
                    })
                }
            }
        })
    },
    onShow: function () {

    },

    bindGetUserInfo: function (e) {
        var that = this
        console.log("点击", e)
        if (e.detail.errMsg == "getUserInfo:ok") {
            that.reload()
        }
    },
    reload: function () {
        wx.getUserInfo({
            success: function (res) {
                app.getUserInfo()
                wx.reLaunch({
                    url: "/pages/index/index"
                })
            }
        })

    },
})