var _____WB$wombat$assign$function_____ = function (name) {
	return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name];
};
if (!self.__WB_pmw) {
	self.__WB_pmw = function (obj) {
		this.__WB_source = obj;
		return this;
	}
} {
	let window = _____WB$wombat$assign$function_____("window");
	let self = _____WB$wombat$assign$function_____("self");
	let document = _____WB$wombat$assign$function_____("document");
	let location = _____WB$wombat$assign$function_____("location");
	let top = _____WB$wombat$assign$function_____("top");
	let parent = _____WB$wombat$assign$function_____("parent");
	let frames = _____WB$wombat$assign$function_____("frames");
	let opener = _____WB$wombat$assign$function_____("opener");

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
	--------------------------------------------------------------------
	 Changelog:
	====================================================================
	 07/23/2015  Nick Fogle - Updated Alumni site root path for API calls
	 07/29/2015  Nick Fogle - Refactored Plugin Functions
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
				errormsg: '',
				date: true,
				dateformat: 'default',
				titletag: 'h4',
				content: true,
				snippet: true,
				snippetlimit: 120,
				linktarget: '_self'
			};


			// extend options
			options = $.extend(defaults, options);


			// return functions
			return this.each(function (i, e) {
				var s = '';

				// Check for SSL protocol
				if (options.ssl) {
					s = 's';
				}

				// add class to container
				if (!$(e).hasClass('rssFeed')) {
					$(e).addClass('rssFeed');
				}

				// check for valid url
				if (url === null) {
					return false;
				}

				// create yql query
				var query = 'http' + s + '://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from feed where url="' + url + '"');
				if (options.limit !== null) {
					query += ' limit ' + options.limit;
				}
				query += '&format=json';

				// send request
				$.getJSON(query, function (data, status, errorThrown) {
					// if successful... *
					if (status === 'success') {
						// * run function to create html result
						process(e, data, options);

						// * optional callback function
						if ($.isFunction(fn)) {
							fn.call(this, $(e));
						}

						// if there's an error... *
					} else if (status === 'error' || status === 'parsererror') {
						// if showerror option is true... *
						if (options.showerror) {
							// variable scoping (error)
							var msg;

							// if errormsg option is not empty... *
							if (options.errormsg !== '') {
								// * assign custom error message
								msg = options.errormsg;

								// if errormsg option is empty... *
							} else {
								// * assign default error message
								msg = errorThrown;
							}

							// * display error message
							$(e).html('<div class="rssError"><p>' + msg + '</p></div>');

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
			var html = '';
			var htmlObject;

			// for each entry... *
			$.each(entries, function (i) {
				// * assign entry variable
				var entry = entries[i];
				var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
				var pubDate;
				var titlelink = entry.title.replace(/[^\w\s]/gi, '');
				var categoryClasses = ' ' + entry.categories.toString().replace(/ &amp; /g, ' ').replace(/ /g, '-').replace(/,/g, ' ');

				// if date option is true... *
				if (entry.pubDate) {
					// * create date object
					var entryDate = new Date(entry.pubDate);

					// * select date format
					if (options.dateformat === 'default') {
						pubDate = (entryDate.getMonth() + 1).toString() + '/' + entryDate.getDate().toString() + '/' + entryDate.getFullYear();
					} else if (options.dateformat === 'spellmonth') {
						pubDate = months[entryDate.getMonth()] + ' ' + entryDate.getDate().toString() + ', ' + entryDate.getFullYear();
					} else if (options.dateformat === 'localedate') {
						pubDate = entryDate.toLocaleDateString();
					} else if (options.dateformat === 'localedatetime') {
						pubDate = entryDate.toLocaleDateString() + ' ' + entryDate.toLocaleTimeString();
					}
				}

				// * build entry
				html += '<div class="storyTileOuterWrapper"><div class="storyTileInnerWrapper" data-tag="' + tags + '">';
				html += '<div class="storyTileTextWrapper"><div class="storyTileTitle"><' + options.titletag + '><a href="' + entry.link + '" title="View this feed at ' + entries.title + '">' + entry.title + '</a></' + options.titletag + '>';
				if (options.date && pubDate) {
					html += '<div class="storyTileDate">' + pubDate + '</div>';
				}

				// if content option is true... *
				if (options.content) {
					var content = entry.description;
					html += '<div class="storyTileDescription">' + content + '</div>';
				}
				html += '</div>';
			});

			// provisional html result
			htmlObject = $(html);
			htmlObject.find('.storyTileInnerWrapper').each(function () {

				$(this).prepend('<div class="storyTileImage">');
				$(this).find('.storyTileImage').prepend($(this).find('img').first());

			});
			$(e).append(htmlObject);

			// Apply target to links
			$('a', e).attr('target', options.linktarget);
		};

	})(jQuery);


	var BBI = BBI || {

		Config: {
			version: 1.0,
			updated: '12/22/2015 4:30 PM',
			isEditView: !!window.location.href.match('pagedesign'),
			slideshowRan: false
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
				if (BLACKBAUD.api.pageInformation.rootPath === 'https://web.archive.org/web/20180119002129/https://www.alumni.uc.edu/') {
					return "c832a72a-813b-4d01-8606-3cfe8cd9b756";
				} else {
					return "66fcd70c-bbfb-4a99-97da-6efa4370624e";
				}
			})(),
			// the funds to be included in the cascading dropdown
			cascadingFundsQueryId: (function () {
				if (BLACKBAUD.api.pageInformation.rootPath === 'https://web.archive.org/web/20180119002129/https://www.alumni.uc.edu/') {
					return "73136bc9-4d41-4abb-a6fc-ff44fc5cb595";
				} else {
					return "5ccf0e08-69e1-4d23-9882-601100a43b4b";
				}
			})(),
			// this should be set to the GUID of the Fund that greatest need gifts are applied to
			greatestNeedFund: (function () {
				if (BLACKBAUD.api.pageInformation.rootPath === 'https://web.archive.org/web/20180119002129/https://www.alumni.uc.edu/') {
					return "898c3603-1440-4b38-9145-19d79effeb2c";
				} else {
					return "7318410e-17bd-4d1f-8437-d5742754a93a";
				}
			})(),
			// this should be set to the GUID of the pledge fund
			pledgeFund: (function () {
				if (BLACKBAUD.api.pageInformation.rootPath === 'https://web.archive.org/web/20180119002129/https://www.alumni.uc.edu/') {
					return "c21f1095-b071-4107-8942-0f1af860ea97";
				} else {
					return "6f0e4d60-1df1-495a-9e01-82b3e9d91aff";
				}
			})(),
			// this should be set to the GUID of the Fund that free text gifts are applied to
			generalFreeFormFund: (function () {
				if (BLACKBAUD.api.pageInformation.rootPath === 'https://web.archive.org/web/20180119002129/https://www.alumni.uc.edu/') {
					return "c21f1095-b071-4107-8942-0f1af860ea97";
				} else {
					return "6f0e4d60-1df1-495a-9e01-82b3e9d91aff";
				}
			})(),
			// GUID for membership fund
			// membershipFundId: "bcf8cd1a-0a22-4f2f-bd14-8040a272d6ed",
			// this should be set to the GUID of the Merchant account (unused - payment part)
			// MerchantAccountId: "864426b2-20a0-43aa-95f6-c850d757b026",
			newsFeedUrl: 'https://web.archive.org/web/20180119002129/https://foundation.uc.edu/feed.rss?id=1',
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
				"Pledge ID": "01d9e45d-533f-4759-ba10-07fd687a202c"
			},
			monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			titleTable: "456ffd4c-0fbf-49db-a503-0726f86e2a39"
		},

		Methods: {

			pageInit: function () {
				//All functions which should run instantly
				BBI.Methods.menuToggles();
				//Style fixes in admin view
				if (BBI.Config.isEditView) {
					BBI.Methods.adminStyleFixes();
				} else {
					BBI.Methods.initADF();
					BBI.Methods.foundationbgFix();
					BBI.Methods.buildSocialButtons();
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
					BBI.Methods.jobOpportunities();
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
					$('iframe[id*= twitter]').css('display', 'inline-block');
				}
				//end instant functions
				//Runs on partial page refresh
				Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(function () {
					BBI.Methods.pageRefresh();
					BBI.Methods.customSingleDonationForm.stepTwoDonorInfo.billingCountryList();
					BBI.Methods.customSingleDonationForm.stepTwoDonorInfo.billingStateList();
				});
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
				if ($('.mobileCanvas.show-for-small:visible').length && $('tbody[id$=tbdForgotPWDUserName]').length) {
					$('.leftCanvas').toggleClass('expanded', 1000, 'easeInOutQuart');
					$('.rightCanvas').toggleClass('retracted', 1000, 'easeInOutQuart');
				}
				// Hide New User Prompt if Already Signed In
				if ($('.mobileCanvas.show-for-small:visible').length && $('input[id$=btnLogout]').length) {
					$('.mobileCanvas .offcanvasReg').hide();
				}
			},

			pageLoad: function () {
				// Runs on full page load
				if (!BBI.Config.isEditView) {
					this.foundationMediaOverlay();
				}
				//add search placeholder
				$('#ucBand input[id*="_txtQuickSearch"]').attr('placeholder', 'Search UC');
				$('.mobileCanvas .QuickSearchTextbox').prop('placeholder', 'Search UC Foundation');
				// payment part 2.0 functions
				if ($('.PaymentPart_FormContainer').length > 0) {
					// remove payment part links
					$('.PaymentPart_CartCell.PaymentPart_CartDescriptionCell > a').contents().unwrap().wrap('<span></span>');
					$(".PaymentPart_CartItemDetails:has('div')").prevAll().hide();

					// change "Other" designation text
					if ($('.wrapButtons a:contains("Make Another Gift")').length === 0) {
						var des = $('.PaymentPart_CartCell.PaymentPart_CartDescriptionCell').find('span:contains("Other")');
						if (des.length !== 0) {
							$(des).text('Pledge Payment');
						}
					}
				}
			},

			createMenuSVG: function () {
				$('.alumni #mainMenu .mainMenu .nccUlMenuSub2').each(function () {
					var height = $(this).height();
					var width = Math.floor(height / 10);
					$(this).append('<svg viewbox="0 0 ' + width + ' ' + height + '" height="' + height + '" width="' + width + '" style="position:absolute; top: 0; right: -' + (width - 1) + 'px" ><polygon points="0,0 0,' + height + ' ' + width + ',0" style="fill:#de1c24;" /></svg>');
				});
			},

			initAccordions: function () {
				if ($('table.accordionTable').length > 0) {
					$('table.accordionTable').each(function () {
						$(this).replaceWith($(this).html()
							.replace(/<tbody/gi, "<div class='accordionWrapper'")
							.replace(/<td/gi, "<div")
							.replace(/<\/td>/gi, "</div>")
							.replace(/<\/tbody/gi, "<\/div")
						);
					});
					$('.accordionWrapper').each(function () {
						$(this).find('.headerRow').on('click', function () {
							$(this).parent().find('.contentRow').slideToggle(300);
							$(this).parent().find('.headerRow').toggleClass('active');
						});
					});
				}
			},

			coerStyles: function () {
				if ($('#status-table').length !== 0) {
					$('#status-table').addClass('clearfix');
					$('span[id*="rptAttendeesDetails"]').not('[style], [id*="udpAttendees"]').parent('td, div.cell').addClass('labelTd');
					$('[id*="udpAttendees"]').parent('td, div.cell').addClass('mainTd');
					if ($('.mainTd').length > 1) {
						$('.mainTd').css('width', '50%');
						$('.mainTd').last().css('border-left', '1px solid #CCC').css('padding-left', '10px');
						$('#divWizardButtons').css('max-width', '100%');
					}
				}
			},

			donationAmount: function () {
				var amountValue = BLACKBAUD.api.querystring.getQueryStringValue('amount');
				if (amountValue.length !== 0 && $('.DonationFormTable input[id$="txtAmount"]').length !== 0) {
					$('.DonationFormTable input[id$="txtAmount"]').val(amountValue);
				} else if (amountValue.length !== 0 && $('#advancedDonationForm input[id$="txtAmount"]').length !== 0) {
					$('.DonationFormTable input[id$="txtAmount"]').val(amountValue);
					$('.amountButton .selected').removeClass('selected');
					$('#adfOtherLabel').hide();
					$('#txtAmount').show().val(amountValue);
					$('.adfTotalAmount span').text(amountValue);
				}
			},

			foundationMediaOverlay: function () {
				// set the backgroundimage to show,
				// since the following code will hide if need be
				//$('.wrapBreadcrumbs p img').show();



				if ($('#internalPage .mediaBoxOverlay').length !== 0) {
					var parentDiv = $('.mediaBoxOverlay').closest('.container');
					if ($(window).width() > 768) {
						// $('.mediaBoxOverlay').css('height', $('.mediaBoxOverlay').parent().height() - 30);
					}
					parentDiv.append('<i class="mediaBoxToggle">');
					$('.mediaBoxToggle').on('click', function () {

						$('.mediaBoxOverlay').toggle({
							effect: "scale",
							direction: "both",
							origin: ["bottom", "right"]
						});
						$(this).toggleClass('expanded');
					});
				} else if ($('#internalPage.alumni .wrapBreadcrumbs p img').length !== 0) {
					var backgroundImage = $('.wrapBreadcrumbs p img');
					var backgroundImageURL = backgroundImage.attr('src');
					$('.fullWidthBackgroundImage').css({
						'background-image': 'url(' + backgroundImageURL + ')',
						'background-position': 'center top'
					});
					backgroundImage.closest('p').hide();
				} else if ($('#homePage .mediaBoxOverlay').length !== 0) {
					var backgroundImage = $('.wrapBreadcrumbs p img');
					var backgroundImageURL = backgroundImage.attr('src');
					$('.fullWidthBackgroundImage').css({
						'background-image': 'url(' + backgroundImageURL + ')',
						'background-position': 'center top'
					});
					backgroundImage.closest('p').hide();
				}

				if ($('.utilityMenus .offcanvasReg').length !== 0) {
					if ($('.utilityMenus a[id*="lbtnRegisterUser"]').length !== 0) {
						$('.utilityMenus a[id*="lbtnRegisterUser"]').after($('.utilityMenus .offcanvasReg'));
					}

					$('.utilityMenus table[id*="tbl"]').wrap('<div class="animatedReveal">');
					$('.utilityMenus li.login a').on('click', function () {
						if ($(this).hasClass('active')) {
							$(this).removeClass('active');
							$('.utilityMenus table[id*="tbl"]').hide('blind', 'slow');
						} else {
							$(this).addClass('active');
							$('.utilityMenus table[id*="tbl"]').show('blind', 'slow');
						}
					});
				}
			},

			replaceBoxgridTables: function () {
				// Replace HTML tables with DIVs - landing page box grid elements
				if ($('.boxGridTable').length > 0) {
					$('table.boxGridTable').each(function () {
						$(this).replaceWith($(this).html()
							.replace(/<tbody/gi, "<div class='boxGrid'")
							.replace(/<tr/gi, "<div class='gutter clearfix'")
							.replace(/<td/gi, "<div")
							.replace(/<\/th>/gi, "</div>")
							.replace(/<\/td>/gi, "</div>")
							.replace(/<\/tbody/gi, "<\/div")
						);
					});
					$('.boxGrid').wrapAll('<div id="boxGridWrapper" />');
					$('#boxGridWrapper').wrapInner('<div class="gutter clearfix" />');
				}

				if ($('.boxGrid').length !== 0) {
					$('.boxGrid').hover(function () {
						$('.boxGridCaption', this).stop().animate({
							opacity: '0'
						}, {
							duration: 300
						}, {
							queue: 'false'
						});
						$('.boxGridReveal', this).stop().animate({
							bottom: '0'
						}, {
							opacity: '1'
						}, {
							duration: 300
						}, {
							queue: 'false'
						});
					}, function () {
						$('.boxGridCaption', this).stop().animate({
							opacity: '1'
						}, {
							duration: 300
						}, {
							queue: 'false'
						});
						$('.boxGridReveal', this).stop().animate({
							bottom: '-100%'
						}, {
							opacity: '0'
						}, {
							duration: 300
						}, {
							queue: 'false'
						});
					});
				}
			},

			menuToggles: function () {
				$('.leftCanvas .menuToggle').on('click', function (e) {
					e.preventDefault();
					$('#BodyId').toggleClass('menu-open');
					$('.leftCanvas').toggleClass('expanded');
					$('.rightCanvas').toggleClass('retracted');
					setTimeout(function () {
						$("#mobileLogo").toggleClass('expanded');
					}, $("#mobileLogo").hasClass('expanded') ? 600 : 0);
				});
				$('.rightCanvas .menuToggle').on('click', function (e) {
					e.preventDefault();
					$('#BodyId').toggleClass('menu-open');
					$('.fa').toggleClass('fa-bars fa-close');
					$(this).toggleClass('open');
					$('.rightCanvas').toggleClass('expanded');
					$('.leftCanvas').toggleClass('retracted');
					setTimeout(function () {
						$("#mobileLogo").toggleClass('expanded');
					}, $("#mobileLogo").hasClass('expanded') ? 600 : 0);
				});
			},

			designationSearchFormat: function () {
				if ($('span.designationInfoBoxOuter').length !== 0) {
					var desingationItems = $("span.designationInfoBoxOuter");
					for (var i = 0; i < desingationItems.length; i += 3) {
						desingationItems.slice(i, i + 3).wrapAll("<div style='clear:both'></div>");
					}
				}
			},

			newsAndCalendarFeed: function () {
				if ($('.eventTileOuterWrapper').length !== 0) {
					$('.eventTileOuterWrapper').each(function () {
						var eventDate = new Date($.trim($(this).find('.eventDateData').text()));
						$(this).insertBefore($(this).closest('.BBDesignationSearchResultContainer'));
						$(this).find('.eventTileMonth').text(BBI.Defaults.monthNames[eventDate.getMonth()]);
						$(this).find('.eventTileDay').text(eventDate.getDate());
						if ($.trim($(this).find('.eventUrlData').text()) !== '') {
							$(this).find('.eventTileLink > a').attr('href', $.trim($(this).find('.eventUrlData').text()));
						} else {
							$(this).find('.eventTileLink').hide();
						}

					});

					if ($('.internalLanding').length !== 0) {
						$('.eventTileOuterWrapper').first().parent().rssfeed(BBI.Defaults.newsFeedUrl, {
							limit: 6,
							ssl: true,
							snippet: false,
							titletag: 'h3',
							header: false
						});
					}
				}

				if ($('.landingPage .newsTileOuterWrapper').length !== 0) {
					$('.newsTileOuterWrapper').html('').rssfeed(BBI.Defaults.newsFeedUrl, {
						limit: 4,
						ssl: true,
						snippet: false,
						titletag: 'h3',
						header: false
					});
				}

				if ($('#homePage').not('.foundation').length !== 0) {
					$('#mainContentWrapper .primaryContent').rssfeed(BBI.Defaults.newsFeedUrl, {
						limit: 6,
						ssl: true,
						snippet: false,
						titletag: 'h3',
						header: false
					});
				}

				if ($('.contentPaneHeader .allEventsButton').length !== 0) {
					$('.allEventsButton[data-control]').on('click', function (e) {
						var controlSet = $(this).attr('data-control');
						var newsItems = $('.storyTileOuterWrapper');
						var eventItems = $('.eventTileOuterWrapper');
						var button = $(this).not('selected');
						e.preventDefault();

						if (button.length !== 0) {
							$('.contentPaneHeader .selected').removeClass('selected');
							$(this).addClass('selected');
							if (controlSet === 'news') {
								newsItems.not('visible').show('slide', 'slow');
								eventItems.not('visible').hide('slide', 'slow');
							} else if (controlSet === 'events') {
								eventItems.not('visible').show('slide', 'slow');
								newsItems.not('visible').hide('slide', 'slow');
							} else {
								newsItems.add(eventItems).not('visible').show('slide', 'slow');
							}
						}
					});
				}

				if ($('.eventSlider').length !== 0) {
					$('.sliderContent').each(function () {
						var lineItem = $('<li>');
						$(this).find('.red a').attr('href', $(this).text()).text('Register');
						$(this).find('.outline a').attr('href', $(this).text()).text('More Info');
						lineItem.append($(this));
						$('.eventSlider').append(lineItem);
					});

					$(document).ready(function () {
						if ($(window).width() <= 768) {
							$('.eventSlider').bxSlider({
								minSlides: 1,
								maxSlides: 1,
								slideWidth: ($('#newsWrapper .inner').width()),
								pager: true,
								controls: false
							});
						} else {
							$('.eventSlider').bxSlider({
								minSlides: 3,
								maxSlides: 3,
								slideWidth: ($('#newsWrapper .inner').width() / 3) - 44,
								slideMargin: 33,
								pager: false
							});
						}
					});
				}

				$(document).ready(function () {
					if ($('.storySlider').length !== 0) {
						if ($(window).width() <= 768) {
							$('.storySlider').bxSlider({
								minSlides: 1,
								maxSlides: 1,
								slideWidth: ($('#storiesWrapper .inner').width()),
								controls: false
							});
						} else {
							$('.storySlider').bxSlider({
								minSlides: 1,
								maxSlides: 1,
								slideWidth: ($('#storiesWrapper .inner').width()),
								pager: false
							});
						}
					}
				});

				if ($('.BBDesignationSearchResultContainer .foundationCalendarGridItem').length !== 0) {
					var calendarItems = $('.foundationCalendarGridItem').closest('.BBDesignationSearchResult');
					for (var i = 0; i < calendarItems.length; i += 2) {
						calendarItems.slice(i, i + 2).wrapAll("<div class='foundationCalendarColumn'></div>");
					}
					BBI.Methods.getImagesFromFolder('Event Tile Images', BBI.Methods.foundationGridImages);
				}
			},

			getImagesFromFolder: function (folderPath, callback) {
				var jsonPath = BLACKBAUD.api.pageInformation.rootPath + 'WebApi/Images/' + folderPath;
				$.getJSON(jsonPath, function (data) {
					callback(data);
				});
			},

			foundationGridImages: function (imageArray) {
				var imagePos = 0;
				var targets = $('.foundationCalendarGridImage:visible img');
				targets.each(function () {
					$(this).attr('src', imageArray[imagePos].Url);
					imagePos++;
				});
			},

			initEventWrapper: function () {
				if ($('.eventWrapper').length !== 0) {
					var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
					$('.eventWrapper').each(function () {
						var dateString = $(this).find('.hiddenDataFields').text();
						var eventDate = new Date(dateString);
						var monthName = monthNames[eventDate.getMonth()];
						var yearString = eventDate.getFullYear().toString().substring(2);
						if (eventDate.getDate() === 1) {
							$(this).find('sup').text('st');
						} else if (eventDate.getDate() === 2) {
							$(this).find('sup').text('nd');
						} else if (eventDate.getDate() === 3) {
							$(this).find('sup').text('rd');
						}
						$(this).find('.hiddenDataFields').hide();
						$(this).find('.dateItem').text(eventDate.getDate());
						$(this).find('abbr[title]').text(monthName);
						$(this).find('.calYear').html('&rsquo;' + yearString);
					});
				}
			},

			designationSearchBoxes: function () {
				if ($('.designationInfoBox').length != 0) {
					$('.designationInfoBox').each(function () {
						var donationLink = $(this).find('hiddenData a').attr('href');
						var systemID = $(this).find('hiddenData').text();

						$(this).closest('.BBDesignationSearchResult').addClass('designationInfoBoxOuter');

						$(this).find('.designationInfoBoxGiveButton').attr('href', donationLink);
						$(this).find('.designationInfoBoxInfoButton').attr('href', donationLink);
					});
				}
			},

			initADF: function () {
				if ($('#advancedDonationForm').length !== 0) {
					setTimeout(function () {
						//highlight query param amount
						$('.amountButton a').each(function () {
							var currentButtonText = $(this).html();
							if (currentButtonText.charAt(0) === '$') {
								currentButtonText = currentButtonText.slice(1);
								// console.log("currentButtonText= " + currentButtonText);
							}
							if (BBI.Methods.getUrlVars().amount == currentButtonText) {
								$(this).addClass('selected');
								$('#txtAmount').css('color', 'transparent');
							}
						});
					}, 300);

					//init the tabs
					BBI.Methods.initAdfTabs();

					//date pickers
					$('#startDate').datepicker();
					$('#endDate').datepicker({
						changeMonth: true,
						changeYear: true
					});

					//enter default 'greatest need' designation
					$('#designationId').val(BBI.Defaults.greatestNeedFund);
					$('.designationButton').first().find('a').attr('rel', BBI.Defaults.greatestNeedFund);

					//highlight clicked amounts
					$('.amountButton a').on('click', function () {
						//highlight clicked amounts
						$('.amountButton .selected').removeClass('selected');
						$(this).addClass('selected');
						$('#txtAmount').val($(this).attr('rel'));
						$('#txtAmount').hide();
						$('#adfOtherLabel').show();
						$('.giftAmountError').remove();

						//update display
						var amount = $('.amountButton a.selected').attr('rel');
						$('.adfTotalAmount span').html(amount);
					});

					$('#txtAmount').on('blur keyup', function () {
						//update display
						$('.adfTotalAmount span').html($('#txtAmount').val());
					});

					//reset when manually entering an amount
					$('#adfOtherLabel').on('click', function () {
						$('.amountButton .selected').removeClass('selected');
						$(this).hide();
						$('#txtAmount').show().val('').focus();
						$('.giftAmountError').remove();
					});

					//$('#designationAreaDropdown').on('change', function() {
					//    if ($(this).val() !== '-1') {
					//        $('.adfOtherDesignationSubSection').show('blind','slow');
					//    } else {
					//        $('.adfOtherDesignationSubSection').hide('blind','slow');
					//    }
					//});

					//progressive display toggles
					$('.checkboxToggle').on('change', function () {
						var targetString = $(this).attr('data-controler');
						var targetContent = $('#' + targetString);
						if ($(this).attr('checked')) {
							targetContent.show('blind', 'slow');
						} else {
							targetContent.hide('blind', 'slow');
						}
					});

					//populate dynamic dropdowns
					BBI.Methods.populateCounrtryDropdowns();
					BBI.Methods.populateTitle();
					BBI.Methods.populateDesignationIds();
					BBI.Methods.populateCascadingFields();

					//other area text entry.
					$('.otherArea').on('click', function () {
						$('#otherArea').focus();
					});

					$('#otherArea').on('blur', function () {
						$('#designationId').val(BBI.Defaults.generalFreeFormFund);
					}).on('focus', function () {
						$('.designationButton .selected').removeClass('selected');
						$('#fundDesignation1').val('0');
						$('#fundDesignation2').val('0').hide();
					});

					$('#adfSubmitButton').on('click', function (e) {
						e.preventDefault();
						if (BBI.Methods.validateADF()) {
							$(this).addClass('disabled').unbind('click');
							BBI.Methods.submitADF();
						}
					});
				}
			},

			populateCounrtryDropdowns: function () {
				var countryService = new BLACKBAUD.api.CountryService({
					url: BBI.Defaults.rootpath,
					crossDomain: false
				});
				countryService.getCountries(function (country) {
					$.each(country, function () {
						$("#ackCountry").append($("<option></option>").val(this["Abbreviation"]).text(this["Description"]).attr("id", this["Id"]));
					});
					BBI.Methods.populateStateDropdowns($("#ackCountry").find('[value="USA"]').attr('id'));
					$("#ackCountry").val('USA').on('change', function () {
						var countryID = $(this).find(':selected').attr('id');
						BBI.Methods.populateStateDropdowns(countryID);
					});
				});
			},

			populateStateDropdowns: function (countryID) {
				var countryService = new BLACKBAUD.api.CountryService({
					url: BBI.Defaults.rootpath,
					crossDomain: false
				});
				countryService.getStates(countryID, function (state) {
					$('#ackState option:gt(0)').remove();
					$.each(state, function () {
						$('#ackState').append($('<option></option>').val(this["Abbreviation"]).text(this["Description"]));
					});
				});
			},

			// get title table
			populateTitle: function () {
				var selectAckTitle = $('#ackTitle');

				$.get(BLACKBAUD.api.pageInformation.rootPath + 'webapi/CodeTable/' + BBI.Defaults.titleTable, function (data) {
					for (var i = 0, j = data.length; i < j; i++) {
						selectAckTitle.append('<option value="' + data[i].Id + '">' + data[i].Description + '</option>');
					}
				}).done(function () {
					selectAckTitle.val('-1').change();
				});
			},

			populateDesignationIds: function () {
				var queryService = new BLACKBAUD.api.QueryService();

				queryService.getResults(BBI.Defaults.highlightedFundsQueryId, function (data) {
					var fields = data.Fields,
						rows = data.Rows,
						fieldArray = [];
					$.each(fields, function (key, value) {
						fieldArray[value.Name] = key;
					});
					$.each(rows, function () {
						var values = this['Values'],
							designationID = values[fieldArray['System record ID']],
							designationName = values[fieldArray['Public name']], // use friendly name
							itemHTML = '<li class="designationButton"><a rel="' + designationID + '">' + designationName + '</a></li>';
						$('.designationButtonWrapper').append(itemHTML);
					});
					$('.designationButton a').on('click', function () {
						$('.designationButton .selected').removeClass('selected');
						$(this).addClass('selected');
						$('#designationId').val($(this).attr('rel'));
						$('#fundDesignation1').val('0');
						$('#fundDesignation2').val('0').hide();
					});
				});
			},

			populateCascadingFields: function () {
				// get designations for drop-down (cascading)
				// note: must be attached to a query that returns Public Name and System Record ID
				var mainDesignation = $('#fundDesignation1');
				var subDesignation = $('#fundDesignation2');

				if ($(mainDesignation).length !== 0) {
					var queryService = new BLACKBAUD.api.QueryService();
					queryService.getResults(BBI.Defaults.cascadingFundsQueryId, function (data) {
						// fund data
						var allFunds = data.Rows;
						var fundMaster = [];
						var topLevelAll = [];

						// remove all options in main drop-down except the first
						$(mainDesignation).find('option').not('option:first').remove();

						// get drop-down hierarchy and clean arrays
						$.each(allFunds, function () {
							// define values
							var values = this.Values;
							var target = values[3];
							var splitter = target.split('\\');

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
							$(mainDesignation).append($("<option></option>").val(value).text(value));
						});

						// category drop-down
						$(mainDesignation).on('change', function () {
							// remove selected class from designation buttons
							$('.designationButton .selected').removeClass('selected');

							// define designation selection
							var selection = $(this).val();

							// remove all options in sub drop-down except the first
							$(subDesignation).find('option').not('option:first').remove();

							// loop through funds
							$.each(fundMaster, function (x, subFund) {
								// append GUID if terminal
								if (subFund[0] === selection) {
									$(subDesignation).append($("<option></option>").val(subFund[1]).text(subFund[2]));
								}
							});

							// toggle designation drop-down
							if ($(this).val() === '0') {
								$(subDesignation).hide();
							} else {
								$(subDesignation).show();
							}
						});
					});
				}
			},

			initAdfTabs: function () {
				//default state
				$('#adfTributToggle').show();
				$('#adfFrequency').hide();

				$('#adfTabsMenu a').on('click', function () {
					var tabReference = $(this).attr('id');
					$('#adfTabsMenu .selected').removeClass('selected');
					$(this).parent('li').addClass('selected');
					//handle states of form
					if (tabReference === 'tabRecurring') {
						$('#adfTributToggle').hide();
						$('#adfFrequency').show();

					} else if (tabReference === 'tabPledge') {
						$('#adfFrequency').hide();

					} else if (tabReference === 'tabFaculty') {
						$('#adfFrequency').hide();

					} else { //tabOneTime
						//default state
						$('#adfTributToggle').show();
						$('#adfFrequency').hide();

					}
				});

			},

			validateADF: function () {
				var ValidationMessage = [];
				var isValid = true;
				$('.required:visible').each(function () {
					if ($.trim($(this).val()) === '' || $(this).val() == '-1') {
						var requiredFieldMessage = '<span class="invalidLabel adfNote"><i class="fa fa-exclamation-circle"></i>This is a required field.</span>';
						isValid = false;
						$(this).addClass('invalid');
						$(this).after(requiredFieldMessage);
					}
				});
				if ($('#giftListEmpty').is(':visible')) {
					// console.log(isValid + ":(");
					isValid = false;
					$('.BBFormValidatorSummary').html('<p class="giftAmountError">Please add an item to your cart.</p>');
				}
				$('.invalid').first().focus();
				$('.invalid').on('keydown', function () {
					$(this).unbind('keydown');
					$(this).removeClass('invalid');
					$(this).parent().find('.invalidLabel').remove();
				});
				return isValid;
			},

			submitADF: function () {
				var partId = $('.BBDonationApiContainer').attr('data-partid'),
					donationService = new BLACKBAUD.api.DonationService(partId, {
						url: BBI.Defaults.rootpath,
						crossDomain: false
					}),
					giftAmount = $('#txtAmount').val(),
					designationID = $('#designationId').val(),
					customAttributes = [],
					designationArray = [];

				var donation = {
					"Gift": {
						"Designations": [],
						"IsAnonymous": false,
						"MerchantAccountId": BBI.Defaults.MerchantAccountId
					}
				};

				// if the path contains "/givetoday",
				// this is an appeal, so let's add the ID
				if (window.location.pathname.toLowerCase().startsWith('/givetoday')) {
					var origin = {
						"AppealId": "BF7730F5-C275-4C2F-A08C-A33A29F2FBBA",
						"PageId": BLACKBAUD.api.pageInformation.pageId
						//, "PageName": "Advanced Donation Form"
					}

					donation.Origin = origin;
				}


				// if the path contains "/impact2016"
				// Appeal: FY17 Faculty & Staff Campaign – CYE2016
				// this is an appeal, so let's add the ID
				if (window.location.pathname.toLowerCase().startsWith('/impact2016')) {
					var origin = {
						"AppealId": "b76d6373-51f0-4268-a35c-92bb1c8de65f",
						"PageId": BLACKBAUD.api.pageInformation.pageId
						//, "PageName": "Advanced Donation Form"
					}

					donation.Origin = origin;
				}


				// if the path contains "/impact16"
				// Appeal: FY17 Faculty & Staff Campaign – CYE16
				// this is an appeal, so let's add the ID
				if (window.location.pathname.toLowerCase().startsWith('/givetoday')) {
					var origin = {
						"AppealId": "55a0b0ac-ed24-470e-b42f-5a537eca152f",
						"PageId": BLACKBAUD.api.pageInformation.pageId
						//, "PageName": "Advanced Donation Form"
					}

					donation.Origin = origin;
				}

				if ($('#anonymous:checked').length !== 0) {
					donation.Gift.IsAnonymous = true;
				}

				//other area free text entry
				if ($('#giftListNotEmpty .otherDesignation').length !== 0) {
					donation.Gift.Comments = "Area of support: " + $('#giftListNotEmpty .otherDesignation .fund-name').text();
				}

				if ($('#fundDesignation2 option:selected').val() !== "0") {
					designationID = $('#fundDesignation2 option:selected').val();
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
				if ($('#adfTributToggle > label > input:checked').length !== 0) {
					if ($('#tributeType:visible').length !== 0) {
						var tributeType = {
							"AttributeId": BBI.Defaults.customADFAttributes['Tribute Gift Type'],
							"Value": $('#tributeType').val()
						};
						customAttributes.push(tributeType);
					}

					if ($('#honoreeFirstName').length !== 0 && $('#honoreeLastName').length !== 0) {
						var honoreeName = {
							"AttributeId": BBI.Defaults.customADFAttributes['Honoree Name'],
							"Value": $('#honoreeFirstName').val() + ' ' + $('#honoreeLastName').val()
						};
						customAttributes.push(honoreeName);
					}
				}

				// acknowledgee attributes
				if ($('#ackCheck > input:checked').length !== 0) {
					if ($('#ackTitle').length !== 0 && $('#ackTitle').val() !== '-1') {
						var ackTitle = {
							"AttributeId": BBI.Defaults.customADFAttributes['Acknowledgee Title'],
							"Value": $('#ackTitle option:selected').text()
						};
						customAttributes.push(ackTitle);
					}

					if ($('#ackFirstName').length !== 0) {
						var ackFirstName = {
							"AttributeId": BBI.Defaults.customADFAttributes['Acknowledgee First Name'],
							"Value": $('#ackFirstName').val()
						};
						customAttributes.push(ackFirstName);
					}

					if ($('#ackLastName').length !== 0) {
						var ackLastName = {
							"AttributeId": BBI.Defaults.customADFAttributes['Acknowledgee Last Name'],
							"Value": $('#ackLastName').val()
						};
						customAttributes.push(ackLastName);
					}

					if ($('#ackAddressLines').length !== 0) {
						var ackAddress = {
							"AttributeId": BBI.Defaults.customADFAttributes['Acknowledgee Address'],
							"Value": $('#ackAddressLines').val()
						};
						customAttributes.push(ackAddress);
					}

					if ($('#ackCity').length !== 0) {
						var ackCity = {
							"AttributeId": BBI.Defaults.customADFAttributes['Acknowledgee City'],
							"Value": $('#ackCity').val()
						};
						customAttributes.push(ackCity);
					}

					if ($('#ackState').length !== 0) {
						var ackState = {
							"AttributeId": BBI.Defaults.customADFAttributes['Acknowledgee State'],
							"Value": $('#ackState').val()
						};
						customAttributes.push(ackState);
					}

					if ($('#ackPostalCode').length !== 0) {
						var ackZip = {
							"AttributeId": BBI.Defaults.customADFAttributes['Acknowledgee Zip'],
							"Value": $('#ackPostalCode').val()
						};
						customAttributes.push(ackZip);
					}

					if ($('#ackCountry').length !== 0) {
						var ackCountry = {
							"AttributeId": BBI.Defaults.customADFAttributes['Acknowledgee Country'],
							"Value": $('#ackCountry').val()
						};
						customAttributes.push(ackCountry);
					}

					if ($('#ackPhone').length !== 0 && $('#ackPhone').val() !== '') {
						var ackPhone = {
							"AttributeId": BBI.Defaults.customADFAttributes['Acknowledgee Phone'],
							"Value": $('#ackPhone').val()
						};
						customAttributes.push(ackPhone);
					}

					if ($('#ackEmail').length !== 0 && $('#ackEmail').val() !== '') {
						var ackEmail = {
							"AttributeId": BBI.Defaults.customADFAttributes['Acknowledgee Email'],
							"Value": $('#ackEmail').val()
						};
						customAttributes.push(ackEmail);
					}

					// not on form
					if ($('#ackClassYear:visible').length !== 0) {
						var ackClassYear = {
							"AttributeId": BBI.Defaults.customADFAttributes['UC Graduation Year'],
							"Value": $('#ackClassYear').val()
						};
						customAttributes.push(ackClassYear);
					}

					// not on form
					if ($('#ackDegree:visible').length !== 0) {
						var ackDegree = {
							"AttributeId": BBI.Defaults.customADFAttributes['UC Graduation Degree'],
							"Value": $('#ackDegree').val()
						};
						customAttributes.push(ackDegree);
					}
				}

				if ($('#company:visible').length !== 0) {
					var company = {
						"AttributeId": BBI.Defaults.customADFAttributes['Matching Gift Company'],
						"Value": $('#company').val()
					};
					customAttributes.push(company);
				}

				if ($('#spouseName:visible').length !== 0) {
					var spouseName = {
						"AttributeId": BBI.Defaults.customADFAttributes['Joint Spouse Name'],
						"Value": $('#spouseName').val()
					};
					customAttributes.push(spouseName);
				}

				if ($('#pledgeID:visible').length !== 0) {
					var pledge = {
						"AttributeId": BBI.Defaults.customADFAttributes['Pledge ID'],
						"Value": $('#pledgeID').val()
					};
					customAttributes.push(pledge);
				}

				if ($('#frequency:visible').length !== 0) {
					var startDate = Date.parse();
					var endDate = ($('#endDate').val().length !== 0) ? $('#endDate').val() : null;
					donation.Gift['Recurrence'] = {
						"DayOfMonth": 1,
						"Frequency": $('#frequency').val(),
						"StartDate": $('#startDate').val(),
						"EndDate": endDate
					};
				}

				/*if ($('#otherArea:visible').length !== 0 && $('#otherArea:visible').val().length > 0) {
				    var otherArea = {
				        "Value": $('#otherArea').val()
				    };
				    donation.Gift.Comments.push(otherArea);
				}*/

				donation.Gift.Attributes = customAttributes;

				// one-time gift
				if ($('#tabOneTime').parent().hasClass('selected')) {
					var giftRow = $('#giftListNotEmpty > table > tbody > tr');
					$.each(giftRow, function () {
						var fundAmount = $(this).find('.fund-amount').text().replace('$', '');
						var fundDesignation = $(this).find('.fund-designation').text();
						var gift = {
							"Amount": fundAmount,
							"DesignationId": fundDesignation
						};
						designationArray.push(gift);
					});

					donation.Gift.Designations = designationArray;
					// console.log(designationArray);
					// pledge gift
				} else {
					if ($('.amountButton a').hasClass('selected')) {
						donation.Gift.Designations = [{
							'Amount': $('.amountButton a.selected').attr('rel'),
							'DesignationId': BBI.Defaults.pledgeFund
						}];
					} else if (!$('.amountButton').hasClass('selected') && $('#txtAmount').val() !== '') {
						donation.Gift.Designations = [{
							'Amount': $('#txtAmount').val(),
							'DesignationId': BBI.Defaults.pledgeFund
						}];
					}
				}

				donationSuccess = function (data) {
					// no action, automatically forwards to payment part
					// console.log(data);
				};

				donationFail = function (d) {
					$('.BBFormValidatorSummary').html('<p>' + BBI.Methods.convertErrorsToHtml(d) + '</p>');
					$('#adfSubmitButton').on('click', function (e) {
						e.preventDefault();
						if (BBI.Methods.validateADF()) {
							$(this).addClass('disabled').unbind('click');
							BBI.Methods.submitADF();
						}
					}).removeClass('disabled');
				};
				// console.log(donation);
				donationService.createDonation(donation, donationSuccess, donationFail);

			},

			foundationbgFix: function () {
				// Derry Spann Added JS fix
				var wwidth = $(window).width();
				// toggle responsive menu classes for sub menus
				if (wwidth <= 816) {
					var mobileHeroBg = $('.wrapBreadcrumbs img').first().hide().attr('src');
					if (mobileHeroBg) {
						$('.fullWidthBackgroundImage').css({
							'display': 'block',
							//'height': '94vh',
							'position': 'relative',
							'background-image': 'url(' + mobileHeroBg + ')',
							'background-size': 'cover',
							'margin-top': '90px'
						});
					} else {
						$('.fullWidthBackgroundImage').removeAttr("style");
					}
				}

			},

			buildSocialButtons: function () {

				if ($('.socialButtonTable').length > 0) {
					function popUp(url) {
						socialWindow = window.open(url, "littleWindow", "location=no,width=600,height=500,left=300,top=300");
					}
					$(".socialButtonTable").each(function () {
						var buttonType = $(this).find(".socialButtonType").text();
						var buttonClass = "";
						var buttonText = $(this).find(".socialButtonText").text();
						var buttonContent = $(this).find(".socialButtonContent").text();
						var url = "";

						if (buttonType.match("Facebook")) {
							//buttonClass="btn-facebook";url = "https://web.archive.org/web/20180119002129/http://www.facebook.com/sharer/sharer.php?s=100&p[url]=www.CLIENTURL.org&p[title]=CLIENTNAME&p[summary]=";
							buttonClass = "btn-facebook";
							//url = "www.facebook.com";
							url = "https://web.archive.org/web/20180119002129/http://www.facebook.com/sharer.php?u=" + buttonContent;
						} else if (buttonType.match("Twitter")) {
							buttonClass = "btn-twitter";
							//buttonContent = escape(buttonContent);
							url = "https://web.archive.org/web/20180119002129/http://twitter.com/intent/tweet?text=" + buttonContent;
						} else {
							// console.log("invalid button type: " + buttonType);
						}
						//$(this).after("<a class='btn-social "+buttonClass+"' target='_blank' href='"+url+buttonContent+"'><span class='icon'></span><span class='title'>"+buttonText+"</span></a>");
						$(this).after("<a class='btn-social " + buttonClass + "' href='" + url + "'><span class='icon'></span><span class='title'>" + buttonText + "</span></a>");
						$(this).hide();
					});

					$('.btn-social').each(function () {
						$(this).click(function (e) {
							e.preventDefault();
							window.open($(this).attr('href'), 'title', 'width=600,height=400');
							return false;
						});
					});
				}
			},

			convertErrorToString: function (error) {
				if (error) {
					if (error.Message)
						return error.Message;
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
				var i, message = "Unknown error.<br/>";
				if (errors) {
					message = "";
					for (i = 0; i < errors.length; i++) {
						message = message + BBI.Methods.convertErrorToString(errors[i]) + "<br/>";
					}
				}
				return message;
			},

			adminStyleFixes: function () {
				$('[class*="show-for-"], [class*="hide-for-"], .fullWidthBackgroundImage, .fullWidthBackgroundImageInner').attr('class', '');
				$('header div').not('[id^="pane"], [id^="pane"] div').css('position', 'static');
				$('.fullWidthBackgroundImageInner').show();
			},

			getUrlVars: function () {
				// Gets variables and values from URL
				var vars = {};
				var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
					vars[key] = unescape(value.replace(/\+/g, " "));
				});
				return vars;
			},

			returnQueryValueByName: function (name) {
				return BLACKBAUD.api.querystring.getQueryStringValue(name);
			},

			fixPositioning: function () {
				// Fix positioning:
				$('div[id *= "_panelPopup"]').appendTo('body');
				$('div[id *= "_designPaneCloak"]').css({
					"top": "0px",
					"left": "0px"
				});
				$('.DesignPane').css("position", "relative");
			},

			setCookie: function (c_name, value, exdays) {
				var exdate = new Date();
				//allows for reading cookies across subdomains
				var cd = window.location.host.substr(window.location.host.indexOf("."));
				exdate.setDate(exdate.getDate() + exdays);
				var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
				document.cookie = c_name + "=" + c_value + "; domain=" + cd + "; path=/";
			},

			readCookie: function (name) {
				var nameEQ = name + "=";
				var ca = document.cookie.split(';');
				for (var i = 0; i < ca.length; i++) {
					var c = ca[i];
					while (c.charAt(0) == ' ') c = c.substring(1, c.length);
					if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
				}
				return null;
			},

			initMobileHeader: function () {
				$("#mobileLogo").headroom({
					offset: 80
				});
			},

			mobileSubMenu: function () {
				$('.mobileCanvas.rightCanvas ul.menu li.parent > a').click(function (event) {
					if ($(this).parent().hasClass('open')) {
						// open link
					} else {
						event.preventDefault();
						$(this).parent().toggleClass('open');
						$(this).next().slideToggle();
					}
				});
			},

			jobOpportunities: function () {
				$('.job-title').click(function (event) {
					$(this).toggleClass('open').next().slideToggle('slow');
				});
				$('.close-description').click(function (event) {
					$(this).parents('.job-description').slideUp('slow').prev().removeClass('open');
				});
			},

			/**********************************************
			CUSTOM DONATION FORM
			   Broken Down into 3 Objects by Step
			***********************************************/

			customSingleDonationForm: {

				// Add Classes to parent Tbody of each section of the hidden form
				tbodyClasses: function () {
					// Set Vars
					var donationInfo, additionalInfo, designationSelectList, billingInfo, tributeInfo, paymentInfo;
					// Donation Information/Amount
					donationInfo = $('[id*="txtAmount"]').parents('tbody').addClass('donationInfo');
					// Additional Information
					additionalInfo = $('[id*="trDesignation"]').parents('tbody').addClass('additionalInfo');
					// Billing Information
					billingInfo = $('[id*="DonationCapture1_txtFirstName"]').parents('tbody').addClass('billingInfo');
					// Tribute Information
					tributeInfo = $('[id*="lblTributeHeading"]').parents('tbody').addClass('tributeInfo');
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
						hiddenFundDesgList = $('.additionalInfo select[id*="ddlDesignations"]').children().clone();
						$('<select id="fundDesignList"></select>').prependTo('ul.fundDesignation li.fundDesignationList');
						shownFundList = 'select#fundDesignList';
						if ($('ul.fundDesignation li.fundDesignationList select option').length === 0) {
							$(hiddenFundDesgList).prependTo(shownFundList);
						}
						$('select#fundDesignList option').click(function () {
							$('select#fundDesignList option:selected').removeAttr('checked', 'true');
							$(this).attr('checked', 'true');
						});

						// Match Selected Fund to Hidden Fund
						$(shownFundList).on('change', function () {
							var shownFundListSelected = $('select#fundDesignList option:selected');
							var hiddenFundList = '.additionalInfo select[id*="ddlDesignations"]';
							$(hiddenFundList).find('option[value="' + shownFundListSelected.val() + '"]').attr('selected', true);
						});
					},

					clickHiddenAmount: function () {
						$('input[value="rdoOther"]').click(); // auto-select "Other" amount option in hidden form (on page load)
						var checkedRadio = $('.givingAmountOptions input[name="amount"]:checked').val(); // set initial val for :checked option (on page load)
						$('.DonationFormTable input[id$="txtAmount"]').val(checkedRadio);
					},

					// Donation Amount
					donationAmount: function () {
						$('#addToCart a').on('click', function () {
							var sum = 0;
							// iterate through each amount cell and add the values
							$('.fund-amount').each(function () {
								var value = $(this).text().replace('$', '');
								// add only if the value is number
								if (!isNaN(value) && value.length != 0) {
									sum += parseFloat(value);
								}
								$('.adfTotalAmount span').text(sum);
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
					}
				},


				/**********************************************
				Step 2 - GET DONOR NAME AND BILLING INFO
				***********************************************/

				stepTwoDonorInfo: {

					// STEP 2A: GET BILLING NAME
					billingName: function () {
						var billingFirstName, billingLastName, hiddenFirstName, hiddenLastName;
						billingFirstName = '.donorFirstName #billingFirstName';
						billingLastName = '.donorLastName #billingLastName';
						hiddenFirstName = '.billingInfo [id*="txtFirstName"]';
						hiddenLastName = '.billingInfo [id*="txtLastName"]';
						// Get First Name entered
						$(billingFirstName).blur(function () {
							var billingFirstNameEnt = $(this).val();
							if ($(this).val() !== '') {
								$(hiddenFirstName).val(billingFirstNameEnt);
							}
						});
						// Get Last Name entered
						$(billingLastName).blur(function () {
							var billingLastNameEnt = $(this).val();
							if ($(this).val() !== '') {
								$(hiddenLastName).val(billingLastNameEnt);
							}
						});
					},

					// STEP 2B: GET BILLING ADDRESS
					billingAddress: function () {
						var billingAddress, hiddenBillingAddress;
						billingAddress = '.personalInfoList #billingAddress';
						hiddenBillingAddress = '.billingInfo [id*="AddressLine"]';
						// Get Address entered
						$(billingAddress).change(function () {
							var billingAddressEnt = $(this).val();
							if ($(this).val() !== '') {
								$(hiddenBillingAddress).val(billingAddressEnt);
							}
						});
					},
					// STEP 2C: GET BILLING Title
					billingTitleList: function () {
						var shownTitleList, hiddenTitleList;
						hiddenTitleList = $('.DonationCaptureFormTable select[id*="Title"]').children().clone();
						shownTitleList = '.donorTitle select#nameTitleList';
						if ($('select#nameTitleList option').length === 0) {
							$(hiddenTitleList).prependTo(shownTitleList);
						}
						$('#nameTitleList option:eq(0)').text('Title');
						$('select#nameTitleList option').click(function () {
							$('select#nameTitleList option:selected').removeAttr('checked', 'true');
							$(this).attr('checked', 'true');

						});
						// Match Selected Fund to Hidden Fund
						$(shownTitleList).on('change', function () {
							var shownTitleListSelected = $('select#nameTitleList option:selected');
							var hiddenTitleList = '.DonationCaptureFormTable select[id*="Title"]';
							$(hiddenTitleList).find('option[value="' + shownTitleListSelected.val() + '"]').attr('selected', true);
						});
					},
					// STEP 2D: GET BILLING City
					billingCity: function () {
						var billingCity, hiddenCity;
						billingCity = '.wrapCity #billingCity';
						hiddenCity = '.billingInfo [id*="City"]';
						// Get City entered
						$(billingCity).blur(function () {
							var billingCityEnt = $(this).val();
							if ($(this).val() !== '') {
								$(hiddenCity).val(billingCityEnt);
							}
						});
					},
					// STEP 2E: GET BILLING COUNTRY
					billingCountryList: function () {
						var shownCountryList, hiddenCountryList;
						hiddenCountryList = $('.DonationCaptureFormTable [id*="Country"]').children().clone();
						shownCountryList = 'select#billingCountry';

						if ($('select#billingCountry option').length === 0) {
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
						$('select#billingCountry option').click(function () {
							var shownCountryListSelected = $('select#billingCountry option:selected');
							var hiddenCountryList = '.DonationCaptureFormTable [id*="Country"]';
							$(hiddenCountryList).find('option[value="' + shownCountryListSelected.val() + '"]')
								.attr('selected', true);
							var hiddenCountrySelected = $('.DonationCaptureFormTable [id*="Country"]').find('option:selected');
							// $(hiddenCountrySelected).trigger('change');
							// console.log(hiddenCountrySelected);
						});
					},
					// STEP 2F: GET BILLING STATE
					billingStateList: function () {
						var shownStateList, hiddenStateList;
						hiddenStateList = $('.DonationCaptureFormTable [id*="State"]').children().clone();
						shownStateList = 'select#billingState';
						if ($('select#billingState option').length === 0) {
							$(hiddenStateList).prependTo(shownStateList);
						}
						$('#billingState option:eq(0)').text('State');
						$('select#billingState option').click(function () {
							$('select#billingState option:selected').removeAttr('checked', 'true');
							$(this).attr('checked', 'true');
						});
						// Match Selected State to Hidden State
						$(shownStateList).on('change', function () {
							var shownStateListSelected = $('select#billingState option:selected');
							var hiddenStateList = '.DonationCaptureFormTable [id*="State"]';
							$(hiddenStateList).find('option[value="' + shownStateListSelected.val() + '"]').attr('selected', true);
						});
					},
					// STEP 2G: GET BILLING ZIP
					billingZip: function () {
						var billingZip, hiddenZip;
						billingZip = '.wrapZip #zip';
						hiddenZip = '.DonationFormTable [id*="Zip"]';
						// Grab ZIP entered
						$(billingZip).blur(function () {
							var billingZipEnt = $(this).val();
							if ($(this).val() !== '') {
								$(hiddenZip).val(billingZipEnt);
							}
						});
					},
					// STEP 2H: GET BILLING PHONE
					billingPhone: function () {
						var billingPhone, hiddenBillingPhone;
						billingPhone = '.personalInfoList #billingPhone';
						hiddenBillingPhone = '.billingInfo [id*="txtPhone"]';
						// Grab Phone value
						$(billingPhone).blur(function () {
							var billingPhoneEnt = $(this).val();
							if ($(this).val() !== '') {
								$(hiddenBillingPhone).val(billingPhoneEnt);
							}
						});
					},
					// STEP 2I: GET BILLING EMAIL
					billingEmail: function () {
						var billingEmail, hiddenBillingEmail;
						billingEmail = '.personalInfoList #email';
						hiddenBillingEmail = '.billingInfo [id*="txtEmailAddress"]';
						// Grab Email value
						$(billingEmail).blur(function () {
							var billingEmailEnt = $(this).val();
							if ($(this).val() !== '') {
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
						cardholder = '.paymentInfo #cardholder';
						hiddenCardholder = '.paymentInfo [id*="txtCardholder"]';
						// Get Cardholder Name entered
						$(cardholder).keyup(function () {
							var cardHolderEnt = $(this).val();
							if ($(this).val() !== '') {
								$(hiddenCardholder).val(cardHolderEnt);
							}
						});
					},

					// PART 3B:
					// GET CARD NUMBER, VALIDATE, AND UPDATE CLASS
					cardNumber: function () {
						var cardNumber, hiddenCardNumber, cardTypeEnt, creditCardValidator, cardTypeVisa, cardTypeMasterCard, cardTypeAmEx, cardTypeDiscover, cardTypeInvalid, cardType;
						cardNumber = '.paymentInfo #cardNumber';
						hiddenCardNumber = 'table.DonationFormTable input[id*="txtCardNumber"]'; // RegEx Cardnumber Pattern
						creditCardValidator = new RegExp(/^\d{4}-?\d{4}-?\d{4}-?\d{3,4}$/); // Visa Card Type
						cardTypeVisa = new RegExp(/^4$/); // MasterCard Card Type
						cardTypeMasterCard = new RegExp(/^5$/); // American Express Card Type
						cardTypeAmEx = new RegExp(/^3$/); // Discover Card Type
						cardTypeDiscover = new RegExp(/^6$/); // Invalid Card Type
						cardTypeInvalid = new RegExp(/^(0|1|2|7|8|9)$/); // Dynamic text of card type selected
						cardType = '.cardTypeEnt';
						cardTypeEnt = $(cardType).text(); // Get Card Number entered

						// Match Number to CardType on Keyup
						$(cardNumber).keyup(function () {
							// console.log("cardNumber keyup");
							if ($(this).val().match(cardTypeVisa)) {
								$(this).removeClass().addClass('cardTypeVisa');
								$(cardType).html('Visa');
								$('table.DonationFormTable select[id*="cboCardType"]').find('option:contains(Visa)').attr('selected', 'selected');
							} else if ($(this).val().match(cardTypeMasterCard)) {
								$(this).removeClass().addClass('cardTypeMasterCard');
								$(cardType).html('MasterCard');
								$('table.DonationFormTable select[id*="cboCardType"]').find('option:contains(MasterCard)').attr('selected', 'selected');
							} else if ($(this).val().match(cardTypeAmEx)) {
								$(this).removeClass().addClass('cardTypeAmEx');
								$(cardType).html('American Express');
								$('table.DonationFormTable select[id*="cboCardType"]').find('option:contains(American)').attr('selected', 'selected');
							} else if ($(this).val().match(cardTypeDiscover)) {
								$(this).removeClass().addClass('cardTypeDiscover');
								$(cardType).html('Discover');
								$('table.DonationFormTable select[id*="cboCardType"]').find('option:contains(Discover)').attr('selected', 'selected');
							} else if ($(this).val().match(cardTypeInvalid) || $(this).val() === '') {
								$(this).removeClass().addClass('cardTypeInvalid');
								$('.cardTypeEnt').text('');
							}
						});
						$('.cardTypeEnt').text(cardTypeEnt); // Get Card Type Based on Card Number

						// Grab Credit Card value
						$(cardNumber).keyup(function () {
							var cardNumEnt = $(cardNumber).val();
							if ($(this).val().match(creditCardValidator)) {
								$(this).removeClass('invalid').addClass('valid');
								$('input[id*="DonationCapture1_txtCardNumber"]').val(cardNumEnt);
							} else {
								$(this).removeClass('valid').addClass('invalid');
							}
						});

						// Validate and Update Class
						$(cardNumber).blur(function () {
							var cardNumEnt = $(cardNumber).val();
							if ($(this).val().match(creditCardValidator)) {
								$(this).removeClass('invalid').addClass('valid');
								$('input[id*="DonationCapture1_txtCardNumber"]').val(cardNumEnt);
							} else {
								$(this).removeClass('valid').addClass('invalid');
							}
						});

					},

					// PART 3C:
					// CARD EXPIRATION HANDLER
					cardExp: function () {
						var cardExpMonth, cardExpYear, hiddenCardExpMonth, hiddenCardExpYear, hiddenCardExpMonthClone, hiddenCardExpYearClone; // Card Expiration Month
						cardExpMonth = 'select#cardExpMonth'; // Card Expiration Year
						cardExpYear = 'select#cardExpYr'; // Hidden Exp Month
						hiddenCardExpMonth = 'table.DonationFormTable select[id*="cboMonth"]'; // Hidden Exp Year
						hiddenCardExpYear = 'table.DonationFormTable select[id*="cboYear"]'; // Clone Hidden Exp Month
						hiddenCardExpMonthClone = $(hiddenCardExpMonth).children().clone(); // Clone Hidden Exp Year
						hiddenCardExpYearClone = $(hiddenCardExpYear).children().clone(); // Build Card Exp Year Select list Options
						if ($('select#cardExpMonth option').length === 0) {
							$(hiddenCardExpMonthClone).appendTo('select#cardExpMonth');
							$('select#cardExpMonth option:eq(0)').text('Month');
						}

						// Grab Card Exp Month
						$(cardExpMonth).change(function () {
							var cardExpMonthSelected = $('select#cardExpMonth :selected').val();
							$(hiddenCardExpMonth).find('option:contains("' + cardExpMonthSelected + '")').attr('selected', 'selected');
						});

						// Grab Hidden Values and Append to this Dropdown
						if ($('select#cardExpYr option').length === 0) {
							$(hiddenCardExpYearClone).appendTo('select#cardExpYr');
							$('select#cardExpYr option:eq(0)').text('Year');
						}

						// Grab Card Exp Year
						$(cardExpYear).change(function () {
							var cardExpYearSelected = $('select#cardExpYr :selected').val();
							$(hiddenCardExpYear).find('option:contains("' + cardExpYearSelected + '")').attr('selected', 'selected');
							// console.log('Year selected');
						});
					},

					// PART 3D:
					// EXTRACT ALL CSC VALUES
					cardCSC: function () {
						var cardSecCode, cscValidator, hiddenCardSecurityCode;
						cardSecCode = 'input#cscCode'; // Card Security Code
						cscValidator = new RegExp(/^\d{3,4}$/); // CSC Validation RegEx Pattern
						hiddenCardSecurityCode = 'table.DonationFormTable input[id*="txtCSC"]'; // Hidden/Old Form Vars

						// Validate CSC Field and Update Class
						$(cardSecCode).blur(function () {
							var cscEnt = $(cardSecCode).val();
							if (!$(this).val().match(cscValidator)) {
								$(this).addClass('invalid');
							} else {
								$(this).removeClass('invalid').addClass('valid');
								$(hiddenCardSecurityCode).val(cscEnt);
								//$('.paymentInfo ul.paymentInfo li[class*="card"]').addClass('siblingsComplete');
								$('.paymentInfo h3').addClass('complete');
							}
						});
					},

					// PART 6: STORE HIDDEN DATA AND UPDATE IF NEEDED
					hiddenDataPersistence: function () {
						var error = $('div[id$=ValidationSummary1]');
						if (error.children().length > 0) {
							var billingFirstName = '.donorFirstName #billingFirstName';
							var hiddenFirstName = '.billingInfo [id*="txtFirstName"]';
							var hiddenFirstNameEnt = $(hiddenFirstName).val();
							$(billingFirstName).val(hiddenFirstNameEnt);
							var billingLastName = '.donorLastName #billingLastName';
							var hiddenLastName = '.billingInfo [id*="txtLastName"]';
							var hiddenLastNameEnt = $(hiddenLastName).val();
							$(billingLastName).val(hiddenLastNameEnt);
							var billingAddress = '.personalInfoList #billingAddress';
							var hiddenBillingAddress = 'textarea[id$="AddressLine"]';
							var hiddenAddressEnt = $(hiddenBillingAddress).val();
							$(billingAddress).val(hiddenAddressEnt);
							var billingCity = '.wrapCity #billingCity';
							var hiddenCity = 'input[id$="CityUS"]';
							var hiddenCityEnt = $(hiddenCity).val();
							$(billingCity).val(hiddenCityEnt);
							var billingZip = '.wrapZip #zip';
							var hiddenZip = 'input[id$="ZipUS"]';
							var hiddenZipEnt = $(hiddenZip).val();
							$(billingZip).val(hiddenZipEnt);
							var billingPhone = '.personalInfoList #billingPhone';
							var hiddenBillingPhone = '.billingInfo [id*="txtPhone"]';
							var hiddenPhoneEnt = $(hiddenBillingPhone).val();
							$(billingPhone).val(hiddenPhoneEnt);
							var billingEmail = '.personalInfoList #email';
							var hiddenBillingEmail = '.billingInfo [id*="txtEmailAddress"]';
							var hiddenEmailEnt = $(hiddenBillingEmail).val();
							$(billingEmail).val(hiddenEmailEnt);
						}
					},

					autoFillExtraction: function () {

						// CHECK IF DESIGNATION PRESENT
						var designationCheck = $('span[id$=DesignationValue]').text();
						$("#fundDesignList").append($('<option>', {
							value: designationCheck
						}).text(designationCheck));

						// PART 7: EXTRACT ALL VALUES
						$('input#cscCode').blur(function () {
							var billingFirstName = '.donorFirstName #billingFirstName';
							var hiddenFirstName = '.billingInfo [id*="txtFirstName"]';
							var billingFirstNameEnt = $(billingFirstName).val();
							$(hiddenFirstName).val(billingFirstNameEnt);
							var billingLastName = '.donorLastName #billingLastName';
							var hiddenLastName = '.billingInfo [id*="txtLastName"]';
							var billingLastNameEnt = $(billingLastName).val();
							$(hiddenLastName).val(billingLastNameEnt);
							var billingAddress = '.personalInfoList #billingAddress';
							var hiddenBillingAddress = '.billingInfo [id*="AddressLine"]';
							var billingAddressEnt = $(billingAddress).val();
							$(hiddenBillingAddress).val(billingAddressEnt);
							var billingCity = '.wrapCity #billingCity';
							var hiddenCity = '.billingInfo [id*="City"]';
							var billingCityEnt = $(billingCity).val();
							$(hiddenCity).val(billingCityEnt);
							var billingZip = '.wrapZip #zip';
							var hiddenZip = '.DonationFormTable [id*="Zip"]';
							var billingZipEnt = $(billingZip).val();
							$(hiddenZip).val(billingZipEnt);
							var billingPhone = '.personalInfoList #billingPhone';
							var hiddenBillingPhone = '.billingInfo [id*="txtPhone"]';
							var billingPhoneEnt = $(billingPhone).val();
							$(hiddenBillingPhone).val(billingPhoneEnt);
							var billingEmail = '.personalInfoList #email';
							var hiddenBillingEmail = '.billingInfo [id*="txtEmailAddress"]';
							var billingEmailEnt = $(billingEmail).val();
							$(hiddenBillingEmail).val(billingEmailEnt);
						});
					},
					submitButton: function () {
						$('.DonationButtonCell input[type="submit"].DonationSubmitButton').prependTo('.submitButton');
					},

				}, // END STEP 3 PAYMENT INFO

				/* Animate Step Here */
				stepOneToggleAnimations: function () {
					$('.donateAmount h3').addClass('complete');
					$('.donorInfo .personalInfoList').removeClass('hide').slideDown();
					$('.donorInfo').find('h3').removeClass();
					$('#billingFirstName').focus();
				},

				stepToggles: function () {
					$('#wrapSingleGivingForm .givingAmountOptions .rdoAmount input[type="radio"]').click(function () {
						if ($(this).is(':checked') && $('ul.giftType').length === 0) {
							BBI.Methods.customSingleDonationForm.stepOneToggleAnimations();
						}
					});
					$('#wrapSingleGivingForm .givingAmountOptions .otherAmount input[type="text"]').blur(function () {
						if ($(this).val() !== '' && $('ul.giftType').length === 0) {
							BBI.Methods.customSingleDonationForm.stepOneToggleAnimations();
						}
					});
					$('#wrapSingleGivingForm .giftType li input[type="checkbox"]').click(function () {
						if ($(this).is(':checked')) {
							BBI.Methods.customSingleDonationForm.stepOneToggleAnimations();
						}
					});
					/* STEP 3 HIDDEN Here */
					$('input#email[type="email"]').keyup(function () {
						var emailValidator = new RegExp(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);
						if ($(this).val().match(emailValidator)) {
							$('.paymentInfo').removeClass('hide').slideDown();
							$('.donorInfo').find('h3').addClass('complete');
							$('.paymentInfo').find('h3').removeClass();
							//$('#cardholder').focus();
						}
					});
					if ($('body').hasClass('Explorer')) {
						$('.personalInfoList input#email').keyup(function () {
							var emailValidator = new RegExp(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);
							if ($(this).val().match(emailValidator)) {
								$('.paymentInfo').removeClass('hide').slideDown();
								$('.donorInfo').find('h3').addClass('complete');
								$('.paymentInfo').find('h3').removeClass();
								//$('#cardholder').focus();
							}
						});
					}
				},

				hiddenFormValidation: function () {
					// Form Error(s) Text
					$('#wrapSingleGivingForm + [id*="UpdatePanel"] .DonationFormTable [id*="ValidationSummary1"].DonationValidationSummary').insertBefore('.donateAmount');
					// Form Submitted Text
					var forSubmittedText = $('[id*="lblThanks"].DonationMessage').insertBefore('.donateAmount');
					if ($(forSubmittedText).length) {
						$('fieldset.step').hide();
					}

				},

			}, // END CUSTOM SINGLE DONATION

			resetBackgrounds: function () {
				$('.wrapBreadcrumbs p img').show();
				$("#internalPage .inner-wrap .siteWrapper .fullWidthBackgroundImage").removeAttr("style");
				BBI.Methods.foundationbgFix();
			}

		}
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
	jQuery.expr[':'].Contains = function (a, i, m) {
		return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0
	};

	// Make it safe to use console.log always
	window.log = function () {
		log.history = log.history || [];
		log.history.push(arguments);
		if (this.console) {
			arguments.callee = arguments.callee.caller;
			var a = [].slice.call(arguments);
			(typeof console.log === "object" ? log.apply.call(console.log, console, a) : console.log.apply(console, a))
		}
	};
	(function (b) {
		function c() {}
		for (var d = "assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,timeStamp,profile,profileEnd,time,timeEnd,trace,warn".split(","), a; a = d.pop();) {
			b[a] = b[a] || c
		}
	})((function () {
		try {
			console.log();
			return window.console;
		} catch (err) {
			return window.console = {};
		}
	})());


}