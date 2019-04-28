var t = getApp();
const app = getApp();
Page({
    data: {
        close: 0,
        text: "",
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
    },
    onLoad: function (t) {
        console.log(t), this.setData({
            close: t.close,
            text: t.text
        });
    },
    onShow: function () {
        var e = t.getCache("sysset").shopname;
        wx.setNavigationBarTitle({
            title: e || "提示"
        });
    },
    bindGetUserInfo: function (e) {
        var that = this
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
});