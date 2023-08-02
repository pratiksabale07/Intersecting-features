import React, { useEffect, useRef } from "react";
import { downHeadArrow, rightHeadarrow } from "../images/images";
import { loadModules } from "esri-loader";

const Display = ({ view, feature, index }) => {
    const graphicRef = useRef(null)
    const listItemRef = useRef(null)
    const containerRef = useRef(null)

    const toogle = (event) => {
        if (containerRef.current.style.display === "none") {
            event.target.src = downHeadArrow
            containerRef.current.style.display = "block";
            graphicRef.current.visible = true
        } else {
            containerRef.current.style.display = "none";
            event.target.src = rightHeadarrow
            graphicRef.current.visible = false
        }
    };
    useEffect(() => {
        if (view) {
            loadModules(["esri/widgets/Feature", "esri/Graphic"], { css: true }).then
                (([Feature, Graphic]) => {
                    const container = document.createElement('div')
                    container.style.display = 'none'
                    containerRef.current = container
                    listItemRef.current.appendChild(container)
                    const featureWidget = new Feature({
                        container: container,
                        graphic: feature,
                        defaultPopupTemplateEnabled: true
                    });
                    const graphic = new Graphic({
                        geometry: feature.geometry,
                        symbol: {
                            type: 'simple-marker',
                            size: '25px',
                            outline: {
                                color: [255, 255, 0],
                                width: 1
                            }
                        },
                        visible: false
                    });
                    view.graphics.add(graphic)
                    graphicRef.current = graphic

                }).catch((err) => { console.log(err); })
        }
    }, []);
    return (
        <li ref={listItemRef} className="list-group-item">
            {index}
            <img onClick={toogle}
                src={rightHeadarrow}
                alt="downarrow"
            />
        </li>
    );
};

export default Display;
