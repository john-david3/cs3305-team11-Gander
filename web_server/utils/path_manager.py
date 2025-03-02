"""Description: This file contains the PathManager class which is responsible for managing the paths of the stream data."""

import os

class PathManager():
    def __init__(self) -> None:
        self.root_path = "user_data"
        self.vod_directory_name = "vods"
        self.stream_directory_name = "streams"
        self.profile_picture_name = "index.png"
        self.stream_index_name = "index.m3u8"
        self.stream_thumbnail_name = "index.png"

    def _create_directory(self, path):
        """
        Create a directory if it does not exist
        """
        if not os.path.exists(path):
            os.makedirs(path)
            os.chmod(path, 0o777)

    def create_user(self, username):
        """
        Create directories for user stream data if they do not exist
        """
        self._create_directory(os.path.join(self.root_path, username))
        vods_path = self.get_vods_path(username)
        stream_path = self.get_stream_path(username)
        
        self._create_directory(vods_path)
        self._create_directory(stream_path)

    def delete_user(self, username):
        """
        Delete directories for user stream data
        """
        user_path = self.get_user_path(username)
        if os.path.exists(user_path):
            os.rmdir(user_path)

    def get_user_path(self, username):
        return os.path.join(self.root_path, username)

    def get_vods_path(self, username):
        return os.path.join(self.root_path, username, self.vod_directory_name)
    
    def get_stream_path(self, username):
        return os.path.join(self.root_path, username, self.stream_directory_name)
    
    def get_stream_file_path(self, username):
        return os.path.join(self.get_stream_path(username), "index.m3u8")
    
    def get_current_stream_thumbnail_file_path(self, username):
        return os.path.join(self.get_stream_path(username), "index.png")
    
    def get_vod_file_path(self, username, vod_id):
        return os.path.join(self.get_vods_path(username), f"{vod_id}.mp4")
    
    def get_vod_thumbnail_file_path(self, username, vod_id):
        return os.path.join(self.get_vods_path(username), f"{vod_id}.png")
    
    def get_profile_picture_file_path(self, username):
        return os.path.join(self.root_path, username, self.profile_picture_name)