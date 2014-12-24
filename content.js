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

					    var cards_array = [
							"Visibility of system status",
							"Match between system and the real world",
							"User control and freedom",
							"Consistency and standards",
							"Error prevention",
							"Recognition rather than recall",
							"Flexibility and efficiency of use",
							"Aesthetic and minimalist design",
							"Help users recognize and recover from errors",
							"Help and documentation",
							"Other"
						]

						var evaluation_info = { 'heuristics':cards_array,
						}

						localStorage.setItem('cards_array', JSON.stringify(cards_array));

						//var website_name = window.location.host;
						var webpage_title = document.title;
						var webpage_url = window.location;

					// ========= UI INJECTION =========

					// Scoot <body> over to the right by 400px

						$("body").css("cssText", "margin-left: 400px !important; width: calc(100% - 400px) !important; position:absolute !important; overflow:scroll !important; cursor: pointer !important;");

					// Inject tray html template into body (but it's fixed)

						var trayUrl = chrome.extension.getURL('tray.html');
						$("body").prepend("<div id='add' class='reset' data-omglol='yo' style='position:fixed;left:0;top:0;z-index:1999999999;'></div>");
						$("#add").load(trayUrl, function(){
							// Add the close button
							var he_tray_close = "<div id='he_tray_close'>"+
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
					
					// Callout creation

						$("body").append("<div id='he_callout' class='reset' style='display:none;'><div id='he_heuristic_label'>Add a heuristic</div><select id='he_heuristic_select'><option>Visibility of system status</option><option>Match between system and the real world</option><option>User control and freedom</option><option>Consistency and standards</option><option>Error prevention</option><option>Recognition rather than recall</option><option>Flexibility and efficiency of use</option><option>Aesthetic and minimalist design</option><option>Help users recognize and recover from errors</option><option>Help and documentation</option><option>Other</option></select><div id='he_severity_container'><span id='he_severity_label' class='reset'>Severity</span><select id='he_severity_dropdown'><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option></select></div><div id='he_notes_label'>Notes</div><textarea id='he_notes' class='he_callout_textarea reset'></textarea><div id='he_recommendation_label'>Recommendation</div><textarea id='he_recommendation' class='he_callout_textarea reset'></textarea><button class='he_callout_button' id='he_callout_cancel'>Cancel</button><button class='he_callout_button' id='he_callout_save'>Save</button></div>");


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
								if (havent_alerted_resize){
								    delay(function(){
								    	var r = window.confirm("Sorry, I don't do so well when the window is resized. Can you refresh me?");
								      	if (r == true){
								      		location.reload();
								      	}
								      	havent_alerted_resize = false;
								    }, 500);
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
												$('#pause_selection').css('background-color','1px solid rgba(0,0,0,0)');
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

							$("body").find("*:not(#add):not(#he_callout *):not(#he_callout)").click(function(e) {
								
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

									// Callout vertical alignment

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
											

									// Callout horizontal alignment

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
							
							$("#he_callout_cancel").click(function(){
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

										// Show save notification

											$('body').append('<div class="he_notification_container"><div class="he_notification">Screenshot saved</div></div>');
											window.setTimeout(function(){
												$('.he_notification_container').fadeOut(2000, function(){
													$(this).remove();
												});
											},2000);

									  	window.screenshot = response.farewell;
										window.hover_enabled = true;

										// Crop screenshot

											// generate canvas
											$('body').append('<canvas id="crop_canvas" style="display: none; position:fixed; z-index:2147483648;left:0;top:0;"></canvas>');
											var canvas = document.getElementById('crop_canvas');
											var context = canvas.getContext('2d');
											var imageObj = new Image();

											imageObj.src = window.screenshot;

											// draw cropped image to canvas
											var sourceX = 400;
											var sourceY = 0;
											var sourceWidth = imageObj.width - 400;
											var sourceHeight = imageObj.height;
											var destX = 0;
											var destY = 0;
											canvas.width = sourceWidth;
											canvas.height = sourceHeight;
											context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, sourceWidth, sourceHeight); //, destWidth, destHeight
											
											// save image & remove canvas
											var cropped_screenshot = canvas.toDataURL("image/jpg");
											$('#crop_canvas').remove();

										// Save data to json 

											// Get data from the DOM

												//var save_heuristic = $('.ui-autocomplete-input').val();
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
														//localStorage.setItem('saved_data', JSON.stringify(saved_data));


													// Close the callout
														
														close_callout();

												});
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

								//$(document).mousemove(function(event){
									$("body").find("*").not("#add >").not("#add").not(".he_overlay").not('#he_screenshot_preview').each(function(){
										if($(this).css("left") && $(this).css("position") == "fixed" && $(this).attr("data-omglol") == "pushed"){
											var left_css = parseInt($(this).css("left").replace(/[^-\d\.]/g, ''));
											var new_left_css = (left_css-400)+"px";
											$(this).css("left", new_left_css);
											$(this).attr("data-omglol","pushed_back");
										}
									});
								//});
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
												var insert_table = "<img id='he_progress_close' width='17' unselectable='true' src='"+chrome.extension.getURL('close.png')+"' /><h2>CURRENT PROGRESS</h2><table id='progress_table'><thead><tr><td>Screenshot</td><td>Heuristic</td><td>Severity</td><td>Notes</td><td>Recommendation</td></tr></thead>";
												for (var i = 0; i < saved_data.length; i++){
													insert_table = insert_table + "<tr class='he_progress_row'>";
													insert_table = insert_table + "<td><img width='150' class='he_screenshot_preview' src='" + saved_data[i]['screenshot'] + "' /></td>";
													insert_table = insert_table + "<td class='he_heuristic_column'>" + saved_data[i]['heuristic'] + "</td>";
													insert_table = insert_table + "<td>" + saved_data[i]['severity'] + "</td>";
													insert_table = insert_table + "<td class='he_notes_column'>" + saved_data[i]['notes'] + "</td>";
													insert_table = insert_table + "<td class='he_recommendation_column'>" + saved_data[i]['recommendation'] + "</td>";
													insert_table = insert_table + "<td style='border-top:none;border-right:none;border-bottom:none;'><div style='width:100px;height:1px;background-color:rgba(0,0,0,0);'></div><button class='he_delete_annotation reset' id='"+i+"'>Delete</button></td>";
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

												//localStorage.setItem('saved_data', JSON.stringify(saved_data));
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

									}); //end chrome.local.get callback

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

														//$(document).mousemove(function(event){
															$("body").find("*").not("#add >").not("#add").not(".he_overlay").not('#he_screenshot_preview').each(function(){
																if($(this).css("left") && $(this).css("position") == "fixed" && $(this).attr("data-omglol") == "pushed"){
																	var left_css = parseInt($(this).css("left").replace(/[^-\d\.]/g, ''));
																	var new_left_css = (left_css-400)+"px";
																	$(this).css("left", new_left_css);
																	$(this).attr("data-omglol","pushed_back");
																}
															});
														//});




													chrome.runtime.sendMessage({greeting: "stop_evaluation", html: docx_html}, function(response) {

													});
													
													chrome.storage.local.set({'saved_data': null});

													



												});	
								
						      	} 
							});
					}
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







