const { jsPDF } = require("jspdf");
var images = require('images');
require('./fonts/arialunicode-normal')

const img = images('./images/img/其他.png')
const imgBuffer = img.encode('png')

// Default export is a4 paper, portrait, using millimeters for units
const doc = new jsPDF({
  // orientation: "p",
  unit: "px",
  format: [img.width(), img.height()]
});

const txt = "你好";

// const x = img.width() / doc.getTextWidth(txt);
// const y = img.height() / doc.getTextWidth(txt);

doc.addImage(imgBuffer, "PNG", 0, 0, img.width(), img.height());
doc.setFont('arialunicode', 'normal')
doc.setTextColor('#0000ff')
doc.setFontSize(10)

for (let x = 0; x < Math.ceil(img.width() / doc.getTextWidth(txt)); x++) {
  for (let y = 0; y < Math.ceil(img.height() / doc.getTextWidth(txt)); y++) {
    console.log(x, y);
    doc.text(txt, x * doc.getTextWidth(txt), y * doc.getTextWidth(txt), { angle: 45 });
  }
}
// doc.text(txt, 0, 40, { angle: 45 });

doc.save("dist/a4.pdf");
