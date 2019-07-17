
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

    loadTweets();
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
    return timeString
  }
  
  
  
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
 
  //Function to validate user tweet input
  const isTweetValid = function(tweet) {
    console.log(tweet);
    if (tweet === "text=") {
      const errMsg = "Error! Tweet field cannot be empty.";
      $(".err-msg").slideDown(500)
        .html(`<i class="fa fa-times-circle"></i>&nbsp&nbsp&nbsp${errMsg}`);
    } else if (tweet.length > 145) {
      const errMsg = "ERROR: Your Tweet exceeds the character limit.";
      $(".err-msg").slideToggle(500)
        .html(`<i class="fa fa-times-circle"></i>&nbsp&nbsp&nbsp${errMsg}`);
      throw "Error!";
    } else {
      return true;
    }
  };

  //CLICK HANDLER FOR NAV BAR TOGGLE
  $(".toggle").click(function() {
    $(".new-tweet").slideToggle(1000);
  });
  

  // jQuery used to change visibility of user handler during when hovering over a tweet.
  $(".tweet").hover(function() {
    $(this).find(".user-handle").css("visibility","visible");
  }, function() {
    $(this).find(".user-handle").css("visibility","hidden");
  });

  // POST REQUEST TO SUBMIT TWEETS
  $(".tweet-post").on('submit', function(event) {
    event.preventDefault();  // prevents traditional POST request
    console.log("clicked! Performing AJAX call", event);
    $(".err-msg").slideUp(500);
    const postBody = $(this).serialize();
    console.log(postBody);
    if (isTweetValid(postBody)) {
    //AJAX request
      $.ajax({
        type: "POST",
        url: "/tweets",
        dataType: "text",
        data: postBody
      })
        .done(function(data) {
          loadTweets(data);
        })
        .fail(function(XHR) {
          console.log('Fail!', XHR);
          alert('error! AJAX REQUEST UNSUCCESSFUL');
        });
    }
  });






});

