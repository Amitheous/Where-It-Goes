# Expense Tracker App

## To Use
npm install
npx expo start | starts dev server for expo go
npx expo start --dev-client | starts dev server for dev-client build (better performance generally)

Will want to have an android emulator set up, I did setup through android studio. If emulator is setup and paths are configured properly, you can just press a after server is running to open the app in the emulator.

## Pain Points
- Learning how to build apk. Expo recommends eas, but despite dev-client builds working fine, I was having issues with production builds. Instead I ended up using npx expo export -p android, then building the apk through android studio using ./gradlew assembleRelease from the android folder just for testing, which worked fine, but am hoping to find a more consistent CI solution moving forward

## Overview
This document outlines the development roadmap and versioning plan for Where It Goes, an expense tracking app for Android and iOS. (Initial Development is focused on Android, as that is what I have available for testing.)

## Development Roadmap

### Version 0.1.0 - Initial Setup
- Firebase Auth functional.
- Registration/Login screens.
- Basic navigation with Dashboard, Budgets, Trends, Settings.
- Functional logout button.

### Version 0.2.0 - Basic Expense Management
- Add Expense feature.
- View Expenses List.

### Version 0.3.0 - Enhanced Expense Management
- Delete Expense feature.
- Modify Expense feature.
- Basic Categorization.

### Version 0.4.0 - Basic Budgeting
- Add Budget feature.
- View Budgets.
- Editing Existing Budgets.

### Version 0.5.0 - Basic Dashboard and Trends
- Basic Dashboard implementation.
- Simple Trends view.

### Version 0.6.0 - Advanced Expense Insights
- Enhanced Trends view.
- Spending by Category Visualization.

### Version 0.7.0 - Search and Filter
- Search functionality.
- Filter functionality.

### Version 0.8.0 - Notifications and Enhanced Expenses/Budgets
- Notifications and reminders.
- Recurring Expenses.
- One-time budgets, recurring budgets of varying time periods.

### Version 0.9.0 - MVP Release for Beta Testing
- Cloud Synchronization.
- Basic Security Features.
- Testing and Bug Fixes.
- Prepare Documentation.
- Export Data.

## Post-MVP Features
- Receipt Scanning.
- Interactive Dashboards.
- Custom Categories and Tagging.
- Widgets.

## Versioning Strategy / Commit format
The project follows Semantic Versioning where version numbers are assigned in the format of MAJOR.MINOR.PATCH.
Commit messages are formatted as follows:
- `Feature: <description>` for new features.
- `Fix: <description>` for bug fixes.
- `Docs: <description>` for documentation updates.
- `Style: <description>` for formatting and style changes.
- `Refactor: <description>` for code refactoring.
- `Implement: <description>` for implementing new features / primary development functionality.
- `Test: <description>` for adding tests.
Commit message body is a list of bullet points describing the changes made.

## Branching Strategy
- `master/main`: Stable, deployable code.
- `develop`: Ongoing development.
- Feature branches for new features and fixes.

## Trello Board Management
- Version-based lists for tracking progress.
- Backlog for future features.
- Regular review to update and refine tasks.

- Tools used: React Native, Firebase, Expo

