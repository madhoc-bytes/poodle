import React, { useState } from 'react';
import axios from 'axios';

const Avatar = ({ options }) => {
    const [imgSrc, setImgSrc] = useState('');
  
    React.useEffect(() => {
      const getAvatar = async () => {
        try {
          const response = await axios.get(`https://avatars.dicebear.com/api/male/${options}.svg`);
          setImgSrc(response.request.responseURL);
        } catch (error) {
          console.error('Error:', error);
        }
      };
  
      getAvatar();
    }, [options]);
  
    return (
      <div>
        <img src={imgSrc} alt="avatar" />
      </div>
    );
  };
  

const ProfileCustomization = () => {
    const [skin, setSkin] = useState('skin=light');
    const [hair, setHair] = useState('hair=short');
    const [clothing, setClothing] = useState('clothing=shirt');
  
    const handleSkinChange = (e) => {
      setSkin(e.target.value);
    };
  
    const handleHairChange = (e) => {
      setHair(e.target.value);
    };
  
    const handleClothingChange = (e) => {
      setClothing(e.target.value);
    };
  
    return (
      <div>
        <div style={{ width: '500px', height: '500px' }}>
          <Avatar options={`${skin},${hair},${clothing}`} />
        </div>
        <div>
          <h3>Customize your Avatar</h3>
          <label>
            Skin Color:
            <select onChange={handleSkinChange}>
              <option value="skin=light">Light</option>
              <option value="skin=medium">Medium</option>
              <option value="skin=dark">Dark</option>
            </select>
          </label>
          <label>
            Hair Color:
            <select onChange={handleHairChange}>
              <option value="hair=blonde">Blonde</option>
              <option value="hair=brown">Brown</option>
              <option value="hair=black">Black</option>
            </select>
          </label>
          <label>
            Clothing:
            <select onChange={handleClothingChange}>
              <option value="clothing=shirt">Shirt</option>
              <option value="clothing=blouse">Blouse</option>
              <option value="clothing=jacket">Jacket</option>
            </select>
          </label>
        </div>
      </div>
    );
  };
  
export default ProfileCustomization;

  