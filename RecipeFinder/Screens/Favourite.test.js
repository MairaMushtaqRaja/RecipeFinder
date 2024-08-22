import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Favourite from '../Screens/Favourite'; // Adjust the path as necessary
import { useFavorites } from '../Screens/FavouritesContext'; // Adjust the path as necessary
import { NavigationContainer } from '@react-navigation/native';


// Mock the useFavorites hook
jest.mock('../Screens/FavouritesContext', () => ({
  useFavorites: jest.fn(),
}));

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

describe('Favourite Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useFavorites.mockReturnValue({
      favorites: [],
      removeFavorite: jest.fn(),
    });
  });

  const renderComponent = () => {
    return render(
      <NavigationContainer>
        <Favourite navigation={{ navigate: mockNavigate }} />
      </NavigationContainer>
    );
  };

  it('renders empty state when there are no favorites', () => {
    const { getByText } = renderComponent();

    expect(getByText('No favorites yet.')).toBeTruthy();
  });

  it('renders the list of favorite recipes', () => {
    const mockFavorites = [
      {
        label: 'Chicken Curry',
        image: 'https://example.com/chicken-curry.jpg',
      },
      {
        label: 'Pasta Carbonara',
        image: 'https://example.com/pasta-carbonara.jpg',
      },
    ];

    useFavorites.mockReturnValue({
      favorites: mockFavorites,
      removeFavorite: jest.fn(),
    });

    const { getByText, getByLabelText } = renderComponent();

    expect(getByText('Chicken Curry')).toBeTruthy();
    expect(getByText('Pasta Carbonara')).toBeTruthy();
  });

  it('navigates to RecipeDetail on pressing a favorite item', () => {
    const mockFavorites = [
      {
        label: 'Chicken Curry',
        image: 'https://example.com/chicken-curry.jpg',
      },
    ];

    useFavorites.mockReturnValue({
      favorites: mockFavorites,
      removeFavorite: jest.fn(),
    });

    const { getByText } = renderComponent();

    fireEvent.press(getByText('Chicken Curry'));

    expect(mockNavigate).toHaveBeenCalledWith('RecipeDetail', { item: mockFavorites[0] });
  });

  it('removes a favorite item when the trash icon is pressed', () => {
    const mockRemoveFavorite = jest.fn();
    const mockFavorites = [
      {
        label: 'Chicken Curry',
        image: 'https://example.com/chicken-curry.jpg',
      },
    ];

    useFavorites.mockReturnValue({
      favorites: mockFavorites,
      removeFavorite: mockRemoveFavorite,
    });

    const { getByLabelText } = renderComponent();

    fireEvent.press(getByLabelText('trash-o'));

    expect(mockRemoveFavorite).toHaveBeenCalledWith('Chicken Curry');
  });
});
