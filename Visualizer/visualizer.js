/*
* Main animation processing
*
* Author: Dan Filler 3.19
*/

/**********			Global Variables			**********/
var canvas = document.getElementById("viewport"); 
var context = canvas.getContext("2d");

/* 
* create list of nodes and edges for graph where entries are 
* [node/edge_set, {color_set or color}, {text_set}] groups 
*/
let god_nodes = [];
let god_edges = [];

/* 
* Frames - an array representing a graph state at a single time 
* Entries are [node_set, edge_set] pairs where node_set and edge_set 
* are valid node/edge sets consisting of coordinates, colors, and text
*/
let frames = [];

/* main animation */
let animation;


/**********			Main Graphics Engine			**********/
/* 
* A basic Graphics Engine for animating and drawing graphs
* Comprised of generic functions that get populated by calls to specific animation functions
*/

/*
* Main animation function, calls draw_node_set and draw_edge_set based on the contents
* of node_sets and edge_sets
*
* Prior to this function running (or concurrently)
*/
function animation_update() {
	let frame_index = 0;
	animation = setInterval( function() {
		if (frame_index < frames.length) {
			let current_frame = frames[frame_index];
			let node_sets = current_frame[0];
			let edge_sets = current_frame[1];
			for (node_set in node_sets) {
				draw_node_set(node_set[0], node_set[1], node_set[2]);
			}
			for (edge_set in edge_sets) {
				draw_edge_set(edge_set[0], edge_set[1], edge_set[2]);
			}
		} else {
			clearInterval(animation);
		}
	}, speed);
}

/*
* ends currently running animation for updates
*/
function end_animation() {
	clearInterval(animation);
}

/*
* Draws a set of nodes in a set of colors, with an optional set of text
*
* - nodes:
*	set of ordered pairs [x_coord, y_coord] representing the centers of nodes of a graph
*	whose size is (node_size x node_size)
* - colors:
* 	optional type: if typeof colors is array: then {nodes[i]} is of color {colors[i]}
*	for each 0 <= i < nodes.length
*	otherwise if typeof colors is string: then the the color of the squares representing all of
* 	nodes[i] is colors, usually a hex value.
* - text:
*	optional: if typeof text is array: then text[i] is attached to nodes[i] for each 0 <= i < nodes.length
*	otherwise if typeof text is undefined: then the text of the square representing nodes[i] has no text
*/
function draw_node_set(nodes, colors, text) {
	context.clearRect(0,0,canvas.width, canvas.height);
	context.beginPath();
	if (typeof colors == "array") {
		if(typeof text =="array") {
			for (var i=0;i<nodes.length;i++) {
				draw_node(nodes[i], colors[i], text[i]);
			}
		} else {
			for (var i=0;i<nodes.length;i++) {
				draw_node(nodes[i], colors[i]);
			}
		}
	} else {
		for(var i=0; i<nodes.length; i++) {
			draw_node(nodes[i], colors);
		}
	}
}

/* 
* Draws an edge set in a specified color set, with optional edge weights

* - edges:
*	set of ordered pairs [node1, node2] representing the edge of a graph spanning between
*	node1 and node2 where node1 and node2 are [x_coord, y_coord] ordered pairs
* - colors:
* 	optional type: if typeof colors is array: then {edges[i]} is of color {edges[i]} 
*	for each 0 <= i < edges.length
*	otherwise if typeof colors is string: then the color of the {edges} representing all of
* 	{edges} is colors, usually a hex value.
* - text:
*	optional: if typeof text is array: then text[i] is attached to edges[i] for each 0 <= i < edges.length
*	otherwise if typeof text is undefined: then the text of the edge representing edges[i] has no text
*/
function draw_edge_set(edges, colors, text) {
	context.lineWidth = .5;
	if(typeof colors == "array") {
		if (typeof text == "array"){
			for (var i=0; i<edges.length; i++) {
				let node1 = edges[i][0];
				let node2 = edges[i][1];
				draw_edge(node1, node2, colors[i], text[i]);
			}
		} else {
			for (var i=0; i<edges.length; i++) {
				let node1 = edges[i][0];
				let node2 = edges[i][1];
				draw_edge(node1, node2, colors[i]);
			}
		}
	} else {
		for (var i=0; i<edges.length; i++) {
				let node1 = edges[i][0];
				let node2 = edges[i][1];
				draw_edge(node1, node2, colors);
		}
	}
}

/*
* Draws a square in color centered at node [x, y] of side node_size x node_size
* in color with optional text
*
* - node:
*	(int, int) pair representing coordinate of the center of the square to be drawn
* - color:
*	string representing color in hex or rgba e.g. "#______" or "rgba{_,_,_,_}"
* - text:
*	optional: if typeof text == string: then node has text {text} attached
*	else: node has no text
*/
function draw_node(node, color, text) {
	context.fillStyle = color;
	let min_x = node[0] - node_size;
	let min_y = node[1] - node_size;
	context.fillRect(min_x, min_y, node_size * 2, node_size * 2)

	// if (typeof text != "undefined"); {
	// 	context.font = (node_size * 3).toString() + "px Arial";
	// 	context.textAlign = "center";
	// 	context.fillText(text, node[0] - 3 * node_size, node[1] + node_size);
	// }
}

/*
* Draws an edge in color centered at from coordinates of node1 to node2 in color
* with optional text
*
* - node:
*	(int, int) pair representing coordinate of the center of the square to be drawn
* - color:
*	string representing color in hex or rgba e.g. "#______" or "rgba{_,_,_,_}"
* - text:
*	optional: if typeof text == string: then edge has text {text} attached
*	else: edge has no text
*/
function draw_edge(node1, node2, color, text) {
	context.lineWidth = .5;
	context.moveTo(node1[0], node1[1]);
	context.lineTo(node2[0], node2[1]);
	context.fillStyle = color;
	context.stroke();

	if (typeof text == "string") {
		context.font = (node_size * 3).toString() + "px Arial";
		context.textAlign = "center";
		context.fillText(
			text, Math.floor((node1[0] + node2[0])/2) - 20, 
			Math.floor((node1[1] + node2[1])/2)
		);
	}
}

/*
* COLOR DEFINITIONS
*/
let BLACK = "#000000";
let RED = "#ff1c1c";
let BLUE = "#3065ba";
let GREEN = "#28d67c";
let ORANGE = "#ffd11c";
let WHITE = "#FFFFFF";

/**********			Option updates			**********/

/*
* Handle branching factor, depth slider, and start button updates
*/
branching_factor_update = function() {
    branching_factor = branching_factor_element.valueAsNumber;
   	end_animation();
   	generate();
   	draw_node_set(god_nodes, BLACK);
   	draw_edge_set(god_edges, BLACK);
}

depth_update = function() {
    depth = depth_element.valueAsNumber;
    stretch_height = canvas.height / depth;
   	end_animation();
   	generate();
   	draw_node_set(god_nodes, BLACK);
   	draw_edge_set(god_edges, BLACK);
}

density_update = function() {
    density = density_element.valueAsNumber;
   	end_animations();
    generate_new_edge_set();
    draw_edge_set(god_edges, BLACK);
}

window_width_update = function() {
	canvas.width = window_width_element.valueAsNumber;
   	end_animations();
   	generate();
   	draw_node_set(god_nodes, BLACK);
   	draw_edge_set(god_edges, BLACK);
}

node_size_update = function() {
	node_size = node_size_element.valueAsNumber;
   	end_animations();
   	draw_node_set(god_nodes, BLACK);
}

speed_update = function() {
	speed = 500 - speed_element.valueAsNumber;
   	end_animations();
}

graph_type_update = function() {
	for (var i =0;i<graph_type_elements.length; i++) {
		let option = graph_type_elements[i];
		if (option.checked) {
			graph_type = option.value;
		}
	}
	end_animations();
	generate();
	draw_node_set(god_nodes);
	draw_edge_set(god_edges);
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
let density = density_element.valueAsNumber;
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
//mini_start_button.addEventListener("click", minimax_animation, false);

let graph_type_elements= document.getElementsByName("graph_type");
let graph_type = "tree";
for (var i =0;i<graph_type_elements.length; i++) {
	let option = graph_type_elements[i];
	if (option.checked) {
		graph_type = option.value;
	}
	option.addEventListener("change", graph_type_update, false);
}

/**********			Option Muliplexers			**********/

function generate() {
	switch(graph_type) {
		case "tree":
			generate_tree();
			generate_tree_edges();
			break;
		case "random": 
			generate_graph();
			generate_edge_set();
			break;
		default:
	}
}

function bfs_animation() {
	end_animations();
	switch(graph_type) {
		case "tree":
			tree_bfs_animation();
			break;
		case "random": 
			graph_bfs_animation();
			break;
		default:
	}
}

function dfs_animation() {
	end_animations();
	switch(graph_type) {
		case "tree":
			tree_dfs_animation();
			break;
		case "random": 
			graph_dfs_animation();
			break;
		default:
	}
}


/**********			Initial Values			**********/

branching_factor_element.value = branching_factor = 2;

depth_element.value = depth = 6;

let top_and_bottom_margin = 15;
stretch_height = Math.floor((canvas.height - top_and_bottom_margin) / depth);

window_width_element.value = canvas.width = 1200;


node_size_element.value = node_size = 6;
speed = 100;
speed_element.value = 400;

density = 2;
graph_type = "tree";

// load initial visual
window.onload = function() {
	generate();
	draw_node_set(god_nodes, BLACK);
	draw_edge_set(god_edges, BLACK);
}