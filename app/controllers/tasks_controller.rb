# frozen_string_literal: true

class TasksController < ApplicationController
  after_action :verify_authorized, except: :index
  after_action :verify_policy_scoped, only: :index
  before_action :authenticate_user_using_x_auth_token, except: [:new, :edit]
  before_action :load_task, only: %i[show update destroy]

  def index
    # tasks = Task.all
    @tasks = policy_scope(Task)
    render status: :ok, json: { tasks: @tasks }
  end

  def create
    @task = Task.new(task_params.merge(creator_id: @current_user.id))
    authorize @task
    if @task.save
      render status: :ok, json: { notice: t("successfully_created", entity: "Task") }
    else
      errors = @task.errors.full_messages.to_sentence
      render status: :unprocessable_entity, json: { errors: errors }
    end
  end

  def show
    authorize @task
    @comments = @task.comments.order("created_at DESC")
    @task_creator = User.find(@task.creator_id).name
  end

  def update
    authorize @task
    if @task.update(task_params)
      render status: :ok, json: { notice: "Successfully updated task." }
    else
      render status: :unprocessable_entity, json: { errors: @task.errors.full_messages.to_sentence }
    end
  end

  def destroy
    authorize @task
    if @task.destroy
      render status: :ok, json: { notice: "Successfully deleted task." }
    else
      render status: :unprocessable_entity, json: {
        errors:
              @task.errors.full_messages.to_sentence
      }
    end
  end

  private

    def task_params
      params.require(:task).permit(:title, :user_id)
    end

    def load_task
      @task = Task.find_by_slug!(params[:slug])
    rescue ActiveRecord::RecordNotFound => errors
      render json: { errors: errors }
    end
end
