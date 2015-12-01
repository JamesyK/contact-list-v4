# Homepage (Root path)
get '/' do
  erb :index
end

get '/contacts' do
  content_type :json
  @contacts = Contact.all

  @contacts.to_json
end

post '/contacts' do
  content_type :json
  @contact = Contact.new(params)

  if @contact.save
    @contct.to_json
  else
    halt 500
  end
end

if Contact.count == 0
  Contact.create(firstname: "James", lastname: "Kanegae", email: "jameskanegae@gmail.com")
  Contact.create(firstname: "Test", lastname: "Test", email: "Test@test.com")
end