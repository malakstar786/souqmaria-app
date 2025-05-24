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
    1. The user can go to the checkout page through the cart page.
    2. User can also directly order through WhatsApp by clicking the "Order on WhatsApp" button on product page.
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

### 4. Product Detail View

#### General Layout
- **Background color:** `#FFFFFF` (white)
- **Top bar:** White background, with back arrow (left) and cart icon (right).

#### Header
- **Back arrow:** Left, black (`#000000`), for navigation.
- **Cart icon:** Top right, black (`#000000`), with badge for item count (if any).

#### Product Images
- **Image slider:** Horizontally scrollable, full width.
- **Dots indicator:** Below slider, centered, dots for each image (active dot in blue, inactive in gray).

#### Product Information
- **Brand:** Gray text, smaller font.
- **Product name:** Bold, black, larger font.
- **Price section:** 
  - Old price (if any): Gray, strikethrough.
  - New price: Blue, bold, larger font.
- **Out of stock indicator:** Red text (if applicable).

#### Description Section
- **Title:** "DESCRIPTION" in bold, black.
- **Text:** Regular text with "Read More"/"Read Less" toggle if description is long.

#### Key Features Section
- **Title:** "KEY FEATURES" in bold, black.
- **Features list:** Each feature with a blue check icon and descriptive text.

#### Action Buttons
- **Quantity selector:** "-" and "+" buttons with quantity number between.
- **Add to cart button:** Blue background, white text, rounded corners.
- **Order on WhatsApp button:** WhatsApp green background, white text, WhatsApp icon, rounded corners.
- **Button position:** "Order on WhatsApp" button appears below the quantity selector and "Add to Cart" button.

#### Related Products Section
- **Title:** "RELATED PRODUCTS" in bold, black.
- **Products list:** Horizontally scrollable row of product cards.
- **Product card:** 
  - Image, name (2 lines max), and price.
  - Tapping navigates to that product's detail page.
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
  - Left of "Add to Cart" button.
  - White background (`#FFFFFF`), black border (`#000000`), rounded corners (8px).
  - Plus/minus buttons: Black (`#000000`), centered.
  - Quantity number: Black (`#000000`).
- **Add to Cart button:**
  - Right of quanitty control, blue background (`#00AEEF`), white text, bold, rounded corners (12px), large font.
  - Icon: Cart, white.
- **Order On WhatsApp button:**
  - Full width below add to cart and quantity control, green background, white text, bold, rounded corners (12px), large font.
  - Icon: WhatsApp vector icon or similar.
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
  - If no address, prompts user to add one by opening up a add billing address modal. 
  - When the user adds their billing address, they have one option in the bottom above save button - "Ship to Different Address?"
  - On checking "Ship to Different Address?", an add shipping address modal opens up. 
  - On saving the addresses, they are redirected to the checkout modal where their addresses are shown.
- **Promo code section:**
  - Title: "Have a Promo Code?" in black (`#000000`), left-aligned.
  - "See Promo Codes" link: Blue (`#00AEEF`), right-aligned, touchable.
  - Input field: White background (`#FFFFFF`), black border (`#000000`), rounded corners (8px), placeholder in gray (`#D9D9D9`).
  - "Apply" button: Black background (`#000000`), white text, bold, rounded corners (8px), right-aligned.
- **Payment type section:**
  - Title: "Select Payment Type" in black (`#000000`), bold.
  - List the payment methods from the response during api call.
  - Only one option: "CASH" (black, `#000000`), with payment icons (Visa, MasterCard, Knet, etc.) in color.
- **Order summary:**
  - Item Sub total, Discount, Shipping Fee, Grand Total: All right-aligned, black (`#000000`), blue (`#00AEEF`) for Grand Total.
- **Account creation prompt:**
  - "Create an Account?" link: Blue (`#00AEEF`), left-aligned, touchable, with a square select box. 
  - Upon clicking the box, sign up modal opens up for the user to sign up to souqmaria.
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
    - My Addresses
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


# Current Structure

mobile-app-sm
├── app.json
├── App.tsx
├── babel.config.js
├── eas.json
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
│       │   ├── add_billing_address_checkout.png
│       │   ├── add_shipping_address.png
│       │   ├── change_select_address.png
│       │   ├── guest
│       │   │   └── guest_checkout.png
│       │   ├── login
│       │   │   └── login.png
│       │   ├── order_failure.png
│       │   ├── order_success.png
│       │   ├── post_login_checkout.png
│       │   ├── promo_code_remove.png
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
│   │   │   │   ├── address
│   │   │   │   ├── details
│   │   │   │   ├── index.tsx
│   │   │   │   ├── orders
│   │   │   │   ├── policies.tsx
│   │   │   │   └── wishlist.tsx
│   │   │   ├── cart.tsx
│   │   │   ├── categories.tsx
│   │   │   └── index.tsx
│   │   ├── +not-found.tsx
│   │   ├── auth.tsx
│   │   ├── checkout.tsx
│   │   ├── forgot-password.tsx
│   │   ├── product
│   │   │   └── [id].tsx
│   │   ├── products
│   │   │   ├── _layout.tsx
│   │   │   └── list.tsx
│   │   └── signup.tsx
│   ├── assets
│   │   ├── empty_wishlist.png
│   │   ├── icon.png
│   │   ├── logo.png
│   │   ├── order_failed_image.png
│   │   ├── order_succesful_image.png
│   │   ├── payment_methods.png
│   │   └── pre_login_account.png
│   ├── components
│   │   ├── add-edit-address.tsx
│   │   ├── AddressDropdown.tsx
│   │   ├── browse-drawer.tsx
│   │   ├── CartIcon.tsx
│   │   ├── CategoryCard.tsx
│   │   ├── ChangeAddressModal.tsx
│   │   ├── CheckoutAddressFormModal.tsx
│   │   ├── CheckoutAddressModal.tsx
│   │   ├── common
│   │   │   └── TopBar.tsx
│   │   ├── CreateAddressModal.tsx
│   │   ├── GuestCheckoutAddressForm.tsx
│   │   ├── GuestCheckoutShippingForm.tsx
│   │   ├── HeaderCartIcon.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductFilters.tsx
│   │   ├── PromoCodeModal.tsx
│   │   └── SearchBarWithSuggestions.tsx
│   ├── constants
│   │   └── colors.ts
│   ├── screens
│   │   └── account
│   │       └── AccountScreen.tsx
│   ├── store
│   │   ├── address-store.ts
│   │   ├── advertisement-store.ts
│   │   ├── all-category-store.ts
│   │   ├── auth-store.ts
│   │   ├── banner-store.ts
│   │   ├── cart-store.ts
│   │   ├── category-store.ts
│   │   ├── checkout-store.ts
│   │   ├── location-store.ts
│   │   ├── menu-store.ts
│   │   ├── order-store.ts
│   │   ├── promo-store.ts
│   │   ├── search-store.ts
│   │   └── wishlist-store.ts
│   ├── theme.ts
│   └── utils
│       ├── api-config.ts
│       ├── api-service.ts
│       ├── api-test.js
│       ├── check-cart-quantity.js
│       ├── login-debug.js
│       ├── login-direct-test.js
│       ├── login-test.js
│       ├── test-addtocart-api.js
│       ├── test-apis.js
│       ├── test-banner-api.js
│       ├── test-cart-update-small.js
│       ├── test-cart-update.js
│       ├── test-category-api.js
│       ├── test-order-details-api.js
│       ├── test-orders-api.js
│       ├── test-product-api.js
│       ├── test-product-details-api.js
│       ├── test-product-ids.js
│       ├── test-user-login.js
│       ├── test-wishlist-apis.js
│       └── test-wishlist-image.js
├── test_addtocart.js
├── test_cart.js
├── test_product_api.js
└── tsconfig.json


# API Documentation

## API Overview
This section contains detailed documentation for all API endpoints used in the SouqMaria mobile application. It serves as the single source of truth for API integration, covering request formats, response structures, error handling, and implementation details.

Test Creds: 
email: hb@test.com
password: test@5253

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
| 3 | CompanyId| int    | - | Company identifier (fixed: 3044) | Yes |

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

#### 3. Forgot Password (`/ForgetPassword/`)
- **Method:** `POST` (FromBody)
- **Description:** Initiates the password reset process for a user by sending a password reset link or code to their registered email.
- **Request Body:**
  ```json
  {
    "Email": "string (72)",
    "CompanyId": "int (3044)"
  }
  ```
- **Request Parameters Table:**

| # | Parameter | Type   | Length | Description             | Required |
|---|-----------|--------|--------|-------------------------|----------|
| 1 | Email     | String | 72     | User's registered email | Yes      |
| 2 | CompanyId | int    | -      | Company ID (fixed: 3044)| Yes      |

- **Response Scenarios & Codes:**
  - **Success (Password Sent):** `StatusCode: 200`, `ResponseCode: 2`
    - **Message:** "Password sent, check your Email!!!"
  - **Email Not Matched:** `StatusCode: 200`, `ResponseCode: -2`
    - **Message:** "Email is not match with your profile."
  - **Server Side Validation Error:** `StatusCode: 400`, `ResponseCode: -6` (Assuming -6 based on other validation errors, API sheet shows -8 for other endpoints, but this specific one shows -6 in the image)
    - **Message:** "Server side validation error...Please try again later!!!"
  - **Something Went Wrong (Server-related):** `StatusCode: 500`, `ResponseCode: -2`
    - **Message:** "Something went wrong...Please try again later!!!"
- **Implementation Notes:**
  - The user will provide their email address.
  - The application will call this endpoint.
  - Upon successful response (`ResponseCode: 2`), the UI should inform the user to check their email for a password reset link/instructions.
  - If the email is not found (`ResponseCode: -2`), the UI should inform the user that the email is not registered or doesn't match.

#### 4. Update Account Information (`/Update_Account_Info/`)
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
    "CompanyId": "int (3044)", // Fixed Company
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
    "CompanyId": "int (3044)", // Fixed Company
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
| 16| CompanyId          | int     | -      | Company ID (fixed: 3044)        | Yes      |
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
    "CompanyId": "int (3044)", // Fixed Company
    "Command": "Delete" // Command to execute
  }
  ```
- **Request Parameters Table:**

| # | Parameter        | Type    | Length | Description                     | Required |
|---|------------------|---------|--------|---------------------------------|----------|
| 1 | BillingAddressId | int     | -      | Existing Address ID to delete   | Yes      |
| 2 | UserId           | String  | 10     | User's ID                       | Yes      |
| 3 | IpAddress        | String  | 100    | User's IP Address               | Yes      |
| 4 | CompanyId          | int     | -      | Company ID (fixed: 3044)        | Yes      |
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

#### 4. Get Billing Address List (`getData_JSON/`)
- **Method:** `POST` (FromBody)
- **Description:** Retrieves a list of billing addresses for the user.
- **Request Body:**
  ```json
  {
    "strQuery": "[Web].[Sp_Manage_Address_Apps_SM]'Get_BillingAddress_List','USER_ID','','','','',1,3044"
  }
  ```
- **Request Parameters Table:**

| # | Parameter | Type   | Length | Description                     | Required |
|---|-----------|--------|--------|---------------------------------|----------|
| 1 | Type      | String | 50     | Pass "Get_BillingAddress_List"  | Yes      |
| 2 | Value     | String | 50     | Pass User Id                    | Yes      |
| 3 | Value1    | String | 50     | Pass Empty string               | No       |
| 4 | Value2    | String | 50     | Pass Empty string               | No       |
| 5 | Value3    | String | 50     | Pass Empty string               | No       |
| 6 | Value4    | String | 50     | Pass Empty string               | No       |
| 7 | CultureId | int    | -      | Culture ID (1-English, 2-Arabic)| Yes      |
| 8 | Company   | int    | -      | Company ID (fixed: 3044)        | Yes      |

- **Response Structure (Success Example):**
  ```json
  {
    "success": 1,
    "row": [
      {
        "BillingAddressId": 123,
        "FullName": "Example User",
        "Mobile": "12345678",
        "Address": "Block - 1, Street - 2, House/Building - 3, Apartment No. - 4",
        "Address2": "Optional additional address line",
        "Country": "Kuwait",
        "State": "Kuwait City",
        "City": "Al Soor",
        "IsDefault": true,
        "Email": "user@example.com"
      }
    ],
    "Message": "Data found."
  }
  ```

- **Response Structure (No Addresses):**
  ```json
  {
    "success": 0,
    "row": [],
    "Message": "Data not found."
  }
  ```

#### 5. Get Shipping Address List (`getData_JSON/`)
- **Method:** `POST` (FromBody)
- **Description:** Retrieves a list of shipping addresses for the user.
- **Request Body:**
  ```json
  {
    "strQuery": "[Web].[Sp_Manage_Address_Apps_SM]'Get_ShippingAddress_List','USER_ID','','','','',1,3044"
  }
  ```
- **Request Parameters Table:**

| # | Parameter | Type   | Length | Description                       | Required |
|---|-----------|--------|--------|-----------------------------------|----------|
| 1 | Type      | String | 50     | Pass "Get_ShippingAddress_List"   | Yes      |
| 2 | Value     | String | 50     | Pass User Id                      | Yes      |
| 3 | Value1    | String | 50     | Pass Empty string                 | No       |
| 4 | Value2    | String | 50     | Pass Empty string                 | No       |
| 5 | Value3    | String | 50     | Pass Empty string                 | No       |
| 6 | Value4    | String | 50     | Pass Empty string                 | No       |
| 7 | CultureId | int    | -      | Culture ID (1-English, 2-Arabic)  | Yes      |
| 8 | Company   | int    | -      | Company ID (fixed: 3044)          | Yes      |

- **Response Structure (Success Example):**
  ```json
  {
    "success": 1,
    "row": [
      {
        "ShippingAddressId": 332,
        "FullName": "Hussain Test User",
        "Mobile": "12345678",
        "Address": "Block - 1, Street - 2, House/Building - 4, Apartment No. - 3",
        "Address2": "White house",
        "Country": "Kuwait",
        "State": "Kuwait City",
        "City": "Al Soor Gradens -BLOCK1",
        "IsDefault": true,
        "Email": "hussain@test.com"
      }
    ],
    "Message": "Data found."
  }
  ```

- **Response Structure (No Addresses):**
  ```json
  {
    "success": 0,
    "row": [],
    "Message": "Data not found."
  }
  ```

#### 6. Get Billing Address Details (`getData_JSON/`)
- **Method:** `POST` (FromBody)
- **Description:** Retrieves details of a specific billing address.
- **Request Body:**
  ```json
  {
    "strQuery": "[Web].[Sp_Manage_Address_Apps_SM] 'Get_BillingAddress_ByBillingAddressId','BILLING_ADDRESS_ID','USER_ID','','','',1,3044"
  }
  ```
- **Request Parameters Table:**

| # | Parameter | Type   | Length | Description                            | Required |
|---|-----------|--------|--------|----------------------------------------|----------|
| 1 | Type      | String | 50     | Pass "Get_BillingAddress_ByBillingAddressId" | Yes      |
| 2 | Value     | String | 50     | Pass Billing Address Id                | Yes      |
| 3 | Value1    | String | 50     | Pass User Id                           | Yes      |
| 4 | Value2    | String | 50     | Pass Empty string                      | No       |
| 5 | Value3    | String | 50     | Pass Empty string                      | No       |
| 6 | Value4    | String | 50     | Pass Empty string                      | No       |
| 7 | CultureId | int    | -      | Culture ID (1-English, 2-Arabic)       | Yes      |
| 8 | Company   | int    | -      | Company ID (fixed: 3044)               | Yes      |

- **Response Structure (Success Example):**
  ```json
  {
    "success": 1,
    "row": [
      {
        "BillingAddressId": 123,
        "FullName": "Example User",
        "Email": "user@example.com",
        "Mobile": "12345678",
        "Country": 69,
        "State": 242,
        "City": 2119,
        "Block": "1",
        "Street": "2",
        "House": "3",
        "Apartment": "4",
        "Address2": "Optional additional address line",
        "IsDefault": true,
        "CountryName": "Kuwait",
        "StateName": "Kuwait City",
        "CityName": "Al Soor"
      }
    ],
    "Message": "Data found."
  }
  ```

- **Response Structure (No Address Found):**
  ```json
  {
    "success": 0,
    "row": [],
    "Message": "Data not found."
  }
  ```

#### 7. Get Shipping Address Details (`getData_JSON/`)
- **Method:** `POST` (FromBody)
- **Description:** Retrieves details of a specific shipping address.
- **Request Body:**
  ```json
  {
    "strQuery": "[Web].[Sp_Manage_Address_Apps_SM] 'Get_ShippingAddress_ByShippingAddressId','SHIPPING_ADDRESS_ID','USER_ID','','','',1,3044"
  }
  ```
- **Request Parameters Table:**

| # | Parameter | Type   | Length | Description                              | Required |
|---|-----------|--------|--------|------------------------------------------|----------|
| 1 | Type      | String | 50     | Pass "Get_ShippingAddress_ByShippingAddressId" | Yes      |
| 2 | Value     | String | 50     | Pass Shipping Address Id                 | Yes      |
| 3 | Value1    | String | 50     | Pass User Id                             | Yes      |
| 4 | Value2    | String | 50     | Pass Empty string                        | No       |
| 5 | Value3    | String | 50     | Pass Empty string                        | No       |
| 6 | Value4    | String | 50     | Pass Empty string                        | No       |
| 7 | CultureId | int    | -      | Culture ID (1-English, 2-Arabic)         | Yes      |
| 8 | Company   | int    | -      | Company ID (fixed: 3044)                 | Yes      |

- **Response Structure (Success Example):**
  ```json
  {
    "success": 1,
    "row": [
      {
        "ShippingAddressId": 332,
        "FullName": "Hussain Test User",
        "Email": "hussain@test.com",
        "Mobile": "12345678",
        "Country": 69,
        "State": 242,
        "City": 2119,
        "Block": "1",
        "Street": "2",
        "House": "4",
        "Apartment": "3",
        "Address2": "White house",
        "IsDefault": true,
        "CountryName": "Kuwait",
        "StateName": "Kuwait City",
        "CityName": "Al Soor Gradens -BLOCK1"
      }
    ],
    "Message": "Data found."
  }
  ```

- **Response Structure (No Address Found):**
  ```json
  {
    "success": 0,
    "row": [],
    "Message": "Data not found."
  }
  ```

- **Implementation Notes:**
  - The address list APIs return combined address fields for display, while the details APIs return the individual components.
  - When saving or editing addresses, use the individual fields (Country, State, City, Block, etc.) rather than the combined address field.
  - The Country, State, and City fields in the details response are numeric IDs corresponding to the location data, while CountryName, StateName, and CityName provide the display names.
  - IsDefault is a boolean indicating whether this is the default address for the user.

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
    "CompanyId": "int (3044)", // Fixed Company
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
| 16| CompanyId           | int     | -      | Company ID (fixed: 3044)        | Yes      |
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
    "CompanyId": "int (3044)", // Fixed Company
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

### Location Data APIs

These APIs use the generic `getData_JSON` endpoint with specific stored procedure parameters.

#### 1. Get Country List

- **Method:** `POST`
- **Endpoint:** `getData_JSON/`
- **Description:** Retrieves a list of countries for address forms.
- **Request Body:**
  ```json
  {
    "strQuery": "[Web].[Sp_Manage_Address_Apps_SM] 'Get_Country_List','','','','','',1,3044"
  }
  ```
- **Response Structure (Success Example):**
  ```json
  {
    "success": 1,
    "row": [
      {
        "XCode": 69,
        "XName": "Kuwait"
      },
      {
        "XCode": 13,
        "XName": "Bahrain"
      },
      {
        "XCode": 81,
        "XName": "Lebanon"
      }
    ]
  }
  ```

#### 2. Get State List

- **Method:** `POST`
- **Endpoint:** `getData_JSON/`
- **Description:** Retrieves a list of states/regions for a specific country.
- **Request Body:**
  ```json
  {
    "strQuery": "[Web].[Sp_Manage_Address_Apps_SM] 'Get_State_List','69','','','','',1,3044"
  }
  ```
- **Request Parameters:**
  - `'69'` - The XCode of the country to fetch states for

- **Response Structure (Success Example):**
  ```json
  {
    "success": 1,
    "row": [
      {
        "XCode": 1,
        "XName": "Kuwait"
      },
      {
        "XCode": 2,
        "XName": "Al Ahmadi"
      },
      {
        "XCode": 3,
        "XName": "Al Farwaniyah"
      }
    ]
  }
  ```

#### 3. Get City List

- **Method:** `POST`
- **Endpoint:** `getData_JSON/`
- **Description:** Retrieves a list of cities for a specific state/region.
- **Request Body:**
  ```json
  {
    "strQuery": "[Web].[Sp_Manage_Address_Apps_SM] 'Get_City_List','2','','','','',1,3044"
  }
  ```
- **Request Parameters:**
  - `'2'` - The XCode of the state to fetch cities for

- **Response Structure (Success Example):**
  ```json
  {
    "success": 1,
    "row": [
      {
        "XCode": 3,
        "XName": "Sabah Al Ahmad City"
      },
      {
        "XCode": 19,
        "XName": "Ali Sabah Al Salem"
      },
      {
        "XCode": 29,
        "XName": "Al Wafra"
      }
    ]
  }
  ```

### Address Management APIs
// ... continue with existing code ...



## Implementation Notes for Location and Address Management

### Generic getData_JSON Endpoint for Stored Procedures

The `getData_JSON` endpoint is a generic API endpoint that calls stored procedures on the server. It takes a formatted SQL query string that specifies:

1. The stored procedure to call
2. The parameters to pass to the stored procedure

Format: `[Schema].[StoredProcedureName] 'Parameter1','Parameter2',...,'ParameterN'`

This approach is used for all location data (countries, states, cities) and will be used for other data retrieval operations.

**Response Handling for `getData_JSON`:**
When using `getData_JSON`, the direct response from this endpoint will be an object like:
```json
{
  "success": 1, // 1 for data found, 0 for no data found by the stored procedure
  "row": [ /* array of data objects if success is 1, empty if 0 */ ],
  "Message": "Data found." // Or "Data not found.", or other SP-specific messages
}
```
- In the application's API service layer (e.g., `api-service.ts`), when wrapping calls to `getData_JSON`:
  - The `ApiResponse.StatusCode` should reflect the HTTP status of the `getData_JSON` call itself (e.g., 200 for success).
  - The `ApiResponse.ResponseCode` should indicate the success of the wrapper's HTTP operation (e.g., `RESPONSE_CODES.SUCCESS` if the HTTP call was okay).
  - The entire object above (`{success, row, Message}`) from `getData_JSON` should be placed into the `ApiResponse.Data` field.
- Client-side logic (e.g., in Zustand stores) should then check `ApiResponse.Data.success` to determine if the stored procedure found data, and `ApiResponse.Data.row` for the actual data. An `ApiResponse.Data.success === 0` signifies "no data found by the SP" and should typically not be treated as an application-level error unless the context dictates otherwise.

### Location Data Implementation

We've implemented a comprehensive location management system:

1. **Location APIs**
   - Country list retrieval
   - State/region list retrieval based on country selection
   - City list retrieval based on state selection

2. **Data Storage**
   - `location-store.ts`: Zustand store for managing location data and selections
   - Handles fetching, caching, and user selections for countries, states, and cities

3. **User Interface Components**
   - `AddressDropdown.tsx`: Reusable dropdown component for selecting locations
   - `add-edit-address.tsx`: Form component for adding/editing addresses with location dropdowns
   - Proper loading states, error handling, and validation

4. **Address Management**
   - `address-store.ts`: Zustand store for managing user billing and shipping addresses
   - CRUD operations for addresses (Create, Read, Update, Delete)
   - Proper validation and error handling

### Next Steps

Future improvements to consider:

1. Implement address list retrieval API to show saved addresses
2. Add default address selection functionality
3. Expand address validation for required fields
4. Improve error messaging for failed API calls
5. Add confirmation messages for successful operations
6. Implement address selection during checkout flow

### Order Management APIs

#### 1. Get My Orders List (`getData_JSON/`)
- **Method:** `POST` (FromBody)
- **Description:** Retrieves a list of orders for the logged-in user.
- **Request Body:**
  ```json
  {
    "strQuery": "[Web].[Sp_Template1_Get_MyOrders_Apps] 'Get_MyOrders_Parent','USER_ID','','','CurrencyXName','CurrencyXCode',3044,1"
  }
  ```
- **Request Parameters Table:**

| # | Parameter | Type   | Length | Description                     |
|---|-----------|--------|--------|---------------------------------|
| 1 | Type      | String | 50     | "Get_MyOrders_Parent"           |
| 2 | Value     | String | 50     | User ID                         |
| 3 | Value1    | String | 50     | Pass empty string               |
| 4 | Value2    | String | 50     | Pass empty string               |
| 5 | Value3    | String | 50     | "CurrencyXName"                 |
| 6 | Value4    | String | 50     | "CurrencyXCode"                 |
| 7 | Company   | int    | -      | Company ID (fixed: 3044)        |
| 8 | CultureId | int    | -      | Culture ID (1-English, 2-Arabic)|

- **Response Structure (Success Example):**
  ```json
  {
    "success": 1,
    "row": [
      {
        "OrderID": "123456",
        "OrderNo": "SO-123456",
        "OrderDate": "2023-06-15",
        "TotalAmount": 125.50,
        "Status": "Delivered",
        "ItemCount": 3,
        // Other order summary fields
      },
      // More orders...
    ]
  }
  ```

- **Response Structure (No Orders):**
  ```json
  {
    "success": 0,
    "row": [],
    "Message": "Data not found."
  }
  ```

- **Implementation Notes:**
  - This endpoint returns a list of all orders for the authenticated user.
  - The response includes basic information about each order such as order number, date, total amount, and status.
  - The `success` field indicates whether orders were found (1) or not (0).
  - If no orders are found, the `row` array will be empty and a message will be provided.

#### 2. Get Order Details (`getData_JSON/`)
- **Method:** `POST` (FromBody)
- **Description:** Retrieves detailed information about a specific order.
- **Request Body:**
  ```json
  {
    "strQuery": "[Web].[Sp_Template1_Get_MyOrders_Apps] 'Get_MyOrders_Child','USER_ID','ORDER_NO','','CurrencyXName','CurrencyXCode',3044,1"
  }
  ```
- **Request Parameters Table:**

| # | Parameter | Type   | Length | Description                     |
|---|-----------|--------|--------|---------------------------------|
| 1 | Type      | String | 50     | "Get_MyOrders_Child"            |
| 2 | Value     | String | 50     | User ID                         |
| 3 | Value1    | String | 50     | Order Number                    |
| 4 | Value2    | String | 50     | Pass empty string               |
| 5 | Value3    | String | 50     | "CurrencyXName"                 |
| 6 | Value4    | String | 50     | "CurrencyXCode"                 |
| 7 | Company   | int    | -      | Company ID (fixed: 3044)        |
| 8 | CultureId | int    | -      | Culture ID (1-English, 2-Arabic)|

- **Response Structure (Success Example):**
  ```json
  {
    "success": 1,
    "row": [
      {
        "OrderID": "123456",
        "OrderNo": "SO-123456",
        "OrderDate": "2023-06-15",
        "ProductName": "iPhone 14 Pro",
        "Quantity": 1,
        "UnitPrice": 999.00,
        "Discount": 0,
        "TotalAmount": 999.00,
        "ImageURL": "https://example.com/images/iphone14pro.jpg",
        // Other detailed fields for the order item
      },
      // More items in this order...
    ]
  }
  ```

- **Response Structure (No Details Found):**
  ```json
  {
    "success": 0,
    "row": [],
    "Message": "Data not found."
  }
  ```

- **Implementation Notes:**
  - This endpoint returns detailed information about a specific order, including all items in the order.
  - The `Value1` parameter should contain the order number retrieved from the parent orders list.
  - Each row in the response represents one item in the order.
  - If no details are found for the specified order, the `row` array will be empty and a message will be provided.

### Category Management APIs

#### 1. Get Home Page Category List (`getData_JSON/`)
- **Method:** `POST` (FromBody)
- **Description:** Retrieves a list of product categories for display on the homepage, including image names.
- **Request Body:**
  ```json
  {
    "strQuery": "[Web].[Sp_Get_SM_Apps] 'Get_HomePage_Category_List','','','','','',1,3044,''"
  }
  ```
- **Request Parameters Table (for `Sp_Get_SM_Apps`):**

| # | Parameter  | Type   | Length | Description                           |
|---|------------|--------|--------|---------------------------------------|
| 1 | Type       | String | 50     | "Get_HomePage_Category_List"          |
| 2 | Value      | String | 50     | Pass empty string                     |
| 3 | Value1     | String | 50     | Pass empty string                     |
| 4 | Value2     | String | 50     | Pass empty string                     |
| 5 | Value3     | String | 50     | Pass empty string                     |
| 6 | Value4     | String | 50     | Pass empty string                     |
| 7 | CultureId  | int    | -      | Culture ID (1-English, 2-Arabic)      |
| 8 | Company    | String | 10     | Company ID (fixed: 3044)              |
| 9 | UserId     | String | 10     | User ID (pass empty string if not logged in) |

- **Response Structure (Success Example):**
  ```json
  {
    "success": 1,
    "row": [
      {
        "SrNo": "HC31790001",
        "CategoryName": "Mobile",
        "Ordering": 1,
        "Image": "unnamed (1).png",
        "HPCType": "HPC2"
      },
      // ... more categories
    ],
    "Message": "Data found."
  }
  ```

Actual Response for Get_HomePage_Category_List


```
{
  "success": 1,
  "row": [
    {"SrNo": "HC31790001", "CategoryName": "Mobile", "Ordering": 1, "Image": "unnamed (1).png", "HPCType": "HPC2"},
    {"SrNo": "HC31790002", "CategoryName": "Tablets", "Ordering": 2, "Image": "64d2fe7d22fd6054ca632795-onn-10-1-kids-tablet-32gb-2022.jpg", "HPCType": "HPC2"},
    {"SrNo": "HC31790003", "CategoryName": "Accessories", "Ordering": 3, "Image": "mobile-accessories-wholesale-500x500.webp", "HPCType": "HPC2"},
    {"SrNo": "HC31790004", "CategoryName": "Speakers & Headphones", "Ordering": 4, "Image": "20-204377_headphones-speaker-speakers-and-headphones-png.png", "HPCType": "HPC2"},
    {"SrNo": "HC31790005", "CategoryName": "Smartwatches", "Ordering": 5, "Image": "smartwatchesicon.webp", "HPCType": "HPC2"},
    {"SrNo": "HC31790006", "CategoryName": "Electronics Appliances", "Ordering": 6, "Image": "home-appliances-250x250.webp", "HPCType": "HPC2"}
  ],
  "Message": "Data found."
}
```

- **Implementation Notes:**
  - `CategoryName` is the display name.
  - `Image` contains the filename of the category image.
  - `Ordering` determines the display order.
  - This endpoint is used for the Home tab.

#### 1A. Get All Home Page Category List (`getData_JSON/`)
- **Method:** `POST` (FromBody)
- **Description:** Retrieves a complete list of product categories for display on the Categories tab, including image names.
- **Request Body:**
  ```json
  {
    "strQuery": "[Web].[Sp_Get_SM_Apps] 'Get_All_HomePage_Category_List','','','','','',1,3044,''"
  }
  ```
- **Request Parameters Table (for `Sp_Get_SM_Apps`):**

| # | Parameter  | Type   | Length | Description                           |
|---|------------|--------|--------|---------------------------------------|
| 1 | Type       | String | 50     | "Get_All_HomePage_Category_List"      |
| 2 | Value      | String | 50     | Pass empty string                     |
| 3 | Value1     | String | 50     | Pass empty string                     |
| 4 | Value2     | String | 50     | Pass empty string                     |
| 5 | Value3     | String | 50     | Pass empty string                     |
| 6 | Value4     | String | 50     | Pass empty string                     |
| 7 | CultureId  | int    | -      | Culture ID (1-English, 2-Arabic)      |
| 8 | Company    | String | 10     | Company ID (fixed: 3044)              |
| 9 | UserId     | String | 10     | User ID (pass empty string if not logged in) |

- **Response Structure:** Similar to Get Home Page Category List
- **Implementation Notes:**
  - This endpoint returns a more comprehensive list of categories compared to the Home tab version.
  - All other fields and behavior are similar to the Get Home Page Category List endpoint.
  - This endpoint is used specifically for the Categories tab.

#### 2. Get Category Image
- **Base URL:** `https://erp.merpec.com/Upload/HomePage_Category/3044/`
- **Description:** Retrieves the actual image for a category.
- **Usage:** Append the `Image` filename (from the Get Home Page Category List response) to this base URL.
  - Example: `https://erp.merpec.com/Upload/HomePage_Category/3044/unnamed (1).png`

### Banner Management APIs

#### 1. Get Banner List (`getData_JSON/`)
- **Method:** `POST` (FromBody)
- **Description:** Retrieves a list of banners for the homepage carousel.
- **Request Body:**
  ```json
  {
    "strQuery": "[Web].[Sp_Get_SM_Apps] 'Get_Banner_List','','','','','',1,3044,''"
  }
  ```
- **Request Parameters Table (for `Sp_Get_SM_Apps`):**

| # | Parameter  | Type   | Length | Description                           |
|---|------------|--------|--------|---------------------------------------|
| 1 | Type       | String | 50     | "Get_Banner_List"                     |
| 2 | Value      | String | 50     | Pass empty string                     |
| 3 | Value1     | String | 50     | Pass empty string                     |
| 4 | Value2     | String | 50     | Pass empty string                     |
| 5 | Value3     | String | 50     | Pass empty string                     |
| 6 | Value4     | String | 50     | Pass empty string                     |
| 7 | CultureId  | int    | -      | Culture ID (1-English, 2-Arabic)      |
| 8 | Company    | String | 10     | Company ID (fixed: 3044)              |
| 9 | UserId     | String | 10     | User ID (pass empty string if not logged in) |

- **Response Structure (Success Example):**
  ```json
  {
    "success": 1,
    "row": [
      {
        "Banner_ImageName": "7520280867747960_ed37b308.png",
        "TagUrl": null
      },
      // ... more banners
    ],
    "Message": "Data found."
  }
  ```

- **Implementation Notes:**
  - `Banner_ImageName` is the filename of the banner image.
  - `TagUrl` can be used for navigation if a banner is pressed (currently `null` in the example).

#### 2. Get Banner Image
- **Base URL:** `https://erp.merpec.com/Upload/Banner/`
- **Description:** Retrieves the actual image for a banner.
- **Usage:** Append the `Banner_ImageName` (from the Get Banner List response) to this base URL.
  - Example: `https://erp.merpec.com/Upload/Banner/7520280867747960_ed37b308.png`

### Advertisement Management APIs

#### 1. Get Advertisement List (`getData_JSON/`)
- **Method:** `POST` (FromBody)
- **Description:** Retrieves a list of advertisements, typically for display on the homepage.
- **Request Body:**
  ```json
  {
    "strQuery": "[Web].[Sp_Get_SM_Apps] 'Get_Ads_List','','','','','','1','3044','USER_ID_OR_EMPTY'"
  }
  ```
- **Request Parameters Table (for `Sp_Get_SM_Apps`):**

| # | Parameter  | Type   | Length | Description                           | Notes / Example Value      |
|---|------------|--------|--------|---------------------------------------|----------------------------|
| 1 | Type       | String | 50     | Defines the action to perform         | "Get_Ads_List"             |
| 2 | Value      | String | 50     | Generic parameter, context-dependent  | Pass empty string ""       |
| 3 | Value1     | String | 50     | Generic parameter, context-dependent  | Pass empty string ""       |
| 4 | Value2     | String | 50     | Generic parameter, context-dependent  | Pass empty string ""       |
| 5 | Value3     | String | 50     | Generic parameter, context-dependent  | Pass empty string ""       |
| 6 | Value4     | String | 50     | Generic parameter, context-dependent  | Pass empty string ""       |
| 7 | CultureId  | int    | -      | Culture ID for localization           | "1" (English), "2" (Arabic)|
| 8 | Company    | String | 10     | Company identifier                    | "3044"                     |
| 9 | UserId     | String | 10     | User ID for personalized content      | Pass User ID or empty string "" if not logged in |

- **Response Structure (Success Example):**
  ```json
  {
    "success": 1,
    "row": [
      {
        "Ads_ImageName": "ad_image_1.png", // Example field name
        "TagUrl": "product/PROD123"      // Example field name for click-through URL
      },
      // ... more advertisements
    ],
    "Message": "Data found."
  }
  ```
  *Note: The actual field names for image and URL (`Ads_ImageName`, `TagUrl`) need to be confirmed from an actual API response. Assuming similarity to Banner response.*

- **Implementation Notes:**
  - `Ads_ImageName` (or actual field name) is the filename of the advertisement image.
  - `TagUrl` (or actual field name) can be used for navigation if an advertisement is pressed.

#### 2. Get Advertisement Image
- **Base URL:** `https://erp.merpec.com/Upload/ads/`
- **Description:** Retrieves the actual image for an advertisement.
- **Usage:** Append the image filename (from the Get Advertisement List response, e.g., `Ads_ImageName`) to this base URL.
  - Example: `https://erp.merpec.com/Upload/ads/ad_image_1.png`

### Browse Drawer / Menu Category APIs

These APIs are used to populate the browse drawer menu with categories and their respective subcategories.

#### 1. Get Main Menu Categories (`getData_JSON/`)
- **Method:** `POST` (FromBody)
- **Description:** Retrieves the list of main categories to be displayed in the browse drawer.
- **Stored Procedure:** `[Web].[Sp_Get_SM_Apps]`
- **Request Body Parameters for `strQuery`:**
  - `Type`: "Get_Menu_Category_List"
  - `Value`, `Value1`, `Value2`, `Value3`, `Value4`: Empty strings `''`
  - `CultureId`: e.g., `'1'` for English
  - `Company`: `'3044'`
  - `UserId`: User ID or empty string `''`
- **Example `strQuery`:** `[Web].[Sp_Get_SM_Apps] 'Get_Menu_Category_List','','','','','','1','3044',''`
- **Response Structure (Success Example - `Data` field content):**
  ```json
  {
    "success": 1,
    "row": [
      {
        "XCode": "MOB", // Example Main Category Code
        "XName": "Mobile", // Example Main Category Name
        // ... other fields if any
      },
      {
        "XCode": "TAB",
        "XName": "Tablet"
      }
      // ... more main categories
    ],
    "Message": "Data found."
  }
  ```
- **Notes:** 
  - `XCode` will be used to fetch subcategories.
  - `XName` is the display name for the main category.

#### 2. Get Subcategories by Main Category (`getData_JSON/`)
- **Method:** `POST` (FromBody)
- **Description:** Retrieves the list of subcategories for a given main category Xcode.
- **Stored Procedure:** `[Web].[Sp_Get_SM_Apps]`
- **Request Body Parameters for `strQuery`:**
  - `Type`: "Get_Menu_SubCategory_List_ByCategory"
  - `Value`: Main Category `XCode` (e.g., `'MOB'`)
  - `Value1`, `Value2`, `Value3`, `Value4`: Empty strings `''`
  - `CultureId`: e.g., `'1'` for English
  - `Company`: `'3044'`
  - `UserId`: User ID or empty string `''`
- **Example `strQuery` (for main category with XCode 'MOB'):** `[Web].[Sp_Get_SM_Apps] 'Get_Menu_SubCategory_List_ByCategory','MOB','','','','','1','3044',''`
- **Response Structure (Success Example - `Data` field content):**
  ```json
  {
    "success": 1,
    "row": [
      {
        "XCode": "MOB_IPHONE", // Example Subcategory Code
        "XName": "iPhone",     // Example Subcategory Name
        // ... other fields if any
      },
      {
        "XCode": "MOB_SAMSUNG",
        "XName": "Samsung"
      }
      // ... more subcategories for the given main category
    ],
    "Message": "Data found."
  }
  ```
- **Notes:** 
  - `XName` is the display name for the subcategory, which should be touchable to navigate.

### Product Search API

This API is used to get a list of item names based on a search query, typically for a search suggestion dropdown.

#### 1. Get Item Name List by Search (`getData_JSON/`)
- **Method:** `POST` (FromBody)
- **Description:** Retrieves a list of product names matching the search text.
- **Stored Procedure:** `[Web].[Sp_Get_SM_Apps]`
- **Request Body Parameters for `strQuery` (as per provided image and implementation):
  - `Type`: "Get_ItemName_List_BySearch"
  - `Value`: Search Text (the user's input query)
  - `Value1`: Empty string `''`
  - `Value2`: Empty string `''`
  - `Value3`: Empty string `''`
  - `Value4`: Empty string `''`
  - `CultureId`: e.g., `'1'` for English
  - `Company`: `'3044'`
  - `UserId`: User ID or empty string `''` (pass if available)
- **Example `strQuery` (searching for "Mascara")**: `[Web].[Sp_Get_SM_Apps] 'Get_ItemName_List_BySearch','Mascara','','','','','1','3044',''`

- **Request Parameters Table (for `Sp_Get_SM_Apps` with `Type = Get_ItemName_List_BySearch`):

| # | Parameter  | Type   | Length | Description                           | Notes / Example Value      |
|---|------------|--------|--------|---------------------------------------|----------------------------|
| 1 | Type       | String | 50     | Defines the action to perform         | "Get_ItemName_List_BySearch"|
| 2 | Value      | String | 50     | Pass Search Text                      | e.g., "Mascara"            |
| 3 | Value1     | String | 50     | Generic parameter, not used           | Pass empty string `''`      |
| 4 | Value2     | String | 50     | Generic parameter, not used           | Pass empty string `''`      |
| 5 | Value3     | String | 50     | Generic parameter, not used           | Pass empty string `''`      |
| 6 | Value4     | String | 50     | Generic parameter, not used           | Pass empty string `''`      |
| 7 | CultureId  | int    | -      | Culture ID for localization           | "1" (English), "2" (Arabic)|
| 8 | Company    | String | 10     | Company identifier                    | "3044"                     |
| 9 | UserId     | String | 10     | User ID for personalized content      | Pass User ID or empty string `''` if not logged in |

- **Response Structure (Success Example - `Data` field content from `getData_JSON`):
  ```json
  {
    "success": 1,
    "row": [
      {
        "ItemName": "Mascara 2 in 1",
        "XCode": "PROD001" // Example: Product Code or Identifier
        // Potentially other fields like ItemId, ImageUrlTiny, etc.
      },
      {
        "ItemName": "Matte Blusher",
        "XCode": "PROD002"
      }
      // ... more matching items
    ],
    "Message": "Data found."
  }
  ```
- **Response Structure (No Results - `Data` field content):
  ```json
  {
    "success": 0,
    "row": [],
    "Message": "Data not found."
  }
  ```

- **Implementation Notes:**
  - `ItemName` is the display name of the product.
  - `XCode` (or a similar field like `ItemId`) is the unique identifier for the product, used for navigation to the product details page.
  - The API response structure should be confirmed with an actual API call if possible to ensure all relevant fields are captured (e.g., for displaying small images in suggestions if available).
  - The UI should display these items in a dropdown list below the search bar.
  - Tapping an item should typically navigate the user to the product details page for that item.

### Product Listing API

This API is used to get a list of products based on different criteria, such as navigating from a homepage category or the menu drawer.

#### 1. Get All Product List (`getData_JSON/`)
- **Method:** `POST` (FromBody)
- **Description:** Retrieves a list of products. The behavior depends on the `PageCode` and other parameters provided.
- **Stored Procedure:** `[Web].[Sp_Get_SM_Apps]`
- **Request Body Parameters for `strQuery` (Example: Navigating from Homepage Category):
  - `Type`: "Get_AllProduct_List"
  - `Value (PageCode)`: e.g., "Hctds,Prmtrs,HPCL,HPCt" (for homepage category click) or "MN" (for menu navigation)
  - `Value1 (Category)`: Category Xcode (Pass empty string if `HomePageCatSrNo` is used, or relevant Category XCode for menu navigation)
  - `Value2 (SubCategory)`: SubCategory Xcode (Pass empty string or relevant SubCategory XCode for menu navigation)
  - `Value3 (SearchName)`: Search term (Pass empty string if not a search context)
  - `Value4 (HomePageCatSrNo)`: SrNo of the category clicked on the homepage (or empty string if using menu navigation).
  - `CultureId`: e.g., `'1'` for English
  - `Company`: `'3044'`
  - `UserId`: User ID or empty string `''`
- **Example `strQuery` (Homepage Category SrNo 'HC001'):** 
  `[Web].[Sp_Get_SM_Apps] 'Get_AllProduct_List','Hctds,Prmtrs,HPCL,HPCt','','','','HC001','1','3044',''`
- **Example `strQuery` (Menu Category Navigation with Category XCode 'MOB'):** 
  `[Web].[Sp_Get_SM_Apps] 'Get_AllProduct_List','MN','MOB','','','','1','3044',''`
- **Example `strQuery` (Menu SubCategory Navigation with Category XCode 'MOB' and SubCategory XCode 'MOB_IPHONE'):** 
  `[Web].[Sp_Get_SM_Apps] 'Get_AllProduct_List','MN','MOB','MOB_IPHONE','','','1','3044',''`

- **Request Parameters Table (for `Sp_Get_SM_Apps` with `Type = Get_AllProduct_List`):

| # | Parameter         | Type   | Length | Description                           | Notes / Example Value          |
|---|-------------------|--------|--------|---------------------------------------|--------------------------------|
| 1 | Type              | String | 50     | Defines the action to perform         | "Get_AllProduct_List"          |
| 2 | Value (PageCode)  | String | 50     | Code indicating navigation source     | "Hctds,Prmtrs,HPCL,HPCt" for homepage category<br>"MN" for menu navigation |
| 3 | Value1 (Category) | String | 50     | Category Xcode                        | Pass `''` if using `HomePageCatSrNo`<br>Pass Category XCode (e.g., "MOB") for menu navigation |
| 4 | Value2 (SubCategory)| String | 50   | SubCategory Xcode                     | Pass `''` or SubCategory XCode (e.g., "MOB_IPHONE") for menu navigation |
| 5 | Value3 (SearchName)| String | 50    | Search term                           | Pass `''` if not a search context |
| 6 | Value4 (HomePageCatSrNo)| String | 50 | Homepage Category SrNo              | e.g., "HC001" for homepage navigation<br>Pass `''` for menu navigation |
| 7 | CultureId         | int    | -      | Culture ID for localization           | "1" (English), "2" (Arabic)    |
| 8 | Company           | String | 10     | Company identifier                    | "3044"                         |
| 9 | UserId            | String | 10     | User ID for personalized content      | Pass User ID or empty string `''` |

- **Expected Response Structure (Success Example - `Data` field content from `getData_JSON`):
  ```json
  {
    "success": 1,
    "row": [
      {
        "ItemCode": "ITM000123"
        // Potentially other minimal product identifiers or flags
      },
      // ... more items
    ],
    "Message": "Data found."
  }
  ```
  *Note: This API is expected to return a list of `ItemCode`s. Full details for each item must be fetched using `Get_ProductDetails_ByItemCode`.*

- **Response Scenarios (from `getData_JSON` `Data` field):
  - `success: 1`: Product list (of ItemCodes) found in `row`.
  - `success: 0`: No products found, `row` is empty. `Message` indicates "Data not found."
  - HTTP errors from `getData_JSON` call itself are handled by the `apiRequest` wrapper.

### Product Details API

This API is used to get detailed information for a single product using its ItemCode.

#### 1. Get Product Details By ItemCode (`getData_JSON/`)
- **Method:** `POST` (FromBody)
- **Description:** Retrieves detailed information for a specific product.
- **Stored Procedure:** `[Web].[Sp_Get_SM_Apps]`
- **Request Body Parameters for `strQuery`:
  - `Type`: "Get_ProductDetails_ByItemCode"
  - `Value (ItemCode)`: The `ItemCode` of the product.
  - `Value1 (Location)`: Location code (`'304401HO'` from `COMMON_PARAMS.Location`).
  - `Value2`: Empty string `''`
  - `Value3`: Empty string `''`
  - `Value4`: Empty string `''`
  - `CultureId`: e.g., `'1'` for English
  - `Company`: `'3044'`
  - `UserId`: User ID or empty string `''`
- **Example `strQuery` (ItemCode 'IM31790673', Location '304401HO'):** 
  `[Web].[Sp_Get_SM_Apps] 'Get_ProductDetails_ByItemCode','IM31790673','304401HO','','','','1','3044',''`

- **Request Parameters Table (for `Sp_Get_SM_Apps` with `Type = Get_ProductDetails_ByItemCode`):

| # | Parameter         | Type   | Length | Description                           | Notes / Example Value      |
|---|-------------------|--------|--------|---------------------------------------|----------------------------|
| 1 | Type              | String | 50     | Defines the action to perform         | "Get_ProductDetails_ByItemCode"|
| 2 | Value (ItemCode)  | String | 50     | Product's Item Code                   | e.g., "IM31790673"          |
| 3 | Value1 (Location) | String | 50     | Location Code                         | e.g., "304401HO"           |
| 4 | Value2            | String | 50     | Generic parameter, not used           | Pass empty string `''`      |
| 5 | Value3            | String | 50     | Generic parameter, not used           | Pass empty string `''`      |
| 6 | Value4            | String | 50     | Generic parameter, not used           | Pass empty string `''`      |
| 7 | CultureId         | int    | -      | Culture ID for localization           | "1" (English), "2" (Arabic)|
| 8 | Company           | String | 10     | Company identifier                    | "3044"                     |
| 9 | UserId            | String | 10     | User ID for personalized content      | Pass User ID or empty string `''` |

- **Actual Response Structure (Success Example - for ItemCode 'IM31790673'):**
  ```json
  {
    "success": 1,
    "row": [
      {
        "Image1": "7587878907130228_cff50d95.png",
        "Image2": "7587877867267795_76a31fe9.png",
        "Image3": "Default.jpg",
        "ProductBrand": "Apple",
        "ItemCode": "IM31790673",
        "ItemName": "IPhone 6 Mobile 64 GB Model A1586",
        "Description": "The iPhone 6 (Model A1586) is a smartphone released by Apple in 2014, offering a sleek design and an improved user experience over previous iPhone models. The 64GB storage variant offers ample space for apps, photos, videos, and other content...",
        "Barcode": "888462062954",
        "IsWishListItem": false,
        "StockQty": 2,
        "OldPrice": 0,
        "Discount": 0,
        "NewPrice": 20
      }
    ],
    "Message": "Data found."
  }
  ```

- **Response Field Descriptions:**
  - `Image1`, `Image2`, `Image3`: Image filenames for product photos
  - `ProductBrand`: Brand name (e.g., "Apple")
  - `ItemCode`: Unique product identifier 
  - `ItemName`: Display name of the product
  - `Description`: Detailed product description
  - `Barcode`: Product barcode
  - `IsWishListItem`: Boolean indicating if the product is in the user's wishlist
  - `StockQty`: Available stock quantity
  - `OldPrice`: Original price (if there's a discount)
  - `Discount`: Discount amount
  - `NewPrice`: Current price (after discount)

- **Response Scenarios (from `getData_JSON` `Data` field):
  - `success: 1`: Product details found in `row[0]`.
  - `success: 0`: Product details not found, `row` is empty. `Message` indicates "Data not found."

#### 2. Get Special Description List By ItemCode (`getData_JSON/`)
- **Method:** `POST` (FromBody)
- **Description:** Retrieves detailed descriptive information for a specific product, organized by sections.
- **Stored Procedure:** `[Web].[Sp_Get_SM_Apps]`
- **Request Body Parameters for `strQuery`:**
  - `Type`: "Get_Special_Description_List_ByItemCode"
  - `Value (ItemCode)`: The `ItemCode` of the product.
  - `Value1`: Empty string `''`
  - `Value2`: Empty string `''`
  - `Value3`: Empty string `''`
  - `Value4`: Empty string `''`
  - `CultureId`: e.g., `'1'` for English
  - `Company`: `'3044'`
  - `UserId`: User ID or empty string `''`
- **Example `strQuery` (ItemCode 'IM31790673'):** 
  `[Web].[Sp_Get_SM_Apps] 'Get_Special_Description_List_ByItemCode','IM31790673','','','','','1','3044',''`

- **Response Structure (Success Example):**
  ```json
  {
    "success": 1,
    "row": [
      {
        "Title": "Dimensions",
        "Description": "Height: 6.1 inches, Width: 2.9 inches, Depth: 0.3 inches"
      },
      {
        "Title": "Display",
        "Description": "6.4-inch AMOLED, 90Hz refresh rate, 1080 x 2400 pixels"
      },
      // ... more description items
    ],
    "Message": "Data found."
  }
  ```

- **Response Structure (No Data Found):**
  ```json
  {
    "success": 0,
    "row": [],
    "Message": "Data not found."
  }
  ```

- **Implementation Notes:**
  - This API provides detailed technical specifications and feature descriptions for products.
  - Each row in the response represents a separate section of product details with a title and description.
  - Sections are typically displayed in the product details page under the main product description.
  - If no special descriptions are available for a product, the API will return with `success: 0` and an empty `row` array.
  - The implementation should handle both success and no-data scenarios gracefully.

**Request Parameters Table:**

| # | Parameter  | Type   | Length | Description                           |
|---|------------|--------|--------|---------------------------------------|
| 1 | Type       | String | 50     | "Get_Special_Description_List_ByItemCode" |
| 2 | Value      | String | 50     | Product ItemCode                      |
| 3 | Value1     | String | 50     | Pass empty string                     |
| 4 | Value2     | String | 50     | Pass empty string                     |
| 5 | Value3     | String | 50     | Pass empty string                     |
| 6 | Value4     | String | 50     | Pass empty string                     |
| 7 | CultureId  | int    | -      | Culture ID (1-English, 2-Arabic)      |
| 8 | Company    | String | 10     | Company ID (fixed: 3044)              |
| 9 | UserId     | String | 10     | User ID (pass empty string if not logged in) |



### Product Listing & Details APIs

This section covers the two-step process to list products and then get their details.

#### 1. Get All Product List (Direct API Call)

- **Method:** `GET`
- **Endpoint:** `Get_AllProduct_List` (e.g., `https://api.souqmaria.com/api/MerpecWebApi/Get_AllProduct_List`)
- **Description:** Retrieves a list of product identifiers (ItemCodes) based on various criteria. This is a direct HTTP GET request, not via `getData_JSON`.
- **Request Parameters (Query Parameters / FromUri):

| Parameter         | Type   | Length | Description                                     | Required | Example Value                |
|-------------------|--------|--------|-------------------------------------------------|----------|------------------------------|
| `PageCode`        | String | 10     | Code indicating which category to call          | Yes      | `HPC2`                       |
| `Category`        | String | max    | Category Xcode                                  | No       | `CAT001`                     |
| `SubCategory`     | String | max    | Sub Category Xcode                              | No       | `SUBCAT005`                  |
| `SearchName`      | String | max    | Search Text Value                               | No       | `Lipstick`                   |
| `HomePageCatSrNo` | String | max    | Homepage Category SrNo (Srno of homepage category)| No     | `HC31790001`                 |
| `UserId`          | String | 10     | User's ID                                       | No       | `USER123`                    |
| `Company`         | int    | -      | Company Identifier                              | Yes      | `3044`                       |
| `CultureId`       | int    | -      | Culture ID (1 for English, 2 for Arabic)        | Yes      | `1`                          |

- **Notes on `PageCode` from API Documentation Image:**
  - Search: `Srch` (and pass `SearchName`)
  - Menu (Category only): `MN` (and pass `Category` Xcode)
  - Menu (Category & SubCategory): `MN` (and pass `Category` Xcode and `SubCategory` Xcode)
  - Homepage Category / Categories Tab: `HPC2` (and pass `HomePageCatSrNo`)
  - Banner / Advertisement: Same as menu.

- **Expected Response Structure (Success Example):
  ```json
  {
    "List": [
      { "ItemCode": "ITM000123" },
      { "ItemCode": "ITM000456" }
      // ... more items
    ],
    "ResponseCode": "2",
    "Message": "List Found"
  }
  ```

- **Expected Response Structure (Not Found / Error Example):
  ```json
  {
    "List": null,
    "ResponseCode": "-4",
    "Message": "List not Found"
  }
  ```
  Other error codes like `"-6"` (Server side validation) or `"-2"` (Something went wrong) are also possible.

### Product Images for All Products Page

To display product images on the All Products Page (category listing), use the following URL pattern:

```
https://erp.merpec.com/Upload/CompanyLogo/3044/{imageName}
```

- Replace `{imageName}` with the value of the `Item_Image1` field from the product API response for each product.
- Example: If `Item_Image1` is `74ebc450_IM31110511_1.png`, the image URL will be:
  `https://erp.merpec.com/Upload/CompanyLogo/3044/74ebc450_IM31110511_1.png`

This should be used for rendering product images in the grid/list as per the UI design.

### AddToCart API

**Endpoint:** `https://api.souqmaria.com/api/MerpecWebApi/AddToCart`

**Method:** POST

**Parameters:**

| Parameter | Type   | Required | Description                                     |
|-----------|--------|----------|-------------------------------------------------|
| ItemCode  | string | Yes      | Product code/SKU                                |
| NewPrice  | number | Yes      | Current price of the product                    |
| OldPrice  | number | Yes      | Original price of the product (if discounted)   |
| Discount  | number | Yes      | Discount amount                                 |
| UserId    | string | No       | User ID for logged in users (empty for guests)  |
| UniqueId  | string | Yes      | Unique identifier for the cart item             |
| IpAddress | string | Yes      | IP address of the client                        |
| Company   | string | Yes      | Company code (typically '3044')                 |
| Location  | string | Yes      | Location code (typically '304401HO')            |
| Qty       | number | Yes      | Quantity of the product to add                  |

**Example Request:**
```json
{
  "ItemCode": "IM31790673",
  "NewPrice": 20,
  "OldPrice": 0,
  "Discount": 0,
  "UserId": "",
  "UniqueId": "test-1623456789",
  "IpAddress": "127.0.0.1",
  "Company": "3044",
  "Location": "304401HO", 
  "Qty": 1
}
```

**Example Response (Success):**
```json
{
  "ResponseCode": "2",
  "Message": "Item added to your cart.",
  "TrackId": null
}
```

**Response Codes:**

| Code  | Description                                          |
|-------|------------------------------------------------------|
| 2     | Success - Item added to cart successfully            |
| 4     | Updated - Item already in cart, quantity updated     |
| -4    | Error - Stock not available                          |
| -10   | Error - General error with message                   |

**Implementation Notes:**
- The `UniqueId` should be generated dynamically for each new cart item, typically using a timestamp.
- For guest users, pass an empty string for `UserId`.
- In mobile apps, `IpAddress` can be set to a default value like "127.0.0.1" since getting the actual device IP may not be straightforward.
- Response should be handled based on the `ResponseCode` value, showing appropriate UI feedback to the user.

### Cart Management APIs

#### 1. Get Cart Products (`getData_JSON/`)
- **Method:** `POST` (FromBody)
- **Description:** Retrieves a list of products in the user's cart
- **Request Body:**
  ```json
  {
    "strQuery": "[Web].[SP_Template1_Get_CartProductsDetails_Apps] '','127.0.0.1','unique-id-string',3044,1"
  }
  ```
- **Request Parameters Table (for the SP):**

| # | Parameter  | Type   | Description                           |
|---|------------|--------|---------------------------------------|
| 1 | UserId     | string | User ID for logged in users, or empty string for guest users |
| 2 | IpAddress  | string | Client's IP address                   |
| 3 | UniqueId   | string | Cart's unique identifier              |
| 4 | Company    | int    | Company code (3044)                   |
| 5 | CultureId  | int    | Culture ID (1 for English)            |

- **Success Response:**
  ```json
  {
    "success": 1,
    "row": [
      {
        "CartID": 28427,
        "ProductCode": "IM31790673",
        "ProductName": "IPhone 6 Mobile 64 GB Model A1586",
        "Image1": "7587878907130228_cff50d95.png",
        "Price": 20,
        "Quantity": 1,
        "SubTotal": 20,
        "NetAmount": 20
      }
    ],
    "Message": "Data found."
  }
  ```

- **Error Response:**
  ```json
  {
    "success": 0,
    "row": [],
    "Message": "Data not found."
  }
  ```

#### 2. Update Cart Quantity (`UpdateCartQty`)
- **Method:** `POST` (FromBody)
- **Description:** Updates the quantity of an item in the cart
- **Request Body:**
  ```json
  {
    "CartId": 28427,
    "Qty": 2,
    "Company": "3044",
    "Location": "304401HO"
  }
  ```
- **Request Parameters Table:**

| # | Parameter  | Type   | Description                           |
|---|------------|--------|---------------------------------------|
| 1 | CartId     | int    | ID of the cart item to update         |
| 2 | Qty        | int    | New quantity for the item             |
| 3 | Company    | string | Company code ("3044")                 |
| 4 | Location   | string | Location code ("304401HO")            |

- **Success Response:**
  ```json
  {
    "ResponseCode": "2",
    "Message": "Updated Successfully!!!",
    "TrackId": null
  }
  ```

- **Response Codes:**

| Code | Description                                      |
|------|--------------------------------------------------|
| 2    | Success - Item quantity updated successfully     |
| -2   | Error - Failed to update item quantity           |
| -4   | Error - Stock not available for requested quantity |
| -10  | Error - Something went wrong                     |
| -6   | Error - Server side validation error             |

#### 3. Delete Cart Item (`DeleteCartItem`)
- **Method:** `POST` (FromBody)
- **Description:** Removes an item from the cart
- **Request Body:**
  ```json
  {
    "CartId": 28427,
    "Company": "3044"
  }
  ```
- **Request Parameters Table:**

| # | Parameter  | Type   | Description                           |
|---|------------|--------|---------------------------------------|
| 1 | CartId     | int    | ID of the cart item to delete         |
| 2 | Company    | string | Company code ("3044")                 |

- **Success Response:**
  ```json
  {
    "ResponseCode": "2",
    "Message": "Item deleted from your Cart.",
    "TrackId": null
  }
  ```

- **Response Codes:**

| Code | Description                                      |
|------|--------------------------------------------------|
| 2    | Success - Item deleted successfully              |
| -2   | Error - Failed to delete item                    |
| -4   | Error - Item not found in cart                   |
| -10  | Error - Something went wrong                     |
| -6   | Error - Server side validation error             |

### Wishlist APIs

#### 1. Add to Wishlist (`/CRUD_Wishlist/`)
- **Method:** `POST` (FromBody)
- **Description:** Adds an item to the wishlist
- **Request Body:**
  ```json
  {
    "ItemCode": "string", 
    "UserId": "string", 
    "IpAddress": "string", 
    "CompanyId": 3044, 
    "Command": "Save"
  }
  ```
- **Request Parameters Table:**

| # | Parameter  | Type   | Length | Description                     | Required |
|---|------------|--------|--------|---------------------------------|----------|
| 1 | ItemCode   | String | 10     | Product code to add to wishlist | Yes      |
| 2 | UserId     | String | 10     | User's ID                       | Yes      |
| 3 | IpAddress  | String | 100    | User's IP Address               | Yes      |
| 4 | CompanyId  | int    | -      | Company ID (fixed: 3044)        | Yes      |
| 5 | Command    | String | 50     | Command (must be "Save")        | Yes      |

- **Response Scenarios & Codes:**
  - **Success:** `StatusCode: 200`, `ResponseCode: 2`
    - **Message:** "Added Successfully!!!"
  - **Save Not Successful:** `StatusCode: 200`, `ResponseCode: -2`
    - **Message:** "Added Not Successfully!!!"
  - **Command Not Passed:** `StatusCode: 200`, `ResponseCode: 6`
    - **Message:** "Command Not Passed!!!"
  - **Something Went Wrong (General):** `StatusCode: 200`, `ResponseCode: -10`
    - **Message:** "Something went wrong...Please try again later!!!"
  - **Server Side Validation Error:** `StatusCode: 400`, `ResponseCode: -8`
    - **Message:** "Server side validation error...Please try again later!!!"
  - **Something Went Wrong (Server related):** `StatusCode: 500`, `ResponseCode: -2`
    - **Message:** "Something went wrong...Please try again later!!!"

#### 2. Delete from Wishlist (`/CRUD_Wishlist/`)
- **Method:** `POST` (FromBody)
- **Description:** Removes an item from the wishlist
- **Request Body:**
  ```json
  {
    "ItemCode": "string", 
    "UserId": "string", 
    "IpAddress": "string", 
    "CompanyId": 3044, 
    "Command": "Delete"
  }
  ```
- **Request Parameters Table:**

| # | Parameter  | Type   | Length | Description                     | Required |
|---|------------|--------|--------|---------------------------------|----------|
| 1 | ItemCode   | String | 10     | Product code to delete          | Yes      |
| 2 | UserId     | String | 10     | User's ID                       | Yes      |
| 3 | IpAddress  | String | 100    | User's IP Address               | Yes      |
| 4 | CompanyId  | int    | -      | Company ID (fixed: 3044)        | Yes      |
| 5 | Command    | String | 50     | Command (must be "Delete")      | Yes      |

- **Response Scenarios & Codes:**
  - **Success:** `StatusCode: 200`, `ResponseCode: 4`
    - **Message:** "Deleted Successfully!!!"
  - **Delete Not Successful:** `StatusCode: 200`, `ResponseCode: -2`
    - **Message:** "Deleted Not Successfully!!!"
  - **Data Not Found:** `StatusCode: 200`, `ResponseCode: -4`
    - **Message:** "Data Not Found!!!"
  - **Command Not Passed:** `StatusCode: 200`, `ResponseCode: -6`
    - **Message:** "Command Not Passed!!!"
  - **Something Went Wrong (General):** `StatusCode: 200`, `ResponseCode: -10`
    - **Message:** "Something went wrong...Please try again later!!!"
  - **Server Side Validation Error:** `StatusCode: 400`, `ResponseCode: -8`
    - **Message:** "Server side validation error...Please try again later!!!"
  - **Something Went Wrong (Server related):** `StatusCode: 500`, `ResponseCode: -2`
    - **Message:** "Something went wrong...Please try again later!!!"

#### 3. Get Wishlist Items (`getData_JSON/`)
- **Method:** `POST` (FromBody)
- **Description:** Retrieves a list of items in the user's wishlist
- **Request Body:**
  ```json
  {
    "strQuery": "[Web].[Sp_Templete1_Get_MyWishlist_Apps] 'Get_MyWishlist','userId','','','','',1,3044"
  }
  ```
- **Request Parameters Table (for the SP):**

| # | Parameter  | Type    | Length | Description              | Required |
|---|------------|---------|--------|--------------------------|----------|
| 1 | Type       | string  | 50     | Pass "Get_MyWishlist"    | Yes      |
| 2 | Value      | string  | 50     | Pass User Id             | Yes      |
| 3 | Value1     | string  | 50     | Pass Empty string        | No       |
| 4 | Value2     | string  | 50     | Pass Empty string        | No       |
| 5 | Value3     | string  | 50     | Pass Empty string        | No       |
| 6 | Value4     | string  | 50     | Pass Empty string        | No       |
| 7 | CultureId  | int     | -      | Pass Culture Id (1 or 2) | Yes      |
| 8 | Company    | string  | 10     | Pass Company Id - 3044   | Yes      |

- **Response Structure:**
  ```json
  {
    "success": 1,
    "row": [
      {
        "ItemCode": "string",
        "ItemImage": "string",
        "ItemName": "string",
        "OnlineActualPrice": number
      }
    ],
    "Message": "Data found."
  }
  ```

- **Response Scenarios:**
  - **Success (Data Found):** `success: 1`, with populated `row` array
    - **Message:** "Data found."
  - **Success (No Data):** `success: 0`, with empty `row` array
    - **Message:** "Data not found."

- **Implementation Notes:**
  - Ensure the API returns properly-formatted image URLs with the base path: "https://api.souqmaria.com/ProductImages/".
  - Handle empty responses by showing a proper "Empty Wishlist" UI.
  - Use appropriate UI indicators (loading spinners, error messages) during data fetching.


### Promo Code APIs

#### 1. Apply Promo Code (`/Apply_PromoCode`)
- **Method:** `POST`
- **Description:** Applies a promo code to the user's cart for discount.
- **Request Body:**
  ```json
  {
    "PromoCode": "string (50)",
    "UserId": "string (10)",
    "IpAddress": "string (50)",
    "UniqueId": "string (50)",
    "BuyNow": "string (10)",
    "Company": "int (3044)"
  }
  ```
- **Request Parameters Table:**

| # | Parameter | Type   | Length | Description                     | Required |
|---|-----------|--------|--------|---------------------------------|----------|
| 1 | PromoCode | String | 50     | Promo code to apply             | Yes      |
| 2 | UserId    | String | 10     | User ID (empty for guest users) | No       |
| 3 | IpAddress | String | 50     | IP address of the device        | Yes      |
| 4 | UniqueId  | String | 50     | Unique device identifier        | Yes      |
| 5 | BuyNow    | String | 10     | Item code if Buy Now, else empty| No       |
| 6 | Company   | Int    | -      | Company ID (3044)               | Yes      |

- **Response Body:**
  ```json
  {
    "ResponseCode": "string",
    "Message": "string",
    "TrackId": "string",
    "DiscountAmount": "number (optional)"
  }
  ```

- **Response Codes:**

| ResponseCode | Description |
|--------------|-------------|
| 2            | Success - Promo code applied successfully |
| -2           | General failure applying promo code |
| -4, -6       | Invalid discount code |
| -8           | Minimum cart value requirement not met |
| -10          | Promo items not available in cart |
| -12, -14     | Invalid promo code |
| -16          | Login required to use promo code |
| -18          | Cart item is not valid |
| -20          | General error in promo code application |

#### 2. Remove Promo Code (`/Remove_PromoCode`)
- **Method:** `POST`
- **Description:** Removes a previously applied promo code from the user's cart.
- **Request Body:**
  ```json
  {
    "PromoCode": "string (50)",
    "UserId": "string (10)",
    "IpAddress": "string (50)",
    "UniqueId": "string (50)",
    "BuyNow": "string (10)",
    "Company": "int (3044)"
  }
  ```
- **Request Parameters Table:**

| # | Parameter | Type   | Length | Description                     | Required |
|---|-----------|--------|--------|---------------------------------|----------|
| 1 | PromoCode | String | 50     | Promo code to remove            | Yes      |
| 2 | UserId    | String | 10     | User ID (empty for guest users) | No       |
| 3 | IpAddress | String | 50     | IP address of the device        | Yes      |
| 4 | UniqueId  | String | 50     | Unique device identifier        | Yes      |
| 5 | BuyNow    | String | 10     | Item code if Buy Now, else empty| No       |
| 6 | Company   | Int    | -      | Company ID (3044)               | Yes      |

- **Response Body:**
  ```json
  {
    "ResponseCode": "string",
    "Message": "string",
    "TrackId": "string"
  }
  ```

- **Response Codes:**

| ResponseCode | Description |
|--------------|-------------|
| 2            | Success - Promo code removed successfully |
| -2           | Failure removing promo code |
| -10          | General error in promo code removal |

- **Example Responses:**
  - Cart item not valid:
    ```json
    {"ResponseCode":"-18","Message":"Cart item is not valid!!!","TrackId":null}
    ```
  - Minimum cart value not met:
    ```json
    {"ResponseCode":"-8","Message":"Min Cart Value invalid","TrackId":null}
    ```

- **Implementation Notes:**
  - Before applying a promo code, ensure that the cart contains valid items.
  - The BuyNow parameter should contain the item code if the user clicked "Buy Now" on a product page, otherwise it should be empty.
  - When a promo code is successfully applied, it should return a DiscountAmount that can be used to update the cart total.
  - Handle all error cases gracefully and display appropriate messages to the user.

### Product Special Description and Related Products APIs

#### 1. Get Special Description List (`/getData_JSON/`)
- **Method:** `POST`
- **Description:** Retrieves special description details for a product.
- **Request Body:**
  ```json
  {
    "strQuery": "[Web].[Sp_Get_SM_Apps] 'Get_Special_Description_List_ByItemCode','ITEM_CODE','','','','',1,3044,''"
  }
  ```
- **Request Parameters Table:**

| # | Parameter | Type   | Description                         | Required |
|---|-----------|--------|-------------------------------------|----------|
| 1 | strQuery  | String | Stored procedure query with item code | Yes    |

- **Example strQuery format:**
  ```
  [Web].[Sp_Get_SM_Apps] 'Get_Special_Description_List_ByItemCode','IM31790047','','','','',1,3044,''
  ```

- **Response Body:**
  ```json
  {
    "success": 1,
    "row": [
      {
        "Data": "Feature description 1"
      },
      {
        "Data": "Feature description 2"
      }
    ],
    "Message": "Data found."
  }
  ```

- **Response Codes:**
  - success: 1 (data found)
  - success: 0 (no data found)

- **Example Response:**
  ```json
  {
    "success": 1,
    "row": [
      {"Data": "6.56\" HD+ Waterdrop Notch Display: Enjoy vibrant visuals with a 6.56-inch HD+ display featuring a 1612x720 resolution, perfect for media, gaming, and browsing."},
      {"Data": "IPX4 Water & IP5X Dust Resistance: Built to withstand splashes and dust, making it durable for everyday use in challenging conditions."}
    ],
    "Message": "Data found."
  }
  ```

#### 2. Get Related Products List (`/getData_JSON/`)
- **Method:** `POST`
- **Description:** Retrieves related products for a specific product.
- **Request Body:**
  ```json
  {
    "strQuery": "[Web].[Sp_Get_SM_Apps] 'Get_Related_Products_List_ByItemCode','ITEM_CODE','','','','',1,3044,''"
  }
  ```
- **Request Parameters Table:**

| # | Parameter | Type   | Description                         | Required |
|---|-----------|--------|-------------------------------------|----------|
| 1 | strQuery  | String | Stored procedure query with item code | Yes    |

- **Example strQuery format:**
  ```
  [Web].[Sp_Get_SM_Apps] 'Get_Related_Products_List_ByItemCode','IM31790047','','','','',1,3044,''
  ```

- **Response Body:**
  ```json
  {
    "success": 1,
    "row": [
      {
        "ItemImage": "image_filename.png",
        "ItemCode": "IM12345678",
        "ItemName": "Product Name",
        "OldPrice": 0.000,
        "Discount": 0,
        "NewPrice": 50.000,
        "IsWishListItem": false
      }
    ],
    "Message": "Data found."
  }
  ```

- **Response Codes:**
  - success: 1 (data found)
  - success: 0 (no data found)

- **Example Response:**
  ```json
  {
    "success": 1,
    "row": [
      {
        "ItemImage": "74ebc450_IM31110511_1.png",
        "ItemCode": "IM31790047",
        "ItemName": "oppo A77 (4GB RAM 128GB Storage) Sky Blue",
        "OldPrice": 0.000,
        "Discount": 0,
        "NewPrice": 50.000,
        "IsWishListItem": false
      }
    ],
    "Message": "Data found."
  }
  ```

- **Implementation Notes:**
  - These endpoints use the existing `getData_JSON` endpoint with specific stored procedure queries.
  - The `ITEM_CODE` parameter should be replaced with the actual product item code.
  - The culture ID (1 for English, 2 for Arabic) can be changed if needed.
  - The user ID can be provided if available, otherwise pass an empty string.

### Product Filtering API

#### Get Filtered Product List (`Get_AllProduct_List_FilterApply`)

- **Method:** `POST`
- **Description:** Retrieves a filtered list of products based on multiple criteria including category, brand, price range, and sorting options.
- **Request Body:**
  ```json
  {
    "PageCode": "string",
    "Category": "string",
    "SubCategory": "string",
    "SearchName": "string",
    "HomePageCatSrNo": "string",
    "UserId": "string",
    "Company": "string | number",
    "CultureId": "string | number",
    "Arry_Category": "string[]",
    "Arry_SubCategory": "string[]",
    "Arry_Brand": "string[]",
    "Arry_Color": "string[]",
    "MinPrice": "number",
    "MaxPrice": "number",
    "SortBy": "string"
  }
  ```

- **Request Parameters Table:**

| # | Parameter | Type | Length | Description | Required |
|---|-----------|------|--------|-------------|----------|
| 1 | PageCode | String | - | Page code (e.g., "HPC2", "Srch", "MN") | Yes |
| 2 | Category | String | - | Category code, required for "MN" page code | Conditional |
| 3 | SubCategory | String | - | Subcategory code | No |
| 4 | SearchName | String | - | Search text, required for "Srch" page code | Conditional |
| 5 | HomePageCatSrNo | String | - | HomePage category number | Conditional |
| 6 | UserId | String | - | User ID (empty for guest users) | No |
| 7 | Company | String/Number | - | Company ID (fixed: 3044) | Yes |
| 8 | CultureId | String/Number | - | Culture ID (1 for English, 2 for Arabic) | Yes |
| 9 | Arry_Category | Array | - | Array of selected category codes | No |
| 10 | Arry_SubCategory | Array | - | Array of selected subcategory codes | No |
| 11 | Arry_Brand | Array | - | Array of selected brand codes | No |
| 12 | Arry_Color | Array | - | Array of selected color codes | No |
| 13 | MinPrice | Number | - | Minimum price for filtering | Yes |
| 14 | MaxPrice | Number | - | Maximum price for filtering | Yes |
| 15 | SortBy | String | - | Sort order code (e.g., "LtoH", "HtoL", "AtoZ") | Yes |

- **Response Structure:**
  ```json
  {
    "List": {
      "Productlist": [
        {
          "Item_Image1": "string",
          "Item_XCode": "string",
          "Item_XName": "string",
          "OldPrice": "number",
          "Discount": "number",
          "NewPrice": "number",
          "IsWishListItem": "boolean",
          "Last_CategoryName": "string"
        }
      ],
      "li_Brand_List": [
        {
          "XCode": "string",
          "XName": "string",
          "XMaster": "string",
          "XLink": "string",
          "IsSelected": "boolean"
        }
      ],
      "li_Category_List": [
        {
          "XCode": "string",
          "XName": "string",
          "XMaster": "string",
          "XLink": "string",
          "IsSelected": "boolean"
        }
      ],
      "li_SubCategory_List": [
        {
          "XCode": "string",
          "XName": "string",
          "XMaster": "string",
          "XLink": "string",
          "IsSelected": "boolean"
        }
      ],
      "li_SortBy_List": [
        {
          "XCode": "string",
          "XName": "string",
          "XMaster": "string",
          "XLink": "string",
          "IsSelected": "boolean"
        }
      ],
      "MinPrice": "number",
      "MaxPrice": "number"
    },
    "ResponseCode": "string",
    "Message": "string"
  }
  ```

- **Response Codes:**

| ResponseCode | Description |
|--------------|-------------|
| 2 | Success - List found |
| -4 | Not found - No products match the criteria |

- **Example Success Response:**
  ```json
  {
    "List": {
      "Productlist": [
        {
          "Item_Image1": "7587878907130228_cff50d95.png",
          "Item_XCode": "IM31790673",
          "Item_XName": "IPhone 6 Mobile 64 GB Model A1586",
          "OldPrice": 0.000,
          "Discount": 0.00,
          "NewPrice": 20.000,
          "IsWishListItem": false,
          "Last_CategoryName": "M-bile1"
        }
      ],
      "li_Brand_List": [
        {
          "XCode": "3044PB0068",
          "XName": "Apple",
          "XMaster": "Brand",
          "XLink": "",
          "IsSelected": true
        },
        ...
      ],
      "li_Category_List": [...],
      "li_SubCategory_List": [...],
      "li_SortBy_List": [...],
      "MinPrice": 0.0,
      "MaxPrice": 0.0
    },
    "ResponseCode": "2",
    "Message": "List Found"
  }
  ```

- **Implementation Notes:**
  - Always include all filter parameters even if not all are used.
  - SortBy options include: 
    - "Srt_Dflt" (Default Sorting)
    - "LtoH" (Price: Low to High)
    - "HtoL" (Price: High to Low)
    - "AtoZ" (Sort by A to Z)
    - "ZtoA" (Sort by Z to A)
    - "Srt_Nwst" (Sort by New Arrival)
    - "Srt_Old" (Sort by Old)
  - The response includes the product list along with available filter options that can be displayed to the user.
  - Filter option lists (brands, categories, etc.) include an IsSelected property to indicate which options are currently active.

### Address and Checkout APIs

#### 1. Get Country List (`/getData_JSON/`)

- **Method:** `POST`
- **Description:** Retrieves the list of available countries for address forms.
- **Request Body:**
  ```json
  {
    "strQuery": "[Web].[Sp_CheckoutMst_Apps_SM] 'Get_Country_List','','','','','',1,3044,''"
  }
  ```

- **Response Structure:**
  ```json
  {
    "success": 1,
    "row": [
      {
        "XCode": 69,
        "XName": "Kuwait"
      }
      // More countries if available
    ],
    "Message": "Data found."
  }
  ```

- **Response Codes:**
  - success: 1 (data found)
  - success: 0 (no data found)

#### 2. Get State List (`/getData_JSON/`)

- **Method:** `POST`
- **Description:** Retrieves the list of states/regions for a specific country.
- **Request Body:**
  ```json
  {
    "strQuery": "[Web].[Sp_CheckoutMst_Apps_SM] 'Get_State_List','69','','','','',1,3044,''"
  }
  ```
  Where '69' is the country XCode.

- **Response Structure:**
  ```json
  {
    "success": 1,
    "row": [
      {
        "XCode": 238,
        "XName": "Ahmadi"
      },
      {
        "XCode": 239,
        "XName": "Farwaniya"
      }
      // More states if available
    ],
    "Message": "Data found."
  }
  ```

- **Response Codes:**
  - success: 1 (data found)
  - success: 0 (no data found)

#### 3. Get City List (`/getData_JSON/`)

- **Method:** `POST`
- **Description:** Retrieves the list of cities for a specific state/region.
- **Request Body:**
  ```json
  {
    "strQuery": "[Web].[Sp_CheckoutMst_Apps_SM] 'Get_City_List','240','','','','',1,3044,''"
  }
  ```
  Where '240' is the state XCode.

- **Response Structure:**
  ```json
  {
    "success": 1,
    "row": [
      {
        "XCode": 2047,
        "XName": "Al-Bidea"
      },
      {
        "XCode": 2048,
        "XName": "Al-Siddeeq"
      }
      // More cities if available
    ],
    "Message": "Data found."
  }
  ```

- **Response Codes:**
  - success: 1 (data found)
  - success: 0 (no data found)

#### 4. Guest User Registration (`/Guest_SaveUserRegistration`)

- **Method:** `POST`
- **Description:** Registers a guest user during checkout without creating a full account.
- **Request Body:**
  ```json
  {
    "FullName": "string",
    "Email": "string",
    "Mobile": "string",
    "IpAddress": "string",
    "Source": "string",
    "CompanyId": "number"
  }
  ```

- **Request Parameters Table:**

| # | Parameter | Type | Length | Description | Required |
|---|-----------|------|--------|-------------|----------|
| 1 | FullName | String | 128 | User's full name | Yes |
| 2 | Email | String | 72 | User's email address | Yes |
| 3 | Mobile | String | 16 | User's mobile number | Yes |
| 4 | IpAddress | String | 128 | User's IP address | Yes |
| 5 | Source | String | 10 | Device platform ("Android"/"iOS") | Yes |
| 6 | CompanyId | Number | - | Company ID (fixed: 3044) | Yes |

- **Response Structure:**
  ```json
  {
    "ResponseCode": "string",
    "Message": "string",
    "TrackId": "string"
  }
  ```

- **Response Codes:**

| ResponseCode | Description |
|--------------|-------------|
| 2 | Success - User Registration Save Successfully!!! |
| 4 | User Already Registered |
| -2 | Server Error - Something went wrong |
| -6 | Server validation error |
| -8 | Server validation error |
| -10 | Something went wrong... |

- **Example Success Response:**
  ```json
  {
    "ResponseCode": "2",
    "Message": "User Registration Save Successfully!!!",
    "TrackId": "8010"
  }
  ```

- **Implementation Notes:**
  - This endpoint is used during guest checkout to register the user's basic information.
  - The TrackId returned in a successful response should be stored and used for subsequent checkout steps.
  - Source parameter should be determined programmatically based on the device platform.
  - IpAddress should be obtained from the device, but can be set to a placeholder like "127.0.0.1" if not available.

### Checkout API Endpoints

#### Get Payment Mode List (`Get_PaymentMode_List`)
- **Method:** `POST` to `/getData_JSON`
- **Description:** Retrieves available payment methods for checkout
- **Request Body:**
  ```json
  {
    "strQuery": "[Web].[Sp_CheckoutMst_Apps_SM] 'Get_PaymentMode_List','','','','','',1,3044,''"
  }
  ```
- **Response:**
  ```json
  {
    "success": 1,
    "row": [
      {
        "XCode": "01PMCash",
        "XName": "Cash"
      }
    ],
    "Message": "Data found."
  }
  ```
- **Status Codes:**
  - `1` - Success, data found
  - `0` - No data found

#### Guest User Registration (`Guest_SaveUserRegistration`)
- **Method:** `POST`
- **Description:** Registers a guest user during checkout to generate a TrackId
- **Request Body:**
  ```json
  {
    "FullName": "string",
    "Email": "string",
    "Mobile": "string",
    "IpAddress": "string",
    "Source": "iOS" | "Android",
    "CompanyId": 3044
  }
  ```
- **Response:**
  ```json
  {
    "ResponseCode": "2",
    "Message": "Guest registration successful",
    "TrackId": "string"
  }
  ```
- **Status Codes:**
  - `2` - Success
  - `-2` - Error

#### Save Checkout (`Save_Checkout`)
- **Method:** `POST`
- **Description:** Saves the complete checkout order
- **Request Body:**
  ```json
  {
    "UserID": "string",        // Use TrackId for guest users
    "IpAddress": "string",
    "UniqueId": "string",
    "Company": "int",
    "CultureId": "int",
    "BuyNow": "string",
    "Location": "string",
    "DifferentAddress": "boolean",
    "BillingAddressId": "int",
    "ShippingAddressId": "int",
    "SCountry": "string",
    "SState": "string",
    "SCity": "string",
    "PaymentMode": "string",
    "Source": "string",
    "OrderNote": "string",
    "Salesman": "string"
  }
  ```
- **Response:**
  ```json
  {
    "StatusCode": "200" | "400" | "500",
    "ResponseCode": "2" | "-2" | "-4" | "-6" | "-8" | "-16",
    "Message": "string",
    "TrackId": "string"
  }
  ```
- **Status Codes:**
  - `200` and `2` - Order saved successfully, returns TrackId for order confirmation page
  - `200` and `-2` - Something went wrong
  - `200` and `-4` - Payment mode not passed
  - `200` and `-6` - Cart is empty
  - `400` and `-8` - Server side validation error
  - `200` and `-16` - Quantity is not available

## Checkout Flow Implementation Details

### Overview
The checkout process has two paths:
1. **Logged-in User Flow**: Users with accounts can select from saved addresses
2. **Guest User Flow**: Users without accounts provide addresses during checkout

### Guest Checkout Process
1. User selects items and proceeds to checkout
2. User fills out billing address form
3. If "Ship to different address" is checked, user fills out shipping address form
4. User selects payment method
5. User places order

### API Integration Flow for Guest Users
1. When user fills out billing address form:
   - Call `Guest_SaveUserRegistration` to register the guest user and get a TrackId
   - Save this TrackId for later use as the UserID in the final checkout call
   - Call `CRUD_Billing_Manage_Address` with Command: 'Save' to store the billing address

2. If "Ship to different address" is checked:
   - When user fills out shipping address form
   - Call `CRUD_Shipping_Manage_Address` with Command: 'Save' to store the shipping address

3. When user clicks "Place Order":
   - Call `Save_Checkout` with:
     - UserID: the TrackId from the guest registration
     - DifferentAddress: boolean indicating if shipping address is different
     - BillingAddressId and ShippingAddressId: 0 for guest users
     - For guest users with different shipping address, include SCountry, SState, SCity from the shipping form
     - PaymentMode: the selected payment method's XCode

### Technical Implementation Details
1. **State Management**:
   - `checkout-store.ts`: Manages guest checkout state including addresses and TrackId
   - Uses step tracking to manage the flow: billing → shipping → payment → confirmation

2. **Components**:
   - `GuestCheckoutAddressForm.tsx`: Form for collecting billing address from guest users
   - `GuestCheckoutShippingForm.tsx`: Form for collecting shipping address from guest users
   - Main checkout screen handles payment method selection and order placement

3. **API Interactions**:
   - Location data (countries, states, cities) fetched from relevant endpoints
   - Payment methods fetched from `Get_PaymentMode_List` endpoint
   - Order placed with `Save_Checkout` endpoint

4. **Error Handling**:
   - Client-side validation for all required fields
   - Proper handling of API error responses
   - User-friendly error messages for all possible error scenarios

### Edge Cases & Considerations
1. Different address handling:
   - For logged-in users: Compare billing and shipping address IDs
   - For guest users: Use checkout step to determine if shipping is different

2. TrackId management:
   - Store and retrieve the guest TrackId from checkout store
   - Pass TrackId as UserID for guest checkout

3. Response code handling:
   - Handle server validation errors (-8)
   - Handle quantity availability errors (-16)
   - Handle payment mode errors (-4)
   - Handle empty cart errors (-6)

### Checkout API Documentation

#### Get Available Promo Codes (`Get_Promo_Coupons_List`)
- **Method:** `POST` to `/getData_JSON`
- **Description:** Retrieves a list of available promo codes that can be applied during checkout
- **Request Body:**
  ```json
  {
    "strQuery": "[Web].[Sp_CheckoutMst_Apps_SM] 'Get_Promo_Coupons_List','','','','','',1,3044,''"
  }
  ```
- **Response:**
  ```json
  {
    "success": 1,
    "row": [
      {
        "XCode": "FREE",
        "XName": "Test promo"
      }
    ],
    "Message": "Data found."
  }
  ```
- **Status Codes:**
  - `1` - Success, data found
  - `0` - No data found/error

#### Get Payment Methods (`Get_PaymentMode_List`)
- **Method:** `POST` to `/getData_JSON`
- **Description:** Retrieves a list of available payment methods for checkout
- **Request Body:**
  ```json
  {
    "strQuery": "[Web].[Sp_CheckoutMst_Apps_SM] 'Get_PaymentMode_List','','','','','',1,3044,''"
  }
  ```
- **Response:**
  ```json
  {
    "success": 1,
    "row": [
      {
        "XCode": "01PMCash",
        "XName": "Cash"
      }
    ],
    "Message": "Data found."
  }
  ```
- **Status Codes:**
  - `1` - Success, data found
  - `0` - No data found/error

#### Save Checkout Order (`Save_Checkout`)
- **Method:** `POST` to `/Save_Checkout/`
- **Description:** Processes the final checkout and places the order
- **Request Body:**
  ```json
  {
    "UserID": "string",        // Track ID for guest users, User ID for logged-in users
    "IpAddress": "string",     // Device IP
    "UniqueId": "string",      // Cart unique ID 
    "Company": 3044,           // Company ID
    "CultureId": 1,            // Culture ID
    "BuyNow": "",              // Empty for cart checkout
    "Location": "304401HO",    // Location code
    "DifferentAddress": true,  // Whether shipping address is different from billing
    "BillingAddressId": 0,     // Billing address ID (0 for guest users)
    "ShippingAddressId": 0,    // Optional: Shipping address ID (if DifferentAddress=true)
    "SCountry": "string",      // Optional: Shipping country code (if guest with DifferentAddress=true)
    "SState": "string",        // Optional: Shipping state code (if guest with DifferentAddress=true)
    "SCity": "string",         // Optional: Shipping city code (if guest with DifferentAddress=true)
    "PaymentMode": "string",   // Payment method code
    "Source": "iOS",           // Device platform
    "OrderNote": "",           // Optional: Order notes
    "Salesman": "3044SMOL",    // Salesman code
    "CreateAccount": 0         // Optional: 1 to create account for guest, 0 otherwise
  }
  ```
- **Response:**
  ```json
  {
    "StatusCode": 200,
    "ResponseCode": "2",       // 2 for success
    "Message": "Order placed successfully",
    "TrackId": "ORD12345"      // Order tracking ID
  }
  ```
- **Error Codes:**
  - `2` - Success
  - `-4` - Payment method not selected
  - `-6` - Cart is empty
  - `-8` - Validation error
  - `-16` - Item quantity not available

### Default Address Endpoints for Logged-in Users

#### Get Default Billing Address by UserID
- **Method:** `POST` to `/getData_JSON`
- **Description:** Retrieves the default billing address for a logged-in user
- **Request Body:**
  ```json
  {
    "strQuery": "[Web].[Sp_CheckoutMst_Apps_SM] 'Get_Default_BillingAddress_ByUserid','','','','','',1,3044,'userId'"
  }
  ```
- **Response:**
  ```json
  {
    "success": 1,
    "row": [
      {
        "BillingAddressId": 659,
        "FullName": "HUssain test",
        "Mobile": "67753850",
        "Address": "Block - 1, Street - 1, House/Building - 1, Apartment No. - 1",
        "Address2": "",
        "Country": "Kuwait",
        "State": "Jahra",
        "City": "East Tayma ",
        "IsDefault": true,
        "CountryId": 69,
        "StateId": 241,
        "CityId": 2054,
        "MobileForReg": "67753850",
        "Email": "hb@test.com"
      }
    ],
    "Message": "Data found."
  }
  ```

#### Get Default Shipping Address by UserID
- **Method:** `POST` to `/getData_JSON`
- **Description:** Retrieves the default shipping address for a logged-in user
- **Request Body:**
  ```json
  {
    "strQuery": "[Web].[Sp_CheckoutMst_Apps_SM] 'Get_Default_ShippingAddress_ByUserid','','','','','',1,3044,'userId'"
  }
  ```
- **Response:**
  ```json
  {
    "success": 1,
    "row": [
      {
        "ShippingAddressId": 334,
        "FullName": "Hussain test",
        "Mobile": "67753850",
        "Address": "Block - 1, Street - 1, House/Building - 1, Apartment No. - 1",
        "Address2": "",
        "Country": "Kuwait",
        "State": "Farwaniya",
        "City": "Abraq Khaitan",
        "IsDefault": true,
        "CountryId": 69,
        "StateId": 239,
        "CityId": 2007
      }
    ],
    "Message": "Data found."
  }
  ```

#### Get All Billing Addresses by UserID
- **Method:** `POST` to `/getData_JSON`
- **Description:** Retrieves all billing addresses for a logged-in user
- **Request Body:**
  ```json
  {
    "strQuery": "[Web].[Sp_CheckoutMst_Apps_SM] 'Get_All_BillingAddress_ByUserId','','','','','',1,3044,'userId'"
  }
  ```
- **Response:**
  ```json
  {
    "success": 1,
    "row": [
      {
        "BillingAddressId": 659,
        "FullName": "HUssain test",
        "Mobile": "67753850",
        "Address": "Block - 1, Street - 1, House/Building - 1, Apartment No. - 1",
        "Address2": "",
        "Country": "Kuwait",
        "State": "Jahra",
        "City": "East Tayma ",
        "IsDefault": true,
        "CountryId": 69,
        "StateId": 241,
        "CityId": 2054
      }
    ],
    "Message": "Data found."
  }
  ```

#### Get All Shipping Addresses by UserID
- **Method:** `POST` to `/getData_JSON`
- **Description:** Retrieves all shipping addresses for a logged-in user
- **Request Body:**
  ```json
  {
    "strQuery": "[Web].[Sp_CheckoutMst_Apps_SM] 'Get_All_ShippingAddress_ByUserId','','','','','',1,3044,'userId'"
  }
  ```
- **Response:**
  ```json
  {
    "success": 1,
    "row": [
      {
        "ShippingAddressId": 334,
        "FullName": "Hussain test",
        "Mobile": "67753850",
        "Address": "Block - 1, Street - 1, House/Building - 1, Apartment No. - 1",
        "Address2": "",
        "Country": "Kuwait",
        "State": "Farwaniya",
        "City": "Abraq Khaitan",
        "IsDefault": true,
        "CountryId": 69,
        "StateId": 239,
        "CityId": 2007
      }
    ],
    "Message": "Data found."
  }
  ```

## SouqMaria Mobile App Implementation Details

### 1. Checkout Screen Implementation

#### Billing and Shipping Address Selection
The checkout process supports both logged-in and guest users with different address management flows:

- **Logged-in Users**:
  - Default billing and shipping addresses are fetched automatically when a user logs in
  - Users can change their addresses by clicking the "Change" button
  - A modal displays all available addresses with the current one pre-selected
  - Users can select a different address and save their selection
  - The API endpoints used are:
    - `[Web].[Sp_CheckoutMst_Apps_SM] 'Get_Default_BillingAddress_ByUserid'` - Gets default billing address
    - `[Web].[Sp_CheckoutMst_Apps_SM] 'Get_Default_ShippingAddress_ByUserid'` - Gets default shipping address
    - `[Web].[Sp_CheckoutMst_Apps_SM] 'Get_All_BillingAddress_ByUserId'` - Gets all billing addresses
    - `[Web].[Sp_CheckoutMst_Apps_SM] 'Get_All_ShippingAddress_ByUserId'` - Gets all shipping addresses

- **Guest Users**:
  - Prompted to enter billing address information first
  - Option to select "Ship to Different Address" for separate shipping details
  - Form appears for adding shipping address when needed
  - All guest addresses are stored locally and sent during checkout

#### Promo Code Implementation

- Users can enter promo codes directly or select from available codes
- Available promo codes are shown in a modal by clicking "See Available Promo Codes"
- Promo code application uses the API endpoints:
  - `/Apply_PromoCode/` - Applies a promo code
  - `/Remove_PromoCode/` - Removes previously applied promo code
  - `[Web].[Sp_CheckoutMst_Apps_SM] 'Get_Promo_Coupons_List'` - Fetches available promo codes

#### Payment Methods

- Payment methods are fetched from the API using:
  - `[Web].[Sp_CheckoutMst_Apps_SM] 'Get_PaymentMode_List'`
- Users can select only one payment method for their order
- Cash on Delivery is the primary payment method available

#### Order Placement

The final checkout process:
1. Validates all required fields (addresses, payment method, terms acceptance)
2. Prepares the correct payload based on user type (guest vs. logged-in)
3. Sends the order to the API using the `/Save_Checkout/` endpoint
4. Handles the response, showing success/failure messages
5. Navigates to thank you page on success with the order tracking ID

### 2. Error Handling Implementation

#### Product Filter Error Handling

Improved error handling in product listing:
- When filter API returns "List not Found" or other errors:
  - Error message is properly displayed to the user
  - UI shows "No products found for [search term]" with appropriate messaging
  - Error code and message are logged for debugging

#### API Error Handling

General approach to API error handling:
- All API responses include standard fields:
  - `StatusCode` - HTTP status code
  - `ResponseCode` - Application-specific success/error code
  - `Message` - Human-readable message for display
  - `Data` - The actual data payload when successful
  
- Common error scenarios handled:
  - Network errors with appropriate reconnection prompts
  - Authentication errors with login redirection
  - Validation errors with field-specific highlighting
  - Server errors with retry options

### 3. Address Modal Implementation

The address change modals follow these patterns:

#### ChangeAddressModal Component
- Displays a list of addresses for the user to select from
- Highlights the currently selected address
- Provides a checkbox for setting as default
- Implements proper loading states during API calls
- Handles empty states when no addresses are available

### 4. API Endpoints Documentation

#### Address Management Endpoints

| Endpoint | Description | Parameters |
|----------|-------------|------------|
| `/getData_JSON/` | Used with SP `Get_Default_BillingAddress_ByUserid` | UserId |
| `/getData_JSON/` | Used with SP `Get_Default_ShippingAddress_ByUserid` | UserId |
| `/getData_JSON/` | Used with SP `Get_All_BillingAddress_ByUserId` | UserId |
| `/getData_JSON/` | Used with SP `Get_All_ShippingAddress_ByUserId` | UserId |

#### Checkout Endpoints

| Endpoint | Description | Parameters |
|----------|-------------|------------|
| `/getData_JSON/` | Used with SP `Get_PaymentMode_List` | None specific |
| `/Save_Checkout/` | Saves order details | UserID, addresses, payment info, etc. |

#### Promo Code Endpoints

| Endpoint | Description | Parameters |
|----------|-------------|------------|
| `/Apply_PromoCode/` | Apply promo code to cart | PromoCode, UserId, UniqueId, etc. |
| `/Remove_PromoCode/` | Remove applied promo code | PromoCode, UserId, UniqueId, etc. |
| `/getData_JSON/` | Used with SP `Get_Promo_Coupons_List` | None specific |

## Guest Checkout Flow Implementation

The guest checkout flow has been implemented with the following steps:

1. **Initial Checkout Screen**:
   - When a guest user navigates to the checkout page, they see the main checkout screen with an "Add Address" button (as shown in guest_checkout.png)
   - The checkout screen displays the cart items, subtotal, and a button to add address

2. **Adding Billing Address**:
   - When the user clicks "Add Address", the `GuestCheckoutAddressForm` component is displayed
   - This form collects standard billing address information:
     - Full Name, Email, Mobile
     - Country, State, City (fetched from API using `[Web].[Sp_CheckoutMst_Apps_SM] 'Get_Country_List'` etc.)
     - Block, Street, House, Apartment
   - The form has a toggle for "Ship to different address"
   - Upon form submission, the guest user is registered using the `Save_Guest_User_Registration` endpoint

3. **Shipping Address (Optional)**:
   - If the user selected "Ship to different address", the `GuestCheckoutShippingForm` is displayed next
   - This form collects shipping address information similar to the billing form
   - User can pre-fill the form with billing information

4. **Payment Selection**:
   - After completing address forms, the user returns to the main checkout page
   - The entered addresses are displayed with options to change them
   - User selects a payment method

5. **Promo Code (Optional)**:
   - User can enter a promo code or see available codes
   - API endpoints `/Apply_PromoCode/` and `/Remove_PromoCode/` are used

6. **Order Placement**:
   - When "Place Order" is clicked, validation checks ensure all required fields are completed
   - For guest users, the `Save_Checkout` endpoint is called with:
     - The guest track ID as UserID (returned from guest registration)
     - Flag for different shipping address
     - Shipping country/state/city codes (SCountry, SState, SCity) when using different shipping address
   - Success response redirects to thank you page with order tracking ID

### Guest User Registration Process

The guest user registration process uses the `Save_Guest_User_Registration` endpoint with the following parameters:
- FullName (from billing form)
- Email (from billing form)
- Mobile (from billing form)
- IpAddress (automatically determined)
- Source (iOS/Android based on platform)
- CompanyId (default 3044)

The response includes a TrackId that is used as the UserID for the remainder of the checkout process.

### API Endpoints for Country/State/City

For the address forms, the following stored procedures are used:
- `[Web].[Sp_CheckoutMst_Apps_SM] 'Get_Country_List'` - Fetches all available countries
- `[Web].[Sp_CheckoutMst_Apps_SM] 'Get_State_List','COUNTRY_CODE'` - Fetches states for a specific country
- `[Web].[Sp_CheckoutMst_Apps_SM] 'Get_City_List','STATE_CODE'` - Fetches cities for a specific state

The response from these APIs is used to populate the dropdown selectors in the address forms, ensuring users can only select valid geographic locations.

### Save Checkout Parameters for Guest Users

When a guest user places an order, the following parameters are sent to the `Save_Checkout` endpoint:

```json
{
  "UserID": "guest_track_id",
  "IpAddress": "127.0.0.1",
  "UniqueId": "cart_unique_id",
  "Company": 3044,
  "CultureId": 1,
  "BuyNow": "",
  "Location": "304401HO",
  "DifferentAddress": true/false,
  "BillingAddressId": 0,
  "SCountry": "country_code",  // Only if DifferentAddress is true
  "SState": "state_code",      // Only if DifferentAddress is true
  "SCity": "city_code",        // Only if DifferentAddress is true
  "PaymentMode": "payment_code",
  "Source": "iOS/Android",
  "Salesman": "3044SMOL",
  "CreateAccount": 0/1
}
```

The `DifferentAddress` flag is set based on whether the user completed the shipping address form. When true, the shipping location codes (SCountry, SState, SCity) are included from the user's shipping address form.

## API Testing Results and Complete Guest Checkout Flow

### Guest User Registration API
**Endpoint**: `/Guest_SaveUserRegistration/`
**Method**: POST
**Parameters**:
```json
{
  "FullName": "Jane Smith",
  "Email": "jane.smith.test@example.com", 
  "Mobile": "87654321",
  "IpAddress": "192.168.1.1",
  "Source": "iOS",
  "CompanyId": 3044
}
```
**Success Response**:
```json
{"ResponseCode":"2","Message":"User Registration Save Successfully!!!","TrackId":"8011"}
```
**Already Registered Response**:
```json
{"ResponseCode":"4","Message":"User Already Registered...!!!","TrackId":"7975"}
```

### Get All Billing Addresses API
**Endpoint**: `/getData_JSON/`
**Method**: POST
**SP**: `[Web].[Sp_CheckoutMst_Apps_SM]`
**Parameters**:
```json
{
  "strQuery": "[Web].[Sp_CheckoutMst_Apps_SM] 'Get_All_BillingAddress_ByUserId','8011','','','','',1,3044,''"
}
```
**Response** (when no addresses):
```json
{"success":0,"row":[],"Message":"Data not found."}
```

### Get All Shipping Addresses API  
**Endpoint**: `/getData_JSON/`
**Method**: POST
**SP**: `[Web].[Sp_CheckoutMst_Apps_SM]`
**Parameters**:
```json
{
  "strQuery": "[Web].[Sp_CheckoutMst_Apps_SM] 'Get_All_ShippingAddress_ByUserId','8011','','','','',1,3044,''"
}
```
**Response** (when no addresses):
```json
{"success":0,"row":[],"Message":"Data not found."}
```

### Thank You Page Order Details API
**Endpoint**: `/getData_JSON/`
**Method**: POST
**SP**: `[Web].[Sp_Template1_Get_OrderDetails_ThankYou_Apps]`
**Parameters**:
```json
{
  "strQuery": "[Web].[Sp_Template1_Get_OrderDetails_ThankYou_Apps] '8011',3044"
}
```
**Response** (when no order found):
```json
{"success":0,"row":[],"Message":"Data not found."}
```

### Complete Guest Checkout Implementation Flow

1. **Guest User Adds Billing Address & Hits Save**:
   - Call `Guest_SaveUserRegistration` API
   - Store returned `TrackId` as guest user ID
   - Call `Get_All_BillingAddress_ByUserId` with guest TrackId
   - Store billing address ID from response (if any addresses returned)

2. **If "Ship to Different Address" is Toggled**:
   - Show shipping address form
   - When shipping form is saved:
     - Call `Get_All_ShippingAddress_ByUserId` with guest TrackId  
     - Store shipping address ID from response

3. **Place Order**:
   - Call `Save_Checkout` API with correct parameters:
     - `UserID`: Use guest TrackId
     - `BillingAddressId`: From billing address API response (or 0 if none)
     - `ShippingAddressId`: From shipping address API response (or 0 if none)
     - `DifferentAddress`: true/false based on user selection
     - `SCountry`, `SState`, `SCity`: Shipping location codes when DifferentAddress is true

4. **Order Success**:
   - Get TrackId from `Save_Checkout` response
   - Call `[Web].[Sp_Template1_Get_OrderDetails_ThankYou_Apps]` with order TrackId
   - Display thank you page with order details

### Key Implementation Notes

- **Guest TrackId Persistence**: The guest TrackId from registration must be stored and used throughout the checkout process
- **Address ID Handling**: When no addresses are found, use 0 as the address ID in checkout
- **Response Code Handling**: `ResponseCode "2"` = success, `ResponseCode "4"` = already registered (still use TrackId)
- **Error Handling**: All APIs return structured responses with success flags and messages

# New Checkout Flow Implementation

## Overview
The checkout flow has been implemented to follow the exact sequence specified:

1. **User clicks on checkout** → Opens checkout modal
2. **order_review_checkout is called** → Fetches current cart with pricing/shipping
3. **For logged-in users** → Uses default saved addresses (country, state, city codes)
4. **Response properly mapped to checkout page fields** → Cart items and totals displayed
5. **Address management flow** → Same as before (add/change addresses)
6. **User clicks place order** → save_checkout called
7. **TrackId received** → User directed to thank-you page
8. **Flow complete** → Success/failure page shown

## Implementation Details

### Order Review Checkout API
- **Endpoint**: `/Order_Review_Checkout/`
- **Parameters**: Country, State, City (from user's default address), UniqueId, UserId, etc.
- **Response**: Cart items with pricing, totals, discounts, shipping charges
- **Integration**: Called when checkout page loads with valid address data

### Save Checkout API - TrackId Handling
- **Endpoint**: `/Save_Checkout/`
- **Response Structure**: 
  ```json
  {
    "ResponseCode": "2",
    "Message": "Save Successfully!!!",
    "TrackId": "TR00001845"
  }
  ```
- **TrackId Location**: At root level of response (not in Data field)
- **Logging**: Comprehensive logging added to track TrackId extraction
- **Fallback**: Generates TrackId if API doesn't return one (ORD_UserId_timestamp format)
- **Parameters**: Removed CreateAccount parameter (not supported by API)

### Thank You Page Implementation
- **Route**: `/thank-you`
- **Parameters**: `trackId`, `status`, `errorMessage`
- **TrackId Usage**: 
  - Used as Order Number if API order details not available
  - Attempts to fetch order details using TrackId
  - Falls back to TrackId display if API fails
- **Design**: Matches order_success.png exactly
- **Assets**: Uses order_succesful_image.png and order_failed_image.png

### Key Files Modified

1. **src/app/checkout.tsx**
   - Enhanced TrackId logging and extraction
   - Proper navigation with TrackId to thank-you page
   - Order review integration

2. **src/utils/api-service.ts**
   - Added detailed logging for Save Checkout API
   - Preserved TrackId in apiRequest function
   - Updated getOrderDetailsForThankYou function

3. **src/app/thank-you.tsx**
   - Comprehensive TrackId handling
   - Fallback order details using TrackId
   - Enhanced logging for debugging

### Testing Results

**Terminal API Testing:**
```bash
# Save Checkout Response (Success)
{
  "ResponseCode": "2",
  "Message": "Save Successfully!!!",
  "TrackId": "TR00001845"
}
```

**Console Logging Output:**
- `🛒 API RAW RESPONSE DATA:` - Shows raw API response
- `🛒 API CONSTRUCTED RESPONSE:` - Shows processed response  
- `🛒 SAVE CHECKOUT - SUCCESS! Extracted TrackId:` - Shows extracted TrackId
- `🎉 Thank You Page - Received params:` - Shows thank you page params

### Flow Summary
1. ✅ **Checkout Flow**: Order review → Address management → Payment → Place order
2. ✅ **TrackId Extraction**: Properly extracted from Save Checkout API response
3. ✅ **Navigation**: TrackId passed to thank-you page via router params
4. ✅ **Thank You Page**: Displays TrackId as Order Number with proper UI
5. ✅ **Error Handling**: Comprehensive fallbacks and logging throughout

### Current Status
- **Order Review Checkout**: ✅ Working with proper address integration
- **TrackId Handling**: ✅ Working with comprehensive logging  
- **Thank You Page**: ✅ Working with TrackId display and proper UI
- **Complete Flow**: ✅ End-to-end checkout working for logged-in users

## Next Steps
- Test guest checkout flow with TrackId handling
- Verify order details API integration with actual TrackId
- Test edge cases and error scenarios

## MY ORDERS API IMPLEMENTATION

### Overview
The My Orders screen displays a list of orders for the logged-in user, showing order details like order number, date, total amount, status, and item count.

### API Endpoint
**Stored Procedure**: `[Web].[Sp_Template1_Get_MyOrders_Apps]`

### API Testing
```bash
# Test My Orders API
curl -X POST "https://api.souqmaria.com/api/MerpecWebApi/getData_JSON/" \
  -H "Content-Type: application/json" \
  -d '{"strQuery": "[Web].[Sp_Template1_Get_MyOrders_Apps] '\''Get_MyOrders_Parent'\'','\''USER_ID'\'','\'''\'''\'''\'','\''KWD'\'','\''KD'\'',3044,1"}'
```

### Parameters
1. **Type**: `"Get_MyOrders_Parent"` (string) - Operation type
2. **Value**: `USER_ID` (string) - User ID to fetch orders for
3. **Value1**: `""` (string) - Empty string
4. **Value2**: `""` (string) - Empty string  
5. **Value3**: `"KWD"` (string) - Currency name (Kuwaiti Dinar)
6. **Value4**: `"KD"` (string) - Currency code
7. **Company**: `3044` (int) - Company ID
8. **CultureId**: `1` (int) - Culture ID (1 for English, 2 for Arabic)

### Response Structure
```json
{
  "success": 1,
  "row": [
    {
      "OrderID": "string",
      "OrderNo": "string", 
      "OrderDate": "string",
      "TotalAmount": number,
      "Status": "string",
      "ItemCount": number,
      "CurrencyName": "KWD",
      "CurrencyCode": "KD"
    }
  ],
  "Message": "Data found."
}
```

### Currency Data Source
- **Currency Name**: "KWD" (Kuwaiti Dinar)
- **Currency Code**: "KD" 
- These values are passed directly to the stored procedure
- Previously was using hardcoded strings "CurrencyXName" and "CurrencyXCode"
- Updated to use actual currency values: "KWD" and "KD"

### Implementation Files
- **Screen**: `src/app/(shop)/account/orders/index.tsx`
- **Store**: `src/store/order-store.ts` 
- **API Service**: `src/utils/api-service.ts` (getMyOrders function)
- **API Config**: `src/utils/api-config.ts` (GET_MY_ORDERS query)

### Order Details API
For individual order details:
```bash
# Test Order Details API  
curl -X POST "https://api.souqmaria.com/api/MerpecWebApi/getData_JSON/" \
  -H "Content-Type: application/json" \
  -d '{"strQuery": "[Web].[Sp_Template1_Get_MyOrders_Apps] '\''Get_MyOrders_Child'\'','\''USER_ID'\'','\''ORDER_NO'\'','\'''\'''\'''\'','\''KWD'\'','\''KD'\'',3044,1"}'
```

### UI Layout Requirements
Based on @my_orders.png:
- Order cards with clean, modern design
- Each card shows: Order #, Date, Total amount with KWD currency, Status, Item count
- Touch interaction to view order details
- Empty state for when no orders found
- Loading states and error handling
- Proper navigation and header with back button

