// console.log("Load script.js");

// // Instantiating the global app object
// var app = {};

function headerHeight(element) {
	var headerHeightValue = element.outerHeight();
	console.log("checked height");
	return headerHeightValue;
}

$("#content").css("margin-top", headerHeight($("header")) + "px");

if ($(document).scrollTop() > 300) {
	$("header").addClass("reduced");
	$(".scrollToTop").fadeIn();
}

$(document).on("scroll", function () {
	if ($(document).scrollTop() > 200) {
		$(".scrollToTop").fadeIn("slow");
		$("header").addClass("reduced");
		// $("button.hamburger").addClass("reduced");
		//$("#content").css("margin-top", headerHeight($("header")) + "px");
	} else {
		$(".scrollToTop").fadeOut("slow");
		$("header").removeClass("reduced");
		// $("button.hamburger").removeClass("reduced");
		//$("#content").css("margin-top", headerHeight($("header")) + "px");
	}
});

$(document).ready(function () {

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
		$(this).find("i").toggleClass("rotate");
		$(this).parent().toggleClass("open");

		$(this).parent("a").next(".nccUlMenuSub1").slideToggle();
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

	$('[data-toggle="offcanvas"]').click(function () {
		$("#wrapper").toggleClass("toggled");
	});
});

$("input.SearchTextBox").attr("placeholder", "Search");

var $div1 = $("#search");
$(".search > a").on("click", function (e) {
	e.preventDefault();
	/*
			$(this).parent().addClass("open");
			console.log("search me");
			$("#wrapper #search").delay(100).animate({
				"margin-top": "0px"
			});
			$(".QuickSearchTextbox").focus(); */

	$div1.toggleClass("isOpen").slideToggle();
	var isOut = $div1.hasClass("isOpen");
	$div1.animate({
		marginTop: isOut ? "" : "-55px"
	}, 300);
	if (isOut) {
		$(".SearchTextBox").focus();
	}

});

// -------------------------------
// MINI GIVING FORM
// -------------------------------
//HIDE THE MONTHLY TO START WITH THEN ADD A FUNCTION TO DISPLAY HIDE SECTIONS
$("#single_donations, #pledge_payment").hide();

function singleDonation() {
	$(".donate-buttons-row h4").text("Please select a one-time donation amount");
	$("#single_donations .amount-container, #monthly_donations .amount-container").slideUp();
	$(".single_donations").addClass("selected").removeClass("greyed");
	$(".monthly_donations, .pledge_payment").removeClass("selected").addClass("greyed");
	$("#monthly_donations, #pledge_payment").hide();
	$("#single_donations").css("display", "block");

	$("#two").focus();
	$("#two").parent().addClass("active");

	$("#one").parent().removeClass("active");
	$("#three").parent().removeClass("active");
	$("#four").parent().removeClass("active");

	//   alert( "Handler for .focus()  in SingleDonation Click" );
	$("#amount").prop("type", "text");
	$("#amount").val($("#two").val().trim().replace("$", ""));
	if ($("#amount").val().trim().replace(" ", "").length != 0)
		$(".sendButton").attr("disabled", false);
	else $(".sendButton").attr("disabled", true);
};

function monthlyDonation() {
	$(".donate-buttons-row h4").text("Please select a monthly donation amount");
	$("#single_donations .amount-container, #monthly_donations .amount-container").slideUp();

	$(".monthly_donations").addClass("selected").removeClass("greyed");
	$(".single_donations, .pledge_payment").removeClass("selected").addClass("greyed");
	$("#single_donations, #pledge_payment").hide();
	$("#monthly_donations").css("display", "block");

	$("#six").focus();
	$("#six").parent().addClass("active");

	$("#five").parent().removeClass("active");
	$("#seven").parent().removeClass("active");
	$("#eight").parent().removeClass("active");

	//alert( "Handler for .focus()  in Monthly Donation Click" );
	$("#monthly_amount").prop("type", "text");
	$("#monthly_amount").val($("#six").val().trim().replace("$", ""));

	if ($("#monthly_amount").val().trim().replace(" ", "").length != 0)
		$(".sendButton_monthly").attr("disabled", false);
	else $(".sendButton_monthly").attr("disabled", true);
};

function pledgePayment() {
	$(".donate-buttons-row h4").text("Please select a pledge amount");
	$("#single_donations .amount-container, #monthly_donations .amount-container").slideUp();

	$(".pledge_payment").addClass("selected").removeClass("greyed");
	$(".single_donations, .monthly_donations").removeClass("selected").addClass("greyed");
	$("#single_donations, #monthly_donations").hide();
	$("#pledge_payment").css("display", "block");

	$("#nine").focus();
	$("#nine").parent().addClass("active");

	$("#ten").parent().removeClass("active");
	$("#eleven").parent().removeClass("active");
	$("#twelve").parent().removeClass("active");

	$("#pledge_amount").val($("#pledge_payment .dollar-box.active input").data("value"));

	$("#pledge_payment").prop("type", "text");
	$("#pledge_payment").val($("#nine").val().trim().replace("$", ""));

	if ($("#pledge_payment").val().trim().replace(" ", "").length != 0)
		$(".sendButton_pledge").attr("disabled", false);
	else $(".sendButton_pledge").attr("disabled", true);
};

function updateAmount(value) {
	//added a class to each button so you can select each, and added a data-value attribute that contains the number to put in the field
	var amount = $(this).attr("data-value");
	var amountText = $(this).attr("value");

	function updateSingleDonationAmount(amountValue) {
		$("#amount").val(amountValue).trigger("change");
	}

	if (value == "other") {
		$("#single_donations .amount-container").slideDown();
		$("#amount").val(amount).trigger("change").focus();
	} else {
		$("#single_donations .amount-container").slideUp(400, function () {
			updateSingleDonationAmount(amount);
		});
		$("#total").text("Single Donation Amount: " + amountText);
	}

	$(".btnDonAmount, .MonthlyDonAmount").parent().removeClass("active"); //remove all active states
	$("input[data-value='" + value + "']").parent().addClass("active"); //add active to last clicked button
};

function updateMonthlyAmount(value) {
	//added a class to each button so you can select each, and added a data-value attribute that contains the number to put in the field
	var amount = $(this).attr("data-value");
	var amountText = $(this).attr("value");

	function updateMonthlyDonationAmount(amountValue) {
		$("#monthly_amount").val(amountValue).trigger("change");
	}

	if (value == "otherMonthly") {
		$("#monthly_donations .amount-container").slideDown();
		$("#monthly_amount").val(amount).trigger("change").focus();
	} else {
		$("#monthly_donations .amount-container").slideUp(400, function () {
			updateMonthlyDonationAmount(amount);
		});
		$("#monthly_total").text("Monthly Donation Amount: " + amountText);
	}

	$(".btnDonAmount, .MonthlyDonAmount").parent().removeClass("active"); //remove all active states
	$("input[data-value='" + value + "']").parent().addClass("active"); //add active to last clicked button
};

function updatePledgeAmount(value) {
	//added a class to each button so you can select each, and added a data-value attribute that contains the number to put in the field
	var amount = $(this).attr("data-value");
	var amountText = $(this).attr("value");

	function updatePledgePaymentAmount(amountValue) {
		$("#pledge_amount").val(amountValue).trigger("change");
	}

	if (value == "otherPledge") {
		$("#pledge_amount").val(amount).trigger("change").focus();
	} else {
		updatePledgePaymentAmount(amount);
		$("#pledge_amount").val(value);
		$("#pledge_total").text("Pledge Payment Amount: " + amountText);
	}

	$(".btnDonAmount, .MonthlyDonAmount, .PledgeAmount").parent().removeClass("active"); //remove all active states
	$("input[data-value='" + value + "']").parent().addClass("active"); //add active to last clicked button
};


// On Page Load for Monthly Donation Only.
$(document).ready(function () {
	$(function () {
		//Set the Default Selections
		$("#six").parent().addClass("active");
		$("#six").focus();

		//$(this).toggleClass('color-yellow color-black');
		//alert( "Handler for .focus()  on load for monthy" );
		$("#monthly_amount").prop("type", "text");
		$("#monthly_amount").val($("#six").val().trim().replace("$", ""));

		if ($("#monthly_amount").val().trim().replace(" ", "").length != 0)
			$(".sendButton_monthly").attr("disabled", false);
		else $(".sendButton_monthly").attr("disabled", true);
	});

	//////////////////////////////////////
	//////// THIS IS FOR SINGLE DONATIONS //////////////////////////////////////

	// Some colour style ofor the amount input field
	$("#amount").css("color", "#333");

	// disables the button if nothing is in the input field
	$(".sendButton").attr("disabled", true);

	$("#amount").on("change keyup keydown", function () {
		//removing spaces and trimming it to make sure someone doesn't have a space or something - you could probably also limit entry to this field to only numbers using another function (google it if you think it's worth doing)
		if ($(this).val().trim().replace(" ", "").length != 0) {
			$(".sendButton").attr("disabled", false);
		} else {
			$(".sendButton").attr("disabled", true);
			$("#total").html("&nbsp;"); //remove that line at the top if no value selected
		}
	});

	//Go to URL function for sendButton_SingleDonation
	$("#single_donate_now").on("click", function () {
		var findernumber = "";
		if (BLACKBAUD.netcommunity.GetQueryStringValue("efndnum").length) {
			findernumber =
				"&efndnum=" + BLACKBAUD.netcommunity.GetQueryStringValue("efndnum");
		}
		window.location.href = "/donate-now?amt=" + $("#amount").val() + findernumber;
	});

	///////////////////////////////////////////
	// THIS IS FOR MONTHLY DONATIONS //////////////////////////////////////////

	// Some colour style for the amount input field
	$("#monthly_amount").css("color", "#333");

	// disables the button if nothing is in the input field
	$(".sendButton_monthly").attr("disabled", true);

	$("#monthly_amount").on("change keyup keydown", function () {
		//removing spaces and trimming it to make sure someone doesn't have a space or something - you could probably also limit entry to this field to only numbers using another function (google it if you think it's worth doing)
		if ($(this).val().trim().replace(" ", "").length != 0) {
			$(".sendButton_monthly").attr("disabled", false);
		} else {
			$(".sendButton_monthly").attr("disabled", true);
			$("#monthly_total").html("&nbsp;"); //remove that line at the top if no value selected
		}
	});

	//Go to URL function for sendButton_monthly
	$("#monthly_donate_now").on("click", function () {
		var findernumber = "";
		if (BLACKBAUD.netcommunity.GetQueryStringValue("efndnum").length) {
			findernumber =
				"&efndnum=" + BLACKBAUD.netcommunity.GetQueryStringValue("efndnum");
		}
		window.location.href =
			"/donate-monthly?amt=" + $("#monthly_amount").val() + findernumber;
	});

	///////////////////////////////////////////
	// THIS IS FOR PLEDGE PAYMENT //////////////////////////////////////////

	// Some colour style for the amount input field
	$("#pledge_amount").css("color", "#333");

	// disables the button if nothing is in the input field
	$(".sendButton_pledge").attr("disabled", true);

	$("#pledge_payment").on("change keyup keydown", function () {
		//removing spaces and trimming it to make sure someone doesn't have a space or something - you could probably also limit entry to this field to only numbers using another function (google it if you think it's worth doing)
		if ($(this).val().trim().replace(" ", "").length != 0) {
			$(".sendButton_pledge").attr("disabled", false);
		} else {
			$(".sendButton_pledge").attr("disabled", true);
			$("#pledge_total").html("&nbsp;"); //remove that line at the top if no value selected
		}
	});

	//Go to URL function for sendButton_pledge
	$("#pledge_donate_now").on("click", function () {
		var findernumber = "";
		if (BLACKBAUD.netcommunity.GetQueryStringValue("efndnum").length) {
			findernumber =
				"&efndnum=" + BLACKBAUD.netcommunity.GetQueryStringValue("efndnum");
		}
		window.location.href =
			"/donate-pledge?amt=" + $("#monthly_amount").val() + findernumber;
	});

});


$(document).ready(function () {
	$("a[href^='#']").click(function (e) {
		e.preventDefault();
		var position = $($(this).attr("href")).offset().top;
		$("body, html").animate({
			scrollTop: position - 60
		}, 700);
	});
});

function initRandomHero(data) {
	$("#hero .button-primary .skew-fix").text(data.settings.primaryCTAtext);
	$("#hero .button-primary").attr("href", data.settings.selectedPrimaryCtaUrl);
	$("#hero .button-secondary .skew-fix").text(data.settings.secondaryCTAtext);

	var youTubeId = data.settings.selectedSecondaryCtaUrl.split("/").pop();

	new Vue({
		el: '#hero',
		data: {
			showModal: false,
			modal_video: "https://www.youtube.com/embed/" + youTubeId
		}
	});


	//only do this if there are images
	if (data.settings.items.length) {
		// console.log(data.settings.items);
		//loop through images
		var quantityHeroImages = data.settings.items.length;
		var newIndex = myFunction(quantityHeroImages);

		function myFunction(value) {
			var heroIndex = Math.floor(Math.random() * value);
			var $item = $('<div class="item hero">');
			var $card = $('<div class="card"><img class="hero-bg" loading="eager" src="' + data.settings.items[
					heroIndex].image + '" alt="' + data.settings.items[heroIndex].image +
				'" style="max-width: 100%; height: auto" /></div>');
			var $image = $('<img src="' + data.settings.items[heroIndex].image + '" alt="' + data.settings.items[
				heroIndex].image + '" style="max-width: 100%; height: auto" />');
			// $('#hero').append($item.append($card));
			$('#hero').css("background-image", "url(" + data.settings.items[heroIndex].image + ")");


			setTimeout(function () {
				var sectionHeight = $(".item.hero img.hero-bg").height();
				//console.log(sectionHeight);
				$("#hero").height(sectionHeight + "px");
			}, 350);
		}

	} else {
		alert("Error: No images selected.");
	}
}