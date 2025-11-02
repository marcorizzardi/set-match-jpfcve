
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';
import { Card, GameState } from '@/types/SetGame';
import { generateDeck, isValidSet, findAllSets, getHint } from '@/utils/setGameLogic';
import SetCard from '@/components/SetCard';
import * as Haptics from 'expo-haptics';
import { IconSymbol } from '@/components/IconSymbol';

const INITIAL_CARDS = 12;
const CARDS_TO_ADD = 3;

export default function GameScreen() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const deck = generateDeck();
    return {
      deck: deck.slice(INITIAL_CARDS),
      board: deck.slice(0, INITIAL_CARDS),
      selectedCards: [],
      foundSets: [],
      score: 0,
      startTime: Date.now(),
      elapsedTime: 0,
      hintsUsed: 0,
    };
  });

  const [hintedCards, setHintedCards] = useState<Card[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setGameState((prev) => ({
        ...prev,
        elapsedTime: Math.floor((Date.now() - prev.startTime) / 1000),
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCardPress = useCallback((card: Card) => {
    setHintedCards([]);
    
    setGameState((prev) => {
      const isAlreadySelected = prev.selectedCards.some((c) => c.id === card.id);

      if (isAlreadySelected) {
        return {
          ...prev,
          selectedCards: prev.selectedCards.filter((c) => c.id !== card.id),
        };
      }

      const newSelected = [...prev.selectedCards, card];

      if (newSelected.length === 3) {
        if (isValidSet(newSelected)) {
          if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }

          const newBoard = prev.board.filter(
            (c) => !newSelected.some((selected) => selected.id === c.id)
          );

          let updatedBoard = newBoard;
          let updatedDeck = prev.deck;

          if (newBoard.length < 12 && prev.deck.length >= CARDS_TO_ADD) {
            const cardsToAdd = prev.deck.slice(0, CARDS_TO_ADD);
            updatedBoard = [...newBoard, ...cardsToAdd];
            updatedDeck = prev.deck.slice(CARDS_TO_ADD);
          }

          const availableSets = findAllSets(updatedBoard);
          if (availableSets.length === 0 && updatedDeck.length >= CARDS_TO_ADD) {
            const cardsToAdd = updatedDeck.slice(0, CARDS_TO_ADD);
            updatedBoard = [...updatedBoard, ...cardsToAdd];
            updatedDeck = updatedDeck.slice(CARDS_TO_ADD);
          }

          return {
            ...prev,
            board: updatedBoard,
            deck: updatedDeck,
            selectedCards: [],
            foundSets: [...prev.foundSets, newSelected],
            score: prev.score + 10,
          };
        } else {
          if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          }
          
          setTimeout(() => {
            setGameState((current) => ({
              ...current,
              selectedCards: [],
            }));
          }, 500);

          return {
            ...prev,
            selectedCards: newSelected,
            score: Math.max(0, prev.score - 2),
          };
        }
      }

      return {
        ...prev,
        selectedCards: newSelected,
      };
    });
  }, []);

  const handleHint = useCallback(() => {
    const hint = getHint(gameState.board);
    if (hint) {
      setHintedCards(hint);
      setGameState((prev) => ({
        ...prev,
        hintsUsed: prev.hintsUsed + 1,
        score: Math.max(0, prev.score - 5),
      }));

      setTimeout(() => {
        setHintedCards([]);
      }, 3000);
    } else {
      Alert.alert('No Sets Available', 'There are no valid sets on the board. Adding more cards...');
      handleAddCards();
    }
  }, [gameState.board]);

  const handleAddCards = useCallback(() => {
    setGameState((prev) => {
      if (prev.deck.length < CARDS_TO_ADD) {
        Alert.alert('Game Over', `No more cards in the deck!\n\nFinal Score: ${prev.score}\nTime: ${formatTime(prev.elapsedTime)}\nSets Found: ${prev.foundSets.length}`);
        return prev;
      }

      const cardsToAdd = prev.deck.slice(0, CARDS_TO_ADD);
      return {
        ...prev,
        board: [...prev.board, ...cardsToAdd],
        deck: prev.deck.slice(CARDS_TO_ADD),
      };
    });
  }, []);

  const handleNewGame = useCallback(() => {
    const deck = generateDeck();
    setGameState({
      deck: deck.slice(INITIAL_CARDS),
      board: deck.slice(0, INITIAL_CARDS),
      selectedCards: [],
      foundSets: [],
      score: 0,
      startTime: Date.now(),
      elapsedTime: 0,
      hintsUsed: 0,
    });
    setHintedCards([]);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const availableSets = findAllSets(gameState.board);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          title: 'SET Game',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.headerButton}>
              <IconSymbol name="chevron.left" size={24} color={colors.primary} />
            </Pressable>
          ),
        }}
      />
      
      <View style={styles.header}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Score</Text>
            <Text style={styles.statValue}>{gameState.score}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Time</Text>
            <Text style={styles.statValue}>{formatTime(gameState.elapsedTime)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Sets</Text>
            <Text style={styles.statValue}>{gameState.foundSets.length}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Deck</Text>
            <Text style={styles.statValue}>{gameState.deck.length}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.boardContainer}>
          <View style={styles.board}>
            {gameState.board.map((card) => (
              <View key={card.id} style={styles.cardWrapper}>
                <SetCard
                  card={card}
                  isSelected={gameState.selectedCards.some((c) => c.id === card.id)}
                  isHinted={hintedCards.some((c) => c.id === card.id)}
                  onPress={handleCardPress}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.controls}>
          <Pressable
            style={[styles.button, styles.hintButton]}
            onPress={handleHint}
          >
            <IconSymbol name="lightbulb.fill" size={20} color={colors.card} />
            <Text style={styles.buttonText}>Hint (-5)</Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.addButton]}
            onPress={handleAddCards}
            disabled={gameState.deck.length < CARDS_TO_ADD}
          >
            <IconSymbol name="plus.circle.fill" size={20} color={colors.card} />
            <Text style={styles.buttonText}>Add 3 Cards</Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.newGameButton]}
            onPress={handleNewGame}
          >
            <IconSymbol name="arrow.clockwise" size={20} color={colors.card} />
            <Text style={styles.buttonText}>New Game</Text>
          </Pressable>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Available Sets: {availableSets.length}
          </Text>
          <Text style={styles.infoTextSmall}>
            Select 3 cards that form a valid SET
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  boardContainer: {
    padding: 8,
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  cardWrapper: {
    width: '30%',
    aspectRatio: 0.7,
    minWidth: 100,
    maxWidth: 140,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  hintButton: {
    backgroundColor: colors.accent,
  },
  addButton: {
    backgroundColor: colors.secondary,
  },
  newGameButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: colors.card,
    fontSize: 14,
    fontWeight: '600',
  },
  infoContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  infoTextSmall: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  headerButton: {
    padding: 8,
  },
});
