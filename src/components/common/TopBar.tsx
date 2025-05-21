import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing } from '../../theme';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface TopBarProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightIcon?: React.ReactNode;
}

const TopBar: React.FC<TopBarProps> = ({ 
  title, 
  showBackButton = false, 
  onBackPress, 
  rightIcon 
}) => {
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      {showBackButton && (
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color={colors.black} />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      {rightIcon ? (
        <View style={styles.rightIconContainer}>{rightIcon}</View>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.blue,
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: spacing.sm,
  },
  rightIconContainer: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
  placeholder: {
    width: 40,
  },
});

export default TopBar; 