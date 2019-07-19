
/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {
  
  //Function to pull tweets from "database" and append them to the tweet container
  const renderTweets = function(tweets) {
    let $tweetsContainer = $('#tweets-container');
    for (let tweet of tweets) {
      let $tweet = createTweetElement(tweet);
      $tweetsContainer.prepend($tweet);
    }
  };

  // Function to fetch tweets from the /tweets page
  const loadTweets = function() {
    $.ajax('/tweets',{method: 'GET'})
      .then(function (tweets) {
        $("#tweets-container").empty();
        renderTweets(tweets);
      });
  };

  // Load tweets in database upon page load
  loadTweets();
  // Get time stamp to calculate tweet times
  const timeNow = new Date();

  //Escape function to prevent cross-site scripting
  const escape = function(tweet) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(tweet));
    return div.innerHTML;
  };
  
  //Function to display amount of time since tweet was created
  const timeSinceTweeted = function (tweet) {
    const timeSince = timeNow - tweet.created_at;
    const timeSinceDays = timeSince / (1000 * 3600 * 24);
    let timeString = "";
    if (timeSinceDays > 365) {
      timeString = 'Over a year ago.';
    } else if (timeSinceDays === 365) {
      timeString = 'One year ago';
    } else if (timeSinceDays < 365 && timeSinceDays >= 1) {
      timeString = `${timeSinceDays} days ago`;
    } else {
      timeString = 'Less than 24 hours ago';
    }
    return timeString;
  };
  
  // Function to create Tweet Element
  const createTweetElement = function(tweet) {
    
    const time = timeSinceTweeted(tweet);

    const returnTweet = `
      <article class="tweet">
        <header class="tweet-header">
          <div class="header-left">
            <img class= "tweet-profile-photo" src=${tweet.user.avatars}>
            <p class="user-name">${tweet.user.name}</p>
          </div>
          <p class="user-handle">${tweet.user.handle}</p>
        </header>
        <div class= "tweet-content">${escape(tweet.content.text)}</div>
        <hr>
        <footer class="tweet-footer">
         <div class="date-posted">${time}</div>
          <div class="tweet-icons">
            <i class="fab fa-font-awesome-flag"></i>
            <i class="fas fa-sync-alt"></i>
            <i class="fas fa-heart"></i>
          </div>
        </footer>
      </article>`;
    return returnTweet;
  };
 
  
  //Function to return error messages
  const returnErrMessage = function(errMsg) {
    const $errMsg = $(".err-msg"); // So we only have to go searching once in the DOM
    $errMsg.slideUp(100, function() {
      $errMsg.slideDown(300);
      return $errMsg.html(`<i class="fa fa-times-circle"></i>&nbsp&nbsp&nbsp${errMsg}`);
    });
  };

  //Function to validate user tweet input
  const isTweetValid = function(tweet) {
    
    // Check if tweet field is empty
    if (tweet === "text=") {
      const errMsg = "Error! Tweet field cannot be empty.";
      returnErrMessage(errMsg);
    // Check if tweet field is too long (145 = 140 chars allowed + "text=");
    } else if (tweet.length > 145) {
      const errMsg = "Error! Your Tweet exceeds the character limit.";
      returnErrMessage(errMsg);
    } else {
      return true;
    }
  };

  // Click Handler to show/hide new tweet form
  $(".toggle").click(function() {
    $(".new-tweet").slideToggle(1000);
  });
  
  // Scroll handler for "scroll back to top button"
  const $window = $(window);
  $window.scroll(function () {
    const $scrollButton = $(".scroll-up-button");
    const $navButton = $(".toggle");
    if ($window.scrollTop() > 50) {
      $scrollButton.css('display', 'block');
      $navButton.css('display', 'none');
    } else {
      $scrollButton.css('display', 'none');
      $navButton.css('display', 'block');
    }
  });

  // Click Handler for "scroll back to top button"
  $(".scroll-up-button").click(function() {
    document.documentElement.scrollTop = 0;
  });

  // AJAX Post Request to Submit new tweets
  $(".tweet-post").on('submit', function(event) {
    // prevents traditional POST request action
    event.preventDefault();
    $(".err-msg").slideUp(200);
    const postBody = $(this).serialize();
    if (isTweetValid(postBody)) {
    // AJAX Request
      $.ajax({
        type: "POST",
        url: "/tweets",
        dataType: "text",
        data: postBody
      })
        .done(function(data) {
          $(".tweet-form").val("");
          $(".counter").text("140");
          loadTweets(data);
        })
        .fail(function(XHR) {
          console.log('Fail!', XHR);
          alert('error! AJAX REQUEST UNSUCCESSFUL');
        });
        
    }
  });
});

