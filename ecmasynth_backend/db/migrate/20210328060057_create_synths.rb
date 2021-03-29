class CreateSynths < ActiveRecord::Migration[6.0]
  def change
    create_table :synths do |t|
      t.integer :envelope
      t.integer :reverb
      t.integer :delay
      t.timestamps
    end
  end
end
