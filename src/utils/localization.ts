import useLanguageStore from '../store/language-store';

// Localization interface
interface LocalizedText {
  en: string;
  ar: string;
}

// Main translations object
export const translations: Record<string, LocalizedText> = {
  // Common/General
  loading: {
    en: 'Loading...',
    ar: 'جاري التحميل...'
  },
  error: {
    en: 'Error',
    ar: 'خطأ'
  },
  success: {
    en: 'Success',
    ar: 'نجح'
  },
  cancel: {
    en: 'Cancel',
    ar: 'إلغاء'
  },
  save: {
    en: 'Save',
    ar: 'حفظ'
  },
  edit: {
    en: 'Edit',
    ar: 'تعديل'
  },
  delete: {
    en: 'Delete',
    ar: 'حذف'
  },
  add: {
    en: 'Add',
    ar: 'إضافة'
  },
  back: {
    en: 'Back',
    ar: 'رجوع'
  },
  next: {
    en: 'Next',
    ar: 'التالي'
  },
  previous: {
    en: 'Previous',
    ar: 'السابق'
  },
  confirm: {
    en: 'Confirm',
    ar: 'تأكيد'
  },
  yes: {
    en: 'Yes',
    ar: 'نعم'
  },
  no: {
    en: 'No',
    ar: 'لا'
  },
  ok: {
    en: 'OK',
    ar: 'موافق'
  },
  done: {
    en: 'Done',
    ar: 'تم'
  },
  close: {
    en: 'Close',
    ar: 'إغلاق'
  },
  retry: {
    en: 'Retry',
    ar: 'إعادة المحاولة'
  },
  refresh: {
    en: 'Refresh',
    ar: 'تحديث'
  },

  // Navigation/Tabs
  home: {
    en: 'Home',
    ar: 'الرئيسية'
  },
  categories: {
    en: 'Categories',
    ar: 'الفئات'
  },
  cart: {
    en: 'Cart',
    ar: 'السلة'
  },
  account: {
    en: 'Account',
    ar: 'الحساب'
  },
  search: {
    en: 'Search',
    ar: 'البحث'
  },
  browse: {
    en: 'Browse',
    ar: 'تصفح'
  },
  orders: {
    en: 'Orders',
    ar: 'الطلبات'
  },
  wishlist: {
    en: 'Wishlist',
    ar: 'المفضلة'
  },

  // Search
  searchPlaceholder: {
    en: 'Search for products...',
    ar: 'البحث عن المنتجات...'
  },
  searchResults: {
    en: 'Search Results',
    ar: 'نتائج البحث'
  },
  noResults: {
    en: 'No results found',
    ar: 'لم يتم العثور على نتائج'
  },
  searchEmpty: {
    en: 'Please enter a search term',
    ar: 'يرجى إدخال مصطلح البحث'
  },

  // Product/Shopping
  addToCart: {
    en: 'Add to Cart',
    ar: 'إضافة إلى السلة'
  },
  addToWishlist: {
    en: 'Add to Wishlist',
    ar: 'إضافة إلى المفضلة'
  },
  removeFromWishlist: {
    en: 'Remove from Wishlist',
    ar: 'إزالة من المفضلة'
  },
  inStock: {
    en: 'In Stock',
    ar: 'متوفر'
  },
  outOfStock: {
    en: 'Out of Stock',
    ar: 'غير متوفر'
  },
  price: {
    en: 'Price',
    ar: 'السعر'
  },
  quantity: {
    en: 'Quantity',
    ar: 'الكمية'
  },
  total: {
    en: 'Total',
    ar: 'المجموع'
  },
  subtotal: {
    en: 'Subtotal',
    ar: 'المجموع الفرعي'
  },
  discount: {
    en: 'Discount',
    ar: 'الخصم'
  },
  shipping: {
    en: 'Shipping',
    ar: 'الشحن'
  },
  grandTotal: {
    en: 'Grand Total',
    ar: 'المجموع الإجمالي'
  },
  currency: {
    en: 'KD',
    ar: 'د.ك'
  },

  // Cart
  emptyCart: {
    en: 'Your cart is empty',
    ar: 'سلتك فارغة'
  },
  continueShopping: {
    en: 'Continue Shopping',
    ar: 'متابعة التسوق'
  },
  removeFromCart: {
    en: 'Remove from Cart',
    ar: 'إزالة من السلة'
  },
  updateQuantity: {
    en: 'Update Quantity',
    ar: 'تحديث الكمية'
  },
  proceedToCheckout: {
    en: 'Proceed to Checkout',
    ar: 'الذهاب إلى الدفع'
  },

  // Checkout
  checkout: {
    en: 'Checkout',
    ar: 'الدفع'
  },
  billingAddress: {
    en: 'Billing Address',
    ar: 'عنوان الفواتير'
  },
  shippingAddress: {
    en: 'Shipping Address',
    ar: 'عنوان الشحن'
  },
  shipToDifferentAddress: {
    en: 'Ship to different address',
    ar: 'الشحن إلى عنوان مختلف'
  },
  addAddress: {
    en: 'Add Address',
    ar: 'إضافة عنوان'
  },
  addBillingAddress: {
    en: 'Add Billing Address',
    ar: 'إضافة عنوان الفواتير'
  },
  addShippingAddress: {
    en: 'Add Shipping Address',
    ar: 'إضافة عنوان الشحن'
  },
  changeAddress: {
    en: 'Change',
    ar: 'تغيير'
  },
  selectAddress: {
    en: 'Select Address',
    ar: 'اختيار العنوان'
  },
  paymentMethod: {
    en: 'Payment Method',
    ar: 'طريقة الدفع'
  },
  selectPaymentType: {
    en: 'Select Payment Type',
    ar: 'اختيار نوع الدفع'
  },
  orderSummary: {
    en: 'Order Summary',
    ar: 'ملخص الطلب'
  },
  itemSubtotal: {
    en: 'Item Subtotal',
    ar: 'المجموع الفرعي للعناصر'
  },
  shippingFee: {
    en: 'Shipping Fee',
    ar: 'رسوم الشحن'
  },
  placeOrder: {
    en: 'Place Order',
    ar: 'تأكيد الطلب'
  },
  orderPlaced: {
    en: 'Order Placed Successfully',
    ar: 'تم تأكيد الطلب بنجاح'
  },
  termsAndConditions: {
    en: 'By proceeding, I\'ve read and accept the terms & conditions.',
    ar: 'بالمتابعة، أؤكد أنني قرأت ووافقت على الشروط والأحكام.'
  },
  createAccount: {
    en: 'Create an Account?',
    ar: 'إنشاء حساب؟'
  },

  // Authentication
  login: {
    en: 'Login',
    ar: 'تسجيل الدخول'
  },
  signup: {
    en: 'Sign Up',
    ar: 'التسجيل'
  },
  logout: {
    en: 'Logout',
    ar: 'تسجيل الخروج'
  },
  loginHere: {
    en: 'Login Here',
    ar: 'تسجيل الدخول هنا'
  },
  returningCustomer: {
    en: 'Are you a returning customer?',
    ar: 'هل أنت عميل سابق؟'
  },
  loginRequired: {
    en: 'Login Required',
    ar: 'تسجيل الدخول مطلوب'
  },
  pleaseLoginToAddresses: {
    en: 'Please login to add or select addresses',
    ar: 'يرجى تسجيل الدخول لإضافة أو اختيار العناوين'
  },
  email: {
    en: 'Email',
    ar: 'البريد الإلكتروني'
  },
  password: {
    en: 'Password',
    ar: 'كلمة المرور'
  },
  fullName: {
    en: 'Full Name',
    ar: 'الاسم الكامل'
  },
  mobile: {
    en: 'Mobile',
    ar: 'رقم الهاتف'
  },
  forgotPassword: {
    en: 'Forgot Password?',
    ar: 'نسيت كلمة المرور؟'
  },

  // Address Form
  country: {
    en: 'Country',
    ar: 'الدولة'
  },
  state: {
    en: 'State',
    ar: 'المحافظة'
  },
  city: {
    en: 'City',
    ar: 'المدينة'
  },
  block: {
    en: 'Block',
    ar: 'القطعة'
  },
  street: {
    en: 'Street',
    ar: 'الشارع'
  },
  house: {
    en: 'House',
    ar: 'المنزل'
  },
  apartment: {
    en: 'Apartment',
    ar: 'الشقة'
  },
  address: {
    en: 'Address',
    ar: 'العنوان'
  },
  selectCountry: {
    en: 'Select Country',
    ar: 'اختيار الدولة'
  },
  selectState: {
    en: 'Select State',
    ar: 'اختيار المحافظة'
  },
  selectCity: {
    en: 'Select City',
    ar: 'اختيار المدينة'
  },
  setAsDefault: {
    en: 'Set as Default',
    ar: 'تعيين كافتراضي'
  },

  // Promo Codes
  promoCode: {
    en: 'Promo Code',
    ar: 'كود الخصم'
  },
  havePromoCode: {
    en: 'Have a Promo Code?',
    ar: 'لديك كود خصم؟'
  },
  enterPromoCode: {
    en: 'Enter Promo Code',
    ar: 'أدخل كود الخصم'
  },
  applyPromoCode: {
    en: 'Apply',
    ar: 'تطبيق'
  },
  removePromoCode: {
    en: 'Remove',
    ar: 'إزالة'
  },
  promoCodeApplied: {
    en: 'Promo code applied successfully',
    ar: 'تم تطبيق كود الخصم بنجاح'
  },
  promoCodeRemoved: {
    en: 'Promo code removed successfully',
    ar: 'تم إزالة كود الخصم بنجاح'
  },
  enterValidPromoCode: {
    en: 'Please enter a promo code',
    ar: 'يرجى إدخال كود الخصم'
  },
  seeAvailablePromoCodes: {
    en: 'See Available Promo Codes',
    ar: 'عرض أكواد الخصم المتاحة'
  },
  availablePromoCodes: {
    en: 'Available Promo Codes',
    ar: 'أكواد الخصم المتاحة'
  },

  // Language Selection
  language: {
    en: 'Language',
    ar: 'اللغة'
  },
  changeLanguage: {
    en: 'Change Language',
    ar: 'تغيير اللغة'
  },
  selectLanguage: {
    en: 'Select Language',
    ar: 'اختيار اللغة'
  },
  english: {
    en: 'English',
    ar: 'الإنجليزية'
  },
  arabic: {
    en: 'العربية',
    ar: 'العربية'
  },
  languageChanged: {
    en: 'Language changed successfully',
    ar: 'تم تغيير اللغة بنجاح'
  },
  confirmLanguageChange: {
    en: 'Are you sure you want to change the language?',
    ar: 'هل أنت متأكد من تغيير اللغة؟'
  },

  // Account/Profile
  profile: {
    en: 'Profile',
    ar: 'الملف الشخصي'
  },
  myAccount: {
    en: 'My Account',
    ar: 'حسابي'
  },
  myOrders: {
    en: 'My Orders',
    ar: 'طلباتي'
  },
  myWishlist: {
    en: 'My Wishlist',
    ar: 'مفضلتي'
  },
  addresses: {
    en: 'Addresses',
    ar: 'العناوين'
  },
  settings: {
    en: 'Settings',
    ar: 'الإعدادات'
  },
  helpSupport: {
    en: 'Help & Support',
    ar: 'المساعدة والدعم'
  },
  aboutUs: {
    en: 'About Us',
    ar: 'عن الشركة'
  },
  contactUs: {
    en: 'Contact Us',
    ar: 'تواصل معنا'
  },
  privacyPolicy: {
    en: 'Privacy Policy',
    ar: 'سياسة الخصوصية'
  },
  guestUser: {
    en: 'Guest User',
    ar: 'مستخدم زائر'
  },
  welcomeBack: {
    en: 'Welcome back',
    ar: 'أهلاً بك مرة أخرى'
  },

  // Order Status
  orderConfirmed: {
    en: 'Order Confirmed',
    ar: 'تم تأكيد الطلب'
  },
  orderProcessing: {
    en: 'Processing',
    ar: 'قيد المعالجة'
  },
  orderShipped: {
    en: 'Shipped',
    ar: 'تم الشحن'
  },
  orderDelivered: {
    en: 'Delivered',
    ar: 'تم التسليم'
  },
  orderCancelled: {
    en: 'Cancelled',
    ar: 'ملغي'
  },
  trackOrder: {
    en: 'Track Order',
    ar: 'تتبع الطلب'
  },
  orderNumber: {
    en: 'Order Number',
    ar: 'رقم الطلب'
  },
  orderDate: {
    en: 'Order Date',
    ar: 'تاريخ الطلب'
  },
  orderTotal: {
    en: 'Order Total',
    ar: 'إجمالي الطلب'
  },
  orderDetails: {
    en: 'Order Details',
    ar: 'تفاصيل الطلب'
  },
  thankYou: {
    en: 'Thank You!',
    ar: 'شكراً لك!'
  },
  orderPlacedMessage: {
    en: 'Your order has been placed successfully. You will receive a confirmation email shortly.',
    ar: 'تم تأكيد طلبك بنجاح. ستتلقى رسالة تأكيد عبر البريد الإلكتروني قريباً.'
  },

  // Error Messages
  networkError: {
    en: 'Network error. Please check your connection.',
    ar: 'خطأ في الشبكة. يرجى التحقق من الاتصال.'
  },
  serverError: {
    en: 'Server error. Please try again later.',
    ar: 'خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.'
  },
  unknownError: {
    en: 'An unknown error occurred.',
    ar: 'حدث خطأ غير معروف.'
  },
  tryAgain: {
    en: 'Please try again.',
    ar: 'يرجى المحاولة مرة أخرى.'
  },
  validationError: {
    en: 'Please check your information.',
    ar: 'يرجى التحقق من المعلومات.'
  },
  requiredField: {
    en: 'This field is required',
    ar: 'هذا الحقل مطلوب'
  },
  invalidEmail: {
    en: 'Please enter a valid email address',
    ar: 'يرجى إدخال عنوان بريد إلكتروني صحيح'
  },
  invalidMobile: {
    en: 'Please enter a valid mobile number',
    ar: 'يرجى إدخال رقم هاتف صحيح'
  },

  // Success Messages
  itemAddedToCart: {
    en: 'Item added to cart successfully',
    ar: 'تم إضافة العنصر إلى السلة بنجاح'
  },
  itemRemovedFromCart: {
    en: 'Item removed from cart',
    ar: 'تم إزالة العنصر من السلة'
  },
  cartUpdated: {
    en: 'Cart updated successfully',
    ar: 'تم تحديث السلة بنجاح'
  },
  addressSaved: {
    en: 'Address saved successfully',
    ar: 'تم حفظ العنوان بنجاح'
  },
  addressDeleted: {
    en: 'Address deleted successfully',
    ar: 'تم حذف العنوان بنجاح'
  },
  profileUpdated: {
    en: 'Profile updated successfully',
    ar: 'تم تحديث الملف الشخصي بنجاح'
  },

  // Loading States
  loadingCategories: {
    en: 'Loading categories...',
    ar: 'جاري تحميل الفئات...'
  },
  loadingProducts: {
    en: 'Loading products...',
    ar: 'جاري تحميل المنتجات...'
  },
  loadingCart: {
    en: 'Loading cart...',
    ar: 'جاري تحميل السلة...'
  },
  loadingOrders: {
    en: 'Loading orders...',
    ar: 'جاري تحميل الطلبات...'
  },
  processingOrder: {
    en: 'Processing your order...',
    ar: 'جاري معالجة طلبك...'
  },
  updatingCart: {
    en: 'Updating cart...',
    ar: 'جاري تحديث السلة...'
  },
  loadingOrderDetails: {
    en: 'Loading order details...',
    ar: 'جاري تحميل تفاصيل الطلب...'
  },

  // Empty States
  noCategories: {
    en: 'No categories available',
    ar: 'لا توجد فئات متاحة'
  },
  noProducts: {
    en: 'No products found',
    ar: 'لم يتم العثور على منتجات'
  },
  noOrders: {
    en: 'No orders found',
    ar: 'لم يتم العثور على طلبات'
  },
  noWishlistItems: {
    en: 'Your wishlist is empty',
    ar: 'قائمة مفضلتك فارغة'
  },
  noAddresses: {
    en: 'No addresses found',
    ar: 'لم يتم العثور على عناوين'
  },
  noPromoCodes: {
    en: 'No promo codes available',
    ar: 'لا توجد أكواد خصم متاحة'
  },

  // Filters and Sorting
  filter: {
    en: 'Filter',
    ar: 'تصفية'
  },
  sort: {
    en: 'Sort',
    ar: 'ترتيب'
  },
  sortBy: {
    en: 'Sort By',
    ar: 'ترتيب حسب'
  },
  priceRange: {
    en: 'Price Range',
    ar: 'نطاق الأسعار'
  },
  brand: {
    en: 'Brand',
    ar: 'الماركة'
  },
  category: {
    en: 'Category',
    ar: 'الفئة'
  },
  clearFilters: {
    en: 'Clear Filters',
    ar: 'مسح التصفية'
  },
  applyFilters: {
    en: 'Apply Filters',
    ar: 'تطبيق التصفية'
  },

  // Product Details
  productDetails: {
    en: 'Product Details',
    ar: 'تفاصيل المنتج'
  },
  description: {
    en: 'Description',
    ar: 'الوصف'
  },
  specifications: {
    en: 'Specifications',
    ar: 'المواصفات'
  },
  reviews: {
    en: 'Reviews',
    ar: 'التقييمات'
  },
  relatedProducts: {
    en: 'Related Products',
    ar: 'منتجات ذات صلة'
  },
  viewMore: {
    en: 'View More',
    ar: 'عرض المزيد'
  },
  viewLess: {
    en: 'View Less',
    ar: 'عرض أقل'
  },
  availability: {
    en: 'Availability',
    ar: 'التوفر'
  },
  sku: {
    en: 'SKU',
    ar: 'رمز المنتج'
  },
  stockQuantity: {
    en: 'Stock Quantity',
    ar: 'الكمية المتاحة'
  },

  // Search and Loading States
  loadingSearch: {
    en: 'Searching...',
    ar: 'جاري البحث...'
  },
  noProductsFound: {
    en: 'No products found for your search',
    ar: 'لم يتم العثور على منتجات لبحثك'
  },
  
  // Authentication Flow
  confirmLogout: {
    en: 'Are you sure you want to logout?',
    ar: 'هل أنت متأكد من تسجيل الخروج؟'
  },
  loginToAccessFeatures: {
    en: 'Login to access your account features',
    ar: 'سجل دخولك للوصول إلى ميزات حسابك'
  },

  // Cart and Product Related
  item: {
    en: 'Item',
    ar: 'عنصر'
  },
  items: {
    en: 'Items',
    ar: 'عناصر'
  },
  addedToCart: {
    en: 'Added to cart',
    ar: 'تم إضافته إلى السلة'
  },
  removedFromCart: {
    en: 'Removed from cart',
    ar: 'تم إزالته من السلة'
  },

  // Address related
  billingAddressRequired: {
    en: 'Billing Address Required',
    ar: 'عنوان الفواتير مطلوب'
  },
  shippingAddressRequired: {
    en: 'Shipping Address Required',
    ar: 'عنوان الشحن مطلوب'
  },
  pleaseSelectAddress: {
    en: 'Please select or add a billing address',
    ar: 'يرجى اختيار أو إضافة عنوان للفواتير'
  },
  pleaseAddBillingAddress: {
    en: 'Please add your billing address',
    ar: 'يرجى إضافة عنوان الفواتير'
  },
  pleaseAddShippingAddress: {
    en: 'Please add your shipping address',
    ar: 'يرجى إضافة عنوان الشحن'
  },

  // Payment Related
  paymentMethodRequired: {
    en: 'Payment Method Required',
    ar: 'طريقة الدفع مطلوبة'
  },
  pleaseSelectPaymentMethod: {
    en: 'Please select a payment method to continue',
    ar: 'يرجى اختيار طريقة دفع للمتابعة'
  },
  
  // Terms and Conditions
  acceptTermsConditions: {
    en: 'Please accept the terms and conditions to continue',
    ar: 'يرجى قبول الشروط والأحكام للمتابعة'
  },

  // Order Related
  orderFailed: {
    en: 'Order Failed',
    ar: 'فشل الطلب'
  },
  orderFailedMessage: {
    en: 'Failed to place order. Please try again.',
    ar: 'فشل في تأكيد الطلب. يرجى المحاولة مرة أخرى.'
  },
  paymentNotSelected: {
    en: 'Payment method not selected. Please select a payment method.',
    ar: 'لم يتم اختيار طريقة الدفع. يرجى اختيار طريقة الدفع.'
  },
  cartEmpty: {
    en: 'Your cart is empty. Please add items to cart before checkout.',
    ar: 'سلتك فارغة. يرجى إضافة عناصر إلى السلة قبل الدفع.'
  },
  validationErrorMessage: {
    en: 'Validation error. Please check your information.',
    ar: 'خطأ في التحقق. يرجى مراجعة معلوماتك.'
  },
  itemsNotAvailable: {
    en: 'One or more items in your cart are not available in the requested quantity.',
    ar: 'عنصر أو أكثر في سلتك غير متوفر بالكمية المطلوبة.'
  },
  unexpectedError: {
    en: 'An unexpected error occurred. Please try again later.',
    ar: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى لاحقاً.'
  },

  // UI Elements
  apply: {
    en: 'Apply',
    ar: 'تطبيق'
  },
  remove: {
    en: 'Remove',
    ar: 'إزالة'
  },
  change: {
    en: 'Change',
    ar: 'تغيير'
  },
  select: {
    en: 'Select',
    ar: 'اختيار'
  },
};

// Hook to get translated text
export function useTranslation() {
  const { currentLanguage } = useLanguageStore();

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`🌐 Missing translation for key: ${key}`);
      return key; // Return the key as fallback
    }
    return translation[currentLanguage.code] || translation.en || key;
  };

  return { t, currentLanguage };
}

// Direct function to get translated text (for use outside components)
export function getTranslation(key: string, languageCode?: 'en' | 'ar'): string {
  const translation = translations[key];
  if (!translation) {
    console.warn(`🌐 Missing translation for key: ${key}`);
    return key;
  }

  // Use provided language code or get from store
  const lang = languageCode || useLanguageStore.getState().currentLanguage.code;
  return translation[lang] || translation.en || key;
}

// Helper function to format currency based on language
export function formatCurrency(amount: number, languageCode?: 'en' | 'ar'): string {
  const lang = languageCode || useLanguageStore.getState().currentLanguage.code;
  const currency = getTranslation('currency', lang);
  
  // Format number with appropriate decimal places
  const formatted = amount.toFixed(2);
  
  // Return currency format based on language
  if (lang === 'ar') {
    return `${formatted} ${currency}`;
  } else {
    return `${currency} ${formatted}`;
  }
}

// Helper function to get direction for RTL support
export function getTextDirection(): 'ltr' | 'rtl' {
  const { currentLanguage } = useLanguageStore.getState();
  return currentLanguage.isRTL ? 'rtl' : 'ltr';
}

export default useTranslation; 