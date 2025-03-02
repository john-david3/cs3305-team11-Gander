"""Description: This file contains the PathManager class which is responsible for managing the paths of the stream data."""

import os

class PathManager():
    def __init__(self) -> None:
        self.root_path = "stream_data"
        self.vods_path = os.path.join(self.root_path, "vods")
        self.stream_path = os.path.join(self.root_path, "stream")
        self.profile_pictures_path = os.path.join(self.root_path, "profile_pictures")

        self._create_root_directories()

    def _create_directory(self, path):
        """
        Create a directory if it does not exist
        """
        if not os.path.exists(path):
            os.makedirs(path)
            os.chmod(path, 0o777)

    def _create_root_directories(self):
        """
        Create directories for stream data if they do not exist
        """
        self._create_directory(self.root_path)
        self._create_directory(self.vods_path)
        self._create_directory(self.stream_path)
        self._create_directory(self.profile_pictures_path)

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