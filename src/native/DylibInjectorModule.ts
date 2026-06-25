import { NativeModules, Platform } from 'react-native';

const DylibInjectorModule = NativeModules.DylibInjectorModule || {
  injectDylib: async (path: string) => {
    if (Platform.OS === 'ios') {
      try {
        const result = await NativeModules.DylibInjectorModule.injectDylib(path);
        return result;
      } catch (error) {
        console.error('[DylibInjectorModule] Error:', error);
        throw error;
      }
    } else {
      throw new Error('DylibInjector only available on iOS');
    }
  },
  
  launchBrawlStars: async () => {
    if (Platform.OS === 'ios') {
      try {
        await NativeModules.DylibInjectorModule.launchBrawlStars();
      } catch (error) {
        console.error('[DylibInjectorModule] Launch error:', error);
        throw error;
      }
    }
  }
};

export default DylibInjectorModule;
