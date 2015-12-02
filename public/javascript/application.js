$(function() {

  var $contacts = $('.contacts-index');
  var $message = $('#message')
  var $firstname = $('#firstname');
  var $lastname = $('#lastname');
  var $email = $('#email');

  function addContact(contact) {
    var fullname = contact.firstname + " " + contact.lastname;
    var email = contact.email;
    var li = $('<li>').text(fullname + " - " + email);
    $contacts.prepend(li);
  };

  $.ajax({
    type: 'GET',
    url: '/contacts',
    success: function(contacts) {
      console.log(contacts);
      $.each(contacts, function(i, contact) {
        addContact(contact);
      });
    },
    error: function() {
      $message.text('Could not load contacts.');
    }
  });

  $('#new-contact-submit').on('click', function() {

    var contact = {
      firstname: $firstname.val(),
      lastname: $lastname.val(),
      email: $email.val()
    };

    $.ajax({
      type: 'POST',
      url: '/contacts',
      data: contact,
      success: function(newContact) {
        addContact(newContact);
      },
      error: function() {
        $message.text('Error saving contact.');
      }
    });
  });

});
