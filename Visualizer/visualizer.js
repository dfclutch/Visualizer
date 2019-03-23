/*
* Main JS file for running the minimax/alpha beta pruning visualization
* Note: This is not a good way to write javascript or a fast
* way to implement these algorithms. This is just an educational
* Visualization
*
* Author: Dan Filler 3/19
*/

/**********			Global Variables			**********/
var canvas = document.getElementById("viewport"); 
var context = canvas.getContext("2d");

/* create list of node centers for graph */
let node_center_list = [];

/*list of animations to be ended by end animations, this is a terrible way to do it*/
let bfs_animation_timer, dfs_animation_timer, minimax_animation_timer;

/**********			Main Graphics Functions		**********/

/*
* Draws a square in color centered at center_x, center_y of side node_size x node_size
*
* - color:
*	string representing color in hex or rgba e.g. "#______" or "rgba{_,_,_,_}"
* - coord:
*	(int, int) pair representing coordinate of the center of the square to be drawn
*/
function draw_square(color, coord) {
	context.fillStyle = color;
	let min_x = coord[0] - node_size;
	let min_y = coord[1] - node_size;
	context.clearRect(min_x, min_y, node_size * 2, node_size * 2)
	context.beginPath();
	context.fillRect(min_x, min_y, node_size * 2, node_size * 2)
}

function draw_square_with_text(color, text, node) {
	draw_square(color, node);
	context.font = (node_size * 3).toString() + "px Arial";
	context.fillStyle = color;
	context.textAlign = "center";

	context.fillText(text, node[0] - 3 * node_size, node[1] + node_size);
	
}

/* 
* Paints node_set in color
*  - node_set:
*		array specifiying set of nodes to be painted
*  - color:
*		rgba value to paint nodes to
*/
function paint_set(color, nodes) {
	//don't know why this broke when using a for/in loop, so I'm using this mess
	for(var i=0;i<nodes.length;i++) {
		draw_square(color, nodes[i]);
	}
}

/* 
* Paints node_set in color with text attached to nodes
*  - node_set:
*		array specifiying set of nodes to be painted and text
*  - color:
*		rgba value to paint nodes to
*/
function paint_set_with_text(color, nodes) {
	//don't know why this broke when using a for/in loop, so I'm using this mess
	for(var i=0;i<nodes.length;i++) {
		let node = nodes[i];
		draw_square_with_text(color, node.text, node.coord);
	}
}

function end_animations() {
	clearInterval(bfs_animation_timer);
	clearInterval(dfs_animation_timer);
	clearInterval(minimax_animation_timer);
	draw_tree(node_center_list);

}

/**********			Option updates			**********/

/*
* Handle branching factor, depth slider, and start button updates
*/
branching_factor_update = function() {
    branching_factor = branching_factor_element.valueAsNumber;
   	end_animations();
    generate_new_tree()
    draw_tree(node_center_list);
}

depth_update = function() {
    depth = depth_element.valueAsNumber;
    stretch_height = canvas.height / depth;
   	end_animations();
    generate_new_tree()
    draw_tree(node_center_list);
}

density_update = function() {
    density_height = density_element.valueAsNumber;
   	end_animations();
    draw_tree(node_center_list);
}

window_width_update = function() {
	canvas.width = window_width_element.valueAsNumber;
   	end_animations();
	generate_new_tree()
    draw_tree(node_center_list);
}

node_size_update = function() {
	node_size = node_size_element.valueAsNumber;
   	end_animations();
	generate_new_tree()
    draw_tree(node_center_list);
}

speed_update = function() {
	speed = 500 - speed_element.valueAsNumber;
   	end_animations();
	generate_new_tree()
    draw_tree(node_center_list);
}


/**********			Event listener Registration			**********/

/*
* Get initial branching factor and depth, register event listeners for buttons
*/
let branching_factor_element = document.getElementById("branching");
let branching_factor = branching_factor_element.valueAsNumber;
branching_factor_element.addEventListener("change", branching_factor_update, false);

branching_factor_element.value = 2;

let depth_element = document.getElementById("depth");
let depth = depth_element.valueAsNumber;
depth_element.addEventListener("change", depth_update, false);

let bfs_start_button = document.getElementById("bfs_start_button");
bfs_start_button.addEventListener("click", bfs_animation, false);

let density_element = document.getElementById("density");
let density_height = density_element.valueAsNumber;
density_element.addEventListener("change", density_update, false);

let window_width_element = document.getElementById("window_width");
let window_width = window_width_element.valueAsNumber;
window_width_element.addEventListener("change", window_width_update, false);

let dfs_start_button = document.getElementById("dfs_start_button");
dfs_start_button.addEventListener("click", dfs_animation, false);

let node_size_element = document.getElementById("node_size");
let node_size = node_size_element.valueAsNumber;
node_size_element.addEventListener("change", node_size_update, false);

let speed_element = document.getElementById("speed");
let speed = speed_element.valueAsNumber;
speed_element.addEventListener("change", speed_update, false);

let mini_start_button = document.getElementById("mini_start_button");
mini_start_button.addEventListener("click", minimax_animation, false);


/**********			Initial Values			**********/

branching_factor_element.value = branching_factor = 2;

depth_element.value = depth = 6;

let top_and_bottom_margin = 15;
stretch_height = Math.floor((canvas.height - top_and_bottom_margin) / depth);

window_width_element.value = canvas.width = 1200;


node_size_element.value = node_size = 6;
speed = 100;
speed_element.value = 400;

// load initial visual
window.onload = function() {
	generate_new_tree();
	draw_tree(node_center_list);
}