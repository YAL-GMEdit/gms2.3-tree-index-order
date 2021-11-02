(function() {
	function init() {
		$gmedit["ui.CommandPalette"].add({
			name: "Match 2.3 resource indexes to tree order",
			exec: function() {
				let project = $gmedit["gml.Project"].current;
				if (!project.isGMS23) return;
				let yyp = project.readYyFileSync(project.name);
				//
				let order = {};
				let treeview = document.querySelector("#tree-td .treeview");
				let index = 0;
				for (let el of treeview.querySelectorAll("div[data-ident]")) {
					let name = el.dataset["ident"];
					if (name) {
						order[name] = index;
						console.log(index, name);
					}
					index += 1;
				}
				//
				let resources = yyp.resources;
				resources.sort((a, b) => {
					return (order[a.id.name] || 0) - (order[b.id.name] || 0);
				});
				//console.log(resources.map((r) => r.id.name));
				project.writeYyFileSync(project.name, yyp);
			}
		});
	}
	//
	GMEdit.register("order23", {
		init: init,
		cleanup: function() {
			hide();
		},
	});
})();