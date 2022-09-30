# Conjugo
- Conjugo is a project that I have developed since 2021 and has functioned as the creative output of my journey into web development.
- It began as a **vanilla JS, client-side-only** experiment and has evolved into a **full-stack, React-based, multi-functional** app.
---
### Purpose
- The principal purpose of the app is to facilitate the learning of verb conjugation in foreign languages
  - Conjugo currently supports **Spanish**, **French**, **German**, **Italian**, and **Portuguese** (additional languages may be added in the future).
  - In its current form, the app is composed of three distinct sections:
    - **Learn** – the primary component; enables users to learn verb conjugation through a series of auto-generated 'lessons'
    - **Practice** – allows users to test themselves in a timed environment, in which the subjects + tenses are predefined by the user
    - **Reference** – a dictionary of verbs, ranked by frequency of use, that allows for users to look up particular conjugations
  - Each user is required to create an account, which is used to track their progress and save their preferences
    - Authentication is enabled using JWT, with each user possessing a short-lived access token and long-term refresh token
 - The data for each language was derived through numerous methods, principally utilising **Python** to send requests to various APIs
     - Conjugation data was predominantly derived from **Verbix**, whilst audio was generated via **Google's Text to Speech API**

 ---
 ### Current Technologies
 - NB. I am currently porting the backend to TypeScript, a process I intend to repeat for the frontend, in addition to implementing NextJS.
 #### Frontend
 - React
 - React Router (v6)
 - React Spring (for animation)
 #### Backend
 - NodeJS / Express
 - PostgreSQL / Prisma
 - JSON Web Token (for user authentication)
 - bcrypt (for password hashing)
 - Zod (for type validation)
 ---
 NB. Conjugo is not currently hosted, however this is intended in the near future.

Solarized dark             |  Solarized Ocean
:-------------------------:|:-------------------------:
![](https://i.imgur.com/llyyt8K.png)  |  ![](https://i.imgur.com/amJKzoL.png)
