# Reviews Widget

- Deploy this repo to your desired Yext Account
- Create a dev console app with reviews + content delivery enabled
- Create content endpoint in the account - ensure that the reviews endpoint is called `reviews` (or else the serverless function will not work)
- Define env var in your site: `YEXT_API_KEY`
- Then, to call this code on an external website, replace every variable below. `BASE_URL` should be your site's production domain (example: [https://likely-shivering-gorilla.pgsdemo.com/](https://likely-shivering-gorilla.pgsdemo.com/)), and `ENTITY_ID` should be the desired entity ID from the account.
- 

See example HTML below:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reviews Widget</title>
    <link rel="stylesheet" type="text/css" href="[BASE_URL]/styles.css">

</head>
<body>

    <div class="widget-container">
        <div class="header">
            <p id="average-rating"></p>
            <p id="star-icons"></p>
            <p id="total-count"></p>
        </div>
        <div class="center-button">
            <button class="button" id="review-generation-button">Leave a Review</button>
        </div>
        <div id="reviews-container"></div>
        <div class="pagination-container" id="pagination-container"></div>
        <div class="center-button">
            <p class="add-customer-text" id="add-customer-text">Add Customer</p>
        </div>
    </div>
    
    
    <script src="[BASE_URL]/reviews-widget.js"></script>
    
    
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            // Add event listener for the review generation button
            const reviewGenerationButton = document.getElementById('review-generation-button');
            reviewGenerationButton.addEventListener('click', function () {
                // Open the review generation link in a new tab
                window.open(reviewGenerationUrl, '_blank');
            });

            const addCustomerText = document.getElementById('add-customer-text');
            addCustomerText.addEventListener('click', showAddCustomerForm);

            // Initialize the widget after the DOM is fully loaded
            initWidget({ baseUrl: '[BASE_URL]', entityId: '[ENTITY_ID]' });
        });
    </script>

</body>
</html>
```
