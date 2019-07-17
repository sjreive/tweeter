
// Function to display # of chars left when composing
$(document).ready(function() {

  $(".tweet-form").keyup(function() {
    const $tweetForm = $(this);
    const $count = $tweetForm.siblings(".tweet-submit").children(".counter");
    let chars = 140 - $(this).val().length;
    $count.text(chars);
    if (chars < 0) {
      $count.css("color", "red");
    } else {
      $count.css("color", "black");
    }
  });

});