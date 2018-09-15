self.addEventListener('message', function(e) {
    const input = e.data;

    switch (input.cmd) {
        case 'init':
            init();
            break;
        case 'process':
            process(input);
            break;
        default:
            console.log('Unknown command for QRCode worker.');
            break;
    }
});

function init() {
    self.importScripts(
        'lib/jsqrcode/src/grid.js',
        'lib/jsqrcode/src/version.js',
        'lib/jsqrcode/src/detector.js',
        'lib/jsqrcode/src/formatinf.js',
        'lib/jsqrcode/src/errorlevel.js',
        'lib/jsqrcode/src/bitmat.js',
        'lib/jsqrcode/src/datablock.js',
        'lib/jsqrcode/src/bmparser.js',
        'lib/jsqrcode/src/datamask.js',
        'lib/jsqrcode/src/rsdecoder.js',
        'lib/jsqrcode/src/gf256poly.js',
        'lib/jsqrcode/src/gf256.js',
        'lib/jsqrcode/src/decoder.js',
        'lib/jsqrcode/src/qrcode.js',
        'lib/jsqrcode/src/findpat.js',
        'lib/jsqrcode/src/alignpat.js',
        'lib/jsqrcode/src/databr.js'
    );
}

function process(input) {
    qrcode.width = input.width;
    qrcode.height = input.height;
    qrcode.imagedata = input.imageData;

    let result = false;
    try {
        result = qrcode.process();
    } catch (e) {}

    postMessage(result);
}
