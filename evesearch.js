var // Get our SQLite promise library
    sqlite = require('./node/sqlite-promise').sqlite,
    // Get out the promise library
    promise = require('./lib/promise').Promise,
    collect = require('./lib/promise-utils').collect,
    ListPromise = require('./lib/promise-utils').ListPromise,

    // Some boring code we don't need to see...
    queries = require('./node/sqlite-queries'),
    utils = require('./node/utils'),

    // the last command line argument is our query (NO TABLE INJECTION PLS!)
    query = process.argv.pop();
    

var db = sqlite('./data/database.sqlite');


function resolveSkills(typeId) {
    return db.all(queries.SKILL_QUERY, { $typeId: typeId });
}

db.one(queries.SHIP_QUERY, { $typeName: '%' + query + '%' }).then(function(ship) {
    collect([
        db.all(queries.ATTRIBUTE_QUERY, { $typeId: ship.typeID }),
        resolveSkills(ship.typeID),

    ]).then(function(ret) {
        var attrs = ret[0],
            skills = ret[1];
        console.log(skills);
        // utils.printShip(ship, skills, attrs);
    })
})