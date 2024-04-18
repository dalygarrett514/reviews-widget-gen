// Import necessary types from "@yext/pages/*"
import { SitesHttpRequest, SitesHttpResponse } from "@yext/pages/*";

export default async function endpoint(
    request: SitesHttpRequest
): Promise<SitesHttpResponse> {
    const { method, body, headers } = request;

    // Handle preflight requests
    if (method === 'OPTIONS') {
        return {
            body: '',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            statusCode: 200,
        };
    }

    switch (method) {
        case "POST":
            try {
                // Parse the JSON body
                const requestBody = JSON.parse(body);

                // Extract form values from the request body
                const { entityId, name, phone, email } = requestBody;

                // Validate form data
                if (!name || (!phone && !email)) {
                    return { body: "Name is required, and either Phone Number or Email must be provided.", headers: {}, statusCode: 400 };
                }

                // Make API call
                const apiUrl = `https://api.yextapis.com/v2/accounts/me/reviewinvites?api_key=${YEXT_API_KEY}&v=20240123`;

                const apiRequestBody = [
                    {
                        "entity": {
                            "id": entityId,
                        },
                        "firstName": name,
                        "contact": phone || email,
                    }
                ];

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(apiRequestBody),
                });

                if (!response.ok) {
                    throw new Error(`Failed to submit form: ${response.statusText}`);
                }

                const responseData = await response.json();

                return {
                    body: JSON.stringify(responseData),
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    statusCode: 200,
                };
            } catch (error) {
                return { body: `Error processing form submission: ${error.message}`, headers: {}, statusCode: 500 };
            }

        default:
            return { body: "Method not allowed", headers: {}, statusCode: 405 };
    }
}
