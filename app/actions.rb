# Homepage (Root path)
get '/' do
  erb :index
end

get '/contacts' do
  content_type :json
  @contacts = Contact.all.order(created_at: :desc)

  @contacts.to_json
end

if Contact.count == 0
  Contact.create(firstname: "James", lastname: "Kanegae", email: "jameskanegae@gmail.com")
  Contact.create(firstname: "Test", lastname: "Test", email: "Test@test.com")
end