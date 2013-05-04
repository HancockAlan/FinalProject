;(function($, window) {
	
	var library = new localStorageDB("projectsLibrary");
	var currentProject;
	var currentLastStart;
	
	if (library.isNew()) {
		library.createTable("projects",["name","rate","description","lastStart"]);
	}
	
	// instantiate jQTouch	
	var jQT;
	$(function(){ jQT = new $.jQTouch({}); });
	
	var update_projects = function() {
		$(".projects-list").empty();
		
		if (library.rowCount("projects") == 0) {
			$(".projects-list").append('<li><span>Currently no projects</span></li><a href="#new-project" class="whiteButton slideup">Add a New Project</a>');
		}
		
		else {
			library.query("projects", function(p) {
				$(".projects-list").append('<a class="click-project" id="' + p.ID + '" href="#view-project" ><li><span>' + p.name + '</span><i class="icon-chevron-right"></i></li></a>');
			})
		}
	};
	
	$('#home').bind('pageAnimationStart', function(event,info) {
		if (info.direction == "in") {
			update_projects();
		}
	});
	
	$('.click-project').live("click", function(event) {
		clickedID = this.getAttribute("id");
		
		library.query("projects", function(p) {
			if (p.ID == clickedID) {
				currentProject = p.name;
			}
		})
	});
	
	$('#new-project').bind('pageAnimationStart', function(event,info) {
		if (info.direction == "in") {
			var $t = $(this);
			$t.find('#project-name').val('');
			$t.find('#project-rate').val('');
			$t.find('#project-description').val('');
		}
	});
	
	$('#edit-project').bind('pageAnimationEnd', function(event,info) {
		if (info.direction == "in") {
			var $t = $(this);
			
			library.query("projects", function(p) {
				if (p.name == currentProject) {
					currRate = p.rate;
					currDesc = p.description;
				}
			})
			
			$t.find('#project-name').val(currentProject);
			$t.find('#project-rate').val(currRate);
			$t.find('#project-description').val(currDesc);
		}
	});

	$('#view-project').bind('pageAnimationStart', function(event,info) {
		if (info.direction == "in") {
			$("#view-event h1").text(currentProject);
			
			library.query("projects", function(p) {
				if (p.name == currentProject) currentLastStart = p.lastStart;
			})
			
			if (currentLastStart) {
				clock.setTime( ($.now() - currentLastStart)/1000 );
				clock.start();
			}
		}
	});
	
	$('#view-project .startstop').live('click', function() {
		if (clock.running == true) {
			clock.stop();
		}
		
		else if (clock.running == false) {
			clock.start();
			library.query("projects",{name:currentProject}, function(p) {
				p.lastStart = $.now()
			});
		}
	})
	
	$('#add-project').submit(function(e) {
		
		var $t = $(this);
		var name = $t.find('#project-name').val();
		var rate = $t.find('#project-rate').val();
		var description = $t.find('#project-description').val();
		
		library.insert("projects", {name: name, rate: rate, description: description, lastStart: 0});
		library.commit()
		
		jQT.goTo('#home','slidedown');
		
		e.preventDefault();
		
		return false;
		
	});
	
	$('#edit-project').submit(function(e) {
		
		var $t = $(this);
		var name = $t.find('#project-name').val();
		var rate = $t.find('#project-rate').val();
		var description = $t.find('#project-description').val();
				
		library.insertOrUpdate("projects", {name: currentProject}, {name: name, rate: rate, description: description, lastStart: currentLastStart});
		library.commit()
		
		currentProject = name;

		jQT.goTo('#view-project','slidedown');
		
		e.preventDefault();
		
		return false;
		
	});
	
	$('#delete-project').submit(function(e) {

		library.deleteRows("projects",{name: currentProject});
		library.commit();
		
		jQT.goTo('#home','slidedown');
		
		e.preventDefault();
		
		return false;
	})
	
	var clock = $('.clock').FlipClock({ autoStart: false });
	
	update_projects();
	
}(jQuery, this));