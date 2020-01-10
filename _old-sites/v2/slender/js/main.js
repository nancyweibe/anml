var  slenderApp = (function (window, document) {
    var app = {
        init: function() {
            this.media();
            this.navClicked = false;
            this.topNav.init();
            this.thinner.init();
            this.vibrantColors.init();
            this.caseSelect.init();
        },

        media: function() {
            if(window.matchMedia) {
                this.mqXlarge = window.matchMedia("(min-width: 1025px)");
                this.mqLarge = window.matchMedia("(min-width: 768px)");
            }
        },

        pageScroll: function(location, callback, top) {
            var offset = top || 0,
                cb = callback || null;

            $('html,body').animate({'scrollTop': $(location).offset().top + offset}, 1000, cb);
        },

        topNav: {
            container: document.querySelector('.header-container'),
            root: document.getElementById('header'),
            nav: $('#topNav'),
            navItemSelected: null,
            scrollTimer: null,

            init: function() {
                this.root.addEventListener('click', this.handleTopNav.bind(this), false);

                this.setupScroll();
                $(window).on('scroll', this.sectionScroll.bind(this));

                $(slenderApp).on('pageScroll', this.handleHeaderBackground.bind(this));
            },

            handleHeaderBackground: function(e, scrollTop) {
                var container = this.container.classList;

                if(scrollTop > 0 && !container.contains('color')) {
                    container.add('color');
                } else if(scrollTop <= 40 && container.contains('color')) {
                    container.remove('color');
                } else {
                    return;
                }
            },

            showHeader: function() {
                if(this.container.classList.contains('fadeIn')) {
                    this.container.classList.remove('fadeOut');
                    return;
                }

                this.container.classList.add('fadeIn');
            },

            hideHeader: function() {
                if(this.container.classList.contains('fadeOut')) {
                    this.container.classList.remove('fadeIn');
                    return;
                }

                this.container.classList.add('fadeOut');
            },

            setupScroll: function() {
                this.menuItems = this.nav.find("a");
                this.scrollItems = this.getSections(this.menuItems);
            },

            getSections: function(menuItems) {
                return menuItems.map(function(){
                    var item;

                    if(this.tagName === 'A') {
                        item = $($(this).attr("href"));
                    }

                    if (item.length) {
                        return item;
                    }
                });
            },

            sectionScroll: function() {
                var lastId,
                    topMenuHeight = this.nav.outerHeight() + 15,
                    scrollItems = this.scrollItems,
                    fromTop, cur, id,
                    scrollTop,
                    caseSelect = $('#caseSelect');

                if (this.scrollTimer) {
                    clearTimeout(scrollTimer);
                }

                scrollTimer = setTimeout(function() {
                    scrollTop = $(window).scrollTop();
                    // Get container scroll position
                    fromTop = scrollTop + topMenuHeight;

                    $(slenderApp).trigger('pageScroll', scrollTop);

                    if(!slenderApp.mqLarge.matches) {
                        if(fromTop < caseSelect.offset().top) {
                            slenderApp.topNav.showHeader();
                        } else {
                            slenderApp.topNav.hideHeader();
                        }
                    }

                    // Get id of current scroll item
                    cur = scrollItems.map(function(){
                        if ($(this).offset().top - 88 < fromTop) {
                            return this;
                        }
                    });

                    cur = cur[cur.length - 1];
                    id = cur && cur.length ? cur[0].id : "";

                    if(cur && cur.attr('data-no-menu')) {
                        if(cur.attr('data-enter') === 'false') {
                            slenderApp[id].exec();
                            cur.attr('data-enter', 'true');
                        }
                    }

                    if (lastId !== id) {
                        lastId = id;
                        this.menuItems.parent().end().filter('.selected').removeClass('selected');
                        this.menuItems
                        .parent()
                        .end().filter("[href='#"+id+"']").addClass("selected");
                    }

                    if(cur && cur.offset) {
                        if(fromTop >= cur.offset().top + cur.height()) {
                            this.menuItems.parent().end().filter('.selected').removeClass('selected');
                            return;
                        }
                    }
                }.bind(this), 500);
            },

            handleTopNav: function(e) {
                e.preventDefault();
                var target = e.target;

                slenderApp.navClicked = true;

                if(target.classList.contains('logo')){
                    slenderApp.pageScroll('body', function() {
                        slenderApp.navClicked = false;
                    }, -78);
                }

                if(target.classList.contains('nav-links')) {
                    this.currentURL = target.getAttribute('href');

                    slenderApp.pageScroll(this.currentURL, function() {
                        slenderApp.navClicked = false;
                    });
                }

                if(target.classList.contains('buy-btn')) {
                    slenderApp.pageScroll('#caseSelect', null, -20);
                }
            }
        },

        thinner: {
            root: document.getElementById('thinner'),
            init: function() {
                this.root.addEventListener('click', this.handleEvents, false);

                this.initVideo();
            },

            initVideo:function() {
                var width600Check,
                    mq = slenderApp.mqXlarge;

                mq.addListener(this.setWidthValue.bind(this));
                this.setWidthValue(mq);
            },

            setWidthValue: function(mq) {
                if(mq.matches) {
                    this.showVideo();
                } else {
                    this.showImage();
                }
            },

            showImage: function() {
                var img = this.root.querySelector('.thinner-img'),
                    src = img.getAttribute('data-src');

                img.setAttribute('src', src);
            },

            showVideo: function() {
                var player = this.root.querySelector('#video'),
                    vid = this.root.querySelectorAll('.thinner-video'),
                    src, i = 0, len = vid.length;

                for(; i < len; i++) {
                    src = vid[i].getAttribute('data-src');
                    vid[i].setAttribute('src', src);
                }

                player.load();
            },

            handleEvents: function(e) {
                e.preventDefault();
                var target = e.target,
                    linkClass = target.classList;

                if(target.classList.contains('buy-btn')) {
                    slenderApp.pageScroll('#caseSelect');
                }

                while(target.tagName !== 'DIV' && !linkClass.contains('explore-link')){
                    target = target.parentNode;
                }

                if(target.classList.contains('explore-link')) {
                    slenderApp.pageScroll(target, null, 36);
                }
            }
        },

        vibrantColors: {
            root: document.getElementById('vibrantColors'),
            init: function() {
                this.cases = this.root.querySelector('#vibrantCases');

                this.cases.addEventListener('click', this.handleClick.bind(this), false);
            },

            exec: function() {
                var cases = this.root.querySelectorAll('.vibrant');

                for(var i = 0, len = cases.length; i < len; i++) {
                    cases[i].classList.add('slide-up');
                }
            },

            handleClick: function(e) {
                var target = e.target,
                    color;

                while(target.tagName !== 'DIV' && !target.classList.contains('vibrant')){
                    target = target.parentNode;
                }

                color = target.getAttribute('data-color');
                slenderApp.caseSelect.setCase(color);
                slenderApp.pageScroll('#caseSelect');
            }
        },

        caseSelect: {
            root: document.getElementById('caseSelect'),
            baseImgURL: 'img/caseSelect/',
            caseGallery: $('#caseGallery'),
            fade: false,

            init: function() {
                this.caseImage = this.root.querySelectorAll('.case-image');
                this.caseSelect = this.root.querySelector('#caseMenu');
                this.colorSelect = this.root.querySelector('#colorSelect');
                this.labelSelect = this.root.querySelector('#selectLabel');
                this.caseSizeSelect = this.root.querySelector('#sizeSelect');
                this.caseBtns = this.caseSelect.querySelectorAll('.case-select-btn');
                this.caseColors = this.colorSelect.querySelectorAll('.color-select-btn');
                this.caseSize = this.caseSizeSelect.querySelectorAll('.phone-icon');
                this.plus = this.root.querySelector('.plus');

                this.root.addEventListener('click', this.handleEvents.bind(this), false);
                slenderApp.mqLarge.addListener(this.desktopView.bind(this));
                this.desktopView();
            },

            desktopView: function() {
                this.resetSize();
                if(slenderApp.mqLarge.matches) {
                    this.showHideSixPlus('large');
                } else {
                    this.showHideSixPlus();
                }
            },

            showHideSixPlus: function(size) {
                if(size) {
                    this.plus.classList.add('hide');
                } else {
                    this.plus.classList.remove('hide');
                }
            },

            resetSize: function() {
                $(this.root).find('.six').trigger('click');
            },

            setCase: function(color) {
                var colorSet = this.colorSelect.querySelector('#' + color);
                this.setSelectedColor(colorSet);
            },

            getSelection: function(btns, clear, id) {
                var btn = null,
                    btnItems = [].slice.call(btns);

                btnItems.forEach(function(item) {
                    if(item.classList.contains('selected')) {
                        btn = item;
                        if(clear) {
                            item.classList.remove('selected');
                        }
                    }
                });

                return btn.id;
            },

            setSelectedCase: function(item) {
                this.caseGallery.slick('slickGoTo', $(item).index());
                this.getSelection(this.caseBtns, 'clear');
                item.classList.add('selected');
            },

            getSelectedCase: function() {
                return this.getSelection(this.caseBtns);
            },

            setSelectedColor: function(item) {
                var color = item.getAttribute('data-label');

                this.getSelection(this.caseColors, 'clear');
                item.classList.add('selected');
                this.setColorLabel(color);
                this.setCaseMenuColor(color.toLowerCase());
                this.setPhoneColor(color.toLowerCase());
            },

            setPhoneColor: function(color) {
                var images = this.root.querySelectorAll('.case-image'),
                    imgArr = [].slice.call(images),
                    angles = ['back', 'front', 'angleAll', 'angleBack'];

                imgArr.forEach(function(img, i) {
                    if(i < 4) {
                        img.src = this.baseImgURL + angles[i] + '/' + color + '.jpg';
                        img.srcset = this.baseImgURL + angles[i]  + '/' + color + '_2x.jpg';
                    }
                }.bind(this));
            },

            setCaseMenuColor: function(color) {
                this.caseSelect.setAttribute('data-color', color);
            },

            setColorLabel: function(label) {
                this.labelSelect.innerHTML = label;
            },

            resize: function(size) {
                var caseImages = [].slice.call(this.caseImage);

                caseImages.forEach(function(item) {
                    if(size) {
                        item.classList.remove('large');
                    } else {
                        item.classList.add('large');
                    }
                });
            },

            setPhoneSize: function(item) {
                var plus = this.caseSizeSelect.querySelector('.plus'),
                    six = this.caseSizeSelect.querySelector('.six'),
                    size = item.getAttribute('data-size'),
                    phone = this.caseSizeSelect.querySelector('.phone'),
                    pageSize = null;

                this.getSelection(this.caseSize, 'clear');
                item.classList.add('selected');

                if(slenderApp.mqLarge.matches) {
                    six.classList.remove('selected');
                    phone.classList.remove('selected');
                    plus.classList.remove('selected');

                    if(size === 'small') {
                        plus.classList.add('hide');
                        six.classList.remove('hide');
                        this.resize('large');
                    } else {
                        plus.classList.remove('hide');
                        six.classList.add('hide');
                        this.resize();
                    }
                } else {
                    if(size === 'small') {
                        plus.classList.remove('selected');
                        six.classList.add('selected');
                        phone.classList.add('selected');
                        this.resize('large');

                    } else {
                        plus.classList.add('selected');
                        six.classList.remove('selected');
                        phone.classList.remove('selected');
                        this.resize();
                    }
                }
            },

            getSelectedColor: function() {
                return this.getSelection(this.caseColors);
            },

            handleEvents: function(e) {
                var target = e.target;

                if(e.target.classList.contains('case-select-btn')) {
                    this.setSelectedCase(target);
                }

                if(e.target.classList.contains('color-select-btn')) {
                    this.setSelectedColor(target);
                }

                if(e.target.classList.contains('phone-icon')) {
                    this.setPhoneSize(target);
                }
            }
        }
    };

    return app;
}(window, document));

$(document).ready(function() {
    $('#gallery').slick({
        lazyLoad: 'ondemand',
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: '<img src="img/right-arrow.svg" class="slide-arrows right" />',
        prevArrow: '<img src="img/left-arrow.svg" class="slide-arrows left" />'
    });

    $('#caseGallery').slick({
        lazyLoad: 'ondemand',
        slidesToShow: 1,
        slidesToScroll: 1,
        focusOnSelect: true,
        nextArrow: false,
        prevArrow: false,
        infinite: false,
        fade: true,
        responsive: [
            {
              breakpoint: 1024,
              settings: {
                fade: true
              }
            },
            {
              breakpoint: 768,
              settings: {
                fade: false
              }
            },
            {
              breakpoint: 480,
              settings: {
                fade: false
              }
            }
        ]
    });

    slenderApp.init();
});
