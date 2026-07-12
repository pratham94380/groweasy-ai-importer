const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const chunkArray = (array, size) => {
  const chunks = [];

  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }

  return chunks;
};

exports.importLeads = async (req, res) => {
  try {
    const { rows } = req.body;

    if (!rows || rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No rows received",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
    });

    const batches = chunkArray(rows, 50);

    let parsedResult = [];

    const prompt = `
You are an expert CRM data import assistant.

Your task is to convert CSV rows into CRM records.

Return ONLY a valid JSON array.
Do not return markdown.
Do not explain anything.

Output fields:

[
{
    "created_at": null,
    "name": "",
    "email": "",
    "country_code": "",
    "mobile_without_country_code": "",
    "company": "",
    "city": "",
    "state": "",
    "country": "",
    "lead_owner": null,
    "crm_status": "",
    "crm_note": "",
    "data_source": "",
    "possession_time": null,
    "description": ""
}
]

Rules:

1. Map CSV columns intelligently even if names differ.
Example:
Full Name -> name
Mobile / Phone / Contact -> mobile_without_country_code
Email Address -> email

2. If phone contains +91, split:
country_code = "+91"
mobile_without_country_code = remaining digits

If country code is missing,
assume "+91".

3. Do NOT remove invalid records.

If a row has neither email nor phone,
still include it in the JSON output and add:

"skip_reason": "Missing email and phone"

The backend will decide whether to import or skip the record.

4. Allowed crm_status values only:

GOOD_LEAD_FOLLOW_UP
DID_NOT_CONNECT
BAD_LEAD
SALE_DONE

Default:
GOOD_LEAD_FOLLOW_UP

5. If Remarks/Notes exist,
store in crm_note.

6. description should contain any extra information not mapped elsewhere.

7. company, city, state and country should be inferred if obvious.
Otherwise return null.

8. lead_owner = null

9. possession_time = null

10. created_at = null

11. data_source =
"CSV Import"

12. If multiple emails exist,
keep first email in email field.
Append remaining emails inside crm_note.

13. If multiple phone numbers exist,
keep first phone.
Append remaining phones inside crm_note.

14. Missing values should be null.

CSV Rows:

${JSON.stringify(rows)}
`;

    for (const batch of batches) {
      const batchPrompt = prompt.replace(
        JSON.stringify(rows),
        JSON.stringify(batch),
      );

      const result = await model.generateContent(batchPrompt);

      let text = result.response.text().trim();

      text = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "");
      text = text.replace(/```$/i, "").trim();

      const batchResult = JSON.parse(text);

      parsedResult.push(...batchResult);
    }

    const validRecords = [];
    const skippedRecords = [];

    parsedResult.forEach((record) => {
      if (record.skip_reason) {
        skippedRecords.push(record);
      } else {
        validRecords.push(record);
      }
    });

    const skippedCount = rows.length - validRecords.length;

    res.json({
      success: true,
      imported: validRecords.length,
      skipped: skippedCount,
      records: validRecords,
      skippedRecords,
    });
  } catch (err) {
    console.error(err);

    if (err.status === 429) {
      return res.status(429).json({
        success: false,
        message:
          "Gemini API quota exceeded. Please try again later or use another API key.",
      });
    }

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
