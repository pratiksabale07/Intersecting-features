import React, { useRef, Suspense } from "react";
import { downHeadArrow, rightHeadarrow } from "../images/images";
const Display = React.lazy(() => import('./Display'));

const CountFeatures = ({ features, view }) => {
    const featuresListDivRef = useRef(null);
    const toogle = (event) => {
        if (featuresListDivRef.current.style.display === "none") {
            event.target.src = downHeadArrow
            featuresListDivRef.current.style.display = "block";
        } else {
            featuresListDivRef.current.style.display = "none";
            event.target.src = rightHeadarrow
        }
    };

    if (features.length)
        return (
            <>
                <div className="card-div">
                    <ul className="list-group">
                        <li className="list-group-item">
                            {features[0].layer.title}
                            <span className="badge bg-dark rounded-pill">
                                {features.length}
                            </span>
                            <img src={rightHeadarrow} onClick={toogle} alt="downarrow" />
                        </li>
                        <div ref={featuresListDivRef} className="featuresList-div" style={{ display: 'none' }}>
                            {features.map((feature, index) => {
                                return (
                                    <Suspense key={feature.uid} fallback={<div>loading...</div>}>
                                        <Display index={index} feature={feature} key={feature.uid} view={view} />
                                    </Suspense>
                                );
                            })}
                        </div>
                    </ul >
                </div >
            </>
        );
};

export default CountFeatures;
