"use strict";

var assert = require("assert");
var babel = require("babel-core");

var fs = require("fs");
var plugin = "./index.js";

describe("babel-gettext-plugin", function() {

    describe("#extract()", function() {

        it("Should return a result", function() {
            var result = babel.transform("let t = _t('code');_t('hello');", {
                plugins: [
                    [plugin, {
                        functionNames: {
                           _t: ["msgid"]
                        },
                        fileName: "./test/first.po"
                    }]
                ]
            });
            assert(!!result);

            var content = fs.readFileSync("./test/first.po");
            assert(!!content);
        });

        it("Should return a result", function() {
            var result = babel.transform("let t = _t('code');", {
                plugins: [
                    [plugin, {
                        functionNames: {
                           _t: ["msgid"]
                        },
                        fileName: "./test/defaultTranslate.po",
                        defaultTranslate: true
                    }]
                ]
            });
            assert(!!result);

            var content = fs.readFileSync("./test/defaultTranslate.po");
            assert(content.indexOf("msgstr \"code\"") !== -1);
        });

        it("No file", function() {
            var result = babel.transform("let t = _t('code');_t('hello');", {
                plugins: [
                    [plugin, {
                        fileName: "./test/test2.po"
                    }]
                ]
            });

            assert(!!result);
            assert(!fs.existsSync("./test/test2.po"));
        });

        it("Should return a result", function() {
            var result = babel.transform("dnpgettext('mydomain', 'mycontext', 'msg', 'plurial', 10)", {
                plugins: [
                    [plugin, {
                        fileName: "./test/dnpgettext.po"
                    }]
                ]
            });
            assert(!!result);

            var content = fs.readFileSync("./test/dnpgettext.po");
            assert(!!content);
        });

        it("Should return a result", function() {
            var result = babel.transform("let jsx = <h1>{_t('title')}</h1>", {
                presets: ["react"],
                plugins: [
                    [plugin, {
                        functionNames: {
                           _t: ["msgid"]
                        },
                        fileName: "./test/react.po"
                    }]
                ]
            });
            assert(!!result);

            var content = fs.readFileSync("./test/react.po");
            assert(!!content);
        });

    });
});
