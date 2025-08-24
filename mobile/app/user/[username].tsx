import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, ActivityIndicator, ScrollView, Image, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { format } from "date-fns";
import PostsList from "@/components/PostsList";
import { useUserProfile, useFollowUser } from "@/hooks/useUserProfile";
import { useFollowingStatus } from "@/hooks/useFollowingStatus";
import { useRefreshData } from "@/hooks/useRefreshData";

const UserProfileScreen = () => {
  const { username } = useLocalSearchParams<{ username: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const { user, posts, isLoading, refetch } = useUserProfile(username);
  const { isFollowing, canFollow } = useFollowingStatus(user?._id);
  const followMutation = useFollowUser();
  const { isRefreshing, handleRefresh } = useRefreshData([refetch]);

  const handleFollow = () => {
    if (!user || !canFollow) return;
    followMutation.mutate(user._id);
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500">User not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#1DA1F2" />
        </TouchableOpacity>
        <View>
          <Text className="text-xl font-bold text-gray-900">
            {user.firstName} {user.lastName}
          </Text>
          <Text className="text-gray-500 text-sm">{posts.length} Posts</Text>
        </View>
        <View className="w-6" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#1DA1F2"
          />
        }
      >
        <Image
          source={{
            uri: user.bannerImage || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
          }}
          className="w-full h-36"
          resizeMode="cover"
        />

        <View className="px-4 pb-4 border-b border-gray-100">
          <View className="flex-row justify-between items-end -mt-12">
            <Image
              source={{ uri: user.profilePicture || "https://via.placeholder.com/96" }}
              className="w-24 h-24 rounded-full border-4 border-white"
            />
            {canFollow && (
              <TouchableOpacity
                className={`border px-6 py-2 rounded-full ${
                  isFollowing 
                    ? 'border-gray-300 bg-white' 
                    : 'border-blue-500 bg-blue-500'
                }`}
                onPress={handleFollow}
                disabled={followMutation.isPending}
              >
                <Text className={`font-semibold ${
                  isFollowing ? 'text-gray-900' : 'text-white'
                }`}>
                  {followMutation.isPending ? '...' : isFollowing ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="mb-4">
            <View className="flex-row items-center mb-1">
              <Text className="text-xl font-bold text-gray-900 mr-1">
                {user.firstName} {user.lastName}
              </Text>
            </View>
            <Text className="text-gray-500 mb-2">@{user.username}</Text>
            {user.bio && <Text className="text-gray-900 mb-3">{user.bio}</Text>}

            {user.location && (
              <View className="flex-row items-center mb-2">
                <Feather name="map-pin" size={16} color="#657786" />
                <Text className="text-gray-500 ml-2">{user.location}</Text>
              </View>
            )}

            {user.createdAt && (
              <View className="flex-row items-center mb-3">
                <Feather name="calendar" size={16} color="#657786" />
                <Text className="text-gray-500 ml-2">
                  Joined {format(new Date(user.createdAt), "MMMM yyyy")}
                </Text>
              </View>
            )}

            <View className="flex-row">
              <TouchableOpacity className="mr-6">
                <Text className="text-gray-900">
                  <Text className="font-bold">{user.following?.length || 0}</Text>
                  <Text className="text-gray-500"> Following</Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text className="text-gray-900">
                  <Text className="font-bold">{user.followers?.length || 0}</Text>
                  <Text className="text-gray-500"> Followers</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <PostsList username={user.username} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserProfileScreen;
