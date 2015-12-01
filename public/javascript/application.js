$(function() {

  var $contacts = $('.contacts-index');
  var $errors = $('#errors')
  var $firstname = $('#firstname');
  var $lastname = $('#lastname');
  var $email = $('#email');

  $.ajax({
    type: 'GET',
    url: '/contacts',
    success: function(contacts) {
      console.log(contacts);
      $.each(contacts, function(i, contact) {
        $contacts.append('<li>Name: '+ contact.firstname + " " + contact.lastname +', Email: '+ contact.email + '</li>');
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
        $contacts.prepend('<li>Name: '+ newContact.firstname + " " + newContact.lastname +', Email: '+ newContact.email + '</li>');
      },
      error: function() {
        $errors.text('Error saving contact.');
      }
    });
  });

});
