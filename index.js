"use strict";

var gettextParser = require("gettext-parser");
var fs = require("fs");

var DEFAULT_FUNCTION_NAMES = {
    gettext: ["msgid"],
    dgettext: ["domain", "msgid"],
    ngettext: ["msgid", "msgid_plural", "count"],
    dngettext: ["domain", "msgid", "msgid_plural", "count"],
    pgettext: ["msgctxt", "msgid"],
    dpgettext: ["domain", "msgctxt", "msgid"],
    npgettext: ["msgctxt", "msgid", "msgid_plural", "count"],
    dnpgettext: ["domain", "msgctxt", "msgid", "msgid_plural", "count"]
};

var DEFAULT_FILE_NAME = "gettext.po";

var DEFAULT_HEADERS = {
    "content-type": "text/plain; charset=UTF-8",
    "plural-forms": "nplurals = 2; plural = (n !== 1);"
};

exports.default = function() {
    var currentFileName;
    var data;

    return {visitor: {

            CallExpression(nodePath, plugin) {
                var functionNames = plugin.opts && plugin.opts.functionNames || DEFAULT_FUNCTION_NAMES;
                var fileName = plugin.opts && plugin.opts.fileName || DEFAULT_FILE_NAME;
                var headers = plugin.opts && plugin.opts.headers || DEFAULT_HEADERS;

                if (fileName !== currentFileName) {
                    currentFileName = fileName;

                    data = {
                        charset: "UTF-8",

                        headers: headers,

                        translations: {
                            context: {
                            }
                        }
                    };

                    headers["plural-forms"] = headers["plural-forms"] || DEFAULT_HEADERS["plural-forms"];
                    headers["content-type"] = headers["content-type"] || DEFAULT_HEADERS["content-type"];
                }
                var defaultContext = data.translations.context;
                var nplurals = /nplurals ?= ?(\d)/.exec(headers["plural-forms"])[1];

                let callee = nodePath.node.callee;
                if (functionNames.hasOwnProperty(callee.name)
                        || callee.property && functionNames.hasOwnProperty(callee.property.name)) {

                    var functionName = functionNames[callee.name] || functionNames[callee.property.name];
                    var translate = {};

                    var args = nodePath.node.arguments;
                    for (var i = 0, l = args.length; i < l; i++) {
                        var name = functionName[i];

                        if (name && name !== "count" && name !== "domain") {
                            var arg = args[i];
                            var value = arg.value;

                            if (value) {
                                translate[name] = value;
                            }

                            if (name === "msgid_plural") {
                                translate.msgstr = [];
                                for (var p = 0; p < nplurals; p++) {
                                    translate.msgstr[p] = "";
                                }
                            }
                        }
                    }

                    var context = defaultContext;
                    var msgctxt = translate.msgctxt;
                    if (msgctxt) {
                        data.translations[msgctxt] = data.translations[msgctxt] || {};
                        context = data.translations[msgctxt];
                    }

                    context[translate.msgid] = translate;

                    var output = gettextParser.po.compile(data);
                    fs.writeFileSync(fileName, output);
                }
            }
        }
    };
};
