module Api
  module V1
    class UploadsController < ApplicationController
      before_action :authenticate_user!

      def create
        if params[:model_type].present? && params[:model_id].present?
          @model = find_model(params[:model_type], params[:model_id])

          return render json: { error: "Unauthorized" }, status: :unauthorized unless can_modify_model?(@model)

          if params[params[:model_type]] && params[params[:model_type]][:images].present?
            @model.images.attach(params[params[:model_type]][:images])

            image_urls = @model.images.map do |image|
              url_for(image)
            end

            render json: { success: true, image_urls: image_urls }, status: :ok
          else
            render json: { error: "No images provided" }, status: :unprocessable_entity
          end
        else
          handle_standalone_uploads
        end
      end

      def destroy
        image = ActiveStorage::Attachment.find_by(id: params[:id])

        if image
          model = image.record
          return render json: { error: "Unauthorized" }, status: :unauthorized unless can_modify_model?(model)

          image.purge
          render json: { success: true }, status: :ok
        else
          render json: { error: "Image not found" }, status: :not_found
        end
      end

      private

      def find_model(model_type, model_id)
        model_class = model_type.classify.constantize
        model_class.find(model_id)
      rescue NameError
        render json: { error: 'Invalid model type' }, status: :unprocessable_entity
        nil
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Record not found' }, status: :not_found
        nil
      end

      def can_modify_model?(model)
        case model.class.name
        when "Product"
          current_user.admin? || model.user_id == current_user.id
        else
          current_user.admin?
        end
      end

      def handle_standalone_uploads
        uploaded_files = params[:files]

        if uploaded_files.present?
          blobs = uploaded_files.map do |file|
            blob = ActiveStorage::Blob.create_and_upload!(
              io: file,
              filename: file.original_filename,
              content_type: file.content_type
            )

            {
              id: blob.id,
              url: url_for(blob),
              filename: blob.filename.to_s,
              content_type: blob.content_type,
              byte_size: blob.byte_size
            }
          end

          render json: { success: true, blobs: blobs }, status: :ok
        else
          render json: { error: "No files provided" }, status: :unprocessable_entity
        end
      end
    end
  end
end
