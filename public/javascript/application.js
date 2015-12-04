$(function(){

  var $contacts = $('#contacts-index');
  var $message = $('#message');
  var $firstname = $('#firstname');
  var $lastname = $('#lastname');
  var $email = $('#email');
  var $phone = $('#phonenumber');
  var $search = $('#search');

  var handlers = {
    listNavClick: function(e){
      e.preventDefault();
      $(this).parent('ul').children('li').removeClass('active');
      $(this).addClass('active');
      $('#new-contact-div').addClass('display-none');
      $('#search-contact-div').addClass('display-none');
    },
    newNavClick: function(e){
      e.preventDefault();
      $(this).parent('ul').children('li').removeClass('active');
      $(this).addClass('active');
      $('#new-contact-div').removeClass('display-none');
      $('#search-contact-div').addClass('display-none');
      $('#firstname').focus()
    },
    searchNavClick: function(e){
      e.preventDefault();
      $(this).parent('ul').children('li').removeClass('active');
      $(this).addClass('active');
      $('#new-contact-div').addClass('display-none');
      $('#search-contact-div').removeClass('display-none');
      $search.focus();
    },
    addContact: function(contact){
      var tr = $('<tr>')
      var firstname = $('<td>').text(contact.firstname);
      var lastname = $('<td>').text(contact.lastname);
      var email = $('<td>').text(contact.email);
      var phone = $('<td>').text(contact.phone);
      var delbutton = $('<td>').html($('<button>').addClass('delete-button btn btn-default').text('Delete').attr('contactid', contact.id));
      tr.append(firstname).append(lastname).append(email).append(phone).append(delbutton);
      $contacts.prepend(tr);
      handlers.watchForDelete();
    },
    listAllContacts: function(){
      $contacts.empty();
      $.ajax({
        type: 'GET',
        url: '/contacts',
        success: function(contacts){
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
      e.preventDefault();
      var contact = {
        firstname: $firstname.val(),
        lastname: $lastname.val(),
        email: $email.val(),
        phone: $phone.val()
      };
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
          $contacts.find('td:not(:Contains(' + filter + '))').closest('tr').hide();
          $contacts.find('td:Contains(' + filter + ')').closest('tr').show();
        } else {
          $contacts.find('td').closest('tr').show();
        }
      });
    },
    watchForDelete: function(){
      $('.delete-button').unbind().on('click', handlers.deleteContact);
    },
    deleteContact: function(e){
      e.preventDefault();
      if (confirm('Are you sure?')) {
        var thiscontact = $(this);
        var contactid = $(this).attr('contactid');
        $.ajax({
          type: 'DELETE',
          url: '/contact/' + contactid,
          success: function(result) {
            thiscontact.closest('tr').remove();
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

  var soundCloud = {
    getTracks: function(){
      var scSearch = $('#sc-search').val();
      $.ajax({
        type: 'GET',
        url: 'http://api.soundcloud.com/tracks?client_id=36dea759c1db03493160f18f3527f9b8&limit=5&q=' + scSearch,
        dataType: 'json',
        success: function(results) {
          $("#sc-table-div").removeClass('hidden');
          $("#sc-results").empty();
          $.each(results, function(i, result) {
            soundCloud.listTracks(result);
          });
          $('#sc-search-form')[0].reset();
        },
        error: function() {
          console.log('getTracks error');
        }
      });
    },
    listTracks: function(result){
      var tr = $('<tr>')
      var title = $('<td>').text(result.title);
      var embedButton = $('<td>').html($('<button>').addClass('embed-button btn btn-default').text('Embed').attr('resultid', result.permalink_url));
      tr.append(title).append(embedButton);
      $('#sc-results').append(tr);
      soundCloud.watchForEmbed();
    },
    watchForEmbed: function(){
      $('.embed-button').unbind().on('click', soundCloud.getEmbed);
    },
    getEmbed: function(e){
      e.preventDefault();
      $('#embed-player').empty();
      var urlLink = $(this).attr('resultid');
      $.ajax({
        type: 'GET',
        url: 'https://soundcloud.com/oembed?url=' + urlLink + '&format=json',
        success: function(results){
          $('#embed-player').append(results.html);
        },
        error: function(){
          console.log('error embeding player');
        }
      });
    }
  };

  $('#sc-search-button').on('click', soundCloud.getTracks);


});
