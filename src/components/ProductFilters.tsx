import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors, spacing } from '@theme';
import { FilterOption } from '../utils/api-service';
import Slider from '@react-native-community/slider';
import { useTranslation } from '../utils/translations';


type FilterType = 'brand' | 'category' | 'price' | 'sort';

interface ProductFiltersProps {
  isLoading: boolean;
  filters: {
    brands: FilterOption[];
    categories: FilterOption[];
    subCategories: FilterOption[];
    sortOptions: FilterOption[];
    minPrice: number;
    maxPrice: number;
  };
  activeFilters: {
    brands: string[];
    categories: string[];
    subCategories: string[];
    priceRange: [number, number];
    sortBy: string;
  };
  onApplyFilters: (filters: {
    brands: string[];
    categories: string[];
    subCategories: string[];
    priceRange: [number, number];
    sortBy: string;
  }) => void;
  onReset: () => void;
  onLoadFilterOptions?: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  isLoading,
  filters,
  activeFilters,
  onApplyFilters,
  onReset,
  onLoadFilterOptions,
}) => {
  const { t } = useTranslation();
  const [visibleFilter, setVisibleFilter] = useState<FilterType | null>(null);
  const [localFilters, setLocalFilters] = useState(activeFilters);
  const [priceRange, setPriceRange] = useState<[number, number]>(activeFilters.priceRange);

  // Reset local filters when active filters change
  useEffect(() => {
    setLocalFilters(activeFilters);
    setPriceRange(activeFilters.priceRange);
  }, [activeFilters]);

  const openFilter = (filterType: FilterType) => {
    setVisibleFilter(filterType);
    if (onLoadFilterOptions) {
      onLoadFilterOptions();
    }
  };

  const closeFilter = () => {
    setVisibleFilter(null);
  };

  const handleBrandToggle = (brandCode: string) => {
    setLocalFilters((prev) => {
      const newBrands = prev.brands.includes(brandCode)
        ? prev.brands.filter((b) => b !== brandCode)
        : [...prev.brands, brandCode];
      
      return {
        ...prev,
        brands: newBrands,
      };
    });
  };

  const handleCategoryToggle = (categoryCode: string) => {
    setLocalFilters((prev) => {
      const newCategories = prev.categories.includes(categoryCode)
        ? prev.categories.filter((c) => c !== categoryCode)
        : [...prev.categories, categoryCode];
      
      return {
        ...prev,
        categories: newCategories,
      };
    });
  };

  const handleSubCategoryToggle = (subCategoryCode: string) => {
    setLocalFilters((prev) => {
      const newSubCategories = prev.subCategories.includes(subCategoryCode)
        ? prev.subCategories.filter((sc) => sc !== subCategoryCode)
        : [...prev.subCategories, subCategoryCode];
      
      return {
        ...prev,
        subCategories: newSubCategories,
      };
    });
  };

  const handleSortBySelect = (sortCode: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      sortBy: sortCode,
    }));
    closeFilter();
    onApplyFilters({
      ...localFilters,
      sortBy: sortCode,
    });
  };

  const handlePriceRangeChange = (value: number) => {
    setPriceRange([priceRange[0], value]);
  };

  const handleMinPriceChange = (value: number) => {
    setPriceRange([value, priceRange[1]]);
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      ...localFilters,
      priceRange,
    });
    closeFilter();
  };

  const handleResetFilters = () => {
    onReset();
    closeFilter();
  };

  // Count active filters for badge display
  const getActiveFilterCount = (filterType: FilterType): number => {
    switch (filterType) {
      case 'brand':
        return activeFilters.brands.length;
      case 'category':
        return activeFilters.categories.length + activeFilters.subCategories.length;
      case 'price':
        // Check if price range is different from min/max
        return (
          activeFilters.priceRange[0] !== filters.minPrice ||
          activeFilters.priceRange[1] !== filters.maxPrice
        ) ? 1 : 0;
      case 'sort':
        return activeFilters.sortBy !== 'Srt_Dflt' ? 1 : 0;
      default:
        return 0;
    }
  };

  const renderBrandFilter = () => (
    <Modal
      visible={visibleFilter === 'brand'}
      animationType="slide"
      transparent={true}
      onRequestClose={closeFilter}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('filter_brand').toUpperCase()}</Text>
            <TouchableOpacity onPress={closeFilter} style={styles.closeButton}>
              <FontAwesome name="times" size={20} color={colors.black} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScrollView}>
            {filters.brands.map((brand) => (
              <TouchableOpacity
                key={brand.XCode}
                style={styles.filterItem}
                onPress={() => handleBrandToggle(brand.XCode)}
              >
                <Text style={styles.filterItemText}>{brand.XName}</Text>
                <View style={styles.checkboxContainer}>
                  {localFilters.brands.includes(brand.XCode) && (
                    <View style={styles.checkboxChecked}>
                      <FontAwesome name="check" size={12} color={colors.white} />
                    </View>
                  )}
                  {!localFilters.brands.includes(brand.XCode) && (
                    <View style={styles.checkboxUnchecked} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.footerButton, styles.resetButton]}
              onPress={handleResetFilters}
            >
              <Text style={styles.resetButtonText}>{t('reset')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.footerButton, styles.applyButton]}
              onPress={handleApplyFilters}
            >
              <Text style={styles.applyButtonText}>{t('apply')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderCategoryFilter = () => (
    <Modal
      visible={visibleFilter === 'category'}
      animationType="slide"
      transparent={true}
      onRequestClose={closeFilter}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('filter_category').toUpperCase()}</Text>
            <TouchableOpacity onPress={closeFilter} style={styles.closeButton}>
              <FontAwesome name="times" size={20} color={colors.black} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScrollView}>
            {filters.categories.map((category) => (
              <View key={category.XCode}>
                <TouchableOpacity
                  style={styles.filterItem}
                  onPress={() => handleCategoryToggle(category.XCode)}
                >
                  <Text style={styles.filterItemText}>{category.XName}</Text>
                  <View style={styles.checkboxContainer}>
                    {localFilters.categories.includes(category.XCode) && (
                      <View style={styles.checkboxChecked}>
                        <FontAwesome name="check" size={12} color={colors.white} />
                      </View>
                    )}
                    {!localFilters.categories.includes(category.XCode) && (
                      <View style={styles.checkboxUnchecked} />
                    )}
                  </View>
                </TouchableOpacity>
                
                {/* Show subcategories that belong to this category */}
                {filters.subCategories
                  .filter((subCat) => subCat.XLink === category.XCode)
                  .map((subCategory) => (
                    <TouchableOpacity
                      key={subCategory.XCode}
                      style={[styles.filterItem, styles.subCategoryItem]}
                      onPress={() => handleSubCategoryToggle(subCategory.XCode)}
                    >
                      <Text style={styles.filterItemText}>{subCategory.XName}</Text>
                      <View style={styles.checkboxContainer}>
                        {localFilters.subCategories.includes(subCategory.XCode) && (
                          <View style={styles.checkboxChecked}>
                            <FontAwesome name="check" size={12} color={colors.white} />
                          </View>
                        )}
                        {!localFilters.subCategories.includes(subCategory.XCode) && (
                          <View style={styles.checkboxUnchecked} />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
              </View>
            ))}
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.footerButton, styles.resetButton]}
              onPress={handleResetFilters}
            >
              <Text style={styles.resetButtonText}>{t('reset')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.footerButton, styles.applyButton]}
              onPress={handleApplyFilters}
            >
              <Text style={styles.applyButtonText}>{t('apply')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderPriceFilter = () => (
    <Modal
      visible={visibleFilter === 'price'}
      animationType="slide"
      transparent={true}
      onRequestClose={closeFilter}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('filter_price').toUpperCase()}</Text>
            <TouchableOpacity onPress={closeFilter} style={styles.closeButton}>
              <FontAwesome name="times" size={20} color={colors.black} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.priceRangeText}>
              {`PRICE ${priceRange[0].toFixed(3)} KD - ${priceRange[1].toFixed(3)} KD`}
            </Text>
            
            {/* Min Price Slider */}
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>{t('min_price')}</Text>
              <Slider
                style={styles.slider}
                minimumValue={filters.minPrice || 0}
                maximumValue={priceRange[1]}
                value={priceRange[0]}
                onValueChange={handleMinPriceChange}
                minimumTrackTintColor={colors.blue}
                maximumTrackTintColor={colors.lightGray}
                thumbTintColor={colors.blue}
              />
              <Text style={styles.sliderValue}>{priceRange[0].toFixed(3)} KD</Text>
            </View>
            
            {/* Max Price Slider */}
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>{t('max_price')}</Text>
              <Slider
                style={styles.slider}
                minimumValue={priceRange[0]}
                maximumValue={filters.maxPrice || 1000}
                value={priceRange[1]}
                onValueChange={handlePriceRangeChange}
                minimumTrackTintColor={colors.blue}
                maximumTrackTintColor={colors.lightGray}
                thumbTintColor={colors.blue}
              />
              <Text style={styles.sliderValue}>{priceRange[1].toFixed(3)} KD</Text>
            </View>
          </View>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.footerButton, styles.resetButton]}
              onPress={handleResetFilters}
            >
              <Text style={styles.resetButtonText}>{t('reset')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.footerButton, styles.applyButton]}
              onPress={handleApplyFilters}
            >
              <Text style={styles.applyButtonText}>{t('apply')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderSortByFilter = () => (
    <Modal
      visible={visibleFilter === 'sort'}
      animationType="slide"
      transparent={true}
      onRequestClose={closeFilter}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('filter_sort_by').toUpperCase()}</Text>
            <TouchableOpacity onPress={closeFilter} style={styles.closeButton}>
              <FontAwesome name="times" size={20} color={colors.black} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScrollView}>
            {filters.sortOptions.map((sortOption) => (
              <TouchableOpacity
                key={sortOption.XCode}
                style={styles.filterItem}
                onPress={() => handleSortBySelect(sortOption.XCode)}
              >
                <Text style={styles.filterItemText}>{sortOption.XName}</Text>
                <View style={styles.checkboxContainer}>
                  {localFilters.sortBy === sortOption.XCode && (
                    <View style={styles.checkboxChecked}>
                      <FontAwesome name="check" size={12} color={colors.white} />
                    </View>
                  )}
                  {localFilters.sortBy !== sortOption.XCode && (
                    <View style={styles.checkboxUnchecked} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterButtonsRow}>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => openFilter('sort')}
          disabled={isLoading}
        >
          <Text style={styles.filterButtonText}>{t('filter_sort_by')}</Text>
          {getActiveFilterCount('sort') > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{getActiveFilterCount('sort')}</Text>
            </View>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => openFilter('category')}
          disabled={isLoading}
        >
          <Text style={styles.filterButtonText}>{t('filter_category')}</Text>
          {getActiveFilterCount('category') > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{getActiveFilterCount('category')}</Text>
            </View>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => openFilter('price')}
          disabled={isLoading}
        >
          <Text style={styles.filterButtonText}>{t('filter_price')}</Text>
          {getActiveFilterCount('price') > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{getActiveFilterCount('price')}</Text>
            </View>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => openFilter('brand')}
          disabled={isLoading}
        >
          <Text style={styles.filterButtonText}>{t('filter_brand')}</Text>
          {getActiveFilterCount('brand') > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{getActiveFilterCount('brand')}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      {renderBrandFilter()}
      {renderCategoryFilter()}
      {renderPriceFilter()}
      {renderSortByFilter()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightBlue,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  filterButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 14,
    color: colors.black,
    fontWeight: '500',
  },
  badge: {
    backgroundColor: colors.blue,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
  },
  closeButton: {
    padding: spacing.xs,
  },
  modalScrollView: {
    maxHeight: '82%',
  },
  filterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  subCategoryItem: {
    paddingLeft: spacing.lg,
  },
  filterItemText: {
    fontSize: 16,
    color: colors.black,
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxUnchecked: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  footerButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: colors.lightGray,
    marginRight: spacing.sm,
  },
  resetButtonText: {
    color: colors.black,
    fontWeight: '500',
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: colors.blue,
    marginLeft: spacing.sm,
  },
  applyButtonText: {
    color: colors.white,
    fontWeight: '500',
    fontSize: 16,
  },
  priceContainer: {
    padding: spacing.md,
  },
  priceRangeText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  sliderContainer: {
    marginVertical: spacing.md,
  },
  sliderLabel: {
    fontSize: 14,
    color: colors.textGray,
    marginBottom: spacing.xs,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    fontSize: 14,
    color: colors.black,
    textAlign: 'right',
  },
});

export default ProductFilters; 