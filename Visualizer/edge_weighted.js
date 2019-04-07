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
* Entry at god_rels[i] is arrays of indexes (in god_nodes) of children of god_nodes[i]
*/
let god_weights = [];

function generate_edge_weights() {
	god_weights.length = 0;
	for(var i=0; i<god_edges.length; i++) {
		let edge_weight = Math.floor(Math.random() * 20).toString()
		//add random weight to array
		god_weights.push(edge_weight);
	}
}

/***************      GRAPH ANIMATIONS     ***************/

function ew_maxflow_animation() {

}