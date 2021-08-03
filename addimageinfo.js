//引用文件系统模块
var fs = require("fs");
var path = require("path");
//引用imageinfo模块
var imageInfo = require("imageinfo");
//引用images模块
var images = require('images');

var logomarkimg = images('./marklogo.png');//水印位置
var rmimgpath = "./images/img/";//添加图片文件加位置
var destImgPath = './dist/';
var mark = "";//另存图片前缀，若为""则替换原图片

// 检查目标文件夹是否存在，不存在就新建
const stat = fs.existsSync(path.resolve(destImgPath))
if (!stat) {
  fs.mkdirSync(destImgPath)
}

function readFileList(path, filesList) {
    var files = fs.readdirSync(path);
    files.forEach(function (itm, index) {
        var stat = fs.statSync(path + itm);
        if (stat.isDirectory()) {
            //递归读取文件
            readFileList(path + itm + "/", filesList)
        } else {
            var obj = {};//定义一个对象存放文件的路径和名字
            obj.path = path;//路径
            obj.filename = itm//名字
            filesList.push(obj);
        }
    })
}
var getFiles = {
    //获取文件夹下的所有文件
    getFileList: function (path) {
        var filesList = [];
        readFileList(path, filesList);
        return filesList;
    },
    //获取文件夹下的所有图片
    getImageFiles: function (path) {
        var imageList = [];
        this.getFileList(path).forEach((item) => {
            var ms = imageInfo(fs.readFileSync(item.path + item.filename));
            ms.mimeType && (imageList.push(item))
        });
        return imageList;
    }
};

const run = () => {
  //获取文件夹下的所有图片
  var photos = getFiles.getImageFiles(rmimgpath);
  for (var i = 0; i < photos.length; i++) {
      var sourceImgpath = photos[i].path;
      var sourceImgname = photos[i].filename;
      var sourceImg = images(sourceImgpath + sourceImgname);
      var sWidth = sourceImg.width();
      var sHeight = sourceImg.height();
      var wmWidth = logomarkimg.width();
      var wmHeight = logomarkimg.height();

      const X = Math.ceil(sWidth / wmWidth);
      const Y = Math.ceil(sHeight / wmHeight);
      let img = images(sourceImg);

      for(let x = 0; x < X; x++) {
        for(let y = 0; y < Y; y++) {
          img = img.draw(logomarkimg, wmWidth * x, wmHeight * y)
        }
      }
      img.save((destImgPath || sourceImgpath) + mark + sourceImgname + '');

      // images(sourceImg)
      //     // 设置绘制的坐标位置，右下角距离 10px
      //     .draw(logomarkimg, sWidth - wmWidth - 10, sHeight - wmHeight - 10)
      //     // 保存格式会自动识别
      //     .save((destImgPath || sourceImgpath) + mark + sourceImgname + '');
  }
}

run();
