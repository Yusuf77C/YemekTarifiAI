import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  FlatList,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.2.4:5000';

const HomeScreen = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userToken, setUserToken] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    difficulty: '',
    cookingTime: '',
    category: '',
    calories: '',
  });
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    checkToken();
    fetchRecipes();
  }, []);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      setUserToken(token);
    } catch (error) {
      console.log('Token kontrolü sırasında hata:', error);
    }
  };

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/recipes`);
      setRecipes(response.data);
    } catch (error) {
      console.log('Tarifler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = !filters.difficulty || recipe.difficulty === filters.difficulty;
    const matchesTime = !filters.cookingTime || recipe.cookingTime <= parseInt(filters.cookingTime);
    const matchesCategory = !filters.category || recipe.category === filters.category;
    const matchesCalories = !filters.calories || (filters.calories === '1000+' ? recipe.calories >= 1000 : recipe.calories <= parseInt(filters.calories));
    
    return matchesSearch && matchesDifficulty && matchesTime && matchesCategory && matchesCalories;
  });

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtrele</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Zorluk Seviyesi</Text>
            <View style={styles.filterOptions}>
              {['Kolay', 'Orta', 'Zor'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.filterOption,
                    filters.difficulty === level && styles.filterOptionSelected,
                  ]}
                  onPress={() => setFilters({ ...filters, difficulty: filters.difficulty === level ? '' : level })}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filters.difficulty === level && styles.filterOptionTextSelected,
                  ]}>{level}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Maksimum Süre (dk)</Text>
            <View style={styles.filterOptions}>
              {['30', '60', '90', '120', '150', '180'].map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.filterOption,
                    filters.cookingTime === time && styles.filterOptionSelected,
                  ]}
                  onPress={() => setFilters({ ...filters, cookingTime: filters.cookingTime === time ? '' : time })}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filters.cookingTime === time && styles.filterOptionTextSelected,
                  ]}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Maksimum Kalori</Text>
            <View style={styles.filterOptions}>
              {['200', '400', '600', '800', '1000+'].map((cal) => (
                <TouchableOpacity
                  key={cal}
                  style={[
                    styles.filterOption,
                    filters.calories === cal && styles.filterOptionSelected,
                  ]}
                  onPress={() => setFilters({ ...filters, calories: filters.calories === cal ? '' : cal })}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filters.calories === cal && styles.filterOptionTextSelected,
                  ]}>{cal}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Kategori</Text>
            <View style={styles.filterOptions}>
              {['Ana Yemek', 'Çorba', 'Tatlı', 'Salata', 'Kahvaltı', 'Aperatif', 'Vejeteryan', 'Vegan'].map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterOption,
                    filters.category === category && styles.filterOptionSelected,
                  ]}
                  onPress={() => setFilters({ ...filters, category: filters.category === category ? '' : category })}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filters.category === category && styles.filterOptionTextSelected,
                  ]}>{category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={() => setFilters({ difficulty: '', cookingTime: '', category: '', calories: '' })}
          >
            <Text style={styles.clearFiltersText}>Filtreleri Temizle</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderRecipeCard = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Yemek Tarifi AI</Text>
        <TouchableOpacity
          style={styles.authButton}
          onPress={() => {
            if (userToken) {
              navigation.navigate('Profil');
            } else {
              setShowAuthModal(true);
            }
          }}
        >
          <Ionicons
            name={userToken ? 'person-circle' : 'log-in'}
            size={24}
            color="#FF9800"
          />
        </TouchableOpacity>
      </View>

      {/* Arama ve Filtreleme */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tarif ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons name="options" size={24} color="#FF9800" />
        </TouchableOpacity>
      </View>

      {/* Tarif Listesi */}
      {loading ? (
        <ActivityIndicator size="large" color="#FF9800" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredRecipes}
          renderItem={renderRecipeCard}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.recipeList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {renderFilterModal()}
      <Modal
        visible={showAuthModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAuthModal(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 30,
            width: '80%',
            alignItems: 'center'
          }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Hoş Geldiniz</Text>
            <TouchableOpacity
              style={{
                backgroundColor: '#FF9800',
                borderRadius: 10,
                padding: 15,
                width: '100%',
                alignItems: 'center',
                marginBottom: 10
              }}
              onPress={() => {
                setShowAuthModal(false);
                navigation.navigate('Login');
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Giriş Yap</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderColor: '#FF9800',
                borderWidth: 2,
                borderRadius: 10,
                padding: 15,
                width: '100%',
                alignItems: 'center'
              }}
              onPress={() => {
                setShowAuthModal(false);
                navigation.navigate('Register');
              }}
            >
              <Text style={{ color: '#FF9800', fontWeight: 'bold', fontSize: 16 }}>Kayıt Ol</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: 20 }}
              onPress={() => setShowAuthModal(false)}
            >
              <Text style={{ color: '#666' }}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  authButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    gap: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterButton: {
    width: 45,
    height: 45,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeList: {
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  filterOptionSelected: {
    backgroundColor: '#FF9800',
  },
  filterOptionText: {
    color: '#666',
    fontSize: 14,
  },
  filterOptionTextSelected: {
    color: '#fff',
  },
  clearFiltersButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    alignItems: 'center',
  },
  clearFiltersText: {
    color: '#FF9800',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default HomeScreen; 