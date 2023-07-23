document.addEventListener("DOMContentLoaded", function () {

  const typingSpeed = 300; // 

  const typingHeading = document.querySelector(".typing-effect").innerHTML;
  const headingText = typingHeading.innerHTML;
  typingHeading.innerHTML = ""; 
  let currentCharacter = 0;

  function typeHeading() {
    if (currentCharacter < headingText.length) {
      const currentChar = headingText.charAt(currentCharacter);
      typingHeading.innerHTML += currentChar;
      currentCharacter++;

      if (currentChar === "<" && headingText.charAt(currentCharacter) === "b" && headingText.charAt(currentCharacter + 1) === "r" && headingText.charAt(currentCharacter + 2) === ">") {
        setTimeout(typeHeading, 500);
        currentCharacter += 3; 
      } else {
        setTimeout(typeHeading, typingSpeed);
      }
    } else {
      setTimeout(restartTyping, 1000); 
    }
  }

  function restartTyping() {
    typingHeading.innerHTML.innerHTML = ""; 
    currentCharacter = 0;
    typeHeading();
  }

  typeHeading(); 
});

function hide_landing_content(){
  document.querySelector('#main_landing_content').style.display = 'none';
}
