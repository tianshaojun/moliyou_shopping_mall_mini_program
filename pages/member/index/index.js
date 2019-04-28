var e = getApp(), t = e.requirejs("core"), a = e.requirejs("wxParse/wxParse"), r = e.requirejs("biz/diypage"), i = e.requirejs("jquery");

Page({
    data: {
        route: "member",
        icons: e.requirejs("icons"),
        member: {},
        diypages: {},
        audios: {},
        audiosObj: {},
        modelShow: !1,
        autoplay: !0,
        interval: 5e3,
        duration: 500,
        swiperheight: 0,
        iscycelbuy: !1,
        bargain: !1
    },
    onLoad: function(t) {
        var a = this;
        e.url(t), wx.getSystemInfo({
            success: function(e) {
                var t = e.windowWidth / 1.7;
                a.setData({
                    windowWidth: e.windowWidth,
                    windowHeight: e.windowHeight,
                    swiperheight: t
                });
            }
        }), r.get(this, "member", function(e) {}), "" == e.getCache("userinfo") && wx.redirectTo({
            url: "/pages/message/auth/index"
        });
    },
    getInfo: function() {
        var e = this;
        t.get("member", {}, function(t) {
            console.log(t), 0 != t.error ? wx.redirectTo({
                url: "/pages/message/auth/index"
            }) : e.setData({
                member: t,
                show: !0,
                customer: t.customer,
                customercolor: t.customercolor,
                phone: t.phone,
                phonecolor: t.phonecolor,
                phonenumber: t.phonenumber,
                iscycelbuy: t.iscycelbuy,
                bargain: t.bargain
            }), a.wxParse("wxParseData", "html", t.copyright, e, "5");
        });
    },
    onShow: function() {
        this.getInfo();
        var e = this;
        wx.getSetting({
            success: function(t) {
                var a = t.authSetting["scope.userInfo"];
                e.setData({
                    limits: a
                }), a || e.setData({
                    modelShow: !0
                });
            }
        });
    },
    onShareAppMessage: function() {
        return t.onShareAppMessage();
    },

    phone: function() {
        var e = this.data.phonenumber + "";
        wx.makePhoneCall({
            phoneNumber: e
        });
    },
    play: function(e) {
        var t = e.target.dataset.id, a = this.data.audiosObj[t] || !1;
        if (!a) {
            a = wx.createInnerAudioContext("audio_" + t);
            var r = this.data.audiosObj;
            r[t] = a, this.setData({
                audiosObj: r
            });
        }
        var i = this;
        a.onPlay(function() {
            var e = setInterval(function() {
                var r = a.currentTime / a.duration * 100 + "%", s = Math.floor(Math.ceil(a.currentTime) / 60), o = (Math.ceil(a.currentTime) % 60 / 100).toFixed(2).slice(-2), n = Math.ceil(a.currentTime);
                s < 10 && (s = "0" + s);
                var u = s + ":" + o, c = i.data.audios;
                c[t].audiowidth = r, c[t].Time = e, c[t].audiotime = u, c[t].seconds = n, i.setData({
                    audios: c
                });
            }, 1e3);
        });
        var s = e.currentTarget.dataset.audio, o = e.currentTarget.dataset.time, n = e.currentTarget.dataset.pausestop, u = e.currentTarget.dataset.loopplay;
        0 == u && a.onEnded(function(e) {
            c[t].status = !1, i.setData({
                audios: c
            });
        });
        var c = i.data.audios;
        c[t] || (c[t] = {}), a.paused && 0 == o ? (a.src = s, a.play(), 1 == u && (a.loop = !0), 
        c[t].status = !0, i.pauseOther(t)) : a.paused && o > 0 ? (a.play(), 0 == n ? a.seek(o) : a.seek(0), 
        c[t].status = !0, i.pauseOther(t)) : (a.pause(), c[t].status = !1), i.setData({
            audios: c
        });
    },
    pauseOther: function(e) {
        var t = this;
        i.each(this.data.audiosObj, function(a, r) {
            if (a != e) {
                r.pause();
                var i = t.data.audios;
                i[a] && (i[a].status = !1, t.setData({
                    audios: i
                }));
            }
        });
    },
    onHide: function() {
        this.pauseOther();
    },
    onUnload: function() {
        this.pauseOther();
    },
    navigate: function(e) {
        var t = e.currentTarget.dataset.url, a = e.currentTarget.dataset.phone, r = e.currentTarget.dataset.appid, i = e.currentTarget.dataset.appurl;
        t && wx.navigateTo({
            url: t
        }), a && wx.makePhoneCall({
            phoneNumber: a
        }), r && wx.navigateToMiniProgram({
            appId: r,
            path: i
        });
    }
});