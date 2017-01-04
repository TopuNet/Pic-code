Pic-code 图片验证码 v1.0.3
====


###兼容原生JS和AMD规范

###安装：npm install TopuNet-Pic-code


##文件结构

    
    1.将pic_code.css , pic_code.less , pic_code.css.map 放在inc文件夹，样式可以在inc里面改
    2.将pic_code.js文件放在jq中（原生规范）或widget/lib（AMD规范）中
   
##页面引用：
        
    原生引用
    
      1. 页面底部引用/inc/jquery.min.js#1.x 或 zepto.js
      2. 再引用/jq/pic_code.js
        
    requirejs引用
    
      依赖pic_code.js和(jquery.min.js#1.x 或 zepto.js)，成功后返回对象 pic_code
        
    
##功能配置及启用：

    var opt = {
        div_width: 260,//设置大图的默认宽，默认是260
        div_height: 160,//设置大图的默认高，默认是160
        crop_div: 50, // 设置移动的小图片的宽高，默认是50
        valid_range: 5, // 图片验证正确的容错范围，默认是5
        unit: "px", // 宽高及容错范围单位 "px|vw", 默认px，且IE6/7/8强制使用px
        background_url: ["/img/1.jpg","/img/2.jpg"], // 大图路径，数组
        pic_mask: true,  //验证码大遮罩层，false-不显示遮罩层，true-显示遮罩层
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



###更新历史
    
    1. 修改  红色  X  的样式  变成不透明的红色
    2. 验证图片换成1000的大图
    3. 修改ios端拖动滑块，滑块背景闪烁的bug
    4. 添加遮罩层，添加遮罩层显示参数，pic_mask
    
