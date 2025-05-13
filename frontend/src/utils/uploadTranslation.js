export async function uploadTranslation(editableJson, lang = "en") {
  try {
    // ✅ Convert JSON to a Blob (file-like object)
    const jsonBlob = new Blob([JSON.stringify(editableJson, null, 2)], {
      type: "application/json",
    });

    // ✅ Create FormData & attach the JSON file
    const formData = new FormData();
    formData.append("file", jsonBlob, "translation.json"); // ✅ Attach file
    formData.append("lang", lang); // ✅ Attach language

    // ✅ Send the request to backend
    const response = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json(); // Parse response JSON
    if (response.ok) {
      console.log("✅ Upload Success:", result);
      return { success: true, message: result.message };
    } else {
      console.error("❌ Upload Failed:", result);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error("❌ Error Uploading Translation:", error);
    return { success: false, error: error.message };
  }
}
