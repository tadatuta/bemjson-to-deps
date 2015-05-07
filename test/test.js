var inspect = require('util').inspect,
    assert = require('assert'),
    bemjsonToDeps = require('..'),
    testsNumber = 2;

while (testsNumber) {
    var bemjson = require('./test' + testsNumber + '.bemjson.js'),
        reference = require('./reference' + testsNumber + '.deps.js');

    try {
        assert.deepEqual(bemjsonToDeps.denormalizeDeps(bemjsonToDeps.getEntities(bemjson)), reference, 'Test #' + testsNumber + ' failed');
    } catch(err) {
        console.log(err.message);
        console.log('getEntities\n', bemjsonToDeps.getEntities(bemjson));
        console.log('\ndenormalizeDeps\n', inspect(bemjsonToDeps.denormalizeDeps(bemjsonToDeps.getEntities(bemjson)), { depth: null }));
        console.log('\nreference\n', inspect(reference, { depth: null }));
        throw new Error(err);
    }

    testsNumber--;
}
