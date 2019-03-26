/*
* Set of functions for animating Graphs
*
* This is a generalized graph. Before invoking these functions, 
* you must call a Nodes and Edges generation function to clear 
* and populate these arrays. Then reanimate the graph using these calls
*
* Author: Dan Filler 3.2019
*/

/***************      GRAPH GENERATION     ***************/

function generate_graph() {
	node_center_list.length = 0;
	let num_of_nodes = branching_factor * depth;

	for(var i=0; i<num_of_nodes; i++) {
		let new_x_coord = Math.floor((Math.random() * (canvas.width - 50) * 20 + 50) / 20);
		let new_y_coord = Math.floor((Math.random() * (canvas.height - 50) * 10 + 50) / 10);
		let new_coord = [new_x_coord, new_y_coord];
		god_nodes.push(new_coord);
	}
}

function generate_edge_set() {
	edges.length = 0;
	for(var i=0; i<node_center_list.length; i++) {
		let current_node = node_center_list[i];
		//generate rand number of children between 0 and density
		let num_connected = density + (Math.floor(Math.random() * density / 2));
		for (var j=0; j<num_connected; j++){
			let connected_node = node_center_list[Math.floor(Math.random() * node_center_list.length)];
			//add num_connected number of connected nodes to edges list
			god_edges.push([current_node, connected_node]);
		}
	}
}


/***************      GRAPH ANIMATIONS     ***************/
