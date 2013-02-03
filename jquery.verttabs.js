// VertTabs v0.0.1 - a full featured, light-weight, customizable tabular display
// Copyright (c) 2012 Christopher Hacia chris@chrishacia.com
// Website: http://www.chrishacia.com/scripts/vert-tabs
// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
$('.vert_tabs_menu').live({
	'click':function(e)
	{
		e.stopPropagation();
		if(!$(this).hasClass('active')&&!$(this).hasClass('premium'))
		{
			doMenuAction($(this));
		}
	},
	'mouseenter':function(e)
	{
		var $menu = $(this);
		e.stopPropagation();
		if(!$menu.hasClass('active')&&!$menu.hasClass('premium'))
		{
			$(this).addClass('hover');
		}
	},
	'mouseleave':function(e)
	{
		var $menu = $(this);
		e.stopPropagation();
		if(!$menu.hasClass('active')&&!$menu.hasClass('premium'))
		{
			$(this).removeClass('hover');
		}
	}
});
function doMenuAction(menuElem)
{
	var $menu = menuElem;
	var $context = $('.vert_tabs_context[data-idn="'+$menu.data('idn')+'"]');
	var ispremium = $menu.data('premium');

	$('.vert_tabs_menu').removeClass('active premium hover idle');//removes from all
	$('.vert_tabs_context').removeClass('active premium hover idle');//removes from all
	if(ispremium == 'inactive')
	{
		$('.vert_tabs_right_premium').show();
		$('.zetta_upgrade_dialog').show();
		$menu.removeClass('hover idle').addClass('premium');
	}
	else
	{
		$('.vert_tabs_right_premium').hide();
		$('.zetta_upgrade_dialog').hide();
		$menu.removeClass('hover idle').addClass('active');
	}
	//below if statment not needed to work with vert_tabs, but added in as a means of controlling the element state upon a new tab selection.
	//if(helpTextOpen == true||helpTextOpen == 'running'){helpTextOpen = false;$('.vert_tabs_question_box').css({width: '26px', height: '26px'}).hide();}
	$context.addClass('active');


	//due to the way things are set up most tab elements are set to a style with display:none
	//which means some elements within those tabs context screens can't have there positions or dimensions figured out
	//by the scripting within until they are displayed. That said functionality below this will be triggered upon the context being shown.
	accordionStart();


	//if tab elements require special functionality upon clicking them and only when they are clicked
	//this if-else logic will help aid that by using a data attribute called "callback".
	//the value of that attribute should be the name of the funciton you want to call
	var cb = $menu.data('callback');
	if(cb !== '' && cb !== null && cb !== undefined)
	{
		typeof window[cb] === "function" && window[cb]();
	}
}
function findActiveMenu()
{
	//used to ensure the right context is loaded with the active selection
	//should we ever promote a new feature and want that active instead of the default "config"
	//alert($('.vert_tabs_menu').length);
	var countMissing = 0;
	$('.vert_tabs_menu').each(function(key, val)
	{
		//if a menu element has either of one or the 2 below classes
		//it is considered an active element, there should never be more than one
		//menu item with either class actively. Its either or, not both.
		//premium is only used in place of "active" when a menu items
		//data "premium" is "inactive" otherwise active will be used.
		var $theElem = $(this);
		var $finElem = null;

		//alert($theElem.attr('class')+" "+key+" "+val);
		if($theElem.hasClass('active') || $theElem.hasClass('premium'))
		{
			if($theElem.hasClass('hide'))
			{
				if($theElem.is(':first-child') && $('.vert_tabs_menu').length > 1)
				{
					$finElem = $theElem.next();
				}
				else if($theElem.is(':last-child') && $('.vert_tabs_menu').length > 1)
				{
					$finElem = $theElem.prev();
				}
				else
				{
					$finElem = $theElem.next();
				}
			}
			else
			{
				doMenuAction($theElem);
			}
		}
		else
		{
			if($theElem.hasClass('hide'))
			{
				$theElem.hide();
			}
		}

		if($finElem !== null)
		{
			var theClass = 'active';
			$theElem.removeClass('active').hide();
			if($finElem.data('premium') == 'inactive'){theClass = 'premium'}
			$finElem.addClass(theClass);
			$theElem = $finElem;
			doMenuAction($theElem);
		}
	});
	if(!$('.vert_tabs_menu').hasClass('active'))
	{
		$('.vert_tabs_menu').first().addClass('active');
		findActiveMenu();
	}
}
function jumpToTab(whichOne)
{
	//quick function to change menu from one to another in the event of something
	//like the recover option being used, and the tab on the page is defaulted to something else.
	//uses the tabs 'data-idn' as whichOne
	$('.vert_tabs_menu').removeClass('active');
	$('.vert_tabs_menu[data-idn="'+whichOne+'"]').addClass('active');
	findActiveMenu();
}

/*
$(document).ready(function()
{
	findActiveMenu();
});
*/