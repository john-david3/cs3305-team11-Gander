# Description: This file contains the PathManager class which is responsible for managing the paths of the stream data.

class PathManager():
    def get_vods_path(self, username):
        return f"stream_data/{username}/vods"
    
    def get_stream_path(self, username):
        return f"stream_data/{username}/stream"
    
    def get_thumbnail_path(self, username):
        return f"stream_data/{username}/thumbnails"
    
    def get_stream_file_path(self, username):
        return f"{self.get_stream_path(username)}/index.m3u8"
    
    def get_thumbnail_file_path(self, username):
        return f"{self.get_thumbnail_path(username)}/stream.jpg"