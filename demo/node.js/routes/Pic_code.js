/*
    index路由
*/

var router = require("express").Router(),
    async = require("async"),
    fs = require("fs"),
    images = require("images"),
    func = require("../handle/functions");


router.post("/create", function(req, res) {

    var imgDir = "./Pic_code/images/",
        waterPath = "./Pic_code/water.png",
        saveDir = ["./uploadFile/", "./uploadFile/temp/"],
        cropMargin = 10; // 抠图边距(px)

    var image_path, // 原图片路径
        image_ori, // 原图片
        image_ori_ext, // 原图片后缀
        image_ori_size, // 原图片尺寸{width,height}
        image_water, // 水印图片
        image_water_size, // 水印尺寸{width,height}
        image_new_fp, // 打过水印的图片文件名（不含路径）
        image_crop_fp, // 剪切的小图片文件名（不含路径）
        image_crop_pos; // 剪切的起始坐标{x,y}

    // 根据日期创建随机文件名 YYYYMMDDHHmmssXXXX（HHmmss在@haveTime=true时存在；XXXX为@rnd位随机数，@rnd可以为0）
    var createFilename = function(haveTime, rnd) {
        var dt = new Date();

        var year = dt.getFullYear(),
            month = dt.getMonth() + 1,
            date = dt.getDate(),
            hour = dt.getHours(),
            minute = dt.getMinutes(),
            second = dt.getSeconds();

        var fp = "";

        fp += year.toString();

        if (month < 10)
            fp += "0";
        fp += month.toString();

        if (date < 10)
            fp += "0";
        fp += date.toString();

        if (haveTime) {
            if (hour < 10)
                fp += "0";
            fp += hour.toString();
            if (minute < 10)
                fp += "0";
            fp += minute.toString();
            if (second < 10)
                fp += "0";
            fp += second.toString();
        }

        if (rnd > 0) {
            fp += func.CreateRandomStr(rnd, 1);
        }

        return fp;
    };

    // 验证保存图片的路径是否存在，不存在则创建
    var validNewDir = function(callback) {
        saveDir.forEach(function(sd) {
            (function() {
                if (!fs.existsSync(sd)) {
                    fs.mkdirSync(sd);
                }
            })();
        });

        callback(null);
    };

    // 验证图片文件夹是否存在
    var validDir = function(callback) {

        if (!fs.existsSync(imgDir))
            callback("文件夹不存在");
        else
            callback(null);
    };

    // 读取图片
    var readFiles = function(callback) {
        fs.readdir(imgDir, function(err, files) {
            if (err) {
                console.log("\n\n", "Pic_code", 97, "err:\n", err);
                callback("create报错，具体问题请查看日志");
            } else
                callback(null, files);

        });
    };

    // 过滤files的非图片
    var filterFiles = function(files, callback) {
        var files_new = [];
        files.forEach(function(f) {
            if (f.match(/.(jpg|png|gif)$/i)) {
                files_new.push(f);
            }
        });

        if (files_new.length === 0)
            callback("没有图片");
        else
            callback(null, files_new);
    };

    // 随机一张图片
    var selectOneImage = function(files, callback) {
        var image_count = files.length;

        var rnd = parseInt(Math.random() * image_count);

        image_path = imgDir + files[rnd];

        var regExp = /.*?(\.(?:jpg|gif|png))/ig;
        var result = regExp.exec(image_path);
        if (result && result.length)
            image_ori_ext = result[1];

        callback(null);
    };

    // 获得原图及尺寸
    var Img_getOri = function(callback) {
        image_ori = images(image_path);
        image_ori_size = image_ori.size();

        callback(null);
    };

    // 获得水印图片及尺寸
    var Img_getWater = function(callback) {
        image_water = images(waterPath);
        image_water_size = image_water.size();

        callback(null);
    };

    // 获得抠图坐标
    var Img_getCropPos = function(callback) {
        var x_min = image_water_size.width + cropMargin;
        var y_min = image_water_size.height + cropMargin;
        var x_max = image_ori_size.width - image_water_size.width - cropMargin;
        var y_max = image_ori_size.height - image_water_size.height - cropMargin;

        var x = parseInt(Math.random() * (x_max - x_min + 1) + x_min);
        var y = parseInt(Math.random() * (y_max - y_min + 1) + y_min);

        image_crop_pos = {
            x: x,
            y: y
        };

        callback(null);
    };

    // 抠图
    var Img_Croping = function(callback) {

        image_crop_fp = createFilename(true, 4);
        images(
            image_ori,
            image_crop_pos.x,
            image_crop_pos.y,
            image_water_size.width,
            image_water_size.height
        ).save(saveDir[1] + image_crop_fp + image_ori_ext);

        callback(null);
    };

    // 给原图打水印
    var Img_addWater = function(callback) {


        image_new_fp = createFilename(true, 4);

        image_ori.draw(images(image_water), image_crop_pos.x, image_crop_pos.y)
            .save(saveDir[1] + image_new_fp + image_ori_ext);

        callback(null);
    };

    // 将x值存入session
    var xToSession = function(callback) {

        req.session.Pic_code_x = image_crop_pos.x;

        callback(null);
    };

    async.waterfall([
        validNewDir,
        validDir,
        readFiles,
        filterFiles,
        selectOneImage,
        Img_getOri,
        Img_getWater,
        Img_getCropPos,
        Img_Croping,
        Img_addWater,
        xToSession
    ], function(err) {

        var return_obj = {};

        if (err) {

            console.log("\n\n", "Pic_code", 223, "err:\n", err);
            return_obj = {
                error: "ERROR",
                msg: err
            };

        } else {
            return_obj = {
                error: "SUCCESS",
                original_width: image_ori_size.width,
                original_height: image_ori_size.height,
                water_width: image_water_size.width,
                water_height: image_water_size.height,
                Y: image_crop_pos.y,
                img1: saveDir[1].substring(1) + image_crop_fp + image_ori_ext,
                img2: saveDir[1].substring(1) + image_new_fp + image_ori_ext
            };
        }
        res.send(JSON.stringify(return_obj));
    });
});

router.post("/valid", function(req, res) {

    var Post_data,
        sessionX;

    // 获取表单参数
    var getPostParas = function(callback) {

        Post_data = {
            x: parseInt(req.body.dix_long || 0),
            valid_range: parseInt(req.body.valid_range || 0)
        };

        callback(null);
    };

    // 获取session中的x
    var getX_from_session = function(callback) {

        sessionX = req.session.Pic_code_x;

        callback(null);
    };

    // 验证
    var valid = function(callback) {

        // console.log("\n\n", "Pic_code", 268, "sessionX:", sessionX, "Post_data:", Post_data);

        var result = (sessionX >= Post_data.x - Post_data.valid_range) &&
            (sessionX <= Post_data.x + Post_data.valid_range);

        callback(null, result);
    };

    async.waterfall([
        getPostParas,
        getX_from_session,
        valid
    ], function(err, result) {
        var result_obj = {
            error: result ? "SUCCESS" : "ERROR"
        };

        // console.log("\n\n", "Pic_code", 285, "result_obj:", result_obj);

        res.send(JSON.stringify(result_obj));

    });
});

module.exports = router;