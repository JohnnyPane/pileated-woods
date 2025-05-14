import pileatedClient from "./pileatedClient.js";

import { pluralizeRailsModel } from "../utils/humanizeText.js";

class PileatedApi {
  constructor(modelName) {
    this.modelName = modelName;
  }

  pluralModelName = () => {
    return pluralizeRailsModel(this.modelName);
  };

  query = async (params, signal) => {
    const response = await pileatedClient.get(`/${this.pluralModelName()}`, { params, signal });
    return response.data;
  };

  get = async (id, params) => {
    const response = await pileatedClient.get(`/${this.pluralModelName()}/${id}`, { params });
    return response.data;
  };

  create = async (data) => {
    const response = await pileatedClient.post(`/${this.pluralModelName()}`, { [this.modelName]: data });
    return response.data;
  };

  update = async (id, data) => {
    const response = await pileatedClient.put(`/${this.pluralModelName()}/${id}`, { [this.modelName]: data });
    return response.data;
  };

  delete = async (id) => {
    const response = await pileatedClient.delete(`/${this.pluralModelName()}/${id}`);
    return response.data;
  };

  uploadImages = async (modelId, modelType, files, onProgress) => {
    const formData = new FormData();
    formData.append("model_id", modelId);
    formData.append("model_type", modelType);

    files.forEach((file) => {
      formData.append(`${modelType}[images][]`, file);
    });

    const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

    const response = await pileatedClient.post(`/uploads`, formData, {
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (event) => {
        if (event.lengthComputable && typeof onProgress === "function") {
          const percent = Math.round((event.loaded * 100) / event.total);
          onProgress(percent);
        }
      },
    });

    return response.data;
  };


}

export default PileatedApi;