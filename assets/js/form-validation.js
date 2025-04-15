document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");
    const nameInput = document.querySelector("#name");
    const emailInput = document.querySelector("#email");
    const messageInput = document.querySelector("#message");
    const submitButton = document.querySelector("#submit");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        let valid = true;

        // Clear previous error messages
        clearErrors();

        // Validate name
        if (nameInput.value.trim() === "") {
            showError(nameInput, "Name is required.");
            valid = false;
        }

        // Validate email
        if (emailInput.value.trim() === "") {
            showError(emailInput, "Email is required.");
            valid = false;
        } else if (!validateEmail(emailInput.value.trim())) {
            showError(emailInput, "Please enter a valid email address.");
            valid = false;
        }

        // Validate message
        if (messageInput.value.trim() === "") {
            showError(messageInput, "Message is required.");
            valid = false;
        }

        // If valid, submit the form (or perform desired action)
        if (valid) {
            form.submit();
        }
    });

    function showError(input, message) {
        const error = document.createElement("span");
        error.className = "error-message";
        error.textContent = message;
        input.parentElement.appendChild(error);
    }

    function clearErrors() {
        const errorMessages = document.querySelectorAll(".error-message");
        errorMessages.forEach(function(error) {
            error.remove();
        });
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
});