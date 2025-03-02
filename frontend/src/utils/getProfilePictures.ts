const getProfilePictures = async (usernames: string[]) => {
    const profilePics: Record<string, string> = {};
    console.log(usernames);
    await Promise.all(usernames.map(async (username) => {
      try {
        const response = await fetch(`/api/user/profile_picture/${username}`);
  
        profilePics[username] = response.ok
          ? `/api/user/profile_picture/${username}`
          : "/images/pfps/monkey.png";
      } catch {
        profilePics[username] = "/images/pfps/monkey.png";
      }
    }));
    console.log(profilePics);
    return profilePics;
  };
  
  export default getProfilePictures;