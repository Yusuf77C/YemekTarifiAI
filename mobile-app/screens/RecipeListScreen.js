import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DUMMY_RECIPES = [
  {
    id: '1',
    title: 'Mantı',
    image: 'https://via.placeholder.com/150',
    duration: '30 dk',
    difficulty: 'Orta',
    rating: 4.5,
  },
  {
    id: '2',
    title: 'Karnıyarık',
    image: 'https://via.placeholder.com/150',
    duration: '45 dk',
    difficulty: 'Kolay',
    rating: 4.8,
  },
  {
    id: '3',
    title: 'İskender',
    image: 'https://via.placeholder.com/150',
    duration: '60 dk',
    difficulty: 'Zor',
    rating: 4.7,
  },
];

const RecipeCard = ({ recipe, onPress }) => (
  <TouchableOpacity style={styles.recipeCard} onPress={onPress}>
    <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
    <View style={styles.recipeInfo}>
      <Text style={styles.recipeTitle}>{recipe.title}</Text>
      <View style={styles.recipeDetails}>
        <View style={styles.recipeDetail}>
          <Ionicons name="time" size={16} color="#666" />
          <Text style={styles.recipeDetailText}>{recipe.duration}</Text>
        </View>
        <View style={styles.recipeDetail}>
          <Ionicons name="speedometer" size={16} color="#666" />
          <Text style={styles.recipeDetailText}>{recipe.difficulty}</Text>
        </View>
        <View style={styles.recipeDetail}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.recipeDetailText}>{recipe.rating}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const RecipeListScreen = ({ navigation }) => {
  const handleRecipePress = (recipe) => {
    // TODO: Tarif detay sayfasına yönlendir
    console.log('Tarif seçildi:', recipe.title);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={DUMMY_RECIPES}
        renderItem={({ item }) => (
          <RecipeCard recipe={item} onPress={() => handleRecipePress(item)} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 15,
  },
  recipeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recipeImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  recipeInfo: {
    padding: 15,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  recipeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recipeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeDetailText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 14,
  },
});

export default RecipeListScreen; 