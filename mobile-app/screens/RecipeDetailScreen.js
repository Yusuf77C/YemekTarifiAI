import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://192.168.2.4:5000';

const RecipeDetailScreen = ({ route, navigation }) => {
  const { recipe } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);

  useEffect(() => {
    checkFavorite();
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      // Ortalama puan ve değerlendirme sayısı
      const response = await axios.get(`${API_URL}/api/recipes/${recipe._id}/ratings`);
      if (response.data && typeof response.data.averageRating === 'number') {
        setAverageRating(response.data.averageRating);
        setRatingCount(response.data.ratingCount || 0);
      } else {
        setAverageRating(0);
        setRatingCount(0);
      }

      // Kullanıcı giriş yaptıysa, sadece kendi puanını çek
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const userResponse = await axios.get(`${API_URL}/api/recipes/${recipe._id}/user-rating`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserRating(userResponse.data.rating || 0);
      }
    } catch (error) {
      setAverageRating(0);
      setRatingCount(0);
    }
  };

  const handleRating = async (rating) => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      Alert.alert('Giriş Gerekli', 'Puan vermek için giriş yapmalısınız.', [
        { text: 'Giriş Yap', onPress: () => navigation.navigate('Login') },
        { text: 'İptal', style: 'cancel' },
      ]);
      return;
    }

    try {
      console.log('Puan verme isteği gönderiliyor:', { recipeId: recipe._id, rating });
      
      const response = await axios.post(
        `${API_URL}/api/recipes/${recipe._id}/rate`,
        { rating },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      console.log('Puan verme yanıtı:', response.data);
      
      setUserRating(rating);
      fetchRatings(); // Ortalama puanı güncelle
    } catch (error) {
      console.error('Puan verme hatası:', error.response?.data || error.message);
      Alert.alert(
        'Hata',
        error.response?.data?.message || error.response?.data?.error || 'Puan verilirken bir hata oluştu.'
      );
    }
  };

  const checkFavorite = async () => {
    const token = await AsyncStorage.getItem('userToken');
    setUserToken(token);
    if (!token) return;
    try {
      const response = await axios.get(`${API_URL}/api/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const favIds = response.data.map(fav => fav._id);
      setIsFavorite(favIds.includes(recipe._id));
    } catch (err) {
      // ignore
    }
  };

  const handleFavorite = async () => {
    if (!userToken) {
      Alert.alert('Giriş Gerekli', 'Favorilere eklemek için giriş yapmalısınız.', [
        { text: 'Giriş Yap', onPress: () => navigation.navigate('Login') },
        { text: 'İptal', style: 'cancel' },
      ]);
      return;
    }
    try {
      if (isFavorite) {
        await axios.delete(`${API_URL}/api/favorites/${recipe._id}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setIsFavorite(false);
      } else {
        await axios.post(`${API_URL}/api/favorites`, { recipeId: recipe._id }, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setIsFavorite(true);
      }
    } catch (err) {
      Alert.alert('Hata', 'Favori işlemi sırasında bir hata oluştu.');
    }
  };

  const handleShare = async () => {
    try {
      const shareMessage = `${recipe.title}\n\n${recipe.description}\n\nTarifi görüntülemek için tıkla: ${API_URL}/recipes/${recipe._id}`;
      
      const result = await Share.share({
        message: shareMessage,
        title: recipe.title,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Paylaşıldı:', result.activityType);
        } else {
          console.log('Paylaşıldı');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Paylaşım iptal edildi');
      }
    } catch (error) {
      Alert.alert('Hata', 'Paylaşım sırasında bir hata oluştu.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: recipe.image || 'https://via.placeholder.com/400' }}
        style={styles.image}
      />
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleFavorite}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={32}
            color={isFavorite ? '#FF3B30' : '#FF9800'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleShare}
        >
          <Ionicons
            name="share-social-outline"
            size={32}
            color="#FF9800"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{recipe.title}</Text>

        <View style={styles.ratingContainer}>
          <View style={styles.ratingStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleRating(star)}
                style={styles.starButton}
              >
                <Ionicons
                  name={star <= userRating ? 'star' : 'star-outline'}
                  size={24}
                  color={star <= userRating ? '#FFD700' : '#FF9800'}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.ratingText}>
            {averageRating.toFixed(1)} / 5 ({ratingCount} değerlendirme)
          </Text>
        </View>

        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={20} color="#FF9800" />
            <Text style={styles.metaText}>{recipe.cookingTime} dakika</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="restaurant-outline" size={20} color="#FF9800" />
            <Text style={styles.metaText}>{recipe.difficulty}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="flame-outline" size={20} color="#FF9800" />
            <Text style={styles.metaText}>{recipe.calories} kalori</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Malzemeler</Text>
          {(recipe.ingredients || []).map((ingredient, index) => (
            <View key={index} style={styles.ingredientItem}>
              <Ionicons name="ellipse" size={8} color="#FF9800" />
              <Text style={styles.ingredientText}>{ingredient}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hazırlanışı</Text>
          {(recipe.instructions || []).map((instruction, index) => (
            <View key={index} style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>{index + 1}</Text>
              <Text style={styles.instructionText}>{instruction}</Text>
            </View>
          ))}
        </View>

        {recipe.tips && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Püf Noktaları</Text>
            <Text style={styles.tipsText}>{recipe.tips}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 250,
  },
  actionButtons: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 8,
    elevation: 5,
    zIndex: 10,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 14,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ingredientText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#444',
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  instructionNumber: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: '#FF9800',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 25,
    marginRight: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  tipsText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  ratingStars: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  starButton: {
    padding: 5,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
});

export default RecipeDetailScreen; 