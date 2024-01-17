// A variable that stores the 'add note' button allowing me to control its workings (shown later on)
const addbtn = document.querySelector('.add');

// A variable that stores the already created notes from current and previous sessions (obtained from local storage). This variable stores an array of all notes created so far
const strings = JSON.parse(localStorage.getItem('notes'));

// A variable that keeps track of the number of notepads created on the page. I used this variable to control the 'add note' placement on the page
let count = strings.length;




// As mentioned before, when there are no notepads on the page, move the 'add note' to the center of the page (done by removing the class 'side' from the button's class list)
if (count == 0) {
    addbtn.classList.remove('side');
}
// Otherwise move the button to the corner (done by adding the class 'side' to the button's class list)
else {
    addbtn.classList.add('side');
}




// Function that triggers when the user clicks on the 'add note' button on the page. It basically moves the button to the corner and increments the count by 1. Then it executes the 'addNewNote' function as described below
addbtn.addEventListener('click', () => {
    if (count == 0) {
        addbtn.classList.add('side');
    }
    count++;
    addNewNote();
});




// A function that creates a 'notes' container which is a div on the page. It takes in a parameter 'text', which is used primarily for the already created notes (taken from local storage) as this function is not only used for creating new notepads, but also adding in the notepads from previous session (stored in the local storage)
// Basically, when we create a new notepad, there is no text in it. So it will put the notes container in 'editing' mode (byy displaying the textarea container and hiding the main container)
// When it is adding the previous notepads (created in previous sessions), there will be text in those notepads, so it will create the 'notes' container in 'display' mode first (by hiding the textarea container and showing the 'main' div)
const addNewNote = (text = '') => {
    // Creates a div on the document
    const notes = document.createElement('div');
    // Styles the div using the linked CSS page
    notes.classList.add('notes');

    // Contents and structure of the div 'notes' below.
    // The div 'tools' is basically a header that stores the 'edit' button and 'delete' button
    // Under the div 'tools', is the div 'main' (that displays the notes after markdown has been processed) and the textarea (where the user enters their notes in markdown format)
    // main ${text ? '' : 'hidden'} is basically the function that checks if it is an old notepad (taken from local storage) with text in it, the notes container will be in 'diplay' mode (by adding 'hidden' to the the textarea container class and not adding 'hidden' to the 'main' div class)
    // Otherwise, if no text, then the 'notes' container will be in 'edit' mode first (by adding 'hidden' to the 'main' div class and not adding 'hidden' to the textarea container class)
    notes.innerHTML = `
        <div class="tools">
            <button class="edit" id="edit-preview">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="delete" id="delete">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
        <div class="main ${text ? '' : 'hidden'}">
        </div>
        <textarea class="${text ? 'hidden' : ''}"> </textarea>
    `;


    // Variables that store the buttons that are in the 'notes' container
    // I have used 'querySelector' which gets the buttons using its class name but I do believe that 'notes.getElementById('...')' should work just fine (haven't tried it). Although you would need to add ids to the buttons
    const editbtn = notes.querySelector('.edit');
    const deletbtn = notes.querySelector('.delete');
    
    // You can also use getElementById (I'm assuming) to retrieve main container and textarea container
    const main = notes.querySelector('.main');
    const textArea = notes.querySelector('textarea');

    // If there is text passed along the parameter (meaning that the text was retrieved from the local storage), restore the text back into the textarea container
    textArea.value = text;
    // Once text is returned back into the textarea container, we need to display the text in markdown format in the main container
    main.innerHTML = marked.parse(text);
    // Please note that the above two lines of code refer to the notes that were saved in local storage and need to be restored once we open a new session for the web app


    // Function that takes place once the 'edit' button is clicked
    editbtn.addEventListener('click', () => {
        // If main container is hidden, the below code will display the main container (by removing the 'hidden' class)
        main.classList.toggle('hidden');
        // If textarea container is hidden, the below code will display it
        textArea.classList.toggle('hidden');
        // If we are in edit mode and change to display mode, then whatever was written in the textarea container needs to be displayed in markdown in the main container
        main.innerHTML = marked.parse(textArea.value);
        // Update the local storage
        updateLS();

    });

    // Function that takes place when the user clicks on the 'delete' button
    deletbtn.addEventListener('click', () => {
        // Remove that particular 'notes' container from the body of the page
        notes.remove();
        // Decrement the count (number of notepads displayed on the screen)
        count--;
        // If no notepads on page, return 'add note' button back to center of screen
        if (count == 0) {
            addbtn.classList.remove('side');
        }

        // Everytime we remove a notes container, we need to update local storage
        updateLS();
    });

    // Append to the body directly
    document.body.appendChild(notes);
};




// Checks if there are strings (or notes to be specific) in the local storage. If so, restore them back to the page
if (strings) {
    strings.forEach(text => {
        addNewNote(text);
    });
}




// Function to update the local storage
const updateLS = () => {
    // Returns an array of all the textarea containers (could have multiple 'notes' containers on the page)
    const notesText = document.querySelectorAll('textarea');

    // An array that will be used to store the texts entered in each textarea container
    const notes = [];

    // Iterate through all the textarea containers
    notesText.forEach(note => {
        // For each textarea container, get the text and push them into the 'notes' array
        notes.push(note.value);
    });

    // Store the array in local storage under the name 'notes'
    localStorage.setItem('notes', JSON.stringify(notes));
};
