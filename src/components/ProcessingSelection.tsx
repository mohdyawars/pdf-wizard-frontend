interface ProcessingSelectionProps {
  selectedFeature: string;
  extractedText: string | null;
  loading: boolean;
}

const ProcessingSelection: React.FC<ProcessingSelectionProps> = ({
  selectedFeature,
  extractedText,
  loading,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mt-6">
      {selectedFeature === "text" && (
        <div className="text-gray-700">
          {loading ? (
            <p>⏳ Extracting text...</p>
          ) : extractedText ? (
            <pre className="whitespace-pre-wrap">{extractedText}</pre>
          ) : (
            <p>📜 Extracted text will appear here...</p>
          )}
        </div>
      )}
      {selectedFeature === "images" && (
        <p className="text-gray-700">
          🖼 Extracted images will be shown here...
        </p>
      )}
      {selectedFeature === "merge" && (
        <p className="text-gray-700">📂 Arrange and merge PDFs here...</p>
      )}
    </div>
  );
};

export default ProcessingSelection;
