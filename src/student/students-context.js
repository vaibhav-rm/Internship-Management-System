
import React from 'react'

const StudentContext = React.createContext({
    list: [],
    add: (student) => { },
    delete: (id) => { },
    update: (id, student) => { },
    search: (str) => { },
});

export default StudentContext;
