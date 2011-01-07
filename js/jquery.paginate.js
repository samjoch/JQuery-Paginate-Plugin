
/*
 *	jQuery Paginate plugin version 0.1
 *
 *	Samuel JOCHIMEK - http://teddevito.com/demos/textarea.html
 *
 *	Copyright (c) 2011 Samuel JOCHIMEK
 *
 */

(function($){
	$.fn.paginate = function(options) {

		var defaults = {
			vertical: false,
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
			container.find('.'+options.buttonContainer+' a')
							 .css('backgroundColor', 'transparent');
			container.find('.'+options.buttonContainer+' li:eq('+index+') a')
							 .css('backgroundColor', options.buttonBackgroundColor)
		}
		
		return this.each(function(container_index) {
			
			var elem = $(this);
			elem.append('<ul class="'+options.buttonContainer+'"></ul>');
			var ctrl = elem.find('.'+options.buttonContainer);

			var items_selector = options.tagContainer+':first '+options.tagItem;
			elem.find(items_selector).each(function(){
				ctrl.append('<li><a href="'+$(this).index()+'"></a></li>');
			});
			ctrl.find('li')
					.css('position', 'relative');
			if( !options.vertical ) {
				ctrl.find('li').css('float', 'left')
			}
			ctrl.find('a')
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
								
			elem.css('position', 'relative')
					.css('overflow', 'hidden')
					.find(options.tagContainer)
					.css('position', 'relative');
			elem.find(items_selector)
					.css('position', 'absolute')
					.hide();
			
			ctrl.css('position', 'absolute');
			if( !options.vertical ) {
				ctrl.css('left', (elem.width() - ctrl.width())/2)
						.css('bottom', '2%');
			} else {
				ctrl.css('top', (elem.height() - ctrl.height())/2)
						.css('right', '2%');
			}
			animate(container_index, elem);
		});
	};
})(jQuery);