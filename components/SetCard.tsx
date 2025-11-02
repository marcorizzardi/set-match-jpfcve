
import React from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { Card } from '@/types/SetGame';
import { colors } from '@/styles/commonStyles';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, withSpring, useSharedValue, withSequence } from 'react-native-reanimated';
import Svg, { Circle, Polygon, Rect, Defs, Pattern, Line } from 'react-native-svg';

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
  const patternId = `pattern-${shape}-${shading}-${color.replace('#', '')}`;
  
  switch (shape) {
    case 'circle':
      return (
        <Svg width={32} height={32} viewBox="0 0 32 32">
          <Defs>
            <Pattern
              id={patternId}
              patternUnits="userSpaceOnUse"
              width="4"
              height="4"
              patternTransform="rotate(45)"
            >
              <Line x1="0" y1="0" x2="0" y2="4" stroke={color} strokeWidth="1.5" />
            </Pattern>
          </Defs>
          <Circle
            cx="16"
            cy="16"
            r="12"
            fill={shading === 'filled' ? color : shading === 'striped' ? `url(#${patternId})` : 'transparent'}
            stroke={color}
            strokeWidth="2"
          />
        </Svg>
      );
    case 'triangle':
      return (
        <Svg width={32} height={32} viewBox="0 0 32 32">
          <Defs>
            <Pattern
              id={patternId}
              patternUnits="userSpaceOnUse"
              width="4"
              height="4"
              patternTransform="rotate(45)"
            >
              <Line x1="0" y1="0" x2="0" y2="4" stroke={color} strokeWidth="1.5" />
            </Pattern>
          </Defs>
          <Polygon
            points="16,6 28,26 4,26"
            fill={shading === 'filled' ? color : shading === 'striped' ? `url(#${patternId})` : 'transparent'}
            stroke={color}
            strokeWidth="2"
          />
        </Svg>
      );
    case 'square':
      return (
        <Svg width={32} height={32} viewBox="0 0 32 32">
          <Defs>
            <Pattern
              id={patternId}
              patternUnits="userSpaceOnUse"
              width="4"
              height="4"
              patternTransform="rotate(45)"
            >
              <Line x1="0" y1="0" x2="0" y2="4" stroke={color} strokeWidth="1.5" />
            </Pattern>
          </Defs>
          <Rect
            x="6"
            y="6"
            width="20"
            height="20"
            fill={shading === 'filled' ? color : shading === 'striped' ? `url(#${patternId})` : 'transparent'}
            stroke={color}
            strokeWidth="2"
          />
        </Svg>
      );
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  selectedCard: {
    borderColor: colors.primary,
    borderWidth: 2.5,
    boxShadow: '0px 4px 8px rgba(0, 122, 255, 0.3)',
    elevation: 4,
  },
  hintedCard: {
    borderColor: colors.accent,
    borderWidth: 2.5,
    boxShadow: '0px 4px 8px rgba(255, 149, 0, 0.3)',
    elevation: 4,
  },
  cardContent: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
  },
  shapeContainer: {
    marginVertical: 1,
  },
});
