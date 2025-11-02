
import React from "react";
import { Stack, Link, router } from "expo-router";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { GlassView } from "expo-glass-effect";
import { useTheme } from "@react-navigation/native";
import { colors } from "@/styles/commonStyles";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "SET Game",
            headerLargeTitle: true,
          }}
        />
      )}
      
      <View style={styles.content}>
        <View style={styles.heroSection}>
          <Text style={styles.title}>SET Card Game</Text>
          <Text style={styles.subtitle}>
            Find sets of three cards where each feature is either all the same or all different
          </Text>
        </View>

        <Pressable
          style={styles.playButton}
          onPress={() => router.push('/(tabs)/(home)/game')}
        >
          <IconSymbol name="play.fill" size={32} color={colors.card} />
          <Text style={styles.playButtonText}>Play Game</Text>
        </Pressable>

        <View style={styles.rulesContainer}>
          <Text style={styles.rulesTitle}>How to Play</Text>
          
          <View style={styles.ruleItem}>
            <View style={styles.ruleNumber}>
              <Text style={styles.ruleNumberText}>1</Text>
            </View>
            <Text style={styles.ruleText}>
              Each card has 4 features: shape, color, number, and shading
            </Text>
          </View>

          <View style={styles.ruleItem}>
            <View style={styles.ruleNumber}>
              <Text style={styles.ruleNumberText}>2</Text>
            </View>
            <Text style={styles.ruleText}>
              A valid SET has each feature either all the same or all different across 3 cards
            </Text>
          </View>

          <View style={styles.ruleItem}>
            <View style={styles.ruleNumber}>
              <Text style={styles.ruleNumberText}>3</Text>
            </View>
            <Text style={styles.ruleText}>
              Select 3 cards to check if they form a SET. Earn points for correct sets!
            </Text>
          </View>

          <View style={styles.ruleItem}>
            <View style={styles.ruleNumber}>
              <Text style={styles.ruleNumberText}>4</Text>
            </View>
            <Text style={styles.ruleText}>
              Use hints if you&apos;re stuck, but they cost points
            </Text>
          </View>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Features</Text>
          
          <View style={styles.featureRow}>
            <View style={styles.featureItem}>
              <IconSymbol name="star.fill" size={24} color={colors.primary} />
              <Text style={styles.featureText}>Score Tracking</Text>
            </View>
            
            <View style={styles.featureItem}>
              <IconSymbol name="clock.fill" size={24} color={colors.secondary} />
              <Text style={styles.featureText}>Timer</Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={styles.featureItem}>
              <IconSymbol name="lightbulb.fill" size={24} color={colors.accent} />
              <Text style={styles.featureText}>Hints</Text>
            </View>
            
            <View style={styles.featureItem}>
              <IconSymbol name="arrow.clockwise" size={24} color={colors.highlight} />
              <Text style={styles.featureText}>Unlimited Games</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  playButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginBottom: 32,
    gap: 12,
    boxShadow: '0px 4px 12px rgba(0, 122, 255, 0.3)',
    elevation: 4,
  },
  playButtonText: {
    color: colors.card,
    fontSize: 20,
    fontWeight: 'bold',
  },
  rulesContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  rulesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  ruleNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  ruleNumberText: {
    color: colors.card,
    fontSize: 14,
    fontWeight: 'bold',
  },
  ruleText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  featuresContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  featureItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
  },
});
