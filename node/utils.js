var colors = require('colors');

function printSkill(i) {
    return function(s) {
        console.log(Array(i+1).join('  ') + s.skillName, ':', s.requiredLevel);
    
        if(s.prerequisites) {
            s.prerequisites.forEach(printSkill(i + 1));
        }
    }
}

function printAttrs(attrs) {
    var maxlen = attrs.reduce(function(prev, it) {
        return Math.max(prev, it.displayName.length);
    }, 0);
    
    var pad = Array(maxlen + 2).join(' ');
    
    attrs.forEach(function(attr) {
        console.log(
            (pad + (attr.displayName || attr.attributeName)).slice(-maxlen),
            ':',
            attr.value
        );
    })
}

function printShip(ship, skills, attrs) {
    console.log();
    console.log(("Ship: " + ship.typeName + ' (' + ship.groupName + ')').bold.underline);
    console.log();
    
    console.log("Required skills".bold);
    skills.forEach(printSkill(1))
    console.log();

    printAttrs(attrs);

}

module.exports = {
    printShip: printShip,
    printSkill: printSkill
};