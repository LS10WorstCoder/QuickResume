document.addEventListener("DOMContentLoaded", function () {
    const uploadButton = document.getElementById('uploadButton');
    const fileInput = document.getElementById('fileInput');
    const fileNameDisplay = document.getElementById('fileName');

    // Trigger file input click when the button is clicked
    uploadButton.addEventListener('click', function () {
        fileInput.click();
    });

    // Listen for changes in the file input (when the user selects a file)
    fileInput.addEventListener('change', function () {
        const file = fileInput.files[0];
        
        if (file) {
            // Hide the upload button
            uploadButton.style.display = 'none';

            // Show the file name
            fileNameDisplay.textContent = `Uploaded: ${file.name}`;
            fileNameDisplay.style.display = 'block';
        }
    });
});
