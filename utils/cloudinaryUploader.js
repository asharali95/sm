import axios from "axios";

class CloudinaryUploader {
  async uploadImage(file, folderName, percentageSetter = undefined) {
    const res = await axios.post("/api/private/cloudinary/signature", {
      folder: `seniormanager/${folderName}`,
    });
    const data = new FormData();
    data.append("file", file);
    data.append("api_key", process.env.CLOUDINARY_API_KEY);
    data.append("signature", res.data.signature);
    data.append("timestamp", res.data.timestamp);
    data.append("folder", `seniormanager/${folderName}`);
    const uploadRes = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload/`,
      data,
      percentageSetter
        ? {
            onUploadProgress: function (e) {
              percentageSetter(Math.floor((e.loaded / e.total) * 100));
            },
          }
        : {}
    );
    return uploadRes.data;
  }
  async uploadAttachment(file, folderName, percentageSetter = undefined) {
    const res = await axios.post("/api/private/cloudinary/signature", {
      folder: `seniormanager/${folderName}`,
    });
    const data = new FormData();
    data.append("file", file);
    data.append("api_key", process.env.CLOUDINARY_API_KEY);
    data.append("signature", res.data.signature);
    data.append("timestamp", res.data.timestamp);
    data.append("folder", `seniormanager/${folderName}`);
    const uploadRes = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/auto/upload/`,
      data,
      percentageSetter
        ? {
            onUploadProgress: function (e) {
              percentageSetter(Math.floor((e.loaded / e.total) * 100));
            },
          }
        : {}
    );
    return uploadRes.data;
  }

  async deleteImage(publicId) {
    await axios.delete(`/api/private/cloudinary/deleteImage`, {
      data: {
        public_id: publicId,
      },
    });
  }
}

export const cloudinaryUploader = new CloudinaryUploader();
