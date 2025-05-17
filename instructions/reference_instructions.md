# Product Requirements Documentation (PRD) 

## Project Overview
You are building an eCommerce mobile application for iOS and Android that sells nail care products, makeup products and fragrances, where users can simply download the app, select the product and checkout by paying for the product from the app itself. 

You will be using React Native, Expo, Supabase, Toast and Zustand.

## Core Functionalities
1. Choose between English and Arabic for the app language. 
    1. Users can choose between two languages for interacting with the app. 
        - If it is a first time user, they will be given the option to choose on the first screen. 
        - If it is an existing customer then they can switch between languages from the 'Account" tab.
    2. If the users choose arabic then all the API calls will be made with an arabic language parameter which will return all text in arabic instead of english. (refer api reference)

2. Browse the different products seamlessly within the app.
    1. The users will be shown a splash screen for 3 seconds upon opening the app. It will have a black background with AZURA written in the middle.
    1. The users will have two options to find products: 'Home' tab and the 'Search' tab.
    2. Under the 'Home' tab: 
        - User can explore different products on the home page. 
        - They can choose between three categories of products: Nail Care, Makeup, and Fragrance
    3. Under the 'Search' tab: 
        - User can type in the full product name or partial name and choose from the products displayed in the dropwdown. 

3. Add / remove products in the cart and going to checkout.
    1. The user can add a product to cart in two ways: 
        - Click on 'Add to cart' button directly from all products view. 
        - Click on 'Add to cart' button by clicking on the product, hence opening an individual product page with additional product details and clicking on the button. 
    2. The user can remove a product from the cart by going to the 'Cart' tab, clicking on the delete icon, and choosing 'Yes, remove' button.
    3. The user can go to checkout by clicking on the 'Checkout' button in the 'Cart' tab.

4. Going to checkout directly from the product page.
    - The user can go to the checkout page by clicking on the 'Buy Now' button present on both the all products view and individual product view.

5. Quick and easy login / sign up by form submission. 
    1. The user can login / sign up in two ways: 
        - By going to the 'Account' tab and clicking on login / sign up button. 
        - By logging in / signing up after adding products to cart and before proceeding to checkout.
        NOTE: Users can access and browse the app without having an account as well, they will need to login / signup only before checkout.
6. In-app payment using credit card, K-net, or appropriate payment method based on country (Kuwait).
    - The users can either choose the 'Cash on Delivery" option or credit card option. 


## Application Layout
1. The application will have 4 tabs in the bottom: Home, Search, Cart, and Account. 

    1.1 Home Tab: 
        1.1.1 It has a hero image that takes the full width of the screen. It has a text overlay on it with a button under the text named 'Explore'. This button takes the user to the 'Nail Care' category page.
        1.1.2. Upon scrolling down a new container appears with a background image, text overlay and a button under it named 'Explore'. This button takes the user to the 'Perfume' category page.
        1.1.3. Upon scrolling down further a new container appears with a background image, text overlay and a button under it named 'Explore'. This button takes the user to the 'Nail Care' category page.
        1.1.4. Upon scrolling down further a new container appears with a background image, text overlay and a button under it named 'Explore'. This button takes the user to the 'Perfume' category page.
        1.1.5. Upon scrolling down further a new container appears with a background image, text overlay and a button under it named 'Explore'. This button takes the user to the 'Perfume' category page.
        1.1.4. Upon scrolling down further, a container with plain black background appears that has some text over it.
    
    1.2. Search Tab: 
        1.2.1. It has a white background. On the top there is a text "SEARCH" written.
        1.2.2. Under the text there is a search bar where the user can search for a specific product.
        1.2.3. Upon typing the user is shown suggestions on what the product might be based on the text they are inputting.
        1.2.4. Upon clicking on the product they wish to see the user is taken to the individual product page.
        1.2.4. If the user searches for a product that cannot be found then they are taken to a page that says "Product Not Found".

    1.3. Cart Tab:
        1.3.1. When there are no products in the cart
          1.3.1.1. A header 'MY CART' with a divider below it. 
          1.3.1.2. A cart emoji with 0 displayed on its top right and 'YOUR CART IS EMPTY' written below it.  Both the emoji and text are in the center of the screen. 
          1.3.1.3. A button 'START SHOPPING' that takes the user to the homepage when clicked.
        1.3.2. When there are products in the cart
          1.3.2.1. A header 'MY CART' with a divider below it. 
          1.3.2.2. Each product is displayed in a list format. Each product card has the product image on the left; SKU, product name, quantity, and total price one below the other; a delete icon that will enable the user to remove the product from cart. 
          1.3.2.3. The user can update the order quantity from the dropwdown arrow right next to quantity.
          1.3.2.4. 'CART TOTAL', 'SHIPPING', 'TOTAL' displayed on the bottom right. 
          1.3.2.5. A 'CHECKOUT' button below that. Clicking on this button takes the user to the checkout flow.
        1.3.3. When the user wants to remove a product from the cart
          1.3.3.1. A confirmation modal slides up from the bottom of the screen with:
          1.3.3.2. A header "Remove from Cart?"
            4.3.1.2. Product details section showing:
                - Product image on the left
                - SKU number
                - Product name in uppercase
                - Quantity
                - Total price in KD
            4.3.1.3. Two buttons at the bottom:
                - "CANCEL" button with black background and white text
                - "YES, REMOVE" button with white background, black border and black text
        4.3.2. If the user taps "CANCEL", the modal is dismissed
        4.3.3. If the user taps "YES, REMOVE", the product is removed from the cart and the modal is dismissed

    1.4. Account Tab: 
        There are two cases here - 
        1.4.1. The user has not yet authenticated themselves (logged in / signed up)
            - The user is shown the following on a white background screen: 
            1.4.1.1. A heading: 'MY ACCOUNT' and a subheading: 'Easy shopping with Azura'
            1.4.1.2. 'Country/Region' pressable option
            1.4.1.3. 'Language' pressable option
            1.4.1.4. 'Login/Register' button
                1.4.1.4.1. User is shown a 'Sign In' screen upon button press with the following details: 
                    1. A heading: 'SIGN IN' and a subheading: 'Welcome Back To Azura'
                    2. An input field to enter their registered email.
                    3. An input field to enter their password. 
                    4. 'Forgot Password?' pressable option 
                    5. 'Login' button
                    6. 'New user? Create Account' pressable option that redirects the user to a sign up page.
                1.4.1.4.2. User wants to create a new account 
                    1. A heading: 'CREATE ACCOUNT' and a subheading: 'Easy shopping with Azura'
                    2. An input field to enter their FULL NAME.
                    3. An input field to enter their EMAIL.
                    4. An input field to enter their MOBILE NUMBER.
                    5. An input field to enter the PASSWORD they want to use.
                    6. 'FORGOT PASSWORD?' option
                        - It will redirect the user to a different screen: 
                        6.1. A heading 'FORGOT PASSWORD' and subheading 'Pasword will be sent on email'
                        6.2. Divider line and a text below that
                        6.3. A input box that takes in the registered user email address. 
                        6.4. A button 'SEND' that checks if the user email is registered and exists. 
                        6.5. If the email is registered, then send the user their passowrd on their email. 
                        6.6. If the email is not registered, send a toast notification.
                    7. 'Sign Up' button
                    8. 'Already Have An Account' pressable option that redirects the user to a sign in page.
        1.4.2. The user has authenticated themselves (logged in / signed up)
            - The user is shown the following on a white background screen: 
            1.4.1.1. A heading: 'MY ACCOUNT' and a subheading: 'Easy shopping with Azura'
            1.4.1.2. 'Country/Region' pressable option
            1.4.1.3. 'Language' pressable option
            1.4.1.4. 'My Details' pressable option
                1. A heading: 'MY DETAILS'
                2. A text box field that displays their registered FULL NAME.
                3. A text box field that displays their registered EMAIL.
                4. A text box field that displays their registered MOBILE NUMBER.
                5. A text box field that contains their PASSWORD but is not shown to the user.
                6. A button 'EDIT DEAILS' that will allow the users to edit their details in the above text boxes.
            1.4.1.5. 'My Address' pressable option
                - There are two cases: 
                1. The user has no address saved
                    1.1. A heading: 'MY ADDRESSES'.
                    1.2. A clickable button with black border and white filling that has '+ ADD ADDRESS' written. 
                    1.3. Upon button click, a modal appears from below where the user can add their address by filling in the following fields: 
                        1.3.1. Full name
                        1.3.2. Mobile Number
                        1.3.3. Country
                        1.3.4. City
                        1.3.5. Area 
                        1.3.6. Block
                        1.3.7. Street 
                        1.3.8. House / Building No. 
                        1.3.9. Apartment No. 
                        1.3.10. Address line 2
                    1.4. A 'Cancel' button and a 'Confirm' button that saves the details locally for now. 
                2. The user has an address saved and wants to review / edit it
                    2.1. A box that has the address shown for the user to review.
                    2.2. There is an 'Edit Address' option at the bottom of the box that, upon press, will slide up a modal that will display the fields with the respective user data. The user can edit the data and save it. 
            1.4.1.6. 'My Orders' pressable option
                - A new screen is shown to the user with all their orders. This screen can only be accessed from the 'account' tabs > 'My Orders".
                1. A heading: 'MY Orders'
                2. Product details in a box with black border.
                3. Within the box, product image is displayed first > Order ID > Order Date > Email > Transaction ID > Payment Method
                4. On clicking the order, the user is redirected to the specific product page.
            1.4.1.7. 'Logout' button
                - Upon press of the logout button, the user is signed out of their account.

2. When a user clicks the 'Explore' button for any of the categories, the following will happen: 
    2.1. A product display page will open which will have all the products under the respective category. 
        2.1.1. The products will be displayed in 2 columns, i.e., each row will contain 2 products. 
    2.2. Each product will have a 'Add to Cart' and 'Buy Now' button. 
        2.2.1. The 'Add to Cart' button will simply add the product in the cart (quantity=1 for each button press)
        2.2.2. The 'Buy Now' button will take the user to the checkout page.
    2.3. If the user wants to know more details about the product they will click on the product which will open a stack screen displaying the individual product page with all of its details. 
        - The product page will have a 'Add to Cart' and 'Buy Now' button. 
        2.2.1. The 'Add to Cart' button will simply add the product in the cart (quantity=1 for each button press)
        2.2.2. The 'Buy Now' button will take the user to the checkout page.

3. Search Tab Layout: 
    3.1. A 'SEARCH' header is displayed on the top right of the screen. 
    3.2. A search bar is displayed with a search icon on the left of the bar. 
    3.3. When a user types in a product name, the products with matching names are displayed.

4. Checkout: 
    - Checking if the user is logged in
    4.1. We need to first check if the user is logged in or not. 
    4.2. If the user is not logged in, they are taken to the sign in page. If they are a first time user then they can go to the sign up and create a new account (refer 1.4.1.4.)
    4.3. If the user is already signed in, they are directly taken to the checkout page. 
    4.4. Checkout page 
        4.4.1. A heading: 'CHECKOUT' and a subheading: 'Easy shopping with Azura' with a divider below it.
        4.4.2. A subheading 'BILLING AND SHIPPING ADDRESS'
        4.4.3. If the user already has an address saved, it is displayed in a box with black border. There is an 'Edit Address' option at the bottom of the box that, upon press, will slide up a modal that will display the fields with the respective user data. The user can edit the data and save it. 
        4.4.4. If the user does not have any addresses saved, they are shown an add address box that upon press will show them the address modal where they can fill in the fields and save it. This address will then be reflected in the checkout page. 
        4.4.5. There is a checkbox with the text 'Ship to different address?' that, upon press, will open the edit address modal where the user can edit the default address if they want to ship to a different address. 
            - If the user edits the address add it as a new 
        4.4.6. A heading 'ORDER SUMMARY' with a box icon beside it.
        4.4.7. The final products are shown.
        4.4.8. 'Item Sub Total', 'Shipping fee', 'Grand Total' are shown. 
        4.4.9. The user is given two methods of payments: Cash and Credit Card. The user can select one of the two. The 'Place Order' button will only be active if an address is added.
        4.4.10. If the user selects cash and presses the 'Place Order' button then the order success page will be shown. 
        4.4.11. If the user selects credit card and presses the 'Place Order' button then the payment gateway will be shown to the user.

5. Language Selection: 
  - There are two cases here
    5.1. The user is a first time user / installed the app for the first time
      5.1.1. After the app content is loaded and the user enters the app from the splash screen, they are shown a screen to choose between 'English' and 'Arabic'.
      5.1.2. The user selects 'English' - they will be shown the entire app in english language.
        - On the backend side, we are using the default API.
      5.1.3. The user selects 'Arabic' - they will be shown the entire app in arabic language.
        - On the backend side, we are using the API to get product details in arabic. I have a CSV file that has english to arabic translations for the rest of the app (we will use this file from local).
    5.2. The user has previously selected a language
      5.2.1. They can change the app language from the accounts tabe under 'Language'.


## Language Functionality

### Overview

The language functionality allows users to choose between English and Arabic for the app interface and content. The implementation handles both UI text translations and retrieves localized content from the API.

### Key Features

1. **First-time Language Selection**: When users first open the app, they are prompted to choose their preferred language (English or Arabic) after the splash screen.

2. **Language Settings in Account**: Users can change their language preference anytime from the Account tab.

3. **API Integration**: The app passes the appropriate language parameter to the API to retrieve content in the selected language.

4. **UI Translations**: The app includes a translation system for UI elements that aren't directly from the API.

### Implementation Details

#### Language Store

The language functionality is implemented using Zustand for state management. The store (`language-store.ts`) handles:

- Storing the current language preference (English or Arabic)
- Tracking if it's the user's first time using the app
- Saving language preferences to AsyncStorage for persistence
- Initializing the language state on app startup

#### Language Selection UI

- **First-time Selection**: `language-selection.tsx` component shown after the splash screen for new users
- **Language Settings**: `/app/account/language/index.tsx` screen accessible from the Account tab

#### API Integration

The API service has been updated to include the language parameter (`language=ar`) for Arabic content. All product-related API calls consider the current language preference.

#### UI Translations

The translations utility (`translations.ts`) provides:

- A mapping of UI text keys to their English and Arabic translations
- A React hook (`useTranslation`) for use in components
- A direct function (`getTranslation`) for use outside of React components

### How to Use

#### In Components

```jsx
import { useTranslation } from '../utils/translations';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <View>
      <Text>{t('account.title')}</Text>
      <Button title={t('cart.checkout')} />
    </View>
  );
}
```

#### In API Calls

The API service automatically includes the language parameter based on the current language preference. No additional code is needed when making API calls.

### Adding New Translations

To add new translations:

1. Open `src/utils/translations.ts`
2. Add new key-value pairs to the translations object:

```typescript
'your.new.key': {
  en: 'English text',
  ar: 'Arabic text',
},
```

### Testing

You can test the language functionality by:

1. Clearing the app data to trigger the first-time user experience
2. Changing the language from the Account tab
3. Verifying that both UI elements and API content change based on the selected language

### Design Considerations

- RTL (Right-to-Left) support for Arabic is handled by React Native's built-in RTL support
- The language selection affects both the UI language and the API content language
- The implementation separates concerns: language state management, UI translations, and API integration 
   

## Reference Doc (Backend API)
Need to pass OCSESSID (a random string) with each and every API request. 
On the splash screen check if you have OCSESSID store in local session then pass the same value else create a new random string and send with each API.

login
Type - POST
body - {"email":"bbohra052@gmail.com","password":"123456"}
URL - https://new.azurakwt.com/index.php?route=extension/mstore/account|login
- Test credentials are email: hussain.b@test.com and password: 87654321

User Signup
Type - POST
body - {"firstname":"Burhan","lastname":"Bohra","telephone":"9893962233","email":"bbohra052@gmail.com","password":"123456"}
URL - https://new.azurakwt.com/index.php?route=extension/mstore/account|register
Note: The server may return a utf8_strlen() error during registration. This is a known server-side issue that should be handled gracefully by the client. The registration is still successful despite this error, and the client should proceed with the normal registration flow.

Edit account
Type - Post
body - {"firstname":"BB","lastname":"BB1","email":"bbohra052@gmail.com","telephone":"9899962233"}
URL -https://new.azurakwt.com/index.php?route=extension/mstore/account|edit&language=en

Edit address
Type - Post (pass body in form-data)
body - firstname,lastname,country_id,zone_id,city,custom_field[30](for block),custom_field[31](for street),custom_field[32](for House Building1) 
custom_field[33](Apartment No
),address_2,default: 1
address_id:107
URL - https://new.azurakwt.com/index.php?route=extension/mstore/account|edit_address&language=en

Get customer address
Type - get
URL -https://new.azurakwt.com/index.php?route=extension/mstore/account|addresses&language=en


Get customer order history
Type - get
URL -https://new.azurakwt.com/index.php?route=extension/mstore/order|all&language=en


Home Service block
Type - get
URL -https://new.azurakwt.com/index.php?route=extension/mstore/home|serviceBlock&language=en


Home slider block
Type - get
URL -https://new.azurakwt.com/index.php?route=extension/mstore/home|sliderblock&language=en

Home featuresblock1
Type - get
URL -https://new.azurakwt.com/index.php?route=extension/mstore/home|featuresblock1&language=en

Home featuresblock2
Type - get
URL -https://new.azurakwt.com/index.php?route=extension/mstore/home|featuresblock2&language=en

Home featuresblock3
Type - get
URL -https://new.azurakwt.com/index.php?route=extension/mstore/home|featuresBlock3&language=en

Home featuresblock4
Type - get
URL -https://new.azurakwt.com/index.php?route=extension/mstore/home|featuresBlock4&language=en

Home featuresblock5
Type - get
URL -https://new.azurakwt.com/index.php?route=extension/mstore/home|featuresBlock5&language=en

Home featuresblock6
Type - get
URL -https://new.azurakwt.com/index.php?route=extension/mstore/home|featuresBlock6&language=en

Main menu
Type - get
URL -https://new.azurakwt.com/index.php?route=extension/mstore/menu&language=en


Get all products
Type - get
URL -https://new.azurakwt.com/index.php?route=extension/mstore/product&language=en

Product by category
Type - get
URL -https://new.azurakwt.com/index.php?route=extension/mstore/product&language=en
Param - category=20, language (optional) (values = ar,en)

Get product detail
Type - get
URL - https://new.azurakwt.com/index.php?route=extension/mstore/product|detail&language=en
Param - productId=51

Add to Cart
Type - Post
URL - https://new.azurakwt.com/index.php?route=extension/mstore/cart|add
Param - [{"product_id":"40","quantity":"1"}]

Get Cart
Type - GET
URL - https://new.azurakwt.com/index.php?route=extension/mstore/cart

Remove Cart
Type - DELETE
URL - https://new.azurakwt.com/index.php?route=extension/mstore/cart|emptyCart

Remove Item from Cart
Type - POST
URL - https://new.azurakwt.com/index.php?route=extension/mstore/cart|remove
Param - cart_id

Update Item Qty in Cart
Type - GET
URL -https://new.azurakwt.com/index.php?route=extension/mstore/cart|edit
Param - [{"cart_id":"40","quantity":"1"}]





## Current File Structure
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





## API Documentation

### Home Service Block
**Endpoint:** `https://new.azurakwt.com/index.php?route=extension/mstore/home|serviceBlock`  
**Type:** GET  
**Description:** Returns service-related information displayed on the home page  

**Response Structure:**
```json
{
  "success": 1,
  "error": [],
  "data": {
    "heading_text": string,
    "class": string,
    "ishiservices": [
      {
        "image": string,
        "title": string,
        "desc": string
      }
    ]
  }
}
```

**Sample Response:**
```json
{
  "success": 1,
  "error": [],
  "data": {
    "heading_text": "THE AZURA SERVICES",
    "class": "col-sm-4 col-xs-4",
    "ishiservices": [
      {
        "image": "https://new.azurakwt.com/image/catalog/services/azura/shipping_service.png",
        "title": "Standard SHIPPING",
        "desc": "Enjoy complimentary Standard shipping"
      },
      {
        "image": "https://new.azurakwt.com/image/catalog/services/azura/gifting_service.png",
        "title": "RIGHT GIFTING",
        "desc": "Your gift orders will be presented in an AZURA gift box"
      }
    ]
  }
}
```

### Home Slider Block
**Endpoint:** `https://new.azurakwt.com/index.php?route=extension/mstore/home|sliderblock`  
**Type:** GET  
**Description:** Returns slider content for the home page hero section  

**Response Structure:**
```json
{
  "success": 1,
  "error": [],
  "data": {
    "ishiservices": [
      {
        "image": string,
        "title": string,
        "titlecolor": string,
        "subtitle": string,
        "subtitlecolor": string,
        "subtitlebgcolor": string,
        "desc": string,
        "desccolor": string,
        "textalignment": string,
        "textposition": string,
        "mobiletextalignment": string,
        "mobiletextposition": string,
        "btntext": string,
        "link": string,
        "imagehover": string
      }
    ]
  }
}
```

**Sample Response:**
```json
{
  "success": 1,
  "error": [],
  "data": {
    "ishiservices": [
      {
        "image": "https://new.azurakwt.com/image/cache/catalog/productsimage/slider/Hero_banner_nail_care-1920x1440.png",
        "title": "AZURA NAIL CARE",
        "titlecolor": "#ffffff",
        "subtitle": "",
        "subtitlecolor": "#ffffff",
        "subtitlebgcolor": "#ffffff",
        "desc": "Transform your appearance in seconds with our handcrafted NAIL CARE",
        "desccolor": "#ffffff",
        "textalignment": "center",
        "textposition": "slider-content-center",
        "mobiletextalignment": "center",
        "mobiletextposition": "slider-content-center",
        "btntext": "Explore",
        "link": "en-gb/catalog/nail-care",
        "imagehover": "https://new.azurakwt.com/image/cache/catalog/productsimage/slider/Hero_banner_nail_care-575x431.png"
      }
    ]
  }
}
```

### Features Blocks (1-6)
**Base Endpoint:** `https://new.azurakwt.com/index.php?route=extension/mstore/home|featuresblock{N}`  
where N is 1-6  
**Type:** GET  
**Description:** Returns content for featured sections on the home page  

**Response Structure:**
```json
{
  "success": 1,
  "error": [],
  "data": {
    "ishi_randomnumer": string,
    "scale": string,
    "bgcolor": string,
    "heading": string,
    "text_align": string,
    "subtitle": string,
    "desc": string,
    "btntext": string,
    "btnlink": string,
    "image": string
  }
}
```

**Sample Responses:**

1. Features Block 1 (Fragrance):
```json
{
  "success": 1,
  "error": [],
  "data": {
    "ishi_randomnumer": "ishigallery-462946960",
    "scale": "",
    "bgcolor": "#000000",
    "heading": "",
    "text_align": "center",
    "subtitle": "OUR NEW FRAGRANCE",
    "desc": "A LUXURY FRAGRANCE FOR A CHARACTER UNTAMED AND TREMENDOUSLY ATTRACTIVE, WHO IGNORED DICTATIONS AND FOLLOWS HER OWN RULES.",
    "btntext": "Explore",
    "btnlink": "en-gb/catalog/perfumes/male",
    "image": "https://new.azurakwt.com/image/catalog/home_featured/Soul_drop_side.png"
  }
}
```

2. Features Block 2 (Nail Care):
```json
{
  "success": 1,
  "error": [],
  "data": {
    "ishi_randomnumer": "ishigallery-115638475",
    "scale": "",
    "bgcolor": "#000000",
    "heading": "Nail Polish Remover",
    "text_align": "left",
    "subtitle": "Our Azura Nail Polish Remover are just the right choice for your Nails",
    "desc": "",
    "btntext": "Explore",
    "btnlink": "en-gb/catalog/nail-care",
    "image": "https://new.azurakwt.com/image/catalog/home_featured/makeup.png"
  }
}
```

3. Features Block 3 (Perfumes):
```json
{
  "success": 1,
  "error": [],
  "data": {
    "ishi_randomnumer": "ishigallery-198382963",
    "scale": "",
    "bgcolor": "#000000",
    "heading": "PERFUMES",
    "text_align": "center",
    "subtitle": "Unisex Arabian Perfume",
    "desc": "Be it Him or Her Own the Power to Influence!",
    "btntext": "Explore",
    "btnlink": "en-gb/catalog/perfumes/male",
    "image": "https://new.azurakwt.com/image/catalog/home_featured/unisex-arabian-perfume.png"
  }
}
```

4. Features Block 4 (Cologne):
```json
{
  "success": 1,
  "error": [],
  "data": {
    "ishi_randomnumer": "ishigallery-920007856",
    "scale": "",
    "bgcolor": "#000000",
    "heading": "COLONGE",
    "text_align": "center",
    "subtitle": "Love is in the Air",
    "desc": "Let your brightness shine like the rising sun!",
    "btntext": "Explore",
    "btnlink": "en-gb/catalog/perfumes/female",
    "image": "https://new.azurakwt.com/image/catalog/home_featured/love-is-in-the-air.png"
  }
}
```

**Notes:**
1. Features Blocks 5 and 6 follow the same structure but contain minimal content (mostly empty fields) and are used for makeup-related banners.
2. All endpoints return a consistent success/error response format.
3. Image URLs are absolute paths and should be used as-is.
4. Text alignment and positioning values are used for responsive design.
5. Color values are in hexadecimal format.


### Main Menu
**Endpoint:** `https://new.azurakwt.com/index.php?route=extension/mstore/menu`  
**Type:** GET  
**Description:** Returns the navigation menu structure with categories and subcategories  

**Response Structure:**
```json
{
  "success": 1,
  "error": [],
  "data": {
    "categories": [
      {
        "name": string,
        "children": [
          {
            "name": string,
            "href": string,
            "column": string,
            "childs": array,
            "category_id": string
          }
        ],
        "column": string,
        "href": string,
        "category_id": string
      }
    ]
  }
}
```

**Sample Response:**
```json
{
  "success": 1,
  "error": [],
  "data": {
    "categories": [
      {
        "name": "Nail care",
        "children": [
          {
            "name": "Nail Polish",
            "href": "https://new.azurakwt.com/en-gb/catalog/nail-care/nail-polish",
            "column": "1",
            "childs": [],
            "category_id": "66"
          },
          {
            "name": "Nail Care",
            "href": "https://new.azurakwt.com/en-gb/catalog/nail-care/AzuraNailcare",
            "column": "1",
            "childs": [],
            "category_id": "27"
          }
        ],
        "column": "1",
        "href": "https://new.azurakwt.com/en-gb/catalog/nail-care",
        "category_id": "20"
      },
      {
        "name": "Makeup",
        "children": [
          {
            "name": "Foundation",
            "href": "https://new.azurakwt.com/en-gb/catalog/makeup/Foundation",
            "column": "1",
            "childs": [],
            "category_id": "45"
          }
        ],
        "column": "2",
        "href": "https://new.azurakwt.com/en-gb/catalog/makeup",
        "category_id": "18"
      },
      {
        "name": "Fragrance",
        "children": [
          {
            "name": "Perfume",
            "href": "https://new.azurakwt.com/en-gb/catalog/perfumes/male",
            "column": "1",
            "childs": [],
            "category_id": "76"
          },
          {
            "name": "Colognes",
            "href": "https://new.azurakwt.com/en-gb/catalog/perfumes/female",
            "column": "1",
            "childs": [],
            "category_id": "78"
          }
        ],
        "column": "1",
        "href": "https://new.azurakwt.com/en-gb/catalog/perfumes",
        "category_id": "57"
      }
    ]
  }
}
```

**Notes:**
1. The menu structure is hierarchical with main categories and their subcategories
2. Each category and subcategory has:
   - A unique `category_id`
   - A display `name`
   - A `href` URL for navigation
   - A `column` value for layout purposes
3. The `childs` array is typically empty in this implementation but exists for potential deeper nesting
4. Main categories in the current implementation:
   - Nail care (ID: 20)
   - Makeup (ID: 18)
   - Fragrance (ID: 57)
5. URLs follow the pattern: `base_url/en-gb/catalog/category/subcategory`


### All Products
**Endpoint:** `https://new.azurakwt.com/index.php?route=extension/mstore/product`  
**Type:** GET  
**Description:** Returns a list of all products available in the store  

**Response Structure:**
```json
{
  "success": 1,
  "error": [],
  "data": {
    "product_total": number,
    "products": [
      {
        "product_id": string,
        "name": string,
        "meta_title": string,
        "meta_description": string,
        "meta_keyword": string,
        "tag": string,
        "model": string,
        "sku": string,
        "upc": string,
        "ean": string,
        "jan": string,
        "isbn": string,
        "mpn": string,
        "location": string,
        "quantity": string,
        "stock_status": string,
        "image": string,
        "manufacturer_id": null | string,
        "manufacturer": null | string,
        "price": string,
        "special": boolean,
        "reward": null | string,
        "points": string,
        "tax_class_id": string,
        "date_available": string,
        "weight": string,
        "weight_class_id": string,
        "length": string,
        "width": string,
        "height": string,
        "length_class_id": string,
        "subtract": string,
        "rating": number,
        "reviews": number,
        "minimum": string,
        "sort_order": string,
        "status": string,
        "date_added": string,
        "date_modified": string,
        "category_id": string,
        "options": array,
        "images": string[],
        "category_name": string
      }
    ]
  }
}
```

**Sample Response:**
```json
{
  "success": 1,
  "error": [],
  "data": {
    "product_total": 8,
    "products": [
      {
        "product_id": "65",
        "name": "AGARWOOD",
        "meta_title": "Agarwood",
        "meta_description": "",
        "meta_keyword": "",
        "tag": "",
        "model": "Agarwood123",
        "sku": "Agarwood123",
        "quantity": "6",
        "stock_status": "2-3 Days",
        "image": "catalog/productsimage/agarwood/Image 2 (4).png",
        "manufacturer_id": null,
        "manufacturer": null,
        "price": "22.500 KD",
        "special": false,
        "points": "0",
        "tax_class_id": "0",
        "date_available": "2024-08-17",
        "weight": "0.25000000",
        "weight_class_id": "1",
        "length": "0.00000000",
        "width": "0.00000000",
        "height": "0.00000000",
        "length_class_id": "1",
        "subtract": "1",
        "rating": 0,
        "reviews": 0,
        "minimum": "1",
        "sort_order": "1",
        "status": "1",
        "date_added": "2024-08-19 07:15:45",
        "date_modified": "2025-01-07 10:24:43",
        "category_id": "57",
        "options": [],
        "images": [
          "https://new.azurakwt.com/image/cache/catalog/productsimage/agarwood/Image%202%20(4)-500x500.png",
          "https://new.azurakwt.com/image/cache/catalog/productsimage/agarwood/Image%203%20(5)-500x500.png",
          "https://new.azurakwt.com/image/cache/catalog/productsimage/agarwood/Image%204%20(3)-500x500.png",
          "https://new.azurakwt.com/image/cache/catalog/productsimage/agarwood/image1%20(1)-500x500.png"
        ],
        "category_name": ""
      }
    ]
  }
}
```

**Notes:**
1. The response includes a `product_total` field indicating the total number of products
2. Each product has:
   - Unique identifiers (`product_id`, `sku`, `model`)
   - Basic information (`name`, `meta_title`, `description`)
   - Inventory details (`quantity`, `stock_status`)
   - Pricing information (`price`, `special`, `tax_class_id`)
   - Physical attributes (`weight`, `length`, `width`, `height`)
   - Timestamps (`date_added`, `date_modified`, `date_available`)
   - Category information (`category_id`, `category_name`)
   - Multiple product images in the `images` array
3. Prices are returned in KD (Kuwaiti Dinar) format
4. Stock status can be "2-3 Days" or "Out Of Stock"
5. Images are provided in both original path and cached versions (500x500)
6. The `options` array can contain product variations (empty in this example)
7. All numeric values are returned as strings except for `rating` and `reviews`


### Products by Category
**Endpoint:** `https://new.azurakwt.com/index.php?route=extension/mstore/product`  
**Type:** GET  
**Parameters:**
- `category`: Category ID (required)
- `language`: Language code (optional, values: 'ar', 'en')

**Description:** Returns a list of products filtered by category ID

**Response Structure:**
```json
{
  "success": 1,
  "error": [],
  "data": []
}
```

**Sample Requests:**
1. Nail Care Products (category=20)
2. Fragrances (category=18)
3. Makeup (category=19)

**Notes:**
1. The response structure follows the same format as the All Products endpoint
2. If no products are found in the category, an empty data array is returned
3. The success flag is still 1 even when no products are found
4. Category IDs correspond to those defined in the Main Menu endpoint:
   - Nail Care: 20
   - Fragrances: 18
   - Makeup: 19
5. The optional language parameter can be used to get localized product information

**Example Usage:**
```
GET https://new.azurakwt.com/index.php?route=extension/mstore/product?category=20 // Nail Care products
GET https://new.azurakwt.com/index.php?route=extension/mstore/product?category=20&language=ar // Nail Care products in Arabic
```


### Product Detail
**Endpoint:** `https://new.azurakwt.com/index.php?route=extension/mstore/product|detail`  
**Type:** GET  
**Parameters:**
- `productId`: Product ID (required)

**Description:** Returns detailed information about a specific product

**Response Structure:**
```json
{
  "success": 1,
  "error": [],
  "data": {
    "product_id": string,
    "name": string,
    "description": string,
    "meta_title": string,
    "meta_description": string,
    "meta_keyword": string,
    "tag": string,
    "model": string,
    "sku": string,
    "upc": string,
    "ean": string,
    "jan": string,
    "isbn": string,
    "mpn": string,
    "location": string,
    "quantity": string,
    "stock_status": string,
    "image": string,
    "manufacturer_id": null | string,
    "manufacturer": null | string,
    "price": string,
    "special": boolean,
    "reward": null | string,
    "points": string,
    "tax_class_id": string,
    "date_available": string,
    "weight": string,
    "weight_class_id": string,
    "length": string,
    "width": string,
    "height": string,
    "length_class_id": string,
    "subtract": string,
    "rating": number,
    "reviews": number,
    "minimum": string,
    "sort_order": string,
    "status": string,
    "date_added": string,
    "date_modified": string,
    "category_id": string,
    "category_name": string,
    "options": array,
    "images": string[]
  }
}
```

**Sample Response:**
```json
{
  "success": 1,
  "error": [],
  "data": {
    "product_id": "51",
    "name": "AZURA - Nail Polish Remover Extra Fast",
    "description": "<p>Apply the nail polish remover to a dry cotton pad and then let it rest on the nail for a moment so that the remover can do its work. Then remove the cotton pad from the cuticle towards the nail tip.Always rub the cotton pad away from the cuticle to prevent nail polish, dirt or remover from flowing under the cuticles.</p>",
    "meta_title": "AZURA - Nail Polish Remover Extra Fast",
    "meta_description": "",
    "meta_keyword": "",
    "tag": "",
    "model": "620112-1",
    "sku": "620112-1",
    "quantity": "994",
    "stock_status": "2-3 Days",
    "image": "catalog/productsimage/Nail P Remover/image 3 (3).png",
    "manufacturer_id": null,
    "manufacturer": null,
    "price": "2.500 KD",
    "special": false,
    "reward": null,
    "points": "0",
    "tax_class_id": "0",
    "date_available": "2024-08-17",
    "weight": "0.12000000",
    "weight_class_id": "1",
    "length": "0.00000000",
    "width": "0.00000000",
    "height": "0.00000000",
    "length_class_id": "1",
    "subtract": "1",
    "rating": 0,
    "reviews": 0,
    "minimum": "1",
    "sort_order": "1",
    "status": "1",
    "date_added": "2024-08-17 12:18:33",
    "date_modified": "2024-11-15 21:49:36",
    "category_id": "20",
    "category_name": "Nail care",
    "options": [],
    "images": [
      "https://new.azurakwt.com/image/cache/catalog/productsimage/Nail%20P%20Remover/image%203%20(3)-500x500.png",
      "https://new.azurakwt.com/image/cache/catalog/productsimage/Nail%20P%20Remover/image%201%20(1)-500x500.png",
      "https://new.azurakwt.com/image/cache/catalog/productsimage/Nail%20P%20Remover/image%202%20(2)-500x500.png",
      "https://new.azurakwt.com/image/cache/catalog/productsimage/Nail%20P%20Remover/image%204%20(1)-500x500.png"
    ]
  }
}
```

**Notes:**
1. The response includes a `description` field that contains HTML-formatted product details
2. The `category_name` field is populated in product detail responses (unlike in product listings)
3. Product descriptions can contain HTML tags (like `<p>`) for formatting
4. All product details are included in the response, even if they are empty or null
5. The `images` array contains all product images in both original and cached (500x500) versions
6. Prices are returned in KD (Kuwaiti Dinar) format
7. Stock status indicates availability (e.g., "2-3 Days")
8. The product ID must be valid and active in the system


### Login
**Endpoint:** `https://new.azurakwt.com/index.php?route=extension/mstore/account|login`  
**Type:** POST  
**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response Structure:**
```json
{
  "success": number,
  "error": string[],
  "data": object | []
}
```

**Sample Response (Success):**
```json
{
  "success": 1,
  "error": [],
  "data": {
    "customer_id": "18576",
    "customer_group_id": "1",
    "store_id": "0",
    "language_id": "1",
    "firstname": "Burhan",
    "lastname": "Bohra",
    "email": "bbohra52@gmail.com",
    "telephone": "09893962233",
    "password": "$2y$10$nBLKd4ZwtadEyqjQbT.Rputl02FzO2b236BLw/Y8vNZsHIBInAV/y",
    "custom_field": "[]",
    "newsletter": "0",
    "ip": "188.71.237.38",
    "status": "1",
    "safe": "0",
    "token": "",
    "code": "39a281acde6ead97a2b7089692cf51e5f6eeb5fd",
    "date_added": "2024-03-17 12:18:42"
  }
}
```

**Sample Response (Failure):**
```json
{
  "success": 0,
  "error": ["Warning: No match for E-Mail Address and/or Password."],
  "data": []
}
```

**Notes:**
1. The endpoint requires a valid email and password combination
2. On successful login, it returns user details including a token for authentication
3. The `success` field will be 1 for successful login, 0 for failed attempts
4. The `error` array will contain error messages if the login fails
5. The response includes important user data like `customer_id` and `address_id` that might be needed for other API calls
6. The `token` field should be stored securely and used for subsequent authenticated requests
7. Remember to handle failed login attempts appropriately in your application


### Edit Account
**Endpoint:** `https://new.azurakwt.com/index.php?route=extension/mstore/account|edit`  
**Type:** POST  
**Headers Required:**
- Content-Type: application/json
- Cookie: OCSESSID={random_string}

**Body:**
```json
{
  "firstname": "string",
  "lastname": "string",
  "email": "string",
  "telephone": "string"
}
```

**Response Structure:**
```json
{
  "success": number,
  "error": string[],
  "data": {
    "customer_id": string,
    "customer_group_id": string,
    "store_id": string,
    "language_id": string,
    "firstname": string,
    "lastname": string,
    "email": string,
    "telephone": string,
    "password": string,
    "custom_field": string,
    "newsletter": string,
    "ip": string,
    "status": string,
    "safe": string,
    "token": string,
    "code": string,
    "date_added": string
  }
}
```

**Sample Response (Success):**
```json
{
  "success": 1,
  "error": [],
  "data": {
    "customer_id": "19066",
    "customer_group_id": "1",
    "store_id": "0",
    "language_id": "1",
    "firstname": "Hussain",
    "lastname": "Beda",
    "email": "automations.merpec@gmail.com",
    "telephone": "12345678",
    "password": "$2y$10$dHVUt1czoMQVlcuKCVSifebbb8AYxgAxTBIAOx77WZaDh5op3FbQC",
    "custom_field": "\"\\\"\\\"\"",
    "newsletter": "0",
    "ip": "2a00:1851:1b:3be1:c198:c9aa:3c9c:bffd",
    "status": "1",
    "safe": "0",
    "token": "",
    "code": "",
    "date_added": "2025-03-27 01:01:50"
  }
}
```

**Notes:**
1. Generate a random string for OCSESSID and use it consistently across all API calls
2. Login first with the same OCSESSID before making this request
3. All fields in the request body are required
4. The endpoint will return an error if the user is not authenticated
5. The response includes complete updated user information on success
6. The email should match the logged-in user's email
7. The telephone number should be in a valid format


### Edit Address
**Endpoint:** `https://new.azurakwt.com/index.php?route=extension/mstore/account|edit_address`  
**Type:** POST  
**Headers Required:**
- Cookie: OCSESSID={random_string} (same as used for other requests)
- Content-Type: multipart/form-data

**Form Data Fields:**
```
firstname: string (required)
lastname: string (required)
company: string (optional)
address_1: string (required)
address_2: string (optional)
city: string (required)
postcode: string (optional)
country_id: string (required, e.g., "114" for Kuwait)
zone_id: string (required, e.g., "1785" for Kuwait City)
custom_field[30]: string (required - Block number)
custom_field[31]: string (required - Street name/number)
custom_field[32]: string (required - House/Building number)
custom_field[33]: string (optional - Apartment number)
default: string ("1" for default address, "0" otherwise)
address_id: string (required only when editing existing address)
```

**Response Structure:**
```json
{
  "success": number,
  "error": string[],
  "data": {
    "address_id": string,
    "firstname": string,
    "lastname": string,
    "company": string,
    "address_1": string,
    "address_2": string,
    "postcode": string,
    "city": string,
    "zone_id": string,
    "zone": string,
    "zone_code": string,
    "country_id": string,
    "country": string,
    "iso_code_2": string,
    "iso_code_3": string,
    "address_format": string,
    "custom_field": {
      "30": string,
      "31": string,
      "32": string,
      "33": string
    }
  }
}
```

**Sample Success Response:**
```json
{
  "success": 1,
  "error": [],
  "data": {
    "address_id": "107",
    "firstname": "John",
    "lastname": "Doe",
    "company": "",
    "address_1": "Block 1, Street 2",
    "address_2": "",
    "postcode": "",
    "city": "Kuwait City",
    "zone_id": "1785",
    "zone": "Al Asimah",
    "zone_code": "KW-KU",
    "country_id": "114",
    "country": "Kuwait",
    "iso_code_2": "KW",
    "iso_code_3": "KWT",
    "address_format": "Burhan Test<br/>Kuwait,<br/>, , 10 ,Yousef al bader, 1",
    "custom_field": {
      "30": "10",
      "31": "Yousef al bader",
      "32": "1",
      "33": ""
    }
  }
}
```

**Sample Error Response:**
```json
{
  "success": 0,
  "error": ["Please login to update address"],
  "data": []
}
```

**Validation Error Response:**
```json
{
  "success": 0,
  "error": ["Please fill in all required fields"],
  "data": []
}
```

**Notes:**
1. The request must be sent as `multipart/form-data`, not JSON
2. Required fields must be validated before submission:
   - First Name
   - Last Name
   - City
   - Block Number (custom_field[30])
   - Street (custom_field[31])
   - House/Building Number (custom_field[32])
3. The OCSESSID cookie must be included and the user must be authenticated
4. For Kuwait addresses:
   - country_id should be "114"
   - zone_id should be "1785"
5. The custom_field array indices represent:
   - [30]: Block number
   - [31]: Street name/number
   - [32]: House/Building number
   - [33]: Apartment number (optional)
6. The `default` field determines if this should be set as the user's default address
7. When editing an existing address, include the `address_id` in the form data
8. The response will include the complete address details on success
9. Error responses will include descriptive messages in the error array


### Get Customer Address
**Endpoint:** `https://new.azurakwt.com/index.php?route=extension/mstore/account|addresses`  
**Type:** GET  
**Description:** Retrieves the addresses associated with the authenticated user.  

**Response Structure:**
```json
{
    "success": 1,
    "error": [],
    "data": [
        {
            "address_id": "string",
            "firstname": "string",
            "lastname": "string",
            "company": "string",
            "address_1": "string",
            "address_2": "string",
            "postcode": "string",
            "city": "string",
            "city_name": "string",
            "zone_id": "string",
            "zone": "string",
            "zone_code": "string",
            "country_id": "string",
            "country": "string",
            "iso_code_2": "string",
            "iso_code_3": "string",
            "address_format": "string",
            "custom_field": {
                "30": "string", // Block number
                "31": "string", // Street
                "32": "string", // House/Building
                "33": "string"  // Apartment number
            },
            "default": "string"
        }
    ]
}
```

**Sample Response:**
```json
{
    "success": 1,
    "error": [],
    "data": [
        {
            "address_id": "38423",
            "firstname": "Burhan",
            "lastname": "Test",
            "company": "",
            "address_1": "Block 10, Yousef al bader",
            "address_2": "",
            "postcode": "",
            "city": "Kuwait City",
            "city_name": "",
            "zone_id": "1785",
            "zone": "Al Asimah",
            "zone_code": "KW-KU",
            "country_id": "114",
            "country": "Kuwait",
            "iso_code_2": "KW",
            "iso_code_3": "KWT",
            "address_format": "Burhan Test<br/>Kuwait,<br/>, , 10 ,Yousef al bader, 1",
            "custom_field": {
                "30": "10",
                "31": "Yousef al bader",
                "32": "1",
                "33": ""
            },
            "default": "0"
        }
    ]
}
```

**Notes:**
1. The response includes a `data` array containing the user's addresses.
2. Each address object includes fields for personal information, address details, and custom fields.
3. The `default` field indicates whether the address is set as the default address for the user.

### Get Customer Order History
**Endpoint:** `https://new.azurakwt.com/index.php?route=extension/mstore/order|all`  
**Type:** GET  
**Headers Required:**
- Content-Type: application/json
- Cookie: OCSESSID={random_string}

**Description:** Retrieves the complete order history for the authenticated user.

**Response Structure:**
```json
{
    "success": 1,
    "error": [],
    "data": [
        {
            "order_id": "string",
            "firstname": "string",
            "lastname": "string",
            "status": "string",
            "date_added": "string",
            "total": "string",
            "currency_code": "string",
            "currency_value": "string"
        }
    ]
}
```

**Sample Response:**
```json
{
    "success": 1,
    "error": [],
    "data": [
        {
            "order_id": "54212",
            "firstname": "Burhan",
            "lastname": "Bohra",
            "status": "Pending",
            "date_added": "2024-11-26 05:24:52",
            "total": "25.5000",
            "currency_code": "KWD",
            "currency_value": "1.00000000"
        },
        {
            "order_id": "54211",
            "firstname": "shabbir",
            "lastname": "Admin",
            "status": "Pending",
            "date_added": "2024-11-24 21:03:06",
            "total": "23.5000",
            "currency_code": "SAR",
            "currency_value": "1.00000000"
        }
    ]
}
```

**Notes:**
1. The endpoint requires authentication via OCSESSID cookie
2. Orders are returned in reverse chronological order (newest first)
3. The `status` field can be:
   - "Pending"
   - "Shipped"
   - Other statuses as defined by the system
4. The `currency_code` field indicates the currency used (e.g., "KWD", "SAR", "JOD")
5. The `currency_value` field represents the exchange rate multiplier
6. The `date_added` field is in the format "YYYY-MM-DD HH:mm:ss"
7. The response includes all orders associated with the authenticated user
8. Arabic names are properly encoded in the response

### Cart Endpoints

#### Get Cart
**Endpoint:** `https://new.azurakwt.com/index.php?route=extension/mstore/cart`  
**Type:** GET  
**Headers Required:**
- Cookie: OCSESSID={random_string}

**Description:** Retrieves the current cart contents

**Response Structure:**
```json
{
  "success": number,
  "error": string[],
  "data": {
    "total_product_count": number
  }
}
```

**Sample Response:**
```json
{
  "success": 1,
  "error": [],
  "data": {
    "total_product_count": 0
  }
}
```

#### Add to Cart
**Endpoint:** `https://new.azurakwt.com/index.php?route=extension/mstore/cart|add`  
**Type:** POST  
**Headers Required:**
- Content-Type: application/json
- Cookie: OCSESSID={random_string}

**Body:**
```json
[
  {
    "product_id": string,
    "quantity": string
  }
]
```

**Response Structure:**
```json
{
  "success": number,
  "error": string[],
  "data": {
    "total_product_count": number
  }
}
```

**Sample Response:**
```json
{
  "success": 1,
  "error": [],
  "data": {
    "total_product_count": 0
  }
}
```

#### Update Cart Item Quantity
**Endpoint:** `https://new.azurakwt.com/index.php?route=extension/mstore/cart|edit`  
**Type:** GET  
**Headers Required:**
- Cookie: OCSESSID={random_string}

**Parameters:**
- `cart_id`: Cart item ID
- `quantity`: New quantity

**Response Structure:**
```json
{
  "success": number,
  "error": string[],
  "data": {
    "total_product_count": number
  }
}
```

**Sample Response:**
```json
{
  "success": 1,
  "error": [],
  "data": {
    "total_product_count": 0
  }
}
```

#### Remove Item from Cart
**Endpoint:** `https://new.azurakwt.com/index.php?route=extension/mstore/cart|remove`  
**Type:** POST  
**Headers Required:**
- Content-Type: application/json
- Cookie: OCSESSID={random_string}

**Body:**
```json
{
  "cart_id": string
}
```

**Response Structure:**
```json
{
  "success": number,
  "error": string[],
  "data": {
    "total_product_count": number
  }
}
```

**Sample Response:**
```json
{
  "success": 1,
  "error": [],
  "data": {
    "total_product_count": 0
  }
}
```

#### Empty Cart
**Endpoint:** `https://new.azurakwt.com/index.php?route=extension/mstore/cart|emptyCart`  
**Type:** DELETE  
**Headers Required:**
- Cookie: OCSESSID={random_string}

**Response Structure:**
```json
{
  "success": number,
  "error": string[],
  "data": {
    "total_product_count": number
  }
}
```

**Sample Response:**
```json
{
  "success": 1,
  "error": [],
  "data": {
    "total_product_count": 0
  }
}
```

**Notes:**
1. All cart endpoints require a valid OCSESSID cookie for authentication
2. The `total_product_count` field indicates the total number of items in the cart
3. Product IDs must be valid and active in the system
4. Quantities should be positive integers
5. The cart_id for update and remove operations must be valid
6. All endpoints return a consistent success/error response format
7. The empty cart operation removes all items from the cart

