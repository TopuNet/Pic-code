require(["pic_code", "/inc/jquery.min.js"], function($pic_code) {

    $(function(){
		var opt = {
		    show_pic_code : '.show', //点击显示验证码的按钮class或id
            pic_position : ".pic_code" ,//图片验证码外包层class
		    div_width: 60,//设置大图的默认宽
		    div_height: 30,//设置大图的默认高
		    crop_div: 5, // 设置移动的小图片的宽高
		    valid_range: 5, // 图片验证正确的容错范围，默认是5
		    unit: "vw", // 宽高及容错范围单位 "px|vw", 默认px，且IE6/7/8强制使用px
            pic_mask: true,  //验证码大遮罩层，false-不显示遮罩层，true-显示遮罩层
            Pic_mask_color : "#000", //验证码大遮罩层颜色
            Pic_mask_opacity : 0.6, ////验证码大遮罩层透明度
            Pic_click_key : "ture", //开关，true
		    background_url: ["/img/1.jpg","/img/2.jpg","/img/3.jpg","/img/4.jpg","/img/5.jpg","/img/6.jpg","/img/7.jpg","/img/8.jpg","/img/9.jpg"], // 大图路径，数组
		    Callback_error: function() { // 验证失败回调，默认为滑块和拼图小块滑回原位pic_code.doMove(oDiv2);
                pic_code.doMove();
            }, 
            Callback_error_repeatedly: function() { // 多次验证失败回调，优先于Callback_error  默认事件pic_code.change_background_url();
                pic_code.change_background_url();
            }, 
            Callback_error_repeatedly_count: 3, // 触发多次验证失败回调的失败次数
            Callback_success: function() { //验证成功回调，默认方法：pic_code.valid_success_callback()  
                pic_code.valid_success_callback();
            }
		}
		$pic_code.init(opt)
	})
});
