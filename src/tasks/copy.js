String.prototype.splice = function( idx, rem, s ) {
		return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
};

module.exports = function(grunt) {

	grunt.registerMultiTask( 'copy', 'Copy files using grunt', function() {
		var path = require('path'),
			fs = require('fs'),
			data = this.data,
			src = grunt.file.expand(data.src),
			dest = grunt.template.process(data.dest),
			stats,
			destIsDir = path.extname(dest) === '',
			excludes = data.exclude || [];

		if(destIsDir && !fs.exists(dest)){
			grunt.file.mkdir(dest);
		}

		for (var i = 0; i < src.length; i++) {
			var item = src[i],
				name = path.basename(item),
				excluded = false;

			for (var j = 0; j < excludes.length; j++) {
				if (name.match(excludes[j])) {
					excluded = true;
					break;
				}
			}

			if (excluded) {
				continue;
			}

			if (data.modify !== undefined) {
				var m = name.match(data.modify.pattern);
				if (m) {
					name = name.splice(m.index, 0, grunt.template.process(data.modify.text));
				}
			}			


			stats = fs.lstatSync(item);
			if(!stats.isDirectory()) {
				grunt.file.copy(item, destIsDir ? dest + name : dest );
			}
		}
	});
};
