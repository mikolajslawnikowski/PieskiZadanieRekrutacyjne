import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView, Image, TextInput, Button, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Keyboard } from 'react-native';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

function Screen1({ navigation }) {
  const [breeds, setBreeds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch('https://dog.ceo/api/breeds/list/all')
      .then((response) => response.json())
      .then((data) => {
        const breedsList = Object.keys(data.message);
        setBreeds(breedsList);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  const handleBreedPress = (breed) => {
    setIsLoading(true);
    fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
      .then((response) => response.json())
      .then((data) => {
        const dogImage = data.message;
        navigation.navigate('Screen3', { dogImage });
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  return (
    <View style={styles.container1}>
      <View style={styles.textContainer}>
        <Text style={styles.heading}>Lista ras psów</Text>
      </View>
      <View style={styles.middleContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#000000" />
        ) : (
          <ScrollView>
            {breeds.map((breed, index) => (
              <TouchableOpacity key={index} onPress={() => handleBreedPress(breed)}>
                <Text style={styles.breedText}>{breed}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity disabled={true} onPress={() => navigation.navigate('Screen1')} style={[styles.button, styles.disabledButton]}>
          <Text style={styles.buttonText}>Lista</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Screen2')} style={styles.button}>
          <Text style={styles.buttonText}>Wyszukiwarka</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

function Screen2({ navigation }) {
  const [breed, setBreed] = useState('');
  const [dogImage, setDogImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleSearch = () => {
    setIsLoading(true);
    const lowerCaseBreed = breed.toLowerCase();
    fetch(`https://dog.ceo/api/breed/${lowerCaseBreed}/images/random`)
      .then((response) => response.json())
      .then((data) => {
        const image = data.message;
        setDogImage(image);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  return (
    <View style={styles.container2}>
      <View style={styles.textContainer}>
        <Text style={styles.heading}>Wyszukiwarka ras psów</Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.containerSearch}>
          <TextInput
            style={styles.input}
            placeholder="Wpisz rasę psa"
            value={breed}
            onChangeText={(text) => setBreed(text.toLowerCase())}
          />
          <Button title="Szukaj" onPress={handleSearch} />
        </View>
        <View style={styles.containerPhoto}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#000000" />
          ) : (
            dogImage && <Image source={{ uri: dogImage }} style={styles.dogImage} />
          )}
        </View>
      </View>
      {!isKeyboardVisible && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Screen1')} style={styles.button}>
            <Text style={styles.buttonText}>Lista</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={true}
            onPress={() => navigation.navigate('Screen2')}
            style={[styles.button, styles.disabledButton]}
          >
            <Text style={styles.buttonText}>Wyszukiwarka</Text>
          </TouchableOpacity>
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

function Screen3({ route }) {
  const { dogImage } = route.params;

  return (
    <View style={styles.container3}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: dogImage }} style={styles.dogImage} />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Screen1" component={Screen1} />
        <Stack.Screen name="Screen2" component={Screen2} />
        <Stack.Screen name="Screen3" component={Screen3} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: windowHeight * 0.05,
  },
  container2: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: windowHeight * 0.05,
  },
  container3: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: windowHeight * 0.05,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    height: windowHeight * 0.02,
  },
  heading: {
    fontSize: 24,
  },
  middleContainer: {
    height: windowHeight * 0.85,
    width: windowWidth,
    paddingBottom: windowHeight * 0.02,
  },
  breedText: {
    fontSize: 16,
    marginTop: 3,
    marginBottom: 3,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingBottom: windowHeight * 0.02,
  },
  button: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    width: 150,
    marginBottom: 1,
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: '#AAAAAA',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dogImage: {
    width: windowWidth * 0.95,
    aspectRatio: 1,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  contentContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  containerSearch: {
    width: windowWidth * 0.95,
    height: windowHeight * 0.1,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerPhoto: {
    width: windowWidth * 0.95,
    height: 530,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
