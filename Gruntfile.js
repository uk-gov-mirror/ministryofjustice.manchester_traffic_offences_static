module.exports = function(grunt) {

  'use strict';

  // Load tasks
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('assemble');

  /**
   * Default source paths
   * @type {Object}
   */
  var srcPaths = {
    templates: 'templates',
    styles: 'assets/stylesheets/',
    scripts: 'assets/javascripts/',
    images: 'assets/images/'
  };

  /**
   * Default destination paths
   * @type {Object}
   */
  var destPaths = {
    templates: 'public_html/',
    styles: 'public_html/assets/stylesheets/',
    scripts: 'public_html/assets/javascripts/',
    images: 'public_html/assets/images/'
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
        src: [srcPaths.styles + 'app.scss'],
        dest: destPaths.styles + 'app.css'
      },
      options: {
        loadPath: [
          'node_modules/govuk_frontend_toolkit/stylesheets/',
          'bower_components/moj_elements/dist/stylesheets/'
        ]
      }
    },
    
    jshint: {
      files: [
        'Gruntfile.js',
        srcPaths.scripts + 'app.js'
      ],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    
    concat: {
      files: {
        src: [srcPaths.scripts + 'plugins/**.*.js', srcPaths.scripts + 'app.js'],
        dest: destPaths.scripts + 'application.js'
      },
      options: {
        separator: ';',
      }
    },
    
    imagemin: {
      files: {
        expand: true,
        cwd: srcPaths.images,
        src: ['**/*.{png,jpg,gif}'],
        dest: destPaths.images
      }
    },
    
    watch: {
      assemble: {
        files: ['templates/**/*.hbs','templates/data.yml'],
        tasks: ['assemble']
      },
      sass: {
        files: [srcPaths.styles + '**/*.scss'],
        tasks: ['sass']
      },
      jshint: {
        files: [
          'Gruntfile.js',
          srcPaths.scripts + '**/*.js'
        ],
        tasks: ['jshint']
      },
      js: {
        files: [srcPaths.scripts + '**/*.js'],
        tasks: ['concat']
      }
    },

    connect: {
      server: {
        options: {
          hostname: 'localhost',
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
  grunt.registerTask('default', ['server']);

  grunt.registerTask('build', 'Lint, test and compile prod-ready assets', [
    'assemble',
    'sass',
    'jshint',
    'concat',
    'imagemin'
  ]);
  
  grunt.registerTask('server', 'Fire up the dev static server and start watch task', ['concurrent:dev']);

};