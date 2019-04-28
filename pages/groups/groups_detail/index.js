var t = getApp(), a = t.requirejs("core"), o = (t.requirejs("jquery"), t.requirejs("foxui"), 
0);

Page({
    data: {
        showtab: "groups",
        count_down: !0,
        time: "",
        share: 1,
        options: "",
        show: !1
    },
    onLoad: function(a) {
        var o = this;
        t.getCache("isIpx") ? o.setData({
            isIpx: !0,
            iphonexnavbar: "fui-iphonex-navbar"
        }) : o.setData({
            isIpx: !1,
            iphonexnavbar: ""
        }), this.setData({
            teamid: a.teamid
        }), this.get_details(a.teamid);
    },
    get_details: function(t) {
        var o = this;
        a.get("groups/team/details", {
            teamid: t
        }, function(t) {
            if (0 == t.error && (t.data.goods.content = t.data.goods.content.replace("data-lazy", "src"), 
            o.setData({
                data: t.data,
                content: t.data.goods.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto;vertical-align: middle" ')
            })), 0 == t.data.tuan_first_order.success) {
                if (t.data.lasttime2 <= 0) return void o.setData({
                    count_down: !1
                });
                if (clearInterval(o.data.timer), 0 == t.data.tuan_first_order.success) var a = setInterval(function() {
                    o.countDown(t.data.tuan_first_order.createtime, t.data.tuan_first_order.endtime);
                }, 1e3);
                o.setData({
                    timer: a
                });
            }
        });
    },
    countDown: function(t, a, o) {
        var e = parseInt(Date.now() / 1e3), s = (t > e ? t : a) - e, i = parseInt(s), d = Math.floor(i / 86400), n = Math.floor((i - 24 * d * 60 * 60) / 3600), r = Math.floor((i - 24 * d * 60 * 60 - 3600 * n) / 60), c = Math.floor(i - 24 * d * 60 * 60 - 3600 * n - 60 * r);
        0 == d && 0 == n && 0 == r && 0 == c && this.get_details(this.data.teamid);
        var u = [ d, n, r, c ];
        this.setData({
            time: u
        });
    },
    tuxedobuy: function(t) {
        var o = this, e = o.data.data.goods.id;
        0 == o.data.data.goods.more_spec ? o.data.data.goods.stock > 0 ? a.get("groups/order/create_order", {
            id: e,
            ladder_id: o.data.data.tuan_first_order.ladder_id,
            type: "groups",
            heads: 0,
            teamid: o.data.teamid
        }, function(t) {
            1 != t.error ? wx.navigateTo({
                url: "/pages/groups/confirm/index?id=" + e + "&heads=0&type=groups&teamid=" + o.data.teamid + "&ladder_id=" + o.data.data.tuan_first_order.ladder_id,
                success: function() {
                    o.setData({
                        layershow: !1,
                        chosenum: !1,
                        options: !1
                    });
                }
            }) : a.alert(t.message);
        }) : wx.showToast({
            title: "库存不足",
            icon: "none",
            duration: 2e3
        }) : (a.get("groups.goods.get_spec", {
            id: e
        }, function(t) {
            o.setData({
                spec: t.data
            });
        }), o.setData({
            layershow: !0,
            options: !0
        }), o.setData({
            optionarr: [],
            selectSpecsarr: []
        }), o.data.data.goods.stock > 0 ? wx.navigateTo({
            url: "/pages/groups/confirm/index?id=" + goods_id + "&type=groups&teamid=" + o.data.teamid,
            success: function() {
                o.setData({
                    layershow: !1,
                    chosenum: !1,
                    options: !1
                });
            }
        }) : wx.showToast({
            title: "库存不足",
            icon: "none",
            duration: 2e3
        }), o.setData({
            layershow: !0,
            options: !0
        }));
    },
    close: function() {
        this.setData({
            layershow: !1,
            options: !1
        });
    },
    specsTap: function(t) {
        o++;
        var e = this, s = e.data.spec, i = a.pdata(t).spedid, d = a.pdata(t).id, n = a.pdata(t).specindex;
        a.pdata(t).idx;
        s[n].item.forEach(function(t, a) {
            t.id == d ? s[n].item[a].status = "active" : s[n].item[a].status = "";
        }), e.setData({
            spec: s
        });
        var r = e.data.optionarr, c = e.data.selectSpecsarr;
        1 == o ? (r.push(d), c.push(i)) : c.indexOf(i) > -1 ? r.splice(n, 1, d) : (r.push(d), 
        c.push(i)), e.data.optionarr = r, e.data.selectSpecsarr = c, console.log(e.data.optionarr), 
        a.post("groups.goods.get_option", {
            spec_id: e.data.optionarr,
            groups_goods_id: e.data.data.goods.id
        }, function(t) {
            e.setData({
                optiondata: t.data
            });
        });
    },
    buy: function(t) {
        var o = this, e = (a.pdata(t).op, o.data.data.goods.id), s = o.data.optiondata;
        o.data.optiondata ? s.stock > 0 ? wx.navigateTo({
            url: "/pages/groups/confirm/index?id=" + e + "&type=groups&option_id=" + s.id + " &teamid=" + o.data.teamid,
            success: function() {
                o.setData({
                    layershow: !1,
                    chosenum: !1,
                    options: !1
                });
            }
        }) : wx.showToast({
            title: "库存不足",
            icon: "none",
            duration: 2e3
        }) : wx.showToast({
            title: "请选择规格",
            icon: "none",
            duration: 2e3
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function(t) {
        var a = this;
        return {
            title: a.data.data.shopshare.title,
            path: "/pages/groups/groups_detail/index?teamid=" + a.data.data.tuan_first_order.teamid,
            imageUrl: a.data.data.shopshare.imgUrl
        };
    },
    goodsTab: function(t) {
        this.setData({
            showtab: t.target.dataset.tap
        });
    }
});