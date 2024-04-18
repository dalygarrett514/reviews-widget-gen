
// reviews-widget.js

let reviewGenerationUrl;
let baseUrl;
let firstPartyReviewPage;
let averageRating;
let entityName;
let reviews = []; // Declare reviews in the outer scope
let entityId;


function initWidget(config) {
    // Extract the entity ID from the configuration
    entityId = config.entityId;
    baseUrl = config.baseUrl;
    // const entityId = script_tag.getAttribute('entityId');

    console.log("Entity Id :", entityId);
    console.log("Base URL :", baseUrl);

    // Make the first API call to retrieve entity details
    fetchEntityDetails(baseUrl, entityId)
        .then((entityDetails) => {
            console.log("Entity Details:", entityDetails);

            // Store review generation URLs
            reviewGenerationUrl = entityDetails.reviewGenerationUrl;
            firstPartyReviewPage = entityDetails.firstPartyReviewPage;

            // Extract entity name
            entityName = entityDetails.name;

            // Make the second API call to retrieve reviews using the obtained entity ID
            return fetchReviews(baseUrl, entityId);
        })
        .then((fetchedReviews) => {
            console.log("Reviews:", fetchedReviews);

            // Update the reviews variable with the fetched reviews
            reviews = fetchedReviews;

            // Extract review details
            const reviewDetails = reviews.map((review) => ({
                authorName: review.authorName,
                content: review.content,
                publisher: review.publisher,
                rating: review.rating,
                reviewDate: review.reviewDate,
                comments: review.comments,
            }));

            // Calculate the average rating
            const totalRating = reviewDetails.reduce((sum, review) => sum + review.rating, 0);
            averageRating = reviewDetails.length > 0 ? totalRating / reviewDetails.length : 0;

            // Your widget initialization code here, using entity details, reviews data, review URLs, and average rating
            console.log("Review Generation URL:", );
            console.log("First Party Review Page:", firstPartyReviewPage);
            console.log("Average Rating:", averageRating);

            // Display paginated reviews
            displayReviews();
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

function displayReviews() {

    // Sort reviews by reviewDate in descending order (most recent first)
    reviews.sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate));

    // Display total count and average rating
    // Display total count and average rating
    const totalCountElement = document.getElementById("total-count");
    const averageRatingElement = document.getElementById("average-rating");
    const starIconsElement = document.getElementById("star-icons");
    const reviewsContainer = document.getElementById("reviews-container");
    const paginationContainer = document.getElementById("pagination-container");

    if (!Array.isArray(reviews) || reviews.length === 0) {
        totalCountElement.innerHTML = "<h2>Be the first to leave a review!</h2>";
        averageRatingElement.textContent = "";
        starIconsElement.innerHTML = "";
        reviewsContainer.innerHTML = ""; // Clear reviews container
        paginationContainer.innerHTML = ""; // Clear pagination container
        return;
    }

    // Calculate the average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    // Display total count and average rating
    totalCountElement.textContent = `Total Reviews: ${reviews.length}`;
    averageRatingElement.innerHTML = `<h1 class="hero-rating">${averageRating.toFixed(2)}</h1>`;
    starIconsElement.innerHTML = getStarIcons(averageRating);

    // Display paginated reviews
    const reviewsPerPage = 5;
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    // Clear existing content
    reviewsContainer.innerHTML = "";
    paginationContainer.innerHTML = "";

    // Display only the first page or the most recent 5 reviews
    const initialPageReviews = reviews.slice(0, reviewsPerPage);
    const pageElement = createReviewPageElement(initialPageReviews);
    reviewsContainer.appendChild(pageElement);

    // Display pagination controls
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.classList.add("pagination-button");
        button.addEventListener("click", () => paginate(i, reviewsPerPage));
        paginationContainer.appendChild(button);

        // Set 'active' class for the initial page
        if (i === 1) {
            button.classList.add('active');
        }
    }

}

function paginate(currentPage, reviewsPerPage) {
    const paginationButtons = document.querySelectorAll('.pagination-button');

    // Remove the 'active' class from all buttons
    paginationButtons.forEach(button => button.classList.remove('active'));

    const startIndex = (currentPage - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    const pageReviews = reviews.slice(startIndex, endIndex);
    const reviewsContainer = document.getElementById("reviews-container");
    reviewsContainer.innerHTML = ""; // Clear reviews container
    const pageElement = createReviewPageElement(pageReviews);
    reviewsContainer.appendChild(pageElement);

    // Add the 'active' class to the current button
    paginationButtons[currentPage - 1].classList.add('active');
}

function updatePaginationControls(totalPages) {
    const paginationContainer = document.getElementById('pagination-container');
    
    // Clear existing pagination controls
    paginationContainer.innerHTML = '';

    // Create left arrow button
    const leftArrow = document.createElement('button');
    leftArrow.textContent = '←';
    leftArrow.addEventListener('click', () => navigatePage(-1));
    paginationContainer.appendChild(leftArrow);

    // Create page number buttons
    for (let i = 0; i < totalPages; i++) {
        const pageNumber = document.createElement('button');
        pageNumber.textContent = i + 1;
        pageNumber.addEventListener('click', () => paginate(i + 1, reviewsPerPage));
        paginationContainer.appendChild(pageNumber);

        // Set 'active' class for the initial page
        if (i === 0) {
            pageNumber.classList.add('active');
        }
    }

    // Create right arrow button
    const rightArrow = document.createElement('button');
    rightArrow.textContent = '→';
    rightArrow.addEventListener('click', () => navigatePage(1));
    paginationContainer.appendChild(rightArrow);
}

function navigatePage(offset) {
    // Update the current page index
    currentPageIndex = Math.max(0, Math.min(currentPageIndex + offset, totalPages - 1));

    // Redisplay reviews for the current page
    displayReviews(reviewDetails);
}

function createReviewPageElement(reviews) {
    const pageElement = document.createElement('div');

    reviews.forEach((review) => {
        const reviewElement = document.createElement('div');
        reviewElement.classList.add('review');

        // Log the raw reviewDate string
        console.log("Raw reviewDate:", review.reviewDate);

        // Determine the publisher icon based on the publisher value
        let publisherIcon = '';
        switch (review.publisher) {
            case 'GOOGLEMYBUSINESS':
                publisherIcon = 'https://www.yext-static.com/cms/spark/1/site-icon-250.svg';
                break;
            case 'FIRSTPARTY':
                publisherIcon = 'https://www.yext-static.com/cms/spark/1/site-icon-283.svg';
                break;
            case 'FACEBOOK':
                publisherIcon = 'https://www.yext-static.com/cms/spark/1/site-icon-71.svg';
                break;
            // Add more cases for other publishers if needed
            default:
                publisherIcon = ''; // Default to empty if no matching publisher
        }

        const formattedReviewDate = review.reviewDate
            ? new Date(review.reviewDate).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                //   hour: 'numeric',
                //   minute: 'numeric',
                //   second: 'numeric',
              })
            : 'Date Not Available';

        // Log the formatted reviewDate
        console.log("Formatted reviewDate:", formattedReviewDate);

        // Display review details (publisher, author, rating, content)
        reviewElement.innerHTML = `
            <div class="review-details">
                <img class="publisher-icon" src="${publisherIcon}" alt="${review.publisher}">
                <div class="details-right">
                    <p><strong>Date:</strong> ${formattedReviewDate}</p>
                    <p><strong>Author:</strong> ${review.authorName}</p>
                    <p><strong>Rating:</strong> ${getStarIcons(review.rating, review.publisher)}</p>
                    ${review.content ? `<p><strong>Review:</strong> ${review.content}</p>` : ''}
                </div>
            </div>
        `;

        pageElement.appendChild(reviewElement);

        const commentElement = createCommentHTML(review.comments, entityName);
        if (commentElement) {
            // Add a slight indent for comments to distinguish them as responses
            pageElement.appendChild(commentElement);
        }
    });

    return pageElement;
}

function createCommentHTML(comments, entityName) {
    if (!comments || comments.length === 0) {
        return null;
    }

    // Display comments as nested elements
    const commentSection = document.createElement('div');
    commentSection.classList.add('comment-section');

    comments.forEach((comment) => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');

        // Modify the date formatting to exclude hours, minutes, and seconds
        const formattedCommentDate = comment.commentDate
            ? new Date(comment.commentDate).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
              })
            : 'Date Not Available';

        commentElement.innerHTML = `
            <p><strong>Date:</strong> ${formattedCommentDate}</p>
            <p><strong>${entityName}:</strong> ${comment.content}</p>
        `;
        commentSection.appendChild(commentElement);
    });

    return commentSection;
}

function getStarIcons(rating, publisher) {
    console.log("Rating:", rating);
    console.log("Publisher:", publisher);

    if (publisher === 'FACEBOOK') {
        if (rating === 0) {
            return '<span class="recommended-text">Recommended</span>';
        } else {
            return '<span class="not-recommended-text">Not Recommended</span>';
        }
    }

    const starCount = 5;
    const fullStars = Math.round(rating); // Round to the nearest full star
    const emptyStars = starCount - fullStars;

    const starIcons = '<span class="star">&#9733;</span>'.repeat(fullStars) +
        '<span class="star empty">&#9734;</span>'.repeat(emptyStars);

    return starIcons;
}

async function fetchEntityDetails(baseUrl, entityId) {
    console.log('Fetching entity details...');
    const apiUrl = `${baseUrl}entity/${entityId}`;

    try {
        const response = await fetch(apiUrl);
        console.log('Response received:', response);

        if (!response.ok) {
            throw new Error(`Failed to fetch entity details: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching entity details:', error);
        throw error; // Rethrow the error if you want calling code to handle it
    }
}

async function fetchReviews(baseUrl, entityId) {
    console.log('Fetching reviews...');
    const apiUrl = `${baseUrl}entity/${entityId}/reviews`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch reviews: ${response.statusText}`);
        }

        const reviews = await response.json();

        // Check if the response or docs property is undefined or null
        const docs = reviews?.response?.docs;

        // If docs is undefined or null or an empty array, return an empty array
        return Array.isArray(docs) ? docs : [];
    } catch (error) {
        console.error('Error fetching reviews:', error);
        throw error; // Rethrow the error if you want calling code to handle it
    }
}

function showAddCustomerForm() {
    // Create and display the overlay form
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    const form = document.createElement('form');
    form.classList.add('customer-form');
    form.innerHTML = `
    <span class="close-button" onclick="closeForm()">X</span>
    <h2>Add Contact Information</h2> <!-- Added title -->
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required>

    <label for="phone">Phone Number:</label>
    <input type="tel" id="phone" name="phone">

    <label for="or">or</label>

    <label for="email">Email:</label>
    <input type="email" id="email" name="email">

    <div class="disclaimer">
        <input type="checkbox" id="agree-checkbox" required>
        <label for="agree-checkbox">I agree to receive text messages and other information from ${entityName}. I understand that message and data rates may apply and that I can opt-out at any time. I have read and understand the <a href="https://www.broadlume.com/privacy-policy" target="_blank">Privacy Policy</a> and <a href="https://www.broadlume.com/terms-of-use" target="_blank">Terms of Use</a>.</label>
    </div>

    <button type="button" onclick="submitForm()">Submit</button>
    `;

    overlay.appendChild(form);
    document.body.appendChild(overlay);
}

function closeForm() {
    // Close the overlay form
    const overlay = document.querySelector('.overlay');
    overlay.remove();
}

async function submitForm() {
    // Get form values
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const agreeCheckbox = document.getElementById('agree-checkbox');

    // Validate form data and checkbox
    if (!name || (!phone && !email) || !agreeCheckbox.checked) {
        alert('Please fill out all required fields and agree to the terms.');
        return;
    }

    try {
        // Make API call
        const apiUrl = `${baseUrl}entity/gen`;

        const requestBody = {
            entityId,
            name,
            phone,
            email,
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`Failed to submit form: ${response.statusText}`);
        }

        const responseData = await response.json();

        alert('Form submitted successfully!');
        closeForm();
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Error submitting form. Please try again.');
    }
}


document.addEventListener('DOMContentLoaded', function () {
    // Add event listener for the review generation button
    const reviewGenerationButton = document.getElementById('review-generation-button');
    reviewGenerationButton.addEventListener('click', function () {
        // Open the review generation link in a new tab
        window.open(reviewGenerationUrl, '_blank');
    });

    const addCustomerText = document.getElementById('add-customer-text');
    addCustomerText.addEventListener('click', showAddCustomerForm);
});

