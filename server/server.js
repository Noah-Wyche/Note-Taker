
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route for serving the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Route to serve the notes API endpoint
app.get('/api/notes', (req, res) => {
    fs.readFile(__dirname + '/db/notes.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to read notes file.' });
            return;
        }
        res.json(JSON.parse(data));
    });
});

// Route to handle saving a new note
app.post('/api/notes', (req, res) => {
    // Parse the request body
    const newNote = req.body;

    // Read the existing notes from the file
    fs.readFile(__dirname + '/db/notes.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to read notes file.' });
            return;
        }

        // Parse the existing notes
        const notes = JSON.parse(data);

        // Assign a unique ID to the new note
        newNote.id = notes.length + 1;

        // Add the new note to the array of notes
        notes.push(newNote);

        // Write the updated notes back to the file
        fs.writeFile(__dirname + '/db/notes.json', JSON.stringify(notes), err => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Failed to write notes file.' });
                return;
            }
            res.json(newNote);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
