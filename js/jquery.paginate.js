
/*
 *	jQuery Paginate plugin version 0.1
 *
 *	Samuel JOCHIMEK - http://guiora.com
 *
 *	Copyright (c) 2011 Samuel JOCHIMEK
 *
 */

(function($){
	$.fn.center = function () {
		this.css("position","absolute");
		this.css("top", ( $(window).height() - this.height() ) / 2+$(window).scrollTop() + "px");
		this.css("left", ( $(window).width() - this.width() ) / 2+$(window).scrollLeft() + "px");
		return this;
	}
	
	$.fn.paginate = function(options) {

		var defaults = {
			vertical: false,
			durationZoom: 250,
			durationFade: 1000,
			durationDelay: 5000,
			tagContainer: 'ul', 
			tagItem: 'li',
			buttonContainer: 'paginate-buttons',
			buttonSize: '10px', 
			buttonBorderColor: '#FFF', 
			buttonBackgroundColor: '#FFF', 
			buttonMargin: '2px'
		};

		var options = $.extend(defaults, options);
		
		var visible = [];
		var timeout = [];
		
		function animate(container_index, container){
			var hidden_first_selector = options.tagItem+':hidden:first';
			if( !visible[container_index] ) {
				visible[container_index] = container.find(hidden_first_selector).fadeIn(options.durationFade);
			} else {
				visible[container_index] = visible[container_index].fadeOut(options.durationFade).next(hidden_first_selector).fadeIn(options.durationFade);
			}
			if( visible[container_index].size() == 0 ) {
				visible[container_index] = container.find('li:first').fadeIn(options.durationFade);
			}
			reset_controls(container, visible[container_index].index());
			timeout[container_index] = window.setTimeout(function() { animate(container_index, container); }, options.durationDelay); 
		}
		
		function control(container_index, container, index){
			clearTimeout(timeout[container_index]);
			reset_controls(container, index);
			visible[container_index].fadeOut(options.durationFade);
			visible[container_index] = container.find(options.tagContainer+':first '+options.tagItem+':eq('+index+')').fadeIn(options.durationFade);
			timeout[container_index] = window.setTimeout(function() { animate(container_index, container); }, options.durationDelay); 
		}
		
		function reset_controls(container, index){
			container
				.find('.'+options.buttonContainer+' a')
				.css('backgroundColor', 'transparent');
			container
				.find('.'+options.buttonContainer+' li:eq('+index+') a')
				.css('backgroundColor', options.buttonBackgroundColor)
		}
		
		$(window).resize(function() {
			$('#paginate-zoom').center();
		});
		
		return this.each(function(container_index) {
			
			var elem = $(this);
			
			elem.find('img').hide().load(function(){ $(this).fadeIn(); });
			
			var items_selector = options.tagContainer+':first>'+options.tagItem;
			var items = elem.find(items_selector);

			var has_many_items = items.size() > 1;

			if( has_many_items ) {
				elem.append('<ul class="'+options.buttonContainer+'"></ul>');
				var ctrl = elem.find('.'+options.buttonContainer);
			
				items.each(function(){
					ctrl.append('<li><a href="'+$(this).index()+'"></a></li>');
				});
				ctrl
					.find('li')
					.css('position', 'relative');
				if( !options.vertical ) {
					ctrl.find('li').css('float', 'left')
				}
				ctrl
					.find('a')
					.css('width', options.buttonSize)
					.css('height', options.buttonSize)
					.css('display', 'block')
					.css('border', '1px solid '+options.buttonBorderColor)
					.css('margin', options.buttonMargin)
					.css('-webkit-box-shadow', '1px 1px 8px #666')
					.css('-moz-box-shadow', '1px 1px 8px #666')
					.css('box-shadow', '1px 1px 8px #666')
					.css('-moz-border-radius', options.buttonSize)
					.css('border-radius', options.buttonSize)
					.css('backgroundColor', 'transparent')
					.hover(function(){ $(this).css('backgroundColor', options.buttonBackgroundColor) }
								,function(){ 
										if( visible[container_index].index() == $(this).parent().index() ) {
											$(this).css('backgroundColor', options.buttonBackgroundColor)
										} else {
											$(this).css('backgroundColor', 'transparent');
										}
								})
					.click(function(){ control(container_index, elem, $(this).parent().index()); return false; });
			}
			elem
				.css('position', 'relative')
				.css('overflow', 'hidden')
				.find(options.tagContainer)
				.css('position', 'relative');
			items
				.css('position', 'absolute')
				.hide()
				.find('img[title!=""]')
				.hover(function(){ $(this).css('cursor', 'hand') })
				.click(function(){
					$('#paginate-zoom').remove();
					var img = new Image();
					$(img)
						.attr('id', 'paginate-zoom')
						.click(function(){ $(this).fadeOut(); })
						.hover(function(){ $(this).css('cursor', 'hand') })
						.appendTo('body');
					if( $('#paginate-zoom').attr('src') != $(this).attr('title') ) {
						var offset = $(this).offset(),
								width = $(this).width(), 
								height = $(this).height();
						$(img)
							.hide()
							.attr('src', $(this).attr('title'))
							.css('-webkit-box-shadow', '1px 1px 8px #666')
							.css('-moz-box-shadow', '1px 1px 8px #666')
							.css('box-shadow', '1px 1px 8px #666')
							.css('z-index', 99999)
							.load(function(){
								var o_width = $(this).width(),
										o_height = $(this).height()
								$(this)
									.append('body')
									.css('position', 'absolute')
									.css(offset)
									.width(width)
									.height(height)
									.animate({ 
											opacity: 'show', 
											width: o_width, 
											height: o_height, 
											top: ( $(window).height() - o_height ) / 2+$(window).scrollTop() + 'px',
											left: ( $(window).width() - o_width ) / 2+$(window).scrollLeft() + "px"
										}, 
										options.durationZoom);
							});
					}
				});
			if( has_many_items ) {
				ctrl.css('position', 'absolute');
				if( !options.vertical ) {
					ctrl
						.css('left', (elem.width() - ctrl.width())/2)
						.css('bottom', '2%');
				} else {
					ctrl
						.css('top', (elem.height() - ctrl.height())/2)
						.css('right', '2%');
				}
				animate(container_index, elem);
			} else {
				elem.find('li:first').fadeIn(options.durationFade);
			}
		});
	};
})(jQuery);