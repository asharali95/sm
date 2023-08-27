import Resizer from "react-image-file-resizer";
const imageResizer = (file) => {
  if (file && !file.type.startsWith("image/")) {
    throw Error("Please select only JPG or PNG file");
  }
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      300,
      300,
      "JPEG",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64"
    );
  });
};

export default imageResizer;
