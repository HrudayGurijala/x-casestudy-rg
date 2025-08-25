import { TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesome6 } from '@expo/vector-icons';

interface PostButtonProps { 
    onPress: () => void 
}

const PostButton = ({ onPress }: PostButtonProps) => {
  return (
    <TouchableOpacity 
      className="absolute bottom-5 right-5 bg-[#1DA1F2] p-4 rounded-full"
      onPress={onPress}
    >
      <FontAwesome6 name="add" size={26} color="white" />
    </TouchableOpacity>
  )
}

export default PostButton