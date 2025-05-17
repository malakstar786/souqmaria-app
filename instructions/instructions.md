# Product Requirements Documentation (PRD) 

## Project Overview
You are building an eCommerce mobile application for iOS and Android that sells mobile phones, tablets, and electronics, where users can simply download the app, select the product and checkout by paying for the product using Cash On Delivery. 

You will be using React Native, Expo, Supabase, Toast and Zustand.

## Core Functionalities
1. Choose between English and Arabic for the app language. 
    1. Users can choose between two languages for interacting with the app. 
        - If it is a first time user, they will be shown the app in English languge by default. 
        - If it is an existing customer then they will be shown the app in the language they selected previously.
    2. If the user wishes to change the app language, they ca do so in the 'Accounts' tab of the application.

2. Browse the different products seamlessly within the app.
    1. The users will be shown a splash screen for 3 seconds upon opening the app. It will have a white background with the logo of SOUQ MARIA positioned in the middle of the screen.
    2. The users can find products either by searching for the product name or by searching for the category and browsing through the products under the category.
    3. Under the 'Home' tab: 
        - Users will be shown the different categories, which they can click to go to the corresponding category page.
        - User can explore different products on the home page. 
        - They can search for products either from the search bar or through the menu drawer.
    4. Once the user clicks on a category on the home page, they will be taken to a page that displays all the products within that category. 
        - Users can apply filters there itself - Sort By, Category, Price, Brand.

3. Add / remove products in the cart and going to checkout.
    1. The user can add a product to cart in the following way: 
        - Click on 'Add to cart' button by clicking on the product, hence opening an individual product page with additional product details and clicking on the button. 
    2. The user can remove a product from the cart by going to the 'Cart' tab, clicking on the delete icon, and choosing 'Yes, remove' button.
    3. The user can go to checkout by clicking on the 'Checkout' button in the 'Cart' tab.
    4. The user can add an item to their wishlist from the cart tab.

4. Checkout flow.
    1. The user can go to the checkout page by clicking on the 'Buy Now' present on individual product view.
    2. The user can go to checkout from the cart tabe and clicking on checkout button. 
    3. Once checkout flow is triggered
        - Users will get an option to sign up / login if they have not already. 
        - If the user wishes to continue as a guest they can do so.


5. Quick and easy login / sign up by form submission. 
    1. The user can login / sign up in two ways: 
        - By going to the 'Account' tab and clicking on login / Register button. 
        - By logging in / signing up after adding products to cart and before proceeding to checkout.
        NOTE: Users can access and browse the app without having an account as well as checkout as a guest.
    2. A social sign-in / sign-up is also provided to the user in the form of Google Registration.

6. There will only be Cash On Delivery as the payment method, so no requirement of integration of any payment gateway.

7. Wishlist Functionality
    1. Users can add products to their wishlist
    2. Wishlist is accessible from the Account tab
    3. Users can:
        - Add/remove products from wishlist
        - Move products from wishlist to cart

10. Filtering
    1. Filter options:
        - Price range
        - Brand
        - Category
    3. Sort options:
        - Price: Low to High
        - Price: High to Low
        - Sort by A to Z
        - Sort by Z to A
        - New Arrival
        - Sort by Old



## Application Layout
### 1. Homepage

#### General
- **Background color:** `#FFFFFF` (white)
- **Top bar:** Light blue background (`#D9F4FF`), with the Souq Maria logo (full color), cart icon (top right), and a search bar below.
- **Primary accent colors:**  
  - Green: `#8DC63F`  
  - Blue: `#00AEEF`  
  - Black: `#000000`  
  - Light gray: `#D9D9D9`  
  - Very light gray: `#F1F1F1`  
  - Light blue: `#D9F4FF`  

#### Header
- **Logo:** Centered at the top, full color, with "Souq Maria" in both English and Arabic.
- **Cart icon:** Top right, black (`#000000`), with a badge for item count (if any).
- **Search bar:**  
  - Full width, rounded corners, white background (`#FFFFFF`), subtle shadow.
  - Placeholder text: "Search Products" (gray, `#D9D9D9`).
  - Search icon on the left (blue, `#00AEEF`).

#### Shop By Category
- **Section title:** "Shop By Category" (bold, black, `#000000`), left-aligned.
- **Category cards:**  
  - Horizontally scrollable row.
  - Each card:  
    - Rounded rectangle, white background (`#FFFFFF`), subtle shadow.
    - Category image (centered, square).
    - Category name (below image, black, `#000000`).
    - Example categories: Mobiles, Tablets, Accessories, Headphones, etc.

#### Featured Banners/Carousels
- **Carousel:**  
  - Horizontally scrollable, full width.
  - Each banner:  
    - Rounded corners, white background (`#FFFFFF`).
    - Product images (colorful, as per category).
    - Subtle shadow for elevation.

#### Bottom Navigation Bar
- **Background:** White (`#FFFFFF`), shadow on top.
- **Tabs:**  
  - Home (black icon, `#000000`)
  - Categories (black icon, `#000000`)
  - Cart (black icon, `#000000`)
  - Account (black icon, `#000000`)
- **Active tab:** Icon and label in blue (`#00AEEF`), others in black (`#000000`).
- **Labels:** Below icons, all caps, small font.

#### Spacing & Borders
- **Card and section spacing:** 12–16px between elements.
- **Rounded corners:** 12px on cards and banners.
- **Dividers:** Thin, light gray (`#D9D9D9`).

#### Example Layout Flow
1. **Header:** Logo, cart icon, search bar.
2. **Shop By Category:** Horizontal scroll of category cards.
3. **Featured Banners/Carousels:** Horizontal scroll of promotional banners.
4. **Bottom Navigation Bar:** Home, Categories, Cart, Account.

#### Browse Drawer (Homepage)
- **Trigger:**
  - User taps the menu/browse icon (top left or as a floating button on the homepage).
- **Drawer position:**
  - Slides from the left, positions in the center of the screen with margin on all four sides.
  - Background overlay: Fullscreen, blurred (frosted glass effect), darkens the rest of the UI.
- **Drawer background:** White (`#FFFFFF`), rounded corners (16px) on top.
- **Close button:** Top right of drawer, black (`#000000`), circular with an 'X' icon.
- **Section title:** Centered at the top, bold, black (`#000000`), text: "Browse".
- **Divider:** Thin, light gray (`#D9D9D9`), below the title.
- **Category sections:**
  - Each main category (e.g., Mobile, Tablet, Accessories) is a section header:
    - Black (`#000000`), bold, larger font, left-aligned, with spacing above and below.
  - Under each header, a list of product names:
    - Product name: Blue (`#00AEEF`), left-aligned, regular font, touchable (navigates to product page).
    - Spacing: 8px between product names.
- **Scrolling:**
  - Drawer content is vertically scrollable if content exceeds visible area.
- **Touch feedback:**
  - Tapping a product name highlights it with a very light gray background (`#F1F1F1`).

#### Example Flow
1. User taps the browse/menu icon on the homepage.
2. Drawer slides up from the bottom, background blurs.
3. User sees category headers and product names.
4. User taps a product name to navigate to its product page.
5. User can close the drawer by tapping the 'X' icon or outside the drawer area.

---

### 2. All Products Page (Category Listing)

#### General
- **Background color:** `#FFFFFF` (white)
- **Top bar:** Light blue background (`#D9F4FF`), with back arrow (left), search bar (center), and cart icon (right).
- **Primary accent colors:**
  - Green: `#8DC63F`
  - Blue: `#00AEEF`
  - Black: `#000000`
  - Light gray: `#D9D9D9`
  - Very light gray: `#F1F1F1`
  - Light blue: `#D9F4FF`

#### Header
- **Back arrow:** Left, black (`#000000`), for navigation.
- **Search bar:**
  - Centered, rounded corners, white background (`#FFFFFF`), subtle shadow.
  - Placeholder text: current search term or "Search Products" (gray, `#D9D9D9`).
  - Search icon on the left (blue, `#00AEEF`).
- **Cart icon:** Top right, black (`#000000`), with badge for item count (if any).

#### Filter & Sort Bar
- **Background:** Transparent (over `#D9F4FF`).
- **Filter buttons:**
  - "Sort By", "Category", "Price", "Brand"
  - Each button: Rounded, white background (`#FFFFFF`), border (`#D9D9D9`), text in black (`#000000`).
  - Active/selected filter: Blue border (`#00AEEF`), blue text (`#00AEEF`).
  - Spacing: 8px between buttons.

#### Results Info
- **Text:** "1-20 Of Over 11 Results" (black, `#000000`), left-aligned, small font.

#### Product Grid/List
- **Layout:** 2-column grid, each product in a card.
- **Product card:**
  - Background: White (`#FFFFFF`), rounded corners (12px), subtle shadow.
  - Product image: Top, centered, square.
  - Product name: Below image, bold, black (`#000000`), 2 lines max, ellipsis if overflow.
  - Old price: Gray, strikethrough, small font (`#D9D9D9`).
  - New price: Blue, bold (`#00AEEF`), larger font.
  - Spacing: 12px between cards.

#### Scrolling
- **Vertical scroll:** Full page scrolls, filter bar remains sticky at top.

#### Bottom Navigation Bar
- Same as homepage (see above).

### 3. Filter & Sort Modals

When a user clicks on any filter or sort button (Brand, Category, Price, Sort By) on the All Products Page, a modal slides up from the bottom of the screen. The rest of the app background is blurred (frosted glass effect) to focus attention on the modal.

#### General Modal Layout
- **Modal position:** Slides up from the bottom, covers about 50% of the screen height.
- **Background overlay:** Fullscreen, blurred (frosted glass effect), darkens the rest of the UI.
- **Modal background:** White (`#FFFFFF`), rounded top corners (16px).
- **Close button:** Top right of modal, black (`#000000`), circular with an 'X' icon.
- **Section title:** Centered at the top, bold, all caps, black (`#000000`).
- **Divider:** Thin, light gray (`#D9D9D9`), below the title.
- **List items:**
  - White background (`#FFFFFF`), separated by thin light gray dividers (`#D9D9D9`).
  - Selected/active item: Blue text (`#00AEEF`) and green checkmark (`#8DC63F`).
  - Unselected item: Black text (`#000000`), gray radio or no checkmark.
  - Section headers (e.g., "FACE", "BODY"): Black, bold, all caps, smaller font.
- **Touch feedback:** Tapping an item highlights it and updates the selection.

#### Brand Filter Modal
- **Title:** "BRAND"
- **List:**
  - Each brand is a row with:
    - Brand name: Black (`#000000`) if unselected, blue (`#00AEEF`) if selected.
    - Green checkmark (`#8DC63F`) for selected brands.
    - Unselected: gray radio or no icon.
  - Multiple brands can be selected (multi-select).

#### Category Filter Modal
- **Title:** "CATEGORY"
- **Section headers:** (e.g., "FACE", "BODY")
  - Black, bold, all caps, smaller font.
- **List:**
  - Each category is a row with:
    - Category name: Black (`#000000`) if unselected, blue (`#00AEEF`) if selected.
    - Green checkmark (`#8DC63F`) for selected category.
    - Unselected: no icon.
  - Only one category can be selected at a time (single-select).

#### Price Filter Modal
- **Title:** "PRICE"
- **Slider:**
  - Range slider with min and max values.
  - Track: Light gray (`#D9D9D9`), selected range in green (`#8DC63F`).
  - Thumb: Black (`#000000`), circular.
  - Min, max, and current values: Black (`#000000`), blue (`#00AEEF`) for selected value.
- **Selected range:** Displayed above the slider in black (`#000000`).

#### Sort By Modal
- **Title:** "SORT BY"
- **List:**
  - Each sort option is a row with:
    - Option name: Black (`#000000`) if unselected, blue (`#00AEEF`) if selected.
    - Green checkmark (`#8DC63F`) for selected option.
    - Unselected: no icon.
  - Only one sort option can be selected at a time (single-select).

#### Spacing & Borders
- **Row height:** 48px per item.
- **Section spacing:** 12px between sections.
- **Rounded corners:** 16px on modal top, 0px on bottom.
- **Dividers:** Thin, light gray (`#D9D9D9`).

#### Example Flow
1. User taps a filter/sort button.
2. Modal slides up from the bottom, background blurs.
3. User selects/deselects options.
4. User taps outside modal or close button to dismiss.
5. Filter/sort is applied to product list.

---

### 3. Individual Product Page

#### General
- **Background color:** `#FFFFFF` (white)
- **Top bar:** White background (`#FFFFFF`), with back arrow (left), cart icon (right).
- **Primary accent colors:**
  - Green: `#8DC63F`
  - Blue: `#00AEEF`
  - Black: `#000000`
  - Light gray: `#D9D9D9`
  - Very light gray: `#F1F1F1`
  - Light blue: `#D9F4FF`

#### Header
- **Back arrow:** Left, black (`#000000`), for navigation.
- **Cart icon:** Top right, black (`#000000`), with badge for item count (if any).

#### Product Image
- **Large product image:** Centered, square, with white background (`#FFFFFF`), subtle shadow, rounded corners (12px).

#### Product Info
- **Product title:** Bold, black (`#000000`), all caps, large font.
- **Barcode:** Small, gray (`#D9D9D9`), above title.
- **Short description:** Black (`#000000`), regular font, below title. Truncated with "Read More" if long.
- **Old price:** Gray, strikethrough, small font (`#D9D9D9`).
- **New price:** Blue, bold (`#00AEEF`), larger font, below old price.

#### Quantity Selector & Actions
- **Quantity selector:**
  - Below of "Add to Cart" button and left of "Buy Now" button.
  - White background (`#FFFFFF`), black border (`#000000`), rounded corners (8px).
  - Plus/minus buttons: Black (`#000000`), centered.
  - Quantity number: Black (`#000000`).
- **Add to Cart button:**
  - Full width, blue background (`#00AEEF`), white text, bold, rounded corners (12px), large font.
  - Icon: Cart, white.
- **Buy Now button:**
  - Half width width, black background (`#000000`), white text, bold, rounded corners (12px), large font.
  - Icon: Lightning bolt or similar, white.
  - Positioned below "Add to Cart" button, with 8px spacing.

#### Product Details
- **Section title:** "DESCRIPTION" (black, `#000000`), all caps, bold.
- **Description text:** Black (`#000000`), regular font, left-aligned.
- **Divider:** Thin, light gray (`#D9D9D9`), above section.

#### Spacing & Borders
- **Card and section spacing:** 12–16px between elements.
- **Rounded corners:** 12px on cards and buttons.
- **Dividers:** Thin, light gray (`#D9D9D9`).

#### Bottom Navigation Bar
- Same as homepage (see above).

---

### 4. Add to Cart Success Modal

When a user clicks the "Add to Cart" button on the individual product page, a success modal appears in the center of the screen, confirming the action.

#### General
- **Modal position:** Centered on the screen, overlays the current page.
- **Modal background:** White (`#FFFFFF`), rounded corners (16px), subtle shadow for elevation.
- **Overlay:** The rest of the app is dimmed with a semi-transparent black overlay (`rgba(0,0,0,0.4)`).

#### Modal Content
- **Success icon:** Centered at the top, circular, blue checkmark (`#00AEEF`) on white background.
- **Product name:** Bold, black (`#000000`), all caps, centered, large font.
- **Success message:** "Added to your cart successfully." in green (`#8DC63F`), centered, regular font.
- **Action buttons:**
  - **View Cart:** Left button, blue text (`#00AEEF`), white background (`#FFFFFF`), bold, all caps, no border.
  - **Checkout:** Right button, blue text (`#00AEEF`), white background (`#FFFFFF`), bold, all caps, no border.
  - Both buttons are horizontally aligned, separated by a thin divider (`#D9D9D9`).
  - Tapping either button closes the modal and navigates to the respective screen.

#### Spacing & Borders
- **Modal padding:** 24px all around.
- **Button height:** 44px.
- **Rounded corners:** 16px on modal, 0px on buttons.
- **Dividers:** Thin, light gray (`#D9D9D9`) between buttons.

#### Example Flow
1. User taps "Add to Cart".
2. Modal appears, overlay dims the background.
3. User sees product name and success message.
4. User can tap "View Cart" to go to the cart, or "Checkout" to go directly to checkout.
5. Modal closes and navigates accordingly.

---

### 5. Categories Page & Search Suggestions

#### Categories Page (Categories Tab)
- **Background color:** `#FFFFFF` (white)
- **Top bar:**
  - Title: "Categories" in blue (`#00AEEF`), bold, left-aligned.
  - Cart icon: Top right, black (`#000000`), with badge for item count (if any).
- **Search bar:**
  - Full width, rounded corners, white background (`#FFFFFF`), subtle shadow.
  - Placeholder text: "What are you looking for?" (gray, `#D9D9D9`).
  - Search icon on the left (blue, `#00AEEF`).
- **Category grid:**
  - 2-column grid layout.
  - Each category card:
    - White background (`#FFFFFF`), rounded corners (12px), subtle shadow.
    - Category image: Centered, square.
    - Category name: Black (`#000000`), bold, centered, with Arabic translation below in smaller font, gray (`#D9D9D9`).
    - Spacing: 16px between cards.
- **Bottom Navigation Bar:**
  - Same as homepage, with "Categories" tab highlighted in blue (`#00AEEF`), others in black (`#000000`).

#### Search Suggestions Dropdown
- **Trigger:**
  - When user types in the search bar (on any page with a search bar), a dropdown appears below the search bar with product suggestions.
- **Dropdown background:** White (`#FFFFFF`), rounded corners (12px), subtle shadow, overlays the rest of the UI.
- **Suggestion items:**
  - Each row: Search icon (black, `#000000`), product name in blue (`#00AEEF`), left-aligned.
  - Row height: 40px, with 8px spacing between rows.
  - Touch feedback: Row background changes to very light gray (`#F1F1F1`) on tap.
- **No results:** If no suggestions, show "No products found" in gray (`#D9D9D9`), centered.

#### Example Flow
1. User taps "Categories" tab in bottom nav bar.
2. Categories page opens, showing grid of categories with images and names.
3. User types in the search bar; suggestions dropdown appears with matching products.
4. User taps a suggestion to go to the product page.

---

### 6. Cart Tab

#### Empty Cart
- **Background color:** Very light gray (`#F1F1F1`)
- **Top bar:**
  - Title: "My Cart" in blue (`#00AEEF`), bold, left-aligned.
- **Cart icon:** Centered, large, blue (`#00AEEF`), with badge for item count (if any).
- **Empty message:**
  - Text: "Your Cart is Empty" in black (`#000000`), centered, regular font.
- **Add Items button:**
  - Centered, full width, black background (`#000000`), white text, bold, rounded corners (8px).
  - Green plus icon (`#8DC63F`) on the left.
  - Button text: "Add Items".
  - Tapping navigates to product/category selection.
- **Bottom Navigation Bar:**
  - Same as homepage, with "Cart" tab highlighted in blue (`#00AEEF`), others in black (`#000000`).

#### Cart with Products
- **Background color:** Very light gray (`#F1F1F1`)
- **Top bar:**
  - Title: "My Cart" in blue (`#00AEEF`), bold, left-aligned.
- **Product list:**
  - Each product in a card with white background (`#FFFFFF`), rounded corners (12px), subtle shadow, margin between cards.
  - Product image: Left, square.
  - Product name: Black (`#000000`), bold, 2 lines max, ellipsis if overflow.
  - Old price: Gray, strikethrough, small font (`#D9D9D9`).
  - New price: Blue, bold (`#00AEEF`), larger font.
  - Quantity selector: Right side, plus/minus buttons (black, `#000000`), white background, black border, rounded corners (8px), quantity in black.
  - "Add to Wishlist" link: Black (`#000000`), under product info, left-aligned, regular font.
  - "Remove" link: Red (`#FF0000`), right-aligned, bold, touchable.
- **Cart summary bar:**
  - Fixed at bottom, white background (`#FFFFFF`), top border (`#D9D9D9`).
  - "TOTAL" label: Black (`#000000`), bold, left-aligned.
  - Total price: Blue (`#00AEEF`), bold, right-aligned.
  - "CHECKOUT" button: Blue background (`#00AEEF`), white text, bold, all caps, rounded corners (8px), right-aligned.
  - Tapping "CHECKOUT" navigates to checkout flow.
- **Bottom Navigation Bar:**
  - Same as homepage, with "Cart" tab highlighted in blue (`#00AEEF`), others in black (`#000000`).

#### Delete Item from Cart Modal
- **Modal position:** Centered on the screen, overlays the current page.
- **Modal background:** White (`#FFFFFF`), rounded corners (16px), subtle shadow for elevation.
- **Overlay:** The rest of the app is dimmed with a semi-transparent black overlay (`rgba(0,0,0,0.4)`).
- **Modal content:**
  - Title: "Remove item from Cart?" in black (`#000000`), bold, centered.
  - Product name: Black (`#000000`), bold, centered, 2 lines max, ellipsis if overflow.
  - Action buttons:
    - "CANCEL": Left button, black text (`#000000`), white background (`#FFFFFF`), bold, all caps, no border.
    - "YES, REMOVE": Right button, red text (`#FF0000`), white background (`#FFFFFF`), bold, all caps, no border.
    - Both buttons are horizontally aligned, separated by a thin divider (`#D9D9D9`).
    - Tapping either button closes the modal and performs the respective action.
- **Spacing & Borders:**
  - Modal padding: 24px all around.
  - Button height: 44px.
  - Rounded corners: 16px on modal, 0px on buttons.
  - Dividers: Thin, light gray (`#D9D9D9`) between buttons.

#### Example Flow
1. User taps "Cart" tab in bottom nav bar.
2. If cart is empty, empty cart screen is shown with "Add Items" button.
3. If cart has products, product list and summary bar are shown.
4. User can adjust quantity, add to wishlist, or remove items.
5. Tapping "Remove" opens the delete item modal for confirmation.
6. User can checkout from the summary bar.

---

### 7. Checkout Flow

#### General
- **Checkout is presented as a modal drawer** that slides up from the bottom, overlaying the current screen. The background is dimmed with a semi-transparent black overlay (`rgba(0,0,0,0.4)`).
- **Drawer background:** White (`#FFFFFF`), rounded top corners (16px), subtle shadow for elevation.
- **Close button:** Top right, black (`#000000`), circular with an 'X' icon.
- **Section title:** Centered at the top, bold, black (`#000000`), text: "Checkout".
- **Divider:** Thin, light gray (`#D9D9D9`), below the title.

#### 1. Guest Checkout (Browsing as Guest)
- **Cart summary:**
  - Horizontal scroll of product cards at the top, each with image, name, quantity, and price.
  - Remove icon (black, `#000000`) on each card to remove item from cart.
- **Address section:**
  - Title: "Address" in black (`#000000`), bold.
  - "+ Add Address" button: Blue text (`#00AEEF`), right-aligned, touchable.
  - If no address, prompts user to add one.
- **Promo code section:**
  - Title: "Have a Promo Code?" in black (`#000000`), left-aligned.
  - "See Promo Codes" link: Blue (`#00AEEF`), right-aligned, touchable.
  - Input field: White background (`#FFFFFF`), black border (`#000000`), rounded corners (8px), placeholder in gray (`#D9D9D9`).
  - "Apply" button: Black background (`#000000`), white text, bold, rounded corners (8px), right-aligned.
- **Payment type section:**
  - Title: "Select Payment Type" in black (`#000000`), bold.
  - Only one option: "CASH" (black, `#000000`), with payment icons (Visa, MasterCard, Knet, etc.) in color.
- **Order summary:**
  - Item Sub total, Discount, Shipping Fee, Grand Total: All right-aligned, black (`#000000`), blue (`#00AEEF`) for Grand Total.
- **Account creation prompt:**
  - "Create an Account?" link: Blue (`#00AEEF`), left-aligned, touchable.
- **Place Order button:**
  - Small text above the button: "By proceeding, I've read and accept the terms & conditions." in black (`#000000`).
  - Full width, blue background (`#00AEEF`), white text, bold, all caps, rounded corners (8px), centered at the bottom.
- **Returning customer prompt:**
  - Text below the place order button: "Are you a returning customer?" in black (`#000000`), "Login Here" in blue (`#00AEEF`), touchable.

#### 2. Returning Customer (Login Modal)
- **Tabs:**
  - "Login" (active, black `#000000`), "Sign up" (inactive, gray `#D9D9D9`), both bold, centered at the top.
- **Google sign-in:**
  - "Auto SIGN-IN using Google Email" in black (`#000000`), left-aligned.
  - "Sign in with Google" button: White background (`#FFFFFF`), Google logo, black text, rounded corners (8px), full width.
- **Divider:** "OR" in gray (`#D9D9D9`), centered.
- **Login form:**
  - Input fields: White background (`#FFFFFF`), black border (`#000000`), rounded corners (8px), placeholder in gray (`#D9D9D9`).
    - Email/Mobile
    - Password
  - "Forgot Password?" link: Blue (`#00AEEF`), right-aligned, touchable.
  - "Login" button: Full width, blue background (`#00AEEF`), white text, bold, rounded corners (8px), centered.
  - "Create Account?" link: Blue (`#00AEEF`), centered, touchable.

#### 3. New Customer (Sign Up Modal)
- **Tabs:**
  - "Login" (inactive, gray `#D9D9D9`), "Sign up" (active, black `#000000`), both bold, centered at the top.
- **Google sign-up:**
  - "Auto SIGN-UP using Google Email" in black (`#000000`), left-aligned.
  - "Sign in with Google" button: White background (`#FFFFFF`), Google logo, black text, rounded corners (8px), full width.
- **Divider:** "OR" in gray (`#D9D9D9`), centered.
- **Sign up form:**
  - Input fields: White background (`#FFFFFF`), black border (`#000000`), rounded corners (8px), placeholder in gray (`#D9D9D9`).
    - Full Name
    - Email
    - Mobile
    - Password
  - "Sign up" button: Full width, blue background (`#00AEEF`), white text, bold, rounded corners (8px), centered.
  - "Already have account? Login" link: Blue (`#00AEEF`), centered, touchable.

#### Spacing & Borders
- **Modal padding:** 24px all around.
- **Button height:** 44px.
- **Rounded corners:** 16px on modal, 8px on buttons.
- **Dividers:** Thin, light gray (`#D9D9D9`).

#### Example Flow
1. User taps "Checkout" from cart.
2. If not logged in, checkout modal appears with guest checkout by default.
3. User can:
   - Enter address, promo code, and place order as guest.
   - Tap "Login Here" to open login modal.
   - Tap "Create an Account?" to open sign up modal.
4. Returning customers log in and proceed.
5. New customers can sign up and proceed.
6. All actions are performed within the modal drawer, which can be closed at any time.

---

### 8. Account Tab

#### Account Tab (Guest / Pre-Login)
- **Background color:** White (`#FFFFFF`)
- **Top bar:**
  - Title: "Account" in blue (`#00AEEF`), bold, left-aligned.
- **Language selector:**
  - Row with language icon (black, `#000000`), label "Language" (black, `#000000`), and current language (blue, `#00AEEF`), right-aligned.
  - "Tap to change" in blue (`#00AEEF`), touchable.
  - Divider below row: Thin, light gray (`#D9D9D9`).
- **Illustration:**
  - Centered, colorful illustration related to shopping/account.
  - Below illustration: Text in blue (`#00AEEF`), centered, "To get the best experience of shopping you can".
- **Login/Register button:**
  - Centered, full width, black background (`#000000`), white text, bold, rounded corners (8px).
  - Button text: "Login / Register".
  - Tapping opens login/signup modal.
- **Bottom Navigation Bar:**
  - Same as homepage, with "Account" tab highlighted in blue (`#00AEEF`), others in black (`#000000`).

#### Account Tab (Logged-In User)
- **Background color:** White (`#FFFFFF`)
- **Top bar:**
  - Title: "Account" in blue (`#00AEEF`), bold, left-aligned.
- **Language selector:**
  - Row with language icon (black, `#000000`), label "Language" (black, `#000000`), and current language (blue, `#00AEEF`), right-aligned.
  - "Tap to change" in blue (`#00AEEF`), touchable.
  - Divider below row: Thin, light gray (`#D9D9D9`).
- **Account options list:**
  - Each option is a row with icon (black, `#000000`), label (black, `#000000`), right arrow (gray, `#D9D9D9`), and divider below.
    - My Details
    - My Address
    - My Orders
    - Wishlist
    - Policies
  - Rows are touchable and navigate to respective screens.
- **Logout button:**
  - Full width, red background (`#FF0000`), white text, bold, rounded corners (8px), centered.
  - Button text: "Logout".
  - Tapping logs the user out and returns to guest state.
- **Social links:**
  - "FOLLOW US" in black (`#000000`), centered, small font.
  - Social media icons (black, `#000000`), horizontally aligned, touchable, open respective social pages.
- **Bottom Navigation Bar:**
  - Same as homepage, with "Account" tab highlighted in blue (`#00AEEF`), others in black (`#000000`).

#### Example Flow
1. User taps "Account" tab in bottom nav bar.
2. If not logged in, guest account screen is shown with language selector, illustration, and login/register button.
3. If logged in, account options list, logout button, and social links are shown.
4. User can change language, view/edit details, addresses, orders, wishlist, policies, or logout.

### 9. Account Tab: Subpages

#### 1. My Details
- **Background color:** White (`#FFFFFF`)
- **Top bar:**
  - Light blue background (`#D9F4FF`), back arrow (black, `#000000`), title "Details" in blue (`#00AEEF`), bold, centered.
- **Details form (view mode):**
  - Four input fields (Full Name, Email, Mobile, Password):
    - White background (`#FFFFFF`), gray border (`#D9D9D9`), rounded corners (8px), black text (`#000000`).
    - Email and password fields are grayed out and not editable (gray background `#F1F1F1`, gray text `#D9D9D9`).
    - Password field shows masked value (••••••••).
  - **Edit Details button:**
    - Full width, blue background (`#00AEEF`), white text, bold, rounded corners (8px), centered.
    - Pencil icon (white) on the left.
    - Tapping enables edit mode.
- **Details form (edit mode):**
  - Editable fields: Full Name, Mobile, Password (Email remains grayed out).
  - Active input: Black border (`#000000`), blue text (`#00AEEF`).
  - **Save button:**
    - Full width, green background (`#8DC63F`), white text, bold, rounded corners (8px), centered.
    - Tapping saves changes and returns to view mode.

#### 2. My Addresses
- **Background color:** White (`#FFFFFF`)
- **Top bar:**
  - Light blue background (`#D9F4FF`), back arrow (black, `#000000`), title "Address" in blue (`#00AEEF`), bold, centered.
- **Address list (if no addresses):**
  - Two large buttons:
    - "+ Add Billing Address" and "+ Add Shipping Address"
    - Light gray background (`#F1F1F1`), dashed border (`#D9D9D9`), black text (`#000000`), rounded corners (8px), full width.
    - Tapping opens address adding screen.
- **Address adding/editing screen:**
  - Form fields: Name, Email, Mobile, Country (dropdown), City (dropdown), Area, Block, Street, House/Building, Apartment No., Address line 2.
  - Input fields: White background (`#FFFFFF`), black border (`#000000`), rounded corners (8px), black text (`#000000`).
  - Dropdowns: White background, black border, blue text (`#00AEEF`) for selected value.
  - **Set as default:** Checkbox (blue when checked, `#00AEEF`), black border, left-aligned.
  - **Save button:**
    - Full width, blue background (`#00AEEF`), white text, bold, rounded corners (8px), centered.
- **Address list (with addresses):**
  - Each address in a card:
    - White background (`#FFFFFF`), rounded corners (8px), subtle shadow, margin between cards.
    - Address type (Billing/Shipping) in bold, black (`#000000`).
    - Address details: Black (`#000000`), smaller font.
    - **Edit Address button:** Green text (`#8DC63F`), pencil icon, left-aligned, touchable.
    - **Default badge:** Green circle (`#8DC63F`), white checkmark, right-aligned, small font.

#### 3. My Orders
- **Background color:** White (`#FFFFFF`)
- **Top bar:**
  - Light blue background (`#D9F4FF`), back arrow (black, `#000000`), title "Orders" in blue (`#00AEEF`), bold, centered.
  - Search icon (black, `#000000`), right-aligned.
- **Order list:**
  - Each order in a card:
    - White background (`#FFFFFF`), rounded corners (8px), subtle shadow, margin between cards.
    - Product image: Left, square.
    - Product name: Blue (`#00AEEF`), bold, left-aligned.
    - Order details: Black (`#000000`), smaller font, left-aligned.
      - Order No, Date, Sub total, Discount, Shipping Fee, Order Total.
    - If multiple items: "More X items in this order" in black, smaller font.

#### 4. Wishlist
- **Background color:** White (`#FFFFFF`)
- **Top bar:**
  - Light blue background (`#D9F4FF`), back arrow (black, `#000000`), title "Wishlist" in blue (`#00AEEF`), bold, centered.
- **Wishlist list:**
  - Each product in a card:
    - White background (`#FFFFFF`), rounded corners (8px), subtle shadow, margin between cards.
    - Product image: Right, square.
    - Product name: Black (`#000000`), bold, left-aligned, 2 lines max, ellipsis if overflow.
    - Old price: Gray, strikethrough, small font (`#D9D9D9`).
    - New price: Blue, bold (`#00AEEF`), larger font.
    - **Remove link:** Red (`#FF0000`), right-aligned, bold, touchable.

#### 5. Policies
- **Background color:** White (`#FFFFFF`)
- **Top bar:**
  - Light blue background (`#D9F4FF`), back arrow (black, `#000000`), title "Policies" in blue (`#00AEEF`), bold, centered.
- **Policies list:**
  - Each policy in a card/button:
    - Light gray background (`#F1F1F1`), dashed border (`#D9D9D9`), black text (`#000000`), rounded corners (8px), full width.
    - Policy name: Black (`#000000`), left-aligned.
    - External link icon: Black (`#000000`), right-aligned.
    - Tapping opens policy in webview or external browser.
- **Spacing & Borders:**
  - Card and section spacing: 16px between elements.
  - Rounded corners: 8px on cards and buttons.
  - Dividers: Thin, light gray (`#D9D9D9`).

#### Example Flow
1. User navigates to Account tab and selects a subpage (Details, Addresses, Orders, Wishlist, Policies).
2. Each subpage follows the above layout and color scheme.
3. User can view/edit details, manage addresses, view orders, manage wishlist, and view company policies.

# Example eCommerce App File Structure

```
mobile-app
├── app.json
├── App.tsx
├── assets
│   ├── categories.tsx
│   ├── icon.png
│   ├── images
│   │   ├── fragrance-1.png
│   │   ├── fragrance-2.png
│   │   ├── fragrance-hero.png
│   │   ├── makeup-1.png
│   │   ├── makeup-2.png
│   │   ├── nail-care-1.png
│   │   ├── nail-care-2.png
│   │   ├── nail-care-3.png
│   │   ├── nail-care-hero.png
│   │   └── splash.png
│   ├── orders.ts
│   ├── products.ts
│   └── types
│       ├── category.ts
│       ├── order.ts
│       └── product.ts
├── babel.config.js
├── cookies.txt
├── eas.json
├── index.ts
├── instructions
│   ├── instructions.md
│   └── UI 
│       ├── account
│       │   ├── add-address-new.png
│       │   ├── add-edit-address.png
│       │   ├── all-addresses-page.png
│       │   ├── auth-user-acc-page.png
│       │   ├── my-details-page.png
│       │   ├── my-orders-display.png
│       │   └── unauth-user-acc-page.png
│       ├── api-examples
│       │   ├── edit-address.png
│       │   └── ocsessid-example.png
│       ├── authentication
│       │   ├── forgot-pass-page.png
│       │   ├── sign-in-page.png
│       │   └── sign-up page.png
│       ├── cart
│       │   ├── cart-delete-item.png
│       │   ├── cart-empty.png
│       │   └── cart-with-products.png
│       ├── checkout
│       │   ├── checkout-no-saved-address.png
│       │   ├── checkout-with-address.png
│       │   ├── order-failure-page.png
│       │   └── order-success-page.png
│       ├── homepage
│       │   ├── homepage-first-screen.png
│       │   └── homepage-second-screen.png
│       ├── language
│       │   └── language-selection-splash.png
│       ├── product-page
│       │   ├── all-products-page.png
│       │   └── individual-product-page.png
│       ├── search
│       │   ├── search-product-example.png
│       │   └── search-product.png
│       └── splash
│           └── splash.png
├── package-lock.json
├── package.json
├── src
│   ├── app
│   │   ├── _layout.tsx
│   │   ├── (shop)
│   │   │   ├── _layout.tsx
│   │   │   ├── account.tsx
│   │   │   ├── cart.tsx
│   │   │   ├── index.tsx
│   │   │   └── search.tsx
│   │   ├── +not-found.tsx
│   │   ├── account
│   │   │   ├── address
│   │   │   │   └── index.tsx
│   │   │   ├── details
│   │   │   │   └── index.tsx
│   │   │   └── language
│   │   │       └── index.tsx
│   │   ├── auth.tsx
│   │   ├── categories
│   │   │   ├── _layout.tsx
│   │   │   └── [slug].tsx
│   │   ├── checkout
│   │   │   ├── _layout.tsx
│   │   │   └── index.tsx
│   │   ├── forgot-password.tsx
│   │   ├── language-selection
│   │   │   └── index.tsx
│   │   ├── orders
│   │   │   ├── _layout.tsx
│   │   │   ├── [slug].tsx
│   │   │   └── index.tsx
│   │   ├── product
│   │   │   ├── _layout.tsx
│   │   │   ├── [slug].tsx
│   │   │   └── index.tsx
│   │   └── signup.tsx
│   ├── assets
│   │   ├── americanexpress.png
│   │   ├── mastercard.png
│   │   ├── types
│   │   │   ├── category.ts
│   │   │   └── product.ts
│   │   └── visa.png
│   ├── components
│   │   ├── add-edit-address.tsx
│   │   ├── AddressModal.tsx
│   │   ├── AddressSelectionModal.tsx
│   │   ├── custom-splash-screen.tsx
│   │   ├── edit-user-details.tsx
│   │   ├── language-selection.tsx
│   │   └── product-list-item.tsx
│   ├── screens
│   │   └── language-screen.tsx
│   ├── store
│   │   ├── address-store.ts
│   │   ├── auth-store.ts
│   │   ├── cart-store.ts
│   │   ├── language-store.ts
│   │   └── order-store.ts
│   ├── theme.ts
│   ├── types
│   │   └── api.ts
│   └── utils
│       ├── api-config.ts
│       ├── api-docs-test.ts
│       ├── api-service.ts
│       ├── cities.ts
│       ├── format-price.ts
│       ├── price-formatter.ts
│       └── translations.ts
└── tsconfig.json
```

The above structure is a clear example of how the file structure and file names should look like. 

# Current Structure

mobile-app-sm
├── app.json
├── App.tsx
├── assets
│   ├── icon.png
│   ├── logo.png
│   ├── order_failed_image.png
│   ├── order_succesful_image.png
│   └── pre_login_account.png
├── babel.config.js
├── eas.json
├── index.ts
├── instructions
│   ├── instructions.md
│   ├── reference_instructions.md
│   └── UI
│       ├── account
│       │   ├── account_pre_login.png
│       │   ├── account_with_login.png
│       │   ├── my_addresses
│       │   │   ├── add_address.png
│       │   │   ├── address_adding_screen.png
│       │   │   └── edit_address.png
│       │   ├── my_details
│       │   │   ├── edit_details.png
│       │   │   └── my_details.png
│       │   ├── my_orders.png
│       │   ├── policies
│       │   │   └── company_details.png
│       │   └── wishlist.png
│       ├── cart
│       │   ├── cart_delete_item.png
│       │   ├── cart_with_products.png
│       │   └── empty_cart.png
│       ├── categories
│       │   ├── all_categories_page.png
│       │   ├── browse_drawer.png
│       │   └── search_products.png
│       ├── checkout
│       │   ├── change_select_address.png
│       │   ├── guest
│       │   │   └── guest_checkout.png
│       │   ├── login
│       │   │   └── login.png
│       │   ├── order_failure.png
│       │   ├── order_success.png
│       │   ├── post_login_checkout.png
│       │   └── signup
│       │       └── signup.png
│       ├── homepage.png
│       ├── product_pages
│       │   ├── addtocart_success.png
│       │   ├── all_products_page.png
│       │   ├── brand_filter.png
│       │   ├── category_filter.png
│       │   ├── individual_product_page.png
│       │   ├── price_filter.png
│       │   └── sort_by.png
│       └── splash.png
├── package-lock.json
├── package.json
├── src
│   ├── app
│   │   ├── (shop)
│   │   │   ├── _layout.tsx
│   │   │   ├── account
│   │   │   │   ├── _layout.tsx
│   │   │   │   └── details
│   │   │   ├── account.tsx
│   │   │   ├── cart.tsx
│   │   │   ├── index.tsx
│   │   │   └── search.tsx
│   │   ├── +not-found.tsx
│   │   ├── auth.tsx
│   │   └── signup.tsx
│   ├── screens
│   │   └── account
│   │       └── AccountScreen.tsx
│   ├── store
│   │   └── auth-store.ts
│   ├── theme.ts
│   └── utils
│       ├── api-config.ts
│       ├── api-service.ts
│       └── login-debug.js
└── tsconfig.json



# API Documentation

## API Overview
This section contains detailed documentation for all API endpoints used in the SouqMaria mobile application. It serves as the single source of truth for API integration, covering request formats, response structures, error handling, and implementation details.

Test Creds: 
email: hussain@test.com
password: Test@786110

### Base API Information

| Item | Value | Description |
|------|-------|-------------|
| Base URL | `https://api.souqmaria.com/api/MerpecWebApi/` | The base URL for all API requests |
| Company Id | `3044` | Fixed identifier used across all requests |
| Culture Id | `1` for English, `2` for Arabic | Used to return localized content |
| Location | `304401HO` | Fixed location identifier |
| Salesman | `3044SMOL` | Fixed salesman identifier |

All API requests should include these common parameters unless otherwise specified.

### Authentication & User Management APIs

#### User Registration

This API endpoint allows new users to register with the SouqMaria application.

**Endpoint:**
```
POST https://api.souqmaria.com/api/MerpecWebApi/SaveUserRegistration/
```

**Request Parameters:**

| # | Parameter | Type | Length | Description | Required |
|---|-----------|------|--------|-------------|----------|
| 1 | FullName | String | 128 | User's full name | Yes |
| 2 | Email | String | 72 | User's email address | Yes |
| 3 | Mobile | String | 16 | User's mobile number | Yes |
| 4 | Password | String | 48 | User's password | Yes |
| 5 | IpAddress | String | 128 | User's IP address (obtained from device) | Yes |
| 6 | Source | String | 10 | Device type ("Android"/"iOS") | Yes |
| 7 | CompanyId | String | - | Company identifier (fixed: "3044") | Yes |

**Response Structure:**

```json
{
  "statusCode": 200,  // HTTP status code
  "responseCode": 2,  // Application-specific response code
  "message": "User registered successfully",  // Response message
  "data": {}  // Optional additional data
}
```

**Response Codes:**

| StatusCode | ResponseCode | Meaning |
|------------|--------------|---------|
| 200 | 2 | User Registration Successful |
| 200 | -2 | User Registration Not Successful |
| 200 | -4 | User Already Registered (Email already exists) |
| 200 | -6 | User Already Registered (Mobile already exists) |
| 400 | -8 | Server side validation error |
| 500 | -2 | Something went wrong (Server error) |

**Implementation Details:**

1. **When to use:** This endpoint is called when a user completes the sign-up form in the registration modal.

2. **UI Connection:** 
   - The form fields in the Sign Up modal directly map to the API parameters:
     - Full Name → FullName
     - Email → Email
     - Mobile → Mobile
     - Password → Password
   - The IpAddress and Source parameters are obtained programmatically without user input.

3. **Implementation Flow:**
   - User taps "Login / Register" in the Account tab
   - Sign Up modal appears
   - User fills out form fields
   - User taps "Sign up" button
   - Application collects device information (IP address, platform type)
   - API request is made with all parameters
   - Based on response:
     - Success: Display success message, store authentication token, close modal, refresh Account tab with logged-in view
     - Email/Mobile already exists: Display appropriate error message
     - Other errors: Display generic error message

4. **Error Handling:**
   - If statusCode is not 200 or responseCode is not 2, show appropriate error message
   - For specific error codes (-4, -6), show specific messages about email or mobile already being registered
   - For server errors, show a generic error and offer retry option

5. **Implementation Notes:**
   - The "Source" parameter should be programmatically determined based on the device platform
   - IP address should be obtained using network information APIs
   - Password should meet minimum requirements (8+ characters, mix of letters/numbers)

**Code Reference:**
This API is implemented in the following files:
- `src/utils/api-service.ts`: Core API service function that handles the API request
- `src/store/auth-store.ts`: Zustand store that manages authentication state
- `src/app/signup.tsx`: UI component that implements the registration form
- `src/app/auth.tsx`: Tabbed UI for switching between login and signup
- `src/app/(shop)/account.tsx`: Account screen that shows different views based on login state

**Implementation Example:**

```typescript
// API service implementation (src/utils/api-service.ts)
export const registerUser = async (params: RegisterUserParams): Promise<ApiResponse> => {
  const ipAddress = await getDeviceIpAddress();
  const source = getPlatformSource();
  
  return apiRequest(ENDPOINTS.REGISTER_USER, 'POST', {
    ...params,
    IpAddress: params.IpAddress || ipAddress,
    Source: source,
    CultureId: params.CultureId || CULTURE_IDS.ENGLISH,
  });
};

// Auth store implementation (src/store/auth-store.ts)
register: async (fullName, email, mobile, password) => {
  set({ isLoading: true, error: null });
  
  try {
    const response = await registerUser({
      FullName: fullName,
      Email: email,
      Mobile: mobile,
      Password: password,
      IpAddress: '', // Will be set by the API service
    });
    
    if (response.statusCode === 200 && response.responseCode === RESPONSE_CODES.SUCCESS) {
      // Successful registration
      set({
        isLoading: false,
        isLoggedIn: true,
        user: {
          fullName,
          email,
          mobile,
          id: response.data?.id,
        },
        error: null,
      });
      return true;
    } else {
      // Handle specific error codes
      let errorMessage = 'Registration failed. Please try again.';
      
      if (response.responseCode === RESPONSE_CODES.EMAIL_EXISTS) {
        errorMessage = 'This email is already registered. Please try another.';
      } else if (response.responseCode === RESPONSE_CODES.MOBILE_EXISTS) {
        errorMessage = 'This mobile number is already registered. Please try another.';
      }
      
      set({ isLoading: false, error: errorMessage });
      return false;
    }
  } catch (error) {
    set({ 
      isLoading: false, 
      error: 'Registration failed due to a network error. Please check your connection and try again.' 
    });
    return false;
  }
}
```

#### User Login

This API endpoint allows existing users to log in to the SouqMaria application.

**Endpoint:**
```
POST https://api.souqmaria.com/api/MerpecWebApi/UserLogin/
```

**Request Parameters:**

| # | Parameter | Type | Length | Description | Required |
|---|-----------|------|--------|-------------|----------|
| 1 | UserName | String | 72 | User's email address or mobile number | Yes |
| 2 | Password | String | 48 | User's password | Yes |
| 3 | CompanyId | int | - | Company identifier (fixed: 3044) | Yes |

**Response Structure (Success Example):**

```json
{
  "StatusCode": 200,
  "ResponseCode": "2", // Or 2 (number)
  "Message": "Logged In Successfully and get user details!!!",
  "Data": {
    "UserId": "12345",
    "FullName": "Test User",
    "Email": "hussain@test.com",
    "Mobile": "1234567890"
    // ... other user details like token, etc.
  },
  "TrackId": null
}
```

**Response Structure (Error Example - Invalid Credentials):**

```json
{
  "StatusCode": 200, // Or might be different for some errors
  "ResponseCode": "-2",
  "Message": "Invalid Username or Password!!!",
  "Data": null,
  "TrackId": null
}
```

**Response Codes:**

| StatusCode | ResponseCode | Meaning |
|------------|--------------|---------|
| 200 | 2 | Logged In Successfully and get user details!!! |
| 200 | -2 | Invalid Username or Password!!! |
| 400 | -6 | Server side validation error...Please try again later!!! |
| 500 | -2 | Something went wrong...Please try again later!!! |

**Implementation Details:**

1. **When to use:** This endpoint is called when a user submits the login form.
2. **UI Connection:** Form fields for username (email/mobile) and password map to API parameters.
3. **Implementation Flow:**
   - User enters credentials and taps "Login".
   - API request is made.
   - Success: Store user data (including any session tokens from `Data`), navigate to the main app or account screen, clear login form.
   - Invalid Credentials: Display "Invalid Username or Password!!!" message.
   - Other Errors: Display generic error or specific API message.

**Code Reference:**
- `src/utils/api-service.ts`: Will contain `loginUser` function.
- `src/store/auth-store.ts`: Will contain `login` action.
- `src/app/auth.tsx`: Will contain the login form UI.

#### 3. Update Account Information (`/Update_Account_Info/`)
- **Method:** `POST` (FromBody)
- **Description:** Updates user account details. Primarily for FullName and Password. Email and Mobile are noted as read-only for update purposes but are part of the payload.
- **Request Body:**
  ```json
  {
    "FullName": "string (128)",
    "Email": "string (72)",
    "Mobile": "string (16)",
    "Password": "string (48)", // New password. Send empty string or omit if not changing, based on API behavior.
    "UserId": "string (10)",
    "IpAddress": "string (128)",
    "CompanyId": "int (e.g., 3044)"
  }
  ```
- **Response Scenarios & Codes:**
  - **Success:** `StatusCode: 200`, `ResponseCode: 2`
    - **Message:** "Updated Successfully!!!"
  - **Update Not Successful:** `StatusCode: 200`, `ResponseCode: -2`
    - **Message:** "Updated Not Successfully!!!"
  - **User Not Found:** `StatusCode: 200`, `ResponseCode: -4`
    - **Message:** "User Not Found!!!"
  - **Mobile Already Exists:** `StatusCode: 200`, `ResponseCode: -8`
    - **Message:** "Mobile no. all ready exists...!!!" (Note: Contradicts read-only nature of mobile for updates)
  - **Something Went Wrong (User/Data related):** `StatusCode: 200`, `ResponseCode: -10`
    - **Message:** "Something went wrong...Please try again later!!!"
  - **Server Side Validation Error:** `StatusCode: 400`, `ResponseCode: -6`
    - **Message:** "Server side validation error...Please try again later!!!"
  - **Something Went Wrong (Server-related):** `StatusCode: 500`, `ResponseCode: -2`
    - **Message:** "Something went wrong...Please try again later!!!"
- **Notes:**
  - The API documentation image specifies "Email id and mobile no. should be read only" in the context of updates. This means that while they are sent in the payload, the backend should not modify these fields. The values sent should be the user's current email and mobile.
  - The primary editable fields by the user should be `FullName` and `Password`.

### Address Management APIs

#### 1. Save Billing Address (`/CRUD_Billing_Manage_Address/`)
- **Method:** `POST` (FromBody)
- **Description:** Saves a new billing address for the user. To update an existing address, a different `BillingAddressId` and potentially a different `Command` (e.g., "Update") would be used, though this specific flow covers adding a new address.
- **Request Body:**
  ```json
  {
    "BillingAddressId": 0, // Pass 0 for new address
    "FullName": "string (100)",
    "Email": "string (128)",
    "Mobile": "string (50)",
    "Address2": "string (500)", // Optional address line
    "Country": "string (10)", // Country Code/Xcode
    "State": "string (10)",   // State Code/Xcode
    "City": "string (10)",    // City Code/Xcode
    "Block": "string (200)",
    "Street": "string (200)",
    "House": "string (200)",
    "Apartment": "string (200)", // Optional
    "IsDefault": "boolean (0 or 1)", // 1 for true, 0 for false
    "Command": "Save", // Command to execute
    "UserId": "string (10)", // User's ID
    "CompanyId": "int (3044)", // Fixed Company ID
    "IpAddress": "string (100)" // User's IP Address
  }
  ```
- **Request Parameters Table:**

| # | Parameter        | Type    | Length | Description                     | Required |
|---|------------------|---------|--------|---------------------------------|----------|
| 1 | BillingAddressId | int     | -      | Address ID (0 for new)          | Yes      |
| 2 | FullName         | String  | 100    | User's full name for the address| Yes      |
| 3 | Email            | String  | 128    | User's email for the address    | Yes      |
| 4 | Mobile           | String  | 50     | User's mobile for the address   | Yes      |
| 5 | Address2         | String  | 500    | Optional address line 2         | No       |
| 6 | Country          | String  | 10     | Country Code/Xcode              | Yes      |
| 7 | State            | String  | 10     | State Code/Xcode                | Yes      |
| 8 | City             | String  | 10     | City Code/Xcode                 | Yes      |
| 9 | Block            | String  | 200    | Block number/name               | Yes      |
| 10| Street           | String  | 200    | Street name                     | Yes      |
| 11| House            | String  | 200    | House/Building number/name      | Yes      |
| 12| Apartment        | String  | 200    | Apartment number (optional)     | No       |
| 13| IsDefault        | Boolean | -      | Set as default (0 or 1)         | Yes      |
| 14| Command          | String  | 50     | Command (e.g., "Save")          | Yes      |
| 15| UserId           | String  | 10     | User's ID                       | Yes      |
| 16| CompanyId        | int     | -      | Company ID (fixed: 3044)        | Yes      |
| 17| IpAddress        | String  | 100    | User's IP Address               | Yes      |

- **Response Scenarios & Codes:**
  - **Success:** `StatusCode: 200`, `ResponseCode: 2`
    - **Message:** "Billing Address Save Successfully!!!"
  - **Save Not Successful:** `StatusCode: 200`, `ResponseCode: -2`
    - **Message:** "Billing Address Not Save Successfully!!!"
  - **Command Not Passed:** `StatusCode: 200`, `ResponseCode: -12`
    - **Message:** "Command Not Passed!!!"
  - **Something Went Wrong (User/Data related):** `StatusCode: 200`, `ResponseCode: -10`
    - **Message:** "Something went wrong...Please try again later!!!"
  - **Server Side Validation Error:** `StatusCode: 400`, `ResponseCode: -8`
    - **Message:** "Server side validation error...Please try again later!!!"
  - **Something Went Wrong (Server-related):** `StatusCode: 500`, `ResponseCode: -2`
    - **Message:** "Something went wrong...Please try again later!!!"
- **Implementation Notes:**
  - The `BillingAddressId` should be `0` when creating a new address.
  - `Command` should be `"Save"` for creating a new address.
  - `Country`, `State`, and `City` are expected to be codes (Xcodes). The UI will need dropdowns populated with appropriate values that map display names to these codes.
  - `IpAddress` should be dynamically obtained from the device.

#### 2. Update Billing Address (`/CRUD_Billing_Manage_Address/`)
- **Method:** `POST` (FromBody)
- **Description:** Updates an existing billing address for the user.
- **Request Body:**
  ```json
  {
    "BillingAddressId": "int", // Pass the existing address ID
    "FullName": "string (100)",
    "Email": "string (128)",
    "Mobile": "string (50)",
    "Address2": "string (500)", // Optional address line
    "Country": "string (10)", // Country Code/Xcode
    "State": "string (10)",   // State Code/Xcode
    "City": "string (10)",    // City Code/Xcode
    "Block": "string (200)",
    "Street": "string (200)",
    "House": "string (200)",
    "Apartment": "string (200)", // Optional
    "IsDefault": "boolean (0 or 1)", // 1 for true, 0 for false
    "Command": "Update", // Command to execute
    "UserId": "string (10)", // User's ID
    "CompanyId": "int (3044)", // Fixed Company ID
    "IpAddress": "string (100)" // User's IP Address
  }
  ```
- **Request Parameters Table:**

| # | Parameter        | Type    | Length | Description                     | Required |
|---|------------------|---------|--------|---------------------------------|----------|
| 1 | BillingAddressId | int     | -      | Existing Address ID             | Yes      |
| 2 | FullName         | String  | 100    | User's full name for the address| Yes      |
| 3 | Email            | String  | 128    | User's email for the address    | Yes      |
| 4 | Mobile           | String  | 50     | User's mobile for the address   | Yes      |
| 5 | Address2         | String  | 500    | Optional address line 2         | No       |
| 6 | Country          | String  | 10     | Country Code/Xcode              | Yes      |
| 7 | State            | String  | 10     | State Code/Xcode                | Yes      |
| 8 | City             | String  | 10     | City Code/Xcode                 | Yes      |
| 9 | Block            | String  | 200    | Block number/name               | Yes      |
| 10| Street           | String  | 200    | Street name                     | Yes      |
| 11| House            | String  | 200    | House/Building number/name      | Yes      |
| 12| Apartment        | String  | 200    | Apartment number (optional)     | No       |
| 13| IsDefault        | Boolean | -      | Set as default (0 or 1)         | Yes      |
| 14| Command          | String  | 50     | Command (must be "Update")      | Yes      |
| 15| UserId           | String  | 10     | User's ID                       | Yes      |
| 16| CompanyId        | int     | -      | Company ID (fixed: 3044)        | Yes      |
| 17| IpAddress        | String  | 100    | User's IP Address               | Yes      |

- **Response Scenarios & Codes:**
  - **Success:** `StatusCode: 200`, `ResponseCode: 2`
    - **Message:** "Billing Address Update Successfully!!!"
  - **Update Not Successful:** `StatusCode: 200`, `ResponseCode: -2`
    - **Message:** "Billing Address Not Update Successfully!!!"
  - **Command Not Passed:** `StatusCode: 200`, `ResponseCode: -12`
    - **Message:** "Command Not Passed!!!"
  - **Something Went Wrong (User/Data related):** `StatusCode: 200`, `ResponseCode: -10`
    - **Message:** "Something went wrong...Please try again later!!!"
  - **Server Side Validation Error:** `StatusCode: 400`, `ResponseCode: -8`
    - **Message:** "Server side validation error...Please try again later!!!"
  - **Something Went Wrong (Server-related):** `StatusCode: 500`, `ResponseCode: -2`
    - **Message:** "Something went wrong...Please try again later!!!"
- **Implementation Notes:**
  - The `BillingAddressId` must be an existing address ID.
  - `Command` must be set to `"Update"`.
  - All fields are required to be sent in the request, even if only some are being updated.
  - To preserve unchanged fields, you should first get the existing address data, modify only what needs to be changed, and then send the complete payload.

#### 3. Delete Billing Address (`/CRUD_Billing_Manage_Address/`)
- **Method:** `POST` (FromBody)
- **Description:** Deletes an existing billing address.
- **Request Body:**
  ```json
  {
    "BillingAddressId": "int", // Pass the existing address ID to delete
    "UserId": "string (10)", // User's ID
    "IpAddress": "string (100)", // User's IP Address
    "CompanyId": "int (3044)", // Fixed Company ID
    "Command": "Delete" // Command to execute
  }
  ```
- **Request Parameters Table:**

| # | Parameter        | Type    | Length | Description                     | Required |
|---|------------------|---------|--------|---------------------------------|----------|
| 1 | BillingAddressId | int     | -      | Existing Address ID to delete   | Yes      |
| 2 | UserId           | String  | 10     | User's ID                       | Yes      |
| 3 | IpAddress        | String  | 100    | User's IP Address               | Yes      |
| 4 | CompanyId        | int     | -      | Company ID (fixed: 3044)        | Yes      |
| 5 | Command          | String  | 50     | Command (must be "Delete")      | Yes      |

- **Response Scenarios & Codes:**
  - **Success:** `StatusCode: 200`, `ResponseCode: 6`
    - **Message:** "Billing Address Delete Successfully!!!"
  - **Delete Not Successful:** `StatusCode: 200`, `ResponseCode: -2`
    - **Message:** "Billing Address Not Delete Successfully!!!"
  - **Command Not Passed:** `StatusCode: 200`, `ResponseCode: -12`
    - **Message:** "Command Not Passed!!!"
  - **Something Went Wrong (User/Data related):** `StatusCode: 200`, `ResponseCode: -10`
    - **Message:** "Something went wrong...Please try again later!!!"
  - **Server Side Validation Error:** `StatusCode: 400`, `ResponseCode: -8`
    - **Message:** "Server side validation error...Please try again later!!!"
  - **Something Went Wrong (Server-related):** `StatusCode: 500`, `ResponseCode: -2`
    - **Message:** "Something went wrong...Please try again later!!!"
- **Implementation Notes:**
  - Only the address ID, user ID, company ID, IP address, and command are required for deletion.
  - The `Command` must be set to `"Delete"`.
  - A successful delete operation returns `ResponseCode: 6` rather than `2` as used for save/update operations.
  - After deletion, you should update the UI to remove the deleted address from the list.

### Shipping Address Management APIs

#### 1. Save Shipping Address (`/CRUD_Shipping_Manage_Address/`)
- **Method:** `POST` (FromBody)
- **Description:** Saves a new shipping address for the user.
- **Request Body:**
  ```json
  {
    "ShippingAddressId": 0, // Pass 0 for new address
    "FullName": "string (100)",
    "Email": "string (128)",
    "Mobile": "string (50)",
    "Address2": "string (500)", // Optional address line
    "Country": "string (10)", // Country Code/Xcode
    "State": "string (10)",   // State Code/Xcode
    "City": "string (10)",    // City Code/Xcode
    "Block": "string (200)",
    "Street": "string (200)",
    "House": "string (200)",
    "Apartment": "string (200)", // Optional
    "IsDefault": "boolean (0 or 1)", // 1 for true, 0 for false
    "Command": "Save", // Command to execute
    "UserId": "string (10)", // User's ID
    "CompanyId": "int (3044)", // Fixed Company ID
    "IpAddress": "string (100)" // User's IP Address
  }
  ```
- **Request Parameters Table:**

| # | Parameter         | Type    | Length | Description                     | Required |
|---|--------------------|---------|--------|---------------------------------|----------|
| 1 | ShippingAddressId | int     | -      | Address ID (0 for new)          | Yes      |
| 2 | FullName          | String  | 100    | User's full name for the address| Yes      |
| 3 | Email             | String  | 128    | User's email for the address    | Yes      |
| 4 | Mobile            | String  | 50     | User's mobile for the address   | Yes      |
| 5 | Address2          | String  | 500    | Optional address line 2         | No       |
| 6 | Country           | String  | 10     | Country Code/Xcode              | Yes      |
| 7 | State             | String  | 10     | State Code/Xcode                | Yes      |
| 8 | City              | String  | 10     | City Code/Xcode                 | Yes      |
| 9 | Block             | String  | 200    | Block number/name               | Yes      |
| 10| Street            | String  | 200    | Street name                     | Yes      |
| 11| House             | String  | 200    | House/Building number/name      | Yes      |
| 12| Apartment         | String  | 200    | Apartment number (optional)     | No       |
| 13| IsDefault         | Boolean | -      | Set as default (0 or 1)         | Yes      |
| 14| Command           | String  | 50     | Command (e.g., "Save")          | Yes      |
| 15| UserId            | String  | 10     | User's ID                       | Yes      |
| 16| CompanyId         | int     | -      | Company ID (fixed: 3044)        | Yes      |
| 17| IpAddress         | String  | 100    | User's IP Address               | Yes      |

- **Response Scenarios & Codes:**
  - **Success:** `StatusCode: 200`, `ResponseCode: 2`
    - **Message:** "Shipping Address Save Successfully!!!"
  - **Save Not Successful:** `StatusCode: 200`, `ResponseCode: -2`
    - **Message:** "Shipping Address Not Save Successfully!!!"
  - **Command Not Passed:** `StatusCode: 200`, `ResponseCode: -12`
    - **Message:** "Command Not Passed!!!"
  - **Something Went Wrong (User/Data related):** `StatusCode: 200`, `ResponseCode: -10`
    - **Message:** "Something went wrong...Please try again later!!!"
  - **Server Side Validation Error:** `StatusCode: 400`, `ResponseCode: -8`
    - **Message:** "Server side validation error...Please try again later!!!"
  - **Something Went Wrong (Server-related):** `StatusCode: 500`, `ResponseCode: -2`
    - **Message:** "Something went wrong...Please try again later!!!"
- **Implementation Notes:**
  - The `ShippingAddressId` should be `0` when creating a new address.
  - `Command` should be `"Save"` for creating a new address.
  - `Country`, `State`, and `City` are expected to be codes (Xcodes). The UI will need dropdowns populated with appropriate values that map display names to these codes.
  - `IpAddress` should be dynamically obtained from the device.

#### 2. Update Shipping Address (`/CRUD_Shipping_Manage_Address/`)
- **Method:** `POST` (FromBody)
- **Description:** Updates an existing shipping address for the user.
- **Request Body:**
  ```json
  {
    "ShippingAddressId": "int", // Pass the existing address ID
    "FullName": "string (100)",
    "Email": "string (128)",
    "Mobile": "string (50)",
    "Address2": "string (500)", // Optional address line
    "Country": "string (10)", // Country Code/Xcode
    "State": "string (10)",   // State Code/Xcode
    "City": "string (10)",    // City Code/Xcode
    "Block": "string (200)",
    "Street": "string (200)",
    "House": "string (200)",
    "Apartment": "string (200)", // Optional
    "IsDefault": "boolean (0 or 1)", // 1 for true, 0 for false
    "Command": "Update", // Command to execute
    "UserId": "string (10)", // User's ID
    "CompanyId": "int (3044)", // Fixed Company ID
    "IpAddress": "string (100)" // User's IP Address
  }
  ```
- **Request Parameters Table:**

| # | Parameter         | Type    | Length | Description                     | Required |
|---|--------------------|---------|--------|---------------------------------|----------|
| 1 | ShippingAddressId | int     | -      | Existing Address ID             | Yes      |
| 2 | FullName          | String  | 100    | User's full name for the address| Yes      |
| 3 | Email             | String  | 128    | User's email for the address    | Yes      |
| 4 | Mobile            | String  | 50     | User's mobile for the address   | Yes      |
| 5 | Address2          | String  | 500    | Optional address line 2         | No       |
| 6 | Country           | String  | 10     | Country Code/Xcode              | Yes      |
| 7 | State             | String  | 10     | State Code/Xcode                | Yes      |
| 8 | City              | String  | 10     | City Code/Xcode                 | Yes      |
| 9 | Block             | String  | 200    | Block number/name               | Yes      |
| 10| Street            | String  | 200    | Street name                     | Yes      |
| 11| House             | String  | 200    | House/Building number/name      | Yes      |
| 12| Apartment         | String  | 200    | Apartment number (optional)     | No       |
| 13| IsDefault         | Boolean | -      | Set as default (0 or 1)         | Yes      |
| 14| Command           | String  | 50     | Command (must be "Update")      | Yes      |
| 15| UserId            | String  | 10     | User's ID                       | Yes      |
| 16| CompanyId         | int     | -      | Company ID (fixed: 3044)        | Yes      |
| 17| IpAddress         | String  | 100    | User's IP Address               | Yes      |

- **Response Scenarios & Codes:**
  - **Success:** `StatusCode: 200`, `ResponseCode: 4`
    - **Message:** "Shipping Address Update Successfully!!!"
  - **Update Not Successful:** `StatusCode: 200`, `ResponseCode: -2`
    - **Message:** "Shipping Address Not Update Successfully!!!"
  - **Command Not Passed:** `StatusCode: 200`, `ResponseCode: -12`
    - **Message:** "Command Not Passed!!!"
  - **Something Went Wrong (User/Data related):** `StatusCode: 200`, `ResponseCode: -10`
    - **Message:** "Something went wrong...Please try again later!!!"
  - **Server Side Validation Error:** `StatusCode: 400`, `ResponseCode: -8`
    - **Message:** "Server side validation error...Please try again later!!!"
  - **Something Went Wrong (Server-related):** `StatusCode: 500`, `ResponseCode: -2`
    - **Message:** "Something went wrong...Please try again later!!!"
- **Implementation Notes:**
  - The `ShippingAddressId` must be an existing address ID.
  - `Command` must be set to `"Update"`.
  - All fields are required to be sent in the request, even if only some are being updated.
  - To preserve unchanged fields, you should first get the existing address data, modify only what needs to be changed, and then send the complete payload.
  - Note that a successful update operation returns `ResponseCode: 4` for shipping addresses, which is different from the billing address update response code.

#### 3. Delete Shipping Address (`/CRUD_Shipping_Manage_Address/`)
- **Method:** `POST` (FromBody)
- **Description:** Deletes an existing shipping address.
- **Request Body:**
  ```json
  {
    "ShippingAddressId": "int", // Pass the existing address ID to delete
    "UserId": "string (10)", // User's ID
    "IpAddress": "string (100)", // User's IP Address
    "CompanyId": "int (3044)", // Fixed Company ID
    "Command": "Delete" // Command to execute
  }
  ```
- **Request Parameters Table:**

| # | Parameter         | Type    | Length | Description                     | Required |
|---|--------------------|---------|--------|---------------------------------|----------|
| 1 | ShippingAddressId | int     | -      | Existing Address ID to delete   | Yes      |
| 2 | UserId            | String  | 10     | User's ID                       | Yes      |
| 3 | IpAddress         | String  | 100    | User's IP Address               | Yes      |
| 4 | CompanyId         | int     | -      | Company ID (fixed: 3044)        | Yes      |
| 5 | Command           | String  | 50     | Command (must be "Delete")      | Yes      |

- **Response Scenarios & Codes:**
  - **Success:** `StatusCode: 200`, `ResponseCode: 6`
    - **Message:** "Shipping Address Delete Successfully!!!"
  - **Delete Not Successful:** `StatusCode: 200`, `ResponseCode: -2`
    - **Message:** "Shipping Address Not Delete Successfully!!!"
  - **Command Not Passed:** `StatusCode: 200`, `ResponseCode: -12`
    - **Message:** "Command Not Passed!!!"
  - **Something Went Wrong (User/Data related):** `StatusCode: 200`, `ResponseCode: -10`
    - **Message:** "Something went wrong...Please try again later!!!"
  - **Server Side Validation Error:** `StatusCode: 400`, `ResponseCode: -8`
    - **Message:** "Server side validation error...Please try again later!!!"
  - **Something Went Wrong (Server-related):** `StatusCode: 500`, `ResponseCode: -2`
    - **Message:** "Something went wrong...Please try again later!!!"
- **Implementation Notes:**
  - Only the address ID, user ID, company ID, IP address, and command are required for deletion.
  - The `Command` must be set to `"Delete"`.
  - A successful delete operation returns `ResponseCode: 6` rather than `2` as used for save/update operations.
  - After deletion, you should update the UI to remove the deleted address from the list.


