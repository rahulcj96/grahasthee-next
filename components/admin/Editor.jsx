'use client';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(
    () => import('react-quill-new'),
    { ssr: false, loading: () => <p>Loading Editor...</p> }
);

const modules = {
    toolbar: [
        [ { 'header': [ 1, 2, 3, 4, 5, 6, false ] } ],
        [ 'bold', 'italic', 'underline', 'strike', 'blockquote' ],
        [ { 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' } ],
        [ 'link', 'image' ],
        [ 'clean' ]
    ],
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'indent',
    'link', 'image'
];

export default function Editor({ value, onChange }) {
    return (
        <ReactQuill
            theme="snow"
            value={value}
            onChange={onChange}
            modules={modules}
            formats={formats}
            style={{ height: '400px', marginBottom: '50px' }}
        />
    );
}
