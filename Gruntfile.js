module.exports = function(grunt) {
  
  require('google-closure-compiler').grunt(grunt);
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        banner: '// Simple2D.js — v<%= pkg.version %>, built <%= grunt.template.today("mm-dd-yyyy") %>\n\n',
        separator: '\n\n'
      },
      dist: {
        src: [
          'src/start.js',
          'src/simple2d.js',
          'src/shapes.js',
          'src/image.js',
          'src/sprite.js',
          'src/text.js',
          'src/sound.js',
          'src/music.js',
          'src/input.js',
          'src/window.js',
          'src/gl.js',
          'src/end.js'
        ],
        dest: 'build/simple2d.js'
      }
    },
    eslint: {
      dist: ['build/simple2d.js']
    },
    'closure-compiler': {
      dist: {
        files: {
          'build/simple2d.min.js': ['build/simple2d.js']
        },
        options: {
          compilation_level: 'SIMPLE'
          // ,formatting: 'pretty_print'
        }
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  
  // Define tasks
  grunt.registerTask('default', [
    'concat',
    'eslint',
    'closure-compiler'
  ]);
};
