# ZeroHate - Chrome Extension  
**AI-powered Hate Speech Filter for a Kinder Internet**  
**United Hackathon V5 | Solo Submission**  

## Theme: Entertainment  
In a world where online entertainment thrives on platforms like Instagram, toxic comments can damage the user experience and mental well-being of creators and audiences alike. ZeroHate enhances the entertainment experience by transforming hateful comments into heartful ones—creating a more positive, inclusive environment.

---

## What is ZeroHate?  
ZeroHate is a Chrome extension that automatically detects and replaces hate speech in Instagram comments with uplifting and positive messages. Built with AI, it helps make social media more emotionally safe and supportive—without disrupting the fun.

---

## How It Works  
1. **Comment Scraping**: The extension detects Instagram comments using DOM class selectors.
2. **Temporary Blur**: Comments are momentarily blurred while processing.
3. **AI Hate Detection**: Comments are sent via a POST request to a webhook.
4. **LLM Evaluation**: The webhook sends data to a GPT-4.0 API which returns an array indicating which comments contain hate speech.
5. **Content Replacement**:
   - Non-hateful comments are left unchanged.
   - Hateful comments are replaced client-side with a heartful, AI-generated positive message.
6. **User Interface**: A lightweight extension popup is built using HTML and CSS for basic user interaction.

---

## Tech Stack  
- **JavaScript** – Core logic and DOM handling  
- **HTML/CSS** – UI and styling for the extension popup  
- **OpenAI GPT-4.0 API** – Language model used to detect hate speech  
- **Webhook Middleware** – Acts as an intermediary between the extension and the LLM API  
- **Chrome Extension APIs** – For browser integration

---

## Installation  
1. Download or clone this repository.  
2. Open `chrome://extensions/` in your Chrome browser.  
3. Enable **Developer Mode** (toggle in the top right).  
4. Click **Load unpacked** and select the `zerohate-chrome-extension` folder.  
5. Open Instagram and see the extension in action.
6. Note: You have to refresh before it's applied

---

## Vision  
Although currently built for Instagram, ZeroHate is designed to be easily adaptable to other entertainment platforms like YouTube, TikTok, Reddit, and more—anywhere online discourse takes place.

---

## Why It Matters  
Entertainment should be enjoyable and safe. By detecting and transforming toxic comments into positive ones, ZeroHate promotes a healthier and more welcoming online experience for everyone.

---

## Author  
Solo project by Ibrahim Almafrajy for United Hackathon V5

