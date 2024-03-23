document.addEventListener('DOMContentLoaded', function() {
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  // Add event listener to the email composition form submission
  document.querySelector('#compose-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get values from the form fields
    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;

    // Construct the data object to be sent in the POST request
    const data = {
    recipients: recipients,
    subject: subject,
    body: body
    };

    // Make a POST request to the /emails endpoint
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
      })

    .then(data => {
      console.log(data.message); // Log the success message
      // Load sent mailbox
      load_mailbox('sent');
      })
    .catch(error => {
      console.error('Error:', error); // Log any errors
    });      
  });
}

function load_mailbox(mailbox) {  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#single-email-content').innerHTML= '';
  document.querySelector('#emails-view').innerHTML= '';
    
  // Fetch inbox messages from the server
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      document.querySelector('#emails-view').innerHTML = '';
      document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

      if (mailbox === 'inbox' || mailbox === 'archive')
      emails.forEach(email => {
        const emailDiv = document.createElement('div');
        emailDiv.style.paddingLeft = '10px';
        emailDiv.style.backgroundColor = email.read ? 'lightgray' : 'white'; // Set background color based on read status
        emailDiv.innerHTML = `
          <p><b>From:</b> ${email.sender} <b>To:</b> ${email.recipients} 
          <b>Subject:</b> ${email.subject}</p>
          ${email.body}
          <button class="archive-btn">${mailbox === 'inbox' ? 'Archive' : 'Unarchive'}</button>
          <hr>
        `;

        // Archive button
        emailDiv.querySelector('.archive-btn').addEventListener('click', () => {
            // Prevent event propagation
            event.stopPropagation();
          // Archive or unarchive the email when the button is clicked
          fetch(`/emails/${email.id}`, {
            method: 'PUT',
            body: JSON.stringify({
              archived: mailbox === 'inbox' ? true : false
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to archive/unarchive email.');
            }
            // Load the user's inbox after archiving/unarchiving
            document.querySelector('#single-email-content').innerHTML= '';
            document.querySelector('#emails-view').innerHTML= '';       
            load_mailbox(mailbox);
          })
          .catch(error => console.error('Error archiving/unarchiving email:', error));
        });

        emailDiv.addEventListener('click', () => {
          // Load the email when clicked
          load_email(email.id, mailbox);
          // Mark the email as read
          fetch(`/emails/${email.id}`, {
            method: 'PUT',
            body: JSON.stringify({
              read: true
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to mark email as read.');
            }
            // Set background color to lightgray for read emails
            emailDiv.style.backgroundColor = 'lightgray';
          })
          .catch(error => console.error('Error marking email as read:', error));
        });

        document.querySelector('#emails-view').appendChild(emailDiv);
      });
      
      if (mailbox === 'sent') {
        fetch(`/emails/${mailbox}`)
        .then(response => response.json())
        .then(emails => {
            // Clear the emails view
            document.querySelector('#emails-view').innerHTML = '';

            // Display a heading for the sent emails
            document.querySelector('#emails-view').innerHTML = `<h3>Sent</h3>`;

            // Iterate through each sent email and display it
            emails.forEach(email => {
                const emailDiv = document.createElement('div');
                emailDiv.style.paddingLeft = '10px';
                emailDiv.style.backgroundColor = email.read ? 'lightgray' : 'white'; // Set background color based on read status
                emailDiv.innerHTML = `
                    <p><b>From:</b> ${email.sender} To:</b> ${email.recipients.join(', ')} 
                    <b>Subject:</b> ${email.subject}</p>
                    ${email.body}
                    <hr>
                `;
                document.querySelector('#emails-view').appendChild(emailDiv);
            });
        })
        .catch(error => console.error('Error fetching sent emails:', error));  
      }
    })
    .catch(error => console.error('Error fetching inbox messages:', error));
}

// Reply email
function reply_email(email) {
  const composeView = document.querySelector('#compose-view');

  // Set the recipients
  const recipientsInput = composeView.querySelector('#compose-recipients');
  recipientsInput.value = email.sender; // Set the original sender as the recipient

  // Set the subject (prepend "Re:" to the original subject)
  const subjectInput = composeView.querySelector('#compose-subject');
  subjectInput.value = `Re: ${email.subject}`;

  // Set the body (prepend "On [timestamp], [sender] wrote:" to the original body)
  const bodyInput = composeView.querySelector('#compose-body');
  const timestamp = new Date(email.timestamp).toLocaleString();
  const originalBody = `\n\n -------------------- \nOn ${timestamp}, ${email.sender} wrote:\n${email.body}\n`;
  bodyInput.value = originalBody;

  // Show the compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#single-email-view').style.display = 'none';
  composeView.style.display = 'block';

  // Attach event listener to send button
  const sendButton = composeView.querySelector('#send-button');
  sendButton.addEventListener('click', () => {
    // Construct the data object to be sent in the POST request
    const data = {
      recipients: recipientsInput.value,
      subject: subjectInput.value,
      body: bodyInput.value
    };

    // Make a POST request to the /emails endpoint
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
      console.log(data.message); // Log the success message
      // Load sent mailbox
      load_mailbox('sent');
    })
    .catch(error => {
      console.error('Error:', error); // Log any errors
    });
  });
}

  // Function to extract reply message from the email body
  function extractReplyMessage(emailBody) {
    // Split the email body using the delimiter
    const parts = emailBody.split(' -------------------- ');
    // console.log('EmailBody in function: ', emailBody);
    
    // If the split results in more than one part, consider the last part as the reply message
    if (parts.length > 1) {
      return parts[parts.length - 1].trim();
    }
    // If no delimiter found, return the entire body
    return emailBody;
  }

function load_email(email_id, origin_mailbox) {
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#single-email-view').style.display = 'block';
    document.querySelector('#single-email-content').innerHTML= '';
    fetch(`/emails/${email_id}`)
      .then(response => response.json())
      .then(email => {
        if ("error" in email) {console.log(email)}
        ["subject", "timestamp", "sender", "recipients", "body"].forEach(email_element => {
          const div_row = document.createElement('div');
          div_row.classList.add("row", `email-${email_element}-section`);
          if (email_element === "subject") {
            //first the subject section
            const div_col_subject = document.createElement('div');
            div_col_subject.classList.add("col-8");
            div_col_subject.id = "email-subject-subsection";
            div_col_subject.innerHTML = `<p><b>Subject:</b> ${email[email_element]}</p>`;
            div_row.append(div_col_subject);

            // two button section
            const div_col_reply_archive = document.createElement('div');
            div_col_reply_archive.classList.add("col-4");
            div_col_reply_archive.id="archive-reply-button";
            const data_for_potential_buttons_to_add = [
              ["Reply", () => reply_email(email)], //reply button
              [email["archived"] ? "Unarchive" : "Archive", 
            () => archive_email(email_id, !email["archived"])]
            ];
            // if mailbox from sent, we dont need archive button
            (origin_mailbox === "sent" ? 
              data_for_potential_buttons_to_add.slice(0,1) : data_for_potential_buttons_to_add)
              .forEach(text_function => {
                const text = text_function[0];
                        const callback_func = text_function[1];
                        const button = document.createElement("button");
                        button.classList.add("float-right");
                        button.innerHTML = text;
                        button.addEventListener('click', callback_func);
                        div_col_reply_archive.append(button);
              });
              div_row.append(div_col_reply_archive);    
          } else if (email_element === "body") {
              // Extract the reply message from the email body
              const replyMessage = extractReplyMessage(email[email_element]);
              console.log('Reply Message in body:', replyMessage);
              console.log('Email element Message:', email[email_element]);
              const div_row = document.createElement('div'); // Initialize div_row
              div_row.classList.add("row", "email-body-section"); // Add necessary classes
              const div_col_body = document.createElement('div');
              div_col_body.classList.add("col-12");
              div_col_body.innerHTML = `<p>${email[email_element]}</p>`; // Set inner HTML to the email body
              div_row.appendChild(div_col_body); // Append div_col_body to div_row
          
              // Append div_row to #single-email-content
              const singleEmailContent = document.querySelector("#single-email-content");
              singleEmailContent.appendChild(div_row);
          } else {         
              div_row.innerHTML = `<p>${email[email_element]}</p>`;              
          }
          document.querySelector("#single-email-content").append(div_row);
        });
        const back_button_row_div = document.createElement('div');
        back_button_row_div.classList.add("row");
        const back_button_col_div = document.createElement('div');
        back_button_col_div.classList.add("col-2", "offset-5");
        back_button_col_div.id = "back-button";
        back_button_col_div.innerHTML = `<p>${origin_mailbox.charAt(0).toUpperCase() + origin_mailbox.slice(1)}</p>`;
        back_button_col_div.addEventListener('click', () => load_mailbox(origin_mailbox));
        back_button_row_div.append(back_button_col_div);

        document.querySelector("#single-email-back-section").append(back_button_row_div);
      })
      .catch(error =>console.log(error));

      fetch(`/emails/${email_id}`, {
          method: 'PUT',
          body: JSON.stringify({
              read: true
          })
      }).then();
  }

