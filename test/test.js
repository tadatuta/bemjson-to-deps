var inspect = require('util').inspect,
    assert = require('assert'),
    bemjsonToDeps = require('..'),
    testsNumber = 3;

while (testsNumber) {
    var bemjson = require('./test' + testsNumber + '.bemjson.js'),
        reference = require('./reference' + testsNumber + '.deps.js');

    try {
        assert.deepEqual(bemjsonToDeps.convert(bemjson), reference, 'Test #' + testsNumber + ' failed');
    } catch(err) {
        console.log(err.message);
        console.log('getEntities\n', bemjsonToDeps.getEntities(bemjson));
        console.log('\ndenormalizeDeps\n', bemjsonToDeps.stringify(bemjson));
        console.log('\nreference\n', inspect(reference, { depth: null }));
        throw new Error(err);
    }

    testsNumber--;
}
