require(["pic_code", "/inc/jquery.min.js"], function($pic_code) {

    $(function(){
		var opt = {
            pic_position: ".pic_code",//图片验证码外包层class或id
            div_width: 450,//设置大图的默认宽
            div_height: 150,//设置大图的默认高,宽高比是3:1，
            valid_range: 5, // 图片验证正确的容错范围，默认是5,单位是px，不受unit影响
            unit: "px", // 宽高及容错范围单位 "px|vw", 默认px，且IE6/7/8强制使用px
            pic_mask: true,  //验证码大遮罩层，false-不显示遮罩层，true-显示遮罩层
            Pic_mask_color: "#000", //验证码大遮罩层颜色
            Pic_mask_opacity: 0.8, ////验证码大遮罩层透明度
            Pic_click_key: true, //开关，点击遮罩层验证码是否隐藏，true-隐藏，false-不隐藏
            Is_Cross_domain: false,//是否跨域 true-跨域（后端需配置跨域允许当前来源），false-不跨域
            Url_getPic: '/Pic_code/Pic_code.ashx', //获取图片地址的接口，跨域请填写带域名的地址
            url_submit: '/Pic_code/Pic_code_valid.ashx', //验证码，验证完成提交的地址，跨域请填写带域名的地址
            Callback_error: function () { // 验证失败回调，默认为滑块和拼图小块滑回原位pic_code.doMove(oDiv2);
                pic_code.doMove();
            },
            Callback_error_repeatedly: function () { // 多次验证失败回调，优先于Callback_error  默认事件pic_code.change_background_url();
                pic_code.change_background_url();
            },
            Callback_error_repeatedly_count: 3, // 触发多次验证失败回调的失败次数
            Callback_success: function () { //验证成功回调，默认方法：pic_code.valid_success_callback()  
                pic_code.valid_success_callback();
            }
		}
		$pic_code.init(opt);
        $('.show').click(function(){
            pic_code.open();
        })
	})
});
