from flask_socketio import SocketIO

socketio = SocketIO(
    cors_allowed_origins="*", 
    async_mode='gevent',
    logger=False,  # Reduce logging
    engineio_logger=False,  # Reduce logging
    ping_timeout=5000,
    ping_interval=25000
)