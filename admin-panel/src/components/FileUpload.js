import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const FileUpload = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error("Please select a file to upload!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            toast.info("Uploading file...");
            const response = await axios.post('/api/upload', formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            toast.success("File uploaded successfully!");
        } catch (error) {
            toast.error("Error uploading file. Please try again.");
        }
    };

    return (
        <div>
            <h3>File Upload</h3>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default FileUpload;
