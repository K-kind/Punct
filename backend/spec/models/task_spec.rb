require 'rails_helper'

RSpec.describe Task, type: :model do
  it { should belong_to(:user) }

  it { should validate_presence_of(:content) }
  it { should validate_length_of(:content).is_at_most(255) }

  it { should validate_presence_of(:expected_time) }
  it { should validate_numericality_of(:expected_time).is_greater_than_or_equal_to(0) }

  it { should validate_presence_of(:elapsed_time) }
  it { should validate_numericality_of(:elapsed_time).is_greater_than_or_equal_to(0) }

  it { should validate_presence_of(:order) }
  it { should validate_numericality_of(:order).is_greater_than_or_equal_to(0) }
end
