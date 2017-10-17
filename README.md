Pic-code 图片验证码 v3.2.0
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
        pic_position: ".pic_code",//图片验证码外包层class或id，默认.pic_code
        div_width: 300,//设置显示的大图的宽，默认300
        valid_range: 5, // 图片验证正确的容错范围，默认是5,单位是px，不受unit影响
        unit: "px", // 宽高及容错范围单位 "px|vw", 默认px，且IE6/7/8强制使用px
        pic_mask: true,  //验证码大遮罩层，false-不显示遮罩层，true-显示遮罩层，默认true
        Pic_mask_color: "#000", //验证码大遮罩层颜色，默认黑色
        Pic_mask_opacity: 0.8, ////验证码大遮罩层透明度，默认0.8
        Pic_click_key: true, //开关，点击遮罩层验证码是否隐藏，true-隐藏，false-不隐藏，默认true
        Is_Cross_domain: false,//是否跨域 true-跨域（后端需配置跨域允许当前来源），false-不跨域，默认false
        Url_getPic: '/Pic_code/Pic_code.ashx', //获取图片地址的接口，跨域请填写带域名的地址，默认'/Pic_code/Pic_code.ashx'
        url_submit: '/Pic_code/Pic_code_valid.ashx', //验证码，验证完成提交的地址，跨域请填写带域名的地址，默认'/Pic_code/Pic_code_valid.ashx'
        z_index: 800, //设置标签z_index，默认800
        position_default: true, //验证码是否居中显示，true-居中显示，false-自定义显示位置，默认true
        Callback_error: function () { // 验证失败回调，默认为滑块和拼图小块滑回原位pic_code.doMove();
            pic_code.doMove();
        },
        Callback_error_repeatedly: function () { // 多次验证失败回调，刷新验证码重新验证，优先于Callback_error  默认事件pic_code.change_background_url();
            pic_code.change_background_url();
        },
        Callback_error_repeatedly_count: 3, // 触发多次验证失败回调的失败次数，默认3
        Callback_success: function () { //验证成功回调，提示验证成功，默认方法：pic_code.valid_success_callback()  
            pic_code.valid_success_callback();
        }
    }
    
    //只需要初始化一次
    pic_code.init(opt);

    //外部调用显示验证码方法
    pic_code.open();
    
    //隐藏验证码 
    pic_code.pic_code_hide(); 

    //外部刷新验证码方法
    pic_code.refresh_pic();




更新日志：
-------------

v3.1.1 - v3.2.0

        1.优化验证码图片，修改验证码图片数量
        2.修改初始化的参数，删掉部分参数，修改成后端传值的方法


v3.1.0 - v3.1.1

        1.修改验证码连续刷新bug

v3.0.7 - v3.1.0

        1.pic_original_width: 900，添加图片原始尺寸宽
        2.pic_small_width: 100，添加阴影部分小图的宽
        3.z_index: 800，添加设置元素z-index方法
        4.pic_position: ".pic_code"（图片验证码外包层class或id），删除此参数

v3.0.6 - v3.0.7

        1.修改刷新按钮显示隐藏的bug

v3.0.4 - v3.0.6

        1.添加外部显示验证码调用方法（open）
        2.修改调用方法，init之后不再直接显示验证码，需自行调用open方法显示
        3.修改刷新按钮的显示机智，滑动滑块的时候刷新按钮自动隐藏

v3.0.3 - v3.0.4

        1.内容没有任何修改，将dist中的jq文件删除

v3.0.2 - v3.0.3

        1.修改loaning方式，不再使用微信的loading
        2.修改验证码验证时的效果

v3.0.1 - v3.0.2

        1.添加node端demo，demo文件夹中，分别有.net和node的实例，需要看哪个可以搭建项目，.net用iis部署项目，node直接npm start启动项目，不要使用fis

v2.0.4 - v3.0.1
        
        1.修改插件模式，改成后端提供图片，提高验证安全性
        2.修改loading层，使用微信loading
        3.修改图片比例尺寸，长宽比改为3:1，页面验证码图片最大不超过600px

v2.0.3 - v2.0.4

        1.解决移动端拖动bug
        2.修改多次验证失败，有时验证码不刷新bug
        
v2.0.2

        1.修改验证错误提示，改成图片底部出现文字的方式
        2.改动刷新按钮的位置
        
v2.0.1

        1. 修改验证码显示样式
        2. 修改使用方式，只需在项目中添加js即可，无需添加less文件
        3. 增加点击验证码图片刷新验证码功能，增加验证码显示和隐藏功能
        4. 添加外部调用方法
            pic_code.pic_code_show();  显示验证码弹层
            pic_code.pic_code_hide();  隐藏验证码弹层
            pic_code.refresh_pic();    刷新验证码
        5. 遮罩层功能修改，传参决定是否显示遮罩层（pic_mask: true,  //验证码大遮罩层，false-不显示遮罩层，true-显示遮罩层），传参设置遮罩层颜色（Pic_mask_color : "#000", //验证码大遮罩层颜色），传参设置遮罩层透明度（Pic_mask_opacity : 0.6, //验证码大遮罩层透明度），传参判断点击遮罩层验证码是否消失（Pic_click_key : "ture", //开关，点击遮罩层验证码是否隐藏，true-隐藏，false-不隐藏）
            
v1.0.3
    
    1. 修改  红色  X  的样式  变成不透明的红色
    2. 验证图片换成1000的大图
    3. 修改ios端拖动滑块，滑块背景闪烁的bug
    4. 添加遮罩层，添加遮罩层显示参数，pic_mask
    
