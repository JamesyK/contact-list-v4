$(function(){

  var $contacts = $('#contactsIndex');
  var $message = $('#message');
  var $firstname = $('#firstname');
  var $lastname = $('#lastname');
  var $email = $('#email');
  var $search = $('#search');

  var handlers = {
    listNavClick: function(){
      $(this).parent('ul').children('li').removeClass('active');
      $(this).addClass('active');
      handlers.listAllContacts();
      $(".new-contact-form").addClass('display-none');
      $("#searchContactForm").addClass('display-none');
    },
    newNavClick: function(){
      $(this).parent('ul').children('li').removeClass('active');
      $(this).addClass('active');
      $(".new-contact-form").removeClass('display-none');
      $("#searchContactForm").addClass('display-none');
    },
    searchNavClick: function(){
      $(this).parent('ul').children('li').removeClass('active');
      $(this).addClass('active');
      $(".new-contact-form").addClass('display-none');
      $("#searchContactForm").removeClass('display-none');
    },
    addContact: function(contact){
      var fullname = contact.firstname + " " + contact.lastname;
      var email = contact.email;
      var li = $('<li>').text(fullname + " - " + email);
      var delbutton = $('<button>').addClass('delete-button').text('Delete').attr('contactid', contact.id);
      $contacts.prepend(li);
      li.append(delbutton);
      handlers.watchForDelete();
      searchFilter();
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
          $('input').val('');
          handlers.addContact(newContact);
        },
        error: function() {
          $message.text('Error saving contact.');
        }
      });
    },
    submitSearch: function(e){
      var search = {
        search: $search.val()
      };
      e.preventDefault();
      $contacts.empty();
      $.ajax({
        type: 'GET',
        url: '/contacts',
        data: search,
        success: function(contacts){
          $.each(contacts, function(i, contact){
            handlers.addContact(contact);
          });
        },
        error: function(){
          $message.text('Error with your search.');
        }
      });
    },
    watchForDelete: function(){
      $('.delete-button').on('click', handlers.deleteContact);
    },
    deleteContact: function(e){
      if (confirm('Are you sure?')) {
        var thiscontact = $(this);
        var contactid = $(this).attr('contactid');
        e.preventDefault
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

  $('#search-submit').on('click', handlers.submitSearch);

  handlers.listAllContacts();

  function searchFilter(searchContactForm, contactsIndex){

    $search.on('change', function(){
      var filter = $(this).val();
      if (filter) {
        $contacts.find('li:not(:Contains(' + filter + '))').slideUp();
        $contacts.find('li:Contains(' + filter + ')').slideDown();
      } else {
        $contacts.find('li').slideDown();
      }
    }).keyup( function(){
      $(this).change();
    });
  };

  $.expr[':'].Contains = function(a,i,m){
    return (a.textContent || a.innerText || '').toUpperCase().indexOf(m[3].toUpperCase())>=0;
  };

  searchFilter();

});
