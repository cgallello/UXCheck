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

    /*// Start evaluation

    if (request.greeting == "open the tray"){

      console.log('i received a message from popup.js telling me to open the tray');
      if (evaluation_in_progress == false){
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


        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {greeting: "please open the tray"}, function(response) {
            //console.log('i got a response that says'+response);
            //sendResponse({farewell: "okay"});
          });
        });
      }
    }*/

    // Close button clicked, evaluation stopped

    if (request.greeting == "close_button_clicked"){
      window.evaluation_in_progress = false;
    }

    // Stop evaluation

    if (request.greeting == "stop_evaluation"){
      window.evaluation_html = request.html;
      chrome.tabs.create({url: 'evaluationpage.html'});
      window.evaluation_in_progress = false;
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "stopping_evalution"}, function(response) {

        });
      });
    }

    // Take screenshot

    if (request.greeting == "take_screenshot"){
      chrome.tabs.captureVisibleTab(null,{},function(dataUrl){
        window.screenshot = dataUrl;
        sendResponse({farewell: window.screenshot});
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
      //chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        //chrome.tabs.sendMessage(tabs[0].id, {greeting: "heres_ur_data", evalInfo: window.evaluation_html}, function(response) {
          //sendResponse({farewell: "okay"});
        //});
      //});
    }
  }
);

/*
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-57672068-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();*/



