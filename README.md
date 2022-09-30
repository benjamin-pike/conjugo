# Conjugo
- Conjugo is a project that I have developed since late 2021, serving as the single creative output of my journey into web development.
- It began as a **vanilla JavaScript, client-side-only** experiment and has evolved into a **full-stack, React-based, multi-functional** app.
---
### Purpose
- The principal purpose of the app is to facilitate the learning of verb conjugation in foreign languages.
  - Conjugo presently supports **Spanish**, **French**, **German**, **Italian**, and **Portuguese** (additional languages may be added in the future).
  - In its current form, the app is composed of three distinct sections:
    - **Learn** – the primary component; enables users to learn verb conjugation through a series of auto-generated 'lessons'.
    - **Practice** – allows users to test themselves in a timed environment, in which the subjects + tenses are predefined by the user.
    - **Reference** – a dictionary of verbs, ranked by frequency of use, that allows for users to look up particular conjugations.
  - Each user is required to create an account, which is used to track their progress and save their preferences.
    - Authentication is enabled using JWT, with each user possessing a short-lived access token and a long-term refresh token.
 - The data for each language was derived through numerous methods, principally utilising **Python** to send requests to various APIs.
     - Conjugation data was predominantly derived from **Verbix**, whilst audio was generated via **Google's Text to Speech API**.

---
### Current Technologies
- ***NB.*** I am currently porting the backend to TypeScript, a process I intend to repeat for the frontend, in addition to implementing NextJS.
#### Frontend
- React
- React Router (v6)
- React Spring (for animation)
#### Backend
- Node | Express
- Prisma (with Postgres)
- JSON Web Token (for user authentication)
- Zod (for type validation)
---
***NB.*** Conjugo is not currently hosted, however it is intended to be so in the near future.

---
### Screenshots

#### Login and Registration Screens
![](https://i.imgur.com/llyyt8K.png)  | ![](https://i.imgur.com/8vtfHO0.png)
:-------------------------:|:-------------------------:

### **Learn** Section
![](https://i.imgur.com/p5qkgTQ.png)  |  ![](https://i.imgur.com/ZFWYmZc.png)
:-------------------------:|:-------------------------:
![](https://i.imgur.com/DO7G8fC.png)  |  ![](https://i.imgur.com/axxDoQJ.png)
![](https://i.imgur.com/nNaCcdS.png)  |  ![](https://i.imgur.com/ORVo8sn.png)

### **Practice** Section
![](https://i.imgur.com/JsjMmKM.png)  |  ![](https://i.imgur.com/GIXDb3f.png)
:-------------------------:|:-------------------------:
![](https://i.imgur.com/bdQnbkS.png)  |  ![](https://i.imgur.com/VfLBAOn.png) 
![](https://i.imgur.com/f8jg5MK.png)  |  ![](https://i.imgur.com/dt51Bqv.png) 

### **Reference** Section
![](https://i.imgur.com/Ud8J3t1.png)  |  ![](https://i.imgur.com/DtFaeiZ.png)
:-------------------------:|:-------------------------:
![](https://i.imgur.com/bKyRlnc.png)  |  ![](https://i.imgur.com/Nhnx32z.png)
