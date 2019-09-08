import React, { Component } from 'react'
import './App.css'
import { forceSimulation, forceCollide, forceLink, forceCenter } from 'd3-force'
import { select } from 'd3-selection'

class BipartiteGraph extends Component {
    constructor(props){
        super(props)
        this.createBipartiteGraph = this.createBipartiteGraph.bind(this)
    }

    componentDidMount() {
        this.createBipartiteGraph()
    }

    componentDidUpdate() {
        this.createBipartiteGraph()
    }

    createBipartiteGraph() {
        const node = this.node
        const links = this.props.data.links.map(d => Object.create(d));
        const nodes = this.props.data.nodes.map(d => Object.create(d));
        const orientation = this.props.orientation
        const displaySize = this.props.size

        node.attr('class', 'bipartite')

        const simulation = forceSimulation(nodes)
            .force("link", forceLink(links).id(d => d.name))
            .force("collide", forceCollide(15).iterations(16) )
            .force("center", forceCenter(this.props.size[0]/2, this.props.size[1]/2))
    
        const link = select(node).append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll(".bipartite line")
            .data(links)
            .join("line")
            .attr("stroke", "black")

        const circle = select(node).append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll(".bipartite circle")
            .data(nodes)
            .join("circle")
            .attr("r", 10)
            .attr("fill", d => d.nodeLabel === "Person" ? "orange" : "lightblue")
            .each(function(d, i){
                if(orientation === "horizontal"){
                    d.fy = d.nodeLabel === "Person" ? displaySize[1]/3:displaySize[1]*2/3}
                else{
                    d.fx = d.nodeLabel === "Person" ? displaySize[0]/3:displaySize[0]*2/3}
            })
            .append("title")
            .text(d => d.name)
            ;
    
            simulation.on("tick", () => {
                link
                    .attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y);
            
                circle
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y);
              });

   
    }

render(){
    return <svg ref={node => this.node = node}
    width = {this.props.size[0]} height={this.props.size[1]}>        
    </svg>
} 
}

export default BipartiteGraph