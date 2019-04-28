var a = getApp(), i = a.requirejs("core"), t = (a.requirejs("jquery"), a.requirejs("foxui"), 
a.requirejs("wxParse/wxParse"));

Page({
    data: {
        label: "/static/images/label.png",
        showtab: "family",
        bargainid: "",
        layer: !1,
        cutPrice: "",
        error_hint: !1,
        error_hint_title: "",
        list: {},
        bargain: {},
        bargain_set: {},
        istimeTitle: "剩余时间",
        bargain_record: {},
        bargain_actor: {},
        swi: "",
        trade_swi: "",
        myself_swi: "",
        mid: "",
        randomHint: {
            0: "大王，您即将触及我的价格底线，不要放弃继续砍价吧～",
            1: "主人，达到价格底线就可以带我回家啦！等你哦～",
            2: "加把劲，再砍一刀，马上就到底价了哦～",
            3: "砍到底价才能购买哦，邀请小伙伴来帮忙吧！",
            4: "叫上您的小伙伴来砍价，我们的的目标是底价买买买！"
        },
        marked_words: "",
        arrived: "",
        timeout: 0
    },
    onLoad: function(r) {
        var e = this;
        a.getCache("isIpx") ? e.setData({
            isIpx: !0,
            iphonexnavbar: "fui-iphonex-navbar"
        }) : e.setData({
            isIpx: !1,
            iphonexnavbar: ""
        }), i.get("bargain/bargain", r, function(a) {
            if (1 != a.error) {
                if (0 == a.error) {
                    1 == a.unequalMid && wx.navigateTo({
                        url: "/pages/bargain/bargain/bargain?id=" + a.id + "&mid=" + a.mid
                    }), console.log(a.bargain.id), e.setData({
                        list: a.list,
                        bargain: a.bargain,
                        bargain_set: a.bargain_set,
                        bargain_record: a.bargain_record,
                        bargain_actor: a.bargain_actor,
                        swi: a.swi,
                        trade_swi: a.trade_swi,
                        myself_swi: a.myself_swi,
                        bargainid: a.list.id,
                        mid: a.mid,
                        arrived: a.arrived,
                        timeout: a.timeout
                    }), t.wxParse("wxParseData", "html", a.bargain.content, e, "0"), "" == a.bargain.rule || void 0 == a.bargain.rule ? t.wxParse("wxParseDataRule", "html", a.bargain_set.rule, e, "0") : t.wxParse("wxParseDataRule", "html", a.bargain.rule, e, "0"), 
                    e.countDown(a.bargain.start_time, a.bargain.end_time, "istime"), clearInterval(e.data.timer);
                    var i = setInterval(function() {
                        e.countDown(a.bargain.start_time, a.bargain.end_time, "istime");
                    }, 1e3);
                    e.setData({
                        timer: i
                    });
                }
            } else e.setData({
                upper_limit: !0,
                upper_limitTitle: a.message
            });
        });
        var n = Math.floor(4 * Math.random()), s = e.data.randomHint[n];
        e.setData({
            marked_words: s
        });
    },
    goodsTab: function(a) {
        this.setData({
            showtab: a.currentTarget.dataset.tap
        });
    },
    cutPrice: function() {
        var a = this, t = a.data.bargainid, r = a.data.mid;
        i.get("bargain/bargain", {
            id: t,
            ajax: 151,
            mid: r
        }, function(i) {
            1 != i.error ? 0 == i.error && (a.setData({
                layer: !0,
                cutPrice: i.cutPrice
            }), console.log(i)) : a.setData({
                error_hint: !0,
                error_hint_title: i.message
            });
        });
    },
    closeLayer: function() {
        this.setData({
            layer: !1
        });
        var a = this.data.bargainid, i = this.data.mid;
        this.onLoad({
            id: a,
            mid: i
        });
    },
    goBackPrev: function() {
        wx.navigateBack({
            delta: 1
        });
    },
    countDown: function(a, i, t) {
        var r = parseInt(Date.now() / 1e3), e = (a > r ? a : i) - r, n = parseInt(e), s = Math.floor(n / 86400), o = Math.floor((n - 24 * s * 60 * 60) / 3600), d = Math.floor((n - 24 * s * 60 * 60 - 3600 * o) / 60), g = [ s, o, d, Math.floor(n - 24 * s * 60 * 60 - 3600 * o - 60 * d) ];
        if (this.setData({
            time: g
        }), "istime") {
            var l = "";
            a > r ? (l = "未开始", this.setData({
                istime: 0
            })) : a <= r && i > r ? (l = "剩余时间", this.setData({
                istime: 1
            })) : (l = "活动已经结束，下次早点来~", this.setData({
                istime: 2
            })), this.setData({
                istimeTitle: l
            });
        }
    },
    closeError: function() {
        this.setData({
            error_hint: !1
        });
    },
    seekHelp: function() {
        this.onShareAppMessage();
    },
    onShareAppMessage: function(a) {
        var i = this;
        return {
            title: "帮砍价",
            path: "/pages/bargain/bargain/bargain?id=" + i.data.bargainid + "&mid=" + i.data.mid,
            success: function(a) {},
            fail: function(a) {}
        };
    }
});