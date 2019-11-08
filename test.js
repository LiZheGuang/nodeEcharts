const Assembler = require('apng-assembler');

Assembler.assemble(
  'area01.png',
  {
    loopCount: 0,
    frameDelay: 100,
    compression: Assembler.COMPRESS_7ZIP
  }
).then(
  function (outputFile) {
    console.log(`${outputFile} has been assembled successfully.`);
  },
  function (error) {
    console.error(`Failed to assemble: ${error.message}`);
    console.error(`stdout: ${error.stdout}`);
    console.error(`stderr: ${error.stderr}`);
  }
);
