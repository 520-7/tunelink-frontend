import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { launchImageLibrary } from 'react-native-image-picker';
import { RootStackParamList } from '../navigation/RootStackParamList';

type MakePostScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MakePost'>;
interface Props {
  navigation: MakePostScreenNavigationProp;
}

const MakePostScreen: React.FC<Props> = ({ navigation }) => {
  const [title, setTitle] = useState<string>('');
  const [caption, setCaption] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  // Helper function to handle text input changes
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
  };

  // Helper function to handle post creation
  const handleCreatePost = () => {
    const postDetails = { title, caption, imageUrl };
    console.log(postDetails);
    // Perform further actions like API call or state update here
    navigation.navigate('Feed');
  };

  // Helper function to render form inputs
  const renderInput = (
    label: string,
    value: string,
    onChange: (text: string) => void,
    placeholder: string,
    multiline = false,
    numberOfLines?: number
  ) => (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChange}
      mode="outlined"
      placeholder={placeholder}
      style={styles.input}
      multiline={multiline}
      numberOfLines={numberOfLines}
    />
  );

  // Function to open image picker
  const handleImageUpload = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        setImageUrl(selectedImage.uri!);
      }
    });
  };

  const renderImagePicker = () => (
    <View style={styles.logoContainer}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.uploadedImage} />
      ) : (
        <TouchableOpacity onPress={handleImageUpload} style={styles.uploadButton}>
          <Image source={require('../../assets/app-logo.png')} style={styles.logo} />
          <Text style={styles.uploadText}>Tap to upload an image</Text>
        </TouchableOpacity>
      )}
    </View>
  );
  

  return (
    <View style={styles.container}>
      {renderImagePicker()}

      <View style={styles.formContainer}>
        {renderInput('Title', title, (text) => handleInputChange(setTitle, text), 'Enter post title')}
        {renderInput('Caption', caption, (text) => handleInputChange(setCaption, text), 'Enter post caption', true, 3)}
        
        {/* Image URL input is optional since we are using image upload */}
        <TextInput
          label="Image URL"
          value={imageUrl}
          onChangeText={(text) => handleInputChange(setImageUrl, text)}
          mode="outlined"
          placeholder="Optional: Enter image URL"
          style={styles.input}
        />

        <Button mode="contained" onPress={handleCreatePost} style={styles.postButton}>
          Create Post
        </Button>

        <TouchableOpacity onPress={() => navigation.navigate('Feed')}>
          <Text style={styles.link}>Back Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  logoContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  uploadedImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  uploadText: {
    color: '#A8EB12',
    marginTop: 10,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1.4,
    paddingHorizontal: 16,
    justifyContent: 'flex-start',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#1a1a1a',
  },
  postButton: {
    backgroundColor: '#A8EB12',
    marginTop: 20,
  },
  link: {
    color: '#A8EB12',
    textAlign: 'center',
    marginTop: 20,
  },
  uploadButton: {
    alignItems: 'center',
  },
});

export default MakePostScreen;
