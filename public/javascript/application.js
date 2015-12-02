$(function(){

  var $contacts = $('#contacts-index');
  var $message = $('#message');
  var $firstname = $('#firstname');
  var $lastname = $('#lastname');
  var $email = $('#email');
  var $search = $('#search');

  var handlers = {
    listNavClick: function(){
      $(this).parent('ul').children('li').removeClass('active');
      $(this).addClass('active');
      $('#new-contact-div').addClass('display-none');
      $('#search-contact-div').addClass('display-none');
    },
    newNavClick: function(){
      $(this).parent('ul').children('li').removeClass('active');
      $(this).addClass('active');
      $('#new-contact-div').removeClass('display-none');
      $('#search-contact-div').addClass('display-none');
      $('#firstname').focus()
    },
    searchNavClick: function(){
      $(this).parent('ul').children('li').removeClass('active');
      $(this).addClass('active');
      $('#new-contact-div').addClass('display-none');
      $('#search-contact-div').removeClass('display-none');
      $search.focus();
    },
    addContact: function(contact){
      var fullname = contact.firstname + " " + contact.lastname;
      var email = contact.email;
      var li = $('<li>').text(fullname + " - " + email);
      var delbutton = $('<button>').addClass('delete-button').text('Delete').attr('contactid', contact.id);
      $contacts.prepend(li);
      li.append(delbutton);
      handlers.watchForDelete();
    },
    listAllContacts: function(){
      $contacts.empty();
      $.ajax({
        type: 'GET',
        url: '/contacts',
        success: function(contacts){
          console.log(contacts);
          $.each(contacts, function(i, contact) {
            handlers.addContact(contact);
          });
        },
        error: function(){
          $message.text('Could not load contacts.');
        }
      }); 
    },
    submitContact: function(e){
      var contact = {
        firstname: $firstname.val(),
        lastname: $lastname.val(),
        email: $email.val()
      };
      e.preventDefault();
      $.ajax({
        type: 'POST',
        url: '/contacts',
        data: contact,
        success: function(newContact){
          $('#new-contact-form')[0].reset();
          handlers.addContact(newContact);
        },
        error: function() {
          $message.text('Error saving contact.');
        }
      });
    },
    searchFilter: function(){
      $search.on('keyup', function(){
        var filter = $(this).val();
        if (filter) {
          $contacts.find('li:not(:Contains(' + filter + '))').slideUp();
          $contacts.find('li:Contains(' + filter + ')').slideDown();
        } else {
          $contacts.find('li').slideDown();
        }
      });
    },
    watchForDelete: function(){
      $('.delete-button').unbind().on('click', handlers.deleteContact);
    },
    deleteContact: function(e){
      console.log('fire delete')
      e.preventDefault();
      if (confirm('Are you sure?')) {
        var thiscontact = $(this);
        var contactid = $(this).attr('contactid');
        $.ajax({
          type: 'DELETE',
          url: '/contact/' + contactid,
          success: function(result) {
            thiscontact.closest('li').remove();
            $message.text('Contact deleted.');

          },
          error: function() {
            $message.text('Error with deleting contact.');
          }
        });
      } else {
        return false;
      };
    }
  };

  $('.list-nav-button').on('click', handlers.listNavClick);

  $('.new-nav-button').on('click', handlers.newNavClick);

  $('.search-nav-button').on('click', handlers.searchNavClick);

  $('#new-contact-submit').on('click', handlers.submitContact);

  handlers.listAllContacts();

  handlers.searchFilter();

  $.expr[':'].Contains = function(a,i,m){
    return (a.textContent || a.innerText || '').toUpperCase().indexOf(m[3].toUpperCase())>=0;
  };

});
