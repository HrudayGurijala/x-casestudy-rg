import { View, Text, Button } from 'react-native'
import React from 'react'
import  {useClerk} from '@clerk/clerk-expo'
const HomeScreen = () => {
  const {signOut} = useClerk();
  return (
    <View>
      <Text>HomeScreen</Text>
      <Button onPress={()=>{signOut()}} title="logout"></Button>
    </View>
  )
}

export default HomeScreen