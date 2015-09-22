var gulp = require("gulp");

var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
var autoprefixer = require("gulp-autoprefixer");
var browserSync = require("browser-sync");
var del = require("del");
var runSequence = require("run-sequence");

var autoprefixerOptions = {
    browsers: ["last 2 versions", "> 5%", "Firefox ESR"]
};
gulp.task("sass", () => {
    return gulp.src("styles/**/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest("styles"))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task("browserSync", () => {
    browserSync({
        server: {
            baseDir: "."
        }
    });
});

gulp.task("clean", () => {
    del("styles/**/*.css");
    del("styles/**/**.css.map");
});

gulp.task("watch", ["browserSync", "sass"], () => {
    gulp.watch("styles/**/*.scss", ["sass"]);
});

gulp.task("build", (callback) => {
    runSequence("clean", ["sass"], callback);
});

gulp.task("default", (callback) => {
    runSequence(["sass", "browserSync", "watch"], callback);
});