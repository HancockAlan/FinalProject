;(function($, window) {
	
	var library = new localStorageDB("projectsLibrary");
	
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
			$(".projects-list").append('<li><span>Currently no projects</span></li>');
		}
		
		else {
			library.query("projects", function(p) {
				$(".projects-list").append('<li><span>' + p.name + ' ' + p.rate + ' ' + p.description + '</span></li>');
			})
		}
	};
	
	$('#home').bind('pageAnimationEnd', function(event,info) {
		if (info.direction == "in") {
			update_projects();
		}
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
	
	update_projects();
	
}(jQuery, this));