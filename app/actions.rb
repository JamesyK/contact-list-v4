# Homepage (Root path)
get '/' do
  erb :index
end

get '/contacts' do
  content_type :json
  Contact.all.to_json
end

post '/contacts' do
  content_type :json
  contact = Contact.new(params)
  if contact.save
    contact.to_json
  else
    halt(500)
  end
end

post '/contacts/:id' do
  content_type :json
  contact = Contact.get(params[:id].to_i)
  if contact
    contact.to_json
  else
    halt(404)
  end
end

delete '/contact/:id' do
  contact = Contact.find(params[:id])
  if contact.destroy
    contact.to_json
  else
    halt(500)
  end
end

if Contact.count == 0
  Contact.create(firstname: "James", lastname: "Kanegae", email: "jameskanegae@gmail.com")
  Contact.create(firstname: "Test", lastname: "Test", email: "Test@test.com")
end