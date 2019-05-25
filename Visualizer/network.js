/*
* Set of functions for animating Graphs
*
* This is an edge-weighted graph. Before invoking these functions, 
* you must call a Nodes and Edges generation function to clear 
* and populate these arrays. Then reanimate the graph using these calls
*
* Author: Dan Filler 4.2019
*/

/***************      GRAPH GENERATION     ***************/
/*
* special global for graphs, allows easy tracking of relationships
*
* Entry at god_weights[i] is integer representing the weight at god_edges[i]
*/
function generate_edge_flows() {
	god_edges.length = 0;
	god_rels.length = 0;

	for (var i=0; i<god_nodes.length;i++) {
		let current_node = god_nodes[i];
		//generate rand number of children between 0 and density
		let num_connected = 1 + Math.floor(Math.random() * density);
		var j = 0;
		while (j < num_connected ){
			let connected_node_index = Math.floor(Math.random() * god_nodes.length);
			//add num_connected number of connected nodes to edges list if not already existant
			//and non-self relating
			if(connected_node_index != i && god_rels[i].indexOf(connected_node_index) == -1) {
				god_edges.push([god_nodes[i], god_nodes[connected_node_index]]);
				let current_flow = {
					amount: 0,
					capacity: Math.abs(god_weights[i]), //just want to keep these positive
					residual: Math.abs(god_weights[i]),
				}

				edge_flows.push(current_flow);
				j++;
			}
		}
	}
	return(edge_flows);
}


/***************      GRAPH ANIMATIONS     ***************/

function ew_maxflow_animation() {
	let num_of_nodes = god_nodes.length;
	let edge_flows = generate_edge_flows();
	frames.length = 0;
	text_output.innerHTML = "";
	//generate source and sinks
	let source_index = 0; //will evetually write a method to set to furthest left x value's index
	//tries to put them somewhat far apart
	let sink_index = generate_far_index(god_nodes[0][0], num_of_nodes);

	let source_sink_nodes = [
		[god_nodes[source_index][0], god_nodes[source_index][1]],
		[god_nodes[sink_index][0], god_nodes[sink_index][1]]
	];

	let max_flow = 0;  
	// object of nodes and edges describing path from source -> sink
	let parents = [];
	parents.length = god_nodes.length;
	parents.fill[-1];

	let current_index = source_index;
	//select random path as long as there is one
	while (find_aug_path(edge_flows, path, current_index, sink_index)) {
		let path_flow = Infinity;
		s = sink_index;
		//find min value along path
		while s != source_index {
			edge_flows[s]
		}
		//update residual graph
	}
}

//just makes a random path
function find_aug_path(edge_flows, parents, source, sink) {
	let open = [source];
	let closed = [];
	let visited = [];
	visited.length = god_nodes.length;
	visited.fill(false);
	visited[0] = true;

	while (open.length > 0) {
		let current_index = open.shift();
		let current_children = god_rels(current_index);
		current_children.foreach( function(i) {
			if(visited[i] == false && edge_flows[i]) {
				open.push(i);
				visited[i] = true;
				parents[i] = current_index;
			}
		})		
	}

	return visited[sink];
}

/* really terrible way of generating an index but it's
* not that important
*/
function generate_far_index (current_x, num_of_nodes) {
	let max_x_dist = current_x;
	let selected = -1;
	for (var i=0; i<num_of_nodes; i++) {
		let x_coord = god_nodes[i][0];
		if (x_coord > max_x_dist) {
			max_x_dist = x_coord;
			selected = i;
		}
	}
	return selected;
}

function edge_flowsToString(edge_flow) {
	return edge_flow.amount.toString() + "/" + edge_flow.capacity.toString();
}