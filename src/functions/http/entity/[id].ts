import { SitesHttpRequest, SitesHttpResponse } from "@yext/pages/*";

export default async function endpoint(
  request: SitesHttpRequest
): Promise<SitesHttpResponse> {
  const { pathParams, method } = request;
  const entityId = pathParams.id;
  if (!entityId) {
    return { body: "Missing entity id", headers: {}, statusCode: 400 };
  }

  switch (method) {
    case "GET":
      const mgmtResp = await fetch(
        `https://cdn.yextapis.com/v2/accounts/me/entities/${entityId}?api_key=${YEXT_API_KEY}&v=20231030`
      );
      const body = await mgmtResp.json();
      const { reviewGenerationUrl, firstPartyReviewPage, name, c_gbplistingurl } = body.response;

      return {
        body: JSON.stringify({ reviewGenerationUrl, firstPartyReviewPage, name, c_gbplistingurl }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        statusCode: 200,
      };

    default:
      return { body: "Method not allowed", headers: {}, statusCode: 405 };
  }
}
