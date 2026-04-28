# Project Overview

Bicicleta is a modern web application built with Nuxt 3 that allows users to configure custom bicycles, track component prices, and manage component hierarchies.

## Executive Summary

This application serves as a comprehensive tool for both cyclists and administrators. Cyclists can use the intuitive Bike Builder to select components from a rich catalog, viewing real-time total weight and price calculations. Administrators have access to a dashboard where they can manage the brand catalogs and trigger background jobs to scrape up-to-date pricing from external providers like Mercado Livre.

## Tech Stack

| Category      | Technology             | Version     | Justification                                                                                                  |
| :------------ | :--------------------- | :---------- | :------------------------------------------------------------------------------------------------------------- |
| **Framework** | Nuxt.js                | 3.15.0      | Provides a robust Vue-based isomorphic framework with file-based routing and a powerful server engine (Nitro). |
| **Database**  | Neon PostgreSQL        | Serverless  | Scalable serverless database ideal for the Vercel/Nuxt ecosystem.                                              |
| **ORM**       | Drizzle ORM            | 0.30.0      | Type-safe SQL query builder.                                                                                   |
| **Styling**   | Tailwind CSS & Nuxt UI | v4 / 2.22.3 | Rapid UI development with pre-built accessible components.                                                     |
| **State**     | Pinia                  | 3.0.4       | Vue's standard state management, used here for the builder state.                                              |
| **Testing**   | Vitest & Playwright    | -           | Comprehensive unit and E2E testing coverage.                                                                   |

## Architecture Type

**Monolith (Isomorphic Web Application)**: The project uses a single repository structure containing both the Vue 3 frontend and the Nitro-based backend API (`server/`).
