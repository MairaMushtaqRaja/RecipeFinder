import React, { useState } from 'react';
import {
  View, Text, Image, TouchableOpacity, ScrollView, FlatList, Modal, Dimensions
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import  Ionicons  from '@expo/vector-icons/FontAwesome'; // Import from @expo/vector-icons
import { LinearGradient } from 'expo-linear-gradient';
import { useFavorites } from './FavouritesContext';

const RecipeDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { item } = route.params;
  const { addFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState('Source');
  const [isFavorite, setIsFavorite] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { width } = Dimensions.get('window');

  const tabs = [
    { id: 'Source', label: 'Source', data: item.source },
    { id: 'MealType', label: 'Meal Type', data: item.mealType.join(', ') },
    { id: 'Ingredients', label: 'Ingredients', data: item.ingredientLines.join(', ') },
    { id: 'DishType', label: 'Dish Type', data: item.dishType.join(', ') },
    { id: 'Nutrients', label: 'Nutrients', data: Object.keys(item.totalNutrients).map(key => `${key}: ${item.totalNutrients[key].quantity.toFixed(2)} ${item.totalNutrients[key].unit}`).join(', ') },
  ];

  const getTabBackgroundColor = (tabId) => {
    switch (tabId) {
      case 'Source': return '#ffe5b4'; // light orange
      case 'MealType': return '#ffdab9'; // peach puff
      case 'Ingredients': return '#f0e68c'; // khaki
      case 'DishType': return '#e6e6fa'; // lavender
      case 'Nutrients': return '#d8bfd8'; // thistle
      default: return '#fff';
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      addFavorite(item);
    }
    setModalVisible(true);
  };

  const navigateToFavorites = () => {
    setModalVisible(false);
    navigation.navigate('Favourite');
  };

  return (
    <LinearGradient
      colors={['#ff9a8b', '#ff6f61']}
      style={tw`flex-1`}
    >
      <ScrollView
        contentContainerStyle={tw`flex-grow`}
        style={tw`py-0`}
      >
        {/* Image with Back Arrow and Favorite Icon */}
        <View style={[tw`relative`, { height: width * 0.5 }]}>
          <Image
            source={{ uri: item.image }}
            style={[tw`absolute top-0 left-0 rounded-lg`, { width: '100%', height: '120%' }]}
          />
          {/* Back Arrow */}
          <View style={tw`absolute top-4 left-4 z-10 `}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="angle-left" color="#ff6f61" size={35} />
            </TouchableOpacity>
          </View>
          {/* Favorite Icon */}
          <View style={tw`absolute top-4 right-4 z-10 bg-[#ff6f61] rounded-sm p-2`}>
            <TouchableOpacity onPress={handleFavorite}>
              <Ionicons name={isFavorite ? "heart" : "heart"} size={20} color={isFavorite ? "red" : "white"} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Title and Details */}
        <View style={tw`p-4`}>
          <Text style={tw`text-xl font-semibold text-gray-800 mb-2 mt-10`}>{item.label}</Text>
          {/* Display Calories, Meal Type, and Total Weight */}
          <View style={tw`mt-2 mb-4 p-3 rounded-lg bg-[#f0f8ff] shadow-lg`}>
            <Text style={tw`text-base text-gray-700`}>
              <Text style={tw`font-bold text-blue-600`}>Calories: </Text>
              {item.calories.toFixed(2)}
            </Text>
            <Text style={tw`text-base text-gray-700 mt-2`}>
              <Text style={tw`font-bold text-green-600`}>Meal Type: </Text>
              {item.mealType.join(', ')}
            </Text>
            <Text style={tw`text-base text-gray-700 mt-2`}>
              <Text style={tw`font-bold text-purple-600`}>Total Weight: </Text>
              {item.totalWeight.toFixed(2)} g
            </Text>
          </View>

          {/* Tab Navigation */}
          <FlatList
            data={tabs}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(tab) => tab.id}
            renderItem={({ item: tab }) => (
              <TouchableOpacity
                style={[
                  tw`px-4 py-2 rounded-lg mr-2`,
                  {
                    backgroundColor: activeTab === tab.id ? getTabBackgroundColor(tab.id) : '#f5f5f5',
                    borderWidth: activeTab === tab.id ? 0 : 1,
                    borderColor: '#ccc',
                    shadowColor: activeTab === tab.id ? '#000' : 'transparent',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.3,
                    shadowRadius: 2,
                  },
                ]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text style={tw`text-gray-700`}>{tab.label}</Text>
              </TouchableOpacity>
            )}
          />

          {/* Tab Content */}
          <View
            style={[
              tw`mt-4 p-4 rounded-lg`,
              {
                backgroundColor: getTabBackgroundColor(activeTab),
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
              },
            ]}
          >
            <Text style={tw`text-gray-800`}>
              {tabs.find((tab) => tab.id === activeTab).data}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal for Favorite Confirmation */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-[rgba(0,0,0,0.5)]`}>
          <View style={tw`w-10/12 bg-white rounded-lg p-6`}>
            <Text style={tw`text-lg font-bold text-center mb-4`}>Recipe added to favorites!</Text>
            <TouchableOpacity
              style={tw`bg-green-500 p-3 rounded-lg mb-4`}
              onPress={() => setModalVisible(false)}
            >
              <Text style={tw`text-white text-center`}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`bg-[#FF6F61] p-3 rounded-lg`}
              onPress={navigateToFavorites}
            >
              <Text style={tw`text-white text-center`}>Go to Favorites</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default RecipeDetail;
