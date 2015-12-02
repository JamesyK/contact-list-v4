class Contact < ActiveRecord::Base

  scope :search, -> (search) { where("firstname LIKE ? OR lastname LIKE ? OR email LIKE ?", "%#{search[:search]}%", "%#{search[:search]}%", "%#{search[:search]}%")}

end