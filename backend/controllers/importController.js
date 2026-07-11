const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

    const prompt = `
You are an expert CRM data extractor.

Convert these CSV rows into CRM records.

Rules:

Return ONLY JSON array.

Fields:

created_at
name
email
country_code
mobile_without_country_code
company
city
state
country
lead_owner
crm_status
crm_note
data_source
possession_time
description

Allowed crm_status:

GOOD_LEAD_FOLLOW_UP
DID_NOT_CONNECT
BAD_LEAD
SALE_DONE

Skip records without email AND phone.

CSV Data:

${JSON.stringify(rows)}
`;

    const result = await model.generateContent(prompt);

    let text = result.response.text().trim();

    text = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "");
    text = text.replace(/```$/i, "").trim();

    const parsedResult = JSON.parse(text);

    res.json({
        success: true,
        result: parsedResult,
    });
        
    } catch (err) {
        console.error(err);

        res.status(500).json({
        success: false,
        message: err.message,
        });
    }
};
