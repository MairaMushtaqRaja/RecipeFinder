import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import Home from './Home';
import { NavigationContainer } from '@react-navigation/native';
import fetchMock from 'jest-fetch-mock';

// Set up fetch mock
fetchMock.enableMocks();

// Mock the navigation hook
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock data
const mockRecipes = {
  hits: [
    {
      recipe: {
        uri: '1',
        label: 'Pizza',
        image: 'https://example.com/pizza.jpg',
      },
    },
    {
      recipe: {
        uri: '2',
        label: 'Burger',
        image: 'https://example.com/burger.jpg',
      },
    },
  ],
};

describe('Home Component', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('fetches and displays recipes', async () => {
    // Mock the fetch response
    fetchMock.mockResponseOnce(JSON.stringify(mockRecipes));

    const { getByText } = render(
      <NavigationContainer>
        <Home />
      </NavigationContainer>
    );

    // Wait for the component to finish fetching and rendering
    await waitFor(() => {
      expect(getByText('Pizza')).toBeTruthy();
      expect(getByText('Burger')).toBeTruthy();
    });
  });

  it('handles API fetch error', async () => {
    // Mock a fetch error
    fetchMock.mockReject(new Error('Failed to fetch'));

    const { getByText } = render(
      <NavigationContainer>
        <Home />
      </NavigationContainer>
    );

    // Check if fallback content is displayed
    await waitFor(() => {
      expect(getByText('Trendy Recipes')).toBeTruthy();
    });
  });

  it('navigates to RecipeDetail on recipe item press', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockRecipes));

    const { getByText } = render(
      <NavigationContainer>
        <Home />
      </NavigationContainer>
    );
    await waitFor(() => {
      fireEvent.press(getByText('Pizza'));
      expect(mockNavigate).toHaveBeenCalledWith('RecipeDetail', { item: mockRecipes.hits[0].recipe });
    });
  });
});
