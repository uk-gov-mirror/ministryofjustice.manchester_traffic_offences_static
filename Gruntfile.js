module.exports = function(grunt) {

  'use strict';

  // Load tasks
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('assemble');

  var baseURL = 'https://www.makeaplea.justice.gov.uk';

  var paths = {
    dest_dir: 'public_html/assets/',
    src_dir: 'assets-src/',
    styles: 'assets-src/stylesheets/',
    scripts: [
      'assets-src/javascripts/shims/**/*.js',
      'assets-src/javascripts/modules/**/*.js',
      'assets-src/javascripts/application.js'
    ],
    vendor_scripts: 'assets-src/javascripts/vendor/',
    govuk_scripts: 'node_modules/govuk_frontend_toolkit/javascripts/**/*.js',
    test_scripts: 'assets-src/tests/**/*.js',
    images: 'assets-src/images/'
  };

  /**
   * Grunt tasks
   * @type {Object}
   */
  grunt.initConfig({

    assemble: {
      options: {
        partials: ['templates/partials/**/*.hbs'],
        helpers: ['helpers/**/*.js'],
        data: 'templates/data.yml',
        flatten: true,
      },
      pages: {
        options: {
          layout: ['templates/layouts/default.hbs']
        },
        src: ['templates/pages/*.hbs'],
        dest: 'public_html/',
      },
      emails: {
        options: {
          layout: ['templates/layouts/email.hbs']
        },
        src: ['templates/emails/*.hbs'],
        dest: 'emails/src/'
      }
    },

    'regex-replace': {
      addBaseURL: {
        src: ['emails/src/**/*.html'],
        actions: [
          {
            name: "absolute-urls",
            search: /href="(\/+.[^"]*)"/g,
            replace: 'href="' + baseURL + '$1"'
          }
        ]
      }
    },

    juice: {
      inline: {
        options: {
          removeStyleTags: false,
          webResources: {
            images: false
          }
        },
        files : [{
          expand: true,
          cwd: 'emails/src/',
          src: ['**/*.html'],
          dest: 'emails/inlined/',
        }]
      }
    },

    sass: {
      files: {
        expand: true,
        cwd: paths.styles,
        src: ['**/*.scss'],
        dest: paths.dest_dir + 'stylesheets'
      },
      options: {
        loadPath: [
          'node_modules/govuk_frontend_toolkit/',
          'node_modules/govuk_frontend_toolkit/stylesheets/',
          'assets-src/stylesheets'
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
        files: ['templates/pages/*.hbs','templates/data.yml', 'templates/layouts/default.hbs', 'templates/partials/pages/*.hbs'],
        tasks: ['newer:assemble:pages']
      },
      assembleEmails: {
        files: ['templates/emails/*.hbs', 'templates/emails.yml', 'templates/layouts/email.hbs', 'templates/partials/emails/*.hbs'],
        tasks: ['emails']
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
    'assemble:pages',
    'sass',
    'jshint',
    'copy',
    'concat',
    'imagemin',
  ]);

  grunt.registerTask('emails', 'Build emails with styles inlined', [
    'assemble:emails',
    'regex-replace',
    'juice'
  ]);
  
  grunt.registerTask('server', 'Fire up the dev static server and start watch task', ['concurrent:dev']);

};
