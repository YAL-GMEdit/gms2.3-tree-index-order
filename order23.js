(function() {
	function run(custom) {
		let project = $gmedit["gml.Project"].current;
		if (!project.isGMS23) throw "Has to be a GMS2.3+ project!";
		let yyp = project.readYyFileSync(project.name);
		//
		let order = {};
		let index = 0;
		let list = [];
		//
		if (custom != "") for (let mt of custom.matchAll(/\w+/g)) {
			let name = mt[0];
			if (order[name] == null) {
				list.push(name);
				order[name] = index++;
			}
		}
		console.log("custom", list.slice());
		//
		let treeview = document.querySelector("#tree-td .treeview");
		for (let el of treeview.querySelectorAll("div[data-ident]")) {
			let name = el.dataset["ident"];
			if (name && order[name] == null) {
				list.push(name);
				order[name] = index++;
				//console.log(index, name);
			}
		}
		//
		console.log("list", list);
		console.log("map", order);
		//
		let resources = yyp.resources;
		resources.sort((a, b) => {
			return (order[a.id.name] || 0) - (order[b.id.name] || 0);
		});
		//console.log(resources.map((r) => r.id.name));
		project.writeYyFileSync(project.name, yyp);
	}
	function init() {
		$gmedit["ui.CommandPalette"].add({
			name: "Match 2.3 resource indexes to tree order",
			exec: function() {
				let custom = aceEditor.getSelectedText().trim();
				if (custom != "") {
					if (!$gmedit["electron.Dialog"].showConfirm(
						"Use selection as list of front-first names?"
					)) custom = "";
				}
				try {
					run(custom);
					$gmedit["electron.Dialog"].showAlert("Done!");
				} catch (e) {
					$gmedit["electron.Dialog"].showError("Error! " + e);
				}
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