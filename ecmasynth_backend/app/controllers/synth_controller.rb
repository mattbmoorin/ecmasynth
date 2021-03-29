class SynthController < ApplicationController
def index
    synths = Synth.all

    render json: synths, status: 200
  end

  def show
    synth = Synth.find(params[:id])

    render json: synth, status: 200
  end

  def create
    synth = Synth.create(synth_params)

    render json: synth, status: 200
  end

  def update
    synth = Synth.find(synth_params)
    synth.update(synth_params)
    render json: synth, status: 200
  end

  def destroy
    synth = Synth.find(params[:id])
    synth.destroy

    render json: { synthId: synth.id }
  end

  private

  # whitelist parameters
  def synth_params
    params.require(:synth).permit(:envelope, :reverb, :delay)
  end
end
