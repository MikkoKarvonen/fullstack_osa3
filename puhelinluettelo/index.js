const express = require('express')
const app = express()

let notes = [
    {
        id: 1,
        name: 'Timo Testaaja',
        number: '040-1234567'
    },
    {
        id: 2,
        name: 'Maija Meikäläinen',
        number: '040-1122334'
    },
    {
        id: 3,
        name: 'Roope Ankka',
        number: '09-123123'
    },
]

app.get('/info', (req, res) => {
    res.send(`<p>Puhelinluettelossa ${notes.length} henkilön tiedot</p>`+
             `<p>${new Date()}</p>`)
})

app.get('/api/persons', (req, res) => {
    res.json(notes)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})