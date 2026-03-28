# Project: PhotoEffects

<p align="center"><img src="../../resources/AppIcon.svg" height="256" width="256"></p>

# Project Guide

This document provides a comprehensive overview of the project for new and existing developers. It covers key concepts, development workflows, and troubleshooting tips.

## Project Overview

This project is to develop an application for both iOS and Android which allows end users to enhance their photos or images with effects using [OpenCV](https://opencv.org).

## Main Features

*   **High-Performance Editing:** Unlike normal apps that process images in JavaScript (which can be slow), this app uses **OpenCV** on the native side. This makes effects run much faster.
*   **Custom Image Effects:** Users can apply filters and effects to their photos.
*   **Native Integration:** The project demonstrates how to include external C++ libraries and use them inside a React Native app.
*   **Gesture Support:** The app includes support for intuitive gestures, such as pinch-to-zoom and panning, to enhance user interaction with photos.

## Technologies

This project uses a mix of modern web technologies and native mobile code:
*   **[React Native (Expo):](https://docs.expo.dev/)** Used for building the user interface and managing the application flow. Note: The project relies heavily on Expo SDK internals, which requires careful consideration when making changes.
*   **[OpenCV:](https://opencv.org/)** A powerful library written in C++ for computer vision and image analysis. It is included in the `libs/` folder.
*   **[Native Modules (Expo Modules API):](https://docs.expo.dev/modules/overview/)** Custom code used to bridge the gap between JavaScript and the native OpenCV library (indicated by the `modules/` folder structure). Key components like `modules/expo-opencv/src/ExpoOpenCVModule.ts` are integral to this bridge.
*   **[Expo SQLite:](https://docs.expo.dev/versions/latest/sdk/sqlite/)** Used for storing data locally on the phone's database.
*   **[Drizzle ORM:](https://orm.drizzle.team/)** A next-generation TypeScript ORM.
*   **[Zustand:](https://zustand.docs.pmnd.rs/learn/getting-started/introduction)** A simple library for managing the application's state.
*   **[TypeScript:](https://www.typescriptlang.org/)** Used to write clean and error-free JavaScript code.

## Coding styles

The project has coding style defined by [eslint.config.js](../../eslint.config.js) file. Every new code added should pass the linting rule by running `npx expo lint` command. 

## Get started

1. Setup third-party libraries locally. See [libs/README.md](libs/README.md).

2. Install dependencies

   ```bash
   npm install
   ```

3. Generate a prebuild

   ```bash
   npx expo prebuild
   ```

4. Start the app

   ```bash
   npx expo start
   ```

## Database Setup & Initial Data

This is a React Native project using Expo SDK. It uses `expo-sqlite` package for the SQL engine runtime, `drizzle-orm` package for ORM tool, and `expo-drizzle-studio-plugin` for development purpose.

## Key Architectural Notes

*   **Performance Mode:** A "Performance Mode" setting (managed in `src/persistence/settings`) conditionally renders components wrapped by the `withPerformanceModeSettings` HOC to optimize resource usage.
*   **Expo SDK Integration:**  Significant portions of the OpenCV integration rely on internal Expo SDK implementations, particularly within the `modules/expo-opencv` directory. This can make understanding the code challenging as it is tightly coupled with Expo's internals. For example, `modules/expo-opencv/src/utils/blurhash` directory contains implementations related to Blurhash encoding, which is originally part of Expo SDK's `Image` component.
*   **Schema Definition:** The database schema is defined using a "Code First" approach within the `src/persistence/schema` directory. Relationships between entities are managed in `src/persistence/schema/photosRelations.ts`, following Drizzle ORM guidelines.
