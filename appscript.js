const mentorInfo = [
  {
    name: "Shreyan Mehta",
    bio: "Karta Dharta at Asambhav Solutions, with a deep focus on GPT, diffusion, LangChain, and the MERN stack. He is an A.I. enthusiast and Scrum Master, and the founder of several projects including Autoresume, LoveGPT, and SitesGPT.",
    linkedin: "https://www.linkedin.com/in/devsm/",
    github: "",
    twitter: "",
  },
  {
    name: "Utkarsh Gupta",
    bio: "Multidisciplinary designer with over 6+ years of experience in UI/UX & Interior design. Passionate about academics, he serves as a jury member in design colleges and participates in the WordPress Bhopal community. He has also spoken at WordPress events and design institutions.",
    linkedin: "https://www.linkedin.com/in/utkarsh-gupta01/",
    github: "",
    twitter: "",
  },
  {
    name: "Gourav Jain",
    bio: "Expert in project management fundamentals with a focus on agile and scrum frameworks. He is currently associated with Technoduxx and shares insights into project delivery processes in today's industry.",
    linkedin:
      "https://www.linkedin.com/in/gourav-j-a785599?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    github: "",
    twitter: "",
  },

  {
    name: "Ankit Kumar Sharma",
    bio: "Passionate software developer with over 10 years of experience, specializing in full-stack development. He is currently a Senior Consultant at HCL Tech, where he leads development teams and is an advocate for clean code and agile methodologies.",
    linkedin: "https://www.ankitkumarsharma.com/",
    github: "",
    twitter: "",
  },
  {
    name: "Lomash Dubey",
    bio: "Software engineer who focuses on guiding others to overcome mental barriers and become better engineers. He emphasizes the importance of SDLC, programming fundamentals, self-care, and introspection for continuous growth in both software engineering and life.",
    linkedin: "",
    github: "",
    twitter: "",
  },
  {
    name: "Ankit Patel",
    bio: "AI/ML Security Enthusiast with 2.5 years of experience in the Software Engineering field. He is passionate about securing LLM applications and has shared insights on various defenses like Spotlighting, Input Filtering, LLM-as-a-Judge, and TaskTracker.",
    linkedin: "https://www.linkedin.com/in/blox786/",
    github: "",
    twitter: "",
  },
  {
    name: "Viren Gajjar",
    bio: "Dedicated software developer and Mobile Lead at Signify. Passionate about transforming innovative ideas into functional, user-friendly solutions, Viren specializes in Flutter development and empowering teams with cutting-edge tools like Shorebird for continuous delivery and real-time updates.",
    linkedin: "https://www.linkedin.com/in/virengajjar1010/",
    github: "",
    twitter: "",
  },
  {
    name: "Vishal Chhalotre",
    bio: "Certified GCP Data Engineer with 4.5 years of experience specializing in services like DBT, BigQuery, Composer, and other data processing tools. He is proficient in developing, testing, and deploying ETL data pipelines to seamlessly move and process data across various storage systems and compute resources.",
    linkedin:
      "https://www.linkedin.com/in/vishal-chhalotre-b847051b7?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    github: "",
    twitter: "",
  },
];

function generateResponseSchema(numberOfMentors) {
  const schema = {
    type: "object",
  };
  for (let i = 1; i <= numberOfMentors; i++) {
    schema[`mentor${i}`] = {
      type: "object",
      questions: {
        type: "array",
        question: {
          type: "object",
          properties: {
            questionTitle: { type: "string" },
          },
        },
      },
    };
  }
  return schema;
}

const responseSchema = generateResponseSchema(8);

async function generateQuestionsBasedOnMentors(userInfo) {
  try {
    const getSystemPrompt = (userInfo) => {
      return `You are an assistant whose task is to learn about a candidate using the information provided in User Profile and learn about the candidate and generate at least 3 questions from each mentor whose information is also provided in Available Mentors information which the candidate could possibly ask for proper guidance of that mentor for his future career ahead.
  
  User Profile:
  ${JSON.stringify(userInfo, null, 2)}
  
  Available Mentors:
  1. mentor1
  ${JSON.stringify(mentorInfo[0], null, 2)}
  2. mentor2
  ${JSON.stringify(mentorInfo[1], null, 2)}
  3. mentor3
  ${JSON.stringify(mentorInfo[2], null, 2)}
  4. mentor4
  ${JSON.stringify(mentorInfo[3], null, 2)}
  5. mentor5
  ${JSON.stringify(mentorInfo[4], null, 2)}
  6. mentor6
  ${JSON.stringify(mentorInfo[5], null, 2)}
  7. mentor7
  ${JSON.stringify(mentorInfo[6], null, 2)}
  8. mentor8
  ${JSON.stringify(mentorInfo[7], null, 2)}

  Provide recommendations following this exact JSON structure:
  ${JSON.stringify(responseSchema, null, 2)}
  
  Consider factors like:
  - Skills and expertise alignment
  - Career goals compatibility
  - Industry experience
  - Mentoring style preferences
  
  Return only valid JSON matching the schema above.`;
    };

    async function fetchQuestionsAndCleanData() {
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

      const jsonResponse = JSON.parse(mentorQuestions.getContentText());
      const rawJsonString = jsonResponse.candidates[0].content.parts[0].text;

      const cleanJsonString = rawJsonString.replace(/```json\n|\n```/g, "");

      let parsedMentorQuestions = [];
      try {
        let mentorInfoQuestions = JSON.parse(cleanJsonString);

        for (let i = 1; i <= 8; i++) {
          const mentor = mentorInfoQuestions[`mentor${i}`];
          if (mentor?.questions?.question?.length > 0) {
            parsedMentorQuestions.push(
              JSON.stringify(mentor?.questions?.question)
            );
          }
        }

        return parsedMentorQuestions || [];
      } catch (error) {
        console.error("Error parsing JSON:", error);
        return [];
      }
    }

    const additionalData = await fetchQuestionsAndCleanData();

    return additionalData;
  } catch (e) {
    console.log(e);
    return [];
  }
}

async function getActiveSpreadSheetAndData() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const formSheet = spreadsheet.getSheetByName("Form Responses 1");
  return { formSheet, data: formSheet.getDataRange().getValues() };
}

async function getUserObjectForPrompt(values) {
  return {
    "Email Address": values[1],
    "Are you a student (if applicable)": values[3],
    "Rate your technical knowledge": values[4],
    "What field you are currently in or you want to go in": values[5],
    "Write something about you": values[6],
  };
}

async function updateRowWithData(formSheet, index, userData, questions) {
  try {
    formSheet
      .getRange(index + 1, 1, 1, userData.length + [...questions, true].length)
      .setValues([userData.concat([...questions, true])]);
  } catch (e) {
    console.log(e);
  }
}

async function myFunction(e) {
  const { data, formSheet } = await getActiveSpreadSheetAndData();

  const email = e.values[1];
  let userData = null;

  let existingRowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === email) {
      userData = data[i];
      existingRowIndex = i;
      break;
    }
  }

  let userInfo = await getUserObjectForPrompt(userData);

  const additionalData = await generateQuestionsBasedOnMentors(userInfo);

  if (existingRowIndex > -1) {
    await updateRowWithData(
      formSheet,
      existingRowIndex,
      userData.slice(0, 12),
      additionalData
    );
  } else {
    formSheet.appendRow(userData.slice(0, 12).concat(additionalData));
  }
}

async function runsAfterAInterval() {
  try {
    const { data, formSheet } = await getActiveSpreadSheetAndData();
    let userData = null;
    let existingRowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][20] && !data[i][21]) {
        await sendMailToUser(data[i][1], data[i][2], formSheet, i);
      }
      if (!data[i][20]) {
        userData = data[i];
        existingRowIndex = i;
        break;
      }
    }
    if (!userData) {
      console.log("No new user present!");
      return;
    }

    const userInfo = await getUserObjectForPrompt(userData);
    const questions = await generateQuestionsBasedOnMentors(userInfo);

    if (questions?.length) {
      await updateRowWithData(
        formSheet,
        existingRowIndex,
        userData.slice(0, 12),
        questions
      );
    }
  } catch (e) {
    console.log(e);
  }
}

async function sendMailToUser(email, name, formSheet, index) {
  try {
    const emailQuotaRemaining = MailApp.getRemainingDailyQuota();

    if (emailQuotaRemaining <= 0) {
      Logger.log("Daily email quota exceeded");
      throw new Error("Daily email quota exceeded");
    }

    MailApp.sendEmail({
      to: email,
      subject: `🌟 Thank you ${name} for attending my talk in bhopal 🌟`,
      htmlBody: `
      <p style="font-size: 16px; color: #333; font-family: Arial, sans-serif;"> Hey ${name} your profile link is ready 🎉 </p>
      <p style="font-size: 16px; color: #333; font-family: Arial, sans-serif;"> Thank you for being part of the wonderful event and actively participating in my session by filling this form. As you might remember i told about rate limit error which i showcased, and one way to counter that is to batch process it. </p>
      <p style="font-size: 16px; color: #333; font-family: Arial, sans-serif;">Thats exactly what I have updated the code to do, here you can find your profile, you can share on social media, etc</p>

      <table width="100%" cellspacing="0" cellpadding="0">
  <tr>
    <td align="left">
      <table cellspacing="0" cellpadding="0" border="0">
        <tr>
          <!-- First Button Cell -->
          <td style="padding-right: 20px;">
            <table cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" bgcolor="#4CAF50" style="border-radius: 5px;">
                  <a href="https://devfest-gemini-question-to-speaker.vercel.app/${email}"
                     target="_blank"
                     style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: white; text-decoration: none; padding: 12px 30px; border-radius: 5px; border: 1px solid #4CAF50; display: inline-block; font-weight: bold; white-space: nowrap;">
                     View My Profile / Page
                  </a>
                </td>
              </tr>
            </table>
          </td>
         
        </tr>
      </table>
    </td>
  </tr>
</table>
     
    <p style="font-size: 16px; color: #333; font-family: Arial, sans-serif;">
Curious to see what are the changes, well I have made 2 well maintained repositories just for you to explore the goodness of google suit and magic of Gemini. Checkout the github repositories, fork it 🔀  , star it ⭐ , clone it and make it yours and start exploring the goodness of Gemini.
    </p>

    <table width="100%" cellspacing="0" cellpadding="0">
  <tr>
    <td align="left">
      <table cellspacing="0" cellpadding="0" border="0">
        <tr>
          <!-- First Button Cell -->
          <td style="padding-right: 20px;">
            <table cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" bgcolor="#4CAF50" style="border-radius: 5px;">
                  <a href="https://github.com/duke7able/devfest-gemini-question-to-speaker"
                     target="_blank"
                     style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: white; text-decoration: none; padding: 12px 30px; border-radius: 5px; border: 1px solid #4CAF50; display: inline-block; font-weight: bold; white-space: nowrap;">
                     View profile repo on Github
                  </a>
                </td>
              </tr>
            </table>
          </td>
          <!-- Second Button Cell -->
          <td>
            <table cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" bgcolor="#4CAF50" style="border-radius: 5px;">
                  <a href="https://github.com/duke7able/gemini-appscript"
                     target="_blank"
                     style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: white; text-decoration: none; padding: 12px 30px; border-radius: 5px; border: 1px solid #4CAF50; display: inline-block; font-weight: bold; white-space: nowrap;">
                     View google app script repo on Github
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

    <p style="font-size: 16px; color: #333; font-family: Arial, sans-serif;">
    If you have any questions feel free to ask i would try to help you whenever i can. Also this could be your starting point for building open source projects, I would love to see what you guys build using this and Gemini so post it on linkedin , X etc feel free to tag me, and other organizers, and make us feel proud, we would be happy to repost and share to more people so more people can see what you build
    </p>

    <p style="font-size: 16px; color: #333; font-family: Arial, sans-serif;">
Also feel free to express your thoughts as comments on <a href="https://www.linkedin.com/posts/devsm_devfestbhopal-generative-gemini-activity-7277529743845916672-ZRju?utm_source=share&utm_medium=member_desktop"><b>this post</b></a> so that i can provide more value in my next talks : 
    </p>

 <p style="font-size: 14px; color: #999; font-family: Arial, sans-serif;">
      Cheers,<br>
      Shreyan Mehta<br>
      Linkedin :<a href="https://www.linkedin.com/in/devsm/">@devsm</a> 
    </p>



  `,
    });
    formSheet.getRange(index + 1, 22).setValue(true);
    Logger.log(`Email sent successfully to ${email}`);
  } catch (error) {
    Logger.log(`Error in sendMailFromFunction: ${error.message}`);
  }
}
