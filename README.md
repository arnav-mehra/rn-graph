Available Components:

1. Graph

    Props:
        vertices! = {
            id!:        string | number     [unique identifier],
            style:      number              [idx of style preset. (default = 0)],
            ...
        }
        edges! = {
            from!:      string | number     [id of from vertex],
            to!:        string | number     [id of to vertex],
            directed!:  boolean             [0 = not directed, 1 = directed, 2 = bidirectional],
            style:      number              [idx of style preset (default = 0)],
            label:      string | number     [label displayed on edge],
            ...
        }
        settings = {
            static:     boolean             [true = non-moveable graph, false = moveable graph. (default = false)],
            fps:        number              [refreshes per second. only matters if static = false. (default = 480)]
        }
        styles = {
            frame:      object              [styled applied to outer frame/window of graph],
            vertexStylePresets: {           [array of vertex style objects]
                size:   number              [radius of vertex. currently only circular shapes are supported],
                ...
            }[],
            edgeStylePresets: {             [array of edge style objects]
                label:  object              [styles applied to label text. (default = { fontSize: 12, color: 'black', weight: 'normal' })],
                arrow: {
                    size:   number          [size of the arrow. (default = 12)],
                    color:  string          [color of the arrow. (default = 'black')],
                    width:  number          [width of the arrow. (default = 2)],
                    fill:   string          [fill of the arrow. (default = 'white')]
                },
                line: {
                    color:  string          [color of the line. (default = 'black')],
                    width:  number          [width of the line. (default = 2)]
                },
                ...
            }[],
        }
        VertexComponent! = (vert, preset_style_object) => React.JSX.element
                                            [define vertex rendering component.]

2. ExampleGraph

    Props:
        None