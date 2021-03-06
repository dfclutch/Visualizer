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
* Entries are [node_sets, edge_sets] pairs where node_set and edge_set 
* are arrays of valid node/edge sets consisting of coordinates, colors, and text
*/
let frames = [];

/* main animation */
let animation_timer;

/* tracks if current graph type requires edge direction */
let undirected = true;


/**********			Main Graphics Engine			**********/
/* 
* A basic Graphics Engine for animating and drawing graphs
* Comprised of generic functions that get populated by calls to specific animation functions
*/

/*
* Main animation function, calls draw_node_set and draw_edge_set based on the contents
* of node_sets and edge_sets
*
* Prior to this function running a search algorithm must populate frames with node sets and edge
* sets representing full animation
*/
function animate() {
	animation_timer = setInterval( function() {
		if (frames.length > 0) {
			clear_canvas();
			let current_frame = frames.shift();
			let node_sets = current_frame.nodes;
			let edge_sets = current_frame.edges;
			//draw edge sets
			for (var i=0; i<edge_sets.length; i++){
				let edge_set = edge_sets[i];
				draw_edge_set(edge_set[0], edge_set[1], edge_set[2]);
			}
			//draw node sets
			for (var j=0; j<node_sets.length; j++) {
				let node_set = node_sets[j];
				draw_node_set(node_set[0], node_set[1], node_set[2]);
			}
		} else {
			clearInterval(animation_timer);
		}
	}, speed);
}

/*
* ends currently running animation for updates
*/
function end_animation() {
	clearInterval(animation_timer);
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
	for (var i=0; i<nodes.length; i++) {
		let params = [[nodes[i][0], nodes[i][1]]]; //params array to get fed to draw method
		if (typeof colors == "object") {
			params.push(colors[i]);
		} else {
			params.push(colors);
		}
		if (typeof text == "object") {
			params.push(text[i]);
		}
		draw_node(...params);
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
	for (var i=0; i<edges.length; i++) {
		let params = [edges[i][0], edges[i][1]]; //params array to get fed to draw method
		if (typeof colors == "object") {
			params.push(colors[i]);
		} else {
			params.push(colors);
		}
		if (typeof text == "object") {
			params.push(text[i]);
		}
		if (undirected) {
			draw_edge(...params);
		} else {
			draw_directed_edge(...params);
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
	context.beginPath();
	context.fillStyle = color;
	let min_x = node[0] - node_size;
	let min_y = node[1] - node_size;
	context.fillRect(min_x, min_y, node_size * 2, node_size * 2)
	if (typeof text != "undefined") {
		context.beginPath();
		context.font = (node_size * 3).toString() + "px Arial";
		context.textAlign = "center";
		context.fillText(text, node[0] - 3 * node_size, node[1] + node_size);
	}
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
*	optional: if typeof text != string: then edge tries to have text {text} attached using
*	default .toString, if fails, sorry, shoulda used a string
*	else: edge has no text
*/
function draw_edge(node1, node2, color, text) {
	context.beginPath();
	if (color == BLACK) {
		context.lineWidth = .2;
	} else {
		context.lineWidth = 2;
	}
	context.strokeStyle = color;
	context.moveTo(node1[0], node1[1]);
	context.lineTo(node2[0], node2[1]);
	context.stroke();
	if (typeof text != "undefined") {
		context.beginPath();
		context.font = (node_size * 3).toString() + "px Arial";
		context.textAlign = "center";
		context.fillText(
			text.toString(), Math.floor((node1[0] + node2[0])/2) - 10, 
			Math.floor((node1[1] + node2[1])/2)
		);
	}
}


function draw_directed_edge(node1, node2, color, text) {
	context.beginPath();
	if (color == BLACK) {
		context.lineWidth = .2;
	} else {
		context.lineWidth = 2;
	}
	context.strokeStyle = color;
	context.moveTo(node1[0], node1[1]);
	context.lineTo(node2[0], node2[1]);
	context.stroke();
	if (typeof text != "undefined") {
		context.beginPath();
		context.font = (node_size * 3).toString() + "px Arial";
		context.textAlign = "center";
		context.fillText(
			text.toString(), Math.floor((node1[0] + node2[0])/2) - 10, 
			Math.floor((node1[1] + node2[1])/2)
		);
	}
	let midpt = [((node1[0]+node2[0])/2), ((node1[1]+node2[1])/2)];
	let slope = (node1[1] - node2[1]) / (node1[0] - node2[0]);
	//draw arrow at midpoint


}

function clear_canvas() {
	context.clearRect(0,0,canvas.width, canvas.height);
	context.beginPath();
}

/*
* COLOR DEFINITIONS
*/
let BLACK = "#000000";
let RED = "#ff1c1c";
let BLUE = "#16a6ff";
let GREEN = "#28d67c";
let YELLOW = "#ffd11c";
let WHITE = "#FFFFFF";
let ORANGE = "#ff7c1e";

/**********			Option updates			**********/
/*
* Handle branching factor, depth slider, and start button updates
*/
branching_factor_update = function() {
	clear_canvas();
   	end_animation();
    branching_factor = branching_factor_element.valueAsNumber;
   	if (graph_type == "tree") {
   		if (branching_factor >= 3) {
   			depth_element.max = 8;
   			depth_element.value = depth = 5;
   		} 
   		if (branching_factor > 4) {
   			depth_element.max = 4;
   			depth_element.value = depth = 3;

   		} else {
   			depth_element.max = 10;
   		}
   		stretch_height = Math.floor((canvas.height - top_and_bottom_margin) / depth);
			
   	}
   	generate_nodes();
   	generate_edges();
   	draw_node_set(god_nodes, BLACK,);
   	draw_edge_set(god_edges, BLACK, god_weights);
}

depth_update = function() {
	clear_canvas();
   	end_animation();
    depth = depth_element.valueAsNumber;
    stretch_height = canvas.height / depth;
   	generate_nodes();
   	generate_edges();
   	draw_node_set(god_nodes, BLACK);
   	draw_edge_set(god_edges, BLACK, god_weights);
}

density_update = function() {
	clear_canvas();
   	end_animation();
    density = density_element.valueAsNumber;
    generate_edges();
    draw_edge_set(god_edges, BLACK);
    draw_node_set(god_nodes, BLACK, god_weights);
}

window_width_update = function() {
	clear_canvas();
   	end_animation();
	canvas.width = window_width_element.valueAsNumber;
   	generate_nodes();
   	generate_edges();
   	draw_node_set(god_nodes, BLACK);
   	draw_edge_set(god_edges, BLACK, god_weights);
}

node_size_update = function() {
	clear_canvas();
   	end_animation();
	node_size = node_size_element.valueAsNumber;
	draw_node_set(god_nodes, BLACK);
	draw_edge_set(god_edges, BLACK, god_weights);
	animate();
}

speed_update = function() {
   	end_animation();
	speed = 500 - speed_element.valueAsNumber;
	animate();
}

graph_type_update = function() {
	clear_canvas();
	for (var i =0;i<graph_type_elements.length; i++) {
		let option = graph_type_elements[i];
		if (option.checked) {
			graph_type = option.value;
		}
	}
	update_options();
	end_animation();
	generate_nodes();
	generate_edges();
	draw_node_set(god_nodes, BLACK,);
	draw_edge_set(god_edges, BLACK, god_weights, god_weights);
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
mini_start_button.addEventListener("click", minimax_animation, false);


let maxflow_start_button = document.getElementById("maxflow_start_button");
maxflow_start_button.addEventListener("click", maxflow_animation, false);

let graph_type_elements= document.getElementsByName("graph_type");
let graph_type = "tree";
for (var i =0;i<graph_type_elements.length; i++) {
	let option = graph_type_elements[i];
	if (option.checked) {
		graph_type = option.value;
	}
	option.addEventListener("change", graph_type_update, false);
}

let text_output = document.getElementById("text_output");

let new_graph_button = document.getElementById("new_graph");
new_graph_button.addEventListener("click", graph_type_update, false);

/**********			Option Muliplexers			**********/

function generate_nodes() {
	god_nodes.length = 0;
	switch(graph_type) {
		case "tree":
			generate_tree();
			break;
		case "random": 
			generate_random_graph();
			break;
		case "nice":
			generate_nice_graph();
			break;
		case "edge_weighted":
			generate_random_graph();
			break;
		default:
	}
}

function generate_edges() {
	god_edges.length = 0;
	god_weights.length = 0;
	god_rels.length = 0;
	switch(graph_type) {
		case "tree":
			generate_tree_edges();
			break;
		case "random": 
			generate_random_edge_set();
			break;
		case "nice":
			generate_random_edge_set();
			break;
		case "edge_weighted":
			generate_random_edge_set();
			generate_edge_weights();
			break;

		default:
	}
}

function bfs_animation() {
	end_animation();
	switch(graph_type) {
		case "tree":
			tree_bfs_animation();
			break;
		case "nice":
		case "random": 
			graph_bfs_animation();
			break;
		default:
	}
}

function dfs_animation() {
	end_animation();
	switch(graph_type) {
		case "tree":
			tree_dfs_animation();
			break;
		case "random": 
		case "nice":
			graph_dfs_animation();
			break;
		default:
	}
}

function minimax_animation() {
	end_animation();
	switch(graph_type) {
		case "tree":
			tree_minimax_animation();
			break;
		default:
	}
}

function maxflow_animation() {
	end_animation();
	switch(graph_type) {
		case "edge_weighted":
			ew_maxflow_animation();
	}
}

function update_options() {
	switch(graph_type) {
		case "tree":
			bfs_start_button.style.textDecoration = "none";
			dfs_start_button.style.textDecoration = "none";
			mini_start_button.style.textDecoration = "none";
			maxflow_start_button.style.textDecoration = "line-through";
			branching_factor_element.value = branching_factor = 2;
			depth_element.value = depth = 6;
			stretch_height = Math.floor((canvas.height - top_and_bottom_margin) / depth);
			depth_element.max = 10;
			branching_factor_element.max = 9;
			undirected = true;
			break;
		case "random":
			bfs_start_button.style.textDecoration = "none";
			dfs_start_button.style.textDecoration = "none";
			mini_start_button.style.textDecoration = "line-through";
			maxflow_start_button.style.textDecoration = "line-through";
			density_element.value = density = 2;
			depth_element.max = 25;
			branching_factor_element.max = 35;
			undirected = true;
			break;
		case "nice":
			bfs_start_button.style.textDecoration = "none";
			dfs_start_button.style.textDecoration = "none";
			mini_start_button.style.textDecoration = "line-through";
			maxflow_start_button.style.textDecoration = "line-through";
			density_element.value = density = 2;
			depth_element.max = 6;
			depth_element.value = depth = 2;
			branching_factor_element.value = branching_factor = 2;
			undirected = true;
			break;
		case "edge_weighted":
			bfs_start_button.style.textDecoration = "line-through";
			dfs_start_button.style.textDecoration = "line-through";
			mini_start_button.style.textDecoration = "line-through";
			maxflow_start_button.style.textDecoration = "none";
			density_element.value = density = 2;
			depth_element.max = 25;
			branching_factor_element.max = 35;
			undirected = true;
			break;
		case "network":
			bfs_start_button.style.textDecoration = "line-through";
			dfs_start_button.style.textDecoration = "line-through";
			mini_start_button.style.textDecoration = "line-through";
			maxflow_start_button.style.textDecoration = "none";
			density_element.value = density = 2;
			depth_element.max = 25;
			branching_factor_element.max = 35;
			undirected = false;
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

density_element.value = density = 2;
graph_type = "tree";

// load initial visual
window.onload = function() {
	update_options();
	generate_nodes();
	generate_edges();
	draw_node_set(god_nodes, BLACK);
	draw_edge_set(god_edges, BLACK, god_weights);
}