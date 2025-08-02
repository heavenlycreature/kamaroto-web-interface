import React, { useRef } from 'react';

const ImageUpload = ({ onFileChange, previewSrc, isRequired }) => {
    const fileInputRef = useRef(null);
    return (
        <div>
            <label htmlFor="selfie-upload" className="block text-sm font-medium text-gray-700">Foto Selfie di Depan Rumah</label>
            <div onClick={() => fileInputRef.current.click()} className="mt-2 flex justify-center items-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer overflow-hidden">
                <input id="selfie-upload" name="selfie_image" ref={fileInputRef} type="file" onChange={onFileChange} className="hidden" accept="image/*" required={isRequired} />
                <div className="text-center w-full h-full flex items-center justify-center">
                    {previewSrc ? (
                        <img src={previewSrc} alt="Preview Selfie" className="max-h-full max-w-full object-contain" />
                    ) : (
                        <div className="text-center">
                            <img src="https://icongr.am/feather/upload-cloud.svg?size=48&color=9ca3af" alt="Upload Icon" className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">Klik untuk mengunggah foto</p>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF hingga 5MB</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;