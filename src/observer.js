
const newField = new Event("newField");

export class Observer {
    constructor() {
        this.fields = {}
    }

    update(data) {

        for (const [key, value] of Object.entries(data)) {

            const valueType = typeof value;

            const prevType = this.fields[key]

            // if we used to be more specific, and now its just "object", don't update
            if (!(prevType === "object") && (valueType === "object")) {
                continue
            }

            // if no change, don't update
            if (prevType === valueType) {
                continue
            }

            this.fields[key] = valueType;

            //emit an event
            document.dispatchEvent(newField)
        }
    }

    getFields(allowedTypes) {

        return Object.entries(this.fields)
            .filter(field => allowedTypes.includes(field[1]))
            .map(kv => kv[0]);


    }
}