// Generated on 2015-07-15 using generator-nodejs 2.1.0
module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['.tmp'],
    babel: {
        options: {
            sourceMap: true
        },
        dist: {
            files: {
                'dist/index.js': 'src/index.js'
            }
        },
        test: {
          files: {
            '.tmp/tests.js': 'test/tests.js'
          }
        }
    },
    jshint: {
      all: [
        'Gruntfile.js',
        'src/**/*.js',
        'test/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    mochacli: {
      all: ['.tmp/**/*.js'],
      options: {
        reporter: 'spec',
        ui: 'tdd'
      }
    },
    watch: {
      js: {
        files: ['**/*.js', '!node_modules/**/*.js'],
        tasks: ['default'],
        options: {
          nospawn: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.registerTask('build', ['babel:dist']);
  grunt.registerTask('test', ['jshint', 'build', 'babel:test', 'mochacli']);
  // grunt.registerTask('watch', ['jshint', 'babel:test', 'mochacli', 'watch']);
  grunt.registerTask('ci', ['jshint', 'babel:test', 'mochacli']);
  grunt.registerTask('default', ['test']);
};
