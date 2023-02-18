import * as THREE from 'three';
import * as text from './text.js';
import * as scene from './scene.js';

export class Sections {
    constructor(numSections, totalWidth) {

        // # TODO move this into the UI
        const fields = ["a", "change_size", "action", "page_title"];

        const width = totalWidth / numSections

        this.sections = Array.from(
            { length: numSections },
            (_, i) => new Force(i, width, fields[i])
        )

        this.sections.push(new Null(numSections, width, ""))

        this.sections[1].dy = dot => dot.points.position.y + -0.0005 * dot.data[this.sections[1].field];

        this.sections[0] = new Colour(0, width, this.sections[2].field)

        this.sections[2] = new Label(2, width, this.sections[3].field)

    }
}

class Section {

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
        this.dx = dot => 0.03 + dot.points.position.x;
        this.dy = dot => dot.points.position.y;
    }
}

class Force extends Section {

    constructor(idx, width, field) {
        super(idx, width, field);
        this.type = "Force"
    }

    exert(dot) {
        dot.points.position.x = this.dx(dot)
        dot.points.position.y = this.dy(dot)
    }

}

class Colour extends Section {
    constructor(idx, width, field) {
        super(idx, width, field);
    }

    exert(dot) {


        if (dot.sectionIdx != dot.lastSectionIdx) {
            dot.points.material = new THREE.PointsMaterial(
                { size: 10, color: stringToColour(dot.data[this.field]) }
            );
        }

        dot.points.position.x = this.dx(dot)
        dot.points.position.y = this.dy(dot)
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

class Label extends Section {
    constructor(idx, width, field) {
        super(idx, width, field);
        // slow it down in this section
        this.dx = dot => 0.01 + dot.points.position.x;
    }

    exert(dot) {

        if (!dot.isLabelled) {
            text.createText(dot, dot.data[this.field])
        }

        dot.points.position.x = this.dx(dot)
        dot.points.position.y = this.dy(dot)
    }
}

// class Null is a setion that deletes all the meshes that show up
class Null extends Section {
    constructor(idx, width, field) {
        super(idx, width, field);
    }

    exert(dot) {

        if (dot.sectionIdx != dot.lastSectionIdx) {
            const object = scene.scene.getObjectById(dot.points.id);

            object.clear()

            scene.scene.remove(object);
        }
    }
}