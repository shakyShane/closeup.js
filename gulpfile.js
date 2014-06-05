var gulp   = require("gulp");
var jshint = require("gulp-jshint");
var uglify = require("gulp-uglify");

gulp.task("build", function () {
    return gulp.src("lib/norman.js")
        .pipe(uglify())
        .pipe(gulp.dest("dist"));
});

gulp.task('lint', function () {
    gulp.src(["test/specs/*.js", "lib/*.js"])
        .pipe(jshint(".jshintrc"))
        .pipe(jshint.reporter("default"))
        .pipe(jshint.reporter("fail"))
});