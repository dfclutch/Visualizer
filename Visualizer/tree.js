/*
* Set of functions for drawing tree visualizations and animations
*
* Author: Dan Filler 3.2019
*/

/***************      TREE GENERATION     ***************/
/* 
* creates a new tree represented by coordinates in node_center_list
* based on the current properties of the visualization
*
* clears god_nodes
*/ 
function generate_tree() {
	god_nodes.length = 0;
	let num_of_nodes = 0;

	let num_in_row = 1;
	let current_y_pos = top_and_bottom_margin;

	for(var row=0; row<depth; row++) {
		for(var pos_in_row=0; pos_in_row<num_in_row; pos_in_row++) {
			num_of_nodes++;
			//calculate center of square
			let current_x_pos = Math.floor(canvas.width * (pos_in_row + 1) / (num_in_row + 1));
			//add to node_center_list
			god_nodes.push([current_x_pos,current_y_pos]);
		}
		num_in_row *= branching_factor;
		current_y_pos += stretch_height;
	}
	return num_of_nodes;
}

function generate_tree_edges() {
	god_edges.length = 0;
	for(var i=1; i<god_nodes.length; i++) {
		let child_node = god_nodes[i];
		let parent_index = Math.floor((i-1) / branching_factor);
		let parent_node = god_nodes[parent_index];
		god_edges.push([child_node, parent_node]);
	}

}

/***************      TREE ANIMATION GENERATORS      ***************/

/* 
* animation for breadth first searching algorithm on a tree
*/
function tree_bfs_animation() {
	let num_of_nodes = generate_tree();
	frames.length = 0;
	//create a valid goal index
	let goal_index = find_goal_index();
	let goal_coord = [god_nodes[goal_index][0], god_nodes[goal_index][1]];
	//draw goal square red
	let goal_node_set = [[goal_coord], RED];

	let open = [];
	let closed = [];
	let goal_not_found = true;

	open.push({
		coord: god_nodes[0], //add root to open set
		parent: null,
		index: 0
	})

	//add initial graph to frame set
	let graph_nodes = [god_nodes, BLACK];
	let graph_edges = [god_edges, BLACK];

	frames.push({
		nodes: [graph_nodes],
		edges: [graph_edges]
	});
	//create animation frames
	while(open.length > 0) {
		let current_node = open.shift();
		let current_node_coord = current_node.coord;
		let current_node_index = current_node.index;
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

		//add branching_factor number children to open set
		for (let i=1;i<=branching_factor;i++) {
			let current_child_index = (branching_factor * current_node_index) + i;
			let current_child_coord = god_nodes[current_child_index];
			//add child to open set
			open.push({
				coord: current_child_coord,
				parent: current_node,
				index: current_child_index
			});
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
			nodes: [graph_nodes, goal_node_set, closed_node_set, search_node_set, ], 
			edges: [graph_edges, search_edge_set]
			});
		//add current to closed set
		closed.push(current_node_coord);
	}
	//animate frames created by BFS
	animate();
}

/* 
* animation for depth first searching algorithm on a tree
*/
function tree_dfs_animation() {
	let num_of_nodes = generate_tree();
	frames.length = 0;
	//create a valid goal index
	let goal_index = find_goal_index();
	let goal_coord = [god_nodes[goal_index][0], god_nodes[goal_index][1]];
	//draw goal square red
	let goal_node_set = [[goal_coord], RED];

	let open = [];
	let closed = [];
	let goal_not_found = true;

	open.unshift({
		coord: god_nodes[0], //add root to open set
		parent: null,
		index: 0,
		depth: 0
	});

	//add initial graph to frame set
	let graph_nodes = [god_nodes, BLACK];
	let graph_edges = [god_edges, BLACK];

	frames.push({
		nodes: [graph_nodes],
		edges: [graph_edges]
	});
	//create animation frames
	while(open.length > 0) {
		let current_node = open.pop();
		let current_node_coord = current_node.coord;
		let current_node_index = current_node.index;
		let current_depth = current_node.depth;

		if(current_depth == depth) {
			continue;
		}

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
		} 

		//add branching_factor number children to open set
		for (let i=branching_factor;i>0;i--) {
			let current_child_index = (branching_factor * current_node_index) + i;
			let current_child_coord = god_nodes[current_child_index];
			//add child to open set
			open.push({
				coord: current_child_coord,
				parent: current_node,
				index: current_child_index,
				depth: current_depth + 1
			});
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
			nodes: [graph_nodes, goal_node_set, closed_node_set, search_node_set, ], 
			edges: [graph_edges, search_edge_set]
			});
		//add current to closed set
		closed.push(current_node_coord);
	}
	//animate frames created by BFS
	animate();
}

/***************      HELPER FUNCTIONS FOR MAIN ANIMATIONS      ***************/

/*
* Find and return a goal index in the last row of the tree
*/
function find_goal_index() {
	//get index of first entry of bottom row
	let first_index_in_bottom_row = 0;
	for (var d=0; d<depth - 1; d++) {
		first_index_in_bottom_row = (first_index_in_bottom_row * branching_factor) + 1;
	}
	//add rand number between 0 and number of nodes in bottom row to pick a random node from last row
	let goal_index = first_index_in_bottom_row +
	 Math.floor(Math.random() * (Math.pow(branching_factor, depth-1)));

	return goal_index;
}

/*
* Finds shortest path from goal node to root
*
* open_set:
*	- Array of pairs of [node_coord, parent]
*	  Where node_coord is coordinate of node and parent is
*	  member of open_set
*/
function find_path_set(node) {
	let node_set = [];
	let edge_set = [];
	while (node.parent != null) {
		node_set.push(node.coord);
		edge_set.push([node.coord, node.parent.coord])
		node = node.parent;
	}
	//add root
	node_set.push(god_nodes[0]);
	return {
		nodes: node_set.slice(0),
		edges: edge_set.slice(0)
	};
}