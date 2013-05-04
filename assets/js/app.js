;(function($, window) {
	
	var library = new localStorageDB("projectsLibrary");
	var currentProject;
	var currentLastStart;
	
//	if (library.isNew()) {
		library.dropTable("projects");
		library.createTable("projects",["name","rate","description","lastStart"]);
//	}
	
	library.deleteRows("projects");
	
	library.insert("projects",{name: "John's Website", rate: 45, description: "Need it done by Thursday at noon.", lastStart: $.now()});
	library.commit()
	currentProject = "John's Website";
	
	
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
//		console.log(event);
//		console.log(event.currentTarget.attributes);
	});
	
	$('#new-project').bind('pageAnimationEnd', function(event,info) {
		if (info.direction == "in") {

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
		
	})
	
	$('#add-project').submit(function(e) {
		
		var $t = $(this);
		var name = $t.find('#project-name').val();
		var rate = $t.find('#project-rate').val();
		var description = $t.find('#project-description').val();
		
		
		library.insert("projects", {name: name, rate: rate, description: description, lastStart: 0});
		library.commit()
		
		
		console.log( library.query("projects") );
		console.log( "number of projects: " + library.rowCount("projects") );
		
		jQT.goTo('#home','slidedown');
		
		e.preventDefault();
		
		return false;
		
	});
	
	$('#edit-project').submit(function(e) {
		
		var $t = $(this);
		var name = $t.find('#project-name').val();
		var rate = $t.find('#project-rate').val();
		var description = $t.find('#project-description').val();
		
		
		library.insert("projects", currentProject, {name: name, rate: rate, description: description, lastStart: currentLastStart});
		library.commit()
		
		currentProject = name;
		
		
		console.log( library.query("projects") );
		console.log( "number of projects: " + library.rowCount("projects") );
		
		jQT.goTo('#view-project','slidedown');
		
		e.preventDefault();
		
		return false;
		
	});
	
	var clock = $('.clock').FlipClock({ autoStart: false });
	
	update_projects();
	
}(jQuery, this));