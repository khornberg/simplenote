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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.registerTask('build', ['babel:dist']);
  grunt.registerTask('test', ['jshint', 'build', 'babel:test', 'mochacli']);
  grunt.registerTask('default', ['test']);
};
