require(["pic_code", "/inc/jquery.min.js"], function($pic_code) {

    $(function() {
        var opt = {
            pic_position: ".pic_code", //图片验证码外包层class或id
            div_width: 600, //设置大图的默认宽
            valid_range: 10, // 图片验证正确的容错范围，默认是5,单位是px，不受unit影响
            unit: "px", // 宽高及容错范围单位 "px|vw", 默认px，且IE6/7/8强制使用px
            pic_mask: true, //验证码大遮罩层，false-不显示遮罩层，true-显示遮罩层
            Pic_mask_color: "#000", //验证码大遮罩层颜色
            Pic_mask_opacity: 0.8, ////验证码大遮罩层透明度
            Pic_click_key: true, //开关，点击遮罩层验证码是否隐藏，true-隐藏，false-不隐藏
            Is_Cross_domain: false, //是否跨域 true-跨域（后端需配置跨域允许当前来源），false-不跨域
            Url_getPic: '/Pic_code/create', //获取图片地址的接口，跨域请填写带域名的地址
            url_submit: '/Pic_code/valid', //验证码，验证完成提交的地址，跨域请填写带域名的地址
            url_submit_para_extend: function() {
                return {
                    handlerUrl: "http://192.168.1.229:8005/Handler/Handler.ashx",
                    // handlerUrl: "no",
                    handlerType: "abc",
                    handlerAct: "Select", // 验证成功后发起后续接口请求的方法名，默认登录，如使用默认值请不要传
                    d_Aname: "abc", // 自定义键值对
                    d_Passwd: "11"
                };
            },
            z_index: 800, //设置标签z_index
            Callback_error: function(msg) { // 验证失败回调，默认为滑块和拼图小块滑回原位pic_code.doMove(msg);msg为提示错误信息
                pic_code.doMove(msg);
            },
            Callback_error_repeatedly: function() { // 多次验证失败回调，优先于Callback_error  默认事件pic_code.change_background_url();
                pic_code.change_background_url();
            },
            Callback_error_repeatedly_count: 3, // 触发多次验证失败回调的失败次数
            Callback_success: function(data) { //验证成功回调，默认方法：pic_code.valid_success_callback()
                console.log("成功",JSON.stringify(data));
                pic_code.valid_success_callback();
            },
            Callback_success_apierror: function(msg) {
                console.log("接口错误：" + msg);
                pic_code.doMove();
            }
        }
        $pic_code.init(opt);

        $(".show").unbind().on("click", function() {
            $pic_code.open(opt);
        });
    })
});