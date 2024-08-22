import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Search from '../Screens/Search';
import { NavigationContainer } from '@react-navigation/native';
import fetchMock from 'jest-fetch-mock';
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
  };
});

describe('Search Component', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('renders search bar and initiates a search on input', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        hits: [{ recipe: { label: 'Chicken Curry', uri: 'recipe_uri', image: 'image_url' } }],
      })
    );

    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <Search />
      </NavigationContainer>
    );

    const searchInput = getByPlaceholderText('Please search here....');
    fireEvent.changeText(searchInput, 'chicken');

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('https://api.edamam.com/api/recipes/v2')
      );
    });

    await waitFor(() => {
      expect(getByText('Chicken Curry')).toBeTruthy();
    });
  });

  it('opens filter modal and applies selected filters', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        hits: [{ recipe: { label: 'Vegetarian Curry', uri: 'recipe_uri', image: 'image_url' } }],
      })
    );

    const { getByPlaceholderText, getByText, getAllByText } = render(
      <NavigationContainer>
        <Search />
      </NavigationContainer>
    );

    const searchInput = getByPlaceholderText('Please search here....');
    fireEvent.changeText(searchInput, 'curry');

    const filterButton = getByText('reorder');
    fireEvent.press(filterButton);

    const dietFilter = getAllByText('Diet')[0];
    fireEvent.press(dietFilter);

    const applyButton = getByText('Apply Filters');
    fireEvent.press(applyButton);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('&diet='));
      expect(getByText('Vegetarian Curry')).toBeTruthy();
    });
  });

  it('handles empty search results correctly', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        hits: [],
      })
    );

    const { getByPlaceholderText, queryByText } = render(
      <NavigationContainer>
        <Search />
      </NavigationContainer>
    );

    const searchInput = getByPlaceholderText('Please search here....');
    fireEvent.changeText(searchInput, 'nonexistentrecipe');

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
      expect(queryByText('nonexistentrecipe')).toBeNull();
    });
  });

  it('renders filters correctly', () => {
    const { getByText } = render(
      <NavigationContainer>
        <Search />
      </NavigationContainer>
    );

    const filterButton = getByText('reorder');
    fireEvent.press(filterButton);

    expect(getByText('Diet')).toBeTruthy();
    expect(getByText('Health')).toBeTruthy();
    expect(getByText('Meal')).toBeTruthy();
    expect(getByText('Dish')).toBeTruthy();
    expect(getByText('Cuisine')).toBeTruthy();
  });
});
