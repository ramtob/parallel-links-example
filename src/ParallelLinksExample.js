let d3 = Object.assign({},
    require('d3'),
    require('d3-parallel-links'));

export default class ParallelLinksExample {

    constructor(containerId) {

        let container = document.getElementById(containerId);

        let that = this;

        let MARGIN = 10,
            VIEW_WIDTH = Math.min(container.offsetHeight, container.offsetWidth) - 2 * MARGIN,
            HEIGHT = VIEW_WIDTH,
            WIDTH = VIEW_WIDTH,
            MAX_ALPHA = 1.0
        ;

        // this.LINK_WIDTH = 2;

        // Define the data for the visualization.

        let graph = {
            "nodes": [{}, {}],
            "links": [{
                "target": 1,
                "source": 0,
                color: "blue"
            }, {
                "target": 1,
                "source": 0,
                color: "red"
            }, {
                "target": 1,
                "source": 0,
                color: "green"
            }, {
                "target": 1,
                "source": 0,
                color: "orange"
            }]
        };

        // Create an SVG container to hold the visualization

        let svg = d3.select(container)
            .append('svg')
            .classed('example-svg', true)
            .attr('width', WIDTH)
            .attr('height', HEIGHT);

        // Extract the nodes and links from the data.
        this.nodes = graph.nodes;
        this.links = graph.links;

        d3.parallelLinksInitLinks(this.links);
//        this.prepareLinks();

        // Create a force layout object

        this.simulation = d3.forceSimulation()
            // .size([WIDTH, HEIGHT])
            // .links(this.links)
            // .linkDistance(WIDTH / 3.5)
        ;

        // set simulation related api's
        this.stop = () => {this.simulation.stop()};
        this.restart = () => {this.simulation.restart()};

        // Center-around force
        let forceCenter = d3.forceCenter(WIDTH / 2, HEIGHT / 2);
        this.simulation.force("center", forceCenter);

        // Add nodes to the simulation
        this.simulation.nodes(this.nodes);

        // Add links (with link force) to the simulation
        let linkForce = d3.forceLink(this.links).id(function (d, i) {
            return i;
        });
        linkForce.distance(WIDTH / 3.5);
        this.simulation.force("link", linkForce);

        // var drag = force.drag();

        // Draw the links

        let link = svg.selectAll('.link')
            .data(this.links)
            .enter()
            .append('line')
            .classed('example-link', true);

        // Draw the nodes

        let node = svg.selectAll('.node')
                .data(this.nodes)
                .enter()
                .append('circle')
                .classed('example-node', true)
                .attr('r', WIDTH / 30)
            // .call(drag)
        ;

        d3.parallelLinksSetMethodExact();
        // this.setCalculationExact(true);

        // Start the force simulation
        // force.start();

        /**
         * @decription tick event listener
         */
        this.simulation.on('tick', function () {
            // Add some randomization to node location, for fun.
            node
                .attr('cx', function (d) {
                    let rand = Math.floor(Math.random() * 3) - 1;
                    return d.x += rand;
                })
                .attr('cy', function (d) {
                    let rand = Math.floor(Math.random() * 3) - 1;
                    return d.y += rand;
                });

            link
                .attr('x1', function (d) {
                    return d.source.x;
                })
                .attr('y1', function (d) {
                    return d.source.y;
                })
                .attr('x2', function (d) {
                    return d.target.x;
                })
                .attr('y2', function (d) {
                    return d.target.y;
                })
                .attr('stroke', function (d) {
                    return d.color;
                })
                .attr('transform', d3.parallelLinksTransform)
                // .attr('transform', function (d) {
                //     var translation = that.calcTranslation(d.targetDistance, d.source, d.target);
                //     return `translate (${translation.dx}, ${translation.dy})`;
                // })
            ;
        });

        /**
         * @description
         * Make the demo simulation permanent, by resuming it when it ends.
         */
        this.simulation.on('end', () => {
            this.simulation.alpha(MAX_ALPHA)
                .restart()
            // force.resume()
            ;
        });
    }

    /**
     * @param {number} targetDistance
     * @param {x,y} point0
     * @param {x,y} point1, two points that define a line segmemt
     * @returns
     * a translation {dx,dy} from the given line segment, such that the distance
     * between the given line segment and the translated line segment equals
     * targetDistance
     */
    /*static calcTranslationExact(targetDistance, point0, point1) {
        var x1_x0 = point1.x - point0.x,
            y1_y0 = point1.y - point0.y,
            x2_x0, y2_y0;
        if (y1_y0 === 0) {
            x2_x0 = 0;
            y2_y0 = targetDistance;
        } else {
            var angle = Math.atan((x1_x0) / (y1_y0));
            x2_x0 = -targetDistance * Math.cos(angle);
            y2_y0 = targetDistance * Math.sin(angle);
        }
        return {
            dx: x2_x0,
            dy: y2_y0
        };
    }*/

    /**
     * @param {number} targetDistance
     * @param {x,y} point0
     * @param {x,y} point1, two points that define a line segmemt
     * @returns
     * a translation {dx,dy} from the given line segment, such that the distance
     * between the given line segment and the translated line segment satisfies
     * the condition: targetDistance < distance < 1.42 * targetDistance
     */
    /*static calcTranslationApproximate(targetDistance, point0, point1) {
        var x1_x0 = point1.x - point0.x,
            y1_y0 = point1.y - point0.y,
            x2_x0, y2_y0;
        if (targetDistance === 0) {
            x2_x0 = y2_y0 = 0;
        } else if (y1_y0 === 0 || Math.abs(x1_x0 / y1_y0) > 1) {
            y2_y0 = -targetDistance;
            x2_x0 = targetDistance * y1_y0 / x1_x0;
        } else {
            x2_x0 = targetDistance;
            y2_y0 = targetDistance * (-x1_x0) / y1_y0;
        }
        return {
            dx: x2_x0,
            dy: y2_y0
        };
    }*/

    /**
     * @description
     * Select calculation method: exact or approximate.
     * @param {boolean} on Set exact calculation
     */
/*
    setCalculationExact(on) {
        this.calcTranslation =
            (on ? ParallelLinksExample.calcTranslationExact :
                ParallelLinksExample.calcTranslationApproximate);
    }
*/

    /**
     * @description
     * Build an index to help handle the case of multiple links between two nodes
     */
   /* prepareLinks() {
        var that = this,
            linksFromNodes = {};
        this.links.forEach(function (val, idx) {
            var sid = val.source,
                tid = val.targetID,
                key = (sid < tid ? sid + "," + tid : tid + "," + sid);
            if (linksFromNodes[key] === undefined) {
                linksFromNodes[key] = [idx];
                val.multiIdx = 1;
            } else {
                val.multiIdx = linksFromNodes[key].push(idx);
            }
            // Calculate target link distance, from the index in the multiple-links array:
            // 1 -> 0, 2 -> 2, 3-> -2, 4 -> 4, 5 -> -4, ...
            val.targetDistance = (val.multiIdx % 2 === 0 ? val.multiIdx * that.LINK_WIDTH : (-val.multiIdx + 1) * that.LINK_WIDTH);
        });
    }*/

}