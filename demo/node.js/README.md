# 配合pic_code 使用的node.js服务端程序

文件结构：
-------------

1. Pic_code文件夹内为验证码底图(images/*.jpg)及水印图(water.png)。其中底图支持数量的修改，但文件名需要从1开始累加，后缀支持jpg、png和gif。

1. Routes/Pic_code.js为生成验证码和验证正确与否的路由，/app.js中请处理路由——此例均以Pic_code作为路由演示。


使用说明：
--------------

1. 生成验证码：

        url: "/Pic_code/create",
        type: "post",
        data: null,
        success: function(result){
            /*
                @result: {
                    "error": "SUCCESS", // SUCCESS | ERROR
                    "original_width": 900, // 原图宽度(px)
                    "original_height": 300, // 原图高度(px)
                    "water_width": 100, // 水印图宽度(px)
                    "water_height": 100, // 水印图高度(px)
                    "Y": "38", // error=SUCCESS时有效。水印小图的纵坐标，px
                    "img1": "/UploadFile/temp/201705251429.jpg", // error=SUCCESS时有效。水印小图路径
                    "img2": "/UploadFile/temp/201705257931.jpg", // error=SUCCESS时有效。底图路径
                    "msg": "文件夹不存在" // error=ERROR时有效。错误信息
                }
            */
        }


1. 验证操作

        url: "/Pic_code/valid",
        type: "post",
        data: {
            dix_long: 357, // 横坐标px
            valid_range: 10, // 容错值px
            handlerUrl: http://www.abc.com/Handler/abc.ashx, //验证成功后发起后续接口请求的地址 有默认值 如使用默认值请不要传 "no"为不调用接口请求
            handlerType: Member, // 验证成功后发起后续接口请求的接口名  默认管理员  如使用默认值请不要传
            handlerAct: Select, // 验证成功后发起后续接口请求的方法名 默认登录  如使用默认值请不要传
            key1: value1, // 自定义键值对
        },
        success: function(result){
            /*
                @result: {
                    "error": "SUCCESS", // 结果代码 ERROR - 验证失败；SUCCESS - 验证成功，且接口200或未调用接口；APIERROR - 验证成功，且接口非200；其他 - 验证成功，如接口遇47003等错误时，状态码也为200，应属于接口问题
                    "error_msg":"服务器未知错误", // error = APIERROR时有效
                    "otherKey":"otherValue" // 接口成功返回值

                }
            */
        }

