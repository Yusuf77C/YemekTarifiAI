import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://192.168.2.4:5000';

const FavoriteRecipesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;
      const response = await axios.get(`${API_URL}/api/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(response.data);
    } catch (err) {
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRecipePress = async (item) => {
    if (!item.ingredients || !item.instructions) {
      try {
        const response = await axios.get(`${API_URL}/api/recipes/${item._id}`);
        navigation.navigate('RecipeDetail', { recipe: response.data });
      } catch (err) {
        // Hata yönetimi
      }
    } else {
      navigation.navigate('RecipeDetail', { recipe: item });
    }
  };

  const renderRecipeCard = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => handleRecipePress(item)}
    >
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/150' }}
        style={styles.recipeImage}
      />
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <Text style={styles.recipeDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.recipeMeta}>
          <Text style={styles.recipeMetaText}>{item.cookingTime} dk</Text>
          <Text style={styles.recipeMetaText}>{item.difficulty}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF9800" />
      </View>
    );
  }

  if (!favorites.length) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="heart-dislike-outline" size={64} color="#FF9800" />
        <Text style={styles.emptyText}>Henüz favori tarifiniz yok.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      renderItem={renderRecipeCard}
      keyExtractor={item => item._id}
      contentContainerStyle={styles.recipeList}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyText: {
    marginTop: 20,
    fontSize: 18,
    color: '#666',
  },
  recipeList: {
    padding: 15,
    backgroundColor: '#fff',
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
    marginBottom: 5,
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  recipeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recipeMetaText: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '500',
  },
});

export default FavoriteRecipesScreen; 