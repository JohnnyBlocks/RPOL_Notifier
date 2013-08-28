// Saves options to localStorage.
function save_options() {
  var MyURL = document.getElementById("myfeed").value.trim();
  //localStorage["RPOL_FEED"] = MyURL;
  // Check that there's some code there.
  

  if(MyURL.length != 48) {
    var status = document.getElementById("status");
    var MyURLField = document.getElementById("myfeed");
    MyURLField.style.backgroundColor = "#FFCCCC";
    status.innerHTML = "RPOL Feed URL has invalid length";
    setTimeout(function() {
        status.innerHTML = "";
        MyURLField.style.backgroundColor = "#ffffff";
    }, 3000);
    return;
  }

  if(MyURL.substring(0,28)!='http://rpol.net/feeds.cgi?q=') {
    var status = document.getElementById("status");
    var MyURLField = document.getElementById("myfeed");
    MyURLField.style.backgroundColor = "#FFCCCC";
    status.innerHTML = "RPOL Feed URL is not a valid RPOL URL";
    setTimeout(function() {
        status.innerHTML = "";
        MyURLField.style.backgroundColor = "#ffffff";
    }, 3000);
    return;
  }
  
  if (!MyURL) {
    message('Error: No value specified');
    return;
  }

  //  48 = http://rpol.net/feeds.cgi?q=2CEMCC2tycw9xGwAsehU
  
  //Add URL validation here
  
  //Save Status to Sync Across Clients
  chrome.storage.sync.set({"RPOL_FEED": MyURL}, function() {
      // Update status to let user know options were saved.
       var status = document.getElementById("status");
       var MyURLField = document.getElementById("myfeed");
       MyURLField.value=MyURL;
       status.innerHTML = "Options Saved.";
       MyURLField.style.backgroundColor = "#CCEBD6";
        console.log("The value saved was: " + MyURL);
       setTimeout(function() {
         status.innerHTML = "";
         MyURLField.style.backgroundColor = "#ffffff";
       }, 3000);
      
  });

}

// Restores select box state to saved value from localStorage.
function restore_options() {

   chrome.storage.sync.get('RPOL_FEED', function(MyURL) {
      // Update status to let user know options were saved.
      console.log("The value loaded was: " + MyURL['RPOL_FEED']);
       var MyURLField = document.getElementById("myfeed");
       MyURLField.value = MyURL['RPOL_FEED'];

  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);