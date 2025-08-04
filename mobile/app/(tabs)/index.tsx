import {  Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'
import SignOutButton from '@/components/SignOutButton'

const HomeScreen = () => {
  return (
    <SafeAreaView className="flex-1">
      <Text>HomeScreen</Text>
      <SignOutButton/>
    </SafeAreaView>
  )
}

export default HomeScreen