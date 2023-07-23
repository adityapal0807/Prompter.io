document.addEventListener('DOMContentLoaded', function() {

  get_user_data();

  document.querySelector('#submit_click').addEventListener('click', () => pdf_file_upload());

  document.querySelector('#new_document').addEventListener('click',()=>{
    location.reload()
  })

  
  // send api to tune parameters
  // document.querySelector('#sendButton').addEventListener('click',()=> pdf_upload_parameter())
  
  showContent('summarizer');
  
});

function showLoader() {
  document.getElementById('loader').style.display = 'block';
  document.getElementById('loadingText').style.display = 'block';
  
}

// Function to hide the loader and display the content
function hideLoader() {
  document.getElementById('loader').style.display = 'none';
  document.getElementById('loadingText').style.display = 'none';
  document.getElementById('summarizer_section').style.filter = 'none'; 
}



function pdf_file_upload() {

  
  event.preventDefault()
  document.querySelector('#content').style.display = 'block'
  document.querySelector('#first_page').style.display = 'none '

  showLoader();
  document.getElementById('summarizer_section').style.filter = 'blur(5px)';

  const fileInput = document.querySelector('#pdfInput');
  const file = fileInput.files[0];

  const formData = new FormData();
  formData.append('pdf', file);

  fetch("/api/pdf_upload", {
    method: "POST",
    body: formData,
  })
    .then(response => response.json())
    .then(data => {
      // Handle the API response
      console.log(data);

      hideLoader();

      document.querySelector('.summary_box').innerHTML = data.summary
      document.querySelector('#file_name').innerHTML = data.file_name
      document.querySelector('.refined_text').innerHTML = data.text

      document.querySelector('#text_tokens').innerHTML = data.model_info.tokens
      document.querySelector('#model_temp').innerHTML = data.model_info.model_temperature
      document.querySelector('#model_prompt').innerHTML = data.model_info.model_prompt


      document.querySelector('#obj_id_div').innerHTML = data.obj_id

      // document.querySelector('#content').innerHTML += `${data.text}`
      
    })
    .catch(error => {
      console.error("Error:", error);
    });

    // document.querySelector('#parameter_form').addEventListener('submit',()=> tune_parameter())
}

function get_user_data(){

  parent_div = document.querySelector('#pdfs_history_ul')
  parent_div.style = 'padding: 3%;'
  

  fetch("/api/user_data")
    .then(response => response.json())
    .then(data => {
      // Handle the API response
      console.log(data);
      document.querySelector('#timestamp_greet').innerHTML = `Good ${data.greet} , ${data.username}`
      document.querySelector('#pdf_count').innerHTML = data.pdf_count

      data.pdfs.forEach(
        pdf=>{
          major_div = document.createElement('div')
          child_div=document.createElement('button')
          child_div.innerHTML = `${pdf.filename} <br> ${pdf.updatedOn}`
          child_div.classList.add('btn', 'btn-outline-primary')
          child_div.style = 'margin-bottom: 3%;'
          major_div.append(child_div)
          parent_div.appendChild(major_div)
          

          child_div.addEventListener('click',()=> {
            child_div.classList.add('active');

            hideLoader();
            fetch(`/api/pdf/${pdf.id}`)
            .then(response => {
              return response.json()
            })
            .then(data => {
              console.log(data);
              document.querySelector('#content').style.display = 'block'
              document.querySelector('#first_page').style.display = 'none '

              document.querySelector('.summary_box').innerHTML = data.latestSummary
              document.querySelector('#file_name').innerHTML = data.filename
              document.querySelector('.refined_text').innerHTML = data.refinedDocContent
            })
          })

        }
      )

    })
    .catch(error => {
      console.error("Error:", error);
    });
}

function tune_parameter() {

  // input the text
  const text = document.querySelector('.refined_text').textContent
  
  // get the dropdown text
  const dropdown = document.querySelector('#temperature');
  const selectedValue = dropdown.value;

  const custom_prompt = document.querySelector('#custom_prompt').value

  showLoader();
  fetch('/api/pdf_upload', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text:text,
      temperature:selectedValue,
      custom_prompt:custom_prompt,
      obj_id:document.querySelector('#obj_id_div').innerHTML
    })
  })
  .then(response => response.json())
  .then(data => {
    hideLoader();


    console.log('API response:', data);
    document.querySelector('.summary_box').innerHTML = data.summary

    document.querySelector('#text_tokens').innerHTML = data.model_info.tokens
    document.querySelector('#model_temp').innerHTML = data.model_info.model_temperature
    document.querySelector('#model_prompt').innerHTML = data.model_info.model_prompt
  })
  .catch(error => {
    console.error('Error sending API request:', error);
  });
}




function appendMessage(sender, message) {
  const chatDisplay = document.getElementById('chat-display');
  const messageDiv = document.createElement('div');
  if (sender==='You'){
    messageDiv.id = 'question_user'
  }
  else if (sender==='Chatbot'){
    messageDiv.id = 'answer_bot'
  }
  messageDiv.innerHTML = `<strong>${sender}: </strong> <br> ${message}`;
  chatDisplay.appendChild(messageDiv);
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

function sendQuestion() {
  const userInput = document.getElementById('user-input').value;

  if (userInput.trim() === '') {
    return;
  }

  const welcomeMessage = document.getElementById("welcome-message");
  if (welcomeMessage) {
    welcomeMessage.style.display = "none";
  }

  document.getElementById('user-input').value = '';

  appendMessage('You', userInput);

  fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question: userInput }),
  })
  .then(response => response.json())
  .then(data => {
    appendMessage('Chatbot', data.response);
  })
  .catch(error => {
    console.error('Error:', error);
    appendMessage('Chatbot', 'Sorry, something went wrong.');
  });

  
}


function showContent(contentId) {
  const buttons = document.querySelectorAll('.nav_anchors button');
  const contentContainers = document.querySelectorAll('.summarizer, .chatbot');

  buttons.forEach(button => {
    if (button.id === contentId + '_button') {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });

  contentContainers.forEach(container => {
    if (container.id === contentId + '_section') {
      container.style.display = 'block';
    } else {
      container.style.display = 'none';
    }
  });
}






