class Task < ApplicationRecord
  belongs_to :user
  validates :content, presence: true,
                      length: { maximum: 255 }
  validates :expected_time, presence: true,
                            numericality: { greater_than_or_equal_to: 0 }
  validates :elapsed_time, presence: true,
                           numericality: { greater_than_or_equal_to: 0 }
  validates :order, presence: true,
                    numericality: { greater_than_or_equal_to: 0 }

  class << self
    def from_this_day(from_today = 0)
      today = Time.zone.today
      if from_today.zero?
        date_range = (today - 31)..(today + 13)
        where(date: [date_range, nil])
      else
        monday = today.beginning_of_week + from_today
        date_range = (monday - 7)..(monday + 13)
        where(date: [date_range, nil, today])
      end
    end

    def create_samples
      today = Time.zone.today
      create!(
        content: '読書をする',
        expected_time: 60 * 60 * 1000,
        order: 0,
        date: today
      )
      create!(
        content: '英単語を10個覚える',
        expected_time: 30 * 60 * 1000,
        order: 1,
        date: today
      )
      create!(
        content: 'リスニングをする',
        expected_time: 20 * 60 * 1000,
        order: 2,
        date: today
      )
      create!(
        content: '技術書を2章まで進める',
        expected_time: 90 * 60 * 1000,
        order: 0,
        date: today + 1
      )
      create!(
        content: '技術書を3章まで進める',
        expected_time: 120 * 60 * 1000,
        order: 0,
        date: today + 2
      )
      create!(
        content: '技術書を1章まで進める',
        expected_time: 30 * 60 * 1000,
        elapsed_time: 40 * 60 * 1000,
        order: 0,
        date: today,
        is_completed: true
      )
      create!(
        content: 'ビジネス書を読む',
        expected_time: 30 * 60 * 1000,
        elapsed_time: 20 * 60 * 1000,
        order: 1,
        date: today,
        is_completed: true
      )
      create!(
        content: '資格の勉強',
        expected_time: 120 * 60 * 1000,
        elapsed_time: 100 * 60 * 1000,
        order: 0,
        date: today - 1,
        is_completed: true
      )
      create!(
        content: '英単語を20個覚える',
        expected_time: 60 * 60 * 1000,
        elapsed_time: 90 * 60 * 1000,
        order: 1,
        date: today - 1,
        is_completed: true
      )
      create!(
        content: '筋トレをする',
        expected_time: 60 * 60 * 1000,
        elapsed_time: 90 * 60 * 1000,
        order: 0,
        date: today - 2,
        is_completed: true
      )
      4.times do |n|
        create!(
          content: "テストタスク#{n}",
          expected_time: (120 - n * 10) * 60 * 1000,
          elapsed_time: (90 - n * 10) * 60 * 1000,
          order: 0,
          date: today - 3 - n,
          is_completed: true
        )
      end
      create!(
        content: 'Punctを試してみる',
        expected_time: 30 * 60 * 1000,
        started_time: (Time.zone.now.to_f * 1000).to_i,
        on_progress: true,
        is_current: true,
        order: 0
      )
    end
  end
end
