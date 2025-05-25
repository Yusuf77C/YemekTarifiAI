import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// API URL'ini environment variable olarak tanımla
const API_URL = 'http://192.168.2.5:5000';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const AuthScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // API bağlantı testi
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('API bağlantı testi başlatılıyor:', API_URL);
        const response = await api.get('/api/auth/test');
        console.log('API bağlantı testi başarılı:', response.data);
      } catch (error) {
        console.error('API bağlantı testi başarısız:', {
          error: error.message,
          url: API_URL,
          code: error.code,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers
        });
      }
    };
    testConnection();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    setLoading(true);
    console.log('Giriş denemesi başladı:', { 
      email, 
      API_URL,
      timestamp: new Date().toISOString()
    });
    
    try {
      console.log('API isteği gönderiliyor:', {
        url: `${API_URL}/api/auth/login`,
        method: 'POST',
        headers: api.defaults.headers,
        data: { email, password }
      });

      const response = await api.post('/api/auth/login', {
        email,
        password,
      });

      console.log('API yanıtı alındı:', {
        status: response.status,
        headers: response.headers,
        data: response.data
      });

      if (response.data.token && response.data.user) {
        console.log('Token ve user bilgileri alındı');
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        
        console.log('AsyncStorage kayıtları tamamlandı');
        
        // Başarılı giriş mesajı
        Alert.alert('Başarılı', 'Giriş başarılı!', [
          {
            text: 'Tamam',
            onPress: () => {
              console.log('Alert onPress tetiklendi, yönlendirme yapılıyor');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });
            },
          },
        ]);
      } else {
        console.error('Geçersiz yanıt formatı:', response.data);
        throw new Error('Geçersiz yanıt formatı');
      }
    } catch (error) {
      console.error('Login error detayları:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        code: error.code,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          baseURL: error.config?.baseURL,
          timeout: error.config?.timeout
        },
        timestamp: new Date().toISOString()
      });
      
      let errorMessage = 'Giriş yapılamadı';
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          errorMessage = 'Sunucu yanıt vermedi. Lütfen daha sonra tekrar deneyin.';
        } else if (error.response?.status === 401) {
          errorMessage = 'E-posta veya şifre hatalı';
        } else if (error.response?.status === 404) {
          errorMessage = 'Kullanıcı bulunamadı';
        } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
          errorMessage = `Sunucuya bağlanılamadı. API URL: ${API_URL}`;
        }
      }
      
      Alert.alert('Hata', errorMessage);
    } finally {
      setLoading(false);
      console.log('Loading durumu kapatıldı');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giriş Yap</Text>
      <TextInput
        style={styles.input}
        placeholder="E-posta"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Giriş Yap</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#FF9800',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#FFB74D',
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AuthScreen; 