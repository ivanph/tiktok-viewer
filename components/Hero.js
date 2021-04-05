import React, { useState } from 'react';

import { Dimensions, TouchableOpacity } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import styled from 'styled-components/native';

import ViewPager from '@react-native-community/viewpager';

import VideoPlayer from '../components/VideoPlayer';
import Info from '../components/Info';
import Sidebar from '../components/Sidebar';

const { height, width } = Dimensions.get('window');

const Container = styled(ViewPager)`
  height: ${height}px;
  width: ${width}px;
`;
const Gradient = styled(LinearGradient)`
  height: 100%;
  justify-content: space-between;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
`;
const Center = styled.View`
  flex: 1;
  flex-direction: row;
`;

const Hero = ({ videos }) => {
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  return (
    <Container
      orientation='vertical'
      onPageSelected={(e) => {
        setSelected(e.nativeEvent.position);
        setPaused(false);
      }}
      initialPage={0}
    >
      {videos.map((item, index) => {
        return (
          <TouchableOpacity
            activeOpacity={1}
            key={index}
            onPress={() => setPaused(!paused)}
          >
            <VideoPlayer
              video={item.video}
              poster={item.poster}
              isSelected={selected === index}
              paused={paused}
            />
            <Gradient
              locations={[0, 0.26, 0.6, 1]}
              colors={[
                'rgba(26,26,26,0.6)',
                'rgba(26,26,26,0)',
                'rgba(26,26,26,0)',
                'rgba(26,26,26,0.6)',
              ]}
            >
              <Center>
                <Info user={item.user} />
                <Sidebar
                  avatar={item.user.avatar}
                  count={item.count}
                  musicThumb={item.musicThumb}
                />
              </Center>
            </Gradient>
          </TouchableOpacity>
        );
      })}
    </Container>
  );
};

export default Hero;
