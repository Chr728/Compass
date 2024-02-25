import React from 'react';

const FileDetailsModal = ({ document, onClose }: any) => {
  const openFile = (fileUrl: any) => {
    window.open(fileUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 overflow-y-auto z-50 flex justify-center items-center">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-4 rounded-lg z-50 max-w-sm border-2 border-gray-300">
        <h2 className="text-darkgrey text-2xl font-bold mb-4 text-center">
          {document.documentName}
        </h2>
        <p className="mb-4 text-grey text-center">{document.dateOfAnalysis}</p>
        <div className="grid grid-cols-3 gap-4">
          {document.files.map((file: any, index: any) => (
            <div
              key={index}
              className="relative border-2 p-4 rounded-xl cursor-pointer"
              onClick={() => openFile(URL.createObjectURL(file))}
            >
              {file.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-full h-auto"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-200">
                  <div className="flex flex-col items-center max-w-full">
                    <img
                      src="/documents.svg"
                      alt="PDF Icon"
                      className="w-12 h-12"
                    />
                    <span
                      className="text-darkgrey text-sm truncate"
                      style={{ maxWidth: '80px' }}
                    >
                      {file.name}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <button
            className="mt-4 border border-gray-400 bg-gray-300 hover:bg-gray-400 text-darkgrey font-bold py-2 px-4 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileDetailsModal;
