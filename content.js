$(document).ready(function () {
	window.tray_already_opened = false; 
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			if (request.greeting == "please close the tray"){
				
				// Close the tray, remove all DOM elements and function handlers
					
					$('#add').remove();
					$('#he_callout').remove();
					$('.he_overlay').remove();
					$("body").css("cssText", "margin-left: 0 !important; width: 100% !important; position:absolute !important; overflow:scroll !important; cursor: auto !important;");

				// Move everything back over to the left

					$(document).mousemove(function(event){
						$("body").find("*").not("#add >").not("#add").not(".he_overlay").not('#he_screenshot_preview').each(function(){
							if($(this).css("left") && $(this).css("position") == "fixed" && $(this).attr("data-omglol") == "pushed"){
								var left_css = parseInt($(this).css("left").replace(/[^-\d\.]/g, ''));
								var new_left_css = (left_css-400)+"px";
								$(this).css("left", new_left_css);
								$(this).attr("data-omglol","pushed_back");
							}
						});
					});
			}
			

			if (request.greeting == "please open the tray"){
				
				if ($('#he_tray').length == 0){
					// Get/Set datetime
					chrome.storage.local.get(['ux_check_last_opened', 'purple_upsell_shown'], function(result){
						
						// Get and reset last opened date
						var ux_check_last_opened = result.ux_check_last_opened;
						chrome.storage.local.set({'ux_check_last_opened': Date.now() });//Date.now() });

						// Get if purple upsell has been shown
						var purple_upsell_shown = result.purple_upsell_shown;

						// Set flags and get values for later
						
						window.hover_enabled = true; // Are we in 'hover mode'?
						var margin_top = parseInt($('body').css("margin-top").replace(/[^-\d\.]/g, '')); // some websites are dumb and add margin-top to body

						var doc_height = Math.max(
					        $(document).height(),
					        $(window).height()
					    );	

					    var doc_width = Math.max(
					        $(document).width(),
					        $(window).width()
					    ) - 400;



						// ========= UI INJECTION =========

						// Scoot <body> over to the right by 400px
						$("body").css("cssText", "margin-left: 400px !important; width: calc(100% - 400px) !important; position:absolute !important; overflow:scroll !important; cursor: pointer !important;");

						// Inject tray html template into body (but it's fixed)
						var trayUrl = chrome.extension.getURL('tray.html');
						$("body").prepend("<div id='add' class='he_reset' data-omglol='yo' style='width:100%;position:fixed;left:0;top:0;z-index:2000000050;'></div>");
						$("#add").load(trayUrl, function(){
							// Add the close button
							var he_tray_close = "<div id='he_tray_close' class='he_close_button'>"+
													"<div class='he_close_left'></div>"+
													"<div class='he_close_right'></div>"+
												"</div>";
								// <img id='he_tray_close' width='17' unselectable='true' src='"+chrome.extension.getURL('close.png')+"' />";
							$('#he_tray').append(he_tray_close);
						});


						// For elements w/ css property "left" & is position:fixed, 
						// scoot it over 400px.
						$("body").find("*").not("#add >").not("#he_tooltip_container >").not('#he_screenshot_preview').not("#he_tooltip_container").not("#add").not(".he_overlay").each(function(){
							if($(this).css("left") && $(this).css("position") == "fixed" && $(this).attr("data-omglol") != "pushed") { // && $(this).attr("data-omglol") != "pushed_back"){
								var left_css = parseInt($(this).css("left").replace(/[^-\d\.]/g, ''));
								var new_left_css = (left_css+400)+"px";
								$(this).css("left", new_left_css);
								$(this).attr("data-omglol","pushed");
							}
						});

						// Overlay Div creation
						$("body").append("<div class='he_overlay' id='hover_overlay_top'    style='left:0;top:0;width:0;height:0'></div>");
						$("body").append("<div class='he_overlay' id='hover_overlay_left'   style='left:0;top:0;width:0;height:0'></div>");
						$("body").append("<div class='he_overlay' id='hover_overlay_right'  style='left:0;top:0;width:0;height:0'></div>");
						$("body").append("<div class='he_overlay' id='hover_overlay_bottom' style='left:0;top:0;width:0;height:0'></div>");
					
						// Load previously saved data to insert heuristics
						chrome.storage.local.get('he_settings_saved_data', function(result){ 
							
							// Unpack results
							if (result.he_settings_saved_data == undefined){
								var he_settings_saved_data = [];
								var new_settings = true;
							} else {
								var he_settings_saved_data = result.he_settings_saved_data;
							}


							// Set default data if no data exists
						    if(he_settings_saved_data["overlay_color"] == undefined){
								var he_settings_saved_data = 	{"overlay_color": "black",
												   			 	 "heuristics_sets": [{ "set_name": "Nielsen's 10 Usability Heuristics",
													   			 					  "active":true,
													   			 					  "heuristics" : [
																						   			 	{ "title": "Visibility of system status",
																										  "details":"The system should keep users informed through appropriate feedback within reasonable time"
																										},
																										{ "title": "Match between system and the real world",
																										  "details":"The system should speak the users' language rather than system-oriented terms. Follow real-world conventions"
																										},
																										{ "title": "User control and freedom",
																										  "details":"Users often make mistakes and need 'emergency exits' to leave the unwanted state. Support undo and redo"
																										},
																										{ "title":"Consistency and standards",
																										  "details":"Users shouldn't have to wonder whether different words, situations, or actions mean the same thing. Follow platform conventions"
																										},
																										{ "title":"Error prevention",
																										  "details":"Prevent problems from occuring in the first place, or check for them and present users with a confirmation option before they commit to the action"
																										},
																										{ "title":"Recognition rather than recall",
																										  "details":"Minimize memory load by making objects, actions, and options visible. Instructions should be visible or easily retrievable"
																										},
																										{ "title":"Flexibility and efficiency of use",
																										  "details":"Accelerators - unseen by the novice user - may often speed up the interaction for the expert user. Allow users to tailor frequent actions"
																										},
																										{ "title":"Aesthetic and minimalist design",
																										  "details":"Dialogues should not contain information which is irrelevant or rarely needed"
																										},
																										{ "title":"Help recognize & recover from errors",
																										  "details":"Error messages should be expressed in plain language, indicate the problem, and suggest a solution"
																										},
																										{ "title":"Help and documentation",
																										  "details":"Any necessary help documentation should be easy to search, focused on the user's task, list concrete steps to be carried out, and not be too large"
																										},{"title":"Other", "details":""}
																						  			 ]
																					},
																					{ "set_name": "Custom",
													   			 					  "active":false,
													   			 					  "heuristics" : []
																					}]
																}
							}

							var overlay_color = he_settings_saved_data.overlay_color;

							if(overlay_color == "white"){
								$('.he_overlay').css('background-color', 'rgba(255,255,255,0.5)');
							} else if(overlay_color == "black"){
								$('.he_overlay').css('background-color', 'rgba(0,0,0,0.5)');
							}

							// Figure out the active heuristic set
							for (var i in he_settings_saved_data.heuristics_sets){
								if (he_settings_saved_data.heuristics_sets[i].active == true){
									var active_set = i;
								}
							}

							// Pull out the list of heuristics
							// Put heuristics in side pane
							populateHeuristicsInSidePane(he_settings_saved_data, active_set);
							if (new_settings){
								chrome.storage.local.set({'he_settings_saved_data': he_settings_saved_data});
							}

							$('#he_tweet_button').click(function(){
								chrome.runtime.sendMessage({greeting: "close_button_clicked"}, function(response) {});
								// Close the tray, remove all DOM elements and function handlers
								$('#add').remove();
								$('#he_callout').remove();
								$('.he_overlay').remove();
								$("body").css("cssText", "margin-left: 0 !important; width: 100% !important; position:absolute !important; overflow:scroll !important; cursor: auto !important;");

								// Move everything back over to the left
								$("body").find("*").not("#add >").not("#add").not(".he_overlay").not('#he_screenshot_preview').each(function(){
									if($(this).css("left") && $(this).css("position") == "fixed" && $(this).attr("data-omglol") == "pushed"){
										var left_css = parseInt($(this).css("left").replace(/[^-\d\.]/g, ''));
										var new_left_css = (left_css-400)+"px";
										$(this).css("left", new_left_css);
										$(this).attr("data-omglol","pushed_back");
									}
								});
							});

							// If UX Check has been opened but dialog has not been open
							if(typeof ux_check_last_opened !== 'undefined'){
								if (typeof purple_upsell_shown === 'undefined'){

									// Fire analytics
									chrome.runtime.sendMessage({greeting: "Fire Mixpanel: Purple upsell dialog shown"}, function(response) {});

									// Show dialog
									var videoUrl = chrome.extension.getURL('PurpleDemoLMS.mp4');
									var restartUrl = chrome.extension.getURL('restart.png');
									$('#add').append(	'<div id="purple_dialog_background">'+
															'<div id="purple_dialog">'+
																'<p>Hey there,</p>' + 
																"<p>I'm Chris - the creator of UX Check. Just want to share something that I'm <b>so excited</b> about! For the past year, I've been working with a great team of developers to build a new design tool called Purple. It lets you create all-in-one boards that contain lists, documents, presentations, designs, and prototypes, so all of your project work is in one place - not scattered around 20 different tabs. And we integrate with Google Docs, Sketch, Invision, and Marvel, so you don't have to give up your existing tools.</p>" +
																"<p>Purple is now open as a free public beta. I might be biased, but it's freaking awesome, and makes planning projects much easier. Go check it out!</p>" + 
																'<p>Chris</p>'+


																'<div class="purple_video_container">'+
																	'<video id="purple_demo_video" autoplay="autoplay" loop>'+
																		'+<source src="' + videoUrl + '".mp4" type="video/mp4">'+
																	'</video>'+
																	'<div class="purple_video_subtitle" id="purple_subtitle_5"><span>Sync Sketch files.</span></div>' + 
																	'<div class="purple_video_subtitle" id="purple_subtitle_4"><span>Embed prototypes.</span></div>' + 
																	'<div class="purple_video_subtitle" id="purple_subtitle_3"><span>Write documents.</span></div>' + 
																	'<div class="purple_video_subtitle" id="purple_subtitle_2"><span>Create lists.</span></div>' + 
																	'<div class="purple_video_subtitle" id="purple_subtitle_1" style="display:block;"><span>Everything is laid out as a card.</span></div>' + 
																'</div>' +
																'<div id="purple_video_controls">' + 
																	'<button id="purple_video_restart"><img src="' + restartUrl + '" width="16" /> Restart</button>' + 
																'</div>'+

																'<div style="width:100%;display:flex;"><a id="purple_CTA_button" target="_blank" href="http://www.purple.li?utm_source=uxcheck">Check out Purple - free beta</a></div>' +

																'<div id="purple_dialog_close" class="survey_button">Close</div>'+
															'</div>'+
														'</div>');

									// Handle video subtitles
									var videoSubtitleInterval = setInterval(function(){
										currentDemoTime = document.querySelector('#purple_demo_video').currentTime;
										if(currentDemoTime > 38) {
							                $('#purple_subtitle_4').fadeOut();
							                $('#purple_subtitle_5').fadeIn();
							            }
										else if(currentDemoTime > 19) {
							                $('#purple_subtitle_3').fadeOut();
							                $('#purple_subtitle_4').fadeIn();
							            }
										else if(currentDemoTime > 12) {
							                $('#purple_subtitle_2').fadeOut();
							                $('#purple_subtitle_3').fadeIn();
							            }
										else if(currentDemoTime > 9) {
							                $('#purple_subtitle_1').fadeOut();
							                $('#purple_subtitle_2').fadeIn();
							            } else if(currentDemoTime < 9) {
							                $('#purple_subtitle_5').fadeOut();
							                $('#purple_subtitle_1').fadeIn();
							            }
									}, 1000);

									// Video restart button 
									$('#purple_video_restart').click(function(){
										document.querySelector('#purple_demo_video').currentTime = 0;
						                $('#purple_subtitle_5').fadeOut();
						                $('#purple_subtitle_4').fadeOut();
						                $('#purple_subtitle_3').fadeOut();
						                $('#purple_subtitle_2').fadeOut();
						                $('#purple_subtitle_1').fadeIn();
									});

									// Close button
									$('#purple_dialog_close').click(function(){
										$('#purple_dialog_background').remove();
										clearInterval(videoSubtitleInterval);
										chrome.storage.local.set({'purple_upsell_shown': true });
									});

									// Open Purple in a new window
									$('#purple_CTA_button').click(function(){
										// Fire analytics
										chrome.runtime.sendMessage({greeting: "Fire Mixpanel: Purple upsell CTA clicked"});

										clearInterval(videoSubtitleInterval);
										chrome.storage.local.set({'purple_upsell_shown': true });

										chrome.runtime.sendMessage({greeting: "close_button_clicked"}, function(response) {});
										// Close the tray, remove all DOM elements and function handlers
											$('#add').remove();
											$('#he_callout').remove();
											$('.he_overlay').remove();
											$("body").css("cssText", "margin-left: 0 !important; width: 100% !important; position:absolute !important; overflow:scroll !important; cursor: auto !important;");

										// Move everything back over to the left
											$("body").find("*").not("#add >").not("#add").not(".he_overlay").not('#he_screenshot_preview').each(function(){
												if($(this).css("left") && $(this).css("position") == "fixed" && $(this).attr("data-omglol") == "pushed"){
													var left_css = parseInt($(this).css("left").replace(/[^-\d\.]/g, ''));
													var new_left_css = (left_css-400)+"px";
													$(this).css("left", new_left_css);
													$(this).attr("data-omglol","pushed_back");
												}
											});
									});

								}

							}
							// if (ux_check_last_opened == 0){
							// 	$('#add').append(	'<div id="new_features_dialog">'+
							// 							'<div id="new_features_dialog_left">'+
							// 								'<p>'+
							// 									'<b style="margin-right:20px;">New features!</b>'+
							// 								'</p>'+
							// 								'<p>Custom heuristic lists that you can export and share with teammates, a white overlay theme, bug fixes, and more.</p>'+
							// 							'</div>'+
							// 							'<div id="new_features_dialog_right">'+
							// 								'<button id="new_features_dialog_close">Close</button>'+
							// 							'</div>'+
							// 						'</div>');
							// 	$('#new_features_dialog_close').click(function(){
							// 		$('#new_features_dialog').remove();
							// 	})
							// }

						});

						//var website_name = window.location.host;
						var webpage_title = document.title;
						var webpage_url = window.location;

						
						// Callout creation
						$("body").append("<div id='he_callout' class='he_reset' style='display:none;'><div id='he_heuristic_label'>Add a heuristic</div><select id='he_heuristic_select'></select><div id='he_notes_label'>Notes</div><textarea id='he_notes' class='he_callout_textarea he_reset'></textarea><div id='he_recommendation_label'>Recommendation</div><textarea id='he_recommendation' class='he_callout_textarea he_reset'></textarea><div id='he_severity_container'><span id='he_severity_label' class='he_reset'>Severity</span><select id='he_severity_dropdown'><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option></select></div><button class='he_callout_button' id='he_callout_cancel'>Cancel</button><button class='he_callout_button' id='he_callout_save'>Save</button></div>");

						
						// If the tray hasn't already been loaded, then we can attach handlers to everything. 
						// Otherwise handlers will already exist
						if (window.tray_already_opened == false){
							window.tray_already_opened = true;

							// Friendly alert on window resize
							var delay = (function(){
								var timer = 0;
								return function(callback, ms){
								    clearTimeout (timer);
								    timer = setTimeout(callback, ms);
								};
							})();

							var havent_alerted_resize = true;

							$(window).resize(function() {
								if($('#he_tray').length != 0){
									if (havent_alerted_resize){
									    delay(function(){
									    	var r = window.confirm("Sorry, I don't do so well when the window is resized. Can you refresh me?");
									      	if (r == true){
									      		location.reload();
									      	}
									      	havent_alerted_resize = false;
									    }, 500);
									}
								}
							});

							// ========= ELEMENT SELECTION =========

							// Disable selection if pause button is clicked
							function executePause(){

								// If the callout is up, don't do anything

									if($('#he_callout').css('display') == 'none'){

										// Reverse hover_enabled flag

											if(window.hover_enabled == false){  // Unpause
												window.hover_enabled = true;
												$('#pause_selection').css('background-color','rgba(0,0,0,0)');
												$('.he_overlay').show();
											} else { 							// Pause
												window.hover_enabled = false;
												$('#pause_selection').css('background-color','rgba(255,255,255,0.2)');
												$('.he_overlay').hide();

											}	
									}
							}

							// Execute pause for Ctrl + Shift + P
							$(window).keydown(function(event) {
								if(event.ctrlKey && event.keyCode == 80) { 
								    event.preventDefault();
								    executePause(); 
							  	}
							});

							// Execute pause on click of pause button
							$(document).on('click', '#pause_selection', function(e){
								executePause();
							});
								

							// When hovering over the website...
							$("body").find("*").not("body > #add").mouseenter(function(){
								if (window.hover_enabled){
									
									//calculate dimensions/position of hovered element
									var position = $(this).offset();
									position.left = position.left - 410;
									position.top = position.top - 10;
									var width = $(this).outerWidth()+20;
									var height = $(this).outerHeight()+20;
									
									// Update the overlays to the hovered element
									// Account for sites that put margin-top on body
									position.top = position.top - margin_top;
									$('#hover_overlay_top').css({"top": (0 - margin_top) + "px","left": "0", "width": "100%", "height": (position.top + margin_top)+"px"});
									$('#hover_overlay_left').css({"top": position.top+"px","left": "0", "width": position.left+"px", "height": height+"px"});
									$('#hover_overlay_right').css({"top": position.top+"px","left": position.left+width+"px", "width": (doc_width - position.left - width)+"px", "height": height+"px"});
									$('#hover_overlay_bottom').css({"top": (position.top+height)+"px","left": "0", "width": "100%", "height": (doc_height -  position.top - height)+"px"});
								}
							});

							// Hide the overlay if hovering over the pane
							$('#add').mouseenter(function(e){
								if (window.hover_enabled){
									hide_overlays();
								}
							})

							// ========= ANNOTATION =========

							// Callout open on click
							$("body").find("*:not(#add):not(#he_callout *):not(#he_callout):not(#new_features_dialog *)").click(function(e) {
								
								// Only do stuff if selection isn't paused
								if (window.hover_enabled){

									// Stop the event from bubbling to the website
									e.preventDefault();
									e.stopImmediatePropagation();

								    // Do other stuff when a click happens
							    	$('body').css('cursor','default');
									window.hover_enabled = false;

									// Show callout and calculate width and height
									$('#he_callout').css({'left':'-1000', 'top':'-1000', 'display':'block'});
									var callout_height = $('#he_callout').outerHeight();
									var callout_width = $('#he_callout').outerWidth();
									
									// Callout --> Calculate coordinates
									var hole_position_right = parseInt($('#hover_overlay_right').css('left').replace(/[^-\d\.]/g, ''));
									var hole_position_top = parseInt($('#hover_overlay_right').css('top').replace(/[^-\d\.]/g, '')); //$('#hover_overlay_right').offset().top - $(window).scrollTop();
									var hole_position_left = parseInt($('#hover_overlay_left').css('width').replace(/[^-\d\.]/g, ''));
									var hole_height = parseInt($('#hover_overlay_left').css('height').replace(/[^-\d\.]/g, ''));
									var hole_position_bottom = hole_position_top + hole_height;
									var hole_width = hole_position_right - hole_position_left;
									var window_height = $(window).height();
									var window_width = $(window).width() - 400;

									// === Callout vertical alignment ===

									// If there's enough room on the bottom
									if (window_height - hole_position_bottom > callout_height){
										// Set callout vertical position to top of hole
										var callout_top = hole_position_top;
										var vertically_bottom = true;
									} 

									// If there's not enough room on the bottom but enough room on the top
									else if(hole_position_top - $(window).scrollTop() > callout_height){
										// Set callout vertical position to bottom of hole minus callout height so it's bottom aligned with hole
										var callout_top = hole_position_bottom - callout_height;
										var vertically_top = true;
									}

									// If there's not enough room on top or bottom
									else {
										// Put callout vertically in the middle
										var callout_top = (window_height - callout_height)/2 + $(window).scrollTop();
										var vertically_middle = true;
									}
											

									// === Callout horizontal alignment ===

									// If there's enough room on the right
									if (window_width - hole_position_right > callout_width + 20){
										// Set callout horizontal position to right of hole
										var callout_left = hole_position_right + 20;
										var right_side = true;
									}

									// If there's not enough room on the right but enough room on the left
									else if(hole_position_left > callout_width + 20){
										// Set callout vertical position to left of hole minus callout width so it's right aligned to the hole
										var callout_left = hole_position_left - callout_width - 20;
										var left_side = true;
									}

									// If there's not enough room on left or right
									else {
										// Put callout horizontally in the middle
										var callout_left = (window_width - callout_width)/2;
										var horizontally_middle = true;
									}

									if (horizontally_middle){
										if(vertically_bottom){
											var callout_top = callout_top + hole_height + 20;
										}

										if(vertically_top){
											var callout_top = callout_top - hole_height - 20;
										}
									}

									// Callout --> Show
									$('#he_callout').css({'left':callout_left, 'top':callout_top, 'display':'block'});
								}
							});
							
							// Cancel button click --> Remove callout and resume hovering
							$(document).on('click', '#he_callout_cancel', function(e){ 
								close_callout();
							});

							// Save button --> click
							$(document).on('click', '#he_callout_save', function(e){ 

								// Take a screenshot when clicking on a heuristic
								window.hover_enabled = false;
								$('#he_callout').css({'left':'0', 'top':'0', 'display':'none'});

								// If I don't have the timeout the callout 
								// still appears in the screenshots because 
								// Chrome hasn't finished painting the css change. ugh. 
								setTimeout(function(){
									chrome.runtime.sendMessage({greeting: "take_screenshot"}, function(response) {
										// console.log('chrome runtime send message called and returned');

										// Show save notification
										$('#add').append('<div class="he_notification_container"><div class="he_notification">Screenshot saved</div></div>');
										window.setTimeout(function(){
											$('.he_notification_container').fadeOut(1000, function(){
												$(this).remove();
											});
										},2000);

									  	window.screenshot = response.farewell;
										window.hover_enabled = true;

										// === Crop screenshot ===

										// generate canvas
										$('body').append('<canvas id="crop_canvas" style="display:none; position:fixed; z-index:2147483648;left:0;top:0;"></canvas>');
										var canvas = document.getElementById('crop_canvas');
										var context = canvas.getContext('2d');
										var imageObj = new Image();
										imageObj.src = window.screenshot;

										// Once image is loaded, then we can get dimensions and use it
										imageObj.onload = function() {
										    // draw cropped image to canvas
											var sourceX = 400 * window.devicePixelRatio;
											var sourceY = 0;
											var sourceWidth = imageObj.width - sourceX;
											var sourceHeight = imageObj.height;
											var destX = 0;
											var destY = 0;
											canvas.width = sourceWidth;
											canvas.height = sourceHeight;
											context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, sourceWidth, sourceHeight); //, destWidth, destHeight
											
											// save image & remove canvas
											var cropped_screenshot = canvas.toDataURL("image/jpg");

											$('#crop_canvas').remove();

											// === Save data to json ===
											// Get data from the DOM
											var save_heuristic = $('#he_heuristic_select').val();
											var save_severity = $('#he_severity_dropdown').val();
											var save_notes = $('#he_notes').val();
											var save_recommendation = $('#he_recommendation').val();
											var save_screenshot = cropped_screenshot;

											// Load previously saved data
											chrome.storage.local.get('saved_data', function(result){ 
												// Unpack results
												if (result.saved_data == undefined){
													var saved_data = [];
													var save_id = 0;
												} else {
													var saved_data = result.saved_data;
													var save_id = result.saved_data.length;
												}

												// Add data
												website_name = "hacker news";
												saved_data[save_id] = 
													{"website_name": website_name,
													"webpage_title": webpage_title,
													"webpage_url":webpage_url.href,
													"heuristic": save_heuristic,
													"severity": save_severity,
													"notes": save_notes,
													"recommendation": save_recommendation,
													"screenshot": save_screenshot};

												// Save to local storage
												chrome.storage.local.set({'saved_data': saved_data});

												// Close the callout
												close_callout();

											});
										}
									});
								}, 50); // timeout time

								// In response to the request to open the side pane
						  		sendResponse({farewell: "okay"});

							});

							$(document).on('click', '#he_tray_close', function(e){ 
								chrome.runtime.sendMessage({greeting: "close_button_clicked"}, function(response) {
								});
								// Close the tray, remove all DOM elements and function handlers
								$('#add').remove();
								$('#he_callout').remove();
								$('.he_overlay').remove();
								$("body").css("cssText", "margin-left: 0 !important; width: 100% !important; position:absolute !important; overflow:scroll !important; cursor: auto !important;");

								// Move everything back over to the left
								$("body").find("*").not("#add >").not("#add").not(".he_overlay").not('#he_screenshot_preview').each(function(){
									if($(this).css("left") && $(this).css("position") == "fixed" && $(this).attr("data-omglol") == "pushed"){
										var left_css = parseInt($(this).css("left").replace(/[^-\d\.]/g, ''));
										var new_left_css = (left_css-400)+"px";
										$(this).css("left", new_left_css);
										$(this).attr("data-omglol","pushed_back");
									}
								});
							});

						  	// On click of "View progress", generate table 	
					  		$(document).on('click', '#he_view_progress', function(e){ 

					  			// Hide the overlays/callout if they're visible
				  				close_callout();
				  				hide_overlays();

					  			// Load previously saved data
								chrome.storage.local.get('saved_data', function(result){ 
									
									// Unpack results
									if (result.saved_data == undefined){
										var saved_data = [];
										var save_id = 0;
									} else {
										var saved_data = result.saved_data;
										var save_id = result.saved_data.length;
									}


									// Create an overlay
									$('#he_progress').css('background-color','rgba(40,40,40,0.98)');
									$('#he_progress').show();

									// Generate the table
									function generateTable(saved_data){						
										var insert_table = "<div id='he_progress_close' class='he_close_button'>"+
																"<div class='he_close_left'></div>"+
																"<div class='he_close_right'></div>"+
															"</div>"+
															"<h2>CURRENT PROGRESS</h2>"+
															"<table id='progress_table'>"+
																"<thead>"+
																	"<tr>"+
																		"<td>Screenshot</td><td>Heuristic</td><td>Severity</td><td>Notes</td><td>Recommendation</td>"+
																	"</tr>"+
																"</thead>";
										for (var i = 0; i < saved_data.length; i++){
											insert_table = insert_table + "<tr class='he_progress_row'>";
											insert_table = insert_table + "<td><img width='150' class='he_screenshot_preview' src='" + saved_data[i]['screenshot'] + "' /></td>";
											insert_table = insert_table + "<td class='he_heuristic_column'>" + saved_data[i]['heuristic'] + "</td>";
											insert_table = insert_table + "<td>" + saved_data[i]['severity'] + "</td>";
											insert_table = insert_table + "<td class='he_notes_column'>" + saved_data[i]['notes'] + "</td>";
											insert_table = insert_table + "<td class='he_recommendation_column'>" + saved_data[i]['recommendation'] + "</td>";
											insert_table = insert_table + "<td style='border-top:none;border-right:none;border-bottom:none;'><div style='width:100px;height:1px;background-color:rgba(0,0,0,0);'></div><button class='he_delete_annotation he_reset' id='"+i+"'>Delete</button></td>";
											insert_table = insert_table + "</tr>";
										}
										insert_table = insert_table + "</table>";
										return insert_table;
									}
										
									// Paint the table
									var insert_table = generateTable(saved_data);
									$('#he_progress').empty();
									$('#he_progress').html(insert_table);
									if (saved_data.length == 0){
										$('#he_progress').append("<div id='he_nothing_here'>:( Nothing here.</div>");
									}

									// Close the View Progress table
									$('#he_progress_close').click(function(){
										$('#he_progress').html('');
										$('#he_progress').css('background-color', 'rgba(0,0,0,0)');
										$('#he_progress').hide();
										$('#he_nothing_here').remove();
										window.hover_enabled = true;
									});

									// Screenshot Preview Open
									$('.he_screenshot_preview').click(function(){
										// Open it	
										var screenshot_src = $(this).attr('src');
										var window_height = $(window).height();

										var progress_table_html = '<div id="screenshot_preview_container">'+
											'<img id="he_progress_close" width="17" unselectable="true" src="'+chrome.extension.getURL("close.png")+'" />'+
											'<img id="he_screenshot_preview" src="'+ 
											screenshot_src +
											'" /></div>';
										
										$('#add').append(progress_table_html);
										var screenshot_height = $('#he_screenshot_preview').height();
										var screenshot_top = (window_height - screenshot_height)/2;
										$('#he_screenshot_preview').css('margin-top', screenshot_top);

										// Hook up close functionality
										$('#screenshot_preview_container').click(function(){
											$('#screenshot_preview_container').remove();
										});
									});

									// Delete annotation hover
									$('.he_progress_row').hover(function(){
										$(this).children().last().children(".he_delete_annotation").css('display','block');
									}, function(){
										$(this).children().last().children(".he_delete_annotation").css('display','none');
									});

									// Delete annotation click
									$('.he_delete_annotation').click(function(){

										// Remove the row from the saved data, save data back
										var index = $(this).attr('id');
										if (index > -1) {
										    saved_data.splice(index, 1);
										}

										chrome.storage.local.set({'saved_data': saved_data});


										var insert_table = generateTable(saved_data);

										// Change the id of every other Delete button that 
										// comes after the one we're going to delete
										$(this).parent().parent().nextAll().find("button").each(function(){
											var new_id = $(this).attr("id") - 1;
											$(this).attr("id", new_id);
										})

										// Delete the row
										$(this).parents("tr").remove();

										//Show ":( nothing here"
										chrome.storage.local.get('saved_data', function(result){ 
							
											// Unpack results
											if (result.saved_data == undefined){
												var saved_data = [];
												var save_id = 0;
											} else {
												var saved_data = result.saved_data;
												var save_id = result.saved_data.length;
											}
											if (saved_data.length == 0){
												$('#he_progress').append("<div id='he_nothing_here'>:( Nothing here.</div>");
											}
										});

									}); // end delete annotation

								}); //end chrome.storage.local.get callback

							}); // end onclick of  view_progress

							// On click of "Settings"
					  		$(document).on('click', '#he_open_settings', function(e){ 

					  			// Hide the overlays/callout if they're visible
				  				close_callout();
				  				hide_overlays();

					  			// Load previously saved data
								chrome.storage.local.get('he_settings_saved_data', function(result){ 
									var he_settings_saved_data = result.he_settings_saved_data;
									// Data structure under he_settings_saved_data

									/*
									var he_settings_saved_data = 	{"overlay_color": "black",
												   			 	 "heuristics_sets": [{ "set_name": "Nielsen's 10 Usability Heuristics",
													   			 					  "active":true,
													   			 					  "heuristics" : [
																						   			 	{ "title": "Visibility of system status",
																										  "details":"The system should keep users informed through appropriate feedback within reasonable time"
																										},
																										{ "title": "Match between system and the real world",
																										  "details":"The system should speak the users' language rather than system-oriented terms. Follow real-world conventions"
																										}
																						  			 ]
																					},
																					{ "set_name": "Custom",
													   			 					  "active":false,
													   			 					  "heuristics" : []
																					}]
																}
							
									*/


									// Unpack settings
									var overlay_color_setting = he_settings_saved_data["overlay_color"];

									// Create an overlay
									$('#he_settings').css('background-color','rgba(40,40,40,0.98)');
									$('#he_settings').show();

										
									// Paint the settings
									$('#he_settings').empty();
									$('#he_settings').html("<div id='he_settings_close' class='he_close_button'>"+
																"<div class='he_close_left'></div>"+
																"<div class='he_close_right'></div>"+
															"</div>"+
															"<h2>SETTINGS</h2>"+
															"<h3>OVERLAY COLOR</h3>"+
															"<select id='he_settings_overlay_color_select'>"+
																"<option value='black' id='overlay_black_option'>Black</option>"+
																"<option value='white' id='overlay_white_option'>White</option>"+
															"</select>"+
															"<h3>HEURISTICS SET</h3>"+
															"<select id='he_settings_heuristics_set_select'>"+
															"</select>");


									if(overlay_color_setting == "black"){
										$('#overlay_black_option').attr('selected', 'selected');
									} else {
										$('#overlay_white_option').attr('selected', 'selected');
									}

									// Figure out the active heuristic set
									// Paint heuristic sets into select
									for (var i in he_settings_saved_data.heuristics_sets){
										var heuristics_set = he_settings_saved_data.heuristics_sets[i];
										if (heuristics_set.active == true){
											$('#he_settings_heuristics_set_select').append('<option value="'+heuristics_set.set_name+'" selected="selected">'+heuristics_set.set_name+'</option>');
											populateHeuristicsInSettings (he_settings_saved_data, i);
										} else{
											$('#he_settings_heuristics_set_select').append('<option value="'+heuristics_set.set_name+'">'+heuristics_set.set_name+'</option>');
										}
									}

									// Paint heuristics cards
									function populateHeuristicsInSettings(he_settings_saved_data, active_set){

										// Remove existing set from DOM
											$('.he_settings_heuristic_card').remove();
											$('.he_settings_new_heuristic_card').remove();

										var heuristics = he_settings_saved_data.heuristics_sets[active_set].heuristics;

										// If heuristics_set is Custom
										if (he_settings_saved_data.heuristics_sets[active_set].set_name == "Custom"){
											$('#he_settings').append('<div id="custom_cards_wrapper"></div>');
											for (var j in heuristics){
												$('#custom_cards_wrapper').append(	'<div class="he_settings_heuristic_card he_reset">'+
																						'<h4 class="he_reset he_settings_heuristic_title">'+heuristics[j].title+'</h4>'+
																						'<p class="he_reset he_settings_heuristic_text">'+heuristics[j].details+'</p>'+
																						'<div class="custom_heuristic_delete_hover_zone"></div>'+
																						'<button class="custom_heuristic_delete" data-delete-index="'+j+'">Delete</button>'+
																					'</div>');
											}
											function addDeleteButton(he_settings_saved_data){

												// Delete hover functionality
												$('.he_settings_heuristic_card').hover(function(){
													$(this).children('.custom_heuristic_delete').css('display', 'block');
												}, function(){
													if (!$(this).children('.custom_heuristic_delete_hover_zone').is(":hover")){
														$(this).children('.custom_heuristic_delete').css('display', 'none');
													}
												});

												// Delete functionality
												$('.custom_heuristic_delete').click(function(){

													// Figure out what to delete and delete it
													var index = $(this).attr('data-delete-index');
													$(this).parent().remove();
													he_settings_saved_data.heuristics_sets[active_set].heuristics.splice(index, 1);
													chrome.storage.local.set({'he_settings_saved_data': he_settings_saved_data});

													// Change index of everything after the deleted
													var index = 0;
													$('#custom_cards_wrapper').children().each(function(){
														$(this).children('button').attr('data-delete-index', index);
														index += 1;
													})

													// Update side panel 
													populateHeuristicsInSidePane(he_settings_saved_data, active_set);

												});
											}

											addDeleteButton(he_settings_saved_data);

											// Append input UI
											$('#he_settings').append('<div class="he_settings_new_heuristic_card he_reset">'+
																		'<h4 id="he_settings_heuristic_card_h4">ADD NEW ITEM</h3>'+
																		'<h5 class="he_reset he_settings_heuristic_title">Title</h4>'+
																		'<input id="custom_heuristic_title"></input>'+
																		'<h5 class="he_reset he_settings_heuristic_title">Details</h4>'+
																		'<textarea id="custom_heuristic_details"></textarea>'+
																		'<div id="he_settings_heuristic_buttons">'+
																			'<button id="custom_heuristic_save" tabindex="0">Save</button>'+
																		'</div>'+
																	 '</div>');
											// Save button click
											$('#custom_heuristic_save').click(function(){
												var title = $('#custom_heuristic_title').val();
												var details = $('#custom_heuristic_details').val();
												
												//If the title field isn't empty
												if(title.length > 0){

													// Add new card to the UI
													var index = $('.he_settings_heuristic_card').length;
													$('#custom_cards_wrapper').append('<div class="he_settings_heuristic_card he_reset">'+
																									'<h4 class="he_reset he_settings_heuristic_title">'+title+'</h4>'+
																									'<p class="he_reset he_settings_heuristic_text">'+details+'</p>'+
																									'<div class="custom_heuristic_delete_hover_zone"></div>'+
																									'<button class="custom_heuristic_delete" data-delete-index="'+index+'">Delete</button>'+
																								'</div>');
													$('#custom_heuristic_title').val("");
													$('#custom_heuristic_details').val("");

													// Add new entry to saved data
													for (var i in he_settings_saved_data.heuristics_sets){
														if (he_settings_saved_data.heuristics_sets[i].set_name == "Custom"){
															var number_of_heuristics = he_settings_saved_data.heuristics_sets[i].heuristics.length;
															he_settings_saved_data.heuristics_sets[i].heuristics[number_of_heuristics] = {"title":title, "details":details};
														}
													}

													// Add a delete button
													addDeleteButton(he_settings_saved_data);

													// Focus back on the input
													$('#custom_heuristic_title').focus();

													// Save to local storage and update side pane
													chrome.storage.local.set({'he_settings_saved_data': he_settings_saved_data});
													populateHeuristicsInSidePane(he_settings_saved_data, active_set);
												
												}
											});

										} else { // If heuristics_set is not custom, just paint a list of heuristics
											for (var j in heuristics){
												$('#he_settings').append(	'<div class="he_settings_heuristic_card he_reset">'+
																				'<h4 class="he_reset he_settings_heuristic_title">'+heuristics[j].title+'</h4>'+
																				'<p class="he_reset he_settings_heuristic_text">'+heuristics[j].details+'</p>'+
																			'</div>');
											}

										}
											
									}

									// Overlay color setting
									$('#he_settings_overlay_color_select').change(function(){
										if($( this ).val() == "white"){
											$('.he_overlay').css('background-color', 'rgba(255,255,255,0.5)');
										} else if($( this ).val() == "black"){
											$('.he_overlay').css('background-color', 'rgba(0,0,0,0.5)');
										}
										he_settings_saved_data["overlay_color"] = $(this).val();
										chrome.storage.local.set({'he_settings_saved_data': he_settings_saved_data});
									});

									// On change of heuristics select
									$('#he_settings_heuristics_set_select').change(function(){

										// Figure out which set was chosen
										for (var k in he_settings_saved_data.heuristics_sets){
											if (he_settings_saved_data.heuristics_sets[k].set_name == $(this).val()){
												var active_set = k;
												he_settings_saved_data.heuristics_sets[k].active = true;
											} else {
												he_settings_saved_data.heuristics_sets[k].active = false;
											}
										}
										// Save which set is active
										chrome.storage.local.set({'he_settings_saved_data': he_settings_saved_data});
										
										// Add heuristics to DOM
										populateHeuristicsInSettings(he_settings_saved_data, active_set);

										// Add heuristics to side pane
										populateHeuristicsInSidePane(he_settings_saved_data, active_set);
									});


									// Close the View Progress table
									$('#he_settings_close').click(function(){
										$('#he_settings').html('');
										$('#he_settings').css('background-color', 'rgba(0,0,0,0)');
										$('#he_settings').hide();
										window.hover_enabled = true;
									});

								}); //end chrome.storage.local.get callback

							}); // end onclick of  view_progress

						  	// On click of "Stop Evaluation", tell Background.js to open the eval page 
						  		
					  		$(document).on('click', '#stop_evaluation', function(e){ 
						    	var r = window.confirm("This will end your evaluation, and you won't be able to go back & continue. Press ok if you're sure you're all finished.");
						      	if (r == true){
									chrome.storage.local.get('saved_data', function(result){ 
										// Unpack results

											if (result.saved_data == undefined){
												var saved_data = [];
												var save_id = 0;
											} else {
												var saved_data = result.saved_data;
												var save_id = result.saved_data.length;
											}
											
										// Generate xml

											var num_of_heuristics = saved_data.length;

											// #### Generate variables for files ####
											
											// [Content_Types].xml
											var docx_html = '';
											//docx_html+='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">';
											//docx_html+='<head><!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>90</w:Zoom><w:DoNotOptimizeForBrowser/></w:WordDocument></xml><![endif]--><style><!-- /* Style Definitions */@page Section1{size:8.5in 11.0in; margin:1.0in 1.25in 1.0in 1.25in ; mso-header-margin:.5in; mso-footer-margin:.5in; mso-paper-source:0;}div.Section1{page:Section1;}--></style></head>';
											//docx_html+=saved_data[0].website_name;
											docx_html+='<apex:page controller="TestMSWord" contentType="application/msWord#msword.doc" ><html xmlns:w="urn:schemas-microsoft-com:office:word"><apex:outputText value="{!PrintView}" escape="false"/><body>';
											docx_html+='<div id="docx_eval">';
											for (i = 0; i < num_of_heuristics; i++){
												docx_html+= '<div class="annotation">';
												if (saved_data[i].heuristic.length > 0){
													docx_html+= '<h2 class="heuristic">Heuristic: '+ saved_data[i].heuristic + '</h2>';
												}
												if (saved_data[i].severity.length > 0){
													docx_html+= '<h2 class="severity">Severity: '+ saved_data[i].severity + '</h2>';
												}
												if (saved_data[i].screenshot.length > 0){
													docx_html+= '<img src='+saved_data[i].screenshot+' />';
												}
												if (saved_data[i].notes.length > 0){
													docx_html+= '<h2>Notes</h2><p class="notes">'+ saved_data[i].notes + '</p>';
												}
												if (saved_data[i].recommendation.length > 0){
													docx_html+= '<h2>Recommendation</h2><p class="recommendation">'+ saved_data[i].recommendation + '</p>';
												}
												docx_html+= '</div>';									
											}
											docx_html+='</div></body></html></apex:page>';//</body></html>';

											$('#add').remove();
											$('#he_callout').remove();
											$('.he_overlay').remove();

											//$('body').css({'margin-left': '0', 'width': '100%', 'position':'absolute','overflow':'scroll', 'cursor':'auto'});
											$("body").css("cssText", "margin-left: 0 !important; width: 100% !important; position:absolute !important; overflow:scroll !important; cursor: auto !important;");

										// Move everything back over to the left

											$("body").find("*").not("#add >").not("#add").not(".he_overlay").not('#he_screenshot_preview').each(function(){
												if($(this).css("left") && $(this).css("position") == "fixed" && $(this).attr("data-omglol") == "pushed"){
													var left_css = parseInt($(this).css("left").replace(/[^-\d\.]/g, ''));
													var new_left_css = (left_css-400)+"px";
													$(this).css("left", new_left_css);
													$(this).attr("data-omglol","pushed_back");
												}
											});

										chrome.runtime.sendMessage({greeting: "stop_evaluation", html: docx_html, annotations: num_of_heuristics}, function(response) {});
										
										chrome.storage.local.set({'saved_data': null});

									});	
      							} 
							});
						}
					});
				}	
			}
		}
	);	
});


function close_callout(){
	$('#he_callout').css({'left':'0', 'top':'0', 'display':'none'});
	window.hover_enabled = true;
	$('#he_severity_dropdown').val("0");
	$('.ui-autocomplete-input').val("");
	$('.he_callout_textarea').val("");
}

function hide_overlays(){
	$("#hover_overlay_top").css({"top": "0","left": "0", "width": "0px", "height": "0px"});
	$("#hover_overlay_left").css({"top": "0","left": "0", "width": "0px", "height": "0px"});
	$("#hover_overlay_right").css({"top": "0","left": "0", "width": "0px", "height": "0px"});
	$("#hover_overlay_bottom").css({"top": "0","left": "0", "width": "0px", "height": "0px"});
}

function populateHeuristicsInSidePane(he_settings_saved_data, active_set){
	var heuristics = he_settings_saved_data.heuristics_sets[active_set].heuristics;
	$('.he_card').remove();
	for (var j in heuristics){
		$('#he_card_container').append(	'<div class="he_card he_reset" tabindex="0">'+
											'<h2 class="he_reset he_card_title">'+heuristics[j].title+'</h2>'+
											'<p class="he_reset he_card_text">'+heuristics[j].details+'</p>'+
										'</div>');
	}
	$('#he_heuristic_select').children().remove();
	for (var j in heuristics){
		$('#he_heuristic_select').append('<option>'+heuristics[j].title+'</option>');
	}
	//he_heuristic_select
	//<option>Visibility of system status</option><option>Match between system and the real world</option><option>User control and freedom</option><option>Consistency and standards</option><option>Error prevention</option><option>Recognition rather than recall</option><option>Flexibility and efficiency of use</option><option>Aesthetic and minimalist design</option><option>Help users recognize and recover from errors</option><option>Help and documentation</option><option>Other</option>

}







