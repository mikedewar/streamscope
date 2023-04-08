import * as THREE from 'three';
import * as text from './text.js';
import * as scene from './scene.js';
import * as menu from './menu.js';

export class Sections {
    constructor(numSections, totalWidth) {

        const width = totalWidth / numSections

        this.sections = Array.from(
            { length: numSections },
            (_, i) => new Force(i, width, '')
        )

        this.sections.push(new Null(numSections, width, ""))

        document.addEventListener(
            "SectionChange",
            x => {
                console.log("recieved SectionChange event with detail", x.detail)
                const idx = x.detail.idx
                this.sections[idx] = new Colour(idx, width, "")
                //this.sections[idx].updateMenu()
                // delete old menu
                this.sections[idx].clearMenu()
            }
        )

        /*
        this.sections[0] = new Colour(0, width, "user")

        //this.sections[1] = new Filter(1, width, "is_bot")

        this.sections[2].setField("change_size")
        this.sections[2].dy = dot => dot.points.position.y + -0.0005 * dot.data[this.sections[2].field];

        this.sections[3] = new Label(3, width, "page_title")
        */

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
            new THREE.Vector3(0, -10, 0),
            new THREE.Vector3(0, 10, 0)
        ]);
        this.line = new THREE.LineSegments(geometry, material);
        this.line.position.set(this.left, 0, 0)
        this.dx = dot => 0.03 + dot.points.position.x;
        this.dy = dot => dot.points.position.y;
        this.menu = null
        this.allowableTypes = null
    }

    setField(field) {
        this.field = field
    }

    clearMenu() {
        console.log("clearing menu", this.menu.id, "from section", this.idx)
        const menu = this.line.getObjectById(this.menu.id)
        console.log("menu to remove", menu.id)
        if (menu === undefined) {
            console.log("menu object not found")
            return
        }
        menu.clear() // removes all child objects from the menu object
        console.log("menu.children after clear", menu.children)
        this.line.remove(menu); // removes the menu from the section (aka "line")
        menu.remove()
        /*
        const domID = "menu" + this.idx
        try {
            const e = document.getElementById(domID)
            e.remove() // remove it from the DOM
            console.log("removed", domID, "from the DOM")
        } catch {
            console.log("asked to remove", domID, "but it's not there; skipping")
        }
        */
        this.menu = null
    }

    updateMenu() {
        console.log("clearing menu for section", this.idx)
        this.clearMenu()
        console.log("creating new menu for section", this.idx, "of type", this.type)
        this.menu = new menu.Menu(this)
    }
}

class Force extends Section {

    constructor(idx, width, field) {
        super(idx, width, field);
        this.type = "Force"
        this.allowableTypes = ["number"]
        this.menu = new menu.Menu(this)
    }

    exert(dot) {
        dot.points.position.x = this.dx(dot)
        dot.points.position.y = this.dy(dot)
    }

}

class Colour extends Section {
    constructor(idx, width, field) {
        super(idx, width, field);
        this.type = "Colour"
        this.allowableTypes = ["string"]
        this.menu = new menu.Menu(this)
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
    if (str === undefined) {
        return "black"
    }
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
        this.type = "Label"
        this.menu = new menu.Menu(this)
        this.allowableTypes = ["string"]
    }

    exert(dot) {

        if (!dot.isLabelled) {
            text.createText(dot, dot.data[this.field])
        }

        dot.points.position.x = this.dx(dot)
        dot.points.position.y = this.dy(dot)
    }
}

class Filter extends Section {
    constructor(idx, width, field) {
        super(idx, width, field);
        this.type = "Filter"
        this.allowableTypes = ["string"] // #TODO
        this.menu = new menu.Menu(this)
    }

    exert(dot) {


        if (dot.sectionIdx != dot.lastSectionIdx) {

            if (dot.data[this.field]) {

                const object = scene.scene.getObjectById(dot.points.id);

                object.clear()

                scene.scene.remove(object);
            }
        }


        dot.points.position.x = this.dx(dot)
        dot.points.position.y = this.dy(dot)
    }
}

// class Null is a setion that deletes all the meshes that show up
class Null extends Section {
    constructor(idx, width, field) {
        super(idx, width, field);
        this.type = "Null"
        this.allowableTypes = ["string"] // #TODO 
        this.menu = new menu.Menu(this)
    }

    exert(dot) {

        if (dot.sectionIdx != dot.lastSectionIdx) {
            const object = scene.scene.getObjectById(dot.points.id);

            object.clear()

            scene.scene.remove(object);
        }
    }
}