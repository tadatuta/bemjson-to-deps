var _ = require('lodash'),
    stringifyObj = require('stringify-object');

function getEntities(bemjson, ctx) {
    ctx = ctx || {};

    var deps = [],
        contentDeps;

    if (Array.isArray(bemjson)) {
        bemjson.forEach(function(item) {
            contentDeps = getEntities(item, ctx);
            contentDeps && (deps = deps.concat(contentDeps));
        });

        return deps;
    }

    if (typeof bemjson !== 'object') return;

    bemjson.block && (ctx.block = bemjson.block);

    var depItem = {
        block: ctx.block
    };

    bemjson.elem && (depItem.elem = bemjson.elem);
    bemjson.mods && (depItem.mods = bemjson.mods);
    bemjson.elemMods && (depItem.elemMods = bemjson.elemMods);

    deps.push(depItem);

    bemjson.mix && (deps = deps.concat(getEntities(bemjson.mix, ctx)));

    bemjson.content && (deps = deps.concat(getEntities(bemjson.content, ctx)));

    return deps;
}

function denormalizeDeps(deps) {
    var denormalizedDeps = [];

    deps.forEach(function(item) {
        if (typeof item !== 'object') return;

        var blockIdx = findIndexByName(denormalizedDeps, 'block', item.block);
        if (blockIdx < 0) return denormalizedDeps.push(item);

        var currentBlockItem = denormalizedDeps[blockIdx];

        if (item.elem) {
            delete item.block;

            if (item.elemMods) {
                item.mods = item.mods ? _.extend(item.mods, item.elemMods) : item.elemMods;
                delete item.elemMods;
            }

            if (!currentBlockItem.elems) {
                currentBlockItem.elems = [item];
            } else {
                var idx = findIndexByName(currentBlockItem.elems, 'elem', item.elem);

                if (idx < 0) {
                    currentBlockItem.elems.push(item);
                } else if (item.mods) {
                    var currentBlockItemElem = currentBlockItem.elems[idx];
                    if (!currentBlockItemElem.mods) {
                        currentBlockItem.elems[idx] = item;
                    } else {
                        mergeMods(currentBlockItem.elems[idx].mods, item.mods);
                    }
                }
            }
        } else if (item.mods) {
            if (currentBlockItem.mods) {
                mergeMods(currentBlockItem.mods, item.mods);
            } else {
                currentBlockItem.mods = item.mods;
            }
        }

    });

    denormalizedDeps.forEach(function(item, idx) {
        // { block: 'b1' } -> 'b1'
        if (Object.keys(item).length === 1) return denormalizedDeps[idx] = item.block;

        if (!item.elems) return;

        // { elem: 'e1' } -> ['e1']
        item.elems.forEach(function(elem, idx) {
            if (typeof elem === 'string') return;

            Object.keys(elem).length === 1 && (item.elems[idx] = elem.elem);
        });

        item.elems = _.unique(item.elems);
    });

    return denormalizedDeps;
}

/*
* Gets index of { key: name } in arr
* arr can have items in { key: 'name' } and 'name' formats
*/
function findIndexByName(arr, key, name) {
    for (var idx = 0; idx < arr.length; idx++) {
        var currentName = typeof arr[idx] === 'string' ?
            arr[idx] : arr[idx][key];

        if (name === currentName) return idx;
    }

    return -1;
}

/*
* Changes modsInto by reference, returns undefined
*/
function mergeMods(modsInto, modsToMerge) {
    Object.keys(modsToMerge).forEach(function(mod) {
        var modInto = modsInto[mod],
            modToMerge = modsToMerge[mod];

        if (!modInto) return modsInto[mod] = modToMerge;

        modsInto[mod] = _.unique([].concat(modToMerge, modInto));

        // { m1: ['v1'] } -> { m1: 'v1' }
        modsInto[mod].length === 1 && (modsInto[mod] = modsInto[mod][0]);
    });
}

function convert(bemjson, ctx) {
    return denormalizeDeps(getEntities(bemjson, ctx));
}

function stringify(bemjson, ctx, opts) {
    opts || (opts = {});
    opts.indent || (opts.indent = '    ');

    return stringifyObj(convert(bemjson, ctx), opts);
}

module.exports = {
    getEntities: getEntities,
    denormalizeDeps: denormalizeDeps,
    convert: convert,
    stringify: stringify
};
