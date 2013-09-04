var myrss = 'Not Loaded';
var myignore = [];



function load_config() {
    chrome.storage.sync.get('RPOL_FEED', function(MyURL) {
      // Update status to let user know options were saved.
      console.log("The value loaded was: " + MyURL['RPOL_FEED']);
      myrss = MyURL['RPOL_FEED'];
      
          chrome.storage.sync.get('RPOL_IGNORE', function(MyIgnore) {
              // Update status to let user know options were saved.
              console.log("The value loaded was: " + MyIgnore['RPOL_IGNORE']);
              var ignores= MyIgnore['RPOL_IGNORE'].split(",");
              for (var i=0; i<ignores.length; i++) {
                console.log("http://rpol.net/game/" + ignores[i]);
                myignore.push("http://rpol.net/game/" + ignores[i]);
                
                display_games(myrss);
              }
          });
    });
    
     
}



function launch_game(url) {
    var targetURL = url.toElement.id.replace('http://rpol.net/game/','http://rpol.net/game.cgi?gi=');
    chrome.tabs.query({currentWindow: true, url: "http://rpol.net/*"}, function(TabList) {
     //for (var i = 0, i < TabList; tab = tabs[i]; i++) {
     if(TabList[0] != undefined) {
        console.log('tab: ' + TabList[0].id + ' index: ' + TabList[0].index);
        chrome.tabs.update(TabList[0].id,{url: targetURL, selected: true, highlighted: true});
     
     } else {
        console.log('tab: MakeNew');
        chrome.tabs.create({url: targetURL});
     }

  });
    

}

function display_games(MyURL) {
    var categories = [];
    var catcontainers = "";
    var container = document.getElementById("container");
    var xhr = new XMLHttpRequest();
    xhr.open('GET', MyURL, true);
    xhr.onreadystatechange = function () {
    
        if (xhr.readyState == 4 && xhr.status == 200) {

            console.log(xhr.responseXML);
            container.innerHTML='';
            
            var doc = xhr.responseXML;
            
            var imageSRC = decodeURIComponent(doc.getElementsByTagName("image")[0].getElementsByTagName("url")[0].firstChild.nodeValue);
            var imageURL = decodeURIComponent(doc.getElementsByTagName("image")[0].getElementsByTagName("link")[0].firstChild.nodeValue);
            var image = '<a href="' + imageURL + '"><img src="' + imageSRC + '"></a>';
            
            
            for(var i = 0; i < doc.getElementsByTagName("item").length; i++)
            {
                var item = decodeURIComponent(doc.getElementsByTagName("channel")[0].getElementsByTagName("item")[i].getElementsByTagName("category")[0].firstChild.nodeValue);
                if (categories.indexOf(item) === -1) {
                    categories.push(item);
                    catcontainers = catcontainers + '<p><div class="header">' + item + '</div><div id="' + encodeURIComponent(item) + '"></div></p>';
                }
            }
            container.innerHTML=image+catcontainers;
            var newCount = 0;
            for(var i = 0; i < doc.getElementsByTagName("item").length; i++)
            {
              
                var game = doc.getElementsByTagName("channel")[0].getElementsByTagName("item")[i];
                
                var title = decodeURIComponent(game.getElementsByTagName("title")[0].firstChild.nodeValue);
                var link = decodeURIComponent(game.getElementsByTagName("link")[0].firstChild.nodeValue);
                var pubdate = decodeURIComponent(game.getElementsByTagName("pubDate")[0].firstChild.nodeValue);
                var category = encodeURIComponent(game.getElementsByTagName("category")[0].firstChild.nodeValue);
                var description = decodeURIComponent(game.getElementsByTagName("description")[0].firstChild.nodeValue);
                var guid = decodeURIComponent(game.getElementsByTagName("guid")[0].firstChild.nodeValue);
//There are no new messages.

                if(description.trim() != 'There are no new messages.') { 
                    var newmess = 'On'; 
                    var newCount=newCount+1; } 
                else {  
                    var newmess = 'Off'; 
                }
                var gameitem = '<div class="gamename ' + newmess + '" name="gamename" id="' + guid + '">' + title + '</div><div class="gamestatus">' + description + '</div><div class="gametime">As of ' + pubdate + '</div>';
                document.getElementById(category).innerHTML=document.getElementById(category).innerHTML+gameitem;  
            }
            console.log('New Messages: ' + newCount);
            if(newCount > 0){ 
                chrome.browserAction.setBadgeText({text: newCount.toString()}); 
            } else { 
                chrome.browserAction.setBadgeText({text: ''});
            }
            for(var i = 0; i < document.getElementsByName("gamename").length; i++) {
                console.log(document.getElementsByName("gamename")[i]);
                document.getElementsByName("gamename")[i].addEventListener("click",launch_game);
            }
            
        }
    };
    xhr.send(null);
}






document.addEventListener('DOMContentLoaded', function () {
  load_config();
});