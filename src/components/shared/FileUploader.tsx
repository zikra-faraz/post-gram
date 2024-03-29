import React, { useCallback, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import { Button } from "../ui/button";

const ConvertFileToUrl = (file: File) => URL.createObjectURL(file);

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
};
//useCallback is used for memoization
const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState(mediaUrl);
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFile(acceptedFiles);
    console.log(acceptedFiles);
    fieldChange(acceptedFiles);
    setFileUrl(ConvertFileToUrl(acceptedFiles[0]));
    // Do something with the files
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
  });

  // console.log(fileUrl);

  return (
    <>
      <div
        {...getRootProps()}
        className="flex flex-center flex-col bg-dark-3 rounded-xl  "
      >
        <input {...getInputProps()} />
        {fileUrl ? (
          <>
            <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
              <img src={fileUrl} alt="image" className="file_uploader-img" />
            </div>
            <p className="file_uploader-label">
              click or drag here to change image
            </p>
          </>
        ) : (
          <div className="file_uploader-box ">
            <img
              src="/icons/file-upload.svg"
              width={96}
              height={77}
              alt="file upload"
            />

            <h3 className="base-medium text-light-2 mb-2 mt-6">
              Drag photo here
            </h3>
            <p className="text-light-4 small-regular mb-6">SVG, PNG, JPG</p>

            <Button type="button" className="shad-button_dark_4">
              Select from computer
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default FileUploader;
