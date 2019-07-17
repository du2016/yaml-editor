/*global window, document, location*/
'use strict';


var jsyaml     = require('js-yaml');
var JSONEditor     = require('jsoneditor/dist/jsoneditor.min.js');
var codemirror = require('codemirror');


require('codemirror/mode/yaml/yaml.js');
require('codemirror/mode/javascript/javascript.js');
require('jsoneditor/dist/jsoneditor.min.js');


var source, result, permalink, default_text;

var SexyYamlType = new jsyaml.Type('!sexy', {
    kind: 'sequence', // See node kinds in YAML spec: http://www.yaml.org/spec/1.2/spec.html#kind//
    construct: function (data) {
        return data.map(function (string) { return 'sexy ' + string; });
    }
});

var SEXY_SCHEMA = jsyaml.Schema.create([ SexyYamlType ]);

function parse() {
    var str, obj;

    str = source.getValue();
    // permalink.href = '#yaml=' + base64.encode(str);

    try {
        obj = jsyaml.load(str, { schema: SEXY_SCHEMA });
        if (typeof(obj) === "undefined") {
            return
        }
        if (JSON.stringify(result.get()) !== JSON.stringify(obj)) {
            result.set(obj);
        }
    } catch (err) {
        result.set(err.message || String(err));
    }
}

function setsource(v) {
    // source.setValue(JSON.stringify(jsyaml.dump(v)))
    source.setValue(jsyaml.dump(v))
}

window.onload = function () {
    permalink    = document.getElementById('permalink');
    default_text = document.getElementById('source').value || '';

    source = codemirror.fromTextArea(document.getElementById('source'), {
        mode: 'yaml',
        lineNumbers: true,
        theme: 'erlang-dark'
    });

    var timer;

    source.on('change', function () {
        clearTimeout(timer);
        timer = setTimeout(parse, 500);
    });

    result = new JSONEditor(document.getElementById("result"), {
        onChangeJSON: setsource
    });

};
