var a = getApp(), e = a.requirejs("core"), t = a.requirejs("jquery");

a.requirejs("foxui");

Page({
    data: {
        options: [],
        data: {},
        api: 0,
        message: "",
        real_name: "",
        mobile: "",
        deduct: !1
    },
    onLoad: function(t) {
        var d = this;
        this.setData({
            options: t
        }), console.log(t), a.getCache("isIpx") ? d.setData({
            isIpx: !0,
            iphonexnavbar: "fui-iphonex-navbar"
        }) : d.setData({
            isIpx: !1,
            iphonexnavbar: ""
        }), e.get("groups/order/create_order", {
            id: d.data.options.id,
            group_option_id: d.data.options.option_id,
            ladder_id: d.data.options.ladder_id,
            type: d.data.options.type,
            heads: d.data.options.heads,
            teamid: d.data.options.teamid
        }, function(a) {
            if (1 == a.error) return e.alert(a.message), void e.confirm(a.message, function() {
                wx.navigateBack();
            }, function() {
                wx.navigateBack();
            });
            console.log(a.data.stores), d.setData({
                data: a.data,
                sysset: a.sysset
            }), a.data.address && d.setData({
                aid: a.data.address.id
            });
        });
    },
    submit: function() {
        var a = this;
        console.log(a.data.deduct), e.post("groups/order/create_order", {
            id: a.data.options.id,
            group_option_id: a.data.options.option_id,
            ladder_id: a.data.options.ladder_id,
            type: a.data.options.type,
            heads: a.data.options.heads,
            teamid: a.data.options.teamid,
            aid: a.data.aid,
            mesage: a.data.message,
            realname: a.data.real_name,
            mobile: a.data.mobile,
            deduct: a.data.deduct
        }, function(a) {
            1 != a.error ? wx.navigateTo({
                url: "/pages/groups/pay/index?id=" + a.orderid + "&teamid=" + a.teamid
            }) : e.alert(a.message);
        });
    },
    onReady: function() {},
    onShow: function() {
        var e = a.getCache("orderAddress");
        a.getCache("orderShop");
        e && this.setData({
            "data.address": e,
            aid: e.id
        });
    },
    toggle: function(a) {
        var t = e.pdata(a), d = t.id, i = t.type, o = {};
        o[i] = 0 == d || void 0 === d ? 1 : 0, this.setData(o);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    message: function(a) {
        this.setData({
            message: a.detail.value
        });
    },
    realname: function(a) {
        this.setData({
            real_name: a.detail.value
        });
    },
    mobile: function(a) {
        this.setData({
            mobile: a.detail.value
        });
    },
    dataChange: function(a) {
        var e = this.data.data;
        a.target.id;
        e.deduct = a.detail.value;
        var d = parseFloat(e.price);
        d += e.deduct ? -parseFloat(e.credit.deductprice) : parseFloat(e.credit.deductprice), 
       e.price = d, e.price = e.price.toFixed(2), this.setData({
            data: e,
            deduct: a.detail.value
        });
    }
});