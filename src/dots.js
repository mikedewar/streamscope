import * as THREE from 'three';

export class Dots {

    constructor(fields) {

        this.geometry = new THREE.BufferGeometry();
        this.material = new THREE.PointsMaterial(
            { size: 10, color: "#8CBEB2" }
        );
        this.fields = fields;
        this.dots = [];

    }

    update_position() {
        // chuck out any dots that have drifted off the page
        this.dots = this.dots.filter(d => d.points.position.x < 21)
        // update those that remain
        this.dots.forEach(d => d.update_position(this.getField(d)))
    }

    addDot(data) {
        var newDot = new Dot(data, this.geometry, this.material)
        this.dots.push(newDot)
        return newDot;
    }

    getField(dot) {

        var currentField = this.fields.find(function (field) {
            return field.left <= dot.points.position.x && field.right > dot.points.position.x
        })

        return currentField
    }
}

export class Dot {
    constructor(eventData, geometry, material) {

        this.data = eventData;
        this.points = new THREE.Points(geometry, material);
        this.section = 0;

        this.points.geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(
                new Float32Array([-10, 0, 0]),
                3
            )
        )
    }


    update_position(field) {
        field.exert(this)

    }
}

