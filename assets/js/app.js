;(function($, window) {
	
	var library = new localStorageDB("projectsLibrary");
	
	if (library.isNew()) {
		library.createTable("projects",["name","rate","description"]);
	}
	
	// instantiate jQTouch	
	var jQT;
	$(function(){ jQT = new $.jQTouch({}); });
	
	$('#home').bind('pageAnimationEnd', function(event,info) {
		if (info.direction == "in") {

		}
	});
	
	$('#add-project').submit(function(e) {
		
		var $t = $(this);
		var name = $t.find('#project-name').val();
		var rate = $t.find('#project-rate').val();
		var description = $t.find('#project-description').val();
		
		var newProject = new Project( name, rate, description );
		
		
		library.insert("projects", {name: name, rate: rate, description: description});
		library.commit()
		
		
		console.log( library.query("projects") );
		console.log( "number of projects: " + library.rowCount("projects") );
		
		jQT.goTo('#home','slidedown');
		
		e.preventDefault();
		
		return false;
		
	});
	
}(jQuery, this));