Pic-code 图片验证码 v2.0.1
====


###兼容原生JS和AMD规范

###安装：npm install TopuNet-Pic-code


##文件结构

    
    1.将pic_code.js文件放在jq中（原生规范）或widget/lib（AMD规范）中
    2.html创建验证码的外包盒子，确定验证码位置，将盒子class或者id传到opt中相应位置
    
##页面引用：
        
    原生引用
    
      1. 页面底部引用/inc/jquery.min.js#1.x 或 zepto.js
      2. 再引用/jq/pic_code.js
        
    requirejs引用
    
      依赖pic_code.js和(jquery.min.js#1.x 或 zepto.js)，成功后返回对象 pic_code
        
    
##功能配置及启用：

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
        Pic_mask_opacity : 0.6, //验证码大遮罩层透明度
        Pic_click_key : "ture", //开关，true
        background_url: ["/img/1.jpg","/img/2.jpg","/img/3.jpg","/img/4.jpg","/img/5.jpg","/img/6.jpg","/img/7.jpg","/img/8.jpg","/img/9.jpg"], // 大图路径，数组
        Callback_error: function() { // 验证失败回调，默认为滑块和拼图小块滑回原位pic_code.doMove();  如果没有自定义方法此参数不传
        	alert(11)
        }, 
        Callback_error_repeatedly: function() { // 多次验证失败回调，优先于Callback_error默认事件pic_code.change_background_url(); 如果没有自定义方法此参数不传
        	alert('aa')
        }, 
        Callback_error_repeatedly_count: 3, // 触发多次验证失败回调的失败次数
        Callback_success: function() { //验证成功回调，默认方法：pic_code.valid_success_callback()	如果没有自定义方法此参数不传
        	alert('bb')
        }
    }
    
    pic_code.init(opt);



更新日志：
-------------
v2.0.1

        1. 修改验证码显示样式
        2. 修改使用方式，只需在项目中添加js即可，无需添加less文件
        3. 增加点击验证码图片刷新验证码功能，增加验证码显示和隐藏功能
        4. 添加外部调用方
            pic_code.pic_code_show();  显示验证码弹层
            pic_code.pic_code_hide();  隐藏验证码弹层
            pic_code.refresh_pic();    刷新验证码
        5. 遮罩层功能修改，传参决定是否显示遮罩层（pic_mask: true,  //验证码大遮罩层，false-不显示遮罩层，true-显示遮罩层），传参设置遮罩层颜色（Pic_mask_color : "#000", //验证码大遮罩层颜色），传参设置遮罩层透明度（Pic_mask_opacity : 0.6, //验证码大遮罩层透明度），传参判断点击遮罩层验证码是否消失（Pic_click_key : "ture", //开关，true）
            
v1.0.3
    
    1. 修改  红色  X  的样式  变成不透明的红色
    2. 验证图片换成1000的大图
    3. 修改ios端拖动滑块，滑块背景闪烁的bug
    4. 添加遮罩层，添加遮罩层显示参数，pic_mask
    
