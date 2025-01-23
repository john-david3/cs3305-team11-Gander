// video.html

// src/components/Video/VideoPlayer.tsx
import React, { useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoPlayer: React.FC = () => {
  useEffect(() => {
    const player = videojs('player', {
      width: 1280,
      height: 720,
      controls: true,
      preload: 'auto',
      sources: [{
        src: '/hls/stream.m3u8',
        type: 'application/x-mpegURL'
      }]
    });

    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, []);

  return (
    <video
      id="player"
      className="video-js vjs-default-skin"
    />
  );
};

export default VideoPlayer;
