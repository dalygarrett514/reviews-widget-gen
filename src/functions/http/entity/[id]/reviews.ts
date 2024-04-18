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
      const reviewsResp = await fetch(
        `https://cdn.yextapis.com/v2/accounts/me/content/reviews?api_key=${YEXT_API_KEY}&v=20231019&entity.id=${entityId}&limit=50&$sortBy__desc=reviewDate`
      );
      const body = await reviewsResp.json();

      return {
        body: JSON.stringify(body),
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
