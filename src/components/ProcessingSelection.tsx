interface ProcessingSelectionProps {
  selectedFeature: string;
  extractedText: string | null;
  extractedImages: string[];
  loading: boolean;
}

const ProcessingSelection: React.FC<ProcessingSelectionProps> = ({
  selectedFeature,
  extractedText,
  extractedImages,
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
        <div className="text-gray-700">
          {loading ? (
            <p>⏳ Extracting images...</p>
          ) : extractedImages.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {extractedImages.map((imageUrl, index) => (
                <img key={index} src={imageUrl} alt={`Extracted Image ${index + 1}`} className="w-32 h-32 object-contain rounded-lg shadow-md border border-gray-300" />
              ))}
            </div>
          ) : (
            <p>🖼 Extracted images will be shown here...</p>
          )}
        </div>
      )}

      {selectedFeature === "merge" && (
        <p className="text-gray-700">📂 Arrange and merge PDFs here...</p>
      )} </div>);
}; export default ProcessingSelection;
