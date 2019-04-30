const express = require('express')
const app = express()

let numbers = [
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
    res.send(`<p>Puhelinluettelossa ${numbers.length} henkilön tiedot</p>` +
        `<p>${new Date()}</p>`)
})

app.get('/api/persons/', (req, res) => {
    res.json(numbers)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const number = numbers.find(number => number.id === id)
    number ? res.json(number) : res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    numbers = numbers.filter(numbers => numbers.id !== id);
  
    res.status(204).end();
  });

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})