import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface DataItem {
  name: string;
  children?: DataItem[];
  value?: number;
}

interface SunburstChartProps {
  data: DataItem;
}

const SunburstChart: React.FC<SunburstChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const width = 932;
    const radius = width / 2;

    const arc = d3.arc<d3.HierarchyRectangularNode<DataItem>>()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius / 2)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1);

    const partition = d3.partition<DataItem>()
      .size([2 * Math.PI, radius]);

    const root = partition(d3.hierarchy(data)
      .sum(d => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0)));

    const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children ? data.children.length + 1 : 1));

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [-width / 2, -width / 2, width, width])
      .style("font", "10px sans-serif");

    svg.selectAll("*").remove();

    svg.append("g")
      .attr("fill-opacity", 0.6)
      .selectAll("path")
      .data(root.descendants().filter(d => d.depth))
      .join("path")
      .attr("fill", d => { while (d.depth > 1) d = d.parent!; return color(d.data.name); })
      .attr("d", arc as any)
      .append("title")
      .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${d.value?.toLocaleString()}`);

    svg.append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .attr("font-size", 10)
      .attr("font-family", "sans-serif")
      .selectAll("text")
      .data(root.descendants().filter(d => d.depth && (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10))
      .join("text")
      .attr("transform", function(d) {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
      })
      .attr("dy", "0.35em")
      .text(d => d.data.name);

  }, [data]);

  return (
    <svg ref={svgRef} width="100%" height="100%" style={{ maxWidth: '932px', margin: 'auto', display: 'block' }}></svg>
  );
};

export default SunburstChart;
