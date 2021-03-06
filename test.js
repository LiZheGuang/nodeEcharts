const GIFEncoder = require('gifencoder');
const encoder = new GIFEncoder(362, 400);
const pngFileStream = require('png-file-stream');
const fs = require('fs');
 
const stream = pngFileStream('image/area??.png')
// const stream = pngFileStream('fixtures/frame?.png')
  .pipe(encoder.createWriteStream({ repeat: 0, delay: 0, quality: 20,transparent:true}))
  .pipe(fs.createWriteStream('myanimated.gif'));
 
stream.on('finish', function () {
  // Process generated GIF
  console.log('inish')
});
 
// Alternately, you can wrap the "finish" event in a Promise
// await new Promise((resolve, reject) => {
//   stream.on('finish', resolve);
//   stream.on('error', reject);
// });