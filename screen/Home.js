import React, { useEffect, useState } from 'react';

import { StatusBar, Image } from 'react-native';

import styled from 'styled-components/native';

import Hero from '../components/Hero';
import Tabs from '../components/Tabs';

import api from '../services/api';
import splash from '../assets/splash-tiktok.png';

const Container = styled.View`
  flex: 1;
  background: transparent;
`;

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const users = await Promise.all([
        api.userProfile('herlyrg'),
        api.userProfile('thebomb602'),
        api.userProfile('el.josue.perrin'),
        api.userProfile('josmosquedaa'),
      ]);
      const videos = (await Promise.all(users.map((u) => api.userFeed(u, 20))))
        .flat()
        .sort((a, b) => b.date - a.date);
      setIsLoading(false);
      setVideos(videos);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);
  if (isLoading) {
    return (
      <Image
        resizeMode='cover'
        style={{
          backgroundColor: '#170c1a',
          width: '100%',
          height: '100%',
        }}
        source={splash}
      />
    );
  }
  return (
    <>
      <StatusBar
        translucent
        backgroundColor='transparent'
        barStyle='light-content'
      />
      <Container>
        <Hero videos={videos} />
        <Tabs />
      </Container>
    </>
  );
};

export default Home;
