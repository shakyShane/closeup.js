var gulp   = require("gulp");
var jshint = require("gulp-jshint");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var rename = require("gulp-rename");

var src = {
    lib: ["bower_components/norman.js/lib/norman.js", "lib/closeup.js"]
};

gulp.task("build-lib", function () {
    return gulp.src(src.lib)
        .pipe(concat("closeup.js"))
        .pipe(gulp.dest("./dist"))
        .pipe(uglify())
        .pipe(rename("closeup.min.js"))
        .pipe(gulp.dest("./dist"));
});
gulp.task("build-poly", function () {

    src.lib.unshift("polyfills/addEventListener.js")

    return gulp.src(src.lib)
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