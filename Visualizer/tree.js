/*
* Set of functions for drawing tree visualizations and animations
*
* Author: Dan Filler 3.2019
*/

/* 
* creates a new tree represented by coordinates in node_center_list
* based on the current properties of the visualization
*
* clears node_center_list
*/

/*
* COLOR DEFINITIONS
*/
let BLACK = "#000000";
let RED = "#dd3a2e";
let BLUE = "#3065ba";
let GREEN = "#28d67c";
let ORANGE = "#d68728";

function generate_new_tree() {
	node_center_list.length = 0;

	let num_in_row = 1;
	let current_y_pos = top_and_bottom_margin;

	for(var row=0; row<depth; row++) {
		for(var pos_in_row=0; pos_in_row<num_in_row; pos_in_row++) {
			//calculate center of square
			let current_x_pos = Math.floor(canvas.width * (pos_in_row + 1) / (num_in_row + 1));
			//draw node square in black
			draw_square(BLACK,current_x_pos, current_y_pos);
			//add to node_center_list
			node_center_list.push([current_x_pos,current_y_pos]);
		}
		num_in_row *= branching_factor;
		current_y_pos += stretch_height;
	}
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

	//console.log(node_center_list);
	for(var i=0; i<nodes.length; i++) {
		current_x_pos = nodes[i][0]
		current_y_pos = nodes[i][1]
		draw_square(BLACK, current_x_pos, current_y_pos);

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

/* 
* animation for breadth first searching algorithm
*/
function bfs_animation() {
	generate_new_tree();
	draw_tree(node_center_list);
	//get index of first entry of bottom row
	let first_index_in_bottom_row = 0;
	for (var d=0; d<depth - 1; d++) {
		first_index_in_bottom_row = (first_index_in_bottom_row * branching_factor) + 1;
	}
	//add rand number between 0 and number of nodes in bottom row to pick a random node from last row
	let goal_index = first_index_in_bottom_row +
	 Math.floor(Math.random() * (Math.pow(branching_factor, depth-1))); 

	//draw goal square red
	draw_square(RED, node_center_list[goal_index][0], node_center_list[goal_index][1]);

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
	setInterval( function() {
		if(flag && open_set.length > 0) {
			let current_node = open_set.shift();
			let current_node_coord = current_node.node_coord;
			let current_node_index = current_node.index;

			//highlight current node
			draw_square(BLUE, current_node_coord[0], current_node_coord[1]);

			if (current_node_index == goal_index) {
				//if reached goal node
				paint_set(ORANGE, find_path_set(open_set, current_node));
				closed_set.push(current_node_coord);
				flag = false;
				console.log(current_node);
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
			closed_set.push(current_node_coord);

		} else {
			return;
		}
	}, speed);
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

/* Paints node_set in color
*  - node_set:
*		array specifiying set of nodes to be painted
*  - color:
*		rgba value to paint nodes to
*/
function paint_set(color, nodes) {
	//don't know why this broke when using a for/in loop, so I'm using this mess
	for(var i=0;i<nodes.length;i++) {
		let node = nodes[i];
		draw_square(color, node[0], node[1]);
	}
}