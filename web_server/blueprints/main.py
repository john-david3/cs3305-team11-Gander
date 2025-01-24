from flask import Blueprint, render_template, session, jsonify

main_bp = Blueprint("app", __name__)

# temp, showcasing HLS


@main_bp.route('/hls1/<stream_id>')
def hls(stream_id):
    stream_url = f"http://127.0.0.1:8080/hls/{stream_id}/index.m3u8"
    return render_template("video.html", video_url=stream_url)
# --------------------------------------------------------


# TODO Route for saving uploaded thumbnails to database, serving these images to the frontend upon request: →→→ @main_bp.route('/images/<path:filename>') \n def serve_image(filename): ←←←
