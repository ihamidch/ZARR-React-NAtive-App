import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts as usePlayfair } from '@expo-google-fonts/playfair-display/useFonts';
import { PlayfairDisplay_400Regular } from '@expo-google-fonts/playfair-display/400Regular';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display/700Bold';
import { PlayfairDisplay_700Bold_Italic } from '@expo-google-fonts/playfair-display/700Bold_Italic';
import { useFonts as useInter } from '@expo-google-fonts/inter/useFonts';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { HomeScreen } from './src/screens/HomeScreen';
import { CollectionScreen } from './src/screens/CollectionScreen';
import { ProductDetailScreen } from './src/screens/ProductDetailScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { AccountScreen } from './src/screens/AccountScreen';
import { AuthProvider } from './src/context/AuthContext';
import type { RootStackParamList } from './src/types/navigation';
import { colors } from './src/theme';

SplashScreen.preventAutoHideAsync().catch(() => {
  // ignore
});

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [playfairLoaded] = usePlayfair({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_700Bold_Italic,
  });
  const [interLoaded] = useInter({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (playfairLoaded && interLoaded) {
      setIsReady(true);
    }
  }, [playfairLoaded, interLoaded]);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      try {
        await SplashScreen.hideAsync();
      } catch {
        // already hidden
      }
    }
  }, [isReady]);

  if (!isReady) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator color={colors.text} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: colors.background },
              }}
            >
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Collection" component={CollectionScreen} />
              <Stack.Screen
                name="ProductDetail"
                component={ProductDetailScreen}
              />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="Account" component={AccountScreen} />
            </Stack.Navigator>
          </NavigationContainer>
          <StatusBar style="dark" />
        </View>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
