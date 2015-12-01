$(function() {

  var $contacts = $('.contacts-index');

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
      $contacts.text('Could not load contacts');
    }
  });

});
