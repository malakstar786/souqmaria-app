// Translation system for hardcoded text values
// This provides translations for UI text that doesn't come from the API

import useLanguageStore from '../store/language-store';

// Translation keys and their values
const translations = {
  // Common UI elements
  'shop_by_category': {
    en: 'Shop By Category',
    ar: 'تسوق حسب الفئة'
  },
  'categories': {
    en: 'Categories',
    ar: 'الفئات'
  },
  'search_placeholder': {
    en: 'What are you looking for?',
    ar: 'ماذا تبحث عن؟'
  },
  'loading': {
    en: 'Loading...',
    ar: 'جاري التحميل...'
  },
  'searching': {
    en: 'Searching...',
    ar: 'جاري البحث...'
  },
  
  // Empty states
  'no_categories_found': {
    en: 'No categories found',
    ar: 'لم يتم العثور على فئات'
  },
  'no_products_found': {
    en: 'No products found',
    ar: 'لم يتم العثور على منتجات'
  },
  'no_sub_categories_found': {
    en: 'No sub-categories found.',
    ar: 'لم يتم العثور على فئات فرعية.'
  },
  'no_addresses_found': {
    en: 'No addresses found',
    ar: 'لم يتم العثور على عناوين'
  },
  'no_orders_found': {
    en: 'No orders found',
    ar: 'لم يتم العثور على طلبات'
  },
  'no_order_details_found': {
    en: 'No order details found',
    ar: 'لم يتم العثور على تفاصيل الطلب'
  },
  'no_shipping_addresses_found': {
    en: 'No shipping addresses found',
    ar: 'لم يتم العثور على عناوين الشحن'
  },
  'no_billing_addresses_found': {
    en: 'No billing addresses found',
    ar: 'لم يتم العثور على عناوين الفواتير'
  },
  
  // Search results
  'no_products_found_for': {
    en: 'No products found for',
    ar: 'لم يتم العثور على منتجات لـ'
  },
  
  // Account section
  'language': {
    en: 'Language',
    ar: 'اللغة'
  },
  'select_language': {
    en: 'Select Language',
    ar: 'اختر اللغة'
  },
  'change_language': {
    en: 'Change Language',
    ar: 'تغيير اللغة'
  },
  'change_language_confirmation': {
    en: 'Are you sure you want to change the language to',
    ar: 'هل أنت متأكد من أنك تريد تغيير اللغة إلى'
  },
  'layout_will_change_immediately': {
    en: 'The app layout will change immediately.',
    ar: 'سيتغير تخطيط التطبيق على الفور.'
  },
  'english': {
    en: 'English',
    ar: 'الإنجليزية'
  },
  'arabic': {
    en: 'Arabic',
    ar: 'العربية'
  },
  'cancel': {
    en: 'Cancel',
    ar: 'إلغاء'
  },
  'change': {
    en: 'Change',
    ar: 'تغيير'
  },
  'language_change_note': {
    en: 'Changing the language will update all content in the app to the selected language.',
    ar: 'سيؤدي تغيير اللغة إلى تحديث جميع محتويات التطبيق إلى اللغة المحددة.'
  },
  
  // Error messages
  'error': {
    en: 'Error',
    ar: 'خطأ'
  },
  'failed_to_change_language': {
    en: 'Failed to change language. Please try again.',
    ar: 'فشل في تغيير اللغة. يرجى المحاولة مرة أخرى.'
  },
  'user_not_found': {
    en: 'User not found. Please log in again.',
    ar: 'المستخدم غير موجود. يرجى تسجيل الدخول مرة أخرى.'
  },
  'address_not_found': {
    en: 'Address not found',
    ar: 'العنوان غير موجود'
  },
  'guest_user_not_found': {
    en: 'Guest user not found. Please try again.',
    ar: 'المستخدم الضيف غير موجود. يرجى المحاولة مرة أخرى.'
  },
  
  // Page titles
  'page_not_found': {
    en: 'Oops! Page Not Found',
    ar: 'عذراً! الصفحة غير موجودة'
  },
  
  // Filter and sorting
  'filters': {
    en: 'Filters',
    ar: 'المرشحات'
  },
  'sort_by': {
    en: 'Sort By',
    ar: 'ترتيب حسب'
  },
  'price_range': {
    en: 'Price Range',
    ar: 'نطاق السعر'
  },
  'brands': {
    en: 'Brands',
    ar: 'العلامات التجارية'
  },
  'apply_filters': {
    en: 'Apply Filters',
    ar: 'تطبيق المرشحات'
  },
  'reset_filters': {
    en: 'Reset Filters',
    ar: 'إعادة تعيين المرشحات'
  },
  
  // Common actions
  'search': {
    en: 'Search',
    ar: 'بحث'
  },
  'continue': {
    en: 'Continue',
    ar: 'متابعة'
  },
  'back': {
    en: 'Back',
    ar: 'رجوع'
  },
  'save': {
    en: 'Save',
    ar: 'حفظ'
  },
  'edit': {
    en: 'Edit',
    ar: 'تعديل'
  },
  'delete': {
    en: 'Delete',
    ar: 'حذف'
  },
  'add': {
    en: 'Add',
    ar: 'إضافة'
  },
  'update': {
    en: 'Update',
    ar: 'تحديث'
  },
  'confirm': {
    en: 'Confirm',
    ar: 'تأكيد'
  },
  'close': {
    en: 'Close',
    ar: 'إغلاق'
  },
  'new_arrival': {
    en: 'New Arrival',
    ar: 'وصول جديد'
  },
  
  // Product detail page
  'add_to_cart': {
    en: 'ADD TO CART',
    ar: 'أضف إلى السلة'
  },
  'order_on_whatsapp': {
    en: 'ORDER ON WHATSAPP',
    ar: 'اطلب عبر الواتساب'
  },
  'view_cart': {
    en: 'VIEW CART',
    ar: 'عرض السلة'
  },
  'continue_shopping': {
    en: 'CONTINUE SHOPPING',
    ar: 'متابعة التسوق'
  },
  'product_description': {
    en: 'DESCRIPTION',
    ar: 'الوصف'
  },
  'key_features': {
    en: 'KEY FEATURES',
    ar: 'الميزات الرئيسية'
  },
  'related_products': {
    en: 'RELATED PRODUCTS',
    ar: 'منتجات ذات صلة'
  },
  'out_of_stock': {
    en: 'Out Of Stock',
    ar: 'غير متوفر'
  },
  'read_more': {
    en: 'Read More',
    ar: 'اقرأ المزيد'
  },
  'read_less': {
    en: 'Read Less',
    ar: 'اقرأ أقل'
  },
  'go_back': {
    en: 'Go Back',
    ar: 'العودة'
  },
  'no_image_available': {
    en: 'No image available',
    ar: 'لا توجد صورة متاحة'
  },
  'added_to_cart_successfully': {
    en: 'Added to your cart successfully.',
    ar: 'تم إضافته إلى سلتك بنجاح.'
  },
  
  // Filter headings (using existing keys)
  'filter_sort_by': {
    en: 'Sort By',
    ar: 'ترتيب حسب'
  },
  'filter_category': {
    en: 'Category',
    ar: 'الفئة'
  },
  'filter_price': {
    en: 'Price',
    ar: 'السعر'
  },
  'filter_brand': {
    en: 'Brand',
    ar: 'الماركة'
  },
  'reset': {
    en: 'Reset',
    ar: 'إعادة تعيين'
  },
  'apply': {
    en: 'Apply',
    ar: 'تطبيق'
  },
  'min_price': {
    en: 'Min Price',
    ar: 'أقل سعر'
  },
  'max_price': {
    en: 'Max Price',
    ar: 'أعلى سعر'
  },
  
  // Tab names
  'home': {
    en: 'Home',
    ar: 'الرئيسية'
  },
  'cart': {
    en: 'Cart',
    ar: 'السلة'
  },
  'account_tab': {
    en: 'Account',
    ar: 'الحساب'
  },
  'checkout': {
    en: 'Checkout',
    ar: 'الدفع'
  },
  
  // Account options
  'my_details': {
    en: 'My Details',
    ar: 'بياناتي'
  },
  'my_address': {
    en: 'My Address',
    ar: 'عنواني'
  },
  'my_orders': {
    en: 'My Orders',
    ar: 'طلباتي'
  },
  'wishlist': {
    en: 'Wishlist',
    ar: 'المفضلة'
  },
  'policies': {
    en: 'Policies',
    ar: 'السياسات'
  },
  'logout': {
    en: 'Logout',
    ar: 'تسجيل الخروج'
  },
  'delete_profile': {
    en: 'Delete Profile',
    ar: 'حذف الحساب'
  },
  'delete_profile_description': {
    en: 'Request to delete your account and all associated data',
    ar: 'طلب حذف حسابك وجميع البيانات المرتبطة به'
  },
  'login_register': {
    en: 'Login / Register',
    ar: 'تسجيل الدخول / التسجيل'
  },
  'follow_us': {
    en: 'FOLLOW US',
    ar: 'تابعنا'
  },
  'tap_to_change': {
    en: '(Tap to change)',
    ar: '(اضغط للتغيير)'
  },
  
  // Guest account screen
  'guest_shopping_experience': {
    en: 'To get the best experience of shopping you can',
    ar: 'للحصول على أفضل تجربة تسوق يمكنك'
  },
  
  // Checkout and Address Forms
  'address': {
    en: 'Address',
    ar: 'العنوان'
  },
  'add_address': {
    en: 'Add Address',
    ar: 'إضافة عنوان'
  },
  'billing_address': {
    en: 'Billing Address',
    ar: 'عنوان الفاتورة'
  },
  'shipping_address': {
    en: 'Shipping Address',
    ar: 'عنوان الشحن'
  },
  'change_address': {
    en: 'Change',
    ar: 'تغيير'
  },
  
  // Form fields
  'full_name': {
    en: 'Full Name',
    ar: 'الاسم الكامل'
  },
  'email': {
    en: 'Email',
    ar: 'البريد الإلكتروني'
  },
  'mobile': {
    en: 'Mobile No.',
    ar: 'رقم الجوال'
  },
  'mobile_number': {
    en: 'Mobile Number',
    ar: 'رقم الجوال'
  },
  'country': {
    en: 'Country',
    ar: 'البلد'
  },
  'city': {
    en: 'City',
    ar: 'المدينة'
  },
  'area': {
    en: 'Area',
    ar: 'المنطقة'
  },
  'state': {
    en: 'State',
    ar: 'الولاية'
  },
  'block': {
    en: 'Block',
    ar: 'القطعة'
  },
  'street': {
    en: 'Street',
    ar: 'الشارع'
  },
  'house_building': {
    en: 'House/ Building',
    ar: 'المنزل/ المبنى'
  },
  'apartment_no': {
    en: 'Apartment No.',
    ar: 'رقم الشقة'
  },
  'address_line_1': {
    en: 'Address Line 1',
    ar: 'سطر العنوان 1'
  },
  'additional_address_info': {
    en: 'Additional Address Info',
    ar: 'معلومات إضافية للعنوان'
  },
  
  // Form placeholders
  'enter_full_name': {
    en: 'Enter your full name',
    ar: 'أدخل اسمك الكامل'
  },
  'enter_email': {
    en: 'Enter your email',
    ar: 'أدخل بريدك الإلكتروني'
  },
  'enter_mobile': {
    en: 'Enter your mobile number',
    ar: 'أدخل رقم جوالك'
  },
  'select_country': {
    en: 'Select Country',
    ar: 'اختر البلد'
  },
  'select_city': {
    en: 'Select City',
    ar: 'اختر المدينة'
  },
  'select_area': {
    en: 'Select Area',
    ar: 'اختر المنطقة'
  },
  'select_state': {
    en: 'Select State',
    ar: 'اختر الولاية'
  },
  'enter_block': {
    en: 'Enter block',
    ar: 'أدخل القطعة'
  },
  'enter_street': {
    en: 'Enter street',
    ar: 'أدخل الشارع'
  },
  'enter_house': {
    en: 'Enter house/building',
    ar: 'أدخل المنزل/المبنى'
  },
  'enter_apartment': {
    en: 'Enter apartment number (optional)',
    ar: 'أدخل رقم الشقة (اختياري)'
  },
  'enter_additional_address': {
    en: 'Enter additional address info (optional)',
    ar: 'أدخل معلومات إضافية للعنوان (اختياري)'
  },
  
  // Checkout options
  'ship_to_different_address': {
    en: 'Ship to Different Address?',
    ar: 'الشحن إلى عنوان مختلف؟'
  },
  'set_as_default': {
    en: 'Set as default',
    ar: 'تعيين كافتراضي'
  },
  'have_promo_code': {
    en: 'Have a Promo Code?',
    ar: 'لديك كود خصم؟'
  },
  'enter_promo_code': {
    en: 'Enter Promo Code',
    ar: 'أدخل كود الخصم'
  },
  'see_available_promo_codes': {
    en: 'See Available Promo Codes',
    ar: 'عرض أكواد الخصم المتاحة'
  },
  'promo_code_applied': {
    en: 'Promo code applied',
    ar: 'تم تطبيق كود الخصم'
  },
  'discount': {
    en: 'Discount',
    ar: 'الخصم'
  },
  'remove': {
    en: 'Remove',
    ar: 'إزالة'
  },
  'select_payment_type': {
    en: 'Select Payment Type',
    ar: 'اختر نوع الدفع'
  },
  'no_payment_methods_available': {
    en: 'No payment methods available',
    ar: 'لا توجد طرق دفع متاحة'
  },
  
  // Account Details
  'edit_details': {
    en: 'Edit Details',
    ar: 'تعديل البيانات'
  },
  'save_changes': {
    en: 'Save Changes',
    ar: 'حفظ التغييرات'
  },
  'new_password_optional': {
    en: 'New Password (optional)',
    ar: 'كلمة مرور جديدة (اختياري)'
  },
  'enter_new_password': {
    en: 'Enter new password (min. 8 chars)',
    ar: 'أدخل كلمة مرور جديدة (8 أحرف على الأقل)'
  },
  
  // Missing translations
  'product_not_found': {
    en: 'Product not found',
    ar: 'المنتج غير موجود'
  },
  'no_results_found': {
    en: 'No Results Found',
    ar: 'لم يتم العثور على نتائج'
  },
  
  // Checkout and Order Summary
  'order_summary': {
    en: 'Order Summary',
    ar: 'ملخص الطلب'
  },
  'item_sub_total': {
    en: 'Item Sub total',
    ar: 'المجموع الفرعي للعناصر'
  },
  'shipping_fee': {
    en: 'Shipping Fee',
    ar: 'رسوم الشحن'
  },
  'grand_total': {
    en: 'Grand Total',
    ar: 'المجموع الإجمالي'
  },
  'applied_promo': {
    en: 'Applied Promo',
    ar: 'الرمز الترويجي المطبق'
  },
  'create_account_question': {
    en: 'Create an Account?',
    ar: 'إنشاء حساب؟'
  },
  'terms_conditions_text': {
    en: 'By proceeding, I\'ve read and accept the',
    ar: 'بالمتابعة، لقد قرأت ووافقت على'
  },
  'terms_conditions': {
    en: 'terms & conditions',
    ar: 'الشروط والأحكام'
  },
  'place_order': {
    en: 'Place Order',
    ar: 'تأكيد الطلب'
  },
  'returning_customer': {
    en: 'Are you a returning customer?',
    ar: 'هل أنت عميل عائد؟'
  },
  'login_here': {
    en: 'Login Here',
    ar: 'تسجيل الدخول هنا'
  },
  
  // Address Management
  'my_addresses': {
    en: 'My Addresses',
    ar: 'عناويني'
  },
  'shipping_addresses': {
    en: 'Shipping Addresses',
    ar: 'عناوين الشحن'
  },
  'billing_addresses': {
    en: 'Billing Addresses',
    ar: 'عناوين الفواتير'
  },
  'no_shipping_addresses': {
    en: 'No shipping addresses found',
    ar: 'لم يتم العثور على عناوين شحن'
  },
  'no_billing_addresses': {
    en: 'No billing addresses found',
    ar: 'لم يتم العثور على عناوين فواتير'
  },
  'add_shipping_address': {
    en: 'Add Shipping Address',
    ar: 'إضافة عنوان شحن'
  },
  'add_billing_address': {
    en: 'Add Billing Address',
    ar: 'إضافة عنوان فاتورة'
  },
  'address_default': {
    en: 'Default',
    ar: 'افتراضي'
  },
  'confirm_delete': {
    en: 'Confirm Delete',
    ar: 'تأكيد الحذف'
  },
  'delete_address_confirmation': {
    en: 'Are you sure you want to delete this address?',
    ar: 'هل أنت متأكد من حذف هذا العنوان؟'
  },
  'loading_addresses': {
    en: 'Loading addresses...',
    ar: 'جاري تحميل العناوين...'
  },
  'retry': {
    en: 'Retry',
    ar: 'إعادة المحاولة'
  },
  'address_deleted_successfully': {
    en: 'Address deleted successfully!',
    ar: 'تم حذف العنوان بنجاح!'
  },
  'failed_to_delete_address': {
    en: 'Failed to delete address. Please try again.',
    ar: 'فشل في حذف العنوان. يرجى المحاولة مرة أخرى.'
  },
  
  // Auth Modal
  'login': {
    en: 'Login',
    ar: 'تسجيل الدخول'
  },
  'sign_up': {
    en: 'Sign Up',
    ar: 'إنشاء حساب'
  },
  'password': {
    en: 'Password',
    ar: 'كلمة المرور'
  },
  'email_mobile_required': {
    en: 'Email/Mobile is required',
    ar: 'البريد الإلكتروني/الجوال مطلوب'
  },
  'password_required': {
    en: 'Password is required',
    ar: 'كلمة المرور مطلوبة'
  },
  'full_name_required': {
    en: 'Full name is required',
    ar: 'الاسم الكامل مطلوب'
  },
  'email_required': {
    en: 'Email is required',
    ar: 'البريد الإلكتروني مطلوب'
  },
  'mobile_required': {
    en: 'Mobile is required',
    ar: 'رقم الجوال مطلوب'
  },
  'invalid_email_format': {
    en: 'Invalid email format',
    ar: 'تنسيق البريد الإلكتروني غير صحيح'
  },
  'password_min_length': {
    en: 'Password must be at least 8 characters',
    ar: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'
  },
  'account_created_successfully': {
    en: 'Your account has been created successfully!',
    ar: 'تم إنشاء حسابك بنجاح!'
  },
  'ok': {
    en: 'OK',
    ar: 'موافق'
  },
  'image_not_available': {
    en: 'Image not available',
    ar: 'الصورة غير متوفرة'
  },
  
  // Common status messages
  'success': {
    en: 'Success',
    ar: 'نجح'
  },
  
  // Cart page translations
  'my_cart_title': {
    en: 'My Cart',
    ar: 'سلتي'
  },
  'your_cart_is_empty': {
    en: 'Your Cart is Empty',
    ar: 'سلتك فارغة'
  },
  'add_items': {
    en: 'Add Items',
    ar: 'إضافة عناصر'
  },
  'add_to_wishlist_caps': {
    en: 'ADD TO WISHLIST',
    ar: 'أضف إلى المفضلة'
  },
  'remove_caps': {
    en: 'REMOVE',
    ar: 'إزالة'
  },
  'total_caps': {
    en: 'TOTAL',
    ar: 'المجموع'
  },
  'checkout_caps': {
    en: 'CHECKOUT',
    ar: 'الدفع'
  },
  'remove_item_from_cart': {
    en: 'Remove item from Cart?',
    ar: 'إزالة العنصر من السلة؟'
  },
  'yes_remove': {
    en: 'YES, REMOVE',
    ar: 'نعم، إزالة'
  },
  'login_required': {
    en: 'Login Required',
    ar: 'تسجيل الدخول مطلوب'
  },
  'please_login_to_add_wishlist': {
    en: 'Please login to add items to your wishlist.',
    ar: 'يرجى تسجيل الدخول لإضافة العناصر إلى قائمة المفضلة.'
  },
  'item_added_to_wishlist': {
    en: 'Item added to your wishlist.',
    ar: 'تم إضافة العنصر إلى قائمة المفضلة.'
  },
  'failed_to_add_to_wishlist': {
    en: 'Failed to add item to wishlist. Please try again.',
    ar: 'فشل في إضافة العنصر إلى قائمة المفضلة. يرجى المحاولة مرة أخرى.'
  },
  'stock_not_available': {
    en: 'Stock Not Available',
    ar: 'المخزون غير متوفر'
  },
  'requested_quantity_not_available': {
    en: 'The requested quantity is not available in stock.',
    ar: 'الكمية المطلوبة غير متوفرة في المخزون.'
  },
  'failed_to_update_quantity': {
    en: 'Failed to update quantity',
    ar: 'فشل في تحديث الكمية'
  },
  'unexpected_error': {
    en: 'An unexpected error occurred. Please try again.',
    ar: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'
  },
  
  // Browse menu
  'browse': {
    en: 'Browse',
    ar: 'تصفح'
  },
  
  // Product detail page
  'product_not_available': {
    en: 'Product not available',
    ar: 'المنتج غير متوفر'
  },
  'order_via_whatsapp': {
    en: 'Order via WhatsApp',
    ar: 'اطلب عبر الواتساب'
  },
  'quantity': {
    en: 'Quantity',
    ar: 'الكمية'
  },
  'specifications': {
    en: 'Specifications',
    ar: 'المواصفات'
  },
  'features': {
    en: 'Features',
    ar: 'الميزات'
  },
  
  // Orders screen
  'my_orders_title': {
    en: 'My Orders',
    ar: 'طلباتي'
  },
  'please_log_in': {
    en: 'Please Log In',
    ar: 'يرجى تسجيل الدخول'
  },
  'login_to_view_orders': {
    en: 'Please log in to view your order history.',
    ar: 'يرجى تسجيل الدخول لعرض تاريخ طلباتك.'
  },
  'log_in_sign_up': {
    en: 'Log In / Sign Up',
    ar: 'تسجيل الدخول / التسجيل'
  },
  'search_orders': {
    en: 'Search orders...',
    ar: 'البحث في الطلبات...'
  },
  'order_number': {
    en: 'Order #',
    ar: 'طلب رقم '
  },
  'order_total': {
    en: 'Total',
    ar: 'المجموع'
  },
  'status': {
    en: 'Status',
    ar: 'الحالة'
  },
  'processing': {
    en: 'Processing',
    ar: 'قيد المعالجة'
  },
  'view_details': {
    en: 'View Details',
    ar: 'عرض التفاصيل'
  },
  'order_history_appears_here': {
    en: 'Your order history will appear here',
    ar: 'سيظهر تاريخ طلباتك هنا'
  },
  'loading_orders': {
    en: 'Loading orders...',
    ar: 'جاري تحميل الطلبات...'
  },
  'no_orders_match_search': {
    en: 'No orders match your search',
    ar: 'لا توجد طلبات تطابق بحثك'
  },
  'try_different_search': {
    en: 'Try a different search term',
    ar: 'جرب مصطلح بحث مختلف'
  },
  'orders_clear_search': {
    en: 'Clear Search',
    ar: 'مسح البحث'
  },
  
  // Order Details page
  'order_details_title': {
    en: 'Order Details',
    ar: 'تفاصيل الطلب'
  },
  'order_items': {
    en: 'Order Items',
    ar: 'عناصر الطلب'
  },
  'order_details_summary': {
    en: 'Order Summary',
    ar: 'ملخص الطلب'
  },
  'qty': {
    en: 'Qty',
    ar: 'الكمية'
  },
  'subtotal': {
    en: 'Subtotal',
    ar: 'المجموع الفرعي'
  },
  'total_items': {
    en: 'Total Items',
    ar: 'إجمالي العناصر'
  },
  'total_amount': {
    en: 'Total Amount',
    ar: 'المبلغ الإجمالي'
  },
  'item': {
    en: 'item',
    ar: 'عنصر'
  },
  'items': {
    en: 'items',
    ar: 'عناصر'
  },
  'loading_order_details': {
    en: 'Loading order details...',
    ar: 'جاري تحميل تفاصيل الطلب...'
  },
  
  // My Details screen translations
  'please_login_to_view_details': {
    en: 'Please login to view your details',
    ar: 'يرجى تسجيل الدخول لعرض بياناتك'
  },
  'enter_current_password_to_update': {
    en: 'Enter your current password to update your details:',
    ar: 'أدخل كلمة المرور الحالية لتحديث بياناتك:'
  },
  'current_password': {
    en: 'Current Password',
    ar: 'كلمة المرور الحالية'
  },
  'submit': {
    en: 'Submit',
    ar: 'إرسال'
  },
  'full_name_required_error': {
    en: 'Full name is required.',
    ar: 'الاسم الكامل مطلوب.'
  },
  'password_min_8_chars_error': {
    en: 'Password must be at least 8 characters.',
    ar: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل.'
  },
  'user_data_not_available': {
    en: 'User data is not available. Please log in again.',
    ar: 'بيانات المستخدم غير متوفرة. يرجى تسجيل الدخول مرة أخرى.'
  },
  'password_required_for_update': {
    en: 'Password Required',
    ar: 'كلمة المرور مطلوبة'
  },
  'enter_current_password_message': {
    en: 'Please enter your current password.',
    ar: 'يرجى إدخال كلمة المرور الحالية.'
  },
  'details_updated_successfully': {
    en: 'Your details have been updated successfully!',
    ar: 'تم تحديث بياناتك بنجاح!'
  },
  'update_failed': {
    en: 'Update Failed',
    ar: 'فشل التحديث'
  },
  'na': {
    en: 'N/A',
    ar: 'غير متوفر'
  },
  
  // Edit Address Modal translations
  'edit_shipping_address': {
    en: 'Edit shipping address',
    ar: 'تعديل عنوان الشحن'
  },
  'edit_billing_address': {
    en: 'Edit billing address',
    ar: 'تعديل عنوان الفاتورة'
  },
  'loading_address': {
    en: 'Loading address...',
    ar: 'جاري تحميل العنوان...'
  },
  'email_required_field': {
    en: 'Email required',
    ar: 'البريد الإلكتروني مطلوب'
  },
  'mobile_required_field': {
    en: 'Mobile required',
    ar: 'رقم الجوال مطلوب'
  },
  'country_required': {
    en: 'Country required',
    ar: 'البلد مطلوب'
  },
  'state_required': {
    en: 'State required',
    ar: 'الولاية مطلوبة'
  },
  'city_required': {
    en: 'City required',
    ar: 'المدينة مطلوبة'
  },
  'block_required': {
    en: 'Block required',
    ar: 'القطعة مطلوبة'
  },
  'street_required': {
    en: 'Street required',
    ar: 'الشارع مطلوب'
  },
  'house_required': {
    en: 'House required',
    ar: 'المنزل مطلوب'
  },
  'apartment_no_optional': {
    en: 'Apartment No.',
    ar: 'رقم الشقة'
  },
  'address_2_optional': {
    en: 'Address 2 (optional)',
    ar: 'العنوان 2 (اختياري)'
  },
  'select_country_first': {
    en: 'Please select a country first',
    ar: 'يرجى اختيار البلد أولاً'
  },
  'select_state_first': {
    en: 'Please select a state first',
    ar: 'يرجى اختيار الولاية أولاً'
  },
  'no_items_available': {
    en: 'No items available',
    ar: 'لا توجد عناصر متاحة'
  },
  'shipping_address_updated_successfully': {
    en: 'Shipping address updated successfully!',
    ar: 'تم تحديث عنوان الشحن بنجاح!'
  },
  'billing_address_updated_successfully': {
    en: 'Billing address updated successfully!',
    ar: 'تم تحديث عنوان الفاتورة بنجاح!'
  },
  'failed_to_update_address': {
    en: 'Failed to update address. Please check console for details.',
    ar: 'فشل في تحديث العنوان. يرجى التحقق من وحدة التحكم للحصول على التفاصيل.'
  },
  'network_error_try_again': {
    en: 'Network error. Please try again.',
    ar: 'خطأ في الشبكة. يرجى المحاولة مرة أخرى.'
  },
  
  // Wishlist screen translations
  'wishlist_title': {
    en: 'Wishlist',
    ar: 'المفضلة'
  },
  'please_login_to_view_wishlist': {
    en: 'Please login to view your wishlist',
    ar: 'يرجى تسجيل الدخول لعرض قائمة المفضلة'
  },
  'your_wishlist_is_empty': {
    en: 'Your wishlist is empty',
    ar: 'قائمة المفضلة فارغة'
  },
  'continue_shopping_caps': {
    en: 'CONTINUE SHOPPING',
    ar: 'متابعة التسوق'
  },
  'remove_item': {
    en: 'Remove Item',
    ar: 'إزالة العنصر'
  },
  'remove_item_confirmation': {
    en: 'Are you sure you want to remove',
    ar: 'هل أنت متأكد من إزالة'
  },
  'from_your_wishlist': {
    en: 'from your wishlist?',
    ar: 'من قائمة المفضلة؟'
  },
  'login_caps': {
    en: 'LOGIN',
    ar: 'تسجيل الدخول'
  },
  'failed_to_remove_from_wishlist': {
    en: 'Failed to remove item from wishlist. Please try again.',
    ar: 'فشل في إزالة العنصر من قائمة المفضلة. يرجى المحاولة مرة أخرى.'
  },
  
  // Policies screen translations
  'policies_title': {
    en: 'Policies',
    ar: 'السياسات'
  },
  'about_us': {
    en: 'About Us',
    ar: 'من نحن'
  },
  'contact_us': {
    en: 'Contact Us',
    ar: 'اتصل بنا'
  },
  'terms_and_conditions': {
    en: 'Terms and Conditions',
    ar: 'الشروط والأحكام'
  },
  'privacy_return_policy': {
    en: 'Privacy & Return Policy',
    ar: 'سياسة الخصوصية والإرجاع'
  },
  
  // Add Address Screen translations
  'billing_address_saved_successfully': {
    en: 'Billing address saved successfully!',
    ar: 'تم حفظ عنوان الفاتورة بنجاح!'
  },
  'shipping_address_saved_successfully': {
    en: 'Shipping address saved successfully!',
    ar: 'تم حفظ عنوان الشحن بنجاح!'
  },
  'failed_to_save_address': {
    en: 'Failed to save address',
    ar: 'فشل في حفظ العنوان'
  },
  'user_not_found_login_again': {
    en: 'User not found. Please log in again.',
    ar: 'المستخدم غير موجود. يرجى تسجيل الدخول مرة أخرى.'
  },
  'unknown_error_occurred': {
    en: 'An unknown error occurred',
    ar: 'حدث خطأ غير معروف'
  },
  'language_changed': {
    en: 'Language Changed',
    ar: 'تم تغيير اللغة'
  },
  'language_changed_to': {
    en: 'Language changed to',
    ar: 'تم تغيير اللغة إلى'
  },
  'layout_updated_immediately': {
    en: 'The app layout has been updated immediately.',
    ar: 'تم تحديث تخطيط التطبيق فوراً.'
  },
  'language_change_note_immediate': {
    en: 'The app layout and content will change immediately when you select a different language.',
    ar: 'سيتغير تخطيط ومحتوى التطبيق فوراً عند اختيار لغة مختلفة.'
  },
  
  // Thank you page translations
  'thank_you_loading_order_details': {
    en: 'Loading order details...',
    ar: 'جاري تحميل تفاصيل الطلب...'
  },
  'thank_you_order_successful': {
    en: 'Order Successful',
    ar: 'تم الطلب بنجاح'
  },
  'order_confirmation_email': {
    en: 'You will be receiving a confirmation email with order details.',
    ar: 'ستتلقى رسالة بريد إلكتروني للتأكيد مع تفاصيل الطلب.'
  },
  'track_id': {
    en: 'Track Id',
    ar: 'رقم التتبع'
  },
  'pay_status': {
    en: 'Pay Status',
    ar: 'حالة الدفع'
  },
  'total': {
    en: 'Total',
    ar: 'المجموع'
  },
  'currency': {
    en: 'KWD',
    ar: 'د.ك'
  },
  'thank_you_success': {
    en: 'SUCCESS',
    ar: 'نجح'
  },
  'failed': {
    en: 'Failed',
    ar: 'فشل'
  },
  'order_placed_contact': {
    en: 'Your Order has been placed successfully. For any assistance contact here:',
    ar: 'تم وضع طلبك بنجاح. للحصول على أي مساعدة، اتصل هنا:'
  },
  'thank_you_continue_shopping': {
    en: 'Continue Shopping',
    ar: 'متابعة التسوق'
  },
  'order_failed_title': {
    en: 'Oops! Something went wrong.',
    ar: 'عذراً! حدث خطأ ما.'
  },
  'order_failed_message': {
    en: 'Your Order was not placed please try again',
    ar: 'لم يتم وضع طلبك، يرجى المحاولة مرة أخرى'
  },
  'try_again': {
    en: 'Try again',
    ar: 'حاول مرة أخرى'
  },
  'please_wait': {
    en: 'Please Wait',
    ar: 'يرجى الانتظار'
  },
  'app_reloading_message': {
    en: 'The app is reloading to apply the new language settings.',
    ar: 'يتم إعادة تحميل التطبيق لتطبيق إعدادات اللغة الجديدة.'
  },
} as const;

export type TranslationKey = keyof typeof translations;

// Hook to get translated text
export function useTranslation() {
  const { currentLanguage } = useLanguageStore();
  
  const t = (key: TranslationKey, fallback?: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return fallback || key;
    }
    
    const languageCode = currentLanguage.code as 'en' | 'ar';
    return translation[languageCode] || translation.en || fallback || key;
  };
  
  // Helper for formatted strings (e.g., "No products found for 'iPhone'")
  const tf = (key: TranslationKey, ...args: string[]): string => {
    let text = t(key);
    args.forEach((arg, index) => {
      text = text.replace(`{${index}}`, arg);
    });
    return text;
  };
  
  return { t, tf };
}

// Direct function for use outside of React components
export function getTranslation(key: TranslationKey, languageCode: 'en' | 'ar' = 'en', fallback?: string): string {
  const translation = translations[key];
  if (!translation) {
    console.warn(`Translation missing for key: ${key}`);
    return fallback || key;
  }
  
  return translation[languageCode] || translation.en || fallback || key;
} 