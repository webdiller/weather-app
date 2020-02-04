const
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'), // minify js
    cssnano = require('gulp-cssnano'), // minify css
    rename = require('gulp-rename'),
    del = require('del'),
    notify = require('gulp-notify'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    groupmq = require('gulp-group-css-media-queries'); // not required

const PATH = `app`;


gulp.task(`sass`, [`cleanapp`], function () {
    return (gulp.src(`${PATH}/sass/**/*.+(sass|scss)`))
        .pipe(sass().on('error', notify.onError(
            {
                message: "<%= error.message %>",
                title: "Sass Error!"
            }))
        )
        .pipe(groupmq()) // Group media queries!
        .pipe(autoprefixer(['> 1%', 'last 2 versions', 'firefox >= 4', 'safari >= 5', 'IE 8', 'IE 9', 'IE 10', 'IE 11'], { cascade: true }))
        .pipe(rename({ suffix: `.min` }))
        .pipe(concat(`all.min.css`))
        .pipe(cssnano())
        .pipe(gulp.dest(`${PATH}/css`))
        .pipe(browserSync.reload({ stream: true })) /* добавляем после установки browserSync, чтобы обновлялись стили*/
});


/* 40:00 browserSync */
gulp.task('browserSync', function () {
    browserSync({
        // proxy: "test.ru",
        server: { baseDir: 'app' },
        notify: false // отключаем уведомления
    })
});

gulp.task(`scripts`, function () {
    return gulp.src([
        `${PATH}/libs/jquery-3.3.1/jquery.min.js`,
        `${PATH}/libs/lazyload.min.js`,
    ])
        .pipe(concat(`libs.min.js`))
        .pipe(uglify())
        .pipe(gulp.dest(`${PATH}/js`));
});

gulp.task(`img`, function () {
    return gulp.src(`${PATH}/img/**/*`)
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            une: [pngquant()]
        })))
        .pipe(gulp.dest(`dist/img`));
});

gulp.task(`build`, [`clean`, `img`, `sass`, `scripts`, `copy`], function () {
    var buildCss = gulp.src([
        `${PATH}/css/*.css`
    ])
        .pipe(gulp.dest(`dist/css`));

    var buildFonts = gulp.src(`${PATH}/fonts/**/*.`)
        .pipe(gulp.dest(`dist/fonts`));

    var buildJs = gulp.src(`${PATH}/js/*`)
        .pipe(gulp.dest(`dist/js`));

    var buildHtml = gulp.src(`${PATH}/*.html`)
        .pipe(gulp.dest(`dist`));

    var buildFonts = gulp.src(`${PATH}/fonts/**`)
        .pipe(gulp.dest(`dist/fonts`));
});

/* Таск переноса libs в dist */
gulp.task(`copy`, function () {
    return gulp.src([`${PATH}/libs/**/*`])
        .pipe(gulp.dest(`dist/libs`));
});

/* Таск очитки папки dist */
gulp.task(`clean`, function () {
    return del.sync(`dist`);
});

/* Таск очитки папки ${PATH}/css */
gulp.task(`cleanapp`, function () {
    return del.sync(`${PATH}/css`);
});

/* Таск очистки кеша */
gulp.task(`clear`, function () {
    return cache.clearAll();
});

/* 35:00 Watch */
gulp.task(`watch`, [`browserSync`, `sass`, `scripts`], function () {     /* 2 параметр: указываем что методы, которые выполняются до запуска команды watch */
    gulp.watch([`${PATH}/sass/**/*.+(sass|scss)`], [`sass`]);             /* 1 параметр: указываем файлы за которымы нужно следить
                                                            2 параметр: указываем команду для выполнения */
    gulp.watch([`${PATH}/**/*.html`], browserSync.reload);            /* следим за html файлами */
    gulp.watch([`${PATH}/**/*.php`], browserSync.reload);           /* следим за php файлами */
    gulp.watch([`${PATH}/js/**/*.js`], browserSync.reload);          /* следим за js файлами */
});

gulp.task(`default`, [`watch`], function () { });