const apiClient = require('./client');

async function run() {
    try {
        //Register a new user
        console.log('\x1b[1m\x1b[36mRegister a new user\x1b[0m');
        const userData = {
            email: 'testuser@example.com',
            password: 'password123',
        };
        const registerResponse = await apiClient.register(userData);
        console.log('Registration Successful:', registerResponse);

        // User login
        console.log('\x1b[1m\x1b[36mLogin the user\x1b[0m');
        const credentials = {
            email: 'testuser@example.com',
            password: 'password123',
        };
        const loginResponse = await apiClient.login(credentials);
        console.log('Login Successful:', loginResponse);

        // Add first note
        console.log('\x1b[1m\x1b[36mAdd the first note\x1b[0m');
        const note1Data = { title: 'First Note', description: 'This is my first note.', createdAt: '2025-01-26T12:48:45.123Z', lastModifiedAt: '2025-01-26T12:48:45.123Z' };
        const addNote1Response = await apiClient.addNote(note1Data);
        console.log('Note Added:', addNote1Response);

        // Add second note
        console.log('\x1b[1m\x1b[36mAdd the second note\x1b[0m');
        const note2Data = { title: 'Second Note', description: 'This is my second note.', createdAt: '2025-01-26T12:48:45.123Z', lastModifiedAt: '2025-01-26T12:48:45.123Z' };
        const addNote2Response = await apiClient.addNote(note2Data);
        console.log('Note Added:', addNote2Response);

        // Get the first note
        console.log('\x1b[1m\x1b[36mGet the first note by ID\x1b[0m');
        const note1Id = addNote1Response.savedNote._id;
        const getNote1Response = await apiClient.getNote(note1Id);
        console.log('Note 1 Retrieved:', getNote1Response);

        // Get the second note
        console.log('\x1b[1m\x1b[36mGet the second node by ID\x1b[0m');
        console.log('Get the second node by ID');
        const note2Id = addNote1Response.savedNote._id;
        const getNote2Response = await apiClient.getNote(note2Id);
        console.log('Note 1 Retrieved:', getNote2Response);

        // Edit the first note
        console.log('\x1b[1m\x1b[36mEdit the first Note\x1b[0m');
        const updatedNote1Data = { title: 'First Note', description: 'This is my first note. And now it\'s been updated', createdAt: '2025-01-26T12:48:45.123Z', lastModifiedAt: '2025-01-26T12:48:45.123Z'  };
        const editNote1Response = await apiClient.editNote(note1Id, updatedNote1Data);
        console.log('Note 1 Edited:', editNote1Response);

        // List all notes
        console.log('\x1b[1m\x1b[36mList All notes\x1b[0m');
        //setTimeout(async () => {
            const listNotesResponse = await apiClient.listNotes();
            //console.log('Delayed code executed after 5 second');
            console.log('All Notes:', listNotesResponse);
          //}, 5000);

        // Delete the second note
        console.log('\x1b[1m\x1b[36mDeleteTheSecondNote\x1b[0m');
        const deleteNoteResponse = await apiClient.deleteNote(note2Id);
        console.log('Note Deleted:', deleteNoteResponse);

        // Logout
        console.log('\x1b[1m\x1b[36mLogout the user\x1b[0m');
        const logoutResponse = await apiClient.logout();
        console.log('Logout Successful:', logoutResponse);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

run();
