# Google Apps Script for Updating Sheets and Generating Mentor Questions

## Overview
This script is designed to update Google Sheets with user information and generate mentor-specific questions based on the user's profile. It integrates with Google Apps Script and a generative AI API to provide recommendations and updates.

---

## Features
1. **Generate Mentor Questions**: The script generates at least 3 personalized questions from each mentor based on the user's profile.
2. **Update Google Sheet**: Automatically updates the sheet with the user's information and generated questions.
3. **Trigger Mechanisms**:
   - **Form Submission Trigger**: Processes user data when a form is submitted.
   - **Time-Based Trigger**: Periodically checks for updates and sends emails to users as required.

---

## Script Components
### Mentor Information
The script includes predefined mentor data, such as:
- Name
- Bio
- LinkedIn profile

### Response Schema
Defines the JSON structure for mentor questions to ensure consistency and proper formatting.

### Core Functions
#### 1. **`generateQuestionsBasedOnMentors(userInfo)`**
- Generates questions using the generative AI API.
- Inputs:
  - User profile data
  - Mentor information
- Output:
  - Valid JSON containing questions for each mentor.

#### 2. **`getActiveSpreadSheetAndData()`**
- Fetches the active Google Spreadsheet and data from the "Form Responses 1" sheet.

#### 3. **`getUserObjectForPrompt(values)`**
- Extracts relevant user data from the sheet to create a structured user profile object.

#### 4. **`updateRowWithData(formSheet, index, userData, questions)`**
- Updates an existing row in the sheet with user data and generated questions.

#### 5. **`myFunction(e)`**
- Main function triggered by form submissions.
- Updates the sheet with generated mentor questions.

#### 6. **`runsAfterAInterval()`**
- Periodically checks for updates and sends emails to users.

---

## Installation
1. Open Google Sheets and navigate to **Extensions > Apps Script**.
2. Copy and paste the script into the Apps Script editor.
3. Save the script with an appropriate name.
4. Add the required triggers:
   - **Form Submission Trigger**: Link `myFunction` to the form submission event.
   - **Time-Based Trigger**: Link `runsAfterAInterval` to run periodically (e.g., every hour).

---

## Configuration
### API Integration
1. Replace the API key in the `fetchQuestionsAndCleanData` function:
   ```javascript
   const mentorQuestions = await UrlFetchApp.fetch(
     "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY",
     {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       payload: JSON.stringify({
         contents: [
           {
             parts: [{ text: getSystemPrompt(userInfo) }],
           },
         ],
       }),
     }
   );
   ```
2. Replace `YOUR_API_KEY` with your actual API key.

### Spreadsheet Structure
Ensure the Google Sheet has the following columns:
- **Email Address**
- **Are you a student (if applicable)**
- **Rate your technical knowledge**
- **Field of interest**
- **Description**
- Additional columns for mentor questions and status flags.

---

## Usage
1. Fill out the Google Form linked to the sheet.
2. The script will:
   - Generate mentor-specific questions.
   - Update the sheet with the new data.
   - Optionally, send email notifications to users.

---

## Troubleshooting
1. **Error Parsing JSON**:
   - Check the API response structure and ensure valid JSON.
2. **Sheet Updates Not Reflecting**:
   - Verify column indices and ensure the sheet structure matches the script.
3. **API Errors**:
   - Confirm API key validity and quota limits.

---
