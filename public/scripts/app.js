
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
      $tweetsContainer.append($tweet);
    }
  };

  //Escape function to prevent cross-site scripting
  const escape = function(tweet) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(tweet));
    return div.innerHTML;
  };
  
  // Function to create Tweet Element
  const createTweetElement = function(tweet) {
    
    //Formatting Timestamp (COME BACK TO THIS);
    // const now = new Date;
    // const date = tweet.created_at.getDate();
    // const month = tweet.created_at.getMonth();
    // const year = tweet.created_at.getFullYear();

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
         <div class="date-posted">${tweet.created_at}</div>
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
      $(".err-msg").slideToggle(500)
        .html(`<i class="fa fa-times-circle"></i>&nbsp&nbsp&nbsp${errMsg}`);
    } else if (tweet.length > 145) {
      const errMsg = "ERROR: Your Tweet exceeds the character limit.";
      $(".err-msg").slideToggle(500)
        .html(`<i class="fa fa-times-circle"></i>&nbsp&nbsp&nbsp${errMsg}`);
      throw "Error!";
    } else {
      $(".err-msg").slideToggle(500);
      return true;
    }
  };

  //CLICK HANDLER FOR NAV BAR TOGGLE
  $(".toggle").click(function() {
    $(".new-tweet").slideToggle(1000);
  });
  
  
  
  // Function to fetch tweets from the /tweets page
  const loadTweets = function() {
    $.ajax('/tweets',{method: 'GET'})
      .then(function (tweets) {
        renderTweets(tweets);
      });
  };

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

