class AddPhoneToContact < ActiveRecord::Migration
  def change
    change_table :contacts do |t|
      t.string :phone
    end
  end
end
