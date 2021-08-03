//引用文件系统模块
var fs = require("fs");
var path = require("path");
//引用imageinfo模块
var imageInfo = require("imageinfo");
//引用images模块
var images = require('images');
const { jsPDF } = require("jspdf");

var rmimgpath = "./222/";//添加图片文件加位置
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
  let doc;
  var photos = getFiles.getImageFiles(rmimgpath);
  const w = 1500
  for (var i = 0; i < photos.length; i++) {

      var sourceImgpath = photos[i].path;
      var sourceImgname = photos[i].filename;
      var sourceImg = images(sourceImgpath + sourceImgname);
      let img = images(sourceImg);
      const h = img.height() * w / img.width()
      console.log(i, w, h);

      if (doc) {
        doc.addPage([w, h], w > h ? 'l':'p')
      } else {
          doc = new jsPDF({
              orientation: w > h ? 'l':'p',
              unit: "px",
              format: [w, h]
          });
      }

      doc.addImage(img.encode('png'), "", 0, 0, w, h);
    }
    doc.save(`dist/111.pdf`);
}

run();
