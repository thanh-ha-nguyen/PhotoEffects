# Project: Photo Effects

## Introduction
This document explains the **Photo Effects** project developed for the React Native course at Haaga-Helia UAS. The goal of this application is to perform image processing on mobile devices using high-performance native libraries.

## Technologies
This project uses a mix of modern web technologies and native mobile code:
*   **[React Native (Expo):](https://docs.expo.dev/)** Used for building the user interface and managing the application flow.
*   **[OpenCV:](https://opencv.org/)** A powerful library written in C++ for computer vision and image analysis. It is included in the `libs/` folder.
*   **[Native Modules (Expo Modules API):](https://docs.expo.dev/modules/overview/)** Custom code used to bridge the gap between JavaScript and the native OpenCV library (indicated by the `modules/` folder structure).
*   **[Expo SQLite:](https://docs.expo.dev/versions/latest/sdk/sqlite/)** Used for storing data locally on the phone's database.
*   **[Drizzle ORM:](https://orm.drizzle.team/)** A next-generation TypeScript ORM.
*   **[Zustand:](https://zustand.docs.pmnd.rs/learn/getting-started/introduction)** A simple library for managing the application's state.
*   **[TypeScript:](https://www.typescriptlang.org/)** Used to write clean and error-free JavaScript code.

## Main Features
*   **High-Performance Editing:** Unlike normal apps that process images in JavaScript (which can be slow), this app uses **OpenCV** on the native side. This makes effects run much faster.
*   **Custom Image Effects:** Users can apply filters and effects to their photos.
*   **Native Integration:** The project demonstrates how to include external C++ libraries and use them inside a React Native app.
*   **Gesture Support:** The app includes support for intuitive gestures, such as pinch-to-zoom and panning, to enhance user interaction with photos.

## Grade Aspiration: 5 (Excellent)
I am aiming for the maximum grade because this project is technically more advanced than a standard React Native assignment.

**Why it deserves a 5:**
*   **Native Features:** Most students only use third-party libraries from `npm` and write only JavaScript. This project involves configuring and using **native code** (C++ and native modules).
*   **Complexity:** Integrating **OpenCV** manually requires understanding how Android and iOS build systems work.
*   **Performance:** By going native, the app solves real performance problems that pure JavaScript apps have with image processing.

This demonstrates a deep understanding of mobile development, moving beyond just UI design into native system integration.
