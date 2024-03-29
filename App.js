//Estruturas do app
import React, { useCallback, useEffect, useState, useContext } from 'react';
import { NativeBaseProvider, StatusBar, View } from "native-base";
import { styles, colors } from "./src/styles/index";
import { JosefinSans_400Regular,JosefinSans_700Bold } from '@expo-google-fonts/josefin-sans';

//Rotas de navegação
import Routes from './src/Routes';
import { UserProvider, CurrentUserContext } from './src/components/Context/User';
//Parte de Loading
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

//SB
//export {default} from './storybook';

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  let fontsLoaded = {
    JosefinSans_400Regular,
    JosefinSans_700Bold
  };

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await SplashScreen.preventAutoHideAsync();
        await Font.loadAsync(fontsLoaded);
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        //await new Promise(resolve => setTimeout(resolve, 2000));
        if(!fontsLoaded) {
          return null;
        }
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
      <NativeBaseProvider>
        <UserProvider>
          <View style={styles.app} onLayout={onLayoutRootView}>
            <StatusBar backgroundColor={colors.blue_secondary} barStyle="light-content" />
            <Routes />
          </View>
        </UserProvider>
      </NativeBaseProvider>
  );
}