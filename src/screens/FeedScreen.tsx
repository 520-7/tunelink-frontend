import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import PostComponent from '../components/PostComponent'; // Adjust the path to your component
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/RootStackParamList';

const { width, height } = Dimensions.get('window');

type FeedScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Feed'>;
interface Props {
  navigation: FeedScreenNavigationProp;
}

const FeedScreen: React.FC<Props> =  ({navigation}) => {
  // Mock post data (you can have an array of mock posts)
  const posts = [
    {
      userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      username: 'User456',
      timestamp: '2h ago',
      location: 'New York',
      albumCoverUri: 'https://via.placeholder.com/350x250',
      audioUri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      description: 'Just discovered this amazing track!  😍',
      spotifyLink: 'https://open.spotify.com/track/xyz',
      comments: [
        { username: 'Commenter1', text: 'Great track!' },
        { username: 'Commenter2', text: 'This is my jam!' },
        { username: 'Commenter3', text: 'Loved it!' },
      ],
    },
    {
      userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      username: 'User789',
      timestamp: '1h ago',
      location: 'Los Angeles',
      albumCoverUri: 'https://via.placeholder.com/350x250',
      audioUri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      description: 'This song is so chill! 🎧',
      spotifyLink: 'https://open.spotify.com/track/abc',
      comments: [
        { username: 'Commenter4', text: 'Relaxing vibes!' },
        { username: 'Commenter5', text: 'Perfect for studying!' },
        { username: 'Commenter6', text: 'Smooth!' },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header with logo */}
      <View style={styles.header}>
        <Image source={require('../../assets/app-logo.png')} style={styles.logo} />
      </View>

      {/* Feed */}
      <FlatList
        data={posts}
        keyExtractor={(item, index) => index.toString()} // Use index as key (for mock data)
        renderItem={({ item }) => <PostComponent post={item} />} // Pass each post to the PostComponent
        style={styles.feed}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="musical-notes" size={30} color="#A8EB12" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('MakePost')}>
          <Ionicons name="add-circle" size={70} color="#A8EB12" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Profile')}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/30.jpg' }}
            style={styles.profilePic}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Black background to match theme
  },
  header: {
    height: 100,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#4D4D4D',
    borderBottomWidth: 1,
    paddingTop: 30,
  },
  logo: {
    width: 120,
    height: 65,
    resizeMode: 'contain',
  },
  feed: {
    flex: 1,
  },
  footer: {
    height: 80,
    backgroundColor: '#000000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderTopColor: '#4D4D4D',
    borderTopWidth: 1,
  },
  iconButton: {
    padding: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    transform: [{ translateX: 160 }, { translateY: 20 }],
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 20,
  },
});

export default FeedScreen;