import { toJpeg, toPng } from 'html-to-image';
import React, { useRef, useState } from 'react';
import './styles.css';

const PostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [ogImageUrl, setOgImageUrl] = useState('');
  const [error, setError] = useState('');
  const ogImageRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateOgImage = async () => {
    const ogImageNode = ogImageRef.current;
    if (ogImageNode) {
      try {
        const dataUrl = await toPng(ogImageNode, { width: 1200, height: 630 });
        setOgImageUrl(dataUrl);
        setError('');
      } catch (err) {
        console.error('Error generating OG image:', err);
        setError('Failed to generate OG image.');
      }
    }
  };

  const downloadOgImage = async () => {
    const ogImageNode = ogImageRef.current;
    if (ogImageNode) {
      try {
        const dataUrl = await toJpeg(ogImageNode, { width: 1200, height: 630 });
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'og-image.jpg';
        link.click();
      } catch (err) {
        console.error('Error downloading OG image:', err);
        setError('Failed to download OG image.');
      }
    }
  };

  return (
    <div className="post-page">
      <h1>Create a Post</h1>
      <input 
        type="text" 
        placeholder="Title" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
      />
      <textarea 
        placeholder="Content" 
        value={content} 
        onChange={(e) => setContent(e.target.value)} 
      />
      <input type="file" onChange={handleImageUpload} />
      {image && <img src={image} alt="Post" className="uploaded-image" />}
      <button onClick={generateOgImage}>Generate OG Image</button>
      
      {error && <p className="error">{error}</p>}
      {ogImageUrl && (
        <div>
          <h2>Generated OG Image</h2>
          <img src={ogImageUrl} alt="OG" style={{ width: '100%', height: 'auto' }} />
          <button onClick={downloadOgImage}>Download OG Image as JPG</button>
        </div>
      )}

      <div style={{ display: 'none' }}>
        <div ref={ogImageRef} className="og-image">
          <header className="og-header"></header>
          <div className="og-content">
            <h1 className="og-title">{title}</h1>
            <p className="og-text">{content}</p>
            {image && <img src={image} alt="Post" className="og-image-content" />}
          </div>
          <footer className="og-footer">Posted by Your Brand</footer>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
