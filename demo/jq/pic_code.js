/*
	白梦超
	20160718
	滑动图片验证码
	版本 v2.0.4
*/

//参数设置方法
/*
var t_opt = {
    show_pic_code : '.show', //点击显示验证码的按钮class或id
    pic_position : ".pic_code" ,//图片验证码外包层class或id
    div_width: 90,//设置大图的默认宽
    div_height: 30,//设置大图的默认高，宽高比是3:1
    valid_range: 8, // 图片验证正确的容错范围，默认是5,单位是px，不受unit影响
    unit: "vw", // 宽高及容错范围单位 "px|vw", 默认px，且IE6/7/8强制使用px
    pic_mask: true,  //验证码大遮罩层，false-不显示遮罩层，true-显示遮罩层
    Pic_mask_color : "#000", //验证码大遮罩层颜色
    Pic_mask_opacity : 0.8, ////验证码大遮罩层透明度
    Pic_click_key : "ture", //开关，点击遮罩层验证码是否隐藏，true-隐藏，false-不隐藏
    Url_getPic: '/Pic_code/Pic_code.aspx', //获取图片地址的接口
    url_submit : '/Login.ashx', //验证码，验证完成提交的地址
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
*/

var pic_code = {
    //获取dom元素
	dom_obj : {},
    //参数
    _opt : null,
    init : function(opt){
        //设置默认参数
        var t_opt = {
            show_pic_code : '.show', //点击显示验证码的按钮class或id
            pic_position : ".pic_code" ,//图片验证码外包层class或id
            div_width: 90,//设置大图的默认宽
            div_height: 30,//设置大图的默认高,宽高比是3:1，
            valid_range: 5, // 图片验证正确的容错范围，默认是5,单位是px，不受unit影响
            unit: "vw", // 宽高及容错范围单位 "px|vw", 默认px，且IE6/7/8强制使用px
            pic_mask: true,  //验证码大遮罩层，false-不显示遮罩层，true-显示遮罩层
            Pic_mask_color : "#000", //验证码大遮罩层颜色
            Pic_mask_opacity : 0.8, ////验证码大遮罩层透明度
            Pic_click_key : "ture", //开关，点击遮罩层验证码是否隐藏，true-隐藏，false-不隐藏
            Url_getPic: '/Pic_code/Pic_code.aspx', //获取图片地址的接口
            url_submit : '/Login.ashx', //验证码，验证完成提交的地址
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
        };

        pic_code._opt = $.extend(t_opt, opt);
        //设置小图的高度默认是大图宽度的1/5
        pic_code._opt.crop_div = pic_code._opt.div_width/9;
        //控制验证码最大宽度
        if (pic_code._opt.unit == 'vw' && pic_code._opt.div_width/100*$(window).width() > 600){
            pic_code._opt.div_width = 600;
            pic_code._opt.div_height = 200;
            pic_code._opt.unit = 'px';
            pic_code._opt.crop_div = parseInt(pic_code._opt.div_width/9);
        }

        //创建dom
        pic_code.create_dom();

        //设置外包层宽
        $(pic_code._opt.pic_position).css('width',pic_code._opt.div_width + pic_code._opt.unit);

        pic_code.dom_obj = {
            oPicCode: $(pic_code._opt.pic_position)    //验证码最外面一层
        };

        //监听显示验证码按钮点击
        $(pic_code._opt.show_pic_code).click(function(){
            pic_code.pic_code_show();
            pic_code.refresh_pic();
            //设置点击大图换图片
            if (pic_code._opt.Pic_click_key){
                pic_code.big_pic.unbind('click');
                pic_code.big_pic.click(function(){
                    pic_code.refresh_pic();
                });
            }
            //监听 刷新验证码按钮 点击事件
            pic_code.oRef_click();
        });

        //点击弹层验证码消失
        $('#pic_code_mask').click(function(){
            pic_code.pic_code_hide();
        });

        //ie6,7,8,不支持vw，强制使用px
        if(pic_code.params.agent){
            pic_code._opt.unit = 'px';
        }
        //设置样式
        pic_code.set_style();
        //进入页面换张图
        $(pic_code._opt.show_pic_code).click(function(){
            pic_code.change_background_url();
        });
    },

    params : {
    	left_begin: 8,	//设置小块初始位置距左侧的距离
    	agent : window.navigator.userAgent.indexOf('MSIE 6.0')!=-1 || window.navigator.userAgent.indexOf('MSIE 7.0')!=-1 || window.navigator.userAgent.indexOf('MSIE 8.0')!=-1  //浏览器是ie6,7,8此值为true，否则为false
    },

    //记录验证错误次数
    pic_code_error_count : {error : 0},

    //创建DOM
    create_dom : function(){
        var _this = this;
        var outDiv = $(_this._opt.pic_position);
        //创建验证码背景层
        _this.pic_code_bg = $(document.createElement('div')).css({
            "position": "fixed",
            "top": 0,
            "left":0,
            "width": "100vw",
            "height": "100vh",
            "background": pic_code._opt.Pic_mask_color,
            "opacity": pic_code._opt.Pic_mask_opacity,
            "filter": "alpha(opacity="+(pic_code._opt.Pic_mask_opacity*100)+")",
            "display": "none",
        }).attr('id','pic_code_mask');
        outDiv.before(_this.pic_code_bg);

        //创建验证码盒子
        _this.pic_box = $(document.createElement('div')).css({
            "width" : _this._opt.div_width + _this._opt.unit,
            "height" : _this._opt.div_height + _this._opt.unit,
            "overflow" : "hidden",
            "position" : "relative"
        }).addClass('pic_box').appendTo(outDiv);

        //创建大图外包
        _this.big_pic = $(document.createElement('div')).css({
            "width": _this._opt.div_width + _this._opt.unit,
            "position": "relative",
        }).addClass('pic_bao').appendTo(_this.pic_box);

        //创建大图div
        _this.big_pic_img = $(document.createElement('div')).css({
            "width": _this._opt.div_width + _this._opt.unit,
            "height": _this._opt.div_height + _this._opt.unit,
        }).addClass('pic').html('<img src="" />').appendTo(_this.big_pic);

        //创建刷新按钮
        _this.pic_code_fresh = $(document.createElement('div')).css({
            "width": "60px",
            "height": "20px",
            "margin-top" : "10px",
            "background": "#ddd",
            "line-height": "20px",
            "font-size": "12px",
            "text-align": "center",
            "cursor": "pointer",
            "color": "#666",
            "border-radius": "10px",
            "float" : "right",
            "position" : "relative",
        }).addClass('refresh').html("点击刷新").appendTo(outDiv);

        //创建滑块与轨道外包层
        _this.pic_code_liBao = $(document.createElement('div')).css({
            "width": _this._opt.div_width + _this._opt.unit,
            "height": "30px",
            "margin-top": "10px",
            "position": "relative",
            "float" : "left"
        }).addClass('line_bao').appendTo(outDiv);

        //创建滑块轨道
        _this.pic_code_line = $(document.createElement('div')).css({
            "width": _this._opt.div_width + _this._opt.unit,
            "height": "30px",
            "background": "#ece4dd",
            "border-radius": "10px",
            "font-size": "12px",
            "color": "#666",
            "line-height": "30px",
            "text-indent": "60px",
            "overflow": "hidden",
        }).addClass('line').appendTo(_this.pic_code_liBao);

        //创建圆滑块
        _this.pic_code_circle = $(document.createElement('div')).css({
            "width": "40px",
            "height": "40px",
            "background": "#ccc",
            "border-radius": "50%",
            "position": "relative",
            "top": "-35px",
            "left": "0px",
            "cursor": "pointer",
        }).addClass('circle').appendTo(_this.pic_code_liBao);

        //创建成功提示信息
        _this.pic_success = $(document.createElement('div')).css({
            "width": _this._opt.div_width + _this._opt.unit,
            "height": "30px",
            "background": "#0da726",
            "border-radius": "10px",
            "font-size": "14px",
            "color": "#fff",
            "line-height": "30px",
            "letter-spacing": "6px",
            "text-align": "center",
            "margin-top": "20px",
            "display": "none",
        }).addClass('success').html('验证成功').appendTo(outDiv);

        //创建验证失败盒子
        _this.pic_fail_box = $(document.createElement("div")).css({
            "width": _this._opt.div_width + _this._opt.unit,
            "height": "30px",
            "overflow" : "hidden",
            "position" : "relative"
        }).addClass('pic_fail_box').appendTo(_this.pic_box);

        //创建提示信息遮罩层
        _this.pic_success_mask = $(document.createElement('div')).css({
            "width": _this._opt.div_width + _this._opt.unit,
            "height": "30px",
            "background": "#fff",
            "opacity": "0.6",
            "filter": "alpha(opacity=60)",
            "position" : "relative",
            "font-size": "60px",
            "line-height": "160px",
            "text-align": "center",
            "font-weight": "bold",
        }).addClass('pic_code_mask').appendTo(_this.pic_fail_box);

        //创建失败提示信息
        _this.pic_fail = $(document.createElement('div')).css({
            "width": _this._opt.div_width + _this._opt.unit,
            "height": "30px",
            "position": "absolute",
            "top":0, 
            "left": 0,
            "font-size": "14px",
            "line-height": "30px",
            "text-indent": "14px",
            "color": "#000",
            "font-weight" : "normal"
        }).addClass('pic_code_content').html('<span style="color:#ff0000">验证失败</span> : 拖动滑块，完成正确拼图').appendTo(_this.pic_fail_box);

        //创建loading
        _this.loading = $(document.createElement('div')).css(
            "display",'none'
            ).html('<div class="weui-mask_transparent"></div><div class="weui-toast"><i class="weui-loading weui-icon_toast"></i><p class="weui-toast__content" style="color:#fff;">数据处理中</p></div>').attr('id','loadingToast');
        if ($('#loadingToast').length === 0){
            _this.loading.appendTo($('body'));
        }else {
            _this.loading = $('#loadingToast');
        }
    },

    //设置样式
    set_style : function(){
    	var company=pic_code._opt.unit;
    	pic_code.dom_obj.oPicCode.css('width',pic_code._opt.div_width+company);
    	pic_code.big_pic.css('width',pic_code._opt.div_width+company);
    	pic_code.pic_code_line.css('width',pic_code._opt.div_width+company);
    	pic_code.pic_success.css('width',pic_code._opt.div_width+company);
    	pic_code.big_pic_img.css({'width':pic_code._opt.div_width+company,'height':pic_code._opt.div_height+company});
    	pic_code.pic_success_mask.css({'width':pic_code._opt.div_width+company});
    	  },
    
    // 换大图
    change_background_url: function() {
        clearTimeout(pic_code.timer);
        pic_code.pic_fail_box.animate({'top':'0px'},100);
        
        pic_code.pic_code_error_count.error=0;
        pic_code.pic_code_circle.css('left','-5px');
        pic_code.pic_code_line.html('按住左边滑块，拖动完成上方拼图');
        pic_code.delateDiv();
        pic_code.loading.css('display','block');
        $.ajax({
            url : pic_code._opt.Url_getPic,
            type : 'get',
            data : {

            },
            success: function (data) {
                data = $.parseJSON(data);
                if (data.error == 'success' || data.error == 'SUCCESS'){
                    pic_code.loading.css('display','none');
                    pic_code._opt.img1 = data.img2;
                    pic_code._opt.img2 = data.img1;
                    if (pic_code._opt.unit == 'vw'){
                        pic_code._opt.Y = data.Y/300*(pic_code._opt.div_height/100*$(window).width());
                    }else{
                        pic_code._opt.Y = data.Y/300*$('div.pic_bao').height();
                    }
                    pic_code.big_pic_img.find('img').attr('src', data.img2);
                    pic_code.big_pic_img.find('img').css('width','100%');
                    pic_code.delateDiv();
                    pic_code.create_div(); 
                    pic_code.oCircle_Click();
                }
            }
        });
    },

    //验证失败小块滑回原位
    doMove : function(){
        if (pic_code.pic_code_error_count.error < pic_code._opt.Callback_error_repeatedly_count){
            pic_code.pic_fail.html('<span style="color:#ff0000">验证失败</span> : 拖动滑块，完成正确拼图');
        }else {
            pic_code.pic_fail.html('<span style="color:#ff0000">验证次数过多</span> : 系统将自动刷新验证码');
        }
        pic_code.pic_fail_box.animate({'top':'-30px'},100);
        clearTimeout(pic_code.timer);
        pic_code.timer = setTimeout(function(){
            pic_code.pic_fail_box.animate({'top':'0px'},100);
        },1000);
    	pic_code.pic_code_circle.animate({'left':'-5px'},300);
    	$('.pic_code .pic_bao div').eq(1).animate({'left':pic_code.params.left_begin+'px'},300);
		pic_code.pic_code_line.html('按住左边滑块，拖动完成上方拼图');
    	setTimeout(function(){
    		pic_code.oCircle_Click();
    	},300);
    },

    //验证成功的默认回调
    valid_success_callback : function(){
    	pic_code.pic_success.css('display','block');
        pic_code.pic_code_liBao.css('display','none');
        pic_code.pic_code_fresh.css('display','none');
        pic_code.big_pic.unbind('click');
        pic_code.pic_code_fresh.unbind('click');
    },

    // 监听 滑块点击和拖动
    oCircle_Click: function() {
        pic_code.pic_code_circle.on('mousedown touchstart',function(event){
            //获取小滑块
            var oDiv1=$('.pic_code .pic_bao div').eq(1);
            //var oDiv2=$('.pic_code .pic_bao div').eq(3);
            var oD_left=parseInt(oDiv1.offset().left);
            var disX = 0;
            if (event.originalEvent){
                disX=event.clientX-parseInt(oDiv1.css('left')) || event.originalEvent.targetTouches[0].pageX-parseInt(oDiv1.css('left'));
            }else {
                disX=event.clientX-parseInt(oDiv1.css('left')) || event.targetTouches[0].pageX-parseInt(oDiv1.css('left'));      
            }
            //圆滑块的最大left值
            var oL_max_px=parseInt(pic_code.pic_code_line.width())-parseInt(pic_code.pic_code_circle.width());
            //可动的小块的最大leftzhi
            var oDiv1_left_max_px=parseInt(pic_code.big_pic_img.width())-parseInt(oDiv1.width())-pic_code.params.left_begin-8;
            
            $(document).unbind('mousemove touchmove');
            $(document).unbind('mouseup touchend'); 

            $(document).on('mousemove touchmove',function(event){
                var oL = 0;
                if (event.originalEvent){
                    oL=event.clientX-disX || event.originalEvent.targetTouches[0].pageX-disX;
                }else {
                    oL=event.clientX-disX || event.targetTouches[0].pageX-disX;
                }
                
                if (oL>=10){
                    pic_code.pic_code_line.html('');
                }else {
                    pic_code.pic_code_line.html('按住左边滑块，拖动完成上方拼图');
                }
                
                if (oL<=0){
                    oL=0;
                }else if (oL>=oL_max_px){
                    oL=oL_max_px;
                }
                
                pic_code.pic_code_circle.css('left',oL+'px');

                oDiv1.css('left',(oL/oL_max_px*oDiv1_left_max_px+pic_code.params.left_begin)+'px');
            });
            
            $(document).on('mouseup touchend',function(){
                var dix_long = parseInt(parseInt(oDiv1.css('left'))/parseInt($('div.pic_bao').width())*900);
                pic_code.loading.css('display','block');
                $.ajax({
                    url : pic_code._opt.url_submit,
                    type : 'POST',
                    data : {
                        dix_long: dix_long,
                        valid_range: pic_code._opt.valid_range
                    },
                    success : function(data){
                        pic_code.loading.css('display','none');
                        data = $.parseJSON(data);
                        //验证成功的操作
                        if (data.error == 'success' || data.error == 'SUCCESS'){
                            pic_code._opt.Callback_success();
                        //验证失败的操作
                        }else {
                           pic_code.pic_code_error_count.error+=1;
                            pic_code.pic_code_circle.unbind('mousedown touchstart');
                            if (pic_code.pic_code_error_count.error>=pic_code._opt.Callback_error_repeatedly_count){
                                pic_code._opt.Callback_error();
                                setTimeout(function(){
                                    pic_code._opt.Callback_error_repeatedly();
                                },500);
                            }else {
                                pic_code._opt.Callback_error();
                            }
                           
                        }
                    }
                });
                $(document).unbind('mousemove touchmove');
                $(document).unbind('mouseup touchend'); 
            });
            return false;
        });
    },

    // 监听 刷新验证码按钮 点击事件
    oRef_click: function() {
        pic_code.pic_code_fresh.click(function(){
            pic_code.refresh_pic();
        });
    },
    //刷新验证码
    refresh_pic : function(){
        pic_code.pic_success.css('display','none');
        pic_code.pic_code_liBao.css('display','block');
        pic_code.pic_code_fresh.css('display','block');
        pic_code.delateDiv();
        pic_code.change_background_url();
        pic_code.oCircle_Click();
    },

    // 创建小块
    create_div: function() {
        var oDiv1=$('<div></div>');
        oDiv1.appendTo(pic_code.big_pic);
        oDiv1.css({'width':pic_code._opt.crop_div+pic_code._opt.unit,'height':pic_code._opt.crop_div+pic_code._opt.unit,'position' : 'absolute','left': pic_code.params.left_begin+'px','top':pic_code._opt.Y+'px','overflow' : 'hidden','box-shadow' : '0px 0px 3px 3px yellow inset,0px 0px 3px 3px yellow'});
        oDiv1.html('<img src='+pic_code._opt.img2+' style="width: 100%">');
    },

    // 删除小块
    delateDiv: function() {
        var len = $('.pic_code .pic_bao div').length;
        for (var i = len; i >= 1; i--) {
            $('.pic_code .pic_bao div').eq(i).remove();
        }
    },
    //显示验证码弹层
    pic_code_show : function(){
        $(pic_code._opt.pic_position).css('display','block');
        if (pic_code._opt.pic_mask){
            $('#pic_code_mask').css('display','block');
        }
    },
    //隐藏验证码弹层
    pic_code_hide : function(){
        $(pic_code._opt.pic_position).css('display','none');
        $('#pic_code_mask').css('display','none');
    },
};


if (typeof define === "function" && define.amd) {
    define([], function() {
        return pic_code;
    });
}

//返回一个m到n之间的随机数
function rnd(m,n){
	return parseInt(Math.random()*(m-n)+n);
}


