import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

// Define the interface for the post props
interface PostProps {
  post: {
    userAvatar: string;
    username: string;
    timestamp: string;
    location: string;
    albumCoverUri: string;
    audioUri: string;
    description: string;
    spotifyUri?: string; // Add Spotify URI
  };
}

interface Interaction {
  likes: number; 
  comments: Comment[];
}

interface Comment {
  username: string;
  text: string;
}



const PostComponent: React.FC<PostProps> = ({ post }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Effect to unload sound when component unmounts
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // Handle auto-playing music when the component is rendered
  useEffect(() => {
    const playAudio = async () => {
      setLoading(true);
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: post.audioUri },
          { shouldPlay: true, isMuted: isMuted }
        );
        setSound(newSound);
        setIsPlaying(true);
      } catch (error) {
        console.log('Error playing sound', error);
      } finally {
        setLoading(false);
      }
    };
    playAudio();
  }, []);

  // Mute/Unmute functionality
  const toggleMute = async () => {
    if (sound) {
      await sound.setIsMutedAsync(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Image source={{ uri: post.userAvatar }} style={styles.profilePic} />
        <View style={styles.userDetails}>
          <Text style={styles.username}>{post.username}</Text>
          <Text style={styles.timeLocation}>{post.timestamp} - {post.location}</Text>
        </View>
        <Ionicons name="ellipsis-horizontal" size={20} color="#000" />
      </View>

      <View style={styles.albumCoverContainer}>
        <Image source={{ uri: post.albumCoverUri }} style={styles.albumCover} />
      </View>

      <View style={styles.controlsContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#FFFFFF" />
        ) : (
          <TouchableOpacity onPress={toggleMute}>
            <Ionicons name={isMuted ? 'volume-mute' : 'volume-high'} size={30} color="#FFF" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => console.log(`Go to Spotify: ${post.spotifyUri}`)}>
          <Image source={require('../../assets/spotify-logo.png')} style={styles.spotifyIcon} />
        </TouchableOpacity>
        <View style={styles.actions}>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={30} color="red" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="chatbubble-outline" size={30} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.description}>{post.description}</Text>

      {/* Comments Section */}
      <TouchableOpacity onPress={() => console.log('View more comments')}>
        <Text style={styles.viewMoreText}>View more comments</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    color: '#FFF',
  },
  timeLocation: {
    color: '#888',
    fontSize: 12,
  },
  albumCoverContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  albumCover: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  spotifyIcon: {
    width: 30,
    height: 30,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 80,
  },
  description: {
    color: '#FFF',
    marginTop: 10,
  },
  viewMoreText: {
    color: '#A8EB12',
    marginTop: 5,
  },
});

export default PostComponent;