import React from 'react';

import Video from 'react-native-video';

import styled from 'styled-components/native';

const Play = styled(Video)`
  height: 100%;
  width: 100%;
`;
const Poster = styled.ImageBackground`
  height: 100%;
`;

const VideoPlayer = ({ video, poster, isSelected, paused = false }) => {
  if (!isSelected) {
    return <Poster source={poster} />;
  }
  return (
    <Play
      rate={1.0}
      volume={1.0}
      paused={paused}
      useNativeControls={false}
      poster={poster.uri}
      posterResizeMode='stretch'
      repeat
      source={{
        uri: video,
        headers: { 'user-agent': 'okhttp', referer: 'https://www.tiktok.com/' },
      }}
      resizeMode='stretch'
    />
  );
};

export default VideoPlayer;
