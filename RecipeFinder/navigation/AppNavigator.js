import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../Screens/Home';
import RecipeDetail from '../Screens/RecipeDetail';
import Favourite from '../Screens/Favourite';
import Welcome from '../Screens/Welcome';
import Search from '../Screens/Search';
import { FavouritesProvider } from '../Screens/FavouritesContext';
const Stack = createStackNavigator();
export default function AppNavigator() {
  return (
    <FavouritesProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{headerShown:false}}>
        <Stack.Screen name="Welcome" component={Welcome}/>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="RecipeDetail" component={RecipeDetail} />
        <Stack.Screen name="Favourite" component={Favourite} />
        <Stack.Screen name="Search" component={Search}/>
      </Stack.Navigator>
    </NavigationContainer>
    </FavouritesProvider>
  );
}
