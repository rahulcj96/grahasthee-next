'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ImageUploadPage() {
    const [ uploading, setUploading ] = useState(false);
    const [ imageUrl, setImageUrl ] = useState('');
    const [ error, setError ] = useState(null);

    const uploadImage = async (event) => {
        try {
            setUploading(true);
            setError(null);
            setImageUrl('');

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[ 0 ];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            setImageUrl(data.publicUrl);
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(imageUrl);
        alert('URL copied to clipboard!');
    };

    return (
        <>
            <Header />
            <main className="py-5 bg-light min-vh-100">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="card shadow border-0 p-4">
                                <h2 className="text-center mb-4 text-uppercase fw-bold">Image Upload Tool</h2>
                                <p className="text-muted text-center mb-4">
                                    Upload product images here to get a public URL for your database.
                                </p>

                                <div className="mb-4">
                                    <label htmlFor="file-upload" className="form-label fw-bold">Select Product Image</label>
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={uploadImage}
                                        disabled={uploading}
                                    />
                                </div>

                                {uploading && (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Uploading...</span>
                                        </div>
                                        <p className="mt-2">Uploading image, please wait...</p>
                                    </div>
                                )}

                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}

                                {imageUrl && (
                                    <div className="mt-4 p-4 border rounded bg-white">
                                        <h5 className="mb-3 fw-bold">Uploaded Successfully!</h5>
                                        <div className="mb-3 text-center">
                                            <img
                                                src={imageUrl}
                                                alt="Preview"
                                                className="img-fluid rounded border"
                                                style={{ maxHeight: '300px' }}
                                            />
                                        </div>
                                        <div className="input-group mb-3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={imageUrl}
                                                readOnly
                                            />
                                            <button
                                                className="btn btn-primary"
                                                type="button"
                                                onClick={copyToClipboard}
                                            >
                                                Copy URL
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
