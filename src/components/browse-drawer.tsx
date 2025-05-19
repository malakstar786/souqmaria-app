import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors, spacing, radii, typography } from '../../src/theme';
import useMenuStore, { MenuCategory } from '../store/menu-store';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
const DRAWER_WIDTH = screenWidth * 0.85;

interface BrowseDrawerProps {
  isVisible: boolean;
  onClose: () => void;
}

function BrowseDrawer({ isVisible, onClose }: BrowseDrawerProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    menuStructure,
    isLoading,
    error,
    fetchMenuStructure,
    fetchSubCategoriesForCategory,
  } = useMenuStore();

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const slideAnim = useState(new Animated.Value(-DRAWER_WIDTH))[0];
  const [actuallyVisible, setActuallyVisible] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setActuallyVisible(true);
      if (menuStructure.length === 0 && !isLoading && !error) {
        fetchMenuStructure();
      }
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(() => setActuallyVisible(false));
    }
  }, [isVisible, slideAnim, menuStructure, isLoading, error, fetchMenuStructure]);

  const toggleCategory = (categoryXcode: string) => {
    const currentlyExpanded = expandedCategories[categoryXcode];
    if (!currentlyExpanded) {
        const category = menuStructure.find(c => c.XCode === categoryXcode);
        if (category && 
            (!category.subCategories || category.subCategories.length === 0 || category.errorSubCategories) && 
            !category.isLoadingSubCategories) {
            fetchSubCategoriesForCategory(categoryXcode);
        }
    }
    setExpandedCategories(prev => ({
      ...prev,
      [categoryXcode]: !prev[categoryXcode],
    }));
  };
  
  const handleSubCategoryPress = (subCategoryXCode: string, subCategoryName: string) => {
    console.log(`Navigating to subcategory: ${subCategoryName} (${subCategoryXCode})`);
    router.push({ pathname: '/categories/' + subCategoryXCode, params: { name: subCategoryName, isSubCategory: 'true' } });
    onClose();
  };

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color={colors.blue} style={styles.loader} />;
    }
    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }
    if (menuStructure.length === 0) {
      return <Text style={styles.emptyText}>No categories available.</Text>;
    }

    return menuStructure.map((category) => (
      <View key={category.id} style={styles.categoryContainer}>
        <TouchableOpacity onPress={() => toggleCategory(category.XCode)} style={styles.categoryHeader}>
          <Text style={styles.categoryName}>{category.XName}</Text>
          <FontAwesome 
            name={expandedCategories[category.XCode] ? 'chevron-up' : 'chevron-down'} 
            size={16} 
            color={colors.textGray}
          />
        </TouchableOpacity>
        {expandedCategories[category.XCode] && (
          <View style={styles.subCategoryListContainer}>
            {category.isLoadingSubCategories && (
              <ActivityIndicator size="small" color={colors.blue} style={styles.subLoader} />
            )}
            {category.errorSubCategories && (
              <Text style={styles.subErrorText}>{category.errorSubCategories}</Text>
            )}
            {!category.isLoadingSubCategories && !category.errorSubCategories && category.subCategories && category.subCategories.length === 0 && (
              <Text style={styles.noSubCategoriesText}>No sub-categories found.</Text>
            )}
            {category.subCategories?.map((subCat) => (
              <TouchableOpacity 
                key={subCat.XCode} 
                style={styles.subCategoryItem}
                onPress={() => handleSubCategoryPress(subCat.XCode, subCat.XName)}
              >
                <Text style={styles.subCategoryName}>{subCat.XName}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    ));
  };

  if (!actuallyVisible) { 
      return null;
  }

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={actuallyVisible} 
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      
      <Animated.View style={[
        styles.drawerContainer, 
        { 
          transform: [{ translateX: slideAnim }],
          paddingTop: Platform.OS === 'android' ? spacing.md : insets.top + spacing.xs,
          paddingBottom: Platform.OS === 'android' ? spacing.lg : insets.bottom + spacing.xs,
        }
      ]}>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>Browse</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <FontAwesome name="times" size={24} color={colors.black} />
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.scrollContentContainer}>
            {renderContent()}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawerContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: DRAWER_WIDTH,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg, 
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  drawerTitle: {
    fontSize: typography.title.fontSize, 
    fontWeight: typography.title.fontWeight as 'bold',
    color: colors.black,
    textAlign: 'center',
    flex:1,
    marginLeft: 30,
  },
  closeButton: {
    padding: spacing.sm,
    position: 'absolute',
    right: 0, 
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginBottom: spacing.md,
  },
  scrollContentContainer: {
  },
  categoryContainer: {
    marginBottom: spacing.md,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  categoryName: {
    fontSize: typography.title.fontSize, 
    fontWeight: typography.title.fontWeight as 'bold',
    color: colors.black,
  },
  subCategoryListContainer: {
    paddingLeft: spacing.md, 
    marginTop: spacing.sm,
  },
  subCategoryItem: {
    paddingVertical: spacing.sm,
  },
  subCategoryName: {
    fontSize: typography.body.fontSize, 
    color: colors.blue, 
  },
  loader: {
    marginTop: spacing.xl,
  },
  subLoader: {
    marginVertical: spacing.md,
  },
  errorText: {
    color: colors.red,
    textAlign: 'center',
    marginVertical: spacing.md,
  },
  subErrorText: {
    color: colors.red,
    marginLeft: spacing.md, 
    marginVertical: spacing.sm,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textGray,
    marginVertical: spacing.md,
  },
  noSubCategoriesText: {
    color: colors.textGray,
    marginLeft: spacing.md, 
    fontStyle: 'italic',
    marginVertical: spacing.sm,
  },
});

export default BrowseDrawer; 