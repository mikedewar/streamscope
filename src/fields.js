import * as THREE from 'three';

export class Fields {
    constructor(numFields, totalWidth) {

        // temp
        const fields = ["a", "b", "c"];


        this.fields = Array.from(
            { length: numFields },
            (_, i) => new Force(i, totalWidth / numFields, fields[i])
        )

    }
}

class Field {

    constructor(idx, width, field) {
        this.idx = idx;
        this.width = width;
        this.left = idx * width;
        this.right = (idx + 1) * width;
        this.field = field;
        const material = new THREE.LineBasicMaterial({ color: "#243f39" });
        const geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(this.left, -10, 0),
            new THREE.Vector3(this.left, 10, 0)
        ]);
        this.line = new THREE.LineSegments(geometry, material);
        this.dx = x => 0.03 + x;
        this.dy = y => y;
    }
}

class Force extends Field {

    constructor(idx, width, field) {
        super(idx, width, field);
        this.type = "Force"
    }

    exert(dot) {
        dot.points.position.x = this.dx(dot.points.position.x)
        dot.points.position.y = this.dy(dot.points.position.y)
    }

}

class Colour extends Field {
    constructor(idx, width, field) {
        super(idx, width, field);
    }
}

function stringToColour(str) {
    // https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
}