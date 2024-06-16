const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const fs = require('fs');
const readline = require('readline');
const Client = require('../models/Client')
const Employee = require('../models/Employee')




const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = 'token.json';




async function createGoogleMeetEvent(session) {
  const client = await Client.findOne({ _id: session.Client }, { email: 1, _id: 0 }).exec();
  const employee= await Employee.findOne({ _id: session.Employee }, { email: 1, _id: 0 }).exec();



  const content = fs.readFileSync('./config/credentials.json');
  const credentials = JSON.parse(content);
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new OAuth2(client_id, client_secret, redirect_uris[0]);
  
  if (fs.existsSync(TOKEN_PATH)) {
    const token = fs.readFileSync(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
} else {
    return getAccessToken(oAuth2Client);
}



const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

  const event = {
    summary: 'Session Meeting',
    description: `Session with user ${session.Client} and coach ${session.Employee}`,
    start: {
      dateTime: session.sessionDate.toISOString(),
      timeZone: 'UTC',
    },
    end: {
      dateTime: new Date(session.sessionDate.getTime() + 60 * 60 * 1000).toISOString(), // Assuming 1-hour session
      timeZone: 'UTC',
    },
    conferenceData: {
      createRequest: {
        requestId: `meet-${session._id}`,
        conferenceSolutionKey: {
          type: 'hangoutsMeet'
        }
      }
    },
    attendees: [{ email: client.email }, { email: employee.email }],
    
  };

  
  try {
    const { data } = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
    });
    return data;
  } catch (error) {
    console.error('Error creating Google Meet event:', error);
    throw error;
  }}

 

  async function getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
  
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  
    const code = await new Promise((resolve) => {
      rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        resolve(code);
      });
    });
  
    try {
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
      console.log('Token stored to', TOKEN_PATH);
    } catch (error) {
      console.error('Error retrieving access token:', error);
      throw error;
    }
  }


module.exports = { createGoogleMeetEvent };