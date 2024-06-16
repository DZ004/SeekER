document.addEventListener('DOMContentLoaded', function() {
    // Load notes from localStorage
    const notesInput = document.getElementById('notesInput');
    const savedNotes = localStorage.getItem('adminNotes');
    if (savedNotes) {
        notesInput.value = savedNotes;
    }

    // Save notes to localStorage
    window.saveNotes = function() {
        const notes = notesInput.value;
        localStorage.setItem('adminNotes', notes);
        alert('Notes saved successfully!');
    }
});
