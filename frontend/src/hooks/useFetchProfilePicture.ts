import { useState, useEffect } from 'react';

const useFetchProfilePicture = ({ username, refresh = 0 }: { username: string | undefined | null, refresh?: number }) => {
  const [imageUrl, setImageUrl] = useState("/images/pfps/monkey.png");

  useEffect(() => {
    if (!username) return;

    const fetchProfilePicture = async () => {
      try {
        const timestamp = new Date().getTime(); // Unique timestamp for cache busting
        const response = await fetch(`/api/user/profile_picture/${username}?t=${timestamp}`);

        if (response.ok) {
          setImageUrl(`/api/user/profile_picture/${username}?t=${timestamp}`);
        } else {
          setImageUrl("/images/pfps/monkey.png");
        }
      } catch (error) {
        setImageUrl("/images/pfps/monkey.png");
      }
    };

    fetchProfilePicture();
  }, [username, refresh]);

  return imageUrl;
};

export default useFetchProfilePicture;

