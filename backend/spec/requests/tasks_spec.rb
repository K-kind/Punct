require 'rails_helper'

RSpec.describe 'Tasks', type: :request do
  let(:xhr_header) {
    {
      'X-Requested-With': 'XMLHttpRequest'
    }
  }
  let(:user) { create(:user) }
  let(:task) { create(:task, user: user) }

  before do
    allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
  end

  describe 'GET tasks' do
    before do
      create_list(:task, 3, user: user)
      create_list(:weekly_task, 3, user: user)
      create_list(:monthly_task, 3, user: user)
    end

    it 'returns tasks' do
      get tasks_path, headers: xhr_header

      expect(response).to have_http_status(200)
      expect(json['tasks']['daily'].length).to eq 3
      expect(json['tasks']['weekly'].length).to eq 3
      expect(json['tasks']['monthly'].length).to eq 3
    end
  end

  describe 'POST tasks' do
    context 'with valid params' do
      it 'creates a task' do
        params = {
          task: {
            content: '新しいタスク',
            expected_time: 30 * 60 * 1000,
            date: Time.zone.today,
            order: 0
          }
        }

        expect {
          post tasks_path, params: params, headers: xhr_header
        }.to change(user.tasks, :count).by(1)

        expect(response).to have_http_status(201)
        expect(json['task']['content']).to eq '新しいタスク'
      end
    end

    context 'with invalid params' do
      it 'does not create a task' do
        params = {
          task: {
            content: '',
            expected_time: -1000,
            order: -1
          }
        }

        expect {
          post tasks_path, params: params, headers: xhr_header
        }.to change(user.tasks, :count).by(0)

        expect(response).to have_http_status(200)
        expect(json['error']).to be_truthy
      end
    end
  end

  describe 'PATCH task' do
    context 'with valid params' do
      it 'updates a task' do
        params = {
          task: {
            content: '変更されたタスク',
            expected_time: 6000
          }
        }

        patch task_path(task), params: params, headers: xhr_header

        expect(response).to have_http_status(204)
        expect(task.reload.content).to eq '変更されたタスク'
        expect(task.reload.expected_time).to eq 6000
      end
    end

    context 'with invalid params' do
      it 'does not update a task' do
        params = {
          task: {
            content: '',
            expected_time: -6000
          }
        }

        patch task_path(task), params: params, headers: xhr_header

        expect(response).to have_http_status(200)
        expect(json['error']).to be_truthy
        expect(task.reload.content).to_not eq '変更されたタスク'
      end
    end
  end

  describe 'DELETE task' do
    it 'destroys a task' do
      tasks = []
      3.times do |n|
        tasks.push create(:task, user: user, date: Time.zone.today, order: n)
      end

      expect {
        delete task_path(tasks[1]), headers: xhr_header
      }.to change(user.tasks, :count).by(-1)

      expect(response).to have_http_status(200)
      expect(json['tasks'].length).to eq 2

      expect(tasks[0].reload.order).to eq 0
      expect(tasks[2].reload.order).to eq 1
    end
  end

  describe 'CLEAR tasks' do
    it 'destroys tasks' do
      create_list(:task, 3, user: user)
      params = {
        taskIds: user.tasks.pluck(:id),
        fromToday: 0
      }

      expect {
        delete clear_tasks_path, params: params, headers: xhr_header
      }.to change(user.tasks, :count).by(-3)

      expect(response).to have_http_status(200)
      expect(json['tasks'].length).to eq 0
    end
  end

  describe 'ORDER task' do
    it 'updates task orders' do
      today = Time.zone.today
      tommorow = today + 1

      tasks = []
      3.times do |n|
        tasks.push create(:task, user: user, date: today, order: n)
      end
      3.times do |n|
        tasks.push create(:task, user: user, date: tommorow, order: n)
      end
      target_task = tasks[1]

      params = {
        oldIndex: 1,
        newIndex: 0,
        fromDate: today,
        toDate: tommorow,
        fromCompleted: false,
        toCompleted: false,
        taskId: target_task.id,
        fromToday: 0
      }

      headers = xhr_header.merge({ 'Content-Type' => 'application/json' })

      post order_tasks_path, params: params.to_json, headers: headers

      expect(response).to have_http_status(200)
      expect(json['tasks'].length).to eq 6

      expect(tasks[0].reload.order).to eq 0
      expect(tasks[2].reload.order).to eq 1
      expect(tasks[3].reload.order).to eq 1
      expect(tasks[4].reload.order).to eq 2
      expect(tasks[5].reload.order).to eq 3

      expect(target_task.reload.order).to eq 0
      expect(target_task.reload.date).to eq tommorow
    end
  end

  describe 'START task' do
    it 'starts a task' do
      patch start_task_path(task), headers: xhr_header

      expect(response).to have_http_status(200)
      expect(json['task']).to be_truthy

      expect(task.reload.started_time).to be_truthy
      expect(task.reload.on_progress).to be true
    end
  end

  describe 'STOP task' do
    it 'stops a task' do
      started_task = create(:task, user: user, on_progress: true, started_time: (Time.zone.now.to_f * 1000).to_i, elapsed_time: 0)
      patch stop_task_path(started_task), headers: xhr_header

      expect(response).to have_http_status(200)
      expect(json['task']).to be_truthy

      expect(started_task.reload.elapsed_time).to_not be_zero
      expect(started_task.reload.stopped_time).to_not be_zero
      expect(started_task.reload.on_progress).to be false
    end
  end

  describe 'CHART task' do
    it 'returns calendars' do
      params = { fromBaes: 0 }
      get chart_tasks_path, params: params, headers: xhr_header

      expect(response).to have_http_status(200)
      expect(json['calendars']).to be_truthy
    end
  end
end
