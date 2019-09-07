import React, { Component } from 'react'
import './App.css'
import { forceSimulation, forceCollide, forceLink, forceCenter, forceManyBody } from 'd3-force'
import { select, event } from 'd3-selection'
import { drag } from 'd3-drag'

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
        const links = this.props.data.links.map(d => Object.create(d));
        const nodes = this.props.data.nodes.map(d => Object.create(d));
        const displaySize = this.props.size;
        const svg = d3.create("svg")
            .attr("viewBox", [0, 0, displaySize[0], displaySize[1]]);

        const simulation = forceSimulation(nodes)
        .force("link", forceLink(links).id(d => d.name))
        .force("charge", forceManyBody())
        .force("center", forceCenter(displaySize[0] / 2, displaySize[1] / 2));
  
  
    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
        .attr("stroke-width", d => Math.sqrt(d.topicCount));
  
    const circle = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
        .attr("r", 5)
        .attr("fill", "lightblue")
        .call(drag(simulation));
  
    circle.append("title")
        .text(d => d.name);
  
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

export default ForceGraph