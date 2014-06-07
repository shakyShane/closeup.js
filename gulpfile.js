var gulp   = require("gulp");
var jshint = require("gulp-jshint");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var rename = require("gulp-rename");

gulp.task("build", function () {
    return gulp.src(["bower_components/norman.js/lib/norman.js", "lib/closeup.js"])
        .pipe(concat("closeup.js"))
        .pipe(gulp.dest("./dist"))
        .pipe(uglify())
        .pipe(rename("closeup.min.js"))
        .pipe(gulp.dest("./dist"));
});

gulp.task('lint', function () {
    gulp.src(["test/specs/*.js", "lib/*.js"])
        .pipe(jshint(".jshintrc"))
        .pipe(jshint.reporter("default"))
        .pipe(jshint.reporter("fail"));
});