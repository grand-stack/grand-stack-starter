import React, { Component } from 'react'
import './App.css'
import { forceSimulation, forceCollide, forceLink, forceCenter, forceX, forceY } from 'd3-force'
import { select } from 'd3-selection'

class ForceGraph extends Component {
    constructor(props){
        super(props)
        this.createForceGraph = this.createForceGraph.bind(this)
    }

    componentDidMount() {
        this.createForceGraph()
    }

    componentDidUpdate() {
        this.createForceGraph()
    }

    createForceGraph() {
        const node = this.node
        var simulation = forceSimulation()
        .force("link", forceLink().id(function(d) { return d.name }))
        .force("collide", forceCollide( function(d){return 15 }).iterations(16) )
        .force("center", forceCenter(this.props.size[0]/2, this.props.size[1]/2))
        .force("y", forceY(0))
        .force("x", forceX(0))

    select(node)
        .selectAll("line")
        .data(this.props.data.links)
        .enter()
        .append("line")
    
    select(node)
        .selectAll("line")
        .data(this.props.data.links)
        .exit()
        .remove()
        
    var lines = select(node)
        .selectAll("line")
        .data(this.props.data.links)
        .attr("stroke", "black")
    

    var main_node = select(node)

    var datanodes = main_node.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(this.props.data.nodes)
        .enter()
        .append("g")

    datanodes.append("circle")
        .attr("r", 10)
        .style("fill", function(d){
            return d.nodeLabel === "Person" ? "orange" : "lightblue"
        })


    datanodes.append("text")
        .text(function(d) {
            return d.name
        })
        .attr('x',  d => d.nodeLabel ==="Person"?-10:10)
        .attr("text-anchor", "middle")
    
    datanodes.append("title")
        .text(function(d){
            return d.name
        })

    var ticked = function() {
        lines
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        datanodes
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
          })
        } 

    simulation
        .nodes(this.props.data.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(this.props.data.links);    
    }

render(){
    return <svg ref={node => this.node = node}
    width = {this.props.size[0]} height={this.props.size[1]}>        
    </svg>
} 
}

export default ForceGraph