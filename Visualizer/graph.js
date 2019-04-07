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
/*
* Note that for graphs, god_edges is a set of INDICES from god_nodes, NOT coordinate pairs.
* This will be rewrittent in tree.js to match this far better scheme
*/

/*
* special global for graphs, allows easy tracking of relationships
*
* Entry at god_rels[i] is arrays of indexes (in god_nodes) of children of god_nodes[i]
*/
let god_rels = [];

function generate_graph() {
	god_nodes.length = 0;
	let num_of_nodes = Math.floor(branching_factor * depth);

	for(var i=0; i<num_of_nodes; i++) {
		let new_x_coord = Math.floor((Math.random() * (canvas.width - 50) * 20 + 50) / 20);
		let new_y_coord = Math.floor((Math.random() * (canvas.height - 50) * 10 + 50) / 10);
		let new_coord = [new_x_coord, new_y_coord];
		god_nodes.push(new_coord);
	}
}

function generate_edge_set() {
	god_edges.length = 0;
	god_rels.length = 0;
	for(var i=0; i<god_nodes.length; i++) {
		let current_node = god_nodes[i];
		let current_rel = [];
		//generate rand number of children between 0 and density
		let num_connected = 1 + Math.floor(Math.random() * density);
		var j = 0;
		while (j < num_connected ){
			let connected_node_index = Math.floor(Math.random() * god_nodes.length);
			//add num_connected number of connected nodes to edges list
			if(connected_node_index != i) {
				god_edges.push([god_nodes[i], god_nodes[connected_node_index]]);
				current_rel.push(connected_node_index);
				j++;
			}
		}
		//add node (now with children array)
		god_rels.push(current_rel);
	}
}


/***************      GRAPH ANIMATIONS     ***************/

function graph_bfs_animation() {
	let num_of_nodes = god_nodes.length;
	frames.length = 0;
	text_output.innerHTML = "";
	//create valid goal index from anywhere in graph
	let goal_index = Math.floor(Math.random() * num_of_nodes);
	let goal_coord = [god_nodes[goal_index][0], god_nodes[goal_index][1]];
	let goal_node_set = [[goal_coord], RED];
	let start_node_set = [[god_nodes[0]], BLUE];
	let open = [];
	let closed = [];

	open.push({
		coord: god_nodes[0], //add root to open set
		parent: null,
		index: 0,
		children: god_rels[0].slice(0)
	});

	//add initial graph to frame set
	let graph_nodes = [god_nodes, BLACK];
	let graph_edges = [god_edges, BLACK];

	frames.push({
		nodes: [graph_nodes],
		edges: [graph_edges]
	});
	let current_node;
	//create animation frames
	while(open.length > 0) {
		current_node = open.shift();
		let current_node_coord = current_node.coord;
		let current_node_index = current_node.index;
		let current_children = current_node.children;

		//check if goal
		if (current_node_index == goal_index) {
			//repaint closed set (viewed nodes)
			let closed_node_set = [closed, GREEN];
			let path = find_path_set(current_node);
			let search_nodes = path.nodes;
			let search_edges = path.edges;
			let search_node_set = [search_nodes, RED]
			let search_edge_set = [search_edges, RED]
			//add frame to animation
			frames.push({
				nodes: [graph_nodes, closed_node_set, search_node_set], 
				edges: [graph_edges, search_edge_set]
			});
			break;
		//check if past end (should never happen)
		} else if (current_node_index > num_of_nodes) {
			break;
		}
		for (let i=0;i<current_children.length;i++) {
			let current_child_index = current_children[i];
			let current_child_coord = god_nodes[current_child_index];
			let current_child_children = god_rels[current_child_index].slice(0);
			//add child to open set
			if(!in_set(closed, current_child_coord)) {
				open.push({
					coord: current_child_coord,
					parent: current_node,
					index: current_child_index,
					children: current_child_children
				});
			}
		}
		//generate frame
		let closed_node_set = [closed.slice(0), GREEN];
		let path = find_path_set(current_node);
		let search_nodes = path.nodes;
		let search_edges = path.edges;
		let search_node_set = [search_nodes, YELLOW];
		let search_edge_set = [search_edges, YELLOW];

		//add frame to animation containing 3 node colors and edge set
		frames.push({
			nodes: [graph_nodes, goal_node_set, closed_node_set, search_node_set, start_node_set], 
			edges: [graph_edges, search_edge_set]
		});
		//add current to closed set
		closed.push(current_node_coord);
	}
	//if no solution in graph
	if (open.length == 0 && current_node.index != goal_index) {
		text_output.innerHTML = "No Solution."
	}
	//animate frames created by BFS
	animate();
}


function graph_dfs_animation() {
	let num_of_nodes = god_nodes.length;
	frames.length = 0;
	text_output.innerHTML = "";
	//create valid goal index from anywhere in graph
	let goal_index = Math.floor(Math.random() * num_of_nodes);
	let goal_coord = [god_nodes[goal_index][0], god_nodes[goal_index][1]];
	let goal_node_set = [[goal_coord], RED];
	let start_node_set = [[god_nodes[0], BLUE]];
	let open = [];
	let closed = [];

	open.unshift({
		coord: god_nodes[0], //add root to open set
		parent: null,
		index: 0,
		children: god_rels[0].slice(0)
	});

	//add initial graph to frame set
	let graph_nodes = [god_nodes, BLACK];
	let graph_edges = [god_edges, BLACK];

	frames.push({
		nodes: [graph_nodes],
		edges: [graph_edges]
	});
	let current_node;
	//create animation frames
	while(open.length > 0) {
		current_node = open.pop();
		let current_node_coord = current_node.coord;
		let current_node_index = current_node.index;
		let current_children = current_node.children;

		//check if goal
		if (current_node_index == goal_index) {
			//repaint closed set (viewed nodes)
			let closed_node_set = [closed, GREEN];
			let path = find_path_set(current_node);
			let search_nodes = path.nodes;
			let search_edges = path.edges;
			let search_node_set = [search_nodes, RED]
			let search_edge_set = [search_edges, RED]
			//add frame to animation
			frames.push({
				nodes: [graph_nodes, closed_node_set, search_node_set], 
				edges: [graph_edges, search_edge_set]
			});
			break;
		//check if past end (should never happen)
		} else if (current_node_index > num_of_nodes) {
			break;
		}
		for (let i=0;i<current_children.length;i++) {
			let current_child_index = current_children[i];
			let current_child_coord = god_nodes[current_child_index];
			let current_child_children = god_rels[current_child_index].slice(0);
			//add child to open set
			if(!in_set(closed, current_child_coord)) {
				open.push({
					coord: current_child_coord,
					parent: current_node,
					index: current_child_index,
					children: current_child_children
				});
			}
		}
		//generate frame
		let closed_node_set = [closed.slice(0), GREEN];
		let path = find_path_set(current_node);
		let search_nodes = path.nodes;
		let search_edges = path.edges;
		let search_node_set = [search_nodes, YELLOW];
		let search_edge_set = [search_edges, YELLOW];

		//add frame to animation containing 3 node colors and edge set
		frames.push({
			nodes: [graph_nodes, goal_node_set, closed_node_set, search_node_set, start_node_set], 
			edges: [graph_edges, search_edge_set]
		});
		//add current to closed set
		closed.push(current_node_coord);
	}
	//if no solution in graph
	if (open.length == 0 && current_node.index != goal_index) {
		text_output.innerHTML = "No Solution."
	}
	//animate frames created by BFS
	animate();
}

/***************      HELPER FUNCTIONS FOR MAIN ANIMATIONS      ***************/

function in_set(set, coord) {
	for (var i =0;i < set.length; i++) {
		let current_coord = set[i];
		if (coord == current_coord) {
			return true;
		}
	}
	return false;
}