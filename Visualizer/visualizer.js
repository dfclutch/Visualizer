/*
* Main JS file for running the minimax/alpha beta pruning visualization
* Note: This is not a good way to write javascript or a fast
* way to implement these algorithms. This is just an educational
* Visualization
*
* Author: Dan Filler 3/19
*/

/* Get canvas info */
var canvas = document.getElementById("viewport"); 
var context = canvas.getContext("2d");

/* create list of node centers for graph */
let node_center_list = [];

/*
* Handle branching factor, depth slider, and start button updates
*/
branching_factor_update = function() {
    branching_factor = branching_factor_element.valueAsNumber;
    generate_new_tree()
    draw_tree(node_center_list);
}

depth_update = function() {
    depth = depth_element.valueAsNumber;
    stretch_height = canvas.height / depth;
    generate_new_tree()
    draw_tree(node_center_list);
}

density_update = function() {
    density_height = density_element.valueAsNumber;
    draw_tree(node_center_list);
}

window_width_update = function() {
	canvas.width = window_width_element.valueAsNumber;
	generate_new_tree()
    draw_tree(node_center_list);
}

node_size_update = function() {
	node_size = node_size_element.valueAsNumber;
	generate_new_tree()
    draw_tree(node_center_list);
}

speed_update = function() {
	speed = 500 - speed_element.valueAsNumber;
	generate_new_tree()
    draw_tree(node_center_list);
}

// Create the image
function draw_square(color, center_x, center_y) {
	context.fillStyle = color;
	let min_x = center_x - node_size;
	let min_y = center_y - node_size;
	context.clearRect(min_x, min_y, node_size * 2, node_size * 2)
	context.beginPath();
	context.fillRect(min_x, min_y, node_size * 2, node_size * 2)
}


/*
* Get initial branching factor and depth, register event listeners for buttons
*/
let branching_factor_element = document.getElementById("branching");
let branching_factor = branching_factor_element.valueAsNumber;
branching_factor_element.addEventListener("change", branching_factor_update, false);

let dfs_start_button = document.getElementById("dfs_start_button");
dfs_start_button.addEventListener("click", dfs_animation, false);

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

let node_size_element = document.getElementById("node_size");
let node_size = node_size_element.valueAsNumber;
node_size_element.addEventListener("change", node_size_update, false);

let speed_element = document.getElementById("speed");
let speed = speed_element.valueAsNumber;
speed_element.addEventListener("change", speed_update, false);

//controls for initial values, also for playing around with while testing
branching_factor = 2;
depth = 7;

let top_and_bottom_margin = 15;
stretch_height = Math.floor((canvas.height - top_and_bottom_margin) / depth);

node_size = 4;
speed = 100;

// load initial visual
window.onload = function() {
	generate_new_tree();
	draw_tree(node_center_list);
}