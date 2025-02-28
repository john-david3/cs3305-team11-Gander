import os
# Description: This file contains the PathManager class which is responsible for managing the paths of the stream data.

class PathManager():
    def __init__(self) -> None:
        self.root_path = "stream_data"
        self.vods_path = os.path.join(self.root_path, "vods")
        self.stream_path = os.path.join(self.root_path, "stream")
        self.profile_pictures_path = os.path.join(self.root_path, "profile_pictures")

        self._create_root_directories()

    def _create_root_directories(self):
        """
        Create directories for stream data if they do not exist
        """
        if not os.path.exists(self.vods_path):
            os.makedirs(self.vods_path)

        if not os.path.exists(self.stream_path):
            os.makedirs(self.stream_path)

        if not os.path.exists(self.profile_pictures_path):
            os.makedirs(self.profile_pictures_path)

        # Fix permissions
        os.chmod(self.vods_path, 0o777)
        os.chmod(self.stream_path, 0o777)
        os.chmod(self.profile_pictures_path, 0o777)

    def get_vods_path(self, username):
        return os.path.join(self.vods_path, username)
    
    def get_stream_path(self, username):
        return os.path.join(self.stream_path, username)
    
    def get_stream_file_path(self, username):
        return os.path.join(self.get_stream_path(username), "index.m3u8")
    
    def get_current_stream_thumbnail_file_path(self, username):
        return os.path.join(self.get_stream_path(username), "index.png")
    
    def get_vod_file_path(self, username, vod_id):
        return os.path.join(self.get_vods_path(username), f"{vod_id}.mp4")
    
    def get_vod_thumbnail_file_path(self, username, vod_id):
        return os.path.join(self.get_vods_path(username), f"{vod_id}.png")
    
    def get_profile_picture_file_path(self, username):
        return os.path.join(self.profile_pictures_path, f"{username}.png")
    
    def get_profile_picture_path(self):
        return self.profile_pictures_path