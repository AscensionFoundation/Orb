module.exports = function( grunt ) {

	//grunt.file.setBase

	// intitial configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			build: {
				dest:	'../build/Orb.js',
				//src:	['../src/orb.js', '../src/core/*.js', '../src/**/*.js']
				src:	[
					'../src/orb.js',
					'../src/core/**/*.js',
					'../src/**/*.js'
				]
			}
		},

		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			build: {
				dest:	'../build/Orb.min.js',

				src:	'../build/Orb.js'
			}
		},

		watch: {
			//files: ['<%= jshint.files %>'],
			files: '<%= concat.build.src %>',
			tasks: ['concat', 'uglify']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['concat', 'uglify']);
};