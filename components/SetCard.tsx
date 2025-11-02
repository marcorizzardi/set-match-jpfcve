
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
        <Svg width={50} height={50} viewBox="0 0 50 50">
          <Defs>
            <Pattern
              id={patternId}
              patternUnits="userSpaceOnUse"
              width="6"
              height="6"
              patternTransform="rotate(45)"
            >
              <Line x1="0" y1="0" x2="0" y2="6" stroke={color} strokeWidth="2" />
            </Pattern>
          </Defs>
          <Circle
            cx="25"
            cy="25"
            r="20"
            fill={shading === 'filled' ? color : shading === 'striped' ? `url(#${patternId})` : 'transparent'}
            stroke={color}
            strokeWidth="2.5"
          />
        </Svg>
      );
    case 'triangle':
      return (
        <Svg width={50} height={50} viewBox="0 0 50 50">
          <Defs>
            <Pattern
              id={patternId}
              patternUnits="userSpaceOnUse"
              width="6"
              height="6"
              patternTransform="rotate(45)"
            >
              <Line x1="0" y1="0" x2="0" y2="6" stroke={color} strokeWidth="2" />
            </Pattern>
          </Defs>
          <Polygon
            points="25,8 45,42 5,42"
            fill={shading === 'filled' ? color : shading === 'striped' ? `url(#${patternId})` : 'transparent'}
            stroke={color}
            strokeWidth="2.5"
          />
        </Svg>
      );
    case 'square':
      return (
        <Svg width={50} height={50} viewBox="0 0 50 50">
          <Defs>
            <Pattern
              id={patternId}
              patternUnits="userSpaceOnUse"
              width="6"
              height="6"
              patternTransform="rotate(45)"
            >
              <Line x1="0" y1="0" x2="0" y2="6" stroke={color} strokeWidth="2" />
            </Pattern>
          </Defs>
          <Rect
            x="10"
            y="10"
            width="30"
            height="30"
            fill={shading === 'filled' ? color : shading === 'striped' ? `url(#${patternId})` : 'transparent'}
            stroke={color}
            strokeWidth="2.5"
          />
        </Svg>
      );
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 8,
    margin: 3,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
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
    gap: 4,
  },
  shapeContainer: {
    marginVertical: 2,
  },
});
