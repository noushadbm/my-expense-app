# My Expense tracker

iOS app to tracker expenses.

### Steps
1. Clean cache
```
rm -rf node_modules
rm -rf ios/Pods
rm -rf ios/Podfile.lock
rm -rf ~/Library/Developer/Xcode/DerivedData/*
```
2. Reinstall dependencies
```
npm install   # or yarn install
```
3. Install CocoaPods
```
cd ios
pod install
cd ..
```
4. Clean and rebuild the project
```
npx expo prebuild --clean
npx expo run:ios
```
- To start the app in simulator
```
npx expo start --ios
```
