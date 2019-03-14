# babel-gettext-plugin
Extract gettext string with babel support syntax JSX, ES6, ... It is based on node-gettext.

Installation
============

`npm install babel-gettext-plugin`

Support version node 6 and Babel 7. (Tested version)

Node use
========

```js
var babel = require("babel");

babel.transform(code, {
                plugins: ["babel-gettext-plugin"]
            });
```

Command line use
================

```
babel --plugins babel-gettext-plugin code.js
```

Options
=======

You can pass options as extra in babel options :
```js
plugins: [
    ["babel-gettext-plugin", {
        headers: <Object>,
        functionNames: <Object>,
        fileName: <String>,
        defaultTranslate: <Boolean>
    }]
]
```

### headers ###
The headers to put in the po file.

```js
headers: {
    "content-type": "text/plain; charset=UTF-8",
    "plural-forms": "nplurals=2; plural=(n!=1);"
}
```

### functionNames ###
All function names to be extract. You have to precise where found the parameters
("domain", "msgctxt", "msgid", "msgid_plural" and "count") to be extract.

example:
```js
functionNames: {
        myfunction: ["msgid"]
    }
```

### fileName ###
The file name where found all extracted strings.

### defaultTranslate ###
Add in msgstr the value of msgid, if the defaultTranslate is true.

License
=======

[MIT License](LICENSE).
