var preRun = function() {
    FS.quit();
    FS.staticInit();
    FS.ignorePermissions = true;
    try
    {
        var inp = document.getElementById('inputTextarea').value;
        $('#inputPre').html(inp);
        FS.createDataFile('/', 'input.inp', inp, true, true);
    } catch (e) {
        console.log('/input.inp creation failed');
    }
    rendersvg();
},
        postRun = function() {
    var t = Module.intArrayToString(FS.findObject('/report.txt').contents)
    t = t.replace(/&/g, "&amp;");
    t = t.replace(/</g, "&lt;");
    t = t.replace(/>/g, "&gt;");
    $('#output').html(t);
},
        Module = {
    arguments: ['/input.inp', '/report.txt', '/report.bin'],
    preRun: preRun,
    postRun: postRun
};

runButton = function() {
    Module.run();
}

function parseINP(inp) {
    var regex = {
        section: /^\s*\[\s*([^\]]*)\s*\].*$/,
        value: /\s*([^\s]+)([^;]*).*$/,
        comment: /^\s*;.*$/
    };
    var model = {};
    var lines = inp.split(/\r\n|\r|\n/);
    var section = null;
    lines.forEach(function(line) {
        if (regex.comment.test(line)) {
            return;
        } else if (regex.section.test(line)) {
            var s = line.match(regex.section);
            model[s[1]] = {};
            section = s[1];
        } else if (regex.value.test(line)) {
            var v = line.match(regex.value);
            model[section][v[1]] = v[2];
        }
        ;
    });
    return model;
}
