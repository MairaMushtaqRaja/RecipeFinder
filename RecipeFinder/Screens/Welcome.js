// Screens/SplashScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';

const Welcome = () => {
  const navigation = useNavigation();
 
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Start the animation when the component is mounted
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to Home screen after 3 seconds
    const timer = setTimeout(() => {
      navigation.navigate('Home');
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timer
  }, [fadeAnim, scaleAnim, navigation]);

  return (
    <LinearGradient colors={['#FF9A8B', '#FF6F61']} style={tw`flex-1 justify-center items-center`}>
      <Animated.Image
        source={{ uri: 'https://tse2.mm.bing.net/th?id=OIP.Sv6IeuHEruaYYLYqxa0ZtAHaHa&pid=Api&P=0&h=220' }} 
        style={[
          tw`w-40 h-40 mb-5 rounded-full`, // Tailwind classes for width, height, and margin-bottom
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />
      <Text style={tw`text-2xl text-red-600 font-semibold text-center`}>Find Recipes Fast!</Text>
    </LinearGradient>
  );
};

export default Welcome;
