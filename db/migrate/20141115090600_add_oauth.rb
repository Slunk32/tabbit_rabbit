class AddOauth < ActiveRecord::Migration
  def change
  	add_column :users, :vm_authtoken, :string
  	add_column :users, :vm_authrefreshtoken, :string
  end
end
