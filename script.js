const btnYes = document.getElementById("btnYes");
const btnNo = document.getElementById("btnNo");
const audio = document.getElementById("myAudio"); // Get audio once
let textInterval; // Declare interval variable outside to be accessible

btnYes.addEventListener("click", function() {
    let name = prompt("What is your name?");
    if (name) {
        // Convert the name to sentence case
        name = name.toLowerCase(); //Convert all characters to lowercase
        name = name.charAt(0).toUpperCase() + name.slice(1); // Capitalize the first character
        alert("Hello, " + name + "!");
    } else {
        // Handle case where name is null or empty string
        name = "Friend"; // Default name if none provided
        alert("Hello, " + name + "!");
    }

    // Message 1 with Yes/No options
    let message1Response = confirm("Naiisip mo na bang sumuko sa buhay?");
    if (message1Response) {
        alert("Huwag kasi bakit ka susuko eh di pa tayo nakatikim ng Diwata Pares Overload");
    }

    // Message 2 with Yes/No options
    // Use the potentially updated 'name' variable
    let message2Response = confirm("Matulog ka na " + name +", huwag kang magpakapuyat");
    if (message2Response) {
        alert("Masama ang pagpupuyat sa ating katawan");
        alert("Okay, Goodnight " + name + "! Sleepwell");
    }

    // Play the song and synchronize text
    audio.currentTime = 0; // Start from the beginning if clicked again
    audio.play().catch(error => {
         console.error("Audio playback failed:", error);
         alert("Could not play audio automatically. Please check browser settings or user interaction.");
         // Optionally stop interval if audio fails to play
         clearInterval(textInterval); // Clear any previous interval
    });

    const synchronizedText = [
        { time: 0, text: "Now playing: Amtrak by Los Retros ▶ 0:42 - 1:15" },
        { time: 1, text: "Will we ever find 🕵" },
        { time: 6, text: "A way to make our time ⏰⏰ "},
        { time: 11, text: "last forever? ⏳️" },
        { time: 14, text: "Because I" },
        { time: 16, text: "begin to miss you", lastLine: true }, // Marking the last line of text
        // Add more synchronized text entries as needed
    ];

    let textIndex = 0;
    let imageDisplayed = false; // Flag to ensure image logic runs only once

    // Clear any existing interval before starting a new one
    clearInterval(textInterval);

    function updateText() {
         // Check if audio is paused (manually or by end) or if index is out of bounds
        if (audio.paused || audio.ended || textIndex >= synchronizedText.length) {
            clearInterval(textInterval); // Ensure interval is cleared
            console.log("Text update interval cleared due to audio pause/end or end of text.");
            return; // Stop executing updateText
        }

        // Ensure textIndex is within bounds before accessing synchronizedText
        if (textIndex < synchronizedText.length) {
             const currentText = synchronizedText[textIndex];

             // Check if current time has passed the text entry time
             if (audio.currentTime >= currentText.time) {
                 displayLyrics(currentText.text); // Display the lyric line
                 textIndex++; // Move to the next text entry

                 // Check if this is the last line and image hasn't been displayed yet
                 if (currentText.lastLine && !imageDisplayed) {
                     displayImage(); // Display the image
                     imageDisplayed = true; // Set flag so this block doesn't run again
                 }
             }
         }
    }

    function displayLyrics(lyrics) {
        const lyricsContainer = document.createElement("p");
        lyricsContainer.textContent = lyrics;
        // Append lyrics below the existing content
        document.body.appendChild(lyricsContainer);

        // >>> ADDED SCROLL LOGIC HERE <<<
        // Scroll the newly added paragraph into view
        lyricsContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
        // 'behavior: "smooth"' provides a smooth scrolling animation
        // 'block: "end"' aligns the bottom of the element with the bottom of the viewport
        // Alternatively, you could use block: 'nearest' which scrolls only if needed to make the element visible,
        // and tries to put it in the nearest edge of the viewport. 'end' is often better for sequential content like lyrics.
        // >>> END OF ADDED SCROLL LOGIC <<<
    }

    // Start the interval to check for text updates
    textInterval = setInterval(updateText, 500); // Check more frequently (e.g., every 500ms) for smoother sync

    // This function is called when the text entry with lastLine: true is reached
    function displayImage() {
        const image = document.createElement("img");
        image.src = "image.jpg"; // Make sure image.jpg is in the same folder
        image.id = "myImage"; // Assign an ID to the image element
        document.body.appendChild(image);

        // Stop the audio and the text update interval after a 3-second delay
        setTimeout(function() {
            audio.pause(); // Stop the music
            // The updateText function already has logic to clear interval if audio is paused
            // But explicitly clearing it here ensures it stops even if updateText doesn't run immediately after pause
            clearInterval(textInterval);
            console.log("Audio paused and text interval cleared 3 seconds after image appeared.");

            // Optional: Remove the image after some time if desired
            // setTimeout(() => {
            //     image.remove();
            //     console.log("Image removed.");
            // }, 5000); // Example: Remove image after 5 seconds (total 8s after appearing)

        }, 3000); // 3000 milliseconds = 3 seconds delay
    }

    // The original 'ended' listener is now less critical as we manually pause,
    // but it can stay as a fallback. The updateText loop also checks audio.ended.
    audio.addEventListener("ended", function() {
         console.log("Audio ended naturally.");
         clearInterval(textInterval); // Clear interval if audio finishes on its own
    });

    // Important: Clear interval and pause audio if "Yes" is clicked *again* before previous actions complete
    // This prevents multiple intervals/audio players running.
     // (Note: the initial clearInterval(textInterval) before starting the new one helps too)
});


// btnNo click handler - make sure 'name' is handled if 'Yes' wasn't clicked
btnNo.addEventListener("click", function() {
    // Check if 'name' was defined by a previous "Yes" click.
    // If not, prompt for the name or use a default.
    let currentName;
    // Check if the global variable 'name' exists and is not empty
    if (typeof name !== 'undefined' && name) {
         currentName = name;
    } else {
         // If 'name' wasn't set by 'Yes' button, prompt for it now
         currentName = prompt("What is your name?") || "Friend"; // Prompt, default to 'Friend' if cancelled/empty
          // Optional: Convert this prompted name to sentence case too
         if (currentName && currentName !== "Friend") {
            currentName = currentName.toLowerCase();
            currentName = currentName.charAt(0).toUpperCase() + currentName.slice(1);
         }
    }
    alert("Okay, Goodnight " + currentName + "! Sleepwell");

    // Also clear any active interval or pause audio if they exist
    // This handles the case where music might still be playing if 'No' is clicked after 'Yes'
    clearInterval(textInterval);
    if (!audio.paused) {
       audio.pause();
       console.log("Audio paused and interval cleared due to 'No' button click.");
    }
});

// Handle pause/clear interval if the user navigates away
window.addEventListener("beforeunload", function() {
    audio.pause();
    clearInterval(textInterval);
    console.log("Audio paused and interval cleared on page unload.");
});
