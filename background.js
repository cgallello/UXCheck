// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

window.evaluation_in_progress = false;




// New tab is opened DURING evaluation

  chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
      if (window.evaluation_in_progress == true){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {greeting: "please open the tray"}, function(response) {});
        });
      }

    }
  })

// If browser action is clicked

  chrome.browserAction.onClicked.addListener(function(){
    if (window.evaluation_in_progress == false){
      window.evaluation_in_progress = true;
      
      //Google Analytics
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
      ga('create', 'UA-57672068-1', 'auto');
      ga('set', 'checkProtocolTask', function(){}); // Disable file protocol checking.
      ga('require', 'displayfeatures');
      ga('send', 'pageview', '/options.html');

      // Only load mixpanel if hasn't been loaded yet
      if(typeof mixpanel === 'undefined'){
        (function(e,a){if(!a.__SV){var b=window;try{var c,l,i,j=b.location,g=j.hash;c=function(a,b){return(l=a.match(RegExp(b+"=([^&]*)")))?l[1]:null};g&&c(g,"state")&&(i=JSON.parse(decodeURIComponent(c(g,"state"))),"mpeditor"===i.action&&(b.sessionStorage.setItem("_mpcehash",g),history.replaceState(i.desiredHash||"",e.title,j.pathname+j.search)))}catch(m){}var k,h;window.mixpanel=a;a._i=[];a.init=function(b,c,f){function e(b,a){var c=a.split(".");2==c.length&&(b=b[c[0]],a=c[1]);b[a]=function(){b.push([a].concat(Array.prototype.slice.call(arguments,
0)))}}var d=a;"undefined"!==typeof f?d=a[f]=[]:f="mixpanel";d.people=d.people||[];d.toString=function(b){var a="mixpanel";"mixpanel"!==f&&(a+="."+f);b||(a+=" (stub)");return a};d.people.toString=function(){return d.toString(1)+".people (stub)"};k="disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config reset people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
for(h=0;h<k.length;h++)e(d,k[h]);a._i.push([b,c,f])};a.__SV=1.2;b=e.createElement("script");b.type="text/javascript";b.async=!0;b.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===e.location.protocol&&"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";c=e.getElementsByTagName("script")[0];c.parentNode.insertBefore(b,c)}})(document,window.mixpanel||[]);
      mixpanel.init("ac2ec031cc3254aadc51a7eb38888ec2");
        // Session start mixpanel event
        mixpanel.track("Session start");
      }
      


      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "please open the tray"}, function(response) {});
      });
    } else {
      window.evaluation_in_progress = false;
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "please close the tray"}, function(response) {});
      });
    }
  });


// Invoke tray
// From popup.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // console.log('background.js recieved the request, ' + request.greeting);

    // Close button clicked, evaluation stopped

    if (request.greeting == "close_button_clicked"){
      window.evaluation_in_progress = false;
    }

    // Stop evaluation

    if (request.greeting == "stop_evaluation"){
      window.evaluation_html = request.html;
      chrome.tabs.create({url: 'evaluationpage.html'});
      window.evaluation_in_progress = false;
      
      mixpanel.track('Evaluation ended', {"screenshots": request.annotations});
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "stopping_evalution"}, function(response) {

        });
      });
    }

    // Take screenshot
    if (request.greeting == "take_screenshot"){
      chrome.tabs.captureVisibleTab(null,{},function(dataUrl){
        window.screenshot = dataUrl;
        // console.log(window.screenshot);
        sendResponse({farewell: window.screenshot});
        mixpanel.track('Screenshot taken');
      });
      return true;
    }

    // Save data
    if (request.greeting == "setData"){
      var saved_data = request.data_object;
      localStorage.setItem('saved_data', JSON.stringify(saved_data));

    }

    // Get data
    if (request.greeting == "getData"){
      var saved_data_string = localStorage.getItem('saved_data');
      var saved_data = $.parseJSON(saved_data_string);
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "heres_ur_data", dataObject: saved_data}, function(response) {
          //sendResponse({farewell: "okay"});
        });
      });
    }

    // Pass evaluation info to evaluation page

    if (request.greeting == "gimme_evaluation_info"){
      sendResponse({greeting: "heres_ur_data", evalInfo: window.evaluation_html});
    }

    // Mixpanel
    if (request.greeting == "Fire Mixpanel: Purple upsell dialog shown"){
      mixpanel.track('Purple upsell dialog shown');
    }
    if (request.greeting == "Fire Mixpanel: Purple upsell CTA clicked"){
      mixpanel.track('Purple upsell CTA clicked');
    }
  }
);


