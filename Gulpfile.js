const gulp = require('gulp');
const connect = require('gulp-connect');
const copy = require('gulp-copy');
const del = require('del');
const ghPages = require('gh-pages');
const path = require('path');
const swPrecache = require('sw-precache');
const runSequence = require('run-sequence');

const DEV_DIR = 'app';
const DIST_DIR = 'dist';

function getAssets(rootDir) {
    return [
        rootDir + '/manifest.json',
        rootDir + '/**.html',
        rootDir + '/assets/**.css',
        rootDir + '/assets/**.js',
        rootDir + '/assets/images/**',
        rootDir + '/assets/lib/dialog-polyfill/dialog-polyfill.css',
        rootDir + '/assets/lib/dialog-polyfill/dialog-polyfill.js',
        rootDir + '/assets/lib/material-design-lite/material.min.css',
        rootDir + '/assets/lib/material-design-lite/material.min.js',
        rootDir + '/assets/lib/clipboard/dist/clipboard.min.js',
        rootDir + '/assets/lib/jsqrcode/src/**.js'
    ];
}

function serve(rootDir) {
    connect.server({
        root: rootDir
    });
}

function writeServiceWorkerFile(rootDir, handleFetch) {
    swPrecache.write(path.join(rootDir, 'service-worker.js'), {
        handleFetch: handleFetch,
        staticFileGlobs: getAssets(rootDir),
        stripPrefix: rootDir + '/'
    });
}

gulp.task('default', ['dev']);
gulp.task('dev', ['serve-dev']);
gulp.task('serve-dev', ['build-dev'], function() {
    serve(DEV_DIR);
});
gulp.task('build-dev', ['generate-service-worker-dev']);

gulp.task('prod', ['clean', 'serve-dist']);
gulp.task('clean', function() {
    del.sync([DIST_DIR]);
});
gulp.task('serve-dist', ['build-dist'], function() {
    serve(DIST_DIR);
});
gulp.task('build-dist', function() {
    runSequence('copy-dev-to-dist', 'generate-service-worker-dist');
});

gulp.task('copy-dev-to-dist', function() {
    return gulp.src(getAssets(DEV_DIR))
        .pipe(copy(DIST_DIR, {prefix: 1}))
        .pipe(gulp.dest(DIST_DIR));
});

gulp.task('generate-service-worker-dev', function() {
    writeServiceWorkerFile(DEV_DIR, false);
});

gulp.task('generate-service-worker-dist', function() {
    writeServiceWorkerFile(DIST_DIR, true);
});

gulp.task('gh-pages', ['build-dist'], function() {
    ghPages.publish(path.join(__dirname, DIST_DIR));
});
