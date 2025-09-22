const getEmails = () => {
  // const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  const ttSheetName = "Tiktok leads";
  const fbSheetName = "Facebook leads";

  const ttsheet = SpreadsheetApp.getActive().getSheetByName(ttSheetName);
  const fbsheet = SpreadsheetApp.getActive().getSheetByName(fbSheetName);

  const ttPattern = /^\[DES\] New Tik Tok Lead$/;
  const fbPattern = /^\[DES\] New Facebook Lead$/;

  const headers = [
    "Name",
    "Number",
    "Age",
    "Retirement Sum",
    "Retirement Age",
    "Date",
    "Time",
  ];

  ttsheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  fbsheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  let row = 2;

  const threads = GmailApp.getInboxThreads();
  const ttMessages = [];
  const fbMessages = [];

  threads.forEach((thread) => {
    const messages = thread.getMessages();

    messages.forEach((message) => {
      const subject = message.getSubject();
      const ttMatched = ttPattern.test(subject);
      const fbMatched = fbPattern.test(subject);

      if (!ttMatched && !fbMatched) {
        return;
      }

      const body = message.getPlainBody();
      // Extract details using regular expressions

      const nameMatch = body.match(/Name:\s*(.+)/i);
      const numberMatch = body.match(/Number:\s*(.+)/i);
      const ageMatch = body.match(/Age:\s*(.+)/i);

      // Extract additional info
      const retirementSumMatch = body.match(
        /Have You Managed To Hit Full Retirement Sum\?[:\-]?\s*(.+)/i
      );
      const retirementAgeMatch = body.match(
        /When Do You Ideally See Yourself Retiring\?[:\-]?\s*(.+)/i
      );

      const name = nameMatch ? nameMatch[1].trim() : "";
      const number = numberMatch ? numberMatch[1].trim() : "";
      const age = ageMatch ? ageMatch[1].trim() : "";
      const retirementSum = retirementSumMatch
        ? retirementSumMatch[1].trim()
        : "";
      const retirementAge = retirementAgeMatch
        ? retirementAgeMatch[1].trim()
        : "";
      const date = message.getDate(); // Email sent date and time

      if (name || number || age) {
        if (ttMatched) {
          ttMessages.push({
            name,
            number,
            age,
            retirementSum,
            retirementAge,
            date,
          });
        } else if (fbMatched) {
          fbMessages.push({
            name,
            number,
            age,
            retirementSum,
            retirementAge,
            date,
          });
        }
      }
    });
  });

  console.log(ttMessages);
  console.log(fbMessages);
  insertEmails(ttMessages, ttsheet, headers);
  insertEmails(fbMessages, fbsheet, headers);
};

const insertEmails = (messages, sheet, headers, startRow = 2) => {
  messages.sort((a, b) => a.date - b.date);

  for (let msg of messages) {
    const { name, number, age, date, retirementSum, retirementAge } = msg;

    const formattedDate = Utilities.formatDate(
      date,
      Session.getScriptTimeZone(),
      "MM-dd-yyyy"
    );
    const formattedTime = Utilities.formatDate(
      date,
      Session.getScriptTimeZone(),
      "HH:mm"
    );

    sheet
      .getRange(startRow, 1, 1, headers.length)
      .setValues([
        [
          name,
          number,
          age,
          retirementSum,
          retirementAge,
          formattedDate,
          formattedTime,
        ],
      ]);

    startRow++;
  }
};
