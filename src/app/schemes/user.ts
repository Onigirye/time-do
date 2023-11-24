export default {
    version: 0,
    description: "User schema",
    primaryKey: "login",
    type: "object",
    properties: {
        login: {
            type: "string",
            maxLength: 100
        },
        name: {
            type: "string"
        },
        password: {
            type: 'string'
        },
        todos: {
            type: 'array',
            ref: 'task',
            items: {
                type: 'string'
            }
        }
    },
    required: [
        'name',
        'login',
        'password'
    ]
}