import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Text,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/RootStackParamList";
import { RouteProp } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";

import { Alert } from "react-native";
import { Button } from "react-native-paper";

const DEFAULT_AVATAR_URL = "https://via.placeholder.com/150";

const handleError = (error: any, context: string) => {
  console.error(`${context}:`, error);
  Alert.alert("Error", `Something went wrong: ${error.message}`);
};

type OtherUserProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "OtherUserProfile"
>;
type OtherUserProfileScreenRouteProp = RouteProp<
  RootStackParamList,
  "OtherUserProfile"
>;

const SERVERIP = process.env.EXPO_PUBLIC_SERVER_IP;
const SERVERPORT = process.env.EXPO_PUBLIC_SERVER_PORT;

interface Props {
  navigation: OtherUserProfileScreenNavigationProp;
  route: OtherUserProfileScreenRouteProp;
}

const OtherUserProfileScreen: React.FC<Props> = ({ navigation, route }) => {
  const [user, setUser] = useState({
    _id: "",
    userName: "",
    profileName: "",
    followerCount: 0,
    following: [],
    totalLikeCount: 0,
    profileDescription: "",
    genres: [] as string[],
    ownedPosts: [] as any[],
    userAvatarUrl: "",
  });

  const [currentUser, setCurrentUser] = useState({
    _id: "",
    following: [] as string[],
  });

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    setRefreshing(true);
    await getUser(userId);
    setRefreshing(false);
  };

  const handleFollow = async () => {
    try {
      console.log("Updating: Following user...");
      const updatedFollowing = [...currentUser.following, userId];
      const response = await fetch(
        `http://${SERVERIP}:${SERVERPORT}/api/user/${currentUserId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ following: updatedFollowing }),
        }
      );
      if (!response.ok) {
        throw new Error(`Error following user: ${response.statusText}`);
      }

      const updatedFollowerCount = user.followerCount + 1;
      const updatedUser = await fetch(
        `http://${SERVERIP}:${SERVERPORT}/api/user/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ followerCount: updatedFollowerCount }),
        }
      );
      setUser((prev) => ({
        ...prev,
        followerCount: updatedFollowerCount,
      }));

      setCurrentUser((prev) => ({
        ...prev,
        following: updatedFollowing,
      }));
    } catch (error) {
      handleError(error, "Following user");
    }
  };

  const handleUnfollow = async () => {
    try {
      console.log("Updating: Unfollowing user...");
      const updatedFollowing = currentUser.following.filter(
        (id) => id !== userId
      );

      const response = await fetch(
        `http://${SERVERIP}:${SERVERPORT}/api/user/${currentUserId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ following: updatedFollowing }),
        }
      );
      if (!response.ok) {
        throw new Error(`Error unfollowing user: ${response.statusText}`);
      }

      const updatedFollowerCount = user.followerCount - 1;
      const updatedUser = await fetch(
        `http://${SERVERIP}:${SERVERPORT}/api/user/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ followerCount: updatedFollowerCount }),
        }
      );

      setUser((prev) => ({
        ...prev,
        followerCount: updatedFollowerCount,
      }));

      setCurrentUser((prev) => ({
        ...prev,
        following: updatedFollowing,
      }));
    } catch (error) {
      handleError(error, "Unfollowing user");
    }
  };

  const userId = route.params.otherUserId;
  const currentUserId = route.params.userId;

  const getUserAvatar = async (avatarId: string) => {
    try {
      if (!avatarId) {
        setUser((prevUser) => ({
          ...prevUser,
          userAvatarUrl: DEFAULT_AVATAR_URL,
        }));
        return;
      }

      const response = await fetch(
        `http://${SERVERIP}:${SERVERPORT}/api/files/userAvatar/${avatarId}`
      );
      if (!response.ok) {
        throw new Error(`Error fetching avatar: ${response.statusText}`);
      }

      const blob = await response.blob();

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;

        setUser((prevUser) => ({
          ...prevUser,
          userAvatarUrl: `data:image/jpeg;base64,${base64data.split(",")[1]}`,
        }));
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      handleError(error, "Fetching avatar");
      console.error("Failed to fetch user avatar:", error);
    }
  };

  const getPosts = async (ownedPosts: string[]) => {
    try {
      const fetchedPosts = await Promise.all(
        ownedPosts.map(async (postId) => {
          const response = await fetch(
            `http://${SERVERIP}:${SERVERPORT}/api/post/${postId}`
          );

          if (!response.ok) {
            throw new Error(`Error fetching post: ${response.statusText}`);
          }

          const post = await response.json();

          if (post.albumCoverUrl) {
            const albumCoverResponse = await fetch(
              `http://${SERVERIP}:${SERVERPORT}/api/files/albumCover/${post.albumCoverUrl}`
            );

            if (!albumCoverResponse.ok) {
              throw new Error(
                `Error fetching album cover: ${albumCoverResponse.statusText}`
              );
            }

            const blob = await albumCoverResponse.blob();

            const reader = new FileReader();
            const base64Url = await new Promise<string>((resolve, reject) => {
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });

            post.albumCoverUrl = `data:image/jpeg;base64,${
              base64Url.split(",")[1]
            }`;
          }

          return post;
        })
      );

      setUser((prevUser) => ({
        ...prevUser,
        ownedPosts: fetchedPosts,
      }));
    } catch (error) {
      handleError(error, "Fetching Posts");
      console.error("Failed to fetch posts:", error);
    }
  };

  const getUser = async (userId: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://${SERVERIP}:${SERVERPORT}/api/user/${userId}`
      );
      const responseData = await response.json();

      if (response.ok) {
        console.log("Successfully retrieved user");
        setUser(responseData);
        getUserAvatar(responseData.userAvatarUrl);
        getPosts(responseData.ownedPosts);
      } else {
        console.error("Server error:", response);
      }
      setLoading(false);
    } catch (error) {
      handleError(error, "Fetching user");
      console.error("Network request failed:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser(userId);
  }, [userId]);

  useEffect(() => {
    const getCurrentUser = async () => {
      const currentUserResponse = await fetch(
        `http://${SERVERIP}:${SERVERPORT}/api/user/${currentUserId}`
      );
      const currentUserJson = await currentUserResponse.json();
      setCurrentUser(currentUserJson);
    };
    getCurrentUser();
  }, [currentUserId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#A8EB12" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.mainScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{
              uri: user.userAvatarUrl,
            }}
            style={styles.avatar}
          />
          <View style={styles.headerContent}>
            <Text style={styles.username}>
              {user.userName} | {user.profileName}
            </Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={refreshData}
              disabled={refreshing}
            >
              <Ionicons
                name="refresh"
                size={24}
                color="#A8EB12"
                style={[styles.refreshIcon, refreshing && styles.spinning]}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* Bio */}
        <View style={styles.bioSection}>
          <Text style={styles.bio}>{user.profileDescription}</Text>
        </View>
        <View style={styles.buttonContainer}>
          {currentUser.following.includes(userId) ? (
            <Button
              mode="contained"
              style={[styles.button, styles.unfollowButton]}
              onPress={handleUnfollow}
            >
              Unfollow
            </Button>
          ) : (
            <Button
              mode="contained"
              style={[styles.button, styles.followButton]}
              onPress={handleFollow}
            >
              Follow
            </Button>
          )}
        </View>
        <View style={styles.genresContainer}>
          {user.genres.map((genre, index) => (
            <Text style={styles.genre} key={index}>
              {genre}
            </Text>
          ))}
        </View>
        {/* Followers/Following Section */}
        <View style={styles.followSection}>
          <View style={styles.followCard}>
            <Text style={styles.followCount}>
              {user.followerCount.toLocaleString()}
            </Text>
            <Text style={styles.followLabel}>Followers</Text>
          </View>
          <TouchableOpacity
            style={styles.followCard}
            onPress={() =>
              navigation.navigate("Follow", {
                userId: userId,
                currentUserId: currentUserId,
              })
            }
          >
            <Text style={styles.followCount}>
              {user.following.length.toLocaleString()}
            </Text>
            <Text style={styles.followLabel}>Following</Text>
          </TouchableOpacity>
        </View>
        {/* User Posts List */}
        {user.ownedPosts.map((item, index) => (
          <TouchableOpacity
            key={item._id || String(index)}
            style={styles.postContainer}
            onPress={() =>
              navigation.navigate("SinglePostScreen", { postId: item._id })
            }
          >
            <Image
              source={{ uri: item.albumCoverUrl }}
              style={styles.albumCover}
            />
            <View style={styles.textContainer}>
              <Text style={styles.postTitle}>{item.caption}</Text>
              <Text style={styles.postDate}>{item.timestamp}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("Feed", { userId: currentUserId })}
        >
          <Ionicons name="musical-notes" size={35} color="#A8EB12" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() =>
            navigation.navigate("Search", { userId: currentUserId })
          }
        >
          <Ionicons name="search-outline" size={35} color="#A8EB12" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() =>
            navigation.navigate("MakePost", { userId: currentUserId })
          }
        >
          <Ionicons name="add-circle-outline" size={35} color="#A8EB12" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() =>
            navigation.navigate("Profile", { userId: currentUserId })
          }
        >
          <Ionicons name="person-circle-outline" size={35} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  unfollowButton: {
    backgroundColor: "#A8EB12",
  },
  followButton: {
    backgroundColor: "#A8EB12",
  },
  mainScroll: {
    flex: 1,
    backgroundColor: "#000", // Match your background color
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  genre: {
    color: "#A8EB12",
    fontSize: 16,
    fontWeight: "bold",
  },
  genresContainer: {
    marginTop: 20,
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  postList: {
    flex: 0, // Change this from 1 to 0
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  button: {
    width: "80%",
  },
  // header: {
  //   alignItems: "center",
  //   marginTop: 50,
  // },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  username: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  bioSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  bio: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  followSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 50,
    width: "100%",
    paddingHorizontal: 20,
  },
  headerContent: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginTop: 10,
  },
  refreshButton: {
    position: "absolute",
    right: 0,
    padding: 5,
  },
  refreshIcon: {
    opacity: 0.8,
  },
  spinning: {
    opacity: 0.5,
  },
  followCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  followCount: {
    color: "#A8EB12",
    fontSize: 24,
    fontWeight: "bold",
  },
  followLabel: {
    color: "#fff",
    fontSize: 14,
  },
  postListContent: {
    paddingBottom: 100, // Add some padding at the bottom for the footer
  },
  postContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomColor: "#4D4D4D",
    borderBottomWidth: 1,
    borderRadius: 10, // Rounded corners
    backgroundColor: "#1a1a1a", // Background for posts
    marginHorizontal: 10,
    marginVertical: 5,
  },
  albumCover: {
    width: 70,
    height: 70,
    borderRadius: 5,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  postTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  postDate: {
    color: "#ccc",
    fontSize: 12,
  },
  footer: {
    height: 80,
    backgroundColor: "#000000",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopColor: "#4D4D4D",
    borderTopWidth: 1,
    paddingHorizontal: 40,
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 20,
  },
});

export default OtherUserProfileScreen;
