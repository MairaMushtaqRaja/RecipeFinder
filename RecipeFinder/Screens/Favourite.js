import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useFavorites } from './FavouritesContext';
import tw from 'twrnc';
import { LinearGradient } from 'expo-linear-gradient';
import  Ionicons  from '@expo/vector-icons/FontAwesome'; // Import from @expo/vector-icons
const Favourite = ({ navigation }) => {
  const { favorites, removeFavorite } = useFavorites();
  const { width, height } = Dimensions.get('window');

  return (
    <LinearGradient
      colors={['#FF9A8B', '#FF6F61']}
      style={tw`flex-1`}
    >
      <View style={tw`p-4`}>
        {/* Header */}
        <Text style={tw`text-2xl font-bold text-red-500 text-center mb-9 mt-5 mr-10`}>   My Culinary Treasures</Text>
        
        {favorites.length === 0 ? (
          <Text style={tw`text-center text-lg text-white`}>No favorites yet.</Text>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.label}
            renderItem={({ item }) => (
              <View style={tw`flex-row items-center mb-4 p-4 bg-white rounded-lg shadow-lg`}>
                <TouchableOpacity
                  style={tw`flex-row flex-1 items-center`}
                  onPress={() => navigation.navigate('RecipeDetail', { item })}
                >
                  <Image 
                    source={{ uri: item.image }} 
                    style={[
                      tw`rounded-lg`,
                      { width: width * 0.2, height: width * 0.2 }  // Responsive size
                    ]} 
                  />
                  <Text 
                    style={[
                      tw`ml-4 text-lg font-semibold text-gray-800`,
                      { maxWidth: width * 0.5, flexShrink: 1 }
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={tw`p-2 bg-red-500 rounded-sm ml-4`}
                  onPress={() => removeFavorite(item.label)}
                >
                  <Ionicons name="trash-o" size={24} color="white" />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </LinearGradient>
  );
};

export default Favourite;
