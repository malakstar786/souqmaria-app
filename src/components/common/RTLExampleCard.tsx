import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRTL, shouldFlipIcon } from '../../utils/rtl';

interface RTLExampleCardProps {
  title: string;
  description: string;
  iconName?: string;
}

/**
 * Example component that demonstrates proper RTL layout handling
 * Use this as a reference for implementing RTL support in your components
 */
const RTLExampleCard = ({ title, description, iconName = 'arrow-forward-outline' }: RTLExampleCardProps) => {
  // Use the RTL hook to get direction-aware styles
  const rtl = useRTL();
  
  return (
    <View style={styles.container}>
      {/* Row with proper RTL-aware flexDirection */}
      <View style={[styles.header, { flexDirection: rtl.getFlexDirection('row') }]}>
        <Text style={[styles.title, { textAlign: rtl.getTextAlign() }]}>
          {title}
        </Text>
        
        {/* Icon with conditional flipping based on direction */}
        {iconName && (
          <Ionicons 
            name={iconName as any} // Type assertion to avoid Ionicons name restrictions
            size={24} 
            color="#333"
            style={[
              styles.icon, 
              // Apply flip transform if the icon needs RTL flipping
              shouldFlipIcon(iconName) ? rtl.iconFlip : {}
            ]}
          />
        )}
      </View>
      
      {/* Text with proper alignment */}
      <Text style={[styles.description, { textAlign: rtl.getTextAlign() }]}>
        {description}
      </Text>
      
      {/* Row with logical spacing properties */}
      <View style={[
        styles.footer, 
        { flexDirection: rtl.getFlexDirection('row') }
      ]}>
        <View style={[
          styles.tag, 
          // Apply start margin using logical property
          rtl.marginStart(10),
          // Apply end margin using logical property
          rtl.marginEnd(5)
        ]}>
          <Text>Tag 1</Text>
        </View>
        
        <View style={styles.tag}>
          <Text>Tag 2</Text>
        </View>
      </View>
      
      {/* Example of complex nested layout with RTL support */}
      <View style={[styles.detailsContainer, { flexDirection: rtl.getFlexDirection('row') }]}>
        {/* Left/Start content */}
        <View style={[styles.detailsSide, rtl.marginEnd(10)]}>
          <Text style={{ textAlign: rtl.textAlign }}>Start Content</Text>
        </View>
        
        {/* Right/End content */}
        <View style={styles.detailsSide}>
          <Text style={{ textAlign: rtl.textAlign }}>End Content</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  icon: {
    // Icon styling, additional RTL transforms applied conditionally in component
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  footer: {
    alignItems: 'center',
    marginTop: 12,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  detailsContainer: {
    marginTop: 16,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  detailsSide: {
    flex: 1,
    padding: 8,
  }
});

export default RTLExampleCard; 