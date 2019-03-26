/*
* Main JS file for running the minimax/alpha beta pruning visualization
* Note: This is not a good way to write javascript or a fast
* way to implement these algorithms. This is just an educational
* Visualization
*
* Author: Dan Filler 3.19
*/

/**********			Global Variables			**********/
var canvas = document.getElementById("viewport"); 
var context = canvas.getContext("2d");

/* create list of node centers for graph */
let node_center_list = [];

/* list of edges of graph specified by order pair of indices in node_center_list */
let edges = [];

/*list of animations to be ended by end animations, this is a terrible way to do it*/
let bfs_animation_timer, dfs_animation_timer, minimax_animation_timer;


/**********			Main Graphics Engine			**********/
/* A basic Graphics Engine for animating and drawing graphs
* Comprised of generic functions that get populated by calls to specific animation functions
*/

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
function draw_nodes(nodes, colors, text) {
	context.clearRect(0,0,canvas.width, canvas.height);
	context.beginPath();
	//don't know why this broke when using a for/in loop, so I'm using this mess
	for(var i=0;i<nodes.length;i++) {
		let current_coord;
		let current_color;
		let current_text;
		if(typeof colors == "string") {

		}
	}
}

/* 
* Draws an edge set in a specified color set, with optional edge weights

* - edges:
*	set of ordered pairs [node1, node2] representing the edge of a graph spanning between
*	node1 and node2
* - colors:
* 	optional type: if typeof colors is array: then {edges[i]} is of color {edges[i]} 
*	for each 0 <= i < edges.length
*	otherwise if typeof colors is string: then the color of the {edges} representing all of
* 	{edges} is colors, usually a hex value.
* - text:
*	optional: if typeof text is array: then text[i] is attached to edges[i] for each 0 <= i < edges.length
*	otherwise if typeof text is undefined: then the text of the edge representing edges[i] has no text
*/
function draw_edge_set(edge_set, colors, text) {	
	context.lineWidth = .5;
	if (typeof colors == "array" || typeof text == "array") {
		//if each needs customization
		for (var i=0; i<edges.length; i++) {
			let node1 = edge_set[i][0];
			let node2 = edge_set[i][1];
			context.moveTo(node1[0], node1[1]);
			context.lineTo(node2[0], node2[1]);
			context.fillStyle = color;
			context.stroke();
		}
	}
}

/*
* Draws a square in color centered at center_x, center_y of side node_size x node_size
*
* - color:
*	string representing color in hex or rgba e.g. "#______" or "rgba{_,_,_,_}"
* - coord:
*	(int, int) pair representing coordinate of the center of the square to be drawn
*/
function draw_square(node, color, text) {
	context.fillStyle = color;
	let min_x = coord[0] - node_size;
	let min_y = coord[1] - node_size;
	context.clearRect(min_x, min_y, node_size * 2, node_size * 2)
	context.beginPath();
	context.fillRect(min_x, min_y, node_size * 2, node_size * 2)

	context.font = (node_size * 3).toString() + "px Arial";
	context.fillStyle = color;
	context.textAlign = "center";

	context.fillText(text, node[0] - 3 * node_size, node[1] + node_size);
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

/**********			Main Graphics Functions		**********/



function draw_square_with_text(color, text, node) {
	draw_square(color, node);
	
}

/* 
* Paints node_set in color
*  - nodes:
*		array specifiying set of nodes to be painted
*  - color:
*		rgba/hex value to paint nodes to
*/
function paint_set(color, nodes) {
	
}

/* 
* Paints node_set in color with text attached to nodes
*  - node_set:
*		array specifiying set of nodes to be painted and text
*  - color:
*		rgba/hex value to paint nodes to
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

/* determines which set of calls to make to generate a tree of the currently
* selected graph type.
*/
function draw_new_canvas() {
	switch(graph_type) {
	  case "tree":
		generate_new_tree();
	    break;
	  case "random":
	    generate_new_graph();
	    break;
	  default:
	    // code block
	}

    draw_nodes(BLACK, node_center_list);
    draw_edge_set(BLACK, edges);
}


/**********			Option updates			**********/

/*
* Handle branching factor, depth slider, and start button updates
*/
branching_factor_update = function() {
    branching_factor = branching_factor_element.valueAsNumber;
   	end_animations();
   	draw_new_canvas();
}

depth_update = function() {
    depth = depth_element.valueAsNumber;
    stretch_height = canvas.height / depth;
   	end_animations();
   	draw_new_canvas();
}

density_update = function() {
    density = density_element.valueAsNumber;
   	end_animations();
    generate_new_edge_set();
    draw_graph(BLACK, node_center_list);
    draw_edge_set(BLACK, edges);
}

window_width_update = function() {
	canvas.width = window_width_element.valueAsNumber;
   	end_animations();
   	draw_new_canvas();
}

node_size_update = function() {
	node_size = node_size_element.valueAsNumber;
   	end_animations();
   	draw_graph(BLACK, node_center_list);
}

speed_update = function() {
	speed = 500 - speed_element.valueAsNumber;
   	end_animations();
   	draw_graph(BLACK, node_center_list);
}

graph_type_update = function() {
	for (var i =0;i<graph_type_elements.length; i++) {
		let option = graph_type_elements[i];
		if (option.checked) {
			graph_type = option.value;
		}
	}
   	end_animations();
   	draw_new_canvas();
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

let graph_type_elements= document.getElementsByName("graph_type");
let graph_type = "tree";
for (var i =0;i<graph_type_elements.length; i++) {
	let option = graph_type_elements[i];
	if (option.checked) {
		graph_type = option.value;
	}
	option.addEventListener("change", graph_type_update, false);
}

/**********			Animation Button Handlers			**********/
function bfs_animation() {
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
	generate_new_tree();
	draw_tree(node_center_list);
}