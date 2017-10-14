# 配合pic_code 使用的node.js服务端程序

文件结构：
-------------

1. Pic_code文件夹内为验证码底图(images/*.jpg)及水印图(water.png)。其中底图支持数量的修改，但文件名需要从1开始累加，后缀支持jpg、png和gif。

1. Routes/Pic_code.js为生成验证码和验证正确与否的路由，/app.js中请将"/Pic_code"指向此路由。


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
            dix_long: "50", // 客户端拖动的x距离, px
            valid_range: "5" // 容错距离，px
        },
        success: function(result){
            /*
                @result: {
                    "error": "SUCCESS" // SUCCESS | ERROR
                }
            */
        }

