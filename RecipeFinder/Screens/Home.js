import { Text, View, Image, TouchableOpacity, StatusBar, TextInput, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import  Ionicons  from '@expo/vector-icons/FontAwesome'; // Import from @expo/vector-icons
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Animated, { Easing, useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const Home = () => {
  const navigation = useNavigation();
  const [recipes, setRecipes] = useState([]);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
// Public Api's key 
  const EDAMAM_APP_ID = 'ac511631';
  const EDAMAM_APP_KEY = 'ef219d250a01be4b901afc5b35f0c052';
  useEffect(() => {
    getTrendyRecipes();
    opacity.value = withTiming(1, { duration: 1000, easing: Easing.ease });
    scale.value = withTiming(1, { duration: 1000, easing: Easing.ease });
  }, []);
  const getTrendyRecipes = () => {
    fetch(
      `https://api.edamam.com/api/recipes/v2?type=public&beta=true&q=food%26app&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}`
    )
      .then(response => response.json())
      .then(result => {
        setRecipes(result.hits.map(item => item.recipe));
      })
     
      .catch(error => console.log('error', error));
  };

  const searchBarStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  const imageStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

 // Consistent style for the recipe item card
 const trendyRecipeStyle = {
  shadowColor: '#000', // Dark shadow for better visibility
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 5,
  borderRadius: 0, // Rounded corners for the card
  backgroundColor: '#fff', // White background
};

  // Consistent size for all boxes
  const cardSize = wp('49%'); // Width of the card

  return (
    <View style={tw`flex-1`}>
      <StatusBar barStyle={'light-content'} />

      {/* Gradient Background */}
      <LinearGradient
        colors={['#FF9A8B', '#FF6F61']}
        style={tw`flex-1`}
      >
        <View style={tw`w-full h-[50%] relative`}>
          <Animated.Image
            source={{ uri: 'https://tse3.mm.bing.net/th?id=OIP.p3dFz-mPJ_5JElYoMxpc4gHaEu&pid=Api&P=0&h=220' }}
            style={[tw`absolute top-0 left-0 w-full h-full`, imageStyle]}
          />
          <View style={tw`absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,.5)] flex justify-center items-center`}>
            {/* Recipe Finder Heading */}
            <View style={tw`absolute top-12 w-full px-4`}>
              <Text style={tw`text-4xl font-extrabold text-red-600 text-center`}>
                Recipe Finder
              </Text>
              <Text style={tw`text-lg text-gray-200 text-center mt-2`}>
                Discover and search through a variety of delicious recipes!
              </Text>
            </View>

            {/* Search Bar */}
            <Animated.View style={[tw`w-11/12 h-12 bg-white rounded-full flex-row items-center px-4 mt-20`, searchBarStyle]}>
              <TextInput
                placeholder="Search your favorite recipes..."
                placeholderTextColor="#FF6F61"
                style={tw`flex-1 text-black ml-2 px-2 h-full rounded-full`}
                onFocus={() => navigation.navigate("Search")}
              />
           <Ionicons name="search" color="#FF6F61" size={20} />
            </Animated.View>
          </View>
        </View>

        {/* Trendy Recipes Section */}
        <View style={tw`pt-6 px-4`}>
      <Text style={tw`text-2xl font-bold text-red-700 mb-6`}>
        Trendy Recipes
      </Text>
      <FlatList
        horizontal
        data={recipes}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={tw`mr-4`}
            onPress={() => {
              navigation.navigate("RecipeDetail", { item });
            }}
          >
            <Animated.View
              style={[
                trendyRecipeStyle,
                {
                  width: cardSize,
                  height: cardSize + hp('5%'), // Height of the card
                  marginHorizontal: 4, // Space between cards
                  alignItems: 'center', // Center content horizontally
                  padding: 10, // Padding around content
                
                },
              ]}
            >
              {/* Centered Image with a gap */}
              <Image
                source={{ uri: item.image }}
                style={[
                  {
                    width: '100%', // Full width of the card
                    height: cardSize - 20, // Adjust height to fit within the card, considering padding
                    borderRadius: 8, // Rounded corners for the image
                    marginBottom: 10, // Gap between image and text
                  },
                ]}
                resizeMode="cover" // Adjust this based on your image aspect ratio
              />
              <Text
                style={[
                  tw`text-center text-[#FF6F61] font-semibold `,
                  {
                    width: '100%', // Ensure text doesn't exceed card width
                    overflow: 'hidden', // Hide overflow
                    textOverflow: 'ellipsis', // Truncate text
                    whiteSpace: 'nowrap', // Prevent text from wrapping to next line
                    marginBottom: 10, // Additional gap below text, if needed
                  },
                ]}
                numberOfLines={3} // Limit text to 3 lines
              >
                {item.label}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.uri}
      />
    </View>
      </LinearGradient>
    </View>
  );
};

export default Home;
