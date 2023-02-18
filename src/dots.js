import * as THREE from 'three';
import { v4 as uuidv4 } from 'uuid';

export class Dots {

    constructor(sections) {

        this.geometry = new THREE.BufferGeometry();
        this.material = new THREE.PointsMaterial(
            { size: 10, color: "#8CBEB2" }
        );
        this.sections = sections;
        this.dots = [];

    }

    update_position() {
        // chuck out any dots that have drifted off the page
        this.dots = this.dots.filter(d => d.points.position.x < 20)
        // update those that remain
        this.dots.forEach(d => d.update_position(this.getSection(d)))
    }

    addDot(data) {
        var newDot = new Dot(data, this.geometry, this.material)
        this.dots.push(newDot)
        return newDot;
    }

    getSection(dot) {
        var currentSection = this.sections.find(function (section) {
            return section.left <= dot.points.position.x && section.right > dot.points.position.x
        })

        return currentSection
    }
}

export class Dot {
    constructor(eventData, geometry, material) {

        this.data = eventData;
        this.points = new THREE.Points(geometry, material);
        this.sectionIdx = 0;
        this.lastSectionIdx = -1;
        this.id = uuidv4();
        this.isLabelled = false;

        this.points.geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(
                new Float32Array([0, 0, 0]),
                3
            )
        )
    }


    update_position(section) {
        if (section === undefined) {
            console.log("unfiltered dot", this)
            return
        }
        this.sectionIdx = section.idx
        section.exert(this)
        this.lastSectionIdx = section.idx
    }

    add(entity) {
        this.points.add(entity)
    }
}

