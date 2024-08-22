import {
  StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Modal, ScrollView, Image
} from 'react-native';
import React, { useState, useEffect } from 'react';
import tw from 'twrnc';

import { useNavigation } from '@react-navigation/native';
import {
  DIET_FILTERS, HEALTH_FILTERS, MEAL_FILTERS, DISH_FILTERS, CUISINE_FILTERS
} from './Data';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/FontAwesome';
const Search = () => {
  const navigation = useNavigation();
  const EDAMAM_APP_ID = 'ac511631';
  const EDAMAM_APP_KEY = 'ef219d250a01be4b901afc5b35f0c052';
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    diet: [],
    health: [],
    meal: [],
    dish: [],
    cuisine: [],
  });

  const searchBarAnimation = useSharedValue(-100);

  const animatedSearchBarStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withSpring(searchBarAnimation.value) }],
    };
  });

  useEffect(() => {
    searchBarAnimation.value = 0;
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const dietQuery = selectedFilters.diet.length ? `&diet=${selectedFilters.diet.join(',')}` : '';
      const healthQuery = selectedFilters.health.length ? `&health=${selectedFilters.health.join(',')}` : '';
      const mealQuery = selectedFilters.meal.length ? `&mealType=${selectedFilters.meal.join(',')}` : '';
      const dishQuery = selectedFilters.dish.length ? `&dishType=${selectedFilters.dish.join(',')}` : '';
      const cuisineQuery = selectedFilters.cuisine.length ? `&cuisineType=${selectedFilters.cuisine.join(',')}` : '';

      const searchUrl = `https://api.edamam.com/api/recipes/v2?type=public&beta=true&q=${query}${dietQuery}${healthQuery}${mealQuery}${dishQuery}${cuisineQuery}&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}`;

      fetch(searchUrl)
        .then(response => response.json())
        .then(result => {
          setSearchResults(result.hits.map(item => item.recipe));
        })
        .catch(error => console.log('error', error));
    } else {
      setSearchResults([]);
    }
  };

  const toggleFilter = (filterType, filter) => {
    setSelectedFilters((prevFilters) => {
      const currentFilters = prevFilters[filterType];
      const index = currentFilters.indexOf(filter);

      if (index > -1) {
        return {
          ...prevFilters,
          [filterType]: currentFilters.filter((item) => item !== filter),
        };
      } else {
        return {
          ...prevFilters,
          [filterType]: [...currentFilters, filter],
        };
      }
    });
  };

  const applyFilters = () => {
    setModalVisible(false);
    handleSearch(searchQuery);
  };

  const renderFilterOptions = (filterType, filters) => (
    <View style={tw`mb-4`}>
      <Text style={tw`text-lg font-bold mb-2 text-[#FF6F61]`}>{filterType}</Text>
      <View style={tw`flex-row flex-wrap border-b border-[#FF6F61]`}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => toggleFilter(filterType.toLowerCase(), filter)}
            style={tw`px-3 py-2 bg-[#f7c6c7] border border-[#FF6F61] rounded-sm mr-2 mb-2`}
          >
            <Text style={tw`text-black`}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={tw`flex-1 bg-gray-200`}>
      <LinearGradient colors={['#FF9A8B', '#FF6F61']} style={tw`flex-1`}>
        <View style={tw`absolute top-4 left-4 z-0 `}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="angle-left" size={34} color="white" />
          </TouchableOpacity>
        </View>

        <View style={tw`mt-20 w-full`}>
          <Animated.View style={[tw`w-11/12 h-12 bg-[rgba(255,255,255,0.8)] rounded-sm ml-4 flex-row items-center px-4`, animatedSearchBarStyle]}>
            <Ionicons name="search" size={20} color="#FF6F61" />
            <TextInput
              placeholder="Please search here...."
              placeholderTextColor="#FF6F61"
              style={tw`flex-1 text-[#FF6F61] ml-10 px-2 h-full rounded-sm`}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Ionicons name="reorder" size={20} color="#FF6F61" />
            </TouchableOpacity>
          </Animated.View>

          {/* Display Live Search Results */}
          {searchResults.length > 0 && (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.uri}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={tw`flex-row p-2 bg-white border-b border-gray-300 items-center`}
                  onPress={() => navigation.navigate('RecipeDetail', { item })}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={tw`w-16 h-16 rounded-md`}
                  />
                  <Text style={tw`text-sm ml-4 text-[#FF6F61] flex-shrink flex-wrap`}>{item.label}</Text>
                </TouchableOpacity>
              )}
              style={tw`mt-4 w-11/12 ml-4`}
              contentContainerStyle={tw`pb-20`} // Add padding to the bottom for better scrolling
            />
          )}

        </View>

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={tw`flex-1 justify-center items-center bg-[rgba(0,0,0,0.5)]`}>
            <View style={tw`w-11/12 bg-gray-300 rounded-lg p-6`}>
              <ScrollView style={tw`mt-4`}>
                {renderFilterOptions('Diet', DIET_FILTERS)}
                {renderFilterOptions('Health', HEALTH_FILTERS)}
                {renderFilterOptions('Meal', MEAL_FILTERS.map(item => item.title))}
                {renderFilterOptions('Dish', DISH_FILTERS)}
                {renderFilterOptions('Cuisine', CUISINE_FILTERS)}
                <TouchableOpacity
                  style={tw`mb-8 bg-[#FF6F61] p-3 rounded-lg`}
                  onPress={applyFilters}
                >
                  <Text style={tw`text-white text-center`}>Apply Filters</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({});
