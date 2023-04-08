import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

export class Menu {

    constructor(section) {

        const menuDiv = document.createElement('div');
        menuDiv.className = 'menu';
        menuDiv.id = "menu" + section.idx

        // section menu * * * 
        const sectionOptions = ["Force", "Colour", "Label", "Filter"]

        const sectionMenuDiv = document.createElement('div');
        sectionMenuDiv.className = 'sectionMenu';
        sectionMenuDiv.id = 'sectionMenu' + section.idx;

        const sectionLabel = sectionMenuDiv.appendChild(document.createElement('label'))
        sectionLabel.textContent = "Section Type: "
        sectionLabel.for = "section"

        const sectionSelect = sectionMenuDiv.appendChild(document.createElement('select'))
        sectionSelect.id = "section"

        sectionSelect.addEventListener('change', function (e) {
            const sectionChangeEvent = new CustomEvent("SectionChange", {
                detail: {
                    selectedSection: sectionSelect.value,
                    idx: section.idx
                }
            });
            console.log("dispatching section change event for", section.idx)
            document.dispatchEvent(sectionChangeEvent);
        });

        sectionOptions.forEach(element => {
            const sectionOption = sectionSelect.appendChild(document.createElement('option'))
            sectionOption.value = element
            sectionOption.text = element
        });

        // field menu * * * 

        

        // assemble * * * 

        menuDiv.replaceChildren();

        menuDiv.appendChild(sectionMenuDiv)
        menuDiv.appendChild(fieldMenuDiv)

        const menu = new CSS2DObject(menuDiv);
        menu.position.set(section.width / 2, 9, 0.5);
        section.line.add(menu);
        this.id = menu.id
    }
}

export class FieldMenu {

    constructor(section) {

        const observer = window.allSeeingEye

        let fieldOptions
        if (observer === undefined) {
            fieldOptions = []
        } else {
            fieldOptions = window.allSeeingEye.getFields(section.allowableTypes)
        }

        const fieldMenuDiv = document.createElement('div');
        fieldMenuDiv.className = 'fieldMenu';
        fieldMenuDiv.id = 'fieldMenu' + section.idx

        const p1 = fieldMenuDiv.appendChild(document.createElement('label'))
        p1.textContent = "Field"
        p1.for = "field"

        const fieldSelect = fieldMenuDiv.appendChild(document.createElement('select'))
        fieldSelect.id = "fieldSelect" + section.idx

        fieldSelect.addEventListener('change', function (e) {
            section.setField(fieldSelect.value)
        });

        fieldOptions.forEach(element => {
            const option = fieldSelect.appendChild(document.createElement('option'))
            option.value = element
            option.text = element
            option.id = element + section.idx
        });

    }

}