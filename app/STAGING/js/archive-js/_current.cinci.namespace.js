/*!FOUNDATION cinci.namespace.js */
/*
====================================================================
 Blackbaud ISD Custom Javascript
--------------------------------------------------------------------
 Client: University of Cincinnati
 Author(s): J. Schultz
 Product(s): BBIS
 Created: 2/9/2015
 Updated: 7/29/2015 (by Nick Fogle)
 Environment: STAGING
--------------------------------------------------------------------
 Changelog:
====================================================================
 07/23/2015  Nick Fogle - Updated Alumni site root path for API calls
 07/29/2015  Nick Fogle - Refactored Plugin Functions
 11/08/2019 Greg Vissing - Launched website with new design
 11/27/2019 Greg Vissing - Launched redesign giving page(Methods added: populateAreasToSupportFields)
 01/28/2020 Greg Vissing - Separate Advanced Custom Fields methods from rest of site
====================================================================
*/
/*
===================================================
 PLUGINS
---------------------------------------------------
 Additional plugins can be found on DropBox, under:
 Design Team > Javascript > Plugins
---------------------------------------------------
*/
// Insert plugins here...
(function ($) {
	$.fn.rssfeed = function (url, options, fn) {
		// plugin defaults
		var defaults = {
			ssl: false,
			limit: 10,
			showerror: true,
			errormsg: "",
			date: true,
			dateformat: "default",
			titletag: "h4",
			content: true,
			snippet: true,
			snippetlimit: 120,
			linktarget: "_self",
		};
		// extend options
		var options = $.extend(defaults, options);
		// return functions
		return this.each(function (i, e) {
			var s = "";
			// Check for SSL protocol
			if (options.ssl) {
				s = "s";
			}
			// add class to container
			if (!$(e).hasClass("rssFeed")) {
				$(e).addClass("rssFeed");
			}
			// check for valid url
			if (url === null) {
				return false;
			}
			// create yql query
			var query =
				"http" +
				s +
				"://query.yahooapis.com/v1/public/yql?q=" +
				encodeURIComponent(
					'select * from feed where url="' + url + '"'
				);
			if (options.limit !== null) {
				query += " limit " + options.limit;
			}
			query += "&format=json";
			// send request
			$.getJSON(query, function (data, status, errorThrown) {
				// if successful... *
				if (status === "success") {
					// * run function to create html result
					process(e, data, options);
					// * optional callback function
					if ($.isFunction(fn)) {
						fn.call(this, $(e));
					}
					// if there's an error... *
				} else if (status === "error" || status === "parsererror") {
					// if showerror option is true... *
					if (options.showerror) {
						// variable scoping (error)
						var msg;
						// if errormsg option is not empty... *
						if (options.errormsg !== "") {
							// * assign custom error message
							msg = options.errormsg;
							// if errormsg option is empty... *
						} else {
							// * assign default error message
							msg = errorThrown;
						}
						// * display error message
						$(e).html(
							'<div class="rssError"><p>' + msg + "</p></div>"
						);
						// if showerror option is false... *
					} else {
						// * abort
						return false;
					}
				}
			});
		});
	};
	// create html result
	var process = function (e, data, options) {
		// Get JSON feed data
		var entries = data.query.results.item;
		// abort if no entries exist
		if (!entries) {
			return false;
		}
		// html variables
		var html = "";
		var htmlObject;
		// for each entry... *
		$.each(entries, function (i) {
			// * assign entry variable
			var entry = entries[i];
			var months = [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December",
			];
			var pubDate;
			var titlelink = entry.title.replace(/[^\w\s]/gi, "");
			var categoryClasses =
				" " +
				entry.categories
				.toString()
				.replace(/ &amp; /g, " ")
				.replace(/ /g, "-")
				.replace(/,/g, " ");
			// if date option is true... *
			if (entry.pubDate) {
				// * create date object
				var entryDate = new Date(entry.pubDate);
				// * select date format
				if (options.dateformat === "default") {
					pubDate =
						(entryDate.getMonth() + 1).toString() +
						"/" +
						entryDate.getDate().toString() +
						"/" +
						entryDate.getFullYear();
				} else if (options.dateformat === "spellmonth") {
					pubDate =
						months[entryDate.getMonth()] +
						" " +
						entryDate.getDate().toString() +
						", " +
						entryDate.getFullYear();
				} else if (options.dateformat === "localedate") {
					pubDate = entryDate.toLocaleDateString();
				} else if (options.dateformat === "localedatetime") {
					pubDate =
						entryDate.toLocaleDateString() +
						" " +
						entryDate.toLocaleTimeString();
				}
			}
			// * build entry
			html +=
				'<div class="storyTileOuterWrapper"><div class="storyTileInnerWrapper" data-tag="' +
				tags +
				'">';
			html +=
				'<div class="storyTileTextWrapper"><div class="storyTileTitle"><' +
				options.titletag +
				'><a href="' +
				entry.link +
				'" title="View this feed at ' +
				entries.title +
				'">' +
				entry.title +
				"</a></" +
				options.titletag +
				">";
			if (options.date && pubDate) {
				html += '<div class="storyTileDate">' + pubDate + "</div>";
			}
			// if content option is true... *
			if (options.content) {
				var content = entry.description;
				html +=
					'<div class="storyTileDescription">' + content + "</div>";
			}
			html += "</div>";
		});
		// provisional html result
		htmlObject = $(html);
		htmlObject.find(".storyTileInnerWrapper").each(function () {
			$(this).prepend('<div class="storyTileImage">');
			$(this)
				.find(".storyTileImage")
				.prepend(
					$(this)
					.find("img")
					.first()
				);
		});
		$(e).append(htmlObject);
		// Apply target to links
		$("a", e).attr("target", options.linktarget);
	};
})(jQuery);
var BBI = BBI || {
	Config: {
		version: 1.0,
		updated: "12/22/2015 4:30 PM",
		isEditView: !!window.location.href.match("pagedesign"),
		slideshowRan: false,
	},
	Defaults: {
		// we have to remove alumni from rootpath, otherwise it won't hit the API Endpoint
		rootpath: (function () {
			var str = BLACKBAUD.api.pageInformation.rootPath;
			var shortString = str.substring(0, str.lastIndexOf("alumni"));
			return shortString;
		})(),
		pageId: BLACKBAUD.api.pageInformation.pageId,
		// this should be set to the GUID of the desingation query for the ADF
		// designationQueryId: "2191ed19-82c5-4941-ad15-39598e90d66d",
		// this should be set the GUID of the designation query that returns highlighted areas
		highlightedFundsQueryId: (function () {
			if (
				BLACKBAUD.api.pageInformation.rootPath ===
				"https://www.alumni.uc.edu/"
			) {
				return "bcafe634-adaa-4b72-b79d-ed16fc18bc8f";
			} else {
				return "c22e7fbb-abcb-4aed-acb2-b18f8639f77e";
			}
		})(),
		// the funds to be included in the cascading dropdown
		cascadingFundsQueryId: (function () {
			if (
				BLACKBAUD.api.pageInformation.rootPath ===
				"https://www.alumni.uc.edu/"
			) {
				return "d54d11f0-3f9c-4d63-91a8-fecf1f06944c";
			} else {
				return "dcb9afbd-8cc0-4dc5-990f-24716779c18d";
			}
		})(),
		// the funds to be included in the cascading dropdown
		advancedDonationFormFundsQueryId: (function () {
			if (
				BLACKBAUD.api.pageInformation.rootPath ===
				"https://www.alumni.uc.edu/"
			) {
				return "d54d11f0-3f9c-4d63-91a8-fecf1f06944c";
			} else {
				return "3907f7fa-afdf-478f-98ee-1e326c23368f";
			}
		})(),
		guidQueryID: (function () {
			if (
				BLACKBAUD.api.pageInformation.rootPath ===
				"https://www.alumni.uc.edu/"
			) {
				return "d54d11f0-3f9c-4d63-91a8-fecf1f06944c";
			} else {
				return "3907f7fa-afdf-478f-98ee-1e326c23368f";
			}
		})(),
		// this should be set to the GUID of the Fund that greatest need gifts are applied to
		greatestNeedFund: (function () {
			if (
				BLACKBAUD.api.pageInformation.rootPath ===
				"https://www.alumni.uc.edu/"
			) {
				return "898c3603-1440-4b38-9145-19d79effeb2c";
			} else {
				return "7318410e-17bd-4d1f-8437-d5742754a93a";
			}
		})(),
		// this should be set to the GUID of the pledge fund
		pledgeFund: (function () {
			if (
				BLACKBAUD.api.pageInformation.rootPath ===
				"https://www.alumni.uc.edu/"
			) {
				return "c21f1095-b071-4107-8942-0f1af860ea97";
			} else {
				return "6f0e4d60-1df1-495a-9e01-82b3e9d91aff";
			}
		})(),
		// this should be set to the GUID of the Fund that free text gifts are applied to
		generalFreeFormFund: (function () {
			if (
				BLACKBAUD.api.pageInformation.rootPath ===
				"https://www.alumni.uc.edu/"
			) {
				return "c21f1095-b071-4107-8942-0f1af860ea97";
			} else {
				return "6f0e4d60-1df1-495a-9e01-82b3e9d91aff";
			}
		})(),
		// GUID for membership fund
		// membershipFundId: "bcf8cd1a-0a22-4f2f-bd14-8040a272d6ed",
		// this should be set to the GUID of the Merchant account (unused - payment part)
		// MerchantAccountId: "864426b2-20a0-43aa-95f6-c850d757b026",
		newsFeedUrl: "https://foundation.uc.edu/feed.rss?id=1",
		customADFAttributes: {
			"Tribute Gift Type": "7b877e86-532a-4851-a1b1-7cd777fd08ec",
			"Honoree Name": "6337f9a2-c611-47f9-a81c-bcb01f457467",
			"Acknowledgee Title": "446bf4a6-e365-468d-bad0-37ce30b0e188",
			"Acknowledgee First Name": "91ca3e25-5831-40fe-9b7a-957f9608b8dd",
			"Acknowledgee Last Name": "3a7e79d5-f5f7-4fd8-8031-77f56b08b255",
			"Acknowledgee Address": "16a044a1-2171-4d1d-8029-48d4cba9f5dc",
			"Acknowledgee City": "f2a00e58-4d26-4c5f-a3c2-9403eb50bd18",
			"Acknowledgee State": "44b0f3c0-c4d6-4343-8355-943fb4703990",
			"Acknowledgee Zip": "f20b1f0b-14a1-40fe-94a6-1c6362db1d17",
			"Acknowledgee Country": "cca52f5c-97eb-4a5d-b3ac-4d7ed9b036a4",
			"Acknowledgee Phone": "030061fe-6a62-4e4d-8129-bc0b60f1ea00",
			"Acknowledgee Email": "93973031-17fc-49d2-a676-70544930a874",
			"UC Graduation Year": "b603114f-2669-400e-a870-186f9b923e08",
			"UC Graduation Degree": "64f2b303-e27a-419c-820f-676674b3004e",
			"Joint Spouse Name": "3a49afdd-9180-40a7-9c31-03ed83736388",
			"Matching Gift Company": "cce2f315-6ba7-4713-891b-5b2c4b422cc6",
			"Pledge ID": "01d9e45d-533f-4759-ba10-07fd687a202c",
		},
		monthNames: [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		],
		titleTable: "456ffd4c-0fbf-49db-a503-0726f86e2a39",
	},
	Methods: {
		pageInit: function () {
			//All functions which should run instantly
			BBI.Methods.menuToggles();
			// Check to see if ADF
			if ($(".BBDonationApiContainer").length !== 0) {
				BBI.Methods.initADF();
			}
			//Style fixes in admin view
			if (BBI.Config.isEditView) {
				$("#mockup").addClass("edit-mode");
				$("body").addClass("admin-mode");
				BBI.Methods.adminStyleFixes();
			} else {
				BBI.Methods.headerScripts();
				BBI.Methods.checkForIE();
				BBI.Methods.scrollToTop();
				// BBI.Methods.initADF();
				BBI.Methods.searchScripts();
				BBI.Methods.mobileScripts();
				BBI.Methods.footerScripts();
				BBI.Methods.createMenuSVG();
				BBI.Methods.initAccordions();
				BBI.Methods.newsAndCalendarFeed();
				BBI.Methods.designationSearchFormat();
				BBI.Methods.initEventWrapper();
				BBI.Methods.designationSearchBoxes();
				BBI.Methods.replaceBoxgridTables();
				BBI.Methods.donationAmount();
				BBI.Methods.coerStyles();
				BBI.Methods.initMobileHeader();
				BBI.Methods.mobileSubMenu();
				BBI.Methods.datePicker();
				// NEW DONATION FORM
				BBI.Methods.customSingleDonationForm.tbodyClasses();
				BBI.Methods.customSingleDonationForm.stepOneGivingDetails.fundDesignationOption();
				BBI.Methods.customSingleDonationForm.stepOneGivingDetails.clickHiddenAmount();
				BBI.Methods.customSingleDonationForm.stepOneGivingDetails.donationAmount();
				BBI.Methods.customSingleDonationForm.stepTwoDonorInfo.billingTitleList();
				BBI.Methods.customSingleDonationForm.stepTwoDonorInfo.billingName();
				BBI.Methods.customSingleDonationForm.stepTwoDonorInfo.billingAddress();
				BBI.Methods.customSingleDonationForm.stepTwoDonorInfo.billingCity();
				BBI.Methods.customSingleDonationForm.stepTwoDonorInfo.billingCountryList();
				BBI.Methods.customSingleDonationForm.stepTwoDonorInfo.billingStateList();
				BBI.Methods.customSingleDonationForm.stepTwoDonorInfo.billingZip();
				BBI.Methods.customSingleDonationForm.stepTwoDonorInfo.billingPhone();
				BBI.Methods.customSingleDonationForm.stepTwoDonorInfo.billingEmail();
				BBI.Methods.customSingleDonationForm.stepThreePaymentInfo.autoFillExtraction();
				BBI.Methods.customSingleDonationForm.stepThreePaymentInfo.hiddenDataPersistence();
				BBI.Methods.customSingleDonationForm.stepThreePaymentInfo.cardholder();
				BBI.Methods.customSingleDonationForm.stepThreePaymentInfo.cardNumber();
				BBI.Methods.customSingleDonationForm.stepThreePaymentInfo.cardExp();
				BBI.Methods.customSingleDonationForm.stepThreePaymentInfo.cardCSC();
				BBI.Methods.customSingleDonationForm.stepThreePaymentInfo.submitButton();
				BBI.Methods.customSingleDonationForm.stepToggles();
				BBI.Methods.customSingleDonationForm.hiddenFormValidation();
				$("iframe[id*= twitter]").css("display", "inline-block");
			}
			//end instant functions
			//Runs on partial page refresh
			Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(
				function () {
					BBI.Methods.pageRefresh();
					BBI.Methods.customSingleDonationForm.stepTwoDonorInfo.billingCountryList();
					BBI.Methods.customSingleDonationForm.stepTwoDonorInfo.billingStateList();
				}
			);
			//Runs on full page
			$(document).ready(function () {
				BBI.Methods.pageLoad();
			});
		},
		pageRefresh: function () {
			// Runs on partial page refresh
			BBI.Methods.coerStyles();
			BBI.Methods.customSingleDonationForm.stepTwoDonorInfo.billingCountryList();
			BBI.Methods.customSingleDonationForm.stepTwoDonorInfo.billingStateList();
			// Keep Sidebar open for Postbacks on Mobile
			if (
				$(".mobileCanvas.show-for-small:visible").length &&
				$("tbody[id$=tbdForgotPWDUserName]").length
			) {
				$(".leftCanvas").toggleClass(
					"expanded",
					1000,
					"easeInOutQuart"
				);
				$(".rightCanvas").toggleClass(
					"retracted",
					1000,
					"easeInOutQuart"
				);
			}
			// Hide New User Prompt if Already Signed In
			if (
				$(".mobileCanvas.show-for-small:visible").length &&
				$("input[id$=btnLogout]").length
			) {
				$(".mobileCanvas .offcanvasReg").hide();
			}
		},
		pageLoad: function () {
			// Runs on full page load
			// if (!BBI.Config.isEditView) {
			// 	this.foundationMediaOverlay();
			// }
			//add search placeholder
			$('#ucBand input[id*="_txtQuickSearch"]').attr(
				"placeholder",
				"Search UC"
			);
			$(".mobileCanvas .QuickSearchTextbox").prop(
				"placeholder",
				"Search UC Foundation"
			);
			// payment part 2.0 functions
			if ($(".PaymentPart_FormContainer").length > 0) {
				// remove payment part links
				$(".PaymentPart_CartCell.PaymentPart_CartDescriptionCell > a")
					.contents()
					.unwrap()
					.wrap("<span></span>");
				//$(".PaymentPart_CartItemDetails:has('div')").prevAll().hide();
				// change "Other" designation text
				if (
					$('.wrapButtons a:contains("Make Another Gift")').length ===
					0
				) {
					var des = $(
						".PaymentPart_CartCell.PaymentPart_CartDescriptionCell"
					).find('span:contains("Other")');
					if (des.length !== 0) {
						$(des).text("Pledge Payment");
					}
				}
			}
		},
		headerScripts: function () {
			/* HEAD SCRIPTS: Disable uneeded stylesheets */
			$('link[href*="stylesheet4"], link[href*="stylesheet5"], link[href*="stylesheet6"], link[href*="stylesheet7"], link[href*="stylesheet13"], link[href*="stylesheet17"]').prop('disabled', true);
			$('link[href*="stylesheet4"], link[href*="stylesheet5"], link[href*="stylesheet6"], link[href*="stylesheet7"], link[href*="stylesheet13"], link[href*="stylesheet17"]').remove();

			/* HEADER SCRIPTS */
			var searchSvg = '<svg class="searchIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 43.14 49.94"><g><path class="cls-1" d="M24.46,0A21.88,21.88,0,0,1,37.87,4.66c3.72,3,5.76,6.73,5.17,11.66a24.31,24.31,0,0,0,0,4.18c.24,4.74-1.9,8.31-5.54,11.05-5,3.75-10.68,4.84-16.77,4.3a15.07,15.07,0,0,1-3.41-.62c-1.12-.37-1.59,0-2.13,1-2.21,3.87-4.5,7.7-6.79,11.53a4.37,4.37,0,0,1-4.69,2.15A4.46,4.46,0,0,1,.09,46.3a4.78,4.78,0,0,1,.73-3.54C3.06,39,5.26,35.21,7.53,31.46a1.15,1.15,0,0,0-.19-1.71,11.19,11.19,0,0,1-3.55-7.86A68.13,68.13,0,0,1,4,13.08c.5-4.4,3.26-7.41,6.89-9.68C14.74,1,19,0,24.46,0Zm-2,25.8c6.28,0,11-1.67,14.18-4.63,4-3.74,4.14-9,.26-12.87A17.26,17.26,0,0,0,26.27,3.56C21,3,16,3.81,11.59,7c-5.7,4.13-5.82,10.62-.29,15A18.58,18.58,0,0,0,22.45,25.8Zm-4.53,6.05a.58.58,0,0,0,.22.12c6.27,1.39,12.17.65,17.45-3.22a9.58,9.58,0,0,0,3.76-5.42C33.09,28.81,25.9,30,18.24,28.74ZM15,29.78c-.29-.32-.61-.92-.89-.9a2,2,0,0,0-1.4.71c-3,4.91-5.88,9.85-8.81,14.78-.41.7-.72,1.45.14,2s1.35-.17,1.76-.85l8.64-14.6C14.65,30.6,14.79,30.27,15,29.78Zm-4-3.78L7.53,23.26l-.29.2,2.37,4.09Z"/></g></svg>';

			$("header ul.nav").wrap("<nav></nav>");
			$("header ul.nav > li > a").wrapInner("<span></span>");

			$("ul.nav li.search a").prepend(searchSvg);

			function headerHeight(element) {
				var headerHeightValue = element.outerHeight();
				console.log("checked height");
				return headerHeightValue;
			};

			$("#content").css("margin-top", headerHeight($("header")) + "px");

			if ($(document).scrollTop() > 300) {
				$("header").addClass("reduced");
				$(".scrollToTop").fadeIn();
			}

			$(document).on('scroll', function () {
				if ($(document).scrollTop() > 200) {
					$('.scrollToTop').fadeIn('slow');
					$('header').addClass('reduced');
					$('button.hamburger').addClass('reduced');
					//$("#content").css("margin-top", headerHeight($("header")) + "px");
				} else {
					$('.scrollToTop').fadeOut('slow');
					$('header').removeClass('reduced');
					$('button.hamburger').removeClass('reduced');
					//$("#content").css("margin-top", headerHeight($("header")) + "px");
				}
			});

			$(document).ready(function () {

				var trigger = $('.hamburger'),
					overlay = $('.overlay'),
					nav = $('ul.nav.navbar-nav'),
					expandToggle = $('ul.nav > li > a > span'),
					isClosed = false;

				trigger.click(function () {
					hamburger_cross();
				});

				expandToggle.click(function (event) {
					event.preventDefault();
					$(this).find('i').toggleClass('rotate');
					$(this).parent().toggleClass('open');

					$(this).parent('a').next('.nccUlMenuSub1').slideToggle();
				});

				function hamburger_cross() {
					if (isClosed == true) {
						overlay.hide();
						trigger.removeClass('is-open');
						trigger.addClass('is-closed');
						isClosed = false;
						nav.removeClass('slideOut');
						$('body').toggleClass('no-scroll');
					} else {
						overlay.show();
						trigger.removeClass('is-closed');
						trigger.addClass('is-open');
						isClosed = true;
						nav.addClass('slideOut');
						$('body').toggleClass('no-scroll');
					}
				}

				$('[data-toggle="offcanvas"]').click(function () {
					$('#wrapper').toggleClass('toggled');
				});

			});
		},
		checkForIE: function () {
			console.log("IE checked!");
			// Get IE or Edge browser version
			var version = detectIE();
			if (version === false) {
				// do nothing
			} else if (version <= 11) {
				$("body").addClass("IE");
			} else {}
			// add details to debug result
			// document.getElementById('details').innerHTML = window.navigator.userAgent;
			/**
			 * detect IE
			 * returns version of IE or false, if browser is not Internet Explorer
			 */
			function detectIE() {
				var ua = window.navigator.userAgent;
				// Test values; Uncomment to check result ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¦
				// IE 10
				// ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
				// IE 11
				// ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
				// Edge 12 (Spartan)
				// ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';
				// Edge 13
				// ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';
				var msie = ua.indexOf("MSIE ");
				if (msie > 0) {
					// IE 10 or older => return version number
					return parseInt(
						ua.substring(msie + 5, ua.indexOf(".", msie)),
						10
					);
				}
				var trident = ua.indexOf("Trident/");
				if (trident > 0) {
					// IE 11 => return version number
					var rv = ua.indexOf("rv:");
					return parseInt(
						ua.substring(rv + 3, ua.indexOf(".", rv)),
						10
					);
				}
				var edge = ua.indexOf("Edge/");
				if (edge > 0) {
					// Edge (IE 12+) => return version number
					return parseInt(
						ua.substring(edge + 5, ua.indexOf(".", edge)),
						10
					);
				}
				// other browser
				return false;
			}
			console.log("IE check done!");
		},
		scrollToTop: function () {
			/* ==========================================================================
						scrollTop

				Options
				var maxWidth = 767
					========================================================================== */
			var maxWidth = 10000,
				minWidth = 0,
				scrollTrigger = 100,
				scrollButton = $("#scrollTop"),
				alwaysVisible = false,
				scrollTriggered = false,
				widthTriggered = false;
			/* ==========================================================================
			  Events
			  ========================================================================== */
			$(window).resize(function () {
				if ($(window).width() >= maxWidth && !widthTriggered) {
					widthTriggered = true;
					toggleDisplay();
				} else if ($(window).width() < maxWidth && widthTriggered) {
					widthTriggered = false;
					toggleDisplay();
				}
			});
			$(window).scroll(function () {
				if (
					$(window).scrollTop() >= scrollTrigger &&
					!scrollTriggered
				) {
					scrollTriggered = true;
					toggleDisplay();
				} else if (
					$(window).scrollTop() < scrollTrigger &&
					scrollTriggered
				) {
					scrollTriggered = false;
					toggleDisplay();
				}
			});
			scrollButton.on("click", function () {
				// Boolean to prevent double execution of the complete-property
				var scrollDone = false,
					button = $(this);
				// CSS class for active state
				button.addClass("active");
				$("html, body").animate({
					scrollTop: "0",
				}, {
					duration: 800,
					complete: function () {
						if (!scrollDone) {
							scrollDone = true;
							button.removeClass("active");
						}
					},
				});
			});
			/* ==========================================================================
			  Functions
			  ========================================================================== */
			function toggleDisplay() {
				if (
					$(window).width() < maxWidth &&
					$(window).width() > minWidth &&
					!alwaysVisible &&
					scrollTriggered &&
					!widthTriggered
				) {
					// If a correct maxWidth and minWidth is set
					scrollButton.fadeIn();
					// console.log(1);
				} else if (!maxWidth || minWidth >= maxWidth || alwaysVisible) {
					// If values are wrong or alwaysVisible is true
					scrollButton.fadeIn();
					// console.log(2);
				} else {
					// If no matches are found
					scrollButton.fadeOut();
					// console.log(3);
				}
			}
		},
		createMenuSVG: function () {
			$(".alumni #mainMenu .mainMenu .nccUlMenuSub2").each(function () {
				var height = $(this).height();
				var width = Math.floor(height / 10);
				$(this).append(
					'<svg viewbox="0 0 ' +
					width +
					" " +
					height +
					'" height="' +
					height +
					'" width="' +
					width +
					'" style="position:absolute; top: 0; right: -' +
					(width - 1) +
					'px" ><polygon points="0,0 0,' +
					height +
					" " +
					width +
					',0" style="fill:#de1c24;" /></svg>'
				);
			});
		},
		initAccordions: function () {
			if ($("table.accordionTable").length > 0) {
				$("table.accordionTable").each(function () {
					$(this).replaceWith(
						$(this)
						.html()
						.replace(
							/<tbody/gi,
							"<div class='accordionWrapper'"
						)
						.replace(/<td/gi, "<div")
						.replace(/<\/td>/gi, "</div>")
						.replace(/<\/tbody/gi, "</div")
					);
				});
				$(".accordionWrapper").each(function () {
					$(this)
						.find(".headerRow")
						.on("click", function () {
							$(this)
								.parent()
								.find(".contentRow")
								.slideToggle(300);
							$(this)
								.parent()
								.find(".headerRow")
								.toggleClass("active");
						});
				});
			}
		},
		coerStyles: function () {
			if ($("#status-table").length !== 0) {
				$("#status-table").addClass("clearfix");
				$('span[id*="rptAttendeesDetails"]')
					.not('[style], [id*="udpAttendees"]')
					.parent("td, div.cell")
					.addClass("labelTd");
				$('[id*="udpAttendees"]')
					.parent("td, div.cell")
					.addClass("mainTd");
				if ($(".mainTd").length > 1) {
					$(".mainTd").css("width", "50%");
					$(".mainTd")
						.last()
						.css("border-left", "1px solid #CCC")
						.css("padding-left", "10px");
					$("#divWizardButtons").css("max-width", "100%");
				}
			}
		},
		donationAmount: function () {
			var amountValue = BLACKBAUD.api.querystring.getQueryStringValue(
				"amount"
			);
			if (
				amountValue.length !== 0 &&
				$('.DonationFormTable input[id$="txtAmount"]').length !== 0
			) {
				$('.DonationFormTable input[id$="txtAmount"]').val(amountValue);
			} else if (
				amountValue.length !== 0 &&
				$('#advancedDonationForm input[id$="txtAmount"]').length !== 0
			) {
				$('.DonationFormTable input[id$="txtAmount"]').val(amountValue);
				$(".amountButton .selected").removeClass("selected");
				$("#adfOtherLabel").hide();
				$("#txtAmount")
					.show()
					.val(amountValue);
				var recurrTotal = $("#recurringTotal span").text();
				$(".adfTotalAmount span").html(recurrTotal);
				//$('.adfTotalAmount span').text(amountValue);
			}
		},
		replaceBoxgridTables: function () {
			// Replace HTML tables with DIVs - landing page box grid elements
			if ($(".boxGridTable").length > 0) {
				$("table.boxGridTable").each(function () {
					$(this).replaceWith(
						$(this)
						.html()
						.replace(/<tbody/gi, "<div class='boxGrid'")
						.replace(/<tr/gi, "<div class='gutter clearfix'")
						.replace(/<td/gi, "<div")
						.replace(/<\/th>/gi, "</div>")
						.replace(/<\/td>/gi, "</div>")
						.replace(/<\/tbody/gi, "</div")
					);
				});
				$(".boxGrid").wrapAll('<div id="boxGridWrapper" />');
				$("#boxGridWrapper").wrapInner(
					'<div class="gutter clearfix" />'
				);
			}
			if ($(".boxGrid").length !== 0) {
				$(".boxGrid").hover(
					function () {
						$(".boxGridCaption", this)
							.stop()
							.animate({
								opacity: "0",
							}, {
								duration: 300,
							}, {
								queue: "false",
							});
						$(".boxGridReveal", this)
							.stop()
							.animate({
								bottom: "0",
							}, {
								opacity: "1",
							}, {
								duration: 300,
							}, {
								queue: "false",
							});
					},
					function () {
						$(".boxGridCaption", this)
							.stop()
							.animate({
								opacity: "1",
							}, {
								duration: 300,
							}, {
								queue: "false",
							});
						$(".boxGridReveal", this)
							.stop()
							.animate({
								bottom: "-100%",
							}, {
								opacity: "0",
							}, {
								duration: 300,
							}, {
								queue: "false",
							});
					}
				);
			}
		},
		menuToggles: function () {
			$(".leftCanvas .menuToggle").on("click", function (e) {
				e.preventDefault();
				$("#BodyId").toggleClass("menu-open");
				$(".leftCanvas").toggleClass("expanded");
				$(".rightCanvas").toggleClass("retracted");
				setTimeout(
					function () {
						$("#mobileLogo").toggleClass("expanded");
					},
					$("#mobileLogo").hasClass("expanded") ? 600 : 0
				);
			});
			$(".rightCanvas .menuToggle").on("click", function (e) {
				e.preventDefault();
				$("#BodyId").toggleClass("menu-open");
				$(".fa").toggleClass("fa-bars fa-close");
				$(this).toggleClass("open");
				$(".rightCanvas").toggleClass("expanded");
				$(".leftCanvas").toggleClass("retracted");
				setTimeout(
					function () {
						$("#mobileLogo").toggleClass("expanded");
					},
					$("#mobileLogo").hasClass("expanded") ? 600 : 0
				);
			});
		},
		designationSearchFormat: function () {
			if ($("span.designationInfoBoxOuter").length !== 0) {
				var desingationItems = $("span.designationInfoBoxOuter");
				for (var i = 0; i < desingationItems.length; i += 3) {
					desingationItems
						.slice(i, i + 3)
						.wrapAll("<div style='clear:both'></div>");
				}
			}
		},
		newsAndCalendarFeed: function () {
			if ($(".eventTileOuterWrapper").length !== 0) {
				$(".eventTileOuterWrapper").each(function () {
					var eventDate = new Date(
						$.trim(
							$(this)
							.find(".eventDateData")
							.text()
						)
					);
					$(this).insertBefore(
						$(this).closest(".BBDesignationSearchResultContainer")
					);
					$(this)
						.find(".eventTileMonth")
						.text(BBI.Defaults.monthNames[eventDate.getMonth()]);
					$(this)
						.find(".eventTileDay")
						.text(eventDate.getDate());
					if (
						$.trim(
							$(this)
							.find(".eventUrlData")
							.text()
						) !== ""
					) {
						$(this)
							.find(".eventTileLink > a")
							.attr(
								"href",
								$.trim(
									$(this)
									.find(".eventUrlData")
									.text()
								)
							);
					} else {
						$(this)
							.find(".eventTileLink")
							.hide();
					}
				});
				if ($(".internalLanding").length !== 0) {
					$(".eventTileOuterWrapper")
						.first()
						.parent()
						.rssfeed(BBI.Defaults.newsFeedUrl, {
							limit: 6,
							ssl: true,
							snippet: false,
							titletag: "h3",
							header: false,
						});
				}
			}
			if ($(".landingPage .newsTileOuterWrapper").length !== 0) {
				$(".newsTileOuterWrapper")
					.html("")
					.rssfeed(BBI.Defaults.newsFeedUrl, {
						limit: 4,
						ssl: true,
						snippet: false,
						titletag: "h3",
						header: false,
					});
			}
			if ($("#homePage").not(".foundation").length !== 0) {
				$("#mainContentWrapper .primaryContent").rssfeed(
					BBI.Defaults.newsFeedUrl, {
						limit: 6,
						ssl: true,
						snippet: false,
						titletag: "h3",
						header: false,
					}
				);
			}
			if ($(".contentPaneHeader .allEventsButton").length !== 0) {
				$(".allEventsButton[data-control]").on("click", function (e) {
					var controlSet = $(this).attr("data-control");
					var newsItems = $(".storyTileOuterWrapper");
					var eventItems = $(".eventTileOuterWrapper");
					var button = $(this).not("selected");
					e.preventDefault();
					if (button.length !== 0) {
						$(".contentPaneHeader .selected").removeClass(
							"selected"
						);
						$(this).addClass("selected");
						if (controlSet === "news") {
							newsItems.not("visible").show("slide", "slow");
							eventItems.not("visible").hide("slide", "slow");
						} else if (controlSet === "events") {
							eventItems.not("visible").show("slide", "slow");
							newsItems.not("visible").hide("slide", "slow");
						} else {
							newsItems
								.add(eventItems)
								.not("visible")
								.show("slide", "slow");
						}
					}
				});
			}
			if ($(".eventSlider").length !== 0) {
				$(".sliderContent").each(function () {
					var lineItem = $("<li>");
					$(this)
						.find(".red a")
						.attr("href", $(this).text())
						.text("Register");
					$(this)
						.find(".outline a")
						.attr("href", $(this).text())
						.text("More Info");
					lineItem.append($(this));
					$(".eventSlider").append(lineItem);
				});
				$(document).ready(function () {
					if ($(window).width() <= 768) {
						$(".eventSlider").bxSlider({
							minSlides: 1,
							maxSlides: 1,
							slideWidth: $("#newsWrapper .inner").width(),
							pager: true,
							controls: false,
						});
					} else {
						$(".eventSlider").bxSlider({
							minSlides: 3,
							maxSlides: 3,
							slideWidth: $("#newsWrapper .inner").width() / 3 - 44,
							slideMargin: 33,
							pager: false,
						});
					}
				});
			}
			$(document).ready(function () {
				if ($(".storySlider").length !== 0) {
					if ($(window).width() <= 768) {
						$(".storySlider").bxSlider({
							minSlides: 1,
							maxSlides: 1,
							slideWidth: $("#storiesWrapper .inner").width(),
							controls: false,
						});
					} else {
						$(".storySlider").bxSlider({
							minSlides: 1,
							maxSlides: 1,
							slideWidth: $("#storiesWrapper .inner").width(),
							pager: false,
						});
					}
				}
			});
			if (
				$(
					".BBDesignationSearchResultContainer .foundationCalendarGridItem"
				).length !== 0
			) {
				var calendarItems = $(".foundationCalendarGridItem").closest(
					".BBDesignationSearchResult"
				);
				for (var i = 0; i < calendarItems.length; i += 2) {
					calendarItems
						.slice(i, i + 2)
						.wrapAll(
							"<div class='foundationCalendarColumn'></div>"
						);
				}
				BBI.Methods.getImagesFromFolder(
					"Event Tile Images",
					BBI.Methods.foundationGridImages
				);
			}
		},
		getImagesFromFolder: function (folderPath, callback) {
			var jsonPath =
				BLACKBAUD.api.pageInformation.rootPath +
				"WebApi/Images/" +
				folderPath;
			$.getJSON(jsonPath, function (data) {
				callback(data);
			});
		},
		foundationGridImages: function (imageArray) {
			var imagePos = 0;
			var targets = $(".foundationCalendarGridImage:visible img");
			targets.each(function () {
				$(this).attr("src", imageArray[imagePos].Url);
				imagePos++;
			});
		},
		initEventWrapper: function () {
			if ($(".eventWrapper").length !== 0) {
				var monthNames = [
					"Jan",
					"Feb",
					"Mar",
					"Apr",
					"May",
					"Jun",
					"Jul",
					"Aug",
					"Sep",
					"Oct",
					"Nov",
					"Dec",
				];
				$(".eventWrapper").each(function () {
					var dateString = $(this)
						.find(".hiddenDataFields")
						.text();
					var eventDate = new Date(dateString);
					var monthName = monthNames[eventDate.getMonth()];
					var yearString = eventDate
						.getFullYear()
						.toString()
						.substring(2);
					if (eventDate.getDate() === 1) {
						$(this)
							.find("sup")
							.text("st");
					} else if (eventDate.getDate() === 2) {
						$(this)
							.find("sup")
							.text("nd");
					} else if (eventDate.getDate() === 3) {
						$(this)
							.find("sup")
							.text("rd");
					}
					$(this)
						.find(".hiddenDataFields")
						.hide();
					$(this)
						.find(".dateItem")
						.text(eventDate.getDate());
					$(this)
						.find("abbr[title]")
						.text(monthName);
					$(this)
						.find(".calYear")
						.html("&rsquo;" + yearString);
				});
			}
		},
		designationSearchBoxes: function () {
			if ($(".designationInfoBox").length != 0) {
				$(".designationInfoBox").each(function () {
					var donationLink = $(this)
						.find("hiddenData a")
						.attr("href");
					var systemID = $(this)
						.find("hiddenData")
						.text();
					$(this)
						.closest(".BBDesignationSearchResult")
						.addClass("designationInfoBoxOuter");
					$(this)
						.find(".designationInfoBoxGiveButton")
						.attr("href", donationLink);
					$(this)
						.find(".designationInfoBoxInfoButton")
						.attr("href", donationLink);
				});
			}
		},
		initADF: function () {
			if ($("#customDonation").length !== 0) {
				console.log("customDonation form!");
				$("#adfSubmitButtonCustom").on("click", function (e) {
					e.preventDefault();
					BBI.Methods.submitCustomADF();
				});
			}
			if ($("#guidForm").length !== 0) {
				console.log("guid form!");
				BBI.Methods.populateGUID();
			}
			if ($("#a11yGivingForm").length !== 0) {
				console.log("a11y giving form!");
				BBI.Methods.populateSelectAreaDropdowns();
			}
			if ($("#linkGeneratorForm").length !== 0) {
				console.log("link generator!");
				BBI.Methods.populateTypeaheadField();
			}
			if ($("#queryService").length !== 0) {
				BBI.Methods.populateQueryServiceFunds();
				BBI.Methods.populateTitle();
				BBI.Methods.initAmountMethod();
				BBI.Methods.initGiftTypeMethod();
				BBI.Methods.initAddlInfoMethod();
				BBI.Methods.initReccurrenceMethod();
				BBI.Methods.initAreaToSupporteMethod();
				// BBI.Methods.initCartMethod();
				$("#adfSubmitButtonQS").on("click", function (e) {
					e.preventDefault();
					BBI.Methods.submitQueryADF();
				});
			}
			if ($("#advancedDonationFormRedesign").length !== 0) {
				//console.log("get ready for redesign!");
				// setTimeout(function () {
				// 	//highlight query param amount
				// 	$('.amountButton a').each(function () {
				// 		var currentButtonText = $(this).html();
				// 		if (currentButtonText.charAt(0) === '$') {
				// 			currentButtonText = currentButtonText.slice(1);
				// 			// console.log("currentButtonText= " + currentButtonText);
				// 		}
				// 		if (BBI.Methods.getUrlVars().amount == currentButtonText) {
				// 			$(this).addClass('selected');
				// 			$('#txtAmount').css('color', 'transparent');
				// 		}
				// 	});
				// }, 300);
				//init the tabs
				BBI.Methods.initAdfTabs();
				// INITIALIZE FORM
				$(
					"button.pledge, .city-state, .ack-city-state, div.toggle, .adfInputWithPlaceholder, .giftDetails, #shoppingCart, div#recurringAmount, div#pledgeAmount, .error-message"
				).hide();
				//date pickers
				//$('#startDate').datepicker();
				$("#endDate").datepicker({
					changeMonth: true,
					changeYear: true,
				});
				//enter default 'greatest need' designation
				$("#designationId").val(BBI.Defaults.greatestNeedFund);
				$(".designationButton")
					.first()
					.find("a")
					.attr("rel", BBI.Defaults.greatestNeedFund);
				//highlight clicked amounts
				$(".amountButton a").on("click", function () {
					//highlight clicked amounts
					$(".miniInputText.currency")
						.removeClass("currency")
						.val("");
					$(".otherAmount i").removeClass("currency");
					$(".validation-icon.amount i")
						.removeClass("fa-times-circle")
						.addClass("fa-check-circle");
					if ($(this).hasClass("selected")) {} else {
						$(".amountButton .selected").removeClass("selected");
						$(this).addClass("selected");
					}
					$("#txtAmount").val($(this).attr("rel"));
					$("#txtAmount").attr("placeholder", "Other Amount");
					$("#adfOtherLabel").show();
					$(".giftAmountError").remove();
					$("#addToCart a.defaultButton").removeClass("not-active");
					//update display
					var amount = $(".amountButton a.selected").attr("rel");
					// Recurring Gift elements
					var recurringDDown = document.getElementById("frequency");
					var frequencyRate = $("#frequency option:selected").val();
					var amountRecurring = $(this).attr("rel");
					var frequencyTimesRate = $("#recurringTotal label span");
					var summaryAmount = $(".recurringSummary .amount");
					if ($(recurringDDown).is(":visible")) {
						//$('#frequency option:selected').text();
						// if (recurringIsVisible === true) {
						// element is Visible
						if (frequencyRate == "2") {
							//$('#recurringTotal label span').html((parseFloat(amountRecurring) * 12));
							//frequencyTimesRate.innerHTML = (parseFloat(amountRecurring) * 12);
						} else if (frequencyRate == "3") {
							//$('#recurringTotal label span').html((parseFloat(amountRecurring) * 4));
							//frequencyTimesRate.innerHTML = (parseFloat(amountRecurring) * 4);
						} else {}
						$(".recurringSummary .amount").html(amountRecurring);
						//summaryAmount.innerHTML = amountRecurring;
						//$('#recurringTotal span').html(amount); // Est. Annual Contribution
						$(".adfTotalAmount span").html(amountRecurring); // Total Gift Commitment
					} else {
						// Recurring Gift element is Hidden
						$(".adfTotalAmount span").html(amount); // Total Gift Commitment
					}
				});
				$("#txtAmount").on("blur keyup", function () {
					//update display
					var textAmt = $(".miniInputText.currency").val();
					if (textAmt) {
						$(".adfTotalAmount span").html($("#txtAmount").val());
						$(".validation-icon.amount i")
							.removeClass("fa-times-circle")
							.addClass("fa-check-circle");
					} else {
						$(".validation-icon.amount i")
							.removeClass("fa-check-circle")
							.addClass("fa-times-circle");
						$(".adfTotalAmount span").html(0);
						$("#recurringTotal span").html(0);
					}
				});
				//reset when manually entering an amount
				$("#adfOtherLabel").on("click", function () {
					$(".amountButton .selected").removeClass("selected");
					$(this).hide();
					$("#txtAmount")
						.show()
						.val("")
						.focus();
					$(".giftAmountError").remove();
				});
				//$('#designationAreaDropdown').on('change', function() {
				//    if ($(this).val() !== '-1') {
				//        $('.adfOtherDesignationSubSection').show('blind','slow');
				//    } else {
				//        $('.adfOtherDesignationSubSection').hide('blind','slow');
				//    }
				//});
				//progressive display toggles
				// $('.checkboxToggle').on('change', function () {
				// 	var targetString = $(this).attr('data-controler');
				// 	var targetContent = $('#' + targetString);
				// 	if ($(this).prop('checked')) {
				// 		targetContent.show('blind', 'slow');
				// 	} else {
				// 		targetContent.hide('blind', 'slow');
				// 	}
				// });
				$(".checkboxToggle").on("change", function () {
					var targetString = $(this).attr("data-controler");
					var targetContent = $("#" + targetString);
					if ($(this).prop("checked")) {
						targetContent.show("blind", "slow");
					} else {
						targetContent.hide("blind", "slow");
					}
				});
				//populate dynamic dropdowns
				BBI.Methods.populateCountryDropdowns();
				BBI.Methods.populateTitle();
				BBI.Methods.populateDesignationIds();
				BBI.Methods.populateCascadingFields();
				//other area text entry.
				$(".otherArea").on("click", function () {
					$("#otherArea").focus();
				});
				$("#otherArea")
					.on("blur", function () {
						$("#designationId").val(
							BBI.Defaults.generalFreeFormFund
						);
					})
					.on("focus", function () {
						$(".designationButton .selected").removeClass(
							"selected"
						);
						$("#fundDesignation1").val("0");
						$("#fundDesignation2")
							.val("0")
							.hide();
					});
				$("#adfSubmitButton").on("click", function (e) {
					e.preventDefault();
					if (BBI.Methods.validateADF()) {
						if ($("#giftListNotEmpty").is(":visible")) {
							// console.log("not empty cart");
							$(this)
								.addClass("disabled")
								.unbind("click");
							BBI.Methods.submitADF();
						} else {
							// console.log("empty cart");
							$(".error-message").fadeOut();
							$(function () {
								$(".error-message")
									.fadeOut()
									.delay(500);
								var items = $(".fa-times-circle");
								var indexVal = 0;
								$.each(items, function (index, item) {
									$(
										"." +
										$(item).attr("name") +
										".error-message"
									).fadeIn();
									// console.log($(item).attr("name"));
									// console.log(index);
									indexVal++;
									//console.log(indexVal);
								});
								if (indexVal > 0) {
									// console.log("don't submit " + indexVal);
								} else {
									if ($("#fundDonationAmount").val() != "") {
										// console.log(
										// 	$("#fundDonationAmount").val() +
										// 		" " +
										// 		$("#fundName").val() +
										// 		" " +
										// 		$("#fundGuid").val()
										// );
										$("#giftListEmpty").slideUp();
										setTimeout(showGift);

										function showGift() {
											var designationField = $(
													"#fundName"
												).val(),
												amountField = $(
													"#fundDonationAmount"
												).val(),
												designationButtonID = $(
													"#fundGuid"
												).val(),
												otherFundName = $(
													"#otherArea"
												).val(),
												otherFundGuid =
												BBI.Defaults.pledgeFund,
												otherDesignationClass = "";
											if (otherFundName !== "") {
												otherDesignationClass =
													"otherDesignation";
												designationButtonID = otherFundGuid;
											} else {
												otherDesignationClass = "";
											}
											var $div = $(
												'<tr class="' +
												otherDesignationClass +
												'"><td class="fund-name"> ' +
												designationField +
												' </td><td class="fund-amount"> $ ' +
												amountField +
												' </td><td class="fund-designation"> ' +
												designationButtonID +
												'</td><td class="fund-delete"> <a href="#" class="remove-gift"> <i class="fa fa-trash-o"> </i></a> </td></tr>'
											);
											$(
												".cart-body #giftListNotEmpty table tbody"
											).append($div);
											$div.css({
												left: "700px",
												opacity: 0,
											});
											$div.animate({
													left: 0,
													opacity: 1,
												},
												500
											);
											$(this)
												.addClass("disabled")
												.unbind("click");
											BBI.Methods.submitADF();
										}
									} else {
										// console.log("cart not empty!");
										$(this)
											.addClass("disabled")
											.unbind("click");
										BBI.Methods.submitADF();
									}
									// console.log("submit " + indexVal);
									// $(this).addClass('disabled').unbind('click');
									// BBI.Methods.submitADF();
								}
							});
						}
						// $(this).addClass('disabled').unbind('click');
						// BBI.Methods.submitADF();
					}
				});
			}
			if ($("#advancedDonationForm").length !== 0) {
				setTimeout(function () {
					//highlight query param amount
					$(".amountButton a").each(function () {
						var currentButtonText = $(this).html();
						if (currentButtonText.charAt(0) === "$") {
							currentButtonText = currentButtonText.slice(1);
							// console.log("currentButtonText= " + currentButtonText);
						}
						if (
							BBI.Methods.getUrlVars().amount == currentButtonText
						) {
							$(this).addClass("selected");
							$("#txtAmount").css("color", "transparent");
						}
					});
				}, 300);
				//init the tabs
				BBI.Methods.initAdfTabs();
				//date pickers
				//$('#startDate').datepicker();
				$("#endDate").datepicker({
					changeMonth: true,
					changeYear: true,
				});
				//enter default 'greatest need' designation
				$("#designationId").val(BBI.Defaults.greatestNeedFund);
				$(".designationButton")
					.first()
					.find("a")
					.attr("rel", BBI.Defaults.greatestNeedFund);
				//highlight clicked amounts
				$(".amountButton a").on("click", function () {
					//highlight clicked amounts
					if ($(this).hasClass("selected")) {} else {
						$(".amountButton .selected").removeClass("selected");
						$(this).addClass("selected");
					}
					$("#txtAmount").val($(this).attr("rel"));
					$("#txtAmount").hide();
					$("#adfOtherLabel").show();
					$(".giftAmountError").remove();
					$("#addToCart a.defaultButton").removeClass("not-active");
					//update display
					var amount = $(".amountButton a.selected").attr("rel");
					// Recurring Gift elements
					var recurringDDown = document.getElementById("frequency");
					var frequencyRate = $("#frequency option:selected").val();
					var amountRecurring = $(this).attr("rel");
					var frequencyTimesRate = $("#recurringTotal label span");
					var summaryAmount = $(".recurringSummary .amount");
					if ($(recurringDDown).is(":visible")) {
						//$('#frequency option:selected').text();
						// if (recurringIsVisible === true) {
						// element is Visible
						if (frequencyRate == "2") {
							//$('#recurringTotal label span').html((parseFloat(amountRecurring) * 12));
							//frequencyTimesRate.innerHTML = (parseFloat(amountRecurring) * 12);
						} else if (frequencyRate == "3") {
							//$('#recurringTotal label span').html((parseFloat(amountRecurring) * 4));
							//frequencyTimesRate.innerHTML = (parseFloat(amountRecurring) * 4);
						} else {}
						$(".recurringSummary .amount").html(amountRecurring);
						//summaryAmount.innerHTML = amountRecurring;
						//$('#recurringTotal span').html(amount); // Est. Annual Contribution
						$(".adfTotalAmount span").html(amountRecurring); // Total Gift Commitment
					} else {
						// Recurring Gift element is Hidden
						$(".adfTotalAmount span").html(amount); // Total Gift Commitment
					}
				});
				$("#txtAmount").on("blur keyup", function () {
					//update display
					var textAmt = $("#txtAmount").val();
					if (textAmt) {
						$(".adfTotalAmount span").html($("#txtAmount").val());
					} else {
						$(".adfTotalAmount span").html(0);
						$("#recurringTotal span").html(0);
					}
				});
				//reset when manually entering an amount
				$("#adfOtherLabel").on("click", function () {
					$(".amountButton .selected").removeClass("selected");
					$(this).hide();
					$("#txtAmount")
						.show()
						.val("")
						.focus();
					$(".giftAmountError").remove();
				});
				//$('#designationAreaDropdown').on('change', function() {
				//    if ($(this).val() !== '-1') {
				//        $('.adfOtherDesignationSubSection').show('blind','slow');
				//    } else {
				//        $('.adfOtherDesignationSubSection').hide('blind','slow');
				//    }
				//});
				//progressive display toggles
				$(".checkboxToggle").on("change", function () {
					var targetString = $(this).attr("data-controler");
					var targetContent = $("#" + targetString);
					if ($(this).prop("checked")) {
						targetContent.show("blind", "slow");
					} else {
						targetContent.hide("blind", "slow");
					}
				});
				//populate dynamic dropdowns
				BBI.Methods.populateCountryDropdowns();
				BBI.Methods.populateTitle();
				BBI.Methods.populateDesignationIds();
				BBI.Methods.populateCascadingFields();
				//other area text entry.
				$(".otherArea").on("click", function () {
					$("#otherArea").focus();
				});
				$("#otherArea")
					.on("blur", function () {
						$("#designationId").val(
							BBI.Defaults.generalFreeFormFund
						);
					})
					.on("focus", function () {
						$(".designationButton .selected").removeClass(
							"selected"
						);
						$("#fundDesignation1").val("0");
						$("#fundDesignation2")
							.val("0")
							.hide();
					});
				$("#adfSubmitButton").on("click", function (e) {
					e.preventDefault();
					if (BBI.Methods.validateADF()) {
						$(this)
							.addClass("disabled")
							.unbind("click");
						BBI.Methods.submitADF();
					}
				});
			}
		},
		initGiftTypeMethod: function () {
			// GIFT TYPE
			var defaultType = $(".toggleGiftType input:checked").val();
			$("#hiddenType").val(defaultType);
			$(".toggleGiftType input").on("change", function () {
				// console.log($(this).val());
				var typeSelected = $(this).val();
				$("#hiddenType").val(typeSelected);
				$(
						".toggleAmounts .r-pill__item:not(.otherItem) input[type='radio']"
					)
					.parent()
					.addClass("hide");
				$(
					".toggleAmounts .r-pill__item:not(.otherItem) input[type='radio'][id*=" +
					typeSelected +
					"]"
				).each(function () {
					$(this)
						.parent()
						.removeClass("hide");
				});
				if (typeSelected == "Pledge") {
					$(
						"fieldset.areaToggle, fieldset.additionalInfoToggle"
					).fadeOut();
					$("#amountPledge100").prop("checked", true);
					$("hiddenAmount").val("100");
				} else {
					$(
						"fieldset.areaToggle, fieldset.additionalInfoToggle"
					).fadeIn();
				}
				if (typeSelected == "Monthly") {
					$("#amountMonthly10").prop("checked", true);
					$("hiddenAmount").val("10");
					var frequencyValue = $("#frequency")
						.children("option:selected")
						.val();
					// console.log(frequencyValue);
					$("#hiddenStartDate").val($("#startDate").val());
					$("#hiddenFrequency").val(frequencyValue);
				} else {
					$("#hiddenStartDate").val("");
					$("#hiddenFrequency").val("");
				}
				$("fieldset.toggle").each(function () {
					if ($(this).attr("id") === typeSelected + "GiftType") {
						$("#" + typeSelected + "GiftType").show();
					} else {
						$(this).hide();
					}
				});
			});
		},
		initAmountMethod: function () {
			// AMOUNT
			var defaultAmount = $(".toggleAmounts input:checked").val();
			$("#hiddenAmount").val(defaultAmount);
			$(".toggleAmounts input[type=radio]").on("change", function () {
				// console.log($(this).val());
				var donationAmount = $(this).val();
				if (donationAmount == "other") {
					$(
							".r-pill__item.otherItem > input.miniInputText, .r-pill__item.otherItem .fa.fa-usd"
						)
						.fadeIn()
						.focus();
					$("#hiddenAmount").val("");
				} else {
					$("input.miniInputText").val("");
					$(
						".r-pill__item.otherItem > input.miniInputText, .r-pill__item.otherItem .fa.fa-usd"
					).hide();
					$("#hiddenAmount").val(donationAmount);
				}
			});

			function setInputFilter(textbox, inputFilter) {
				[
					"input",
					"keydown",
					"keyup",
					"mousedown",
					"mouseup",
					"select",
					"contextmenu",
					"drop",
				].forEach(function (event) {
					textbox.addEventListener(event, function () {
						if (inputFilter(this.value)) {
							this.oldValue = this.value;
							this.oldSelectionStart = this.selectionStart;
							this.oldSelectionEnd = this.selectionEnd;
						} else if (this.hasOwnProperty("oldValue")) {
							this.value = this.oldValue;
							this.setSelectionRange(
								this.oldSelectionStart,
								this.oldSelectionEnd
							);
						}
					});
				});
			}
			setInputFilter(document.getElementById("txtAmount"), function (
				value
			) {
				return /^-?\d*[.,]?\d{0,2}$/.test(value);
			});
			document.addEventListener(
				"DOMContentLoaded",
				function () {
					document.querySelector(
						".miniInputText"
					).onkeyup = checkOtherAmount;
				},
				false
			);

			function checkOtherAmount(event) {
				// console.log($(this).val());
				var checkOtherAmountValue = $(this).val();
				$("#hiddenAmount").val(checkOtherAmountValue);
			}
		},
		initAddlInfoMethod: function () {
			function is_int(value) {
				if (parseFloat(value) == parseInt(value) && !isNaN(value)) {
					return true;
				} else {
					return false;
				}
			}

			function checkZipCode(event) {
				// console.log($(this).val());
				var el = $(this); // Did they type five integers?
				if (el.val().length == 5 && is_int(el.val())) {
					// Call Ziptastic for information
					$.ajax({
						url: "https://zip.getziptastic.com/v2/US/" + el.val(),
						cache: false,
						dataType: "json",
						type: "GET",
						success: function (result, success) {
							// $(".zip-error, .instructions").slideUp(200);
							// console.log(el.val)
							$("#ackCity, #hiddenackCity").val(result.city);
							$("#ackState, #hiddenackState").val(result.state);
							$("#ackCountry, #hiddenackCountry").val(
								result.country
							);
							$(".ack-city-state").slideDown();
							$("#ackPostalCode").blur();
							$("#ackAddressLines")
								.show()
								.focus();
						},
						error: function (result, success) {
							$(".zip-error").slideDown(300);
						},
					});
				} else if (el.val().length < 5) {
					$(".zip-error").slideUp(200);
				}
			}
			document.addEventListener(
				"DOMContentLoaded",
				function () {
					document.querySelector(
						"#ackPostalCode"
					).onkeyup = checkZipCode;
				},
				false
			);
			// ADDITIONAL INFO
			$(".checkbox input[type='checkbox']").change(function () {
				// console.log(this.id);
				if (this.id == this.id && this.checked) {
					$("#" + this.id + "Details").slideDown();
				} else if (this.id == this.id) {
					$("#" + this.id + "Details").slideUp();
					$("#" + this.id + "Details")
						.find("input:text")
						.val("");
					$("#" + this.id + "Details")
						.find("input:checkbox")
						.prop("checked", false);
					$("#" + this.id + "Details").find(
						"select"
					)[0].selectedIndex = 0;
				} else {}
			});
			$(".additionalInfoToggle input").on("keyup change", function () {
				var ackValue = $(this).val(),
					ackID = $(this).attr("id");
				// console.log(ackID + " " + ackValue);
				$("#hidden" + ackID).val(ackValue);
			});
		},
		initReccurrenceMethod: function () {
			// RECURRENCE
			$("#frequency").on("change", function () {
				var frequencySelected = $(this).val();
				$("#hiddenFrequency").val(frequencySelected);
			});
		},
		initAreaToSupporteMethod: function () {
			// AREA TO SUPPORT
			var defaultArea = $(".areaSupportList input:checked").val();
			$("#hiddenArea").val(defaultArea);
			$("select").prop("selectedIndex", 0); // set all Select dropdowns to default option
			$(".areaSupportList input").on("change", function () {
				// console.log($(this).val());
				var areaSelected = $(this).val();
				$("#hiddenArea").val(areaSelected);
				if (areaSelected == "Colleges/Units") {
					$(
						"#collegesUnitsDropdown, #collegesUnitsFundsDropdown"
					).prop("selectedIndex", 0);
					$(
						"#collegesUnitsFundsDropdown option:not(:first)"
					).addClass("hide");
					$("#collegesUnitsFundsDropdown option:first").text(
						"-- Select College/Unit Fund --"
					);
					$(".areaSupportDD").addClass("hide");
					$(".collegeUnitsDD").removeClass("hide");
				} else if (areaSelected == "Advanced Search") {
					$(".areaSupportDD, .collegeUnitsDD").addClass("hide");
					$("#advancedFundSearch").removeClass("hide");
				} else {
					$("#designationAreaDropdown").prop("selectedIndex", 0);
					$(".areaSupportDD").removeClass("hide");
					$(".collegeUnitsDD").addClass("hide");
					$("#designationAreaDropdown option:first").text(
						"-- Select " + areaSelected + " to Support --"
					);
					$("#designationAreaDropdown option").each(function () {
						var areaData = $(this).data("area");
						if (areaSelected == areaData) {
							$(this).removeClass("hide");
						} else {
							$(this).addClass("hide");
						}
					});
				}
			});
			$(".adfInputWithPlaceholder").on("change keyup", function () {
				var typedFund = $(this).val();
				if (typedFund != "") {
					$("#hiddenFund").val(typedFund);
					$("#hiddenGuid").val(
						"6f0e4d60-1df1-495a-9e01-82b3e9d91aff"
					);
				} else {
					$("#hiddenFund").val("");
					$("#hiddenGuid").val("");
				}
			});
			// COLLEGE/UNITS
			$("#collegesUnitsDropdown").on("change", function () {
				// console.log($(this).val());
				$("#collegesUnitsFundsDropdown").prop("selectedIndex", 0);
				var collegeSelected = $(this).val();
				var trimmedCollegeOption = $.trim(
					collegeSelected.split("-")[1]
				);
				$("#collegesUnitsFundsDropdown option:first").text(
					"-- Select " + trimmedCollegeOption + " Fund --"
				);
				$("#collegesUnitsFundsDropdown option").each(function () {
					var collegeData = $(this).data("college");
					if (collegeSelected == collegeData) {
						$(this).removeClass("hide");
					} else {
						$(this).addClass("hide");
					}
				});
			});
			$(".toggleOtherFund").click(function (e) {
				e.preventDefault();
				$("#advanced-search-fund").val("");
				$(this)
					.next()
					.slideDown();
			});
			$("#designationAreaDropdown, #collegesUnitsFundsDropdown").on(
				"change",
				function () {
					var optionsText = this.options[this.selectedIndex].text,
						optionsGuid = this.options[this.selectedIndex].value;
					$("#hiddenFund").val(optionsText);
					$("#hiddenGuid").val(optionsGuid);
				}
			);
		},
		populateGUID: function () {
			// get designations for drop-down (cascading)
			// note: must be attached to a query that returns Public Name and System Record ID
			// var ucFundDesignation = $("select#ucFundSelect");
			// var ucHealthDesignation = $("select#ucHealthSelect");
			// var scholarshipsDesignation = $("select#scholarshipsSelect");
			// var collegeUnitDesignation = $("select#collegeUnitsSelect");
			// var collegeUnitFundDesignation = $("select#collegUnitsFundSelect");
			var queryService = new BLACKBAUD.api.QueryService();
			queryService.getResults(
				BBI.Defaults.guidQueryID,
				[{
					"BBIS Fund Category - Multi Attribute\\Value": "Scholarships",
				}, ],
				function (data) {
					// fund data
					var allFunds = data.Rows,
						fundMaster = [],
						topLevelAll = [],
						typeaheadArr = [],
						ucFundArr = [],
						scholarshipsArr = [],
						ucHealthArr = [];
					// console.log(allFunds);
					// remove all options in main drop-down except the first
					// $(
					// 		ucFundDesignation,
					// 		scholarshipsDesignation,
					// 		collegeUnitDesignation
					// 	)
					// 	.find("option")
					// 	.not("option:first")
					// 	.remove();
					// get drop-down hierarchy and clean arrays
					$.each(allFunds, function () {
						// define values
						var values = this.Values;
						var target = values[1]; // Fund name [0]
						var splitter = target.split("\\");
						// remove first item in array
						if (splitter.length > 1) {
							splitter.shift();
						}
						// push values to array
						splitter.push(values[4]); // Description 		subFund[1]
						splitter.push(values[6]); // Designation GUID 	subFund[2]
						splitter.push(values[9]); // College 			subFund[3]
						splitter.push(values[8]); // Areas dropdowns 	subFund[4]
						splitter.push(parseInt(values[7])); // Priority  subFund[5]
						fundMaster.push(splitter);
						if (values[8] == "Colleges/Units") {
							topLevelAll.push(values[9]);
						} else if (values[8] == "The UC Fund") {
							ucFundArr.push(splitter);
						} else if (values[8] == "Scholarships") {
							scholarshipsArr.push(splitter);
						} else if (values[8] == "UC Health") {
							ucHealthArr.push(splitter);
						} else {}
						var fundNameArr = values[1];
						var fundGuidArr = values[6];
						typeaheadArr.push(fundNameArr);
					});
					var sortedFundMaster = fundMaster.sort();
					console.table(sortedFundMaster);
					// console.log(scholarshipsArr.sort((a, b) => a[5].localeCompare(b[5])));
					// console.log(ucHealthArr);
					// console.log(typeaheadArr);
					// const arrayColumn = (arr, n) => arr.map(x => x[n]);
					// console.log(arrayColumn(typeaheadArr, 0));
				}
			);
		},
		populateQueryServiceFunds: function () {
			/* *************************************** */
			// QUERY FUNDS
			/* *************************************** */
			var queryService = new BLACKBAUD.api.QueryService();
			queryService.getResults(
				BBI.Defaults.advancedDonationFormFundsQueryId,
				function (data) {
					var fields = data.Fields, // Column headers
						rows = data.Rows, // Designation values
						fieldArray = [],
						fundMaster = [],
						typeaheadArr = [], // Typeahead array
						collegesUnitsList = []; // New array to store key value pairs for Field Data
					// Loop through headers to create key value index
					$.each(fields, function (key, value) {
						fieldArray[value.Name] = key;
					});
					$.each(rows, function () {
						var values = this.Values,
							path = values[fieldArray["Path"]],
							designationID =
							values[fieldArray["System record ID"]],
							designationName = values[fieldArray["Public name"]],
							fundCategory =
							values[
								fieldArray[
									"BBIS Fund Category - Multi Attribute\\Value"
								]
							],
							collegeUnitFundName =
							values[fieldArray["Unit Attribute\\Value"]],
							toggleHide = "";
						var target = values[1]; // Fund name [0]
						var splitter = target.split("\\");
						// remove first item in array
						if (splitter.length > 1) {
							splitter.shift();
						}
						// push values to array
						splitter.push(values[4]); // Description 		subFund[1]
						splitter.push(values[6]); // Designation GUID 	subFund[2]
						splitter.push(values[9]); // College 			subFund[3]
						splitter.push(values[8]); // Areas dropdowns 	subFund[4]
						splitter.push(parseInt(values[7])); // Priority  subFund[5]
						splitter.push(values[0]);
						fundMaster.push(splitter);
						if (fundCategory == "Colleges/Units") {
							collegesUnitsList.push(collegeUnitFundName);
							// append Colleges/Units to dropdown
							// $('#collegesUnitsDropdown').append('<option value="' + designationID + '">' + collegeUnitFundName + '</option>');
							// append Colleges/Units funds to dropdown
							$("#collegesUnitsFundsDropdown").append(
								'<option class="hide" data-college="' +
								collegeUnitFundName +
								'" value="' +
								designationID +
								'">' +
								designationName +
								"</option>"
							);
						} else if (
							fundCategory == "Scholarships" ||
							fundCategory == "The UC Fund" ||
							fundCategory == "UC Health"
						) {
							if (fundCategory != "The UC Fund") {
								toggleHide = "hide";
							}
							$("#designationAreaDropdown").append(
								'<option data-area="' +
								fundCategory +
								'" class="' +
								toggleHide +
								'" value="' +
								designationID +
								'">' +
								designationName +
								"</option>"
							);
						}
						typeaheadArr.push(path);
					});
					$("#designationAreaDropdown option:first").text(
						"-- Select The UC Fund to Support --"
					);
					var sortedFundMaster = fundMaster;
					var sortedCollegesUnits = collegesUnitsList.sort();

					function onlyUnique(value, index, self) {
						return self.indexOf(value) === index;
					}
					var uniqueCollegesUnits = sortedCollegesUnits.filter(
						onlyUnique
					);

					function multiDimensionalUnique(arr) {
						var uniques = [];
						var itemsFound = {};
						for (var i = 0, l = arr.length; i < l; i++) {
							var stringified = JSON.stringify(arr[i]);
							if (itemsFound[stringified]) {
								continue;
							}
							uniques.push(arr[i]);
							itemsFound[stringified] = true;
						}
						return uniques;
					}
					var fundsUnique = multiDimensionalUnique(sortedFundMaster);
					var trimmedCollegesUnits = [];
					$.each(uniqueCollegesUnits, function (key, value) {
						var trimmedCollege = $.trim(value.split("-")[1]);
						trimmedCollegesUnits.push(trimmedCollege);
						$("#collegesUnitsDropdown").append(
							$("<option></option>")
							.val(value)
							.text(trimmedCollege)
						);
					});

					function Ascending_sort(a, b) {
						return $(b)
							.text()
							.toUpperCase() <
							$(a)
							.text()
							.toUpperCase() ?
							1 :
							-1;
					}
					$("#collegesUnitsDropdown option:not(:first)")
						.sort(Ascending_sort)
						.appendTo("select#collegesUnitsDropdown");
					var typeaheadArrUnique = typeaheadArr
						.filter(onlyUnique)
						.sort();
					// console.table(typeaheadArrUnique);
					var substringMatcher = function (strs) {
						return function findMatches(q, cb) {
							var matches, substringRegex;
							// an array that will be populated with substring matches
							matches = [];
							// regex used to determine if a string contains the substring `q`
							substrRegex = new RegExp(q, "i");
							// iterate through the pool of strings and for any string that
							// contains the substring `q`, add it to the `matches` array
							$.each(strs, function (i, str) {
								if (substrRegex.test(str)) {
									matches.push(str);
								}
							});
							cb(matches);
						};
					};
					// $(".toggleOtherFund").click(function(e) {
					// 	e.preventDefault();
					// 	$("#advanced-search-fund").val("");
					// 	$(this)
					// 		.next()
					// 		.slideDown();
					// });
					$("#scrollable-dropdown-menu .typeahead").typeahead({
						hint: true,
						highlight: true,
						minLength: 1,
					}, {
						name: "typeaheadArr",
						limit: 100,
						source: substringMatcher(typeaheadArrUnique),
					});
					$(".typeahead").bind("typeahead:select", function (
						ev,
						suggestion
					) {
						$("#hiddenFund").val(suggestion);
						console.log(suggestion);
						$.each(fundsUnique, function (x, subFund) {
							// append GUID if terminal
							if (subFund[6] === suggestion) {
								$("#hiddenGuid").val(subFund[2]);
							}
						});
					});
				}
			);
		},
		populateAreasToSupportFields: function () {
			// get designations for drop-down (cascading)
			// note: must be attached to a query that returns Public Name and System Record ID
			var ucFundDesignation = $("select#ucFundSelect");
			var ucHealthDesignation = $("select#ucHealthSelect");
			var scholarshipsDesignation = $("select#scholarshipsSelect");
			var collegeUnitDesignation = $("select#collegeUnitsSelect");
			var collegeUnitFundDesignation = $("select#collegUnitsFundSelect");
			// if ($(mainDesignation).length !== 0) {
			var queryService = new BLACKBAUD.api.QueryService();
			queryService.getResults(
				BBI.Defaults.advancedDonationFormFundsQueryId,
				function (data) {
					// fund data
					var allFunds = data.Rows,
						fundMaster = [],
						topLevelAll = [],
						typeaheadArr = [],
						ucFundArr = [],
						scholarshipsArr = [],
						ucHealthArr = [];
					// console.log(allFunds);
					// remove all options in main drop-down except the first
					$(
							ucFundDesignation,
							scholarshipsDesignation,
							collegeUnitDesignation
						)
						.find("option")
						.not("option:first")
						.remove();
					// get drop-down hierarchy and clean arrays
					$.each(allFunds, function () {
						// define values
						var values = this.Values;
						var target = values[1]; // Fund name [0]
						var splitter = target.split("\\");
						// remove first item in array
						if (splitter.length > 1) {
							splitter.shift();
						}
						// push values to array
						splitter.push(values[4]); // Description 		subFund[1]
						splitter.push(values[6]); // Designation GUID 	subFund[2]
						splitter.push(values[9]); // College 			subFund[3]
						splitter.push(values[8]); // Areas dropdowns 	subFund[4]
						splitter.push(parseInt(values[7])); // Priority  subFund[5]
						fundMaster.push(splitter);
						if (values[8] == "Colleges/Units") {
							topLevelAll.push(values[9]);
						} else if (values[8] == "The UC Fund") {
							ucFundArr.push(splitter);
						} else if (values[8] == "Scholarships") {
							scholarshipsArr.push(splitter);
						} else if (values[8] == "UC Health") {
							ucHealthArr.push(splitter);
						} else {}
						var fundNameArr = values[1];
						var fundGuidArr = values[6];
						typeaheadArr.push(fundNameArr);
					});
					var sortedFundMaster = fundMaster;
					// console.table(sortedFundMaster);
					// console.log(scholarshipsArr.sort((a, b) => a[5].localeCompare(b[5])));
					// console.log(ucHealthArr);
					// console.log(typeaheadArr);
					// const arrayColumn = (arr, n) => arr.map(x => x[n]);
					// console.log(arrayColumn(typeaheadArr, 0));
					function multiDimensionalUnique(arr) {
						var uniques = [];
						var itemsFound = {};
						for (var i = 0, l = arr.length; i < l; i++) {
							var stringified = JSON.stringify(arr[i]);
							if (itemsFound[stringified]) {
								continue;
							}
							uniques.push(arr[i]);
							itemsFound[stringified] = true;
						}
						return uniques;
					}
					var fundsUnique = multiDimensionalUnique(sortedFundMaster);
					// filter unique values
					function onlyUnique(value, index, self) {
						return self.indexOf(value) === index;
					}
					var topLevelUnique = topLevelAll.filter(onlyUnique);
					var collegeUnitsDropdown = topLevelUnique.sort();
					$.each(collegeUnitsDropdown, function (key, value) {
						var trimmedCollege = $.trim(value.split("-")[1]);
						$(collegeUnitDesignation).append(
							$("<option></option>")
							.val(value)
							.text(trimmedCollege)
						);
					});

					function Ascending_sort(a, b) {
						return $(b)
							.text()
							.toUpperCase() <
							$(a)
							.text()
							.toUpperCase() ?
							1 :
							-1;
					}
					$("select#collegeUnitsSelect option:not(:first)")
						.sort(Ascending_sort)
						.appendTo("select#collegeUnitsSelect");
					// .sort((a, b) => Number(a.price) - Number(b.price));
					// ucFundArr = ucFundArr.sort();
					// scholarshipsArr = scholarshipsArr.sort();
					// ucHealthArr = ucHealthArr.sort();
					fundsUnique.sort(function (a, b) {
						return a[5] - b[5];
					});
					// console.table(fundsUnique);
					$.each(fundsUnique, function (x, subFund) {
						// append GUID if terminal
						if (subFund[4] == "The UC Fund") {
							$(ucFundDesignation).append(
								$("<option></option>")
								.val(subFund[2])
								.text(subFund[0])
							);
						} else if (subFund[4] == "Scholarships") {
							$(scholarshipsDesignation).append(
								$("<option></option>")
								.val(subFund[2])
								.text(subFund[0])
							);
						} else if (subFund[4] == "UC Health") {
							$(ucHealthDesignation).append(
								$("<option></option>")
								.val(subFund[2])
								.text(subFund[0])
							);
						} else {
							return;
						}
					});
					$("#areasToSuppportRadioGroup select").prop(
						"disabled",
						false
					);
					var ucFundOptionValues = [];
					$("#ucFundSelect option").each(function () {
						if ($.inArray(this.value, ucFundOptionValues) > -1) {
							$(this).remove();
						} else {
							ucFundOptionValues.push(this.value);
						}
					});
					var scholarshipOptionValues = [];
					$("#scholarshipsSelect option").each(function () {
						if (
							$.inArray(this.value, scholarshipOptionValues) > -1
						) {
							$(this).remove();
						} else {
							scholarshipOptionValues.push(this.value);
						}
					});
					var typeaheadArrUnique = typeaheadArr
						.filter(onlyUnique)
						.sort();
					// console.table(typeaheadArrUnique.sort());
					var substringMatcher = function (strs) {
						return function findMatches(q, cb) {
							var matches, substringRegex;
							// an array that will be populated with substring matches
							matches = [];
							// regex used to determine if a string contains the substring `q`
							substrRegex = new RegExp(q, "i");
							// iterate through the pool of strings and for any string that
							// contains the substring `q`, add it to the `matches` array
							$.each(strs, function (i, str) {
								if (substrRegex.test(str)) {
									matches.push(str);
								}
							});
							cb(matches);
						};
					};
					$(".toggleOtherFund").click(function (e) {
						e.preventDefault();
						toggleAreaValid(false);
						$("#advanced-search-fund").val("");
						$(this)
							.next()
							.slideDown();
					});
					$("#scrollable-dropdown-menu .typeahead").typeahead({
						hint: true,
						highlight: true,
						minLength: 1,
					}, {
						name: "typeaheadArr",
						limit: 100,
						source: substringMatcher(typeaheadArrUnique),
					});
					$(".typeahead").bind("typeahead:select", function (
						ev,
						suggestion
					) {
						$("#fundName").val(suggestion);
						//console.log(suggestion);
						$.each(fundsUnique, function (x, subFund) {
							// append GUID if terminal
							if (subFund[0] === suggestion) {
								$("#fundGuid").val(subFund[2]);
								toggleAreaValid(true);
							}
						});
					});

					function toggleAreaValid(value) {
						if ((value = true)) {
							$(".validation-icon.fund i")
								.removeClass("fa-times-circle")
								.addClass("fa-check-circle");
						} else {
							$(".validation-icon.fund i")
								.removeClass("fa-check-circle")
								.addClass("fa-times-circle");
						}
					}
					// College/Units drop-down
					$(collegeUnitDesignation).on("change", function () {
						// define designation selection
						var selection = $(this).val();
						console.log(selection);
						// remove all options in sub drop-down except the first
						$(collegeUnitFundDesignation)
							.find("option")
							.not("option:first")
							.remove();
						// loop through funds
						$.each(fundsUnique, function (x, subFund) {
							// append GUID if terminal
							if (
								subFund[3] === selection &&
								subFund[4] == "Colleges/Units"
							) {
								$(collegeUnitFundDesignation).append(
									$("<option></option>")
									.val(subFund[2])
									.text(subFund[0])
								);
							}
						});
					});
				}
			);
			// }
		},
		populateTypeaheadField: function () {
			// get designations for drop-down (cascading)
			// note: must be attached to a query that returns Public Name and System Record ID
			var ucFundDesignation = $("select#ucFundSelect");
			var ucHealthDesignation = $("select#ucHealthSelect");
			var scholarshipsDesignation = $("select#scholarshipsSelect");
			var collegeUnitDesignation = $("select#collegeUnitsSelect");
			var collegeUnitFundDesignation = $("select#collegUnitsFundSelect");
			// if ($(mainDesignation).length !== 0) {
			var queryService = new BLACKBAUD.api.QueryService();
			queryService.getResults(
				BBI.Defaults.advancedDonationFormFundsQueryId,
				function (data) {
					// fund data
					var allFunds = data.Rows;
					var fundMaster = [];
					var topLevelAll = [];
					var typeaheadArr = [];
					// console.log(allFunds);
					// remove all options in main drop-down except the first
					$(
							ucFundDesignation,
							scholarshipsDesignation,
							collegeUnitDesignation
						)
						.find("option")
						.not("option:first")
						.remove();
					// get drop-down hierarchy and clean arrays
					$.each(allFunds, function () {
						// define values
						var values = this.Values;
						var target = values[0]; // Fund name [0]
						var splitter = target.split("\\");
						// remove first item in array
						if (splitter.length > 1) {
							splitter.shift();
						}
						// push values to array
						splitter.push(values[4]); // Description [1]
						splitter.push(values[6]); // Designation GUID [2]
						splitter.push(values[9]); // College [3]
						splitter.push(values[8]); // The UC Fund/Scholarships/Colleges/Unit [4]
						fundMaster.push(splitter);
						if (values[8] == "Colleges/Units") {
							topLevelAll.push(values[9]);
						}
						var fundNameArr = values[0];
						var fundGuidArr = values[6];
						typeaheadArr.push(fundNameArr);
					});
					var sortedFundMaster = fundMaster.sort();
					// console.log(typeaheadArr);
					// const arrayColumn = (arr, n) => arr.map(x => x[n]);
					// console.log(arrayColumn(typeaheadArr, 0));
					function multiDimensionalUnique(arr) {
						var uniques = [];
						var itemsFound = {};
						for (var i = 0, l = arr.length; i < l; i++) {
							var stringified = JSON.stringify(arr[i]);
							if (itemsFound[stringified]) {
								continue;
							}
							uniques.push(arr[i]);
							itemsFound[stringified] = true;
						}
						return uniques;
					}
					var fundsUnique = multiDimensionalUnique(sortedFundMaster);
					// console.log(fundsUnique);
					// filter unique values
					function onlyUnique(value, index, self) {
						return self.indexOf(value) === index;
					}
					var topLevelUnique = topLevelAll.filter(onlyUnique);
					var collegeUnitsDropdown = topLevelUnique.sort();
					$.each(collegeUnitsDropdown, function (key, value) {
						var trimmedCollege = $.trim(value.split("-")[1]);
						$(collegeUnitDesignation).append(
							$("<option></option>")
							.val(value)
							.text(trimmedCollege)
						);
					});
					var substringMatcher = function (strs) {
						return function findMatches(q, cb) {
							var matches, substringRegex;
							// an array that will be populated with substring matches
							matches = [];
							// regex used to determine if a string contains the substring `q`
							substrRegex = new RegExp(q, "i");
							// iterate through the pool of strings and for any string that
							// contains the substring `q`, add it to the `matches` array
							$.each(strs, function (i, str) {
								if (substrRegex.test(str)) {
									matches.push(str);
								}
							});
							cb(matches);
						};
					};
					// $(".toggleOtherFund").click(function(e) {
					// 	e.preventDefault();
					// 	toggleAreaValid(false);
					// 	$("#advanced-search-fund").val("");
					// 	$(this)
					// 		.next()
					// 		.slideDown();
					// });
					$("#scrollable-dropdown-menu .typeahead").typeahead({
						hint: false,
						highlight: true,
						minLength: 1,
					}, {
						name: "typeaheadArr",
						limit: 100,
						source: substringMatcher(typeaheadArr),
					});
					$(".typeahead").bind("typeahead:select", function (
						ev,
						suggestion
					) {
						$("#fundName").val(suggestion);
						//console.log(suggestion);
						$.each(fundsUnique, function (x, subFund) {
							// append GUID if terminal
							if (subFund[0] === suggestion) {
								console.log(subFund[2]);
								$("#fundGuid").val(
									"https://foundation.uc.edu/donate?id=" +
									subFund[2]
								);
								// toggleAreaValid(true);
							}
						});
					});
					$("#copyButton").click(function (e) {
						e.preventDefault();
						var copyText = document.getElementById("fundGuid");
						copyText.select();
						copyText.setSelectionRange(0, 99999);
						document.execCommand("copy");
						console.log(
							"https://foundation.uc.edu/donate?id=" +
							copyText.value
						);
					});
				}
			);
			// }
		},
		populateCountryDropdowns: function () {
			var countryService = new BLACKBAUD.api.CountryService({
				url: BBI.Defaults.rootpath,
				crossDomain: false,
			});
			countryService.getCountries(function (country) {
				$.each(country, function () {
					$("#ackCountry").append(
						$("<option></option>")
						.val(this["Abbreviation"])
						.text(this["Description"])
						.attr("id", this["Id"])
					);
				});
				BBI.Methods.populateStateDropdowns(
					$("#ackCountry")
					.find('[value="USA"]')
					.attr("id")
				);
				$("#ackCountry")
					.val("USA")
					.on("change", function () {
						var countryID = $(this)
							.find(":selected")
							.attr("id");
						BBI.Methods.populateStateDropdowns(countryID);
					});
			});
		},
		populateStateDropdowns: function (countryID) {
			var countryService = new BLACKBAUD.api.CountryService({
				url: BBI.Defaults.rootpath,
				crossDomain: false,
			});
			countryService.getStates(countryID, function (state) {
				$("#ackState option:gt(0)").remove();
				$.each(state, function () {
					$("#ackState").append(
						$("<option></option>")
						.val(this["Abbreviation"])
						.text(this["Description"])
					);
				});
			});
		},
		// get title table
		populateTitle: function () {
			var selectAckTitle = $("#ackTitle");
			$.get(
				BLACKBAUD.api.pageInformation.rootPath +
				"webapi/CodeTable/" +
				BBI.Defaults.titleTable,
				function (data) {
					for (var i = 0, j = data.length; i < j; i++) {
						selectAckTitle.append(
							'<option value="' +
							data[i].Id +
							'">' +
							data[i].Description +
							"</option>"
						);
					}
				}
			).done(function () {
				selectAckTitle.val("-1").change();
			});
		},
		populateDesignationIds: function () {
			var queryService = new BLACKBAUD.api.QueryService();
			queryService.getResults(
				BBI.Defaults.highlightedFundsQueryId,
				function (data) {
					var fields = data.Fields,
						rows = data.Rows,
						fieldArray = [];
					$.each(fields, function (key, value) {
						fieldArray[value.Name] = key;
					});
					$.each(rows, function () {
						var values = this["Values"],
							designationID =
							values[fieldArray["System record ID"]],
							designationName = values[fieldArray["Public name"]], // use friendly name
							itemHTML =
							'<li class="designationButton"><a rel="' +
							designationID +
							'">' +
							designationName +
							"</a></li>";
						$(".designationButtonWrapper").append(itemHTML);
					});
					$(".designationButton a").on("click", function () {
						$(".designationButton .selected").removeClass(
							"selected"
						);
						$(this).addClass("selected");
						$("#designationId").val($(this).attr("rel"));
						$("#fundDesignation1").val("0");
						$("#fundDesignation2")
							.val("0")
							.hide();
					});
				}
			);
		},
		populateCascadingFields: function () {
			// get designations for drop-down (cascading)
			// note: must be attached to a query that returns Public Name and System Record ID
			var mainDesignation = $("#fundDesignation1");
			var subDesignation = $("#fundDesignation2");
			if ($(mainDesignation).length !== 0) {
				var queryService = new BLACKBAUD.api.QueryService();
				queryService.getResults(
					BBI.Defaults.cascadingFundsQueryId,
					function (data) {
						// fund data
						var allFunds = data.Rows;
						var fundMaster = [];
						var topLevelAll = [];
						// console.log(allFunds);
						// remove all options in main drop-down except the first
						$(mainDesignation)
							.find("option")
							.not("option:first")
							.remove();
						// get drop-down hierarchy and clean arrays
						$.each(allFunds, function () {
							// define values
							var values = this.Values;
							var target = values[3];
							var splitter = target.split("\\");
							// remove first item in array
							if (splitter.length > 1) {
								splitter.shift();
							}
							// push values to array
							splitter.push(values[5]); // update key to match designation GUID
							splitter.push(values[2]);
							fundMaster.push(splitter);
							topLevelAll.push(splitter[0]);
							// console.log(fundMaster);
						});
						// filter unique values
						function onlyUnique(value, index, self) {
							return self.indexOf(value) === index;
						}
						var topLevelUnique = topLevelAll.filter(onlyUnique);
						$.each(topLevelUnique, function (key, value) {
							$(mainDesignation).append(
								$("<option></option>")
								.val(value)
								.text(value)
							);
						});
						// category drop-down
						$(mainDesignation).on("change", function () {
							// remove selected class from designation buttons
							$(".designationButton .selected").removeClass(
								"selected"
							);
							// define designation selection
							var selection = $(this).val();
							// remove all options in sub drop-down except the first
							$(subDesignation)
								.find("option")
								.not("option:first")
								.remove();
							// loop through funds
							$.each(fundMaster, function (x, subFund) {
								// append GUID if terminal
								if (subFund[0] === selection) {
									$(subDesignation).append(
										$("<option></option>")
										.val(subFund[1])
										.text(subFund[2])
									);
								}
							});
							// toggle designation drop-down
							if ($(this).val() === "0") {
								$(subDesignation).hide();
							} else {
								$(subDesignation).show();
							}
						});
					}
				);
			}
		},
		initAdfTabs: function () {
			//default state
			$("#adfTributToggle").show();
			$("#adfFrequency").hide();
			$("#adfTabsMenu a").on("click", function () {
				var tabReference = $(this).attr("id");
				$("#adfTabsMenu .selected").removeClass("selected");
				$(this)
					.parent("li")
					.addClass("selected");
				//handle states of form
				if (tabReference === "tabRecurring") {
					$("#adfTributToggle").hide();
					$("#adfFrequency").show();
				} else if (tabReference === "tabPledge") {
					$("#adfFrequency").hide();
				} else if (tabReference === "tabFaculty") {
					$("#adfFrequency").hide();
				} else {
					//tabOneTime
					//default state
					$("#adfTributToggle").show();
					$("#adfFrequency").hide();
				}
			});
		},
		validateADF: function () {
			var ValidationMessage = [];
			var isValid = true;
			$("input.required:visible").each(function () {
				if ($.trim($(this).val()) === "" || $(this).val() == "-1") {
					var requiredFieldMessage =
						'<span class="invalidLabel adfNote"><i class="fa fa-exclamation-circle"></i>This is a required field.</span>';
					isValid = false;
					$(this).addClass("invalid");
					$(this).after(requiredFieldMessage);
				}
			});
			if ($("#giftListEmpty").is(":visible")) {
				// console.log(isValid + ":(");
				isValid = false;
				$(".BBFormValidatorSummary").html(
					'<p class="giftAmountError">Please add an item to your cart.</p>'
				);
			}
			$(".invalid")
				.first()
				.focus();
			$(".invalid").on("keydown", function () {
				$(this).unbind("keydown");
				$(this).removeClass("invalid");
				$(this)
					.parent()
					.find(".invalidLabel")
					.remove();
			});
			return isValid;
		},
		submitQueryADF: function () {
			var partId = $(".BBDonationApiContainer").attr("data-partid"),
				donationService = new BLACKBAUD.api.DonationService(partId, {
					url: BBI.Defaults.rootpath,
					crossDomain: false,
				}),
				giftAmount = $(".miniInputTex").val(),
				designationID = $("#designationId").val(),
				customAttributes = [],
				designationArray = [];
			var donation = {
				Gift: {
					Designations: [],
					IsAnonymous: false,
					MerchantAccountId: BBI.Defaults.MerchantAccountId,
				},
			};
			if ($("#anonymous:checked").length !== 0) {
				donation.Gift.IsAnonymous = true;
			}
			//other area free text entry
			// if ($("#giftListNotEmpty .otherDesignation").length !== 0) {
			// 	donation.Gift.Comments =
			// 		"Area of support: " +
			// 		$("#giftListNotEmpty .otherDesignation .fund-name").text();
			// }
			// if ($("#fundDesignation2 option:selected").val() !== "0") {
			// 	designationID = $("#fundDesignation2 option:selected").val();
			// }
			// tribute (honoree) attributes
			if ($("input#tribute:checked").length !== 0) {
				if ($("#tributeType:visible").length !== 0) {
					var tributeType = {
						AttributeId: BBI.Defaults.customADFAttributes[
							"Tribute Gift Type"
						],
						Value: $("#tributeType").val(),
					};
					customAttributes.push(tributeType);
				}
				if (
					$("#honoreeFirstName").length !== 0 &&
					$("#honoreeLastName").length !== 0
				) {
					var honoreeName = {
						AttributeId: BBI.Defaults.customADFAttributes["Honoree Name"],
						Value: $("#honoreeFirstName").val() +
							" " +
							$("#honoreeLastName").val(),
					};
					customAttributes.push(honoreeName);
				}
			}
			// acknowledgee attributes
			if ($("input#ackCheck:checked").length !== 0) {
				if (
					$("#ackTitle").length !== 0 &&
					$("#ackTitle").val() !== "-1"
				) {
					var ackTitle = {
						AttributeId: BBI.Defaults.customADFAttributes[
							"Acknowledgee Title"
						],
						Value: $("#ackTitle option:selected").text(),
					};
					customAttributes.push(ackTitle);
				}
				if ($("#ackFirstName").length !== 0) {
					var ackFirstName = {
						AttributeId: BBI.Defaults.customADFAttributes[
							"Acknowledgee First Name"
						],
						Value: $("#ackFirstName").val(),
					};
					customAttributes.push(ackFirstName);
				}
				if ($("#ackLastName").length !== 0) {
					var ackLastName = {
						AttributeId: BBI.Defaults.customADFAttributes[
							"Acknowledgee Last Name"
						],
						Value: $("#ackLastName").val(),
					};
					customAttributes.push(ackLastName);
				}
				if ($("#ackAddressLines").length !== 0) {
					var ackAddress = {
						AttributeId: BBI.Defaults.customADFAttributes[
							"Acknowledgee Address"
						],
						Value: $("#ackAddressLines").val(),
					};
					customAttributes.push(ackAddress);
				}
				if ($("#ackCity").length !== 0) {
					var ackCity = {
						AttributeId: BBI.Defaults.customADFAttributes[
							"Acknowledgee City"
						],
						Value: $("#ackCity").val(),
					};
					customAttributes.push(ackCity);
				}
				if ($("#ackState").length !== 0) {
					var ackState = {
						AttributeId: BBI.Defaults.customADFAttributes[
							"Acknowledgee State"
						],
						Value: $("#ackState").val(),
					};
					customAttributes.push(ackState);
				}
				if ($("#ackPostalCode").length !== 0) {
					var ackZip = {
						AttributeId: BBI.Defaults.customADFAttributes[
							"Acknowledgee Zip"
						],
						Value: $("#ackPostalCode").val(),
					};
					customAttributes.push(ackZip);
				}
				if ($("#ackCountry").length !== 0) {
					var ackCountry = {
						AttributeId: BBI.Defaults.customADFAttributes[
							"Acknowledgee Country"
						],
						Value: $("#ackCountry").val(),
					};
					customAttributes.push(ackCountry);
				}
				if (
					$("#ackPhone").length !== 0 &&
					$("#ackPhone").val() !== ""
				) {
					var ackPhone = {
						AttributeId: BBI.Defaults.customADFAttributes[
							"Acknowledgee Phone"
						],
						Value: $("#ackPhone").val(),
					};
					customAttributes.push(ackPhone);
				}
				if (
					$("#ackEmail").length !== 0 &&
					$("#ackEmail").val() !== ""
				) {
					var ackEmail = {
						AttributeId: BBI.Defaults.customADFAttributes[
							"Acknowledgee Email"
						],
						Value: $("#ackEmail").val(),
					};
					customAttributes.push(ackEmail);
				}
			}
			if ($("#company:visible").length !== 0) {
				console.log($("#company").val());
				var company = {
					AttributeId: BBI.Defaults.customADFAttributes[
						"Matching Gift Company"
					],
					Value: $("#company").val(),
				};
				customAttributes.push(company);
			}
			if ($("#spouseName:visible").length !== 0) {
				var spouseName = {
					AttributeId: BBI.Defaults.customADFAttributes["Joint Spouse Name"],
					Value: $("#spouseName").val(),
				};
				customAttributes.push(spouseName);
			}
			if ($("#pledgeID:visible").length !== 0) {
				console.log($("#pledgeID").val());
				var pledge = {
					AttributeId: BBI.Defaults.customADFAttributes["Pledge ID"],
					Value: $("#pledgeID").val(),
				};
				customAttributes.push(pledge);
			}
			if ($("#frequency:visible").length !== 0) {
				console.log($("#frequency option:selected").val());
				var startDate = $("#startDate").datepicker("getDate"), //Date.parse();
					DayOfWeek = startDate.getDay(),
					DayOfMonth = startDate.getDate(),
					StartMonth = startDate.getMonth(),
					frequency = $("#frequency").val();
				// var endDate = $("#endDate").val().length !== 0 ? $("#endDate").val() : null;
				if (frequency == 1) {
					donation.Gift["Recurrence"] = {
						DayOfWeek: DayOfWeek,
						Frequency: frequency,
						StartDate: startDate,
						// EndDate: endDate
					};
				} else if (frequency == 2) {
					donation.Gift["Recurrence"] = {
						DayOfMonth: DayOfMonth,
						Frequency: frequency,
						StartDate: startDate,
						// EndDate: endDate
					};
				} else {
					donation.Gift["Recurrence"] = {
						DayOfMonth: DayOfMonth,
						Frequency: frequency,
						StartDate: startDate,
						// EndDate: endDate
					};
				}
			}
			if (
				$("#otherArea:visible").length !== 0 &&
				$("#otherArea:visible").val().length > 0
			) {
				var otherArea = {
					Value: $("#otherArea").val(),
				};
				donation.Gift.Comments.push(otherArea);
			}
			donation.Gift.Attributes = customAttributes;
			// one-time gift
			var getGiftType = $(".toggleGiftType input:checked").val();
			if (getGiftType == "OneTime" || getGiftType == "Monthly") {
				var giftRow = $("#giftListNotEmpty > table > tbody > tr");
				$.each(giftRow, function () {
					var fundAmount = $(this)
						.find(".fund-amount input")
						.val()
						.replace("$", "")
						.trim();
					var fundDesignation = $(this)
						.find(".fund-designation")
						.text()
						.trim();
					var gift = {
						Amount: fundAmount,
						DesignationId: fundDesignation,
					};
					designationArray.push(gift);
				});
				donation.Gift.Designations = designationArray;
				// console.log(donation.Gift.Designations);
				// pledge gift
			} else {
				donation.Gift.Designations = [{
					Amount: $("#hiddenAmount").val(),
					DesignationId: BBI.Defaults.pledgeFund,
				}, ];
			}
			donationSuccess = function (data) {
				// no action, automatically forwards to payment part
				// console.log(data);
			};
			donationFail = function (d) {
				$(".BBFormValidatorSummary").html(
					"<p>" + BBI.Methods.convertErrorsToHtml(d) + "</p>"
				);
				$("#adfSubmitButtonQS")
					.on("click", function (e) {
						e.preventDefault();
						if (BBI.Methods.validateADF()) {
							$(this)
								.addClass("disabled")
								.unbind("click");
							BBI.Methods.submitADF();
						}
					})
					.removeClass("disabled");
			};
			// console.log(donation);
			donationService.createDonation(
				donation,
				donationSuccess,
				donationFail
			);
		},
		submitCustomADF: function () {
			var partId = $(".BBDonationApiContainer").attr("data-partid"),
				donationService = new BLACKBAUD.api.DonationService(partId, {
					url: BBI.Defaults.rootpath,
					crossDomain: false,
				}),
				giftAmount = $(".miniInputText.currency").val(),
				designationID = $("#designationId").val(),
				customAttributes = [],
				designationArray = [];
			var donation = {
				Gift: {
					Designations: [],
					IsAnonymous: false,
					MerchantAccountId: BBI.Defaults.MerchantAccountId,
				},
			};

			function getAllUrlParams(url) {
				var queryString = url ?
					url.split("?")[1] :
					window.location.search.slice(1);
				var obj = {};
				if (queryString) {
					queryString = queryString.split("#")[0];
					var arr = queryString.split("&");
					for (var i = 0; i < arr.length; i++) {
						var a = arr[i].split("=");
						var paramName = a[0];
						var paramValue =
							typeof a[1] === "undefined" ? true : a[1];
						paramName = paramName.toLowerCase();
						if (typeof paramValue === "string")
							paramValue = paramValue.toLowerCase();
						if (paramName.match(/\[(\d+)?\]$/)) {
							var key = paramName.replace(/\[(\d+)?\]/, "");
							if (!obj[key]) obj[key] = [];
							if (paramName.match(/\[\d+\]$/)) {
								var index = /\[(\d+)\]/.exec(paramName)[1];
								obj[key][index] = paramValue;
							} else {
								obj[key].push(paramValue);
							}
						} else {
							if (!obj[paramName]) {
								obj[paramName] = paramValue;
							} else if (
								obj[paramName] &&
								typeof obj[paramName] === "string"
							) {
								obj[paramName] = [obj[paramName]];
								obj[paramName].push(paramValue);
							} else {
								obj[paramName].push(paramValue);
							}
						}
					}
				}
				return obj;
			}
			var params = document.getElementById("params");
			var results = document.getElementById("results");
			document
				.querySelector("input")
				.addEventListener("keyup", function () {
					params.innerText = this.value;
					results.innerText = JSON.stringify(
						getAllUrlParams("http://test.com/?" + this.value),
						null,
						2
					);
				});
			if ($("#anonymous:checked").length !== 0) {
				donation.Gift.IsAnonymous = true;
			}
			donation.Gift.Attributes = customAttributes;
			var fundAmount = $("#customAmount[type=radio]").val();
			var fundDesignation = $("#hiddenGuid").val();
			var gift = {
				Amount: fundAmount,
				DesignationId: fundDesignation,
			};
			designationArray.push(gift);
			donation.Gift.Designations = designationArray;
			donationSuccess = function (data) {
				// no action, automatically forwards to payment part
				// console.log(data);
			};
			donationFail = function (d) {
				$(".BBFormValidatorSummary").html(
					"<p>" + BBI.Methods.convertErrorsToHtml(d) + "</p>"
				);
				$("#adfSubmitButtonCustom")
					.on("click", function (e) {
						e.preventDefault();
						if (BBI.Methods.validateADF()) {
							$(this)
								.addClass("disabled")
								.unbind("click");
							BBI.Methods.submitCustomADF();
						}
					})
					.removeClass("disabled");
			};
			// console.log(donation);
			donationService.createDonation(
				donation,
				donationSuccess,
				donationFail
			);
		},
		submitADF: function () {
			var partId = $(".BBDonationApiContainer").attr("data-partid"),
				donationService = new BLACKBAUD.api.DonationService(partId, {
					url: BBI.Defaults.rootpath,
					crossDomain: false,
				}),
				giftAmount = $(".miniInputText.currency").val(),
				designationID = $("#designationId").val(),
				customAttributes = [],
				designationArray = [];
			var donation = {
				Gift: {
					Designations: [],
					IsAnonymous: false,
					MerchantAccountId: BBI.Defaults.MerchantAccountId,
				},
			};

			function getAllUrlParams(url) {
				var queryString = url ?
					url.split("?")[1] :
					window.location.search.slice(1);
				var obj = {};
				if (queryString) {
					queryString = queryString.split("#")[0];
					var arr = queryString.split("&");
					for (var i = 0; i < arr.length; i++) {
						var a = arr[i].split("=");
						var paramName = a[0];
						var paramValue =
							typeof a[1] === "undefined" ? true : a[1];
						paramName = paramName.toLowerCase();
						if (typeof paramValue === "string")
							paramValue = paramValue.toLowerCase();
						if (paramName.match(/\[(\d+)?\]$/)) {
							var key = paramName.replace(/\[(\d+)?\]/, "");
							if (!obj[key]) obj[key] = [];
							if (paramName.match(/\[\d+\]$/)) {
								var index = /\[(\d+)\]/.exec(paramName)[1];
								obj[key][index] = paramValue;
							} else {
								obj[key].push(paramValue);
							}
						} else {
							if (!obj[paramName]) {
								obj[paramName] = paramValue;
							} else if (
								obj[paramName] &&
								typeof obj[paramName] === "string"
							) {
								obj[paramName] = [obj[paramName]];
								obj[paramName].push(paramValue);
							} else {
								obj[paramName].push(paramValue);
							}
						}
					}
				}
				return obj;
			}
			var params = document.getElementById("params");
			var results = document.getElementById("results");
			document
				.querySelector("input")
				.addEventListener("keyup", function () {
					params.innerText = this.value;
					results.innerText = JSON.stringify(
						getAllUrlParams("http://test.com/?" + this.value),
						null,
						2
					);
				});
			if (window.location.href.indexOf("giving-page") > -1) {
				var origin = {
					AppealId: "6740fcbf-aa98-44bf-87d2-a69ba1f8d216",
					PageId: BLACKBAUD.api.pageInformation.pageId,
					//, "PageName": "Advanced Donation Form"
				};
				donation.Origin = origin;
			}
			// if the path contains "/givetoday",
			// this is an appeal, so let's add the ID
			if (
				window.location.pathname.toLowerCase().startsWith("/givetoday")
			) {
				var origin = {
					AppealId: "BF7730F5-C275-4C2F-A08C-A33A29F2FBBA",
					PageId: BLACKBAUD.api.pageInformation.pageId,
					//, "PageName": "Advanced Donation Form"
				};
				donation.Origin = origin;
			}
			// if the path contains "/impact2016"
			// Appeal: FY17 Faculty & Staff Campaign CYE2016
			// this is an appeal, so let's add the ID
			if (
				window.location.pathname.toLowerCase().startsWith("/impact2016")
			) {
				var origin = {
					AppealId: "b76d6373-51f0-4268-a35c-92bb1c8de65f",
					PageId: BLACKBAUD.api.pageInformation.pageId,
					//, "PageName": "Advanced Donation Form"
				};
				donation.Origin = origin;
			}
			// if the path contains "/impact16"
			// Appeal: FY17 Faculty & Staff Campaign CYE16
			// this is an appeal, so let's add the ID
			if (
				window.location.pathname.toLowerCase().startsWith("/givetoday")
			) {
				var origin = {
					AppealId: "55a0b0ac-ed24-470e-b42f-5a537eca152f",
					PageId: BLACKBAUD.api.pageInformation.pageId,
					//, "PageName": "Advanced Donation Form"
				};
				donation.Origin = origin;
			}
			if ($("#anonymous:checked").length !== 0) {
				donation.Gift.IsAnonymous = true;
			}
			//other area free text entry
			if ($("#giftListNotEmpty .otherDesignation").length !== 0) {
				donation.Gift.Comments =
					"Area of support: " +
					$("#giftListNotEmpty .otherDesignation .fund-name").text();
			}
			if ($("#fundDesignation2 option:selected").val() !== "0") {
				designationID = $("#fundDesignation2 option:selected").val();
			}
			/*if ($('#adfTributToggle > label > input:checked').length !== 0) {
				var Tribute = {};
				if ($('#isTributeNotification:checked').length !== 0) {
					Tribute.Acknowledgee = {
						"FirstName" : $('#ackFirstName').val(),
						"LastName" : $('#ackLastName').val(),
						"AddressLines" : $('#ackAddressLines').val(),
						"City" : $('#ackCity').val(),
						"Country" : $('#ackCountry').val(),
						"Email" : $('#ackEmail').val(),
						"Phone" : $('#ackPhone').val(),
						"PostalCode" : $('#ackPostalCode').val(),
						"State" : $('#ackState').val()
					};
				}
				Tribute.TributeDefinition = {
						"Type" : $('#tributeType').val(),
						"FirstName": $('#honoreeFirstName').val(),
						"LastName": $('#honoreeLastName').val(),
						"Description": $('#tributeType').val()
				};
				donation.Gift.Tribute = Tribute;
			}*/
			// tribute (honoree) attributes
			if ($("input#tribute:checked").length !== 0) {
				if ($("#tributeType:visible").length !== 0) {
					var tributeType = {
						AttributeId: BBI.Defaults.customADFAttributes[
							"Tribute Gift Type"
						],
						Value: $("#tributeType").val(),
					};
					customAttributes.push(tributeType);
				}
				if (
					$("#honoreeFirstName").length !== 0 &&
					$("#honoreeLastName").length !== 0
				) {
					var honoreeName = {
						AttributeId: BBI.Defaults.customADFAttributes["Honoree Name"],
						Value: $("#honoreeFirstName").val() +
							" " +
							$("#honoreeLastName").val(),
					};
					customAttributes.push(honoreeName);
				}
			}
			// acknowledgee attributes
			if ($("input#ackCheck:checked").length !== 0) {
				if (
					$("#ackTitle").length !== 0 &&
					$("#ackTitle").val() !== "-1"
				) {
					var ackTitle = {
						AttributeId: BBI.Defaults.customADFAttributes[
							"Acknowledgee Title"
						],
						Value: $("#ackTitle option:selected").text(),
					};
					customAttributes.push(ackTitle);
				}
				if ($("#ackFirstName").length !== 0) {
					var ackFirstName = {
						AttributeId: BBI.Defaults.customADFAttributes[
							"Acknowledgee First Name"
						],
						Value: $("#ackFirstName").val(),
					};
					customAttributes.push(ackFirstName);
				}
				if ($("#ackLastName").length !== 0) {
					var ackLastName = {
						AttributeId: BBI.Defaults.customADFAttributes[
							"Acknowledgee Last Name"
						],
						Value: $("#ackLastName").val(),
					};
					customAttributes.push(ackLastName);
				}
				if ($("#ackAddressLines").length !== 0) {
					var ackAddress = {
						AttributeId: BBI.Defaults.customADFAttributes[
							"Acknowledgee Address"
						],
						Value: $("#ackAddressLines").val(),
					};
					customAttributes.push(ackAddress);
				}
				if ($("#ackCity").length !== 0) {
					var ackCity = {
						AttributeId: BBI.Defaults.customADFAttributes[
							"Acknowledgee City"
						],
						Value: $("#ackCity").val(),
					};
					customAttributes.push(ackCity);
				}
				if ($("#ackState").length !== 0) {
					var ackState = {
						AttributeId: BBI.Defaults.customADFAttributes[
							"Acknowledgee State"
						],
						Value: $("#ackState").val(),
					};
					customAttributes.push(ackState);
				}
				if ($("#ackPostalCode").length !== 0) {
					var ackZip = {
						AttributeId: BBI.Defaults.customADFAttributes[
							"Acknowledgee Zip"
						],
						Value: $("#ackPostalCode").val(),
					};
					customAttributes.push(ackZip);
				}
				if ($("#ackCountry").length !== 0) {
					var ackCountry = {
						AttributeId: BBI.Defaults.customADFAttributes[
							"Acknowledgee Country"
						],
						Value: $("#ackCountry").val(),
					};
					customAttributes.push(ackCountry);
				}
				if (
					$("#ackPhone").length !== 0 &&
					$("#ackPhone").val() !== ""
				) {
					var ackPhone = {
						AttributeId: BBI.Defaults.customADFAttributes[
							"Acknowledgee Phone"
						],
						Value: $("#ackPhone").val(),
					};
					customAttributes.push(ackPhone);
				}
				if (
					$("#ackEmail").length !== 0 &&
					$("#ackEmail").val() !== ""
				) {
					var ackEmail = {
						AttributeId: BBI.Defaults.customADFAttributes[
							"Acknowledgee Email"
						],
						Value: $("#ackEmail").val(),
					};
					customAttributes.push(ackEmail);
				}
			}
			if ($("#company:visible").length !== 0) {
				// console.log($("#company").val());
				var company = {
					AttributeId: BBI.Defaults.customADFAttributes[
						"Matching Gift Company"
					],
					Value: $("#company").val(),
				};
				customAttributes.push(company);
			}
			if ($("#spouseName:visible").length !== 0) {
				var spouseName = {
					AttributeId: BBI.Defaults.customADFAttributes["Joint Spouse Name"],
					Value: $("#spouseName").val(),
				};
				customAttributes.push(spouseName);
			}
			if ($("#pledgeID:visible").length !== 0) {
				// console.log($("#pledgeID").val());
				var pledge = {
					AttributeId: BBI.Defaults.customADFAttributes["Pledge ID"],
					Value: $("#pledgeID").val(),
				};
				customAttributes.push(pledge);
			}
			if ($("#frequency:visible").length !== 0) {
				// console.log($("#frequency option:selected").val());
				var startDate = $("#startDate").datepicker("getDate"), //Date.parse();
					DayOfWeek = startDate.getDay(),
					DayOfMonth = startDate.getDate(),
					StartMonth = startDate.getMonth(),
					frequency = $("#frequency").val();
				// var endDate = $("#endDate").val().length !== 0 ? $("#endDate").val() : null;
				if (frequency == 1) {
					donation.Gift["Recurrence"] = {
						DayOfWeek: DayOfWeek,
						Frequency: frequency,
						StartDate: startDate,
						// EndDate: endDate
					};
				} else if (frequency == 2) {
					donation.Gift["Recurrence"] = {
						DayOfMonth: DayOfMonth,
						Frequency: frequency,
						StartDate: startDate,
						// EndDate: endDate
					};
				} else {
					donation.Gift["Recurrence"] = {
						DayOfMonth: DayOfMonth,
						Frequency: frequency,
						StartDate: startDate,
						// EndDate: endDate
					};
				}
			}
			if (
				$("#otherArea:visible").length !== 0 &&
				$("#otherArea:visible").val().length > 0
			) {
				var otherArea = {
					Value: $("#otherArea").val(),
				};
				donation.Gift.Comments.push(otherArea);
			}
			donation.Gift.Attributes = customAttributes;
			// one-time gift
			if (
				$("#tabOneTime, #tabRecurring")
				.parent()
				.hasClass("selected")
			) {
				var giftRow = $("#giftListNotEmpty > table > tbody > tr");
				$.each(giftRow, function () {
					var fundAmount = $(this)
						.find(".fund-amount")
						.text()
						.replace("$", "");
					var fundDesignation = $(this)
						.find(".fund-designation")
						.text();
					var gift = {
						Amount: fundAmount,
						DesignationId: fundDesignation,
					};
					designationArray.push(gift);
				});
				donation.Gift.Designations = designationArray;
				// console.log(designationArray);
				// pledge gift
			} else {
				if ($(".amountButton a").hasClass("selected")) {
					donation.Gift.Designations = [{
						Amount: $(".amountButton a.selected").attr("rel"),
						DesignationId: BBI.Defaults.pledgeFund,
					}, ];
				} else if (
					!$(".amountButton").hasClass("selected") &&
					$("#txtAmount2").val() !== ""
				) {
					donation.Gift.Designations = [{
						Amount: $("#txtAmount2").val(),
						DesignationId: BBI.Defaults.pledgeFund,
					}, ];
				}
			}
			donationSuccess = function (data) {
				// no action, automatically forwards to payment part
				// console.log(data);
			};
			donationFail = function (d) {
				$(".BBFormValidatorSummary").html(
					"<p>" + BBI.Methods.convertErrorsToHtml(d) + "</p>"
				);
				$("#adfSubmitButton")
					.on("click", function (e) {
						e.preventDefault();
						if (BBI.Methods.validateADF()) {
							$(this)
								.addClass("disabled")
								.unbind("click");
							BBI.Methods.submitADF();
						}
					})
					.removeClass("disabled");
			};
			// console.log(donation);
			donationService.createDonation(
				donation,
				donationSuccess,
				donationFail
			);
		},
		searchScripts: function () {
			$("input[id*=_txtQuickSearch]").attr("aria-label", "Search");
			$("input[id*='txtQuickSearch']").attr("placeholder", "Search");
			$(".search.closed a").on("click", function (e) {
				e.preventDefault();
				$(this)
					.parent()
					.removeClass("closed")
					.addClass("open");
				$("#mockup .search-container")
					.delay(100)
					.animate({
						"padding-top": "80px",
					});
				$(".QuickSearchTextbox").focus();
				//$('.QuickSearchFormTable').toggle('slow');
			});
			$(".search.open a").on("click", function (e) {
				e.preventDefault();
				$(this)
					.parent()
					.removeClass("open")
					.addClass("closed");
				$("#mockup .search-container")
					.delay(100)
					.animate({
						"padding-top": "0px",
					});
			});
		},
		mobileScripts: function () {
			var $window = $(window),
				$html = $("ul > li.parent > a"),
				$header = $("header");
			$header.append(
				"<button type='button' class='hamburger is-closed animated fadeInRight hide' data-toggle='offcanvas'><span class='hamb-top'></span><span class='hamb-middle'></span><span class='hamb-bottom'></span></button>"
			);
			// console.log($window.outerWidth());

			// $html.append(
			// 	"<span><i class='fa fa-chevron-up' aria-hidden='true'></i></span>"
			// );

			var trigger = $(".hamburger"),
				overlay = $(".overlay"),
				nav = $("ul.nav.navbar-nav"),
				expandToggle = $("ul.nav > li > a > span"),
				isClosed = false;
			trigger.click(function () {
				hamburger_cross();
			});
			expandToggle.click(function (event) {
				event.preventDefault();
				$(this)
					.find("i")
					.toggleClass("rotate");
				$(this)
					.parent()
					.toggleClass("open");
				$(this)
					.parent("a")
					.next(".nccUlMenuSub1")
					.slideToggle();
			});

			function hamburger_cross() {
				if (isClosed == true) {
					overlay.hide();
					trigger.removeClass("is-open");
					trigger.addClass("is-closed");
					isClosed = false;
					nav.removeClass("slideOut");
					$("body").toggleClass("no-scroll");
				} else {
					overlay.show();
					trigger.removeClass("is-closed");
					trigger.addClass("is-open");
					isClosed = true;
					nav.addClass("slideOut");
					$("body").toggleClass("no-scroll");
				}
			}
			$("[data-toggle='offcanvas']").click(function () {
				$("#wrapper").toggleClass("toggled");
			});
		},
		footerScripts: function () {
			/* FOOTER SCRIPTS */
			$("footer ul.nav").wrap("<div class='one-third column'></div>");
			$("footer .row .one-third:first-child").prepend('<label>Quick Links</label>');

			if ($(document).scrollTop() > 300) {
				$("header").addClass("reduced");
				$(".scrollToTop").fadeIn();
			}
			$(document).on("scroll", function () {
				if ($(document).scrollTop() > 400) {
					$(".scrollToTop").fadeIn("slow");
				} else {
					$(".scrollToTop").fadeOut("slow");
				}
				if ($(document).scrollTop() > 200) {
					$("header").addClass("reduced");
					$("button.hamburger").addClass("reduced");
				} else {
					$("header").removeClass("reduced");
					$("button.hamburger").removeClass("reduced");
				}
			});
			$(".scrollToTop").click(function (e) {
				e.preventDefault();
				$("html, body").animate({
						scrollTop: 0,
					},
					300
				);
				return false;
			});
		},
		convertErrorToString: function (error) {
			if (error) {
				if (error.Message) return error.Message;
				switch (error.ErrorCode) {
					case 101:
						return error.Field + " is required.";
					case 105:
						return error.Field + " is not valid.";
					case 106:
						return "Record for " + error.Field + " was not found.";
					case 203:
						return "Donation not completed on BBSP.";
					case 107:
						return "Max length for " + error.Field + " exceeded.";
					default:
						return "Error code " + error.ErrorCode + ".";
				}
			}
		},
		convertErrorsToHtml: function (errors) {
			var i,
				message = "Unknown error.<br/>";
			if (errors) {
				message = "";
				for (i = 0; i < errors.length; i++) {
					message =
						message +
						BBI.Methods.convertErrorToString(errors[i]) +
						"<br/>";
				}
			}
			return message;
		},
		adminStyleFixes: function () {
			$(
				'[class*="show-for-"], [class*="hide-for-"], .fullWidthBackgroundImage, .fullWidthBackgroundImageInner'
			).attr("class", "");
			$("header div")
				.not('[id^="pane"], [id^="pane"] div')
				.css("position", "static");
			$(".fullWidthBackgroundImageInner").show();
		},
		getUrlVars: function () {
			// Gets variables and values from URL
			var vars = {};
			var parts = window.location.href.replace(
				/[?&]+([^=&]+)=([^&]*)/gi,
				function (m, key, value) {
					vars[key] = unescape(value.replace(/\+/g, " "));
				}
			);
			return vars;
		},
		returnQueryValueByName: function (name) {
			return BLACKBAUD.api.querystring.getQueryStringValue(name);
		},
		fixPositioning: function () {
			// Fix positioning:
			$('div[id *= "_panelPopup"]').appendTo("body");
			$('div[id *= "_designPaneCloak"]').css({
				top: "0px",
				left: "0px",
			});
			$(".DesignPane").css("position", "relative");
		},
		setCookie: function (c_name, value, exdays) {
			var exdate = new Date();
			//allows for reading cookies across subdomains
			var cd = window.location.host.substr(
				window.location.host.indexOf(".")
			);
			exdate.setDate(exdate.getDate() + exdays);
			var c_value =
				escape(value) +
				(exdays == null ? "" : "; expires=" + exdate.toUTCString());
			document.cookie =
				c_name + "=" + c_value + "; domain=" + cd + "; path=/";
		},
		readCookie: function (name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(";");
			for (var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == " ") c = c.substring(1, c.length);
				if (c.indexOf(nameEQ) == 0)
					return c.substring(nameEQ.length, c.length);
			}
			return null;
		},
		initMobileHeader: function () {
			$("#mobileLogo").headroom({
				offset: 80,
			});
		},
		mobileSubMenu: function () {
			$(".mobileCanvas.rightCanvas ul.menu li.parent > a").click(function (
				event
			) {
				if (
					$(this)
					.parent()
					.hasClass("open")
				) {
					// open link
				} else {
					event.preventDefault();
					$(this)
						.parent()
						.toggleClass("open");
					$(this)
						.next()
						.slideToggle();
				}
			});
		},
		datePicker: function () {
			if ($("#startDate").length !== 0) {
				var d = new Date(),
					day = d.getDate();

				function getMinDate() {
					var date = new Date();
					if (day > 15) {
						console.log("over 15th!");
						date.setMonth(date.getMonth() + 1, 1);
					} else if (day == 1) {
						// set to current date
					} else {
						date.setDate(15);
					}
					return date;
				}
				$("#startDate").datepicker({
					beforeShowDay: function (dt) {
						return [
							dt.getDate() == 1 || dt.getDate() == 15 ?
							true :
							false,
						];
					},
					minDate: getMinDate(),
				});
				$("#startDate").datepicker("setDate", getMinDate());
			}
		},
		/**********************************************
		CUSTOM DONATION FORM
		   Broken Down into 3 Objects by Step
		***********************************************/
		customSingleDonationForm: {
			// Add Classes to parent Tbody of each section of the hidden form
			tbodyClasses: function () {
				//console.log("customSingleDonationForm");
				// Set Vars
				var donationInfo,
					additionalInfo,
					designationSelectList,
					billingInfo,
					tributeInfo,
					paymentInfo;
				// Donation Information/Amount
				donationInfo = $('[id*="txtAmount"]')
					.parents("tbody")
					.addClass("donationInfo");
				// Additional Information
				additionalInfo = $('[id*="trDesignation"]')
					.parents("tbody")
					.addClass("additionalInfo");
				// Billing Information
				billingInfo = $('[id*="DonationCapture1_txtFirstName"]')
					.parents("tbody")
					.addClass("billingInfo");
				// Tribute Information
				tributeInfo = $('[id*="lblTributeHeading"]')
					.parents("tbody")
					.addClass("tributeInfo");
				// Tribute Name
				//tributeNameInput = '.tributeInfo [id*="trTributeName"] input[id*="txtTribute"]';
				// Tribute Type Select List
				//tributeTypeSelectList = '.tributeInfo [id*="trTributeDesc"] select[id*="ddlTribute"]';
				// Tribute Description Input
				//tributeDescInput = '.tributeInfo [id*="trTributeDesc2"] input[id*="txtTributeDescription"]';
				// Payment Information
				//paymentInfo = $('[id*="DonationCapture1_lblCardHoldersName"]').parents('tbody').addClass('paymentInfo');
			},
			/**********************************************
			Step 1 - Get Designation ID and Gift Amount
			***********************************************/
			stepOneGivingDetails: {
				fundDesignationOption: function () {
					var shownFundList, hiddenFundDesgList;
					hiddenFundDesgList = $(
							'.additionalInfo select[id*="ddlDesignations"]'
						)
						.children()
						.clone();
					$('<select id="fundDesignList"></select>').prependTo(
						"ul.fundDesignation li.fundDesignationList"
					);
					shownFundList = "select#fundDesignList";
					if (
						$(
							"ul.fundDesignation li.fundDesignationList select option"
						).length === 0
					) {
						$(hiddenFundDesgList).prependTo(shownFundList);
					}
					$("select#fundDesignList option").click(function () {
						$("select#fundDesignList option:selected").removeAttr(
							"checked",
							"true"
						);
						$(this).attr("checked", "true");
					});
					// Match Selected Fund to Hidden Fund
					$(shownFundList).on("change", function () {
						var shownFundListSelected = $(
							"select#fundDesignList option:selected"
						);
						var hiddenFundList =
							'.additionalInfo select[id*="ddlDesignations"]';
						$(hiddenFundList)
							.find(
								'option[value="' +
								shownFundListSelected.val() +
								'"]'
							)
							.attr("selected", true);
					});
				},
				clickHiddenAmount: function () {
					$('input[value="rdoOther"]').click(); // auto-select "Other" amount option in hidden form (on page load)
					var checkedRadio = $(
						'.givingAmountOptions input[name="amount"]:checked'
					).val(); // set initial val for :checked option (on page load)
					$('.DonationFormTable input[id$="txtAmount"]').val(
						checkedRadio
					);
				},
				// Donation Amount
				donationAmount: function () {
					$("#addToCart a").on("click", function (e) {
						e.preventDefault();
						console.log("addTOcart here");
						var sum = 0;
						// iterate through each amount cell and add the values
						$(".fund-amount").each(function () {
							var value = $(this)
								.text()
								.replace("$", "");
							// add only if the value is number
							if (!isNaN(value) && value.length != 0) {
								sum += parseFloat(value);
							}
							$(".adfTotalAmount span").text(sum);
						});
					});
					/*var otherAmountRadio = $('.givingAmountOptions .otherAmount input[type="radio"]#otherAmt');
					var otherAmountText = $('.givingAmountOptions .otherAmount input[type="text"]');
					var giftAmountShown = $('.givingAmountOptions input[type="radio"][id*="opt"]');
					var giftAmountHidden = $('.DonationFormTable input[id$="txtAmount"]');

					giftAmountShown.change(function() {
						var rdoAmtChk = $('.givingAmountOptions input[type="radio"][id*="opt"]:checked').val();
						otherAmountText.val('');
						otherAmountText.attr('disabled', true);
						giftAmountHidden.val(rdoAmtChk);
					});

					otherAmountRadio.click(function() {
					   otherAmountText.attr('disabled', false);
					});

					otherAmountText.keyup(function() {
						giftAmountHidden.val($(this).val());
					});*/
				},
			},
			/**********************************************
			Step 2 - GET DONOR NAME AND BILLING INFO
			***********************************************/
			stepTwoDonorInfo: {
				// STEP 2A: GET BILLING NAME
				billingName: function () {
					var billingFirstName,
						billingLastName,
						hiddenFirstName,
						hiddenLastName;
					billingFirstName = ".donorFirstName #billingFirstName";
					billingLastName = ".donorLastName #billingLastName";
					hiddenFirstName = '.billingInfo [id*="txtFirstName"]';
					hiddenLastName = '.billingInfo [id*="txtLastName"]';
					// Get First Name entered
					$(billingFirstName).blur(function () {
						var billingFirstNameEnt = $(this).val();
						if ($(this).val() !== "") {
							$(hiddenFirstName).val(billingFirstNameEnt);
						}
					});
					// Get Last Name entered
					$(billingLastName).blur(function () {
						var billingLastNameEnt = $(this).val();
						if ($(this).val() !== "") {
							$(hiddenLastName).val(billingLastNameEnt);
						}
					});
				},
				// STEP 2B: GET BILLING ADDRESS
				billingAddress: function () {
					var billingAddress, hiddenBillingAddress;
					billingAddress = ".personalInfoList #billingAddress";
					hiddenBillingAddress = '.billingInfo [id*="AddressLine"]';
					// Get Address entered
					$(billingAddress).change(function () {
						var billingAddressEnt = $(this).val();
						if ($(this).val() !== "") {
							$(hiddenBillingAddress).val(billingAddressEnt);
						}
					});
				},
				// STEP 2C: GET BILLING Title
				billingTitleList: function () {
					var shownTitleList, hiddenTitleList;
					hiddenTitleList = $(
							'.DonationCaptureFormTable select[id*="Title"]'
						)
						.children()
						.clone();
					shownTitleList = ".donorTitle select#nameTitleList";
					if ($("select#nameTitleList option").length === 0) {
						$(hiddenTitleList).prependTo(shownTitleList);
					}
					$("#nameTitleList option:eq(0)").text("Title");
					$("select#nameTitleList option").click(function () {
						$("select#nameTitleList option:selected").removeAttr(
							"checked",
							"true"
						);
						$(this).attr("checked", "true");
					});
					// Match Selected Fund to Hidden Fund
					$(shownTitleList).on("change", function () {
						var shownTitleListSelected = $(
							"select#nameTitleList option:selected"
						);
						var hiddenTitleList =
							'.DonationCaptureFormTable select[id*="Title"]';
						$(hiddenTitleList)
							.find(
								'option[value="' +
								shownTitleListSelected.val() +
								'"]'
							)
							.attr("selected", true);
					});
				},
				// STEP 2D: GET BILLING City
				billingCity: function () {
					var billingCity, hiddenCity;
					billingCity = ".wrapCity #billingCity";
					hiddenCity = '.billingInfo [id*="City"]';
					// Get City entered
					$(billingCity).blur(function () {
						var billingCityEnt = $(this).val();
						if ($(this).val() !== "") {
							$(hiddenCity).val(billingCityEnt);
						}
					});
				},
				// STEP 2E: GET BILLING COUNTRY
				billingCountryList: function () {
					var shownCountryList, hiddenCountryList;
					hiddenCountryList = $(
							'.DonationCaptureFormTable [id*="Country"]'
						)
						.children()
						.clone();
					shownCountryList = "select#billingCountry";
					if ($("select#billingCountry option").length === 0) {
						$(hiddenCountryList).prependTo(shownCountryList);
					}
					/*
					$('select#billingCountry option').click(function () {
					$('select#billingCountry option:selected').removeAttr('selected', true);
					$(this).attr('selected', true);
					$(hiddenCountryList).find('option[value="' + $(this).val() + '"]')
					.attr('selected', true);
					$('.DonationCaptureFormTable [id*="Country"] option').trigger('change');

							  });
					*/
					// Match Selected Fund to Hidden Fund
					$("select#billingCountry option").click(function () {
						var shownCountryListSelected = $(
							"select#billingCountry option:selected"
						);
						var hiddenCountryList =
							'.DonationCaptureFormTable [id*="Country"]';
						$(hiddenCountryList)
							.find(
								'option[value="' +
								shownCountryListSelected.val() +
								'"]'
							)
							.attr("selected", true);
						var hiddenCountrySelected = $(
							'.DonationCaptureFormTable [id*="Country"]'
						).find("option:selected");
						// $(hiddenCountrySelected).trigger('change');
						// console.log(hiddenCountrySelected);
					});
				},
				// STEP 2F: GET BILLING STATE
				billingStateList: function () {
					var shownStateList, hiddenStateList;
					hiddenStateList = $(
							'.DonationCaptureFormTable [id*="State"]'
						)
						.children()
						.clone();
					shownStateList = "select#billingState";
					if ($("select#billingState option").length === 0) {
						$(hiddenStateList).prependTo(shownStateList);
					}
					$("#billingState option:eq(0)").text("State");
					$("select#billingState option").click(function () {
						$("select#billingState option:selected").removeAttr(
							"checked",
							"true"
						);
						$(this).attr("checked", "true");
					});
					// Match Selected State to Hidden State
					$(shownStateList).on("change", function () {
						var shownStateListSelected = $(
							"select#billingState option:selected"
						);
						var hiddenStateList =
							'.DonationCaptureFormTable [id*="State"]';
						$(hiddenStateList)
							.find(
								'option[value="' +
								shownStateListSelected.val() +
								'"]'
							)
							.attr("selected", true);
					});
				},
				// STEP 2G: GET BILLING ZIP
				billingZip: function () {
					var billingZip, hiddenZip;
					billingZip = ".wrapZip #zip";
					hiddenZip = '.DonationFormTable [id*="Zip"]';
					// Grab ZIP entered
					$(billingZip).blur(function () {
						var billingZipEnt = $(this).val();
						if ($(this).val() !== "") {
							$(hiddenZip).val(billingZipEnt);
						}
					});
				},
				// STEP 2H: GET BILLING PHONE
				billingPhone: function () {
					var billingPhone, hiddenBillingPhone;
					billingPhone = ".personalInfoList #billingPhone";
					hiddenBillingPhone = '.billingInfo [id*="txtPhone"]';
					// Grab Phone value
					$(billingPhone).blur(function () {
						var billingPhoneEnt = $(this).val();
						if ($(this).val() !== "") {
							$(hiddenBillingPhone).val(billingPhoneEnt);
						}
					});
				},
				// STEP 2I: GET BILLING EMAIL
				billingEmail: function () {
					var billingEmail, hiddenBillingEmail;
					billingEmail = ".personalInfoList #email";
					hiddenBillingEmail = '.billingInfo [id*="txtEmailAddress"]';
					// Grab Email value
					$(billingEmail).blur(function () {
						var billingEmailEnt = $(this).val();
						if ($(this).val() !== "") {
							$(hiddenBillingEmail).val(billingEmailEnt);
						}
					});
				},
			},
			/**********************************************
			Step 3 - PAYMENT INFO HANDLER
			***********************************************/
			stepThreePaymentInfo: {
				// PART 3A:
				// GET CARDHOLDER NAME AND VALIDATE ON KEYUP
				cardholder: function () {
					var cardholder, hiddenCardholder;
					cardholder = ".paymentInfo #cardholder";
					hiddenCardholder = '.paymentInfo [id*="txtCardholder"]';
					// Get Cardholder Name entered
					$(cardholder).keyup(function () {
						var cardHolderEnt = $(this).val();
						if ($(this).val() !== "") {
							$(hiddenCardholder).val(cardHolderEnt);
						}
					});
				},
				// PART 3B:
				// GET CARD NUMBER, VALIDATE, AND UPDATE CLASS
				cardNumber: function () {
					var cardNumber,
						hiddenCardNumber,
						cardTypeEnt,
						creditCardValidator,
						cardTypeVisa,
						cardTypeMasterCard,
						cardTypeAmEx,
						cardTypeDiscover,
						cardTypeInvalid,
						cardType;
					cardNumber = ".paymentInfo #cardNumber";
					hiddenCardNumber =
						'table.DonationFormTable input[id*="txtCardNumber"]'; // RegEx Cardnumber Pattern
					creditCardValidator = new RegExp(
						/^\d{4}-?\d{4}-?\d{4}-?\d{3,4}$/
					); // Visa Card Type
					cardTypeVisa = new RegExp(/^4$/); // MasterCard Card Type
					cardTypeMasterCard = new RegExp(/^5$/); // American Express Card Type
					cardTypeAmEx = new RegExp(/^3$/); // Discover Card Type
					cardTypeDiscover = new RegExp(/^6$/); // Invalid Card Type
					cardTypeInvalid = new RegExp(/^(0|1|2|7|8|9)$/); // Dynamic text of card type selected
					cardType = ".cardTypeEnt";
					cardTypeEnt = $(cardType).text(); // Get Card Number entered
					// Match Number to CardType on Keyup
					$(cardNumber).keyup(function () {
						// console.log("cardNumber keyup");
						if (
							$(this)
							.val()
							.match(cardTypeVisa)
						) {
							$(this)
								.removeClass()
								.addClass("cardTypeVisa");
							$(cardType).html("Visa");
							$(
									'table.DonationFormTable select[id*="cboCardType"]'
								)
								.find("option:contains(Visa)")
								.attr("selected", "selected");
						} else if (
							$(this)
							.val()
							.match(cardTypeMasterCard)
						) {
							$(this)
								.removeClass()
								.addClass("cardTypeMasterCard");
							$(cardType).html("MasterCard");
							$(
									'table.DonationFormTable select[id*="cboCardType"]'
								)
								.find("option:contains(MasterCard)")
								.attr("selected", "selected");
						} else if (
							$(this)
							.val()
							.match(cardTypeAmEx)
						) {
							$(this)
								.removeClass()
								.addClass("cardTypeAmEx");
							$(cardType).html("American Express");
							$(
									'table.DonationFormTable select[id*="cboCardType"]'
								)
								.find("option:contains(American)")
								.attr("selected", "selected");
						} else if (
							$(this)
							.val()
							.match(cardTypeDiscover)
						) {
							$(this)
								.removeClass()
								.addClass("cardTypeDiscover");
							$(cardType).html("Discover");
							$(
									'table.DonationFormTable select[id*="cboCardType"]'
								)
								.find("option:contains(Discover)")
								.attr("selected", "selected");
						} else if (
							$(this)
							.val()
							.match(cardTypeInvalid) ||
							$(this).val() === ""
						) {
							$(this)
								.removeClass()
								.addClass("cardTypeInvalid");
							$(".cardTypeEnt").text("");
						}
					});
					$(".cardTypeEnt").text(cardTypeEnt); // Get Card Type Based on Card Number
					// Grab Credit Card value
					$(cardNumber).keyup(function () {
						var cardNumEnt = $(cardNumber).val();
						if (
							$(this)
							.val()
							.match(creditCardValidator)
						) {
							$(this)
								.removeClass("invalid")
								.addClass("valid");
							$(
								'input[id*="DonationCapture1_txtCardNumber"]'
							).val(cardNumEnt);
						} else {
							$(this)
								.removeClass("valid")
								.addClass("invalid");
						}
					});
					// Validate and Update Class
					$(cardNumber).blur(function () {
						var cardNumEnt = $(cardNumber).val();
						if (
							$(this)
							.val()
							.match(creditCardValidator)
						) {
							$(this)
								.removeClass("invalid")
								.addClass("valid");
							$(
								'input[id*="DonationCapture1_txtCardNumber"]'
							).val(cardNumEnt);
						} else {
							$(this)
								.removeClass("valid")
								.addClass("invalid");
						}
					});
				},
				// PART 3C:
				// CARD EXPIRATION HANDLER
				cardExp: function () {
					var cardExpMonth,
						cardExpYear,
						hiddenCardExpMonth,
						hiddenCardExpYear,
						hiddenCardExpMonthClone,
						hiddenCardExpYearClone; // Card Expiration Month
					cardExpMonth = "select#cardExpMonth"; // Card Expiration Year
					cardExpYear = "select#cardExpYr"; // Hidden Exp Month
					hiddenCardExpMonth =
						'table.DonationFormTable select[id*="cboMonth"]'; // Hidden Exp Year
					hiddenCardExpYear =
						'table.DonationFormTable select[id*="cboYear"]'; // Clone Hidden Exp Month
					hiddenCardExpMonthClone = $(hiddenCardExpMonth)
						.children()
						.clone(); // Clone Hidden Exp Year
					hiddenCardExpYearClone = $(hiddenCardExpYear)
						.children()
						.clone(); // Build Card Exp Year Select list Options
					if ($("select#cardExpMonth option").length === 0) {
						$(hiddenCardExpMonthClone).appendTo(
							"select#cardExpMonth"
						);
						$("select#cardExpMonth option:eq(0)").text("Month");
					}
					// Grab Card Exp Month
					$(cardExpMonth).change(function () {
						var cardExpMonthSelected = $(
							"select#cardExpMonth :selected"
						).val();
						$(hiddenCardExpMonth)
							.find(
								'option:contains("' +
								cardExpMonthSelected +
								'")'
							)
							.attr("selected", "selected");
					});
					// Grab Hidden Values and Append to this Dropdown
					if ($("select#cardExpYr option").length === 0) {
						$(hiddenCardExpYearClone).appendTo("select#cardExpYr");
						$("select#cardExpYr option:eq(0)").text("Year");
					}
					// Grab Card Exp Year
					$(cardExpYear).change(function () {
						var cardExpYearSelected = $(
							"select#cardExpYr :selected"
						).val();
						$(hiddenCardExpYear)
							.find(
								'option:contains("' + cardExpYearSelected + '")'
							)
							.attr("selected", "selected");
						// console.log('Year selected');
					});
				},
				// PART 3D:
				// EXTRACT ALL CSC VALUES
				cardCSC: function () {
					var cardSecCode, cscValidator, hiddenCardSecurityCode;
					cardSecCode = "input#cscCode"; // Card Security Code
					cscValidator = new RegExp(/^\d{3,4}$/); // CSC Validation RegEx Pattern
					hiddenCardSecurityCode =
						'table.DonationFormTable input[id*="txtCSC"]'; // Hidden/Old Form Vars
					// Validate CSC Field and Update Class
					$(cardSecCode).blur(function () {
						var cscEnt = $(cardSecCode).val();
						if (
							!$(this)
							.val()
							.match(cscValidator)
						) {
							$(this).addClass("invalid");
						} else {
							$(this)
								.removeClass("invalid")
								.addClass("valid");
							$(hiddenCardSecurityCode).val(cscEnt);
							//$('.paymentInfo ul.paymentInfo li[class*="card"]').addClass('siblingsComplete');
							$(".paymentInfo h3").addClass("complete");
						}
					});
				},
				// PART 6: STORE HIDDEN DATA AND UPDATE IF NEEDED
				hiddenDataPersistence: function () {
					var error = $("div[id$=ValidationSummary1]");
					if (error.children().length > 0) {
						var billingFirstName =
							".donorFirstName #billingFirstName";
						var hiddenFirstName =
							'.billingInfo [id*="txtFirstName"]';
						var hiddenFirstNameEnt = $(hiddenFirstName).val();
						$(billingFirstName).val(hiddenFirstNameEnt);
						var billingLastName = ".donorLastName #billingLastName";
						var hiddenLastName = '.billingInfo [id*="txtLastName"]';
						var hiddenLastNameEnt = $(hiddenLastName).val();
						$(billingLastName).val(hiddenLastNameEnt);
						var billingAddress =
							".personalInfoList #billingAddress";
						var hiddenBillingAddress =
							'textarea[id$="AddressLine"]';
						var hiddenAddressEnt = $(hiddenBillingAddress).val();
						$(billingAddress).val(hiddenAddressEnt);
						var billingCity = ".wrapCity #billingCity";
						var hiddenCity = 'input[id$="CityUS"]';
						var hiddenCityEnt = $(hiddenCity).val();
						$(billingCity).val(hiddenCityEnt);
						var billingZip = ".wrapZip #zip";
						var hiddenZip = 'input[id$="ZipUS"]';
						var hiddenZipEnt = $(hiddenZip).val();
						$(billingZip).val(hiddenZipEnt);
						var billingPhone = ".personalInfoList #billingPhone";
						var hiddenBillingPhone =
							'.billingInfo [id*="txtPhone"]';
						var hiddenPhoneEnt = $(hiddenBillingPhone).val();
						$(billingPhone).val(hiddenPhoneEnt);
						var billingEmail = ".personalInfoList #email";
						var hiddenBillingEmail =
							'.billingInfo [id*="txtEmailAddress"]';
						var hiddenEmailEnt = $(hiddenBillingEmail).val();
						$(billingEmail).val(hiddenEmailEnt);
					}
				},
				autoFillExtraction: function () {
					// CHECK IF DESIGNATION PRESENT
					var designationCheck = $(
						"span[id$=DesignationValue]"
					).text();
					$("#fundDesignList").append(
						$("<option>", {
							value: designationCheck,
						}).text(designationCheck)
					);
					// PART 7: EXTRACT ALL VALUES
					$("input#cscCode").blur(function () {
						var billingFirstName =
							".donorFirstName #billingFirstName";
						var hiddenFirstName =
							'.billingInfo [id*="txtFirstName"]';
						var billingFirstNameEnt = $(billingFirstName).val();
						$(hiddenFirstName).val(billingFirstNameEnt);
						var billingLastName = ".donorLastName #billingLastName";
						var hiddenLastName = '.billingInfo [id*="txtLastName"]';
						var billingLastNameEnt = $(billingLastName).val();
						$(hiddenLastName).val(billingLastNameEnt);
						var billingAddress =
							".personalInfoList #billingAddress";
						var hiddenBillingAddress =
							'.billingInfo [id*="AddressLine"]';
						var billingAddressEnt = $(billingAddress).val();
						$(hiddenBillingAddress).val(billingAddressEnt);
						var billingCity = ".wrapCity #billingCity";
						var hiddenCity = '.billingInfo [id*="City"]';
						var billingCityEnt = $(billingCity).val();
						$(hiddenCity).val(billingCityEnt);
						var billingZip = ".wrapZip #zip";
						var hiddenZip = '.DonationFormTable [id*="Zip"]';
						var billingZipEnt = $(billingZip).val();
						$(hiddenZip).val(billingZipEnt);
						var billingPhone = ".personalInfoList #billingPhone";
						var hiddenBillingPhone =
							'.billingInfo [id*="txtPhone"]';
						var billingPhoneEnt = $(billingPhone).val();
						$(hiddenBillingPhone).val(billingPhoneEnt);
						var billingEmail = ".personalInfoList #email";
						var hiddenBillingEmail =
							'.billingInfo [id*="txtEmailAddress"]';
						var billingEmailEnt = $(billingEmail).val();
						$(hiddenBillingEmail).val(billingEmailEnt);
					});
				},
				submitButton: function () {
					$(
						'.DonationButtonCell input[type="submit"].DonationSubmitButton'
					).prependTo(".submitButton");
				},
			}, // END STEP 3 PAYMENT INFO
			/* Animate Step Here */
			stepOneToggleAnimations: function () {
				$(".donateAmount h3").addClass("complete");
				$(".donorInfo .personalInfoList")
					.removeClass("hide")
					.slideDown();
				$(".donorInfo")
					.find("h3")
					.removeClass();
				$("#billingFirstName").focus();
			},
			stepToggles: function () {
				$(
					'#wrapSingleGivingForm .givingAmountOptions .rdoAmount input[type="radio"]'
				).click(function () {
					if (
						$(this).is(":checked") &&
						$("ul.giftType").length === 0
					) {
						BBI.Methods.customSingleDonationForm.stepOneToggleAnimations();
					}
				});
				$(
					'#wrapSingleGivingForm .givingAmountOptions .otherAmount input[type="text"]'
				).blur(function () {
					if ($(this).val() !== "" && $("ul.giftType").length === 0) {
						BBI.Methods.customSingleDonationForm.stepOneToggleAnimations();
					}
				});
				$(
					'#wrapSingleGivingForm .giftType li input[type="checkbox"]'
				).click(function () {
					if ($(this).is(":checked")) {
						BBI.Methods.customSingleDonationForm.stepOneToggleAnimations();
					}
				});
				/* STEP 3 HIDDEN Here */
				$('input#email[type="email"]').keyup(function () {
					var emailValidator = new RegExp(
						/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
					);
					if (
						$(this)
						.val()
						.match(emailValidator)
					) {
						$(".paymentInfo")
							.removeClass("hide")
							.slideDown();
						$(".donorInfo")
							.find("h3")
							.addClass("complete");
						$(".paymentInfo")
							.find("h3")
							.removeClass();
						//$('#cardholder').focus();
					}
				});
				if ($("body").hasClass("Explorer")) {
					$(".personalInfoList input#email").keyup(function () {
						var emailValidator = new RegExp(
							/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
						);
						if (
							$(this)
							.val()
							.match(emailValidator)
						) {
							$(".paymentInfo")
								.removeClass("hide")
								.slideDown();
							$(".donorInfo")
								.find("h3")
								.addClass("complete");
							$(".paymentInfo")
								.find("h3")
								.removeClass();
							//$('#cardholder').focus();
						}
					});
				}
			},
			hiddenFormValidation: function () {
				// Form Error(s) Text
				$(
					'#wrapSingleGivingForm + [id*="UpdatePanel"] .DonationFormTable [id*="ValidationSummary1"].DonationValidationSummary'
				).insertBefore(".donateAmount");
				// Form Submitted Text
				var forSubmittedText = $(
					'[id*="lblThanks"].DonationMessage'
				).insertBefore(".donateAmount");
				if ($(forSubmittedText).length) {
					$("fieldset.step").hide();
				}
			},
		}, // END CUSTOM SINGLE DONATION
		resetBackgrounds: function () {
			$(".wrapBreadcrumbs p img").show();
			$(
				"#internalPage .inner-wrap .siteWrapper .fullWidthBackgroundImage"
			).removeAttr("style");
		},
	},
};
// Run global scripts...
BBI.Methods.pageInit();
// reset the backgrounds when the screen width changes
var $window = $(window);
var lastWindowWidth = $window.width();
$window.resize(function () {
	/* Do not calculate the new window width twice.
	 * Do it just once and store it in a variable. */
	var windowWidth = $window.width();
	/* Use !== operator instead of !=. */
	if (lastWindowWidth !== windowWidth) {
		// EXECUTE YOUR CODE HERE
		BBI.Methods.resetBackgrounds();
		lastWindowWidth = windowWidth;
	}
});
// document.write('<scr'+'ipt src="/file/web-dev/jquery.bxslider.min.js"></scr'+'ipt>');
// Case insensitive version of ':contains()'
jQuery.expr[":"].Contains = function (a, i, m) {
	return (
		jQuery(a)
		.text()
		.toUpperCase()
		.indexOf(m[3].toUpperCase()) >= 0
	);
};
// Make it safe to use console.log always
window.log = function () {
	log.history = log.history || [];
	log.history.push(arguments);
	if (this.console) {
		arguments.callee = arguments.callee.caller;
		var a = [].slice.call(arguments);
		typeof console.log === "object" ?
			log.apply.call(console.log, console, a) :
			console.log.apply(console, a);
	}
};
(function (b) {
	function c() {}
	for (
		var d = "assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(
				","
			),
			a;
		(a = d.pop());

	) {
		b[a] = b[a] || c;
	}
})(
	(function () {
		try {
			console.log();
			return window.console;
		} catch (err) {
			return (window.console = {});
		}
	})()
);