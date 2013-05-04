;(function($, window) {
	
	var library = new localStorageDB("projectsLibrary");
	var currentProject = {
		word: "hello",
		goodbye: "no"
	};
	
	if (library.isNew()) {
		library.createTable("projects",["name","rate","description"]);
	}
	
	library.deleteRows("projects");
	
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
				$(".projects-list").append('<a id="click-project" href="#" ><li><span>' + p.name + '</span><i class="icon-chevron-right"></i></li></a>');
			})
		}
	};
	
	$('#home').bind('pageAnimationEnd', function(event,info) {
		if (info.direction == "in") {
			update_projects();
		}
	});
	
	$('#click-project').bind("clickEvent", function() {
		console.log("something");
	});
	
	$('#new-project').bind('pageAnimationEnd', function(event,info) {
		if (info.direction == "in") {

		}
	});
	
	$('#edit-project').bind('pageAnimationEnd', function(event,info) {
		if (info.direction == "in") {
			alert("edit project in");
		}
	});

	$('#add-project').submit(function(e) {
		
		var $t = $(this);
		var name = $t.find('#project-name').val();
		var rate = $t.find('#project-rate').val();
		var description = $t.find('#project-description').val();
		
		
		library.insert("projects", {name: name, rate: rate, description: description});
		library.commit()
		
		
		console.log( library.query("projects") );
		console.log( "number of projects: " + library.rowCount("projects") );
		
		jQT.goTo('#home','slidedown');
		
		e.preventDefault();
		
		return false;
		
	});
	
	var clock = $('.clock').FlipClock({
	
	});
	
	update_projects();
	console.log(currentProject);
	
}(jQuery, this));