import React, { useState, memo } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Image, ImageResizeMode } from 'react-native';
import { colors, spacing } from '../theme';

interface OptimizedImageProps {
  source: string | { uri: string } | number;
  style?: any;
  fallbackSource?: string | number;
  alt?: string;
  resizeMode?: ImageResizeMode;
  showLoadingIndicator?: boolean;
  showErrorText?: boolean;
  loadingSize?: 'small' | 'large';
  borderRadius?: number;
}

const OptimizedImage = memo<OptimizedImageProps>(({
  source,
  style,
  fallbackSource,
  alt = 'Image',
  resizeMode = 'cover',
  showLoadingIndicator = true,
  showErrorText = true,
  loadingSize = 'small',
  borderRadius = 0,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const getImageSource = () => {
    if (typeof source === 'string') {
      return { uri: source };
    }
    return source;
  };

  const getFallbackSource = () => {
    if (fallbackSource) {
      if (typeof fallbackSource === 'string') {
        return { uri: fallbackSource };
      }
      return fallbackSource;
    }
    // Default fallback
    return require('../assets/logo.png');
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <View style={[styles.container, style, borderRadius > 0 && { borderRadius }]}>
      <Image
        source={hasError ? getFallbackSource() : getImageSource()}
        style={[styles.image, style, borderRadius > 0 && { borderRadius }]}
        resizeMode={resizeMode}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        accessibilityLabel={alt}
      />
      
      {isLoading && showLoadingIndicator && !hasError && (
        <View style={[styles.loadingContainer, borderRadius > 0 && { borderRadius }]}>
          <ActivityIndicator
            size={loadingSize}
            color={colors.blue}
          />
        </View>
      )}
      
      {hasError && showErrorText && (
        <View style={[styles.errorContainer, borderRadius > 0 && { borderRadius }]}>
          <Text style={styles.errorText}>Failed to load image</Text>
        </View>
      )}
    </View>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  errorText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: spacing.xs,
  },
});

export default OptimizedImage; 