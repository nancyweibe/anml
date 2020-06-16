$(document).ready(function(){

	//set vars
	var $hash = window.location.hash.replace('#',''),
		$win = $('#workDescriptions'),
		$winWidth = $win.width(),
		$workNumber = 0,
		$workPieces = 0;
	$('#workDescriptions .items article').width($winWidth);

	//main nav (desktop AND mobile)
	$('nav, #mobile_nav').on('click', 'li', function(e){
		var $rel = $(this).attr('rel'),
			$currentSection = $('body > section:visible').attr('id');

		History.pushState({page: $rel}, "ANML - "+$rel, "?page="+$rel);

		e.stopPropagation();
	});

	//when history changes, do something
    History.Adapter.bind(window, 'statechange', function(){ // Note: We are using statechange instead of popstate
        var State = History.getState(),
        	currentPage = $('body > section:visible').attr('id');
        	
    	//if page isn't home
    	if (State.data.page=="about" || State.data.page=="work" || State.data.page=="contact" || State.data.page=="login") {
    		$('body > section:visible').slideUp(500, function(){
				$('#'+State.data.page).slideDown(500);
			});
			$('li[rel='+State.data.page+']').addClass('active').siblings().removeClass('active');
		//home
		} else if (State.data.page==undefined) {
			$('body > section:visible').slideUp(500, function(){
				$('#about').slideDown(500);
			});
			$('li[rel=about]').addClass('active').siblings().removeClass('active');
		//work pieces
		} else {
			$('li[rel=work]').addClass('active').siblings().removeClass('active');

			if ( $workNumber > 0 ) { $('.workNav .prev').removeClass('disabled'); }
			if ( $workNumber < $workPieces ) { $('.workNav .next').removeClass('disabled'); }
			if ( $workNumber == 0 ) { $('.workNav .prev').addClass('disabled'); }
			if ( $workNumber == $workPieces - 1 ) { $('.workNav .next').addClass('disabled'); }

			// setting active work sample
			$('#workSamples .active').removeClass('active').hide();
			$('#workDescriptions > article:eq('+$workNumber+'), #mainPics article:eq('+$workNumber+'), #bgPics .bg:eq('+$workNumber+')').addClass('active').show();
			$('#work').slideUp(500, function() {
				$('#workSamples').slideDown(500);
				$('#workPics .active img').each(function(){
					$(this).attr('src', $(this).attr('data-src') ).load(function(){$(this).removeClass('loading').hide().fadeIn(500);});
				});
			});
			$('#sticky .current').text( $('#workDescriptions .active h2').text() );
			$('#sticky .workNav').show();
			$(window).scrollTop(0);
		}
        
    });

	$('#workDescriptions article:first-child').addClass('active');
	$workPieces = $('#workDescriptions article').length;
	$('#mainPics article:first-child').addClass('active');
	$('#bgPics div:first-child').addClass('active');

	//work to work details
	$('#work').on('click', 'li', function(e){
		var $el = $(this),
			name = $el.attr('class');
		console.log(name);
		$workNumber = $el.index();
		
		History.pushState({page: name}, "ANML - Work - "+name, "?page="+name);
		e.stopPropagation();
	});

	//deep linking
	if (location.search.length > 0) {
		var deep = location.search.replace('?page=','');
		$workNumber = $('#work li.'+deep).index();
		History.pushState({page: deep}, "ANML", "?page="+deep);
	}
	
	//work nav
	$('.workNav .grid').on('click', function(e){
		History.pushState({page: 'work'}, "ANML - Work", "?page=work");
		e.stopPropagation();
	});
	$('.workNav').on('click', '.prev:not(.disabled), .next:not(.disabled)', function(e){
		var $this = $(this),
			$target = e.target.className;

		//determining direction
		//next
		if ($target == "next" ) {
			if ($workNumber < $workPieces - 1) {
				$workNumber++;
				$('.workNav .prev').removeClass('disabled');
				// setting active work sample
				var next = $('#workDescriptions > .active').next().attr('class');
				History.pushState({page: next}, "ANML - Work - "+next, "?page="+next);
				if ($workNumber == $workPieces - 1) {
					$('.workNav .next').addClass('disabled');
				}	
			}
		//previous
		} else {
			if ($workNumber > 0) {
				$workNumber--;
				$('.workNav .next').removeClass('disabled');
				// setting active work sample
				var prev = $('#workDescriptions > .active').prev().attr('class');
				History.pushState({page: prev}, "ANML - Work - "+prev, "?page="+prev);
				if ($workNumber == 0) {
					$('.workNav .prev').addClass('disabled');
				}
			}
		}
	});
	
	$(window).scroll(function(){
		if ( $(this).scrollTop() > 150 ) {
			$('#sticky').addClass('visible');
		} else {
			$('#sticky').removeClass('visible');
		}
	});
	$('nav li').on('click', function(){
		$('#sticky .workNav').hide();
	});

	//login field
	$('#login .user').on('focus', function(){
		if ( $(this).val() == "USERNAME" ) {
			$(this).val("");
		}
	}).on('blur', function(){
		if ( $(this).val() == "" ) {
			$(this).val("USERNAME");
		}
	});

	//password field
	$('#login .passTemp').on('focus', function(){
		$(this).hide()
			.next().show().focus();
	});

	//login button
	$('#login .enter').on('click', function(){
		return false;
	});

	//mobile nav
	$('#mobile_nav span').on('click', function(){
		$(this).prev().slideToggle(250);
	});
	$('#mobile_nav li').on('click', function(){
		$(this).parent().slideUp(250);
	});

	//launch work
	$('.openWork').on('click', function(){
		$rel = 'work';
		if ($rel != $('body > section:visible').attr('id') ) {
			$('body > section:visible').slideUp(500, function(){
				$('#'+$rel).slideDown(500);
			});
		}
		$('li[rel='+$rel+']').addClass('active').siblings().removeClass('active');
		History.pushState({page: "work"}, "ANML - Work", "?page=work");
	});

	//launch contact
	$('.openContact').on('click', function(){
		$rel = 'contact';
		if ($rel != $('body > section:visible').attr('id') ) {
			$('body > section:visible').slideUp(500, function(){
				$('#'+$rel).slideDown(500);
			});
		}
		$('li[rel='+$rel+']').addClass('active').siblings().removeClass('active');
		History.pushState({page: "contact"}, "ANML - Contact", "?page=contact");
	});

	//launch about
	$('.openAbout').on('click', function(){
		$rel = 'about';
		if ($rel != $('body > section:visible').attr('id') ) {
			$('body > section:visible').slideUp(500, function(){
				$('#'+$rel).slideDown(500);
			});
		}
		$('li[rel='+$rel+']').addClass('active').siblings().removeClass('active');
		History.pushState({page: "about"}, "ANML - About", "?page=about");
	});
	Response.create({ 
        "prop": "width",
    	"breakpoints": [0, 320, 481, 641, 961, 1025, 1281] 
	});

});