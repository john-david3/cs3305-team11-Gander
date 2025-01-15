from subprocess import Popen, PIPE

def generate_stream(STREAM_PATH, STREAM_NAME):
    """Function to run FFmpeg to convert the stream and create HLS"""
    # FFmpeg command to receive the stream and convert to HLS
    command = [
        'ffmpeg', '-i', 'udp://127.0.0.1:1935/live', '-c:v', 'libx264', '-preset', 'veryfast',
        '-c:a', 'aac', '-ar', '44100', '-ac', '2', '-f', 'hls', '-hls_time', '4', '-hls_list_size', '5',
        '-hls_segment_filename', f'{STREAM_PATH}/{STREAM_NAME}%03d.ts', f"{STREAM_PATH}/{STREAM_NAME}.m3u8"
    ]
    
    Popen(command, stdout=PIPE, stderr=PIPE)