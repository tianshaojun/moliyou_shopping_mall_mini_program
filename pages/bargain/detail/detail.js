var t = getApp(), i = t.requirejs("core"), e = (t.requirejs("jquery"), t.requirejs("foxui"), 
t.requirejs("wxParse/wxParse"));

Page({
    data: {
        id: "",
        layer: !1,
        goods: {},
        istimeTitle: "",
        timer: 0,
        upper_limit: !1,
        upper_limitTitle: "",
        act_swi: "",
        error_hint: !1,
        error_hint_title: "",
      picdata:[],
    },
    onLoad: function(a) {
        var r = this;
        console.log(a), wx.getSystemInfo({
            success: function(t) {
                console.log(t), r.setData({
                    advWidth: t.windowWidth
                });
            }
        }), t.getCache("isIpx") ? r.setData({
            isIpx: !0,
            iphonexnavbar: "fui-iphonex-navbar"
        }) : r.setData({
            isIpx: !1,
            iphonexnavbar: ""
        }), i.get("bargain/get_detail", a, function(t) {
            if (console.log(t), r.setData({
                goods: t.list
            }), r.setData({
                id: t.list.id,
                act_swi: t.list.act_swi
            }), e.wxParse("wxParseData", "html", t.list.content, r, "0"), r.countDown(t.list.start_time, t.list.end_time, "istime"), 
            1 == t.list.isStart) {
                clearInterval(r.data.timer);
                var i = setInterval(function() {
                    r.countDown(t.list.start_time, t.list.end_time, "istime");
                }, 1e3);
                r.setData({
                    timer: i
                });
            }
        }), wx.setNavigationBarTitle({
            title: "砍价商品详情"
        });
    },
  // 图片放大预览
  imgYu: function (e) {
    var that = this
    that.setData({
       picdata:e.currentTarget.dataset.list
    })
    var src = e.currentTarget.dataset.src;      //获取data-src
    var imgArr = [];
    var objkeys = Object.keys(that.data.picdata);
   for (var i = 1; i <= objkeys.length; i++) {
     imgArr.push(that.data.picdata[i]);
     }
   
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgArr // 需要预览的图片http链接列表
    })
  },
    cutPrice: function() {
        this.setData({
            layer: !0
        });
    },
    closeLayer: function() {
        this.setData({
            layer: !1
        });
    },
    countDown: function(t, i, e) {
        var a = parseInt(Date.now() / 1e3), r = (t > a ? t : i) - a, s = parseInt(r), n = Math.floor(s / 86400), o = Math.floor((s - 24 * n * 60 * 60) / 3600), l = Math.floor((s - 24 * n * 60 * 60 - 3600 * o) / 60), c = [ n, o, l, Math.floor(s - 24 * n * 60 * 60 - 3600 * o - 60 * l) ];
        if (this.setData({
            time: c
        }), "istime") {
            var u = "";
            t > a ? (u = "未开始", this.setData({
                istime: 0
            })) : t <= a && i > a ? (u = "剩余时间", this.setData({
                istime: 1
            })) : (u = "活动已经结束，下次早点来~", this.setData({
                istime: 2
            })), this.setData({
                istimeTitle: u
            });
        }
    },
    backhome: function() {
        wx.switchTab({
            url: "/pages/index/index"
        });
    },
    goJoin: function() {
        var t = this, e = t.data.id;
        i.get("bargain/join", {
            id: e
        }, function(i) {
            if (1 != i.error) {
                if (0 == i.error) {
                    if (1 == i.initiate) return void t.setData({
                        upper_limit: !0,
                        upper_limitTitle: "您已经发起过一次本商品的砍价活动,是否立即查看？",
                        act_swi: i.bargainid
                    });
                    wx.navigateTo({
                        url: "/pages/bargain/bargain/bargain?id=" + i.id + "&mid=" + i.mid
                    });
                }
            } else t.setData({
                error_hint: !0,
                error_hint_title: i.message
            });
        });
    },
    alreadyHave: function() {
        this.setData({
            upper_limit: !0,
            upper_limitTitle: "您已经发起过一次本商品的砍价活动,是否立即查看？"
        });
    },
    closeUpper: function() {
        this.setData({
            upper_limit: !1
        });
    },
    affirmUpper: function() {
        var t = this.data.act_swi;
        wx.navigateTo({
            url: "/pages/bargain/bargain/bargain?id=" + t
        });
    },
    closeError: function() {
        this.setData({
            error_hint: !1
        });
    },
});