var gulp       = require("gulp");
var jshint     = require("gulp-jshint");
var uglify     = require("gulp-uglify");
var concat     = require("gulp-concat");
var rename     = require("gulp-rename");
var browserify = require("gulp-browserify");

var src = {
    lib: ["lib/index.js"]
};

gulp.task("build-lib", function () {
    return gulp.src(src.lib)
        .pipe(browserify())
        .pipe(rename("closeup.js"))
        .pipe(gulp.dest("./dist"))
        .pipe(rename("closeup.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("./dist"));
});


gulp.task("build-poly", function () {

    return gulp.src(["polyfills/addEventListener.js", "dist/closeup.js"])
        .pipe(concat("closeup.ie.js"))
        .pipe(gulp.dest("./dist"))
        .pipe(uglify())
        .pipe(rename("closeup.ie.min.js"))
        .pipe(gulp.dest("./dist"));
});

gulp.task('lint', function () {
    gulp.src(["test/specs/*.js", "lib/*.js"])
        .pipe(jshint(".jshintrc"))
        .pipe(jshint.reporter("default"))
        .pipe(jshint.reporter("fail"));
});

gulp.task('build', function () {
    gulp.src(["lib/index.js"])
        .pipe(browserify())
        .pipe(gulp.dest("./dist"))
});

gulp.task('build-all', ['build-lib', 'build-poly']);