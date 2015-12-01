$(function() {

  var $contacts = $('.contacts-index');
  var $errors = $('#errors')
  var $firstname = $('#firstname');
  var $lastname = $('#lastname');
  var $email = $('#email');

  function addContact(contact) {
    var fullName = contact.firstname + " " + contact.lastname;
    var email = contact.email;
    var listContact = $('<li>').text(fullName + " - " + email);
    $contacts.prepend(listContact);
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
      $errors.text('Could not load contacts.');
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
        $errors.text('Error saving contact.');
      }
    });
  });

});
