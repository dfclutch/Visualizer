/*
* Set of functions for drawing tree visualizations and animations
*
* Author: Dan Filler 3.2019
*/

/*
* COLOR DEFINITIONS
*/
let BLACK = "#000000";
let RED = "#ff1c1c";
let BLUE = "#3065ba";
let GREEN = "#28d67c";
let ORANGE = "#ffd11c";
let WHITE = "#FFFFFF";

/***************      TREE GENERATION     ***************/
/* 
* creates a new tree represented by coordinates in node_center_list
* based on the current properties of the visualization
*
* clears node_center_list
*/ 
function generate_new_tree() {
	node_center_list.length = 0;
	let num_of_nodes = 0;

	let num_in_row = 1;
	let current_y_pos = top_and_bottom_margin;

	for(var row=0; row<depth; row++) {
		for(var pos_in_row=0; pos_in_row<num_in_row; pos_in_row++) {
			num_of_nodes++;
			//calculate center of square
			let current_x_pos = Math.floor(canvas.width * (pos_in_row + 1) / (num_in_row + 1));
			let node_coord = (current_x_pos, current_y_pos);
			//draw node square in black
			draw_square(BLACK, node_coord);
			//add to node_center_list
			node_center_list.push([current_x_pos,current_y_pos]);
		}
		num_in_row *= branching_factor;
		current_y_pos += stretch_height;
	}
	return num_of_nodes;
}


/* 
* draws a tree based on contents of nodes
*
* nodes:
*	- An array of coordinates representing the nodes of a tree to be painted
*/
function draw_tree(nodes) {
	context.clearRect(0,0,canvas.width, canvas.height);
	context.beginPath();
	context.lineWidth = .5;

	for(var i=0; i<nodes.length; i++) {
		draw_square(BLACK, nodes[i]);
		current_x_pos = nodes[i][0];
		current_y_pos = nodes[i][1];

		if (i > 0) {
			//calculate parent coordinates
			let index_of_parent = Math.floor((i - 1) / branching_factor);
			let parent_x_pos = node_center_list[index_of_parent][0];
			let parent_y_pos = node_center_list[index_of_parent][1];
			//draw line
			context.moveTo(parent_x_pos, parent_y_pos);
			context.lineTo(current_x_pos, current_y_pos);
			context.fillStyle = BLACK;
			context.stroke();
		}
	}
}

/***************      TREE ANIMATIONS      ***************/

/* 
* animation for breadth first searching algorithm on a tree
*/
function bfs_animation() {
   	end_animations();
	let num_of_nodes = generate_new_tree();
	draw_tree(node_center_list);
	
	//create a valid goal index
	let goal_index = find_goal_index();
	let goal_coord = [node_center_list[goal_index][0], node_center_list[goal_index][1]];
	//draw goal square red
	draw_square(RED, goal_coord);

	let i = 0;
	let open_set = [];
	let closed_set = [];
	let goal_not_found = true;

	open_set.push({
		node_coord: node_center_list[0], //add root to open set
		parent: null,
		index: 0
	})


	let flag = true;

	//animation function acts as main loop for BFS
	bfs_animation_timer = setInterval( function() {
		if(open_set.length > 0) {
			let current_node = open_set.shift();
			let current_node_coord = current_node.node_coord;
			let current_node_index = current_node.index;

			if (current_node_index == goal_index) {
				//repaint closed set (viewed nodes)
				paint_set(GREEN, closed_set)
				//paint successful path orange
				paint_set(ORANGE, find_path_set(open_set, current_node));
				//end animation
				clearInterval(bfs_animation_timer);
				return;
			} else if (current_node_index > num_of_nodes) {
				return;
			}
			//add branching_factor number children to open set
			for (let j=1;j<=branching_factor;j++) {
				let current_child_index = (branching_factor * current_node_index) + j;
				let current_child_coord = node_center_list[current_child_index];
				//add child to open set
				open_set.push({
					node_coord: current_child_coord,
					parent: current_node,
					index: current_child_index
				});
			}

			//repaint viewed nodes green and add most recent to closed set
			paint_set(GREEN, closed_set)
			//paint current search trace
			paint_set(ORANGE, find_path_set(open_set, current_node));
			closed_set.push(current_node_coord);
		} 
	}, speed);
}

/* 
* animation for depth first searching algorithm on a tree
*/
function dfs_animation() {
   	end_animations();
	let num_of_nodes = generate_new_tree();
	draw_tree(node_center_list);
	//create a valid goal index
	let goal_index = find_goal_index();
	let goal_coord = [node_center_list[goal_index][0], node_center_list[goal_index][1]];
	//draw goal square red
	draw_square(RED, goal_coord);

	let open_set = [];
	let closed_set = [];


	open_set.unshift({
		node_coord: node_center_list[0], //add root to open set
		parent: null,
		index: 0,
		depth: 0
	});

	//animation function acts as main loop for BFS
	dfs_animation_timer = setInterval(function () {
		if(open_set.length > 0) {
			let current_node = open_set.pop();
			let current_node_coord = current_node.node_coord;
			let current_node_index = current_node.index;
			let current_depth = current_node.depth;

			if(current_depth == depth) {
				return;
			}

			//check if goal
			if (current_node_index == goal_index) {
				//repaint closed set (viewed nodes)
				paint_set(GREEN, closed_set)
				//paint successful path orange
				paint_set(ORANGE, find_path_set(open_set, current_node));
				//end animation
				clearInterval(dfs_animation_timer);
				return;
			} 

			//add branching_factor number children to open set
			for (let j=branching_factor;j>0;j--) {
				let current_child_index = (branching_factor * current_node_index) + j;
				let current_child_coord = node_center_list[current_child_index];
				//add child to open set
				open_set.push({
					node_coord: current_child_coord,
					parent: current_node,
					index: current_child_index,
					depth: current_depth + 1
				});
			}

			//repaint viewed nodes green and add most recent to closed set
			paint_set(GREEN, closed_set)
			//paint current search trace
			paint_set(ORANGE, find_path_set(open_set, current_node));
			closed_set.push(current_node_coord);

		} 
	}, speed);
}



function minimax_animation() {
   	end_animations();
	let first_index_in_bottom_row = 0;
	for (var d=0; d<depth - 1; d++) {
		first_index_in_bottom_row = (first_index_in_bottom_row * branching_factor) + 1;
	}

	//track value of each node as (coord, value) pairs at position [index = node_center_list index] 
	let node_values = []; 
	let selected_nodes = [node_center_list[0]];

	//populate node_values minimax result
	create_minimax_tree(node_values, selected_nodes);

	//create and draw new tree for animation
	let num_of_nodes = generate_new_tree();
	draw_tree(node_center_list);

	let open_set = [];
	let closed_set = [];
	let completed_nodes = [];

	open_set.unshift({
		node_coord: node_center_list[0], //add root to open set
		parent: null,
		index: 0,
		depth: 1,
		completed: false,
		max_child: branching_factor,
	});

	//animation function acts as main loop for BFS
	minimax_animation_timer = setInterval( function() {
		if(open_set.length > 0) {
			let current_node = open_set.shift();
			let current_node_coord = current_node.node_coord;
			let current_node_index = current_node.index;
			let current_node_depth = current_node.depth;

			let current_max_child = (current_node_index * branching_factor + branching_factor);

			
			closed_set.push(current_node);

			if (current_node_index > 0) {
				add_completed_nodes(current_node, closed_set, completed_nodes, node_values);
			}

			if (current_node_depth - 1 == depth) {
				return;
			}
			//if past the end of the set
			if (current_node_index + 1 == num_of_nodes) {
				console.log("here")
				draw_tree(node_center_list);
				//repaint closed set (viewed nodes)
				paint_set_with_text(GREEN, completed_nodes)
				paint_set(BLUE, selected_nodes);
				//end animation
				clearInterval(minimax_animation_timer);
				return;
			} 
			//add branching_factor number children to open set
			for (let j=branching_factor;j>0;j--) {
				let current_child_index = (branching_factor * current_node_index) + j;
				let current_child_coord = node_center_list[current_child_index];
				let current_child_max_child = (current_child_index * branching_factor + branching_factor);
				//add child to open set
				open_set.unshift({
					node_coord: current_child_coord,
					parent: current_node,
					index: current_child_index,
					depth: current_node_depth + 1,
					completed: false,
					max_child: current_child_max_child
				});
			}

			let current_path_set = find_path_set(open_set, current_node);
			
			//repaint viewed nodes green and add most recent to closed set
			paint_set_with_text(GREEN, completed_nodes);

			//paint current search trace
			paint_set(ORANGE, current_path_set);

		}

	}, speed);
}

/***************      HELPER FUNCTIONS FOR MAIN ANIMATIONS      ***************/

function add_completed_nodes(current_node, search_set, completed_nodes, node_values) {
	if(current_node.parent == null) { //if its the root node
		return;
	}
	let has_new_occurence = false;
	if (current_node.depth == depth) {
		current_node.completed = true;
		has_new_occurence = true;

		completed_nodes.push({
					coord: current_node.node_coord,
					text: node_values[current_node.index]
		});

	} 
	if (!current_node.parent.completed) {
		if (current_node.completed && current_node.index == current_node.parent.max_child ) {
			current_node.parent.completed = true;

			completed_nodes.push({
					coord: current_node.parent.node_coord,
					text: node_values[current_node.parent.index]
			});

			add_completed_nodes(current_node.parent, search_set, completed_nodes, node_values);
			has_new_occurence = true;
		}
	}
}


/*
* does minimax algorithm on tree (of same b and d as the one being animated) with randomly
* valued end nodes
*
* returns an array of scored nodes to be revealed in order by minimax_animation() 
*/
function create_minimax_tree(node_values, selected_nodes) {
	/*
	* assign random numbers from -10 to 10 to last row
	*/
	//get index of first entry of bottom row
	let first_index_in_bottom_row = 0;
	for (var d=0; d<depth - 1; d++) {
		first_index_in_bottom_row = (first_index_in_bottom_row * branching_factor) + 1;
	}
	//assign random numbers to indices representing last row
	let number_in_row = Math.pow(branching_factor, depth-1);
	for(var i=0; i<number_in_row; i++) {
		let current_node_index = first_index_in_bottom_row + i
		//randomly generated values for bottom-row nodes
		node_values[current_node_index] = (10 - Math.floor(Math.random() * 20));
	}

	let minimax_depth = 0;
	let player = 0;
	//populate node_values with nodes of tree properly colored
	let overall_score = tree_minimax(node_values, selected_nodes, minimax_depth, 0);
}

function tree_minimax(node_values, selected_nodes, minimax_depth, node_index) {
	let is_maximizer = (minimax_depth % 2 == 0);
	//check if terminal - if so, return value of end node
	if (minimax_depth + 1 == depth) {
		return node_values[node_index];
	}

	let low_score = Infinity;
	let high_score = -Infinity;
	let selected_index;

	//Generate successor values
	let first_child_node = (node_index * branching_factor) + 1;
	for(var j=0; j < branching_factor; j++) {
		let child_node_index = first_child_node + j;
		let child_node_score = tree_minimax(node_values, selected_nodes, minimax_depth + 1, child_node_index);

		if (is_maximizer) {
			if(child_node_score > high_score) {
				high_score = child_node_score;
				selected_index = child_node_index;
			}
		} else {
			if(child_node_score < low_score) {
				low_score = child_node_score;
				selected_index = child_node_index;
			}
		}
	}
	let score = (is_maximizer) ? high_score : low_score

	node_values[node_index] = score;
	selected_nodes.push(node_center_list[selected_index]);

	return score;
}

/*
* Finds shortest path from goal node to root
*
* open_set:
*	- Array of pairs of [node_coord, parent]
*	  Where node_coord is coordinate of node and parent is
*	  member of open_set
*/
function find_path_set(open_set, node) {
	let path_set = [];

	while (node.parent != null) {
		path_set.unshift(node.node_coord);
		node = node.parent;
	}
	path_set.push(node_center_list[0]);
	return path_set;
}

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