var a = getApp(), t = a.requirejs("core"), o = (a.requirejs("jquery"), a.requirejs("foxui"), 
0);

Page({
    data: {
        goods_id: 0
    },
    onLoad: function(o) {
        var e = this;
        console.log(o), a.getCache("isIpx") ? e.setData({
            isIpx: !0,
            iphonexnavbar: "fui-iphonex-navbar"
        }) : e.setData({
            isIpx: !1,
            iphonexnavbar: ""
        });
        var s = o.id;
        this.setData({
            goods_id: s
        }), t.post("groups.goods", {
            id: s
        }, function(a) {
            e.setData({
                data: a.data,
                content: a.data.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto;vertical-align: middle" ')
            });
        });
    },
    singlebuy: function(a) {
        var o = this;
        t.post("groups/goods/goodsCheck", {
            id: o.data.goods_id,
            type: "single"
        }, function(a) {
            if (1 != a.error) if (0 == o.data.data.more_spec) wx.navigateTo({
                url: "/pages/groups/confirm/index?id=" + o.data.goods_id + "&type=single"
            }); else {
                o.setData({
                    layershow: !0,
                    options: !0
                }), o.setData({
                    optionarr: [],
                    selectSpecsarr: []
                });
                var e = o.data.data.id;
                t.get("groups.goods.get_spec", {
                    id: e
                }, function(a) {
                    console.log(a), o.setData({
                        spec: a.data
                    });
                }), o.setData({
                    layershow: !0,
                    options: !0
                });
            } else t.alert(a.message);
        });
    },
    close: function() {
        this.setData({
            layershow: !1,
            options: !1
        });
    },
    specsTap: function(a) {
        o++;
        var e = this, s = e.data.spec, i = t.pdata(a).spedid, n = t.pdata(a).id, d = t.pdata(a).specindex;
        t.pdata(a).idx;
        s[d].item.forEach(function(a, t) {
            a.id == n ? s[d].item[t].status = "active" : s[d].item[t].status = "";
        }), e.setData({
            spec: s
        });
        var p = e.data.optionarr, r = e.data.selectSpecsarr;
        1 == o ? (p.push(n), r.push(i)) : r.indexOf(i) > -1 ? p.splice(d, 1, n) : (p.push(n), 
        r.push(i)), e.data.optionarr = p, e.data.selectSpecsarr = r, console.log(e.data.optionarr), 
        t.post("groups.goods.get_option", {
            spec_id: e.data.optionarr,
            groups_goods_id: e.data.goods_id
        }, function(a) {
            e.setData({
                optiondata: a.data
            });
        });
    },
    buy: function(a) {
        var o = this, e = (t.pdata(a).op, o.data.goods_id), s = o.data.optiondata;
        o.data.optiondata ? s.stock > 0 ? wx.navigateTo({
            url: "/pages/groups/confirm/index?id=" + e + "&option_id=" + s.id + " &type=single",
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
    onShareAppMessage: function() {},
    check: function() {}
});