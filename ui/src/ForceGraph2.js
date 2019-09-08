import React, { Component } from 'react'
import './App.css'
import { forceSimulation, forceLink, forceCollide, forceCenter, forceManyBody } from 'd3-force'
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
        const node = this.node
        const links = this.props.data.links.map(d => Object.create(d));
        const nodes = this.props.data.nodes.map(d => Object.create(d));
        const displaySize = this.props.size;

        const simulation = forceSimulation(nodes)
        .force("link", forceLink(links).id(d => d.name))
        .force("charge", forceManyBody().strength(-200))
        .force("collide", forceCollide(27).iterations(16) )
        .force("center", forceCenter(displaySize[0] / 2, displaySize[1] / 2));

    select(node).attr('class', 'force')
  
    const link = select(node).append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
      .selectAll(".force line")
      .data(links)
      .join("line")
        .attr("stroke-width", d => d.commonalityCount);
  
    const circle = select(node).append("g")
        .selectAll(".force g")
        .data(nodes)
        .join("g");
    
     circle.append("circle")
        .attr("r", 25)
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .attr("fill", d => d.nodeLabel === "Person" ? "orange" : "lightblue")
        .call(dragging(simulation));

    circle.append("title")
        .text(d => d.name);


    var text = circle.append("text");

    text.selectAll("tespan.text")
        .data(d => d.name.split(" "))
        .enter()
        .append("tspan")
        .attr("class", "text")
        .text(d => d)
        .attr("text-anchor", "middle")


    simulation.on("tick", () => {
      link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);
  
      circle
          .attr("transform", d => "translate("+ d.x + "," + d.y + ")");
    });

    function dragging(simulation) {
  
        function dragstarted(d) {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }
        
        function dragged(d) {
          d.fx = event.x;
          d.fy = event.y;
        }
        
        function dragended(d) {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }
        
        return drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
      }
  
  
  }

render(){
    return <svg ref={node => this.node = node}
    width = {this.props.size[0]} height={this.props.size[1]}>        
    </svg>
} 
}

export default ForceGraph