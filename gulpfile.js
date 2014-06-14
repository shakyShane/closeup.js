var gulp       = require("gulp");
var jshint     = require("gulp-jshint");
var uglify     = require("gulp-uglify");
var concat     = require("gulp-concat");
var rename     = require("gulp-rename");
var browserify = require("gulp-browserify");
var stripDebug = require('gulp-strip-debug');
var through2   = require("through2");


var src = {
    lib: ["lib/index.js"]
};

gulp.task("stripper", function () {
    gulp.src("lib/*.js")
        .pipe(stripIf({mouse: true, touch:true}))
        .pipe(gulp.dest("./tmp"));
});

gulp.task("build-lib", function () {

    return gulp.src("lib/index.js")
        .pipe(browserify())
//        .pipe(stripDebug())
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

gulp.task('watch', function () {
    gulp.watch(['test/specs/*.js', 'lib/*.js'], ['build-lib']);
});

gulp.task("dev", ['build-lib', 'watch']);

gulp.task('build-all', ['build-lib', 'build-poly']);

/**
 * Strip debug statements
 * @returns {*}
 */
function stripIf (keys) {

    return through2.obj(function (file, enc, cb) {

        var string = file.contents.toString();

        Object.keys(keys).forEach(function (key) {

            var regex = new RegExp("\/\\*\\* ?stripif:"+key+" ?\\*\\*\/[\\s\\S]*\/\\*\\* ?stripif:"+key+":end ?\\*\\*\/");

            string = string.replace(regex, "");

        });

        file.contents = new Buffer(string);

        this.push(file);

        cb();

    });
};
