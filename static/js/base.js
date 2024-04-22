// below 3 functions are used for Preview the Whole text including title and text
function previewTitle() {
    updatePreview();
    getValue();
  }
  
  function updatePreview() {
    var text = document.getElementById("textInput").value;
    text = text.replace(/\n/g, "<br>");
    var previewSection = document.getElementById("previewSection");
    previewSection.innerHTML = text;
  }
  
  function getValue() {
    var inputElement = document.getElementById("title");
    var value = inputElement.value;
    document.getElementById("previewTitle").innerText = value;
  }
  
  //Used to covert text into Lowercase
  function lowercaseText() {
    var text = document.getElementById("textInput").value;
    document.getElementById("textInput").value = text.toLowerCase();
    updatePreview();
  }
  
  //Used to covert text into Uppercase
  function uppercaseText() {
    var text = document.getElementById("textInput").value;
    document.getElementById("textInput").value = text.toUpperCase();
    updatePreview();
  }
  
  //Used to clear the text
  function clearText() {
    var confirmClear = confirm("Are you sure you want to clear the text?");
    if (confirmClear) {
      document.getElementById("textInput").value = "";
      document.getElementById("title").value = "";
      updatePreview();
    }
  }
  
  //Used to copy the text
  function copyText() {
    var text = document.getElementById("textInput");
    text.select();
    document.execCommand("copy");
    alert("Text copied to clipboard !");
  }
  
  //Used to Remove the extra spaces from the text
  function removeExtraSpaces() {
    var text = document.getElementById("textInput").value;
    text = text.replace(/\s+/g, " ");
    document.getElementById("textInput").value = text.trim();
    updatePreview();
  }
  
  //Used to covert the first letter after '.' , ',' , ':' & Double space  in capital letter
  function capitalize() {
    var text = document.getElementById("textInput").value;
    var newText = text.replace(
      /(^|[:,.\s]{2,})([a-z])/g,
      function (match, p1, p2) {
        return p1 + p2.toUpperCase();
      }
    );
    document.getElementById("textInput").value = newText;
    updatePreview();
  }
  
  //used to change the font of the text
  function applyFont() {
    var selectedFont = document.getElementById("fonts").value;
    document.getElementById("textInput").style.fontFamily = selectedFont;
    document.getElementById("title").style.fontFamily = selectedFont;
    document.getElementById("previewSection").style.fontFamily = selectedFont;
    document.getElementById("previewTitle").style.fontFamily = selectedFont;
  }
  
  //used to enable darkmode
  
  // Check if dark mode is enabled in localStorage and apply it on page load
  window.onload = function () {
    var darkModeEnabled = localStorage.getItem("darkModeEnabled");
    if (darkModeEnabled === "true") {
      enableDarkMode();
    }
  };
  
  function darkMode() {
    var img = document.getElementById("darkmode");
    var body = document.getElementById("body");
  
    // Toggle dark mode
    if (body.classList.contains("dark")) {
      disableDarkMode();
    } else {
      enableDarkMode();
    }
  }
  
  function enableDarkMode() {
    var img = document.getElementById("darkmode");
    var body = document.getElementById("body");
  
    img.src = "moon.png";
    body.classList.add("dark");
    localStorage.setItem("darkModeEnabled", "true");
  }
  
  function disableDarkMode() {
    var img = document.getElementById("darkmode");
    var body = document.getElementById("body");
  
    img.src = "sun.png";
    body.classList.remove("dark");
    localStorage.setItem("darkModeEnabled", "false");
  }
  
  //******************************************text to speech converter******************************************
  
  let voice = null;
  function speak_and_stop() {
    if (!voice) {
      document.getElementById("read").innerHTML = "Stop reading";
      let synth = window.speechSynthesis;
      voice = new SpeechSynthesisUtterance(`${textInput.value}`);
      voice.onend = function () {
        voice = null;
        document.getElementById("read").innerHTML = "Read aloud";
      };
      synth.speak(voice);
    } else {
      voice = null;
      document.getElementById("read").innerHTML = "Read aloud";
      let synth = window.speechSynthesis;
      synth.cancel();
    }
  }
  
  // *****************************************voice to text converter*****************************************
  
  let recognition = null;
  function startSpeechRecognition() {
    if (recognition == null) {
      document.getElementById("voiceTyping").innerHTML = "Stop Voice Input";
  
      recognition = new webkitSpeechRecognition() || new SpeechRecognition();
      const textInput = document.getElementById("textInput");
  
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
  
      recognition.onresult = function (event) {
        let recognizedText = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            recognizedText += " " + event.results[i][0].transcript;
          }
        }
        textInput.value += recognizedText;
        updatePreview();
      };
  
      recognition.onerror = function (event) {
        console.error("Error occurred in recognition:", event.error);
      };
  
      recognition.onend = function () {
        console.log("Speech recognition ended.");
        document.getElementById("voiceTyping").innerHTML = "Voice Typing";
      };
  
      recognition.start();
    } else {
      recognition = null;
      document.getElementById("voiceTyping").innerHTML = "Voice Typing";
      recognition.stop();
    }
  }
  
  // *******************************************Download PDF Function*******************************************
  
  function downloadPDF() {
    // Check if the title is longer than 50 characters
    var title = document.getElementById("title").value;
    if (title.length > 50) {
      alert("Title should not exceed 50 characters.");
      return; // Prevent further execution
    }
  
    var confirmDownload = confirm(
      "Are you sure you want to Download the text as a pdf?"
    );
    if (confirmDownload) {
      var content = document.getElementById("textInput").value;
  
      var doc = new jsPDF();
      var maxWidth = 210; // Maximum width for each line
      var lineHeight = 8; // Line height
      var titleFontSize = 25; // Title font size
      var contentFontSize = 14; // Content font size
  
      // Split the content into lines that fit within the maxWidth
      var lines = doc.splitTextToSize(content, maxWidth);
  
      // Calculate the height of the content
      var contentHeight = lines.length * lineHeight;
  
      // Calculate the width of the title
      var titleWidth = doc.getTextWidth(title);
  
      // Determine the x-coordinate for centering the title
      var titleXOffset = (doc.internal.pageSize.width - titleWidth) / 2;
  
      // Determine the y-coordinate for the title
      var titleYOffset = 20; // Set vertical distance from the top
  
      // Wrap the title if it exceeds maxWidth
      var titleLines = doc.splitTextToSize(title, maxWidth);
  
      // Calculate the height of the wrapped title
      var wrappedTitleHeight = titleLines.length * titleFontSize;
  
      // Determine the y-coordinate for the wrapped title
      var wrappedTitleYOffset = titleYOffset + wrappedTitleHeight / 2;
  
      // Start adding the title line by line
      doc.setFontSize(titleFontSize);
      for (var i = 0; i < titleLines.length; i++) {
        var titleLineWidth = doc.getTextWidth(titleLines[i]);
        var titleLineXOffset = (doc.internal.pageSize.width - titleLineWidth) / 2;
        doc.text(titleLines[i], titleLineXOffset, wrappedTitleYOffset);
        wrappedTitleYOffset += titleFontSize; // Move to the next line
      }
  
      // Add the content to the PDF
      doc.setFontSize(contentFontSize);
      var yOffset = titleYOffset + wrappedTitleHeight + 20; // Start after the title
      for (var i = 0; i < lines.length; i++) {
        doc.text(10, yOffset, lines[i]);
        yOffset += lineHeight; // Move to the next line
        // Check if next line will exceed page height, add new page if necessary
        if (yOffset + lineHeight > doc.internal.pageSize.height - 10) {
          doc.addPage(); // Add new page
          yOffset = 10; // Reset y offset
        }
      }
  
      // Set the selected font from the dropdown
      var selectedFont = document.getElementById("fonts").value;
      doc.setFont(selectedFont);
  
      // Set downloaded file name
      var fileName = title || "Untitled";
      doc.save(fileName + ".pdf");
    }
  }
  
  