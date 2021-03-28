class CreateSynths < ActiveRecord::Migration[6.0]
  def change
    create_table :synths do |t|

      t.timestamps
    end
  end
end
