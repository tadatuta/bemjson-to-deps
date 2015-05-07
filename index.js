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

module.exports.getEntities = getEntities;
