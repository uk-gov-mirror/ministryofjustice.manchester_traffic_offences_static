module.exports = function(grunt) {

  'use strict';

  // Load tasks
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('assemble');

  // var pleas_dir = '../manchester_traffic_offences_pleas/manchester_traffic_offences/';
  var pleas_dir = '';

  var paths = {
    dest_dir: 'public_html/assets/',
    src_dir: pleas_dir + 'assets-src/',
    styles: pleas_dir + 'assets-src/stylesheets/',
    scripts: [
      pleas_dir + 'assets-src/javascripts/shims/**/*.js',
      pleas_dir + 'assets-src/javascripts/modules/**/*.js',
      pleas_dir + 'assets-src/javascripts/application.js'
    ],
    vendor_scripts: pleas_dir + 'assets-src/javascripts/vendor/',
    govuk_scripts: 'node_modules/govuk_frontend_toolkit/javascripts/**/*.js',
    test_scripts: pleas_dir + 'assets-src/tests/**/*.js',
    images: pleas_dir + 'assets-src/images/'
  };

  /**
   * Grunt tasks
   * @type {Object}
   */
  grunt.initConfig({

    assemble: {
      options: {
        partials: ['templates/partials/**/*.hbs'],
        layout: ['templates/layouts/default.hbs'],
        data: 'templates/data.yml',
        helpers: ['helpers/**/*.js'],
        flatten: true,
      },
      files: {
        src: ['templates/pages/*.hbs'],
        dest: 'public_html'
      }
    },

    sass: {
      files: {
        expand: true,
        cwd: paths.styles,
        src: ['**/*.scss'],
        dest: paths.dest_dir + 'stylesheets',
        ext: '.css'
      },
      options: {
        loadPath: [
          'node_modules/govuk_frontend_toolkit/',
          'node_modules/govuk_frontend_toolkit/stylesheets/',
          pleas_dir + 'assets-src/stylesheets'
        ]
      }
    },

    jshint: {
      files: [
        'Gruntfile.js',
        paths.scripts
      ],
      options: {
        globals: {
          jQuery: true
        }
      }
    },

    copy: {
      files: {
        cwd: paths.vendor_scripts,
        src: '**/*',
        dest: paths.dest_dir + 'javascripts/vendor',
        expand: true
      }
    },

    concat: {
      js: {
        files: [
          {
            src: paths.scripts,
            dest: paths.dest_dir + 'javascripts/application.js'
          },
          {
            src: paths.govuk_scripts,
            dest: paths.dest_dir + 'javascripts/govuk.js'
          }
        ]
      },
      options: {
        separator: ';',
      }
    },

    imagemin: {
      files: {
        expand: true,
        cwd: paths.images,
        src: ['**/*.{png,jpg,gif}'],
        dest: paths.dest_dir + 'images'
      }
    },

    watch: {
      assemble: {
        files: ['templates/**/*.hbs','templates/data.yml'],
        tasks: ['newer:assemble']
      },
      sass: {
        files: paths.styles,
        tasks: ['sass']
      },
      jshint: {
        files: [
          'Gruntfile.js',
          paths.scripts
        ],
        tasks: ['jshint']
      },
      copy: {
        files: paths.vendor_scripts,
        tasks: ['copy']
      },
      js: {
        files: paths.scripts,
        tasks: ['concat']
      }
    },

    connect: {
      server: {
        options: {
          hostname: '0.0.0.0',
          port: 9000,
          base: 'public_html',
          keepalive: true
        }
      }
    },

    concurrent: {
      dev: {
        tasks: ['connect:server', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });


  // Register tasks
  grunt.registerTask('default', ['build']);

  grunt.registerTask('build', 'Lint, test and compile prod-ready assets', [
    'assemble',
    'sass',
    'jshint',
    'copy',
    'concat',
    'imagemin'
  ]);

  grunt.registerTask('server', 'Fire up the dev static server and start watch task', ['concurrent:dev']);

};