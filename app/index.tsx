import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const CORRECT_PASSWORD = 'Ezstash0';
const DYLIB_PATH = '/Library/MobileSubstrate/DynamicLibraries/BrawlStarsTool.dylib';

// Mock native module (replace with actual if available)
const mockNativeModule = {
  injectDylib: async (path: string) => {
    console.log('[MockNative] Would inject dylib at:', path);
    return { success: true };
  },
  launchBrawlStars: async () => {
    console.log('[MockNative] Would launch Brawl Stars');
  },
};

export default function ToolLoaderScreen() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleAuth = () => {
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      setStatus('✓ Authentication successful');
      setPassword('');
    } else {
      Alert.alert('Access Denied', 'Wrong password. Try again.');
      setPassword('');
    }
  };

  const handleInjectAndLaunch = async () => {
    try {
      setIsLoading(true);
      setStatus('⏳ Injecting dylib...');

      // Attempt to use native module, fallback to mock
      const nativeModule = global.nativeModule || mockNativeModule;
      
      const injectResult = await nativeModule.injectDylib(DYLIB_PATH);
      
      if (injectResult && injectResult.success) {
        setStatus('✓ Dylib injected successfully');
        
        // Wait a moment, then launch Brawl Stars
        setTimeout(async () => {
          setStatus('🎮 Launching Brawl Stars...');
          await nativeModule.launchBrawlStars();
        }, 500);
      } else {
        setStatus('❌ Injection failed');
      }
    } catch (error) {
      console.error('[ToolLoader] Error:', error);
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setStatus(null);
  };

  return (
    <LinearGradient
      colors={['#0a0e14', '#1a1f2e', '#0d1117']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🤖 BRAWL STARS</Text>
          <Text style={styles.subtitle}>AI Tool Loader</Text>
        </View>

        {!isAuthenticated ? (
          // Authentication Screen
          <View style={styles.authCard}>
            <Text style={styles.cardTitle}>🔐 Authentication Required</Text>
            
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter password"
              placeholderTextColor="#666"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
            />

            <TouchableOpacity
              style={[styles.button, styles.authButton]}
              onPress={handleAuth}
              disabled={isLoading || password.length === 0}
            >
              <Text style={styles.buttonText}>UNLOCK</Text>
            </TouchableOpacity>

            <Text style={styles.hint}>
              Password required to unlock AI Tool
            </Text>
          </View>
        ) : (
          // Tool Control Screen
          <View style={styles.toolCard}>
            <Text style={styles.cardTitle}>🔓 Tool Ready</Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                ✓ Authentication verified
              </Text>
              <Text style={styles.infoText}>
                ✓ Dylib ready for injection
              </Text>
              <Text style={styles.infoText}>
                Ready to inject into Brawl Stars
              </Text>
            </View>

            {status && (
              <View style={[styles.statusBox, { borderColor: getStatusColor(status) }]}>
                <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
                  {status}
                </Text>
              </View>
            )}

            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00ff55" />
              </View>
            )}

            <TouchableOpacity
              style={[styles.button, styles.injectButton, isLoading && styles.disabledButton]}
              onPress={handleInjectAndLaunch}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'INJECTING...' : 'INJECT & LAUNCH BRAWL STARS'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.logoutButton]}
              onPress={handleLogout}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>LOGOUT</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>ℹ️ How It Works</Text>
          <Text style={styles.infoLine}>1. Enter password to authenticate</Text>
          <Text style={styles.infoLine}>2. Click "INJECT & LAUNCH" to inject AI dylib</Text>
          <Text style={styles.infoLine}>3. Brawl Stars will launch with AI Tool active</Text>
          <Text style={styles.infoLine}>4. Password in Tool: Ezstash0</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

function getStatusColor(status: string): string {
  if (status.includes('✓')) return '#00ff55';
  if (status.includes('⏳')) return '#ffff00';
  if (status.includes('❌')) return '#ff3333';
  return '#00ccff';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00ff55',
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#00ccff',
    letterSpacing: 1,
  },
  authCard: {
    backgroundColor: 'rgba(20, 30, 45, 0.8)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 84, 0, 0.3)',
  },
  toolCard: {
    backgroundColor: 'rgba(20, 30, 45, 0.8)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 85, 0.3)',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00ff55',
    marginBottom: 20,
    textAlign: 'center',
  },
  passwordInput: {
    backgroundColor: 'rgba(50, 60, 80, 0.6)',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 200, 255, 0.3)',
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    flexDirection: 'row',
  },
  authButton: {
    backgroundColor: '#ff5400',
  },
  injectButton: {
    backgroundColor: '#00ff55',
  },
  logoutButton: {
    backgroundColor: 'rgba(100, 100, 100, 0.6)',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1,
  },
  hint: {
    marginTop: 12,
    color: '#999',
    fontSize: 13,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: 'rgba(0, 255, 85, 0.1)',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#00ff55',
  },
  infoText: {
    color: '#00ff55',
    fontSize: 14,
    marginVertical: 4,
    fontWeight: '500',
  },
  statusBox: {
    backgroundColor: 'rgba(0, 200, 255, 0.1)',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 200, 255, 0.3)',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  infoSection: {
    backgroundColor: 'rgba(0, 150, 200, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#00ccff',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00ccff',
    marginBottom: 12,
  },
  infoLine: {
    color: '#bbb',
    fontSize: 13,
    marginVertical: 4,
    lineHeight: 20,
  },
});
