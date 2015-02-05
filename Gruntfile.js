module.exports = function(grunt){
    grunt.initConfig({
        mocha_istanbul: {
            coverage: {
                src: 'test', // a folder works nicely
                options: {
                    reportFormats: ['cobertura','lcovonly']
                }
            },
            jenkins: {
                src: ['test/**/*.js'],
                options: {
                    reporter: 'XUnit',
                    output: 'build/test-result.xml'
                }
            },
            coveralls: {
                src: 'test', // multiple folders also works
                options: {
                    coverage:true,
                    root: './lib', // define where the cover task should consider the root of libraries that are covered by tests
                    reportFormats: ['lcovonly']
                }
            }
        },
        istanbul_check_coverage: {
            default: {
                options: {
                    coverageFolder: 'coverage*', // will check both coverage folders and merge the coverage results
                    check: {
                        lines: 80,
                        statements: 80
                    }
                }
            }
        }

    });

    grunt.event.on('coverage', function(lcovFileContents, done){
        // Check below
        done();
    });


    grunt.loadNpmTasks('grunt-mocha-istanbul');

    grunt.registerTask('coveralls', ['mocha_istanbul:coveralls']);
    grunt.registerTask('coverage', ['mocha_istanbul:coverage']);
}