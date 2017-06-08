/*
 *@ 刘超
 *@ 20170526
 *@ 生成滑动验证码配套文件的中间件
 */
var images = require("images");
var fs = require('fs');
var async = require('async');

exports.Pic_code = function (req, res, next) {
    req.pic_code_result = {}; //返回结果
    var i = 10; //水印图距离边缘的距离
    var temppath_upload_file = "./upload_file/"; //临时文件夹外面的upload_file文件夹路径
    var temppath = "./upload_file/temp/"; //临时文件夹路径
    var captchapath = "./images/pic_code/"; //验证码底图库文件夹路径

    //判断验证码底图库文件夹是否存在，将存在状态传递到下一个函数
    var isCaptchaExists = function (callback) {
        fs.stat(captchapath, function (exists) {
             if(exists!=null){
                callback(null, false);
            }else{
                callback(null, true)
            }
        })
    };
    //根据验证码底图库文件夹存在状态处理瀑布流是继续还是结束
    var CaptchaDo = function (exists, callback) {
        if (!exists) {
            callback(new Error());
        } else {
            callback(null);
        }
    };
    var isTempExists = function (callback) {
        fs.stat(temppath,function(err){
            if(err!=null){
                callback(null, false);
            }else{
                callback(null, true)
            }
        });
    };
    //临时文件夹若不存在，创建临时文件夹
    var mkTempDir1 = function (exists, callback) {
        if (!exists) {
            fs.mkdir(temppath_upload_file, function (err) {
                callback(null, false);
            });
        } else {
            callback(null,true);
        }
    };
    var mkTempDir2 = function (exists, callback) {
        if (!exists) {
            fs.mkdir(temppath, function (err) {
                callback(null);
            });
        } else {
            callback(null);
        }
    };
    //创建Pic_code
    var Make_Pic_code = function (callback) {
        //从验证码底图库中随机一张图片
        var FromImage = captchapath + Math.floor(Math.random() * 7 + 1) + ".jpg";

        //计算水印图位置的坐标
        var waterImage = captchapath + "water.png";
        var water_width = images(waterImage).size().width; //水印的宽
        var water_height = images(waterImage).size().height; //水印的高
        var max_width = images(FromImage).size().width - water_width - i; //水印左上角的横坐标范围
        var max_height = images(FromImage).size().height - water_height - i; //水印左上角的纵坐标范围
        var x = Math.floor(Math.random() * (max_width - i) + i); //水印左上角的横坐标
        var y = Math.floor(Math.random() * (max_height - i) + i); //水印左上角的纵坐标
        //截取原图中一部分存为文件
        var img1 = temppath + Date.now() + Math.floor(Math.random() * 4000 + 1000) + '.jpg'; //截下来的拼图的保存路径
        images(images(FromImage), x, y, water_width, water_height).save(img1);
        //给底图添加水印
        var img2 = temppath + Date.now() + Math.floor(Math.random() * 4000 + 5000) + '.jpg'; //添加水印的底图的保存路径
        images(FromImage).draw(images(waterImage), x, y).save(img2);
        //将横坐标存为Session
        req.session.pic_code_validcode = x;

        //返回结果
        req.pic_code_result["error"] = "SUCCESS";
        req.pic_code_result["Y"] = y;
        req.pic_code_result["img1"] = img1.substring(1, img1.length);
        req.pic_code_result["img2"] = img2.substring(1, img2.length);
        req.pic_code_result["session"] = x;

        callback(null);
    };
    async.waterfall([
        //判断验证码地图库文件夹是否存在
        isCaptchaExists,
        CaptchaDo,
        isTempExists,
        mkTempDir1,
        mkTempDir2,
        Make_Pic_code,
    ], function (error, result) {
        if (error) {
            req.pic_code_result["error"] = "ERROR";
            req.pic_code_result["msg"] = "验证码底图库文件夹不存在";
        }
        next();
    });
};