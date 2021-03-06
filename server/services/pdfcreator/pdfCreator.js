const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf');

class PdfService {
  createPdf({date, to, subject, body}) {
    return new Promise((resolve, reject) => {
      const cwd = process.cwd();
      const fullPath = [cwd, 'server', 'offer-template'];
      const template = path.join(...fullPath, 'template.html');
      const filename = template.replace('.html', '.pdf');
      let templateHtml = fs.readFileSync(template, 'utf8');
      const imageUrl = path.join('file://', ...fullPath, 'image.jpg');
      const fontUrl = path.join('file://', ...fullPath, 'fonts', 'Alef.ttf');
      templateHtml = templateHtml.replace('${image}', imageUrl)
        .replace('${font}', fontUrl)
        .replace('${offer-date}', date)
        .replace('${offer-for}', to)
        .replace('${offer-subject}', subject)
        .replace('${offer-body}', decodeURIComponent(body));

      pdf
        .create(templateHtml, {width: '1654px', height: '2350px'})
        .toFile(filename, (err, pdf) => {
          if (err) {
            reject(err);
          } else {
            resolve(pdf);
          }
        });
    })
  }
}

module.exports = new PdfService();