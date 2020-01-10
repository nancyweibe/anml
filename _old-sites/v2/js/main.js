
$(document).ready(function(){
    var $html = $('html'),
        $body = $('body'),
        $wrapper = $('.wrapper'),
        $openNav = $('.openNav'),
        $nav = $('nav'),
        $navItems = $('nav li'),
        $workSlider = $('.slider.work'),
        $workSliderMover = $workSlider.find('.mover'),
        $workItems = $('.slider.work .item'),
        numWorkNav = $workItems.length/6,
        activeNavWork = numWorkNav;

    //reload page if navigated to with back button
    $(window).bind("pageshow", function(event) {
        if (event.originalEvent.persisted) {
            window.location.reload() 
        }
    });

    //size section heights
    sizeSections();
    $(window).on('resize', sizeSections);

    //init stellarJS
    if (!Modernizr.touch) { 
        $.stellar();
    }

    //activate link for secondary nav depending on hash
    var hash = location.hash.split('#').join('.');
    if ( $('.sectionNav').find(hash).length > 0 ) {
        $('.sectionNav').find(hash).parent().addClass('active')
            .siblings().removeClass('active');
    }

    //init nav work slider properties
    $workSliderMover.css('height', 25*numWorkNav*3+'%');
    $workSliderMover.css('transform', 'translateY(-33.33333%)');
    $workItems.css('height', 100/(3*numWorkNav)+'%');

    //set src of case study images
    sizeImages();
    $(window).on('resize', sizeImages);

    //open nav
    $openNav.on('click', function(e){
        if ( !$nav.hasClass('open') ) {
            $('nav > ul').css('left',0);
            $openNav.addClass('active');
            $html.addClass('blurred');
            $body.addClass('blurred');
            //$body.addClass('blurred').scrollTo( $body.scrollTop()-1, 1000 );
            $wrapper.addClass('blurred');
            $nav.addClass('open');
            $navItems.each(function(){
                var $el = $(this),
                    i = $el.index(),
                    delay = 0.125;

                setTimeout(function(){
                    $el.addClass('perspectiveLeftReturn').removeClass('perspectiveLeft');
                    setTimeout(function(){
                        $body.scrollTo( $body.scrollTop()+1, 50 );
                    }, 500);
                }, i * 1000 * delay); 
            });
        } else {
            hideNav();
        }
        e.stopPropagation();
    });

    //nav work sliders
    $workSlider.on('click', '.arrow', function(e){
        var $el = $(this);

        //up
        if ($el.hasClass('up')) {
            activeNavWork--;
        //down
        } else {
            activeNavWork++;
        }
        console.log(activeNavWork);
        
        $workSliderMover.css('transform', 'translateY(-'+(100/3/numWorkNav)*activeNavWork+'%)');
        
        if (activeNavWork == 0 || activeNavWork == numWorkNav*2) {
            activeNavWork = numWorkNav;
            setTimeout(function(){
                $workSliderMover.addClass('no-transition');
                $workSliderMover.css('transform', 'translateY(-'+(100/3/numWorkNav)*activeNavWork+'%)');
            }, 250);
            setTimeout(function(){
                $workSliderMover.removeClass('no-transition');
            }, 500);
        }

        e.stopPropagation();
    });

    //nav item clicks
    $body.on('click', function(){
        hideNav();
        $('.work .reel').removeClass('shown')
            .html('');
        $('.content').removeClass('blurred');
    });

    //linking to pages from nav
    $('nav a').on('click', function(){
        var $el = $(this),
            page = $el.attr('href');

        //if linking off to another page, animate crap...
        if (location.href.split('#')[0].indexOf(page.split('#')[0]) < 0) {
            $('.content').addClass('onward');
            $('h1, .cycle-slideshow, .sectionNav').fadeOut(500);
            $openNav.removeClass('shown');
            hideNav();
            setTimeout(function(){
                location.href = page;
            }, 1000);
        } else {
            hideNav();
            var anchor = page.split('#')[1];
            $('.sectionNav li').find('.'+anchor).trigger('click');
        }

        return false;
    });

    function sizeSections() {
        var winHeight = $(window).height() - 60;
        $('.about .section, .studio .section').each(function(){
            var $el = $(this);
            if ($el.hasClass('end')) {
                $el.height(winHeight-30);
            } else {
                $el.height(winHeight);
            }
        });
    }

    //WORK
    //waypoints
    $('.work section, .case-study .content > *').each(function(){
        var $el = $(this),
            i = $el.index();
        new Waypoint({
            element: $el,
            handler: function(direction) {
                $el.addClass('shown');
                setTimeout(function(){
                    $el.addClass('done');
                }, 1000);
            },
            offset: '100%'
        });
    });

    //show "our reel" video
    setTimeout(function(){
        $('.our-reel').addClass('done');
    }, 1250);
    $('.our-reel').on('click', function(e){
        $(this).addClass('full');
        setTimeout(function(){
            $('.reel').addClass('shown')
                .append('<iframe src="https://player.vimeo.com/video/124464728?autoplay=1&color=4acfcd&title=0&byline=0&portrait=0" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
        }, 500);
        e.stopPropagation();
    });
    $('.reel .close').on('click', function(e){
        $('.reel').removeClass('shown');
        $('.reel iframe').remove();
        setTimeout(function(){
            $('.our-reel').removeClass('full');  
        }, 500);
    });

    //linking to case study pages, non-iphones only
    // if (!window.navigator.userAgent.match(/iPhone/i)) {
        $('section .shade').on('click', function(){
            var $el = $(this),
                $box = $el.closest('section'),
                page = $el.attr('href');

            $box.addClass('onward');
            $('.content').addClass('onward');
            $openNav.removeClass('shown');

            setTimeout(function(){
                location.href = page;
            }, 1000);

            return false;
        });
    // }

    //fade in pages
    setTimeout(function(){
        $wrapper.addClass('shown');
        $openNav.addClass('shown');
    }, 500);

    //ABOUT
    //about nav
    $('.sectionNav li').on('click', function(){
        var $el = $(this),
            target = $el.find('a').attr('href');
        $el.addClass('active')
            .siblings().removeClass('active');
        console.log(target);

        $body.scrollTo( $('#'+target), 1000 );
        return false;
    });

    //waypoints
    $('.about .content > *, .studio .content > *').each(function(){
        var $el = $(this),
            i = $el.index();
        
        //scrolling down
        new Waypoint({
            element: $el,
            handler: function(direction) {
                if (direction === "down") {
                    $el.addClass('shown');
                    setTimeout(function(){
                        $el.addClass('done');
                    }, 1250);

                    //set active nav item
                    var sectionID = $el.attr('id');
                    $('.sectionNav li a.'+sectionID).parent().addClass('active')
                        .siblings().removeClass('active');
                }
            },
            offset: ($(window).height()-($(window).height()/2))
        });

        //scrolling up
        new Waypoint({
            element: $el,
            handler: function(direction) {
                if (direction === "up") {
                    console.log($el.outerHeight());
                    $el.addClass('shown');
                    setTimeout(function(){
                        $el.addClass('done');
                    }, 1250);

                    //set active nav item
                    var sectionID = $el.attr('id');
                    $('.sectionNav li a.'+sectionID).parent().addClass('active')
                        .siblings().removeClass('active');
                }
            },
            offset: '-'+($el.outerHeight()-($(window).height()/2))
        });

        //animate circle percentages
        if ($el.hasClass('what')) {
            //websites
            setTimeout(function(){
                var n1 = $el.find('.circle').eq(0).find('.number'),
                    i1 = 0,
                    c1 = setInterval(function(){
                        if (i1 < 25) {
                            i1++;
                            n1.text(i1);
                        } else {
                            clearInterval(c1);
                        }
                    }, 50);
            }, 500);

            //mobile
            setTimeout(function(){
                var n2 = $el.find('.circle').eq(1).find('.number'),
                    i2 = 0,
                    c2 = setInterval(function(){
                        if (i2 < 40) {
                            i2++;
                            n2.text(i2);
                        } else {
                            clearInterval(c2);
                        }
                    }, 25);
            }, 625);

            //software
            setTimeout(function(){
                var n2 = $el.find('.circle').eq(2).find('.number'),
                    i2 = 0,
                    c2 = setInterval(function(){
                        if (i2 < 35) {
                            i2++;
                            n2.text(i2);
                        } else {
                            clearInterval(c2);
                        }
                    }, 25);
            }, 750);
        }
    });

    function hideNav(){
        $openNav.removeClass('active');
        $navItems.each(function(){
            var $el = $(this),
                total = $navItems.length,
                i = $el.index(),
                delay = 0.125;

            setTimeout(function(){
                $el.removeClass('perspectiveLeftReturn').addClass('perspectiveLeft');
            }, (total - 1 - i) * 1000 * delay);
        })
        setTimeout(function(){
            $wrapper.removeClass('blurred');
        }, 375);
        setTimeout(function(){
            $html.removeClass('blurred');
            $body.removeClass('blurred');
            $nav.removeClass('open');
        }, 625);
        setTimeout(function(){
            $('nav > ul').css('left',10000000);
        }, 500);
    }

    function sizeImages(){
        var $win = $(window),
            winW = $win.width(),
            winH = $win.height();

        $('.home .slide > img').each(function(){
            if (winW >= winH) {
                $(this).width('113%').height('');
            } else {
                $(this).height('113%').width('');
            }
        });

        $('.case-study .slide > img').each(function(){
            var $el = $(this),
                srcLg = $el.data('src'),
                srcSm = '..' + srcLg.split('.')[2] + '-sm.jpg';

            if ( Modernizr.mq('(max-width: 767px)') ) {
                $el.attr('src', srcSm);
            } else {
                $el.attr('src', srcLg);
            }
        });
    }

});

$(window).on('load', function(){
    $('.loader').addClass('hidden');
    $('.cycle-pager span').not('.cycle-pager-active').eq(1).trigger('click');
    
    setTimeout(function(){
        $('.loader').remove();
    }, 1000);
});

