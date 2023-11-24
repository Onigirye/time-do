export default {
    version: 0,
    description: "List schema",
    primaryKey: "id",
    type: "object",
    properties: {
        id: {
            type: "string",
            maxLength: 100
        },
        name: {
            type: "string"
        },
        done: {
            type: "boolean"
        },
        category: {
            ref: 'category',
            type: 'string'
        }
    },
    required: [
        'id',
        'name'
    ]
}