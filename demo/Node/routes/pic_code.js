/*
 * 刘超
 *20170608
 *Pic_code路由文件
 */
var router = require('express').Router();
var pic_code = require('../handle/Pic_code.js'); //Pic_code中间件

var images = require("images");
var fs = require('fs');
var async = require('async');

router.get("/", function (req, res) {
    res.render('../views/code.html');
});

router.post("/get_pic_code", pic_code.Pic_code, function (req, res) {
    res.send(req.pic_code_result);
});

router.post("/valid_pic_code", function (req, res) {
    var dix_long = req.body["dix_long"]; //横坐标
    var valid_range = req.body["valid_range"]; //容错率
    var result = {}; //验证结果

    result['dix_long'] = dix_long;
    result['valid_range'] = valid_range;

    var session = req.session.pic_code_validcode;
    if (session - valid_range <= dix_long && dix_long <= session + valid_range) {
        result['error'] = 'SUCCESS';
    } else {
        result['error'] = 'ERROR';
    }

    res.send(result);
});

module.exports = router;