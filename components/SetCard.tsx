
import React from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { Card } from '@/types/SetGame';
import { colors } from '@/styles/commonStyles';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, withSpring, useSharedValue, withSequence } from 'react-native-reanimated';

interface SetCardProps {
  card: Card;
  isSelected: boolean;
  isHinted: boolean;
  onPress: (card: Card) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function SetCard({ card, isSelected, isHinted, onPress }: SetCardProps) {
  const scale = useSharedValue(1);

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    scale.value = withSequence(
      withSpring(0.95, { damping: 10 }),
      withSpring(1, { damping: 10 })
    );
    onPress(card);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const cardColor = getCardColor(card.color);
  
  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[
        styles.card,
        animatedStyle,
        isSelected && styles.selectedCard,
        isHinted && styles.hintedCard,
      ]}
    >
      <View style={styles.cardContent}>
        {renderShapes(card, cardColor)}
      </View>
    </AnimatedPressable>
  );
}

function getCardColor(color: string): string {
  switch (color) {
    case 'red':
      return '#FF3B30';
    case 'green':
      return '#4CD964';
    case 'purple':
      return '#5856D6';
    default:
      return colors.text;
  }
}

function renderShapes(card: Card, cardColor: string) {
  const shapes = [];
  for (let i = 0; i < card.number; i++) {
    shapes.push(
      <View key={i} style={styles.shapeContainer}>
        {renderShape(card.shape, card.shading, cardColor)}
      </View>
    );
  }
  return shapes;
}

function renderShape(shape: string, shading: string, color: string) {
  const shapeStyle = getShapeStyle(shading, color);

  switch (shape) {
    case 'diamond':
      return (
        <View style={[styles.diamond, shapeStyle]}>
          <View style={[styles.diamondInner, shading === 'striped' && styles.striped, { borderColor: color }]} />
        </View>
      );
    case 'oval':
      return (
        <View style={[styles.oval, shapeStyle]}>
          <View style={[styles.ovalInner, shading === 'striped' && styles.striped, { borderColor: color }]} />
        </View>
      );
    case 'squiggle':
      return (
        <View style={[styles.squiggle, shapeStyle]}>
          <View style={[styles.squiggleInner, shading === 'striped' && styles.striped, { borderColor: color }]} />
        </View>
      );
    default:
      return null;
  }
}

function getShapeStyle(shading: string, color: string) {
  switch (shading) {
    case 'solid':
      return { backgroundColor: color };
    case 'open':
      return { backgroundColor: 'transparent', borderColor: color, borderWidth: 2 };
    case 'striped':
      return { backgroundColor: 'transparent', borderColor: color, borderWidth: 2 };
    default:
      return {};
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    margin: 4,
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.border,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  selectedCard: {
    borderColor: colors.primary,
    borderWidth: 3,
    boxShadow: '0px 4px 8px rgba(0, 122, 255, 0.3)',
    elevation: 4,
  },
  hintedCard: {
    borderColor: colors.accent,
    borderWidth: 3,
    boxShadow: '0px 4px 8px rgba(255, 149, 0, 0.3)',
    elevation: 4,
  },
  cardContent: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  shapeContainer: {
    marginVertical: 4,
  },
  diamond: {
    width: 60,
    height: 30,
    transform: [{ rotate: '45deg' }],
    borderRadius: 4,
  },
  diamondInner: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  oval: {
    width: 60,
    height: 30,
    borderRadius: 15,
  },
  ovalInner: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  squiggle: {
    width: 60,
    height: 30,
    borderRadius: 8,
  },
  squiggleInner: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  striped: {
    backgroundColor: 'repeating-linear-gradient(45deg, transparent, transparent 3px, currentColor 3px, currentColor 6px)',
  },
});
