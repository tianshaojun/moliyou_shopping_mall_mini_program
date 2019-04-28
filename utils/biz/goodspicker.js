var t = getApp(), a = (t.requirejs("jquery"), t.requirejs("core")), o = t.requirejs("foxui"), e = t.requirejs("biz/diyform");

module.exports = {
    number: function(t, e) {
        var d = a.pdata(t), i = o.number(e, t), s = (d.id, d.optionid, d.min);
        d.max;
        1 == i && 1 == d.value && "minus" == t.target.dataset.action || i < s && "minus" == t.target.dataset.action ? o.toast(e, "单次最少购买" + d.value + "件") : d.value == d.max && "plus" == t.target.dataset.action || (parseInt(e.data.stock) < parseInt(i) ? o.toast(e, "库存不足") : e.setData({
            total: i
        }));
    },
    inputNumber: function(t, a) {
        var e = a.data.goods.maxbuy, d = a.data.goods.minbuy, i = t.detail.value;
        if (i > 0) {
            if (e > 0 && e <= parseInt(t.detail.value) && (i = e, o.toast(a, "单次最多购买" + e + "件")), 
            d > 0 && d > parseInt(t.detail.value) && (i = d, o.toast(a, "单次最少购买" + d + "件")), 
            parseInt(a.data.stock) < parseInt(i)) return void o.toast(a, "库存不足");
        } else i = d > 0 ? d : 1;
        a.setData({
            total: i
        });
    },
    buyNow: function(t, d, i) {
        var s = d.data.optionid, r = d.data.goods.hasoption, n = d.data.diyform, l = d.data.giftid;
        if (9 == d.data.goods.type) var c = d.data.checkedDate / 1e3;
        if (r > 0 && !s) o.toast(d, "请选择规格"); else if (n && n.fields.length > 0) {
            if (!e.verify(d, n)) return;
            console.log(n.f_data), a.post("order/create/diyform", {
                id: d.data.id,
                diyformdata: n.f_data
            }, function(t) {
                0 == d.data.goods.isgift || "goods_detail" != i ? wx.redirectTo({
                    url: "/pages/order/create/index?id=" + d.data.id + "&total=" + d.data.total + "&optionid=" + s + "&gdid=" + t.gdid + "&selectDate=" + c
                }) : "" != l || 1 == d.data.goods.gifts.length ? (1 == d.data.goods.gifts.length && (l = d.data.goods.gifts[0].id), 
                wx.redirectTo({
                    url: "/pages/order/create/index?id=" + d.data.id + "&total=" + d.data.total + "&optionid=" + s + "&gdid=" + t.gdid + "&giftid=" + l
                })) : o.toast(d, "请选择赠品");
            });
        } else 0 == d.data.goods.isgift || "goods_detail" != i ? wx.navigateTo({
            url: "/pages/order/create/index?id=" + d.data.id + "&total=" + d.data.total + "&optionid=" + s + "&selectDate=" + c
        }) : "" != l || 1 == d.data.goods.gifts.length ? (1 == d.data.goods.gifts.length && (l = d.data.goods.gifts[0].id), 
        wx.navigateTo({
            url: "/pages/order/create/index?id=" + d.data.id + "&total=" + d.data.total + "&optionid=" + s + "&giftid=" + l
        })) : o.toast(d, "请选择赠品");
    },
    getCart: function(t, d) {
        var i = d.data.optionid;
        console.log(d.data.goods.hasoption);
        var s = d.data.goods.hasoption, r = d.data.diyform;
        if (s > 0 && !i) o.toast(d, "请选择规格"); else if (d.data.quickbuy) {
            if (console.log("quickbuy"), r && r.fields.length > 0) {
                if (!(n = e.verify(d, r))) return;
                d.setData({
                    formdataval: {
                        diyformdata: r.f_data
                    }
                }), console.log(d.data.formdataval);
            }
            d.addCartquick(i, d.data.total);
        } else if (r && r.fields.length > 0) {
            var n = e.verify(d, r);
            if (!n) return;
            a.post("order/create/diyform", {
                id: d.data.id,
                diyformdata: r.f_data
            }, function(t) {
                console.log(d.data), a.post("member/cart/add", {
                    id: d.data.id,
                    total: d.data.total,
                    optionid: i,
                    diyformdata: r.f_data
                }, function(t) {
                    0 == t.error ? (d.setData({
                      "goods.cartcount": t.cartcount,
                        active: "",
                        slider: "out",
                        isSelected: !0,
                        tempname: ""
                    }), o.toast(d, "添加成功")) : o.toast(d, t.message);
                });
            });
        } else a.post("member/cart/add", {
            id: d.data.id,
            total: d.data.total,
            optionid: i
        }, function(t) {
            if (0 == t.error) {
                o.toast(d, "添加成功");
                var a = d.data.goods;
                d.setData({
                  "goods.cartcount": t.cartcount,
                    active: "",
                    slider: "out",
                    isSelected: !0,
                    tempname: "",
                    goods: a
                });
            } else o.toast(d, t.message);
        });
    },
    selectpicker: function(t, o, e, d) {
        o.setData({
            optionid: "",
            specsData: ""
        });
        var i = o.data.active, s = t.currentTarget.dataset.id;
        "" == i && o.setData({
            slider: "in",
            show: !0
        }), a.get("goods/get_picker", {
            id: s
        }, function(a) {
            console.log(a);
            var i = a.options;
            if ("goodsdetail" == e) if (o.setData({
                pickerOption: a,
                canbuy: o.data.goods.canbuy,
                buyType: t.currentTarget.dataset.buytype,
                options: i,
                minpicker: e
            }), 0 != a.goods.minbuy && o.data.total < a.goods.minbuy) r = a.goods.minbuy; else r = o.data.total; else if (o.setData({
                pickerOption: a,
                goods: a.goods,
                options: i,
                minpicker: e
            }), o.setData({
                optionid: !1,
                specsData: [],
                specs: []
            }), console.log(o.data.specsData), 0 != a.goods.minbuy && o.data.total < a.goods.minbuy) r = a.goods.minbuy; else var r = 1;
            a.diyform && o.setData({
                diyform: {
                    fields: a.diyform.fields,
                    f_data: a.diyform.lastdata
                }
            }), o.setData({
                id: s,
                pagepicker: e,
                total: r,
                tempname: "select-picker",
                active: "active",
                show: !0,
                modeltakeout: d
            });
        });
    },
    specsTap: function(t, a) {
        var e = a.data.specs;
        e[t.target.dataset.idx] = {
            id: t.target.dataset.id,
            title: t.target.dataset.title
        };
        var d = "", i = "", s = [];
        e.forEach(function(t) {
            d += t.title + ";", s.push(t.id);
        });
        var r = s.sort();
        i = r.join("_");
        var n = a.data.options;
        "" != t.target.dataset.thumb && a.setData({
            "goods.thumb": t.target.dataset.thumb
        }), n.forEach(function(t) {
            t.specs == i && (a.setData({
                optionid: t.id,
                "goods.total": t.stock,
                "goods.maxprice": t.marketprice,
                "goods.minprice": t.marketprice,
                "goods.marketprice": t.marketprice,
                "goods.seecommission": t.seecommission,
                "goods.presellprice": a.data.goods.ispresell > 0 ? t.presellprice : a.data.goods.presellprice,
                optionCommission: !0
            }), t.stock < a.data.total ? (a.setData({
                canBuy: "库存不足",
                stock: t.stock
            }), o.toast(a, "库存不足")) : a.setData({
                canBuy: "",
                stock: t.stock
            }));
        }), console.log(e), a.setData({
            specsData: e,
            specsTitle: d
        });
    }
};