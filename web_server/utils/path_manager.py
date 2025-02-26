# Description: This file contains the PathManager class which is responsible for managing the paths of the stream data.

class PathManager():
    def get_vods_path(self, username):
        return f"stream_data/vods/{username}"
    
    def get_stream_path(self, username):
        return f"stream_data/stream/{username}"
    
    def get_stream_file_path(self, username):
        return f"{self.get_stream_path(username)}/index.m3u8"
    
    def get_current_stream_thumbnail_file_path(self, username):
        return f"{self.get_stream_path(username)}/index.jpg"
    
    def get_vod_file_path(self, username, vod_id):
        return f"{self.get_vods_path(username)}/{vod_id}.mp4"
    
    def get_vod_thumbnail_file_path(self, username, vod_id):
        return f"{self.get_vods_path(username)}/{vod_id}.jpg"