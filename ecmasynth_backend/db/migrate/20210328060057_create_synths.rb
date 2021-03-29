class CreateSynths < ActiveRecord::Migration[6.0]
  def change
    create_table :synths do |t|
      t.string :envelope
      t.string :reverb
      t.string :delay
      t.timestamps
    end
  end
end
