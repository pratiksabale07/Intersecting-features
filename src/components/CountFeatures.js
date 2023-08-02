import React, { useRef, Suspense, useState } from "react";
import { downHeadArrow, rightHeadarrow } from "../images/images";
const Display = React.lazy(() => import('./Display'));

const CountFeatures = ({ features, view }) => {
    const [featureListDiv, setFeaturesListDiv] = useState(false)
    const featuresListDivRef = useRef(null);
    const toogle = (event) => {
        if (event.target.src === rightHeadarrow) {
            event.target.src = downHeadArrow
        }
        else {
            event.target.src = rightHeadarrow
        }
        setFeaturesListDiv(!featureListDiv)
    };

    if (features.length)
        return (
            <>
                <div className="card-div">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                            {features[0].layer.title}
                            <span className="badge bg-dark rounded-pill">
                                {features.length}
                            </span>
                            <img src={rightHeadarrow} onClick={toogle} alt="downarrow" />
                        </li>
                        {featureListDiv && <div ref={featuresListDivRef} className="featuresList-div">
                            {features.map((feature, index) => {
                                return (
                                    <Suspense key={feature.uid} fallback={<div>loading...</div>}>
                                        <Display index={index} feature={feature} key={feature.uid} view={view} />
                                    </Suspense>
                                );
                            })}
                        </div>}
                    </ul >
                </div >
            </>
        );
};

export default CountFeatures;
