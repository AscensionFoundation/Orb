module.exports = function( grunt ) {

	//grunt.file.setBase

	// intitial configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		babel: {
	        options: {
	        },
	        dist: {
	            files: {
	                '../build/Orb5.js': '../build/Orb.js'
	            }
	        }
	    },

		concat: {
			build: {
				dest:	'../build/Orb.js',
				src:	[
					'../src/Orb.js',
					'../src/core/**/*.js',
					'../src/**/*.js'
				]
			}
		},

		uglify: {
			options: {
				banner: '/*! Orb.js <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			build: {
				dest:	'../build/Orb.min.js',
				src:	'../build/Orb5.js'
			}
		},

		watch: {
			//files: ['<%= jshint.files %>'],
			files: ['<%= concat.build.src %>', '../src/constants/*', '!../src/constants/Constants.g.js'],
			tasks: ['filesToJavascript', 'concat', 'babel', 'uglify', 'copy', 'play:complete']
		},

		copy: {
			main: {
				src: '../build/*',
				dest: '../examples/orb/'
			}
		},

		filesToJavascript: {
			default_options: {
				options: {
					inputFilesFolder : '../src/constants',
					inputFileExtension : '.var',
					useIndexes : true,
					variableIndexMap : {
					    'vs-' : "'Vertex'",
					    'fs-' : "'Fragment'",
					},
					outputBaseFile : '../src/constants/Constants.g',
					outputBaseFileVariable : 'orb.Constants',
					outputFile : '../src/constants/Constants.g.js'
				}
			}
		},

    	play: {
			complete: {
				file: './complete.wav'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-files-to-javascript-variables');
	grunt.loadNpmTasks('grunt-play');
	grunt.loadNpmTasks('grunt-babel');

	grunt.registerTask('default', ['filesToJavascript', 'concat', 'babel', 'uglify', 'copy']);
};