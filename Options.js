function save_options() {
  var MyURL = document.getElementById("myfeed").value.trim();

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
       generate_ignores(MyURL);
      
  });
}

function display_feed(result){
  if (!result.error) {
    var container = document.getElementById("ignorelist");
    container.innerHTML = '';
    for (var i = 0; i < result.feed.entries.length; i++) {
      var entry = result.feed.entries[i];
      var div = document.createElement("div");
      div.appendChild(document.createTextNode(entry.title));
      container.appendChild(div);
    }
  }
}

function checkbox_action(ele) {
    var checkboxes = document.getElementsByName('ignores');
    var checkboxesChecked = [];
    for (var i=0; i<checkboxes.length; i++) {
         // And stick the checked ones onto an array...
         if (checkboxes[i].checked) {
            checkboxesChecked.push(checkboxes[i].value.replace('http://rpol.net/game/',''));
         }
      }
      // Return the array if it is non-empty, or null
      //chrome.storage.sync.set({"RPOL_FEED_IGNORES": checkboxesChecked.length > 0 ? checkboxesChecked : null}, function() { });
      
      var ignoreList = (checkboxesChecked.length > 0 ? checkboxesChecked : null).join();
      chrome.storage.sync.set({"RPOL_IGNORE": ignoreList}, function() { console.log("The value saved was: " + ignoreList); });
}

function generate_ignores(MyURL) {
    var categories = [];
    var catcontainers = "";
    var IgnoreList = document.getElementById("ignorelist");
    var xhr = new XMLHttpRequest();
    xhr.open('GET', MyURL, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr.responseXML);
            IgnoreList.innerHTML='';
            var doc = xhr.responseXML;
            for(var i = 0; i < doc.getElementsByTagName("item").length; i++)
            {
                var item = decodeURIComponent(doc.getElementsByTagName("channel")[0].getElementsByTagName("item")[i].getElementsByTagName("category")[0].firstChild.nodeValue);
                if (categories.indexOf(item) === -1) {
                    categories.push(item);
                    catcontainers = catcontainers + '<p><strong>' + item + '</strong><div id="' + encodeURIComponent(item) + '"></div></p>';
                }
            }
            IgnoreList.innerHTML=catcontainers;
            
            for(var i = 0; i < doc.getElementsByTagName("item").length; i++)
            {
                var game = doc.getElementsByTagName("channel")[0].getElementsByTagName("item")[i];
                
                var title = decodeURIComponent(game.getElementsByTagName("title")[0].firstChild.nodeValue);
                var link = decodeURIComponent(game.getElementsByTagName("link")[0].firstChild.nodeValue);
                var pubdate = decodeURIComponent(game.getElementsByTagName("pubDate")[0].firstChild.nodeValue);
                var category = encodeURIComponent(game.getElementsByTagName("category")[0].firstChild.nodeValue);
                var description = decodeURIComponent(game.getElementsByTagName("description")[0].firstChild.nodeValue);
                var guid = decodeURIComponent(game.getElementsByTagName("guid")[0].firstChild.nodeValue);
                
                var CheckBox = '<input type="checkbox" value="' + guid + '" name="ignores" id="' + guid + '"/>&nbsp;' + title + '<br />';

                document.getElementById(category).innerHTML=document.getElementById(category).innerHTML+CheckBox;
               
            }
            IgnoreList.addEventListener("change",checkbox_action);
            restore_checks();
        }
    };
    xhr.send(null);
}

function restore_options() {
   chrome.storage.sync.get('RPOL_FEED', function(MyURL) {
      // Update status to let user know options were saved.
      console.log("The value loaded was: " + MyURL['RPOL_FEED']);
       var MyURLField = document.getElementById("myfeed");
       MyURLField.value = MyURL['RPOL_FEED'];
       
       
       if(MyURL['RPOL_FEED'] != 'undefined') { generate_ignores(MyURL['RPOL_FEED'])};
  });

}

function restore_checks() {
  chrome.storage.sync.get('RPOL_IGNORE', function(MyIgnore) {
      // Update status to let user know options were saved.
      console.log("The value loaded was: " + MyIgnore['RPOL_IGNORE']);
      var ignores= MyIgnore['RPOL_IGNORE'].split(",");
      for (var i=0; i<ignores.length; i++) {
        console.log("http://rpol.net/game/" + ignores[i]);
        document.getElementById("http://rpol.net/game/" + ignores[i]).checked = true;
      }
  });
}


document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#load').addEventListener('click', save_options);