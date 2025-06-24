import ReactJson from "react-json-view";

const JsonViewer = ({ data }) => {
    return (
        <div className="json-view-container vw-100 p-3 rounded">
            <ReactJson
                src={data}
                name="Result"
                displayDataTypes={false}
                displayObjectSize={true}
                enableClipboard={true}
                style={{ fontSize: "0.7rem" }}
                collapsed={1}
                indentWidth={4}
                iconStyle="triangle"
                collapseStringsAfterLength={50}
            />
        </div>
    );
};

export default JsonViewer;
