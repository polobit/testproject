/**
 * Created by mattijsnaus on 1/27/16.
 */
/* globals desc:false, task:true, fail:false, complete:false, jake:false, directory:false */
(function () {
    "use strict";

    var packageJson = require('./package.json');
    var semver = require('semver');
    var minifier = require('minifier');
    var concat = require('concat');
    var jshint = require('simplebuild-jshint');
    var shell = require('shelljs');

    var BUILD_DIR = "source/build/";
    var JSBUILD_DIR = BUILD_DIR + 'js/';
    var CSSBUILD_DIR = BUILD_DIR + 'css/';

    var lintFiles = [
        "Jakefile.js",
        "source/js/modules/*.js"
    ];

    var lintOptions = {
        bitwise: true,
        eqeqeq: true,
        forin: true,
        freeze: true,
        futurehostile: true,
        newcap: true,
        latedef: 'nofunc',
        noarg: true,
        nocomma: true,
        nonbsp: true,
        nonew: true,
        strict: true,
        undef: true,
        node: true,
        browser: true,
        loopfunc: true,
        laxcomma: true,
        '-W089': false,
        '-W055': false,
        '-W069': false
    };

    var lintGlobals = {
        define: false,
        alert: false,
        confirm: false,
        ace: false,
        $: false,
        jQuery: false
    };

    var requiredJS = [
        {
            files: ['source/js/vendor/jquery.min.js', 'source/js/vendor/jquery-ui.min.js', 'source/js/vendor/flat-ui-pro.min.js', 'source/js/vendor/chosen.min.js', 'source/js/vendor/jquery.zoomer.js', 'source/js/vendor/spectrum.js', 'source/js/vendor/summernote.min.js', 'source/js/vendor/ace/ace.js', JSBUILD_DIR + 'builder.min.js'],
            output: JSBUILD_DIR + "builder.min.js"
        }
    ];


    //**** Main Jake tasks

    desc("The default build task");
    task("default", [ "nodeversion", "build" ], function () {

        console.log('Build OK');

    });

    desc("The actual build task");
    task("build", [ "linting", "minifyElementJS", "minifyElementCSS", "minifyMainCSS", "minifySkeletonCSS", "minifyBuilderCSS", "buildJS" ], function () {

        console.log("Building SiteBuilder Lite");

    });

    desc("The actual build task, builder JS only");
    task("buildJS", [ "linting" ], function () {

        console.log("Building SiteBuilder Lite, UI js code");

        shell.rm('-rf', JSBUILD_DIR + "builder.min.js");

        var cmds = [
            "node node_modules/browserify/bin/cmd.js source/js/builder.js --debug -o " + JSBUILD_DIR + "builder.min.js"
        ];

        //sites.js
        jake.exec(
            cmds, 
            { interactive: true }, 
            function () {
                
                console.log("Minifying builder JS: .");

                minifier.minify(requiredJS[0].files, {output: requiredJS[0].output});

                complete();
            }
        );

    });


    //**** Supporting Jake tasks

    desc("Check Nodejs version");
    task("nodeversion", function () {

        console.log("Checking Nodejs version: .");

        var requiredVersion = packageJson.engines.node;
        var actualVersion = process.version;

        if( semver.neq(requiredVersion, actualVersion) ) {
            fail("Incorrect Node version; expected " + requiredVersion + " but found " + actualVersion);
        }

    });

    desc("Linting of JS files");
    task("linting", function () {

        process.stdout.write("Linting JS code: ");
        
        jshint.checkFiles({
            files: lintFiles,
            options: lintOptions,
            globals: lintGlobals
        }, complete, fail);

    }, { async: true });

    desc("Minify elements JS");
    task("minifyElementJS", function () {

        console.log("Minifying elements JS: .");

        minifier.minify(
            ['source/elements/js/jquery.min.js', 'source/elements/js/flat-ui-pro.min.js', 'source/elements/js/custom.js'],
            {output: JSBUILD_DIR + 'elements.min.js'}
        );

    });

    desc("Concatenate and minify element CSS");
    task("minifyElementCSS", function () {

        console.log("Concatenating element CSS: .");

        concat([
                'source/elements/css/vendor/bootstrap.min.css',
                'source/elements/css/flat-ui-pro.min.css',
                'source/elements/css/style.css',
                'source/elements/css/font-awesome.css'
            ],
            CSSBUILD_DIR + 'elements.min.css',
            function (error) {

                if( error ) {
                    console.log(error);
                } else {
                    console.log("Minifying element CSS: .");
                    minifier.minify(CSSBUILD_DIR + 'elements.min.css', { output: CSSBUILD_DIR + 'elements.min.css' });
                }

                complete();

            }
        );

    }, { async: true });

    desc("Concatenate and minify main css");
    task("minifyMainCSS", function () {

        console.log("Concatenate main CSS: .");

        concat([
                'source/css/vendor/bootstrap.min.css',
                'source/css/flat-ui-pro.css',
                'source/css/style.css',
                'source/css/login.css',
                'source/css/font-awesome.css'
            ],
            CSSBUILD_DIR + 'main.min.css',
            function (error) {

                if( error ) {
                    console.log(error);
                } else {
                    console.log("Minifying main CSS: .");
                    minifier.minify(CSSBUILD_DIR + 'main.min.css', { output: CSSBUILD_DIR + 'main.min.css' });
                }

                complete();

            }
        );

    }, { async: true });

    desc("Concatenate and minify skeleton CSS");
    task("minifySkeletonCSS", function () {

        console.log("Concatenate skeleton CSS: .");

        concat([
                CSSBUILD_DIR + 'elements.min.css',
                'source/elements/css/style-contact.css',
                'source/elements/css/style-content.css',
                'source/elements/css/style-dividers.css',
                'source/elements/css/style-footers.css',
                'source/elements/css/style-headers.css',
                'source/elements/css/style-portfolios.css',
                'source/elements/css/style-pricing.css',
                'source/elements/css/style-team.css',
                'source/elements/css/nivo-slider.css',
                'source/elements/css/newtemplate.css'
            ],
            CSSBUILD_DIR + 'skeleton.min.css',
            function (error) {
                
                if( error ) {
                    console.log(error);
                } else {
                    console.log("Minifying skeleton CSS: .");
                    minifier.minify(CSSBUILD_DIR + 'skeleton.min.css', { output: CSSBUILD_DIR + 'skeleton.min.css' });
                }

                complete();

            }
        );

    }, { async: true });

    desc("Concatenate and minify builder CSS");
    task("minifyBuilderCSS", function () {

        console.log("Concatenate builder CSS: .");

        concat([
                'source/css/builder.css',
                'source/css/spectrum.css',
                'source/css/chosen.css',
                'source/css/summernote.css'
            ],
            CSSBUILD_DIR + 'builder.min.css',
            function (error) {
                
                if( error ) {
                    console.log(error);
                } else {
                    console.log("Minifying builder CSS: .");
                    minifier.minify(CSSBUILD_DIR + 'builder.min.css', { output: CSSBUILD_DIR + 'builder.min.css' });
                }

                complete();

            }
        );

    }, { async: true });

    desc("Concatenate and minify builder JS");
    task("minifyMainJS", function (page) {

        console.log("Minifying builder JS: .");

        for( var x = 0; x < requiredJS.length; x++ ) {
            minifier.minify(requiredJS[x].files, {output: requiredJS[x].output});
        }

    });

    desc("Runs a local http server");
    task("serve", function () {

        console.log("Serve block locally:");

        jake.exec("node_modules/.bin/http-server elements", { interactive: true }, complete);

    }, { async: true });

    directory(JSBUILD_DIR);

}());